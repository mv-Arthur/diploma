import { Model } from "sequelize-typescript";
import { Token } from "./token.model";
import { RoleType } from "../types/RoleType";
import { Order } from "./order.model";
interface CreationAttrs {
    email: string;
    password: string;
    activationLink: string;
    activationLinkAdmin: string;
}
export declare class User extends Model<User, CreationAttrs> {
    id: number;
    email: string;
    password: string;
    isActivated: boolean;
    activationLink: string;
    activationLinkAdmin: string;
    role: RoleType;
    token: Token;
    order: Order[];
}
export {};
