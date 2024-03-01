import { Model } from "sequelize-typescript";
interface CreationAttrs {
    userId: number;
    refreshToken: string;
}
export declare class Token extends Model<Token, CreationAttrs> {
    refreshToken: string;
    userId: number;
}
export {};
