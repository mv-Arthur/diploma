"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionDto = void 0;
class SubscriptionDto {
    constructor(subscription, keys) {
        this.endpoint = subscription.endpoint;
        this.expirationTime = subscription.expirationTime;
        this.keys.p256dh = keys.p256dh;
        this.keys.auth = keys.auth;
    }
}
exports.SubscriptionDto = SubscriptionDto;
//# sourceMappingURL=subscription.dto.js.map