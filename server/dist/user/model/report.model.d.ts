import { Model } from "sequelize-typescript";
interface CreationAttrs {
    orderId: number;
    name: string;
    surname: string;
    patronymic: string;
    phoneNumber: string;
    orderType: string;
    orderPrice: string;
    userEmail: string;
    orderDescription: string;
    status: string;
    dateUId: number;
}
export declare class Report extends Model<Report, CreationAttrs> {
    id: number;
    orderId: number;
    name: string;
    surname: string;
    patronymic: string;
    phoneNumber: number;
    orderType: string;
    orderPrice: string;
    userEmail: string;
    orderDescription: string;
    status: string;
    dateUId: number;
}
export {};
