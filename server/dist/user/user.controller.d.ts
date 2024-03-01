/// <reference types="multer" />
import { Response, Request } from "express";
import { UserService } from "./service/user.service";
import { RegistrationDto } from "./dto/registration.dto";
import { OrderService } from "./service/order.service";
import { AddOrderDto } from "./dto/addOrder.dto";
import { SetPriceDto } from "./dto/setPrice.dto";
import { SetStatusDto } from "./dto/setStatus.dto";
import { updateDescriptionDto } from "./dto/updateDescription.dto";
import { CreateTypeDto } from "./dto/createType.dto";
export declare class UserController {
    private userService;
    private orderService;
    constructor(userService: UserService, orderService: OrderService);
    registration(dto: RegistrationDto, res: Response): Promise<Response<any, Record<string, any>>>;
    login(dto: RegistrationDto, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    activate(activationLink: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    users(): Promise<import("./dto/user.dto").UserDto[]>;
    addOrder(dto: AddOrderDto, file: Express.Multer.File, userId: number): Promise<{
        message: any;
        status: any;
    }>;
    activateAdmin(activationAdminLink: string): Promise<{
        status: any;
        message: any;
    }>;
    setPrice(dto: SetPriceDto): Promise<{
        status: any;
        message: any;
    }>;
    setStatus(dto: SetStatusDto): Promise<{
        status: any;
        message: any;
    }>;
    updateDescription(dto: updateDescriptionDto): Promise<{
        status: any;
        message: any;
    }>;
    createType(dto: CreateTypeDto): Promise<{
        status: any;
        message: any;
    }>;
    download(orderId: number, res: Response): Promise<{
        status: any;
        message: any;
    }>;
}
