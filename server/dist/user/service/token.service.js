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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const sequelize_1 = require("@nestjs/sequelize");
const token_model_1 = require("../model/token.model");
let TokenService = class TokenService {
    constructor(jwtService, configService, tokenRepository) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.tokenRepository = tokenRepository;
    }
    generateToken(payload) {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get("JWT_ACCESS_SECRET"),
            expiresIn: "30m",
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get("JWT_REFRESH_SECRET"),
            expiresIn: "30d",
        });
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await this.tokenRepository.findOne({ where: { userId: userId } });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await this.tokenRepository.create({
            userId: userId,
            refreshToken: refreshToken,
        });
        return token;
    }
    async removeToken(refreshToken) {
        const tokenData = await this.tokenRepository.findOne({
            where: {
                refreshToken: refreshToken,
            },
        });
        await this.tokenRepository.destroy({
            where: {
                refreshToken: tokenData.refreshToken,
            },
        });
        return tokenData;
    }
    validateAccessToken(token) {
        try {
            const userData = this.jwtService.verify(token, {
                secret: process.env.JWT_ACCESS_SECRET,
            });
            return userData;
        }
        catch (err) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = this.jwtService.verify(token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            return userData;
        }
        catch (err) {
            return null;
        }
    }
    async findToken(refreshToken) {
        const tokenData = await this.tokenRepository.findOne({
            where: {
                refreshToken: refreshToken,
            },
        });
        return tokenData;
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, sequelize_1.InjectModel)(token_model_1.Token)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService, Object])
], TokenService);
//# sourceMappingURL=token.service.js.map