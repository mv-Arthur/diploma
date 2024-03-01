/// <reference types="multer" />
import { Order } from "../model/order.model";
import { User } from "../model/user.model";
import { File } from "../model/file.model";
import { Status } from "../model/status.model";
import { AddOrderDto } from "../dto/addOrder.dto";
import { StatusType } from "../types/StatusType";
import { Type } from "../model/type.model";
export declare class OrderService {
    private orderRepository;
    private userRepository;
    private fileRepository;
    private statusRepository;
    private typeRepository;
    constructor(orderRepository: typeof Order, userRepository: typeof User, fileRepository: typeof File, statusRepository: typeof Status, typeRepository: typeof Type);
    getExtension(filename: string): string | false;
    addOrder(userId: number, file: Express.Multer.File, dto: AddOrderDto): Promise<void>;
    setPrice(id: number, price: string): Promise<void>;
    setStatus(id: number, status: StatusType): Promise<void>;
    updateDescription(id: number, description: string): Promise<void>;
    createType(name: string, type: string): Promise<void>;
    download(id: number): Promise<string>;
}
