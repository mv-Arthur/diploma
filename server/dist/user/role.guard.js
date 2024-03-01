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
exports.RoleGuard = void 0;
const common_1 = require("@nestjs/common");
const token_service_1 = require("./service/token.service");
let RoleGuard = class RoleGuard {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(" ")[0];
            const token = authHeader.split(" ")[1];
            if (bearer !== "Bearer" || !token) {
                console.log(111);
                throw new common_1.UnauthorizedException("пользователь не авторизован");
            }
            const user = this.tokenService.validateAccessToken(token);
            if (!user && user.role !== "admin") {
                console.log(222);
                throw new common_1.UnauthorizedException("пользователь не авторизован");
            }
            console.log(user);
            if (user.role === "user") {
                console.log(333);
                throw new common_1.HttpException("нет доступа", common_1.HttpStatus.FORBIDDEN);
            }
            req.user = user;
            return true;
        }
        catch (err) {
            throw new common_1.HttpException("нет доступа", common_1.HttpStatus.FORBIDDEN);
        }
    }
};
exports.RoleGuard = RoleGuard;
exports.RoleGuard = RoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [token_service_1.TokenService])
], RoleGuard);
//# sourceMappingURL=role.guard.js.map