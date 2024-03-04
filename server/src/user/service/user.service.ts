import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserDto } from "../dto/user.dto";
import { User } from "../model/user.model";
import { InjectModel } from "@nestjs/sequelize";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { MailService } from "./mail.service";
import { TokenService } from "./token.service";
@Injectable()
export class UserService {
	constructor(
		@InjectModel(User) private userRepository: typeof User,
		private mailService: MailService,
		private tokenService: TokenService
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

		return {
			...tokens,
			user: userDto,
		};
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
