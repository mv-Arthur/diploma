import { File } from "../model/file.model";
import { Order } from "../model/order.model";
import { Status } from "../model/status.model";
import { Type } from "../model/type.model";
export declare class OrderDto {
    id: number;
    description: string;
    price: string;
    status: string;
    message: string;
    file: string;
    type: string;
    name: string;
    constructor(order: Order, status: Status, file: File, type: Type);
}
