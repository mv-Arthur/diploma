import { Model } from "sequelize-typescript";
interface CreationAttrs {
    email: string;
    phoneNumber: string;
    accNumber: string;
    address: string;
    description: string;
    avatar: string;
}
export declare class Organization extends Model<Organization, CreationAttrs> {
    email: string;
    phoneNumber: string;
    accNumber: string;
    address: string;
    description: string;
    avatar: string;
}
export {};
