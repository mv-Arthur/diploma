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
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const TelegramApi = require("node-telegram-bot-api");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("../model/user.model");
let BotService = class BotService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.token = "6949341527:AAEtYJNQMwAdxLY5Xqk2RUvxO5XT8M1smzs";
        this.bot = new TelegramApi(this.token, { polling: true });
    }
    start() {
        this.bot.on("message", (msg) => {
            console.log(msg);
        });
        this.bot.on("callback_query", async (query) => {
            const chatId = query.message.chat.id;
            const messageId = query.message.message_id;
            const data = query.data;
            const splitted = data.split(" ");
            if (splitted[0] === "skip") {
                console.log("idhsaihd");
                this.bot.deleteMessage(chatId, messageId);
            }
            if (splitted[0] === "switch") {
                console.log("dawdaw");
                const mes = await this.activateAdmin(splitted[1]);
                await this.bot.sendMessage(chatId, mes);
            }
        });
    }
    async activateAdmin(activationLinkAdmin) {
        const admin = await this.userRepository.findOne({
            where: { activationLinkAdmin: activationLinkAdmin },
        });
        if (!admin) {
            return "пользователь не найден";
        }
        admin.role = "admin";
        admin.isActivated = true;
        admin.save();
        return "Успех";
    }
    async sendActivationAdmin(activationLinkAdmin) {
        const user = await this.userRepository.findOne({ where: { activationLinkAdmin } });
        try {
            await this.bot.sendMessage(Number(process.env.SUPERUSERTGID), "Зарегестрирован новый пользователь - " + user.email, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "сменить роль", callback_data: "switch " + activationLinkAdmin },
                            { text: "пропустить", callback_data: "skip " + "none" },
                        ],
                    ],
                },
            });
        }
        catch (err) { }
    }
};
exports.BotService = BotService;
exports.BotService = BotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object])
], BotService);
//# sourceMappingURL=bot.service.js.map