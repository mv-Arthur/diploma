import { Model } from "sequelize-typescript";
interface CreationAttrs {
    name: string;
    type: string;
    fileName: string;
    description: string;
    minPrice: string;
}
export declare class Type extends Model<Type, CreationAttrs> {
    name: string;
    type: string;
    fileName: string;
    description: string;
    minPrice: string;
}
export {};
