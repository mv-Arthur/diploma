import { Model } from "sequelize-typescript";
interface CreationAttrs {
    publicKey: string;
    privateKey: string;
    userId: number;
}
export declare class Vapid extends Model<Vapid, CreationAttrs> {
    publicKey: string;
    privateKey: string;
    userId: number;
}
export {};
