import { UserDto } from "../dto/user.dto";
import { User } from "../model/user.model";
import { MailService } from "./mail.service";
import { TokenService } from "./token.service";
export declare class UserService {
    private userRepository;
    private mailService;
    private tokenService;
    constructor(userRepository: typeof User, mailService: MailService, tokenService: TokenService);
    registration(email: string, password: string): Promise<{
        user: UserDto;
        accessToken: string;
        refreshToken: string;
    }>;
    activate(activationLink: string): Promise<void>;
    activateAdmin(activationLinkAdmin: string): Promise<void>;
    login(email: string, password: string): Promise<{
        user: UserDto;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<import("../model/token.model").Token>;
    refresh(refreshToken: string): Promise<{
        user: UserDto;
        accessToken: string;
        refreshToken: string;
    }>;
}
