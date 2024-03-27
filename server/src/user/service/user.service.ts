import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserDto } from "../dto/user.dto";
import { User } from "../model/user.model";
import { InjectModel } from "@nestjs/sequelize";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { MailService } from "./mail.service";
import { TokenService } from "./token.service";
import { Vapid } from "../model/vapid.model";
import * as webPush from "web-push";
import { PushSubscription } from "../user.controller";
import { Keys } from "../model/keys.model";
import { Subscription } from "../model/subscription.model";
import { Personal } from "../model/personal.model";
import { OrderService } from "./order.service";
import { join } from "path";
import { rename } from "fs";
import { PersonalDto } from "../dto/personalCreation.dto";
import { BotService } from "./bot.service";
@Injectable()
export class UserService {
	constructor(
		@InjectModel(User) private userRepository: typeof User,
		private mailService: MailService,
		private tokenService: TokenService,
		private orderService: OrderService,
		@InjectModel(Vapid) private vapidRepository: typeof Vapid,
		@InjectModel(Keys) private keysRepository: typeof Keys,
		@InjectModel(Subscription) private subsciptionRepository: typeof Subscription,
		@InjectModel(Personal) private personalRepository: typeof Personal,
		private botService: BotService
	) {}

	_ = this.botService.start();

	async registration(email: string, password: string) {
		const candidate = await this.userRepository.findOne({ where: { email: email } });
		if (candidate) {
			throw new HttpException(
				"пользователь с таким email уже существует",
				HttpStatus.BAD_REQUEST
			);
		}
		const hashPassword = await bcrypt.hash(password, 3);
		const activationLink = uuidv4();
		const activationLinkAdmin = uuidv4();
		const user = await this.userRepository.create({
			email: email,
			password: hashPassword,
			activationLink: activationLink,
			activationLinkAdmin: activationLinkAdmin,
		});

		await this.mailService.sendActivationMail(
			email,
			`${process.env.API_URL}/user/activate/${activationLink}`
		);

		const users = await this.userRepository.findAll();

		await this.botService.sendActivationAdmin(activationLinkAdmin);

		const userDto = new UserDto(user);
		const tokens = this.tokenService.generateToken({ ...userDto });
		await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

		const twins = webPush.generateVAPIDKeys();
		await this.vapidRepository.create({
			userId: userDto.id,
			publicKey: twins.publicKey,
			privateKey: twins.privateKey,
		});

		const personal = await this.personalRepository.create({
			name: "",
			surname: "",
			phoneNumber: "",
			patronymic: "",
			userId: userDto.id,
			avatar: "",
		});

		const personalDto = new PersonalDto(personal);

		return {
			...tokens,
			user: userDto,
			personal: personalDto,
		};
	}

	async subscribe(sub: PushSubscription, id: number) {
		const subscription = await this.subsciptionRepository.create({
			endpoint: sub.endpoint,
			expirationTime: sub.expirationTime,
			userId: id,
		});
		const keys = await this.keysRepository.create({
			p256dh: sub.keys.p256dh,
			auth: sub.keys.auth,
			subscriptionId: subscription.id,
		});
	}

	async resubscribe(sub: PushSubscription, id: number) {
		const subscription = await this.subsciptionRepository.findOne({
			where: {
				userId: id,
			},
		});

		const keys = await this.keysRepository.findOne({
			where: {
				subscriptionId: subscription.id,
			},
		});

		subscription.endpoint = sub.endpoint;
		subscription.expirationTime = sub.expirationTime;
		await subscription.save();

		keys.p256dh = sub.keys.p256dh;
		keys.auth = sub.keys.auth;

		await keys.save();
	}

	async unsubscribe(id: number) {
		const subscription = await this.subsciptionRepository.findOne({
			where: {
				userId: id,
			},
			include: {
				all: true,
			},
		});
		if (!subscription) {
			throw new HttpException("подписка не найдена", HttpStatus.BAD_REQUEST);
		}

		return subscription;
	}

	async getPushKey(id: number) {
		const keys = await this.vapidRepository.findOne({
			where: { userId: id },
		});
		if (!keys) throw new HttpException("ключи не найдены", HttpStatus.BAD_REQUEST);
		return keys.publicKey;
	}

