/// <reference types="multer" />
import { Response, Request } from "express";
import { UserService } from "./service/user.service";
import { RegistrationDto } from "./dto/registration.dto";
import { OrderService } from "./service/order.service";
import { AddOrderDto } from "./dto/addOrder.dto";
import { SetPriceDto } from "./dto/setPrice.dto";
import { SetStatusDto } from "./dto/setStatus.dto";
import { updateDescriptionDto } from "./dto/updateDescription.dto";
import { CreateTypeDto, TypeDto } from "./dto/createType.dto";
import { AvatarDto, nameDto, patronymicDto, phoneNumberDto, surnameDto } from "./dto/personalCreation.dto";
import { BotService } from "./service/bot.service";
import { SwtichRoleDto } from "./dto/switchRole.dto";
import { MailToResetDto, ResetDto } from "./dto/reset.dto";
import { ExtendedOrgDto, IdDto, OrganizationDto } from "./dto/organization.dto";
import { AttachTypeDto } from "./dto/attachType.dto";
export interface PushSubscription {
    endpoint: string;
    expirationTime?: number | null;
    keys: {
        p256dh: string;
        auth: string;
    };
}
export declare class UserController {
    private userService;
    private orderService;
    private botService;
    constructor(userService: UserService, orderService: OrderService, botService: BotService);
    registration(dto: RegistrationDto, res: Response): Promise<Response<any, Record<string, any>>>;
    subscription(req: Request, res: Response): Promise<{
        message: string;
    }>;
    resubscribe(req: Request, res: Response): Promise<{
        message: string;
    }>;
    unsubscribe(id: number): Promise<import("./model/subscription.model").Subscription>;
    getPushKey(id: number): Promise<{
        publicKey: string;
    }>;
    login(dto: RegistrationDto, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    activate(activationLink: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    addOrder(dto: AddOrderDto, file: Express.Multer.File, userId: number): Promise<import("./dto/order.dto").OrderDto>;
    getOrder(id: number): Promise<{
        id: number;
        description: string;
        price: string;
        status: string;
        message: string;
        file: string;
        type: string;
        name: string;
        imgName: string;
    }[]>;
    getAllOrder(): Promise<{
        id: number;
        typeId: number;
        email: string;
        role: import("./types/RoleType").RoleType;
        personal: import("./dto/personalCreation.dto").PersonalDto;
        order: ({
            id: number;
            description: any;
            price: any;
            status: any;
            message: any;
            file: any;
            type: any;
            name: any;
        } | {
            id: number;
            description: string;
            price: string;
            status: string;
            message: string;
            file: string;
            type: string;
            name: string;
            imgName: string;
        })[];
    }[]>;
    activateAdmin(activationAdminLink: string): Promise<{
        message: string;
    }>;
    setPrice(dto: SetPriceDto): Promise<{
        message: string;
    }>;
    setStatus(dto: SetStatusDto): Promise<{
        message: string;
    }>;
    updateDescription(dto: updateDescriptionDto): Promise<{
        message: string;
    }>;
    createType(dto: CreateTypeDto, file: Express.Multer.File): Promise<{
        message: string;
        data: import("./model/type.model").Type;
    }>;
    download(orderId: number, res: Response): Promise<void>;
    getTypeAll(): Promise<import("./model/type.model").Type[]>;
    deleteTypeById(id: number): Promise<{
        deletedTypeId: number;
    }>;
    testToGetUsersByAdmin(): Promise<import("./model/user.model").User[]>;
    setName(dto: nameDto): Promise<string>;
    setSurname(dto: surnameDto): Promise<string>;
    setPatronymic(dto: patronymicDto): Promise<string>;
    setPhoneNumber(dto: phoneNumberDto): Promise<string>;
    setAvatar(dto: AvatarDto, file: Express.Multer.File): Promise<string>;
    report(): Promise<{
        message: string;
    }>;
    getAllAcc(): Promise<import("./model/dateU.model").DateU[]>;
    swtichRole(dto: SwtichRoleDto): Promise<{
        message: string;
    }>;
    sendMailToReset(dto: MailToResetDto): Promise<void>;
    redirectToClient(res: Response, link: string): void;
    resetPass(link: string, dto: ResetDto): Promise<{
        message: string;
    }>;
    setOrganization(dto: OrganizationDto): Promise<{
        message: string;
    }>;
    editOrganization(dto: ExtendedOrgDto): Promise<import("./model/organisation.model").Organization>;
    getOrg(id: number): Promise<import("./model/organisation.model").Organization>;
    setAvatarOrg(dto: IdDto, file: Express.Multer.File): Promise<string>;
    getPersonalById(id: number): Promise<import("./model/personal.model").Personal>;
    acttachType(dto: AttachTypeDto): Promise<{
        typeId: number;
        userId: number;
    }>;
    unattachType(id: number): Promise<{
        message: string;
        id: number;
    }>;
    updateType(id: number, dto: TypeDto): Promise<{
        message: string;
    }>;
}
