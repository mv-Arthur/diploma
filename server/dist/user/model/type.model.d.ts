import { Model } from "sequelize-typescript";
import { User } from "./user.model";
interface CreationAttrs {
    name: string;
    type: string;
    fileName: string;
    description: string;
    minPrice: string;
}
export declare class Type extends Model<Type, CreationAttrs> {
    id: number;
    name: string;
    type: string;
    fileName: string;
    description: string;
    minPrice: string;
    operator: User;
}
export {};
