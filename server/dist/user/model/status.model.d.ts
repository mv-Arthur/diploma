import { Model } from "sequelize-typescript";
interface CreationAttrs {
    orderId: number;
}
export declare class Status extends Model<Status, CreationAttrs> {
    status: string;
    message: string;
    orderId: number;
}
export {};
