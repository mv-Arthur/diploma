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
const personalCreation_dto_1 = require("./dto/personalCreation.dto");
const bot_service_1 = require("./service/bot.service");
const switchRole_dto_1 = require("./dto/switchRole.dto");
const reset_dto_1 = require("./dto/reset.dto");
const organization_dto_1 = require("./dto/organization.dto");
const attachType_dto_1 = require("./dto/attachType.dto");
let UserController = class UserController {
    constructor(userService, orderService, botService) {
        this.userService = userService;
        this.orderService = orderService;
        this.botService = botService;
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
            res.cookie("refreshToken", userData.refreshToken, {
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
        if (!["pending", "job", "resolved", "rejected"].includes(status)) {
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
    async createType(dto, file) {
        const newType = await this.orderService.createType(dto, file);
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
    async setName(dto) {
        const { userId, name } = dto;
        return await this.userService.setName(userId, name);
    }
    async setSurname(dto) {
        const { userId, surname } = dto;
        return await this.userService.setSurname(userId, surname);
    }
    async setPatronymic(dto) {
        const { userId, patronymic } = dto;
        return await this.userService.setPatronymic(userId, patronymic);
    }
    async setPhoneNumber(dto) {
        const { userId, phoneNumber } = dto;
        return await this.userService.phoneNumber(userId, phoneNumber);
    }
    async setAvatar(dto, file) {
        const { userId } = dto;
        return await this.userService.setAvatar(userId, file);
    }
    async report() {
        return await this.orderService.setReport();
    }
    async getAllAcc() {
        return await this.orderService.getRevenue();
    }
    async swtichRole(dto) {
        const { role, id } = dto;
        return await this.userService.switchRole(id, role);
    }
    async sendMailToReset(dto) {
        const { email } = dto;
        const data = await this.userService.sendMailToReset(email);
    }
    redirectToClient(res, link) {
        res.redirect(`${process.env.CLIENT_URL}/reset/${link}`);
    }
    async resetPass(link, dto) {
        const { newPassword } = dto;
        await this.userService.resetPassword(link, newPassword);
        return {
            message: "Успех",
        };
    }
    async setOrganization(dto) {
        await this.userService.setOrganization(dto);
        return {
            message: "Успех",
        };
    }
    async editOrganization(dto) {
        const result = await this.userService.editOrganization(dto);
        return result;
    }
    async getOrg(id) {
        return await this.userService.getOrg(id);
    }
    async setAvatarOrg(dto, file) {
        const result = await this.userService.setAvatarOrg(dto.id, file);
        return result;
    }
    async getPersonalById(id) {
        return await this.userService.getPersonalById(id);
    }
    async acttachType(dto) {
        return await this.orderService.acttachType(dto);
    }
    async unattachType(id) {
        return await this.orderService.unattachType(id);
    }
    async updateType(id, dto) {
        return await this.orderService.updateType(id, dto);
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
    (0, common_1.Post)("/createType"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createType_dto_1.CreateTypeDto, Object]),
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
__decorate([
    (0, common_1.Patch)("/name"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [personalCreation_dto_1.nameDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setName", null);
__decorate([
    (0, common_1.Patch)("/surname"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [personalCreation_dto_1.surnameDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setSurname", null);
__decorate([
    (0, common_1.Patch)("/patronymic"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [personalCreation_dto_1.patronymicDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setPatronymic", null);
__decorate([
    (0, common_1.Patch)("/phoneNumber"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [personalCreation_dto_1.phoneNumberDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setPhoneNumber", null);
__decorate([
    (0, common_1.Patch)("/avatar"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [personalCreation_dto_1.AvatarDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setAvatar", null);
__decorate([
    (0, common_1.Post)("/acc"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "report", null);
__decorate([
    (0, common_1.Get)("acc"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllAcc", null);
__decorate([
    (0, common_1.Post)("/switchRole"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [switchRole_dto_1.SwtichRoleDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "swtichRole", null);
__decorate([
    (0, common_1.Post)("/reset"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_dto_1.MailToResetDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendMailToReset", null);
__decorate([
    (0, common_1.Get)("/reset/:link"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)("link")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "redirectToClient", null);
__decorate([
    (0, common_1.Post)("/reset/:link"),
    __param(0, (0, common_1.Param)("link")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_dto_1.ResetDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPass", null);
__decorate([
    (0, common_1.Post)("/setOrganization"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [organization_dto_1.OrganizationDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setOrganization", null);
__decorate([
    (0, common_1.Patch)("/setOrganization"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [organization_dto_1.ExtendedOrgDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editOrganization", null);
__decorate([
    (0, common_1.Get)("/setOrganization/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOrg", null);
__decorate([
    (0, common_1.Patch)("/setOrgAvatar"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [organization_dto_1.IdDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setAvatarOrg", null);
__decorate([
    (0, common_1.Get)("/personal/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPersonalById", null);
__decorate([
    (0, common_1.Post)("/attachType"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attachType_dto_1.AttachTypeDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "acttachType", null);
__decorate([
    (0, common_1.Delete)("/attachType/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unattachType", null);
__decorate([
    (0, common_1.Patch)("/types/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, createType_dto_1.TypeDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateType", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [user_service_1.UserService,
        order_service_1.OrderService,
        bot_service_1.BotService])
], UserController);
//# sourceMappingURL=user.controller.js.map