import { Model } from "sequelize-typescript";
import { Keys } from "./keys.model";
interface CreationAttrs {
    endpoint: string;
    expirationTime: null | number;
    userId: number;
}
export declare class Subscription extends Model<Subscription, CreationAttrs> {
    id: number;
    endpoint: string;
    expirationTime: number | null;
    keys: Keys;
    userId: number;
}
export {};
