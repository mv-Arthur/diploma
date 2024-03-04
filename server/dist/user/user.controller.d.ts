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
    addOrder(dto: AddOrderDto, file: Express.Multer.File, userId: number): Promise<import("./dto/order.dto").OrderDto>;
    getOrder(id: number): Promise<import("./dto/order.dto").OrderDto[]>;
    getAllOrder(): Promise<import("./model/user.model").User[]>;
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
    createType(dto: CreateTypeDto): Promise<{
        message: string;
        data: import("./model/type.model").Type;
    }>;
    download(orderId: number, res: Response): Promise<void>;
    getTypeAll(): Promise<import("./model/type.model").Type[]>;
    deleteTypeById(id: number): Promise<{
        deletedTypeId: any;
    }>;
}
