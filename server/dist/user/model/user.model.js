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
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const token_model_1 = require("./token.model");
const order_model_1 = require("./order.model");
const vapid_model_1 = require("./vapid.model");
const subscription_model_1 = require("./subscription.model");
const personal_model_1 = require("./personal.model");
const type_model_1 = require("./type.model");
const operatorSettings_model_1 = require("./operatorSettings.model");
let User = class User extends sequelize_typescript_1.Model {
};
exports.User = User;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, unique: true, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, unique: false, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, unique: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isActivated", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, unique: false }),
    __metadata("design:type", String)
], User.prototype, "activationLink", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, unique: false }),
    __metadata("design:type", String)
], User.prototype, "activationLinkAdmin", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, unique: false }),
    __metadata("design:type", String)
], User.prototype, "resetLink", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, defaultValue: "user" }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => token_model_1.Token),
    __metadata("design:type", token_model_1.Token)
], User.prototype, "token", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => order_model_1.Order, { onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], User.prototype, "order", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => vapid_model_1.Vapid),
    __metadata("design:type", vapid_model_1.Vapid)
], User.prototype, "vapid", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => subscription_model_1.Subscription),
    __metadata("design:type", subscription_model_1.Subscription)
], User.prototype, "subscription", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => personal_model_1.Personal),
    __metadata("design:type", personal_model_1.Personal)
], User.prototype, "personal", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => type_model_1.Type),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], User.prototype, "typeId", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => operatorSettings_model_1.OperatorSettings),
    __metadata("design:type", operatorSettings_model_1.OperatorSettings)
], User.prototype, "operatorSettings", void 0);
exports.User = User = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "user", timestamps: false })
], User);
//# sourceMappingURL=user.model.js.map