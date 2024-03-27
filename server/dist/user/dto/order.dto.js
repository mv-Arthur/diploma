"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDto = void 0;
class OrderDto {
    constructor(order, status, file, type) {
        this.id = order.id;
        this.description = order.description;
        this.price = order.price;
        this.status = status.status;
        this.message = status.message;
        this.file = file.path;
        this.type = file.type;
        this.name = type.name;
        this.imgName = type.fileName;
    }
}
exports.OrderDto = OrderDto;
//# sourceMappingURL=order.dto.js.map