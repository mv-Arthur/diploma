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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const order_model_1 = require("../model/order.model");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("../model/user.model");
const file_model_1 = require("../model/file.model");
const status_model_1 = require("../model/status.model");
const uuid_1 = require("uuid");
const path_1 = require("path");
const fs_1 = require("fs");
const type_model_1 = require("../model/type.model");
const order_dto_1 = require("../dto/order.dto");
const webPush = require("web-push");
const vapid_model_1 = require("../model/vapid.model");
const subscription_model_1 = require("../model/subscription.model");
const keys_model_1 = require("../model/keys.model");
let OrderService = class OrderService {
    constructor(orderRepository, userRepository, fileRepository, statusRepository, typeRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
        this.statusRepository = statusRepository;
        this.typeRepository = typeRepository;
    }
    getExtension(filename) {
        const match = /\.([0-9a-z]+)$/i.exec(filename);
        return match ? match[1].toLowerCase() : false;
    }
    async addOrder(userId, file, dto) {
        const { description, type } = dto;
        const typeDB = await this.typeRepository.findOne({
            where: { type },
        });
        if (!typeDB) {
            throw new common_1.HttpException("неизвестный тип", common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.HttpException("пользователь не найден", common_1.HttpStatus.BAD_REQUEST);
        }
        const extention = this.getExtension(file.originalname);
        const filePath = (0, path_1.join)(__dirname, "..", "uploads", (0, uuid_1.v4)() + `.${extention}`);
        console.log("путь", filePath);
        if (extention) {
            (0, fs_1.rename)(file.path, filePath, (err) => {
                if (err) {
                    console.error(err);
                    throw new common_1.HttpException("ошибка при чтении файла", common_1.HttpStatus.BAD_REQUEST);
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
                vapid_model_1.Vapid,
                {
                    model: subscription_model_1.Subscription,
                    include: [keys_model_1.Keys],
                },
            ],
        });
        if (!admins.length)
            throw new common_1.HttpException("нет найденных аккаунтов админа", common_1.HttpStatus.BAD_REQUEST);
        try {
            for (const admin of admins) {
                const VAPID = {
                    publicKey: admin.vapid.publicKey,
                    privateKey: admin.vapid.privateKey,
                };
                webPush.setVapidDetails("mailto:example@yourdomain.org", VAPID.publicKey, VAPID.privateKey);
                await webPush.sendNotification({
                    endpoint: admin.subscription.endpoint,
                    keys: {
                        p256dh: admin.subscription.keys.p256dh,
                        auth: admin.subscription.keys.auth,
                    },
                }, JSON.stringify({
                    title: `новый заказ от ${user.email}`,
                    descr: `перейдите в личный кабинет и обновите страничку: ${order.description}`,
                }));
            }
        }
        catch (err) { }
        return new order_dto_1.OrderDto(order, status, fileDB, types);
    }
    async getAlluser() {
        return await this.userRepository.findAll({
            where: {
                role: "admin",
            },
            include: [
                vapid_model_1.Vapid,
                {
                    model: subscription_model_1.Subscription,
                    include: [keys_model_1.Keys],
                },
            ],
        });
    }
    async setPrice(id, price) {
        const order = await this.orderRepository.findOne({
            where: { id },
        });
        if (!order)
            throw new common_1.HttpException("запись не найдена", common_1.HttpStatus.BAD_REQUEST);
        order.price = price;
        order.save();
    }
    async setStatus(id, status) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order)
            throw new common_1.HttpException("запись не найдена", common_1.HttpStatus.BAD_REQUEST);
        const user = await this.userRepository.findOne({
            where: {
                id: order.userId,
            },
            include: [
                vapid_model_1.Vapid,
                {
                    model: subscription_model_1.Subscription,
                    include: [keys_model_1.Keys],
                },
            ],
        });
        if (!user)
            throw new common_1.HttpException("пользовтель не найден", common_1.HttpStatus.BAD_REQUEST);
        const statusDb = await this.statusRepository.findOne({
            where: {
                orderId: order.id,
            },
        });
        if (!statusDb)
            throw new common_1.HttpException("статус не найден", common_1.HttpStatus.BAD_REQUEST);
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
        try {
            webPush.setVapidDetails("mailto:example@yourdomain.org", VAPID.publicKey, VAPID.privateKey);
            await webPush.sendNotification({
                endpoint: user.subscription.endpoint,
                keys: {
                    p256dh: user.subscription.keys.p256dh,
                    auth: user.subscription.keys.auth,
                },
            }, JSON.stringify({
                title: `статус заказа: ${order.description} был изменен на "${statusDb.message}"`,
                descr: `перейдите в личный кабинет и обновите страничку`,
            }));
        }
        catch (err) { }
    }
    async updateDescription(id, description) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order)
            throw new common_1.HttpException("запись не найдена", common_1.HttpStatus.BAD_REQUEST);
        order.description = description;
        order.save();
    }
    async createType(dto, file) {
        const { type, name } = dto;
        const typeDb = await this.typeRepository.findOne({ where: { type } });
        if (typeDb) {
            throw new common_1.HttpException("такой тип уже имеется", common_1.HttpStatus.BAD_REQUEST);
        }
        const extention = this.getExtension(file.originalname);
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
        const newType = await this.typeRepository.create({
            name,
            type,
            fileName,
        });
        return newType;
    }
    async download(id) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order)
            throw new common_1.HttpException("запись не найдена", common_1.HttpStatus.BAD_REQUEST);
        const file = await this.fileRepository.findOne({ where: { orderId: order.id } });
        if (!file)
            throw new common_1.HttpException("файл не найден", common_1.HttpStatus.BAD_REQUEST);
        return file.path;
    }
    async getAllType() {
        const types = await this.typeRepository.findAll();
        return types;
    }
    async deleteType(id) {
        const type = await this.typeRepository.findOne({ where: { id } });
        if (!type)
            throw new common_1.HttpException("типы не найдены", common_1.HttpStatus.BAD_REQUEST);
        const delCount = await this.typeRepository.destroy({ where: { id: type.id } });
        if (!delCount) {
            throw new common_1.HttpException("типы не найдены", common_1.HttpStatus.BAD_REQUEST);
        }
        return {
            deletedTypeId: type.id,
        };
    }
    async getOrderById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.HttpException("пользователь не найден", common_1.HttpStatus.BAD_REQUEST);
        const orders = await this.orderRepository.findAll({
            where: { userId: user.id },
            include: { all: true },
        });
        if (!orders)
            throw new common_1.HttpException("заявки не найдены", common_1.HttpStatus.BAD_REQUEST);
        const types = await this.typeRepository.findAll();
        if (!types)
            throw new common_1.HttpException("типы не найдены", common_1.HttpStatus.BAD_REQUEST);
        return orders.map((order) => {
            const status = order.status;
            const file = order.file;
            const type = types.find((type) => type.type === file.type);
            if (type)
                return new order_dto_1.OrderDto(order, status, file, type);
            return null;
        });
    }
    async getAllOrder() {
        const users = await this.userRepository.findAll({
            include: {
                model: order_model_1.Order,
                include: [status_model_1.Status, file_model_1.File],
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
                    return new order_dto_1.OrderDto(order, status, file, foundedType);
                }),
            };
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(order_model_1.Order)),
    __param(1, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(2, (0, sequelize_1.InjectModel)(file_model_1.File)),
    __param(3, (0, sequelize_1.InjectModel)(status_model_1.Status)),
    __param(4, (0, sequelize_1.InjectModel)(type_model_1.Type)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], OrderService);
//# sourceMappingURL=order.service.js.map