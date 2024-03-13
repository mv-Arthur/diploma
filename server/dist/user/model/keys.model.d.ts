import { Model } from "sequelize-typescript";
interface CreationAttrs {
    p256dh: string;
    auth: string;
    subscriptionId: number;
}
export declare class Keys extends Model<Keys, CreationAttrs> {
    p256dh: string;
    auth: string;
    subscriptionId: number;
}
export {};
