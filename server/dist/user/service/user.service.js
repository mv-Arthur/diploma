"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_dto_1 = require("../dto/user.dto");
const user_model_1 = require("../model/user.model");
const sequelize_1 = require("@nestjs/sequelize");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const mail_service_1 = require("./mail.service");
const token_service_1 = require("./token.service");
let UserService = class UserService {
    constructor(userRepository, mailService, tokenService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.tokenService = tokenService;
    }
    async registration(email, password) {
        const candidate = await this.userRepository.findOne({ where: { email: email } });
        if (candidate) {
            throw new common_1.HttpException("пользователь с таким email уже существует", common_1.HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = (0, uuid_1.v4)();
        const activationLinkAdmin = (0, uuid_1.v4)();
        const user = await this.userRepository.create({
            email: email,
            password: hashPassword,
            activationLink: activationLink,
            activationLinkAdmin: activationLinkAdmin,
        });
        await this.mailService.sendActivationMail(email, `${process.env.API_URL}/user/activate/${activationLink}`);
        await this.mailService.sendActivationAdminMail(process.env.EMAIL_ADMIN, `${process.env.API_URL}/user/activate/admin/${activationLinkAdmin}`, user.email);
        const userDto = new user_dto_1.UserDto(user);
        const tokens = this.tokenService.generateToken({ ...userDto });
        await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        };
    }
    async activate(activationLink) {
        const user = await this.userRepository.findOne({
            where: {
                activationLink: activationLink,
            },
        });
        if (!user) {
            throw new common_1.HttpException("пользователь не найден", common_1.HttpStatus.BAD_REQUEST);
        }
        user.isActivated = true;
        user.save();
    }
    async activateAdmin(activationLinkAdmin) {
        const admin = await this.userRepository.findOne({
            where: { activationLinkAdmin: activationLinkAdmin },
        });
        if (!admin) {
            throw new common_1.HttpException("пользователь не найден", common_1.HttpStatus.BAD_REQUEST);
        }
        admin.role = "admin";
        admin.save();
    }
    async login(email, password) {
        const user = await this.userRepository.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new common_1.HttpException("пользователь не найден", common_1.HttpStatus.BAD_REQUEST);
        }
        const isPasswordsEquals = await bcrypt.compare(password, user.password);
        if (!isPasswordsEquals) {
            throw new common_1.HttpException("не верный пароль", common_1.HttpStatus.BAD_REQUEST);
        }
        const userDto = new user_dto_1.UserDto(user);
        const tokens = this.tokenService.generateToken({ ...userDto });
        await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        };
    }
    async logout(refreshToken) {
        const token = await this.tokenService.removeToken(refreshToken);
        return token;
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException({ message: "пользователь не авторизован" });
        }
        const userData = this.tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = this.tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw new common_1.UnauthorizedException({ message: "пользователь не авторизован" });
        }
        const user = await this.userRepository.findOne({
            where: userData.id,
        });
        const userDto = new user_dto_1.UserDto(user);
        const tokens = this.tokenService.generateToken({ ...userDto });
        await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        };
    }
    async getUsers() {
        const users = await this.userRepository.findAll();
        return users.map((el) => new user_dto_1.UserDto(el));
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object, mail_service_1.MailService,
        token_service_1.TokenService])
], UserService);
//# sourceMappingURL=user.service.js.map