import { Model } from "sequelize-typescript";
import { Status } from "./status.model";
import { File } from "./file.model";
interface CreationAttrs {
    description: string;
    userId: number;
}
export declare class Order extends Model<Order, CreationAttrs> {
    id: number;
    description: string;
    price: string;
    status: Status;
    file: File;
    userId: number;
}
export {};
