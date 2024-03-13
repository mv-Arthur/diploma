import { UserDto } from "../dto/user.dto";
import { User } from "../model/user.model";
import { MailService } from "./mail.service";
import { TokenService } from "./token.service";
import { Vapid } from "../model/vapid.model";
import { PushSubscription } from "../user.controller";
import { Keys } from "../model/keys.model";
import { Subscription } from "../model/subscription.model";
export declare class UserService {
    private userRepository;
    private mailService;
    private tokenService;
    private vapidRepository;
    private keysRepository;
    private subsciptionRepository;
    constructor(userRepository: typeof User, mailService: MailService, tokenService: TokenService, vapidRepository: typeof Vapid, keysRepository: typeof Keys, subsciptionRepository: typeof Subscription);
    registration(email: string, password: string): Promise<{
        user: UserDto;
        accessToken: string;
        refreshToken: string;
    }>;
    subscribe(sub: PushSubscription, id: number): Promise<void>;
    resubscribe(sub: PushSubscription, id: number): Promise<void>;
    unsubscribe(id: number): Promise<Subscription>;
    getPushKey(id: number): Promise<string>;
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
