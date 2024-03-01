import { Model } from "sequelize-typescript";
interface CreationAttrs {
    path: string;
    type: string;
    orderId: number;
}
export declare class File extends Model<File, CreationAttrs> {
    path: string;
    type: string;
    orderId: number;
}
export {};
