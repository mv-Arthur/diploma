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
const vapid_model_1 = require("../model/vapid.model");
const webPush = require("web-push");
const keys_model_1 = require("../model/keys.model");
const subscription_model_1 = require("../model/subscription.model");
const personal_model_1 = require("../model/personal.model");
const order_service_1 = require("./order.service");
const path_1 = require("path");
const fs_1 = require("fs");
const personalCreation_dto_1 = require("../dto/personalCreation.dto");
const bot_service_1 = require("./bot.service");
let UserService = class UserService {
    constructor(userRepository, mailService, tokenService, orderService, vapidRepository, keysRepository, subsciptionRepository, personalRepository, botService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.tokenService = tokenService;
        this.orderService = orderService;
        this.vapidRepository = vapidRepository;
        this.keysRepository = keysRepository;
        this.subsciptionRepository = subsciptionRepository;
        this.personalRepository = personalRepository;
        this.botService = botService;
        this._ = this.botService.start();
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
        const users = await this.userRepository.findAll();
        await this.botService.sendActivationAdmin(activationLinkAdmin);
        const userDto = new user_dto_1.UserDto(user);
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
        const personalDto = new personalCreation_dto_1.PersonalDto(personal);
        return {
            ...tokens,
            user: userDto,
            personal: personalDto,
        };
    }
    async subscribe(sub, id) {
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
    async resubscribe(sub, id) {
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
    async unsubscribe(id) {
        const subscription = await this.subsciptionRepository.findOne({
            where: {
                userId: id,
            },
            include: {
                all: true,
            },
        });
        if (!subscription) {
            throw new common_1.HttpException("подписка не найдена", common_1.HttpStatus.BAD_REQUEST);
        }
        return subscription;
    }
    async getPushKey(id) {
        const keys = await this.vapidRepository.findOne({
            where: { userId: id },
        });
        if (!keys)
            throw new common_1.HttpException("ключи не найдены", common_1.HttpStatus.BAD_REQUEST);
        return keys.publicKey;
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
        const personal = await this.personalRepository.findOne({
            where: {
                userId: userDto.id,
            },
        });
        const personalDto = new personalCreation_dto_1.PersonalDto(personal);
        return {
            ...tokens,
            user: userDto,
            personal: personalDto,
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
        const personal = await this.personalRepository.findOne({
            where: {
                userId: userDto.id,
            },
        });
        const personalDto = new personalCreation_dto_1.PersonalDto(personal);
        return {
            ...tokens,
            user: userDto,
            personal: personalDto,
        };
    }
    async setName(userId, name) {
        const personal = await this.personalRepository.findOne({
            where: {
                userId,
            },
        });
        if (!personal)
            throw new common_1.HttpException("пользователь не найден", common_1.HttpStatus.BAD_REQUEST);
        personal.name = name;
        await personal.save();
        return personal.name;
    }
    async setSurname(userId, surname) {
        const personal = await this.personalRepository.findOne({
            where: {
                userId,
            },
        });
        if (!personal)
            throw new common_1.HttpException("пользователь не найден", common_1.HttpStatus.BAD_REQUEST);
        personal.surname = surname;
        await personal.save();
        return personal.surname;
    }
    async setPatronymic(userId, patronymic) {
        const personal = await this.personalRepository.findOne({
            where: {
                userId,
            },
        });
        if (!personal)
            throw new common_1.HttpException("пользователь не найден", common_1.HttpStatus.BAD_REQUEST);
        personal.patronymic = patronymic;
        await personal.save();
        return personal.patronymic;
    }
    async phoneNumber(userId, phoneNumber) {
        const personal = await this.personalRepository.findOne({
            where: {
                userId,
            },
        });
        if (!personal)
            throw new common_1.HttpException("пользователь не найден", common_1.HttpStatus.BAD_REQUEST);
        personal.phoneNumber = phoneNumber;
        await personal.save();
        return personal.phoneNumber;
    }
    async setAvatar(userId, file) {
        const extention = this.orderService.getExtension(file.originalname);
        const fileName = (0, uuid_1.v4)() + `.${extention}`;
        const filePath = (0, path_1.join)(__dirname, "..", "uploads", fileName);
        if (extention) {
            (0, fs_1.rename)(file.path, filePath, (err) => {
                if (err) {
                    console.error(err);
                    throw new common_1.HttpException("ошибка при чтении файла", common_1.HttpStatus.BAD_REQUEST);
                }
                console.log(`переименован успешно`);
            });
        }
        const personal = await this.personalRepository.findOne({
            where: {
                userId,
            },
        });
        if (!personal)
            throw new common_1.HttpException("пользователь не найден", common_1.HttpStatus.BAD_REQUEST);
        personal.avatar = fileName;
        personal.save();
        return personal.avatar;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(4, (0, sequelize_1.InjectModel)(vapid_model_1.Vapid)),
    __param(5, (0, sequelize_1.InjectModel)(keys_model_1.Keys)),
    __param(6, (0, sequelize_1.InjectModel)(subscription_model_1.Subscription)),
    __param(7, (0, sequelize_1.InjectModel)(personal_model_1.Personal)),
    __metadata("design:paramtypes", [Object, mail_service_1.MailService,
        token_service_1.TokenService,
        order_service_1.OrderService, Object, Object, Object, Object, bot_service_1.BotService])
], UserService);
//# sourceMappingURL=user.service.js.map