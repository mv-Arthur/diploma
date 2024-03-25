/// <reference types="multer" />
import { Order } from "../model/order.model";
import { User } from "../model/user.model";
import { File } from "../model/file.model";
import { Status } from "../model/status.model";
import { AddOrderDto } from "../dto/addOrder.dto";
import { StatusType } from "../types/StatusType";
import { Type } from "../model/type.model";
import { OrderDto } from "../dto/order.dto";
import { CreateTypeDto } from "../dto/createType.dto";
export declare class OrderService {
    private orderRepository;
    private userRepository;
    private fileRepository;
    private statusRepository;
    private typeRepository;
    constructor(orderRepository: typeof Order, userRepository: typeof User, fileRepository: typeof File, statusRepository: typeof Status, typeRepository: typeof Type);
    getExtension(filename: string): string | false;
    addOrder(userId: number, file: Express.Multer.File, dto: AddOrderDto): Promise<OrderDto>;
    getAlluser(): Promise<User[]>;
    setPrice(id: number, price: string): Promise<void>;
    setStatus(id: number, status: StatusType): Promise<void>;
    updateDescription(id: number, description: string): Promise<void>;
    createType(dto: CreateTypeDto, file: Express.Multer.File): Promise<Type>;
    download(id: number): Promise<string>;
    getAllType(): Promise<Type[]>;
    deleteType(id: number): Promise<{
        deletedTypeId: any;
    }>;
    getOrderById(id: number): Promise<OrderDto[]>;
    getAllOrder(): Promise<{
        id: number;
        email: string;
        order: OrderDto[];
    }[]>;
}
