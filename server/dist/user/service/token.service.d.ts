import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Token } from "../model/token.model";
import { UserDto } from "../dto/user.dto";
export declare class TokenService {
    private readonly jwtService;
    private readonly configService;
    private tokenRepository;
    constructor(jwtService: JwtService, configService: ConfigService, tokenRepository: typeof Token);
    generateToken(payload: UserDto): {
        accessToken: string;
        refreshToken: string;
    };
    saveToken(userId: number, refreshToken: string): Promise<Token>;
    removeToken(refreshToken: string): Promise<Token>;
    validateAccessToken(token: string): any;
    validateRefreshToken(token: string): any;
    findToken(refreshToken: string): Promise<Token>;
}
