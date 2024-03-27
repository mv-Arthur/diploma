"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./service/user.service");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("./model/user.model");
const token_model_1 = require("./model/token.model");
const mail_service_1 = require("./service/mail.service");
const token_service_1 = require("./service/token.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const order_model_1 = require("./model/order.model");
const file_model_1 = require("./model/file.model");
const status_model_1 = require("./model/status.model");
const order_service_1 = require("./service/order.service");
const platform_express_1 = require("@nestjs/platform-express");
const role_guard_1 = require("./role.guard");
const type_model_1 = require("./model/type.model");
const vapid_model_1 = require("./model/vapid.model");
const subscription_model_1 = require("./model/subscription.model");
const keys_model_1 = require("./model/keys.model");
const platform_express_2 = require("@nestjs/platform-express");
const personal_model_1 = require("./model/personal.model");
const bot_service_1 = require("./service/bot.service");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        controllers: [user_controller_1.UserController],
        providers: [
            platform_express_2.ExpressAdapter,
            user_service_1.UserService,
            mail_service_1.MailService,
            token_service_1.TokenService,
            jwt_auth_guard_1.JwtAuthGuard,
            order_service_1.OrderService,
            role_guard_1.RoleGuard,
            bot_service_1.BotService,
        ],
        imports: [
            jwt_1.JwtModule.register({}),
            config_1.ConfigModule,
            sequelize_1.SequelizeModule.forFeature([
                user_model_1.User,
                token_model_1.Token,
                order_model_1.Order,
                file_model_1.File,
                status_model_1.Status,
                type_model_1.Type,
                vapid_model_1.Vapid,
                subscription_model_1.Subscription,
                keys_model_1.Keys,
                personal_model_1.Personal,
            ]),
            platform_express_1.MulterModule.register({
                dest: "./dist/user/uploads",
            }),
        ],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map