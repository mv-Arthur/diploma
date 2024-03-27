import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
@Injectable()
export class MailService {
	private readonly transporter;

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
	async sendActivationMail(to: string, link: string) {
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
	async sendActivationAdminMail(to: string, link: string, userEmail: string) {
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
}
