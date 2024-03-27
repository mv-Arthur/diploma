import { Model } from "sequelize-typescript";
interface CreationAttrs {
    name: string;
    surname: string;
    phoneNumber: string;
    userId: number;
    avatar: string;
    patronymic: string;
}
export declare class Personal extends Model<Personal, CreationAttrs> {
    name: string;
    surname: string;
    patronymic: string;
    phoneNumber: string;
    avatar: string;
    userId: number;
}
export {};