	async activate(activationLink: string) {
		const user = await this.userRepository.findOne({
			where: {
				activationLink: activationLink,
			},
		});

		if (!user) {
			throw new HttpException("пользователь не найден", HttpStatus.BAD_REQUEST);
		}

		user.isActivated = true;
		user.save();
	}

	async activateAdmin(activationLinkAdmin: string) {
		const admin = await this.userRepository.findOne({
			where: { activationLinkAdmin: activationLinkAdmin },
		});
		if (!admin) {
			throw new HttpException("пользователь не найден", HttpStatus.BAD_REQUEST);
		}
		admin.role = "admin";
		admin.save();
	}

	async login(email: string, password: string) {
		const user = await this.userRepository.findOne({
			where: {
				email: email,
			},
		});

		if (!user) {
			throw new HttpException("пользователь не найден", HttpStatus.BAD_REQUEST);
		}

		const isPasswordsEquals = await bcrypt.compare(password, user.password);
		if (!isPasswordsEquals) {
			throw new HttpException("не верный пароль", HttpStatus.BAD_REQUEST);
		}

		const userDto = new UserDto(user);

		const tokens = this.tokenService.generateToken({ ...userDto });
		await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
		const personal = await this.personalRepository.findOne({
			where: {
				userId: userDto.id,
			},
		});
		const personalDto = new PersonalDto(personal);
		return {
			...tokens,
			user: userDto,
			personal: personalDto,
		};
	}

	async logout(refreshToken: string) {
		const token = await this.tokenService.removeToken(refreshToken);
		return token;
	}

	async refresh(refreshToken: string) {
		if (!refreshToken) {
			throw new UnauthorizedException({ message: "пользователь не авторизован" });
		}

		const userData = this.tokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = this.tokenService.findToken(refreshToken);

		if (!userData || !tokenFromDb) {
			throw new UnauthorizedException({ message: "пользователь не авторизован" });
		}

		const user = await this.userRepository.findOne({
			where: userData.id,
		});
		const userDto = new UserDto(user);
		const tokens = this.tokenService.generateToken({ ...userDto });
		await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
		const personal = await this.personalRepository.findOne({
			where: {
				userId: userDto.id,
			},
		});
		const personalDto = new PersonalDto(personal);

		return {
			...tokens,
			user: userDto,
			personal: personalDto,
		};
	}

	async setName(userId: number, name: string) {
		const personal = await this.personalRepository.findOne({
			where: {
				userId,
			},
		});

		if (!personal) throw new HttpException("пользователь не найден", HttpStatus.BAD_REQUEST);

		personal.name = name;
		await personal.save();
		return personal.name;
	}

	async setSurname(userId: number, surname: string) {
		const personal = await this.personalRepository.findOne({
			where: {
				userId,
			},
		});

		if (!personal) throw new HttpException("пользователь не найден", HttpStatus.BAD_REQUEST);

		personal.surname = surname;
		await personal.save();
		return personal.surname;
	}

	async setPatronymic(userId: number, patronymic: string) {
		const personal = await this.personalRepository.findOne({
			where: {
				userId,
			},
		});

		if (!personal) throw new HttpException("пользователь не найден", HttpStatus.BAD_REQUEST);

		personal.patronymic = patronymic;
		await personal.save();
		return personal.patronymic;
	}

	async phoneNumber(userId: number, phoneNumber: string) {
		const personal = await this.personalRepository.findOne({
			where: {
				userId,
			},
		});

		if (!personal) throw new HttpException("пользователь не найден", HttpStatus.BAD_REQUEST);

		personal.phoneNumber = phoneNumber;
		await personal.save();
		return personal.phoneNumber;
	}

	async setAvatar(userId: number, file: Express.Multer.File) {
		const extention = this.orderService.getExtension(file.originalname);
		const fileName = uuidv4() + `.${extention}`;
		const filePath = join(__dirname, "..", "uploads", fileName);
		if (extention) {
			rename(file.path, filePath, (err) => {
				if (err) {
					console.error(err);
					throw new HttpException("ошибка при чтении файла", HttpStatus.BAD_REQUEST);
				}
				console.log(`переименован успешно`);
			});
		}

		const personal = await this.personalRepository.findOne({
			where: {
				userId,
			},
		});

		if (!personal) throw new HttpException("пользователь не найден", HttpStatus.BAD_REQUEST);

		personal.avatar = fileName;

		personal.save();

		return personal.avatar;
	}
}
