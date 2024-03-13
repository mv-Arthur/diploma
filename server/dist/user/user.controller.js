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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./service/user.service");
const registration_dto_1 = require("./dto/registration.dto");
const validation_pipe_1 = require("../pipes/validation.pipe");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const order_service_1 = require("./service/order.service");
const addOrder_dto_1 = require("./dto/addOrder.dto");
const platform_express_1 = require("@nestjs/platform-express");
const role_guard_1 = require("./role.guard");
const setPrice_dto_1 = require("./dto/setPrice.dto");
const setStatus_dto_1 = require("./dto/setStatus.dto");
const updateDescription_dto_1 = require("./dto/updateDescription.dto");
const createType_dto_1 = require("./dto/createType.dto");
let UserController = class UserController {
    constructor(userService, orderService) {
        this.userService = userService;
        this.orderService = orderService;
    }
    async registration(dto, res) {
        try {
            const { email, password } = dto;
            const userData = await this.userService.registration(email, password);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        }
        catch (err) {
            if (err.status) {
                return res.status(err.status).json({ message: err.message, status: err.status });
            }
            console.log(err);
            return res.json({ message: "непредвиденная ошибка", status: common_1.HttpStatus.BAD_REQUEST });
        }
    }
    async subscription(req, res) {
        const sub = req.body.subscription;
        const userId = req.body.id;
        await this.userService.subscribe(sub, userId);
        return {
            message: "успешно подписан",
        };
    }
    async resubscribe(req, res) {
        const sub = req.body.subscription;
        const userId = req.body.id;
        await this.userService.resubscribe(sub, userId);
        return {
            message: "успешно переподписан",
        };
    }
    async unsubscribe(id) {
        const subscription = await this.userService.unsubscribe(id);
        return subscription;
    }
    async getPushKey(id) {
        const key = await this.userService.getPushKey(id);
        return { publicKey: key };
    }
    async login(dto, res) {
        try {
            const { email, password } = dto;
            const userData = await this.userService.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        }
        catch (err) {
            if (err.status) {
                return res.status(err.status).json({ message: err.message, status: err.status });
            }
            return res.json({ message: "непредвиденная ошибка", status: common_1.HttpStatus.BAD_REQUEST });
        }
    }
    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const token = await this.userService.logout(refreshToken);
            res.clearCookie("refreshToken");
            res.status(common_1.HttpStatus.OK).json(token);
        }
        catch (err) {
            if (err.status) {
                return res.status(err.status).json({ message: err.message, status: err.status });
            }
            return res.json({ message: "непредвиденная ошибка", status: common_1.HttpStatus.BAD_REQUEST });
        }
    }
    async activate(activationLink, res) {
        try {
            await this.userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        }
        catch (err) {
            if (err.status) {
                return res.status(err.status).json({ message: err.message, status: err.status });
            }
            return res.json({ message: "непредвиденная ошибка", status: common_1.HttpStatus.BAD_REQUEST });
        }
    }
    async refresh(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await this.userService.refresh(refreshToken);
            res.cookie(userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.json(userData);
        }
        catch (err) {
            if (err.status) {
                return res.status(err.status).json({ message: err.message, status: err.status });
            }
            return res.json({ message: "непредвиденная ошибка", status: common_1.HttpStatus.BAD_REQUEST });
        }
    }
    async addOrder(dto, file, userId) {
        const order = await this.orderService.addOrder(userId, file, dto);
        return order;
    }
    async getOrder(id) {
        return await this.orderService.getOrderById(id);
    }
    async getAllOrder() {
        return await this.orderService.getAllOrder();
    }
    async activateAdmin(activationAdminLink) {
        await this.userService.activateAdmin(activationAdminLink);
        return {
            message: "Успех",
        };
    }
    async setPrice(dto) {
        await this.orderService.setPrice(dto.id, dto.price);
        return {
            message: "Успех",
        };
    }
    async setStatus(dto) {
        const { id, status } = dto;
        if (!["pending", "job", "resolved"].includes(status)) {
            throw new common_1.HttpException("неверный статус", common_1.HttpStatus.BAD_REQUEST);
        }
        await this.orderService.setStatus(id, status);
        return {
            message: "Успех",
        };
    }
    async updateDescription(dto) {
        const { id, description } = dto;
        await this.orderService.updateDescription(id, description);
        return {
            message: "Успех",
        };
    }
    async createType(dto) {
        const { name, type } = dto;
        const newType = await this.orderService.createType(name, type);
        return {
            message: "Успех",
            data: newType,
        };
    }
    async download(orderId, res) {
        const file = await this.orderService.download(orderId);
        res.download(file);
    }
    async getTypeAll() {
        return this.orderService.getAllType();
    }
    async deleteTypeById(id) {
        return await this.orderService.deleteType(id);
    }
    async testToGetUsersByAdmin() {
        return this.orderService.getAlluser();
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UsePipes)(validation_pipe_1.ValidationPipe),
    (0, common_1.Post)("/registration"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registration_dto_1.RegistrationDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registration", null);
__decorate([
    (0, common_1.Post)("/subscription"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "subscription", null);
__decorate([
    (0, common_1.Post)("/resubscribe"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resubscribe", null);
__decorate([
    (0, common_1.Get)("/subscription/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unsubscribe", null);
__decorate([
    (0, common_1.Get)("pushKey/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPushKey", null);
__decorate([
    (0, common_1.UsePipes)(validation_pipe_1.ValidationPipe),
    (0, common_1.Post)("/login"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registration_dto_1.RegistrationDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("/logout"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("/activate/:link"),
    __param(0, (0, common_1.Param)("link")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "activate", null);
__decorate([
    (0, common_1.Get)("/refresh"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("/addOrder/:id"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addOrder_dto_1.AddOrderDto, Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addOrder", null);
__decorate([
    (0, common_1.Get)("/getOrder/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Get)("/getOrder"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllOrder", null);
__decorate([
    (0, common_1.Get)("/activate/admin/:link"),
    __param(0, (0, common_1.Param)("link")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "activateAdmin", null);
__decorate([
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.Patch)("/setPrice"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [setPrice_dto_1.SetPriceDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setPrice", null);
__decorate([
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.Patch)("/setStatus"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [setStatus_dto_1.SetStatusDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)("/updateDescription"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateDescription_dto_1.updateDescriptionDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateDescription", null);
__decorate([
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.Post)("/createType"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createType_dto_1.CreateTypeDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createType", null);
__decorate([
    (0, common_1.Get)("/download/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "download", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/types"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTypeAll", null);
__decorate([
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.Delete)("/types/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteTypeById", null);
__decorate([
    (0, common_1.Get)("/test"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "testToGetUsersByAdmin", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [user_service_1.UserService,
        order_service_1.OrderService])
], UserController);
//# sourceMappingURL=user.controller.js.map