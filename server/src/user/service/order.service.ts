import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Order } from "../model/order.model";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../model/user.model";
import { File } from "../model/file.model";
import { Status } from "../model/status.model";
import { v4 as uuidv4 } from "uuid";
import { join } from "path";
import { rename, stat } from "fs";
import { AddOrderDto } from "../dto/addOrder.dto";
import { StatusType } from "../types/StatusType";
import { Type } from "../model/type.model";
import { OrderDto } from "../dto/order.dto";
import * as webPush from "web-push";
import { Vapid } from "../model/vapid.model";

import { Subscription } from "../model/subscription.model";
import { Keys } from "../model/keys.model";
@Injectable()
export class OrderService {
	constructor(
		@InjectModel(Order) private orderRepository: typeof Order,
		@InjectModel(User) private userRepository: typeof User,
		@InjectModel(File) private fileRepository: typeof File,
		@InjectModel(Status) private statusRepository: typeof Status,
		@InjectModel(Type) private typeRepository: typeof Type
	) {}

	getExtension(filename: string) {
		const match = /\.([0-9a-z]+)$/i.exec(filename);
		return match ? match[1].toLowerCase() : false;
	}

	async addOrder(userId: number, file: Express.Multer.File, dto: AddOrderDto) {
		const { description, type } = dto;

		const typeDB = await this.typeRepository.findOne({
			where: { type },
		});

		if (!typeDB) {
			throw new HttpException("неизвестный тип", HttpStatus.BAD_REQUEST);
		}

		const user = await this.userRepository.findOne({
			where: {
				id: userId,
			},
		});
		if (!user) {
			throw new HttpException("пользователь не найден", HttpStatus.BAD_REQUEST);
		}

		const extention = this.getExtension(file.originalname);
		const filePath = join(__dirname, "..", "uploads", uuidv4() + `.${extention}`);
		console.log("путь", filePath);
		if (extention) {
			rename(file.path, filePath, (err) => {
				if (err) {
					console.error(err);
					throw new HttpException("ошибка при чтении файла", HttpStatus.BAD_REQUEST);
				}
				console.log(`переименован успешно`);
			});
		}
		const order = await this.orderRepository.create({ description, userId });
		const fileDB = await this.fileRepository.create({ path: filePath, type, orderId: order.id });
		const status = await this.statusRepository.create({ orderId: order.id });
		const allTypes = await this.typeRepository.findAll();
		const types = allTypes.find((type) => type.type === fileDB.type);
		const admins = await this.userRepository.findAll({
			where: {
				role: "admin",
			},
			include: [
				Vapid,
				{
					model: Subscription,
					include: [Keys],
				},
			],
		});

		if (!admins.length)
			throw new HttpException("нет найденных аккаунтов админа", HttpStatus.BAD_REQUEST);

		admins.forEach((admin) => {
			const VAPID = {
				publicKey: admin.vapid.publicKey,
				privateKey: admin.vapid.privateKey,
			};

			webPush.setVapidDetails(
				"mailto:example@yourdomain.org",
				VAPID.publicKey,
				VAPID.privateKey
			);

			webPush.sendNotification(
				{
					endpoint: admin.subscription.endpoint,

					keys: {
						p256dh: admin.subscription.keys.p256dh,
						auth: admin.subscription.keys.auth,
					},
				},
				JSON.stringify({
					title: `новый заказ от ${user.email}`,
					descr: `перейдите в личный кабинет и обновите страничку: ${order.description}`,
				})
			);
		});

		return new OrderDto(order, status, fileDB, types);
	}

	async getAlluser() {
		return await this.userRepository.findAll({
			where: {
				role: "admin",
			},
			include: [
				Vapid,
				{
					model: Subscription,
					include: [Keys],
				},
			],
		});
	}

	async setPrice(id: number, price: string) {
		const order = await this.orderRepository.findOne({
			where: { id },
		});

		if (!order) throw new HttpException("запись не найдена", HttpStatus.BAD_REQUEST);

		order.price = price;
		order.save();
	}

