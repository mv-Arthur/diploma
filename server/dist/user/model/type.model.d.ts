import { Model } from "sequelize-typescript";
interface CreationAttrs {
    name: string;
    type: string;
}
export declare class Type extends Model<Type, CreationAttrs> {
    name: string;
    type: string;
}
export {};
