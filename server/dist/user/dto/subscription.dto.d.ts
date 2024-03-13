import { Keys } from "../model/keys.model";
import { Subscription } from "../model/subscription.model";
export declare class SubscriptionDto {
    endpoint: string;
    expirationTime: null | number;
    keys: {
        p256dh: string;
        auth: string;
    };
    constructor(subscription: Subscription, keys: Keys);
}
