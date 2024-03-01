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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailService = class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMPT_PORT,
            secure: true,
            auth: {
                user: process.env.SMPT_USER,
                pass: process.env.SMPT_PASSWORD,
            },
        });
    }
    async sendActivationMail(to, link) {
        console.log(process.env.SMPT_USER, process.env.API_URL);
        await this.transporter.sendMail({
            from: process.env.SMPT_USER,
            to: to,
            subject: `активация аккаунта на ${process.env.API_URL}`,
            text: "",
            html: `
				<div>
					<h1>Для активации перейдите по ссылке</h1>
					<a href="${link}">${link}</a>
				</div>
			`,
        });
    }
    async sendActivationAdminMail(to, link, userEmail) {
        console.log(process.env.SMPT_USER, process.env.API_URL);
        await this.transporter.sendMail({
            from: process.env.SMPT_USER,
            to: to,
            subject: `активация аккаунта для администратора на ${process.env.API_URL}`,
            text: "",
            html: `
				<div>
					<h1>Для активации роли для ${userEmail} перейдите по ссылке</h1>
					<a href="${link}">${link}</a>
					<h2>ВНИМАНИЕ, если вы не планировали менять роль пользователя, проигнорируйте сообщение</h2>
				</div>
			`,
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map