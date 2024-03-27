/// <reference types="multer" />
import { UserDto } from "../dto/user.dto";
import { User } from "../model/user.model";
import { MailService } from "./mail.service";
import { TokenService } from "./token.service";
import { Vapid } from "../model/vapid.model";
import { PushSubscription } from "../user.controller";
import { Keys } from "../model/keys.model";
import { Subscription } from "../model/subscription.model";
import { Personal } from "../model/personal.model";
import { OrderService } from "./order.service";
import { PersonalDto } from "../dto/personalCreation.dto";
import { BotService } from "./bot.service";
export declare class UserService {
    private userRepository;
    private mailService;
    private tokenService;
    private orderService;
    private vapidRepository;
    private keysRepository;
    private subsciptionRepository;
    private personalRepository;
    private botService;
    constructor(userRepository: typeof User, mailService: MailService, tokenService: TokenService, orderService: OrderService, vapidRepository: typeof Vapid, keysRepository: typeof Keys, subsciptionRepository: typeof Subscription, personalRepository: typeof Personal, botService: BotService);
    _: void;
    registration(email: string, password: string): Promise<{
        user: UserDto;
        personal: PersonalDto;
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
        personal: PersonalDto;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<import("../model/token.model").Token>;
    refresh(refreshToken: string): Promise<{
        user: UserDto;
        personal: PersonalDto;
        accessToken: string;
        refreshToken: string;
    }>;
    setName(userId: number, name: string): Promise<string>;
    setSurname(userId: number, surname: string): Promise<string>;
    setPatronymic(userId: number, patronymic: string): Promise<string>;
    phoneNumber(userId: number, phoneNumber: string): Promise<string>;
    setAvatar(userId: number, file: Express.Multer.File): Promise<string>;
}
