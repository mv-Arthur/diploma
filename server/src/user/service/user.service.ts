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
@Injectable()
export class UserService {
	constructor(
		@InjectModel(User) private userRepository: typeof User,
		private mailService: MailService,
		private tokenService: TokenService,
		@InjectModel(Vapid) private vapidRepository: typeof Vapid,
		@InjectModel(Keys) private keysRepository: typeof Keys,
		@InjectModel(Subscription) private subsciptionRepository: typeof Subscription
	) {}
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

		await this.mailService.sendActivationAdminMail(
			process.env.EMAIL_ADMIN,
			`${process.env.API_URL}/user/activate/admin/${activationLinkAdmin}`,
			user.email
		);

		const userDto = new UserDto(user);
		const tokens = this.tokenService.generateToken({ ...userDto });
		await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

		const twins = webPush.generateVAPIDKeys();
		await this.vapidRepository.create({
			userId: userDto.id,
			publicKey: twins.publicKey,
			privateKey: twins.privateKey,
		});

		return {
			...tokens,
			user: userDto,
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

		return {
			...tokens,
			user: userDto,
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

		return {
			...tokens,
			user: userDto,
		};
	}
}