	async setStatus(id: number, status: StatusType) {
		const order = await this.orderRepository.findOne({ where: { id } });

		if (!order) throw new HttpException("запись не найдена", HttpStatus.BAD_REQUEST);

		const user = await this.userRepository.findOne({
			where: {
				id: order.userId,
			},
			include: [
				Vapid,
				{
					model: Subscription,
					include: [Keys],
				},
			],
		});

		if (!user) throw new HttpException("пользовтель не найден", HttpStatus.BAD_REQUEST);

		const statusDb = await this.statusRepository.findOne({
			where: {
				orderId: order.id,
			},
		});

		if (!statusDb) throw new HttpException("статус не найден", HttpStatus.BAD_REQUEST);

		let message = null;

		if (status === "pending") {
			message = "ожидает принятия";
		}

		if (status === "job") {
			message = "в работе";
		}

		if (status === "resolved") {
			message = "готово к выдаче";
		}

		if (!message) {
			message = "ожидает принятия";
		}

		statusDb.status = status;
		statusDb.message = message;

		statusDb.save();

		const VAPID = {
			publicKey: user.vapid.publicKey,
			privateKey: user.vapid.privateKey,
		};

		webPush.setVapidDetails("mailto:example@yourdomain.org", VAPID.publicKey, VAPID.privateKey);

		webPush.sendNotification(
			{
				endpoint: user.subscription.endpoint,
				keys: {
					p256dh: user.subscription.keys.p256dh,
					auth: user.subscription.keys.auth,
				},
			},
			JSON.stringify({
				title: `статус заказа: ${order.description} был изменен на "${statusDb.message}"`,
				descr: `перейдите в личный кабинет и обновите страничку`,
			})
		);
	}

	async updateDescription(id: number, description: string) {
		const order = await this.orderRepository.findOne({ where: { id } });
		if (!order) throw new HttpException("запись не найдена", HttpStatus.BAD_REQUEST);
		order.description = description;
		order.save();
	}

	async createType(name: string, type: string) {
		const typeDb = await this.typeRepository.findOne({ where: { type } });

		if (typeDb) {
			throw new HttpException("такой тип уже имеется", HttpStatus.BAD_REQUEST);
		}

		const newType = await this.typeRepository.create({
			name,
			type,
		});

		return newType;
	}

	async download(id: number) {
		const order = await this.orderRepository.findOne({ where: { id } });
		if (!order) throw new HttpException("запись не найдена", HttpStatus.BAD_REQUEST);
		const file = await this.fileRepository.findOne({ where: { orderId: order.id } });
		if (!file) throw new HttpException("файл не найден", HttpStatus.BAD_REQUEST);
		return file.path;
	}

	async getAllType() {
		const types = await this.typeRepository.findAll();
		return types;
	}

	async deleteType(id: number) {
		const type = await this.typeRepository.findOne({ where: { id } });
		if (!type) throw new HttpException("типы не найдены", HttpStatus.BAD_REQUEST);
		const delCount = await this.typeRepository.destroy({ where: { id: type.id } });
		if (!delCount) {
			throw new HttpException("типы не найдены", HttpStatus.BAD_REQUEST);
		}
		return {
			deletedTypeId: type.id,
		};
	}

	async getOrderById(id: number) {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) throw new HttpException("пользователь не найден", HttpStatus.BAD_REQUEST);
		const orders = await this.orderRepository.findAll({
			where: { userId: user.id },
			include: { all: true },
		});

		if (!orders) throw new HttpException("заявки не найдены", HttpStatus.BAD_REQUEST);
		const types = await this.typeRepository.findAll();
		if (!types) throw new HttpException("типы не найдены", HttpStatus.BAD_REQUEST);

		return orders.map((order) => {
			const status = order.status;
			const file = order.file;
			const type = types.find((type) => type.type === file.type);
			if (type) return new OrderDto(order, status, file, type);
			return null;
		});
	}

	async getAllOrder() {
		const users = await this.userRepository.findAll({
			include: {
				model: Order,
				include: [Status, File],
			},
		});
		const types = await this.typeRepository.findAll();

		return users.map((user) => {
			const { order } = user;

			return {
				id: user.id,
				email: user.email,
				order: order.map((order) => {
					const { status, file } = order;
					const foundedType = types.find((type) => type.type === file.type);
					if (!foundedType)
						return {
							id: order.id,
							description: null,
							price: null,
							status: null,
							message: null,
							file: null,
							type: null,
							name: null,
						};
					return new OrderDto(order, status, file, foundedType);
				}),
			};
		});
	}
}
