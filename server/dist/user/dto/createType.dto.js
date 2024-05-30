"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSettingsDto = exports.CreateTypeDto = exports.CreationTypeDto = exports.TypeDto = void 0;
class TypeDto {
}
exports.TypeDto = TypeDto;
class CreationTypeDto {
    constructor(dto) {
        this.name = dto.name;
        this.description = dto.description;
        this.minPrice = dto.minPrice;
    }
}
exports.CreationTypeDto = CreationTypeDto;
class CreateTypeDto extends TypeDto {
}
exports.CreateTypeDto = CreateTypeDto;
class CreateSettingsDto {
}
exports.CreateSettingsDto = CreateSettingsDto;
//# sourceMappingURL=createType.dto.js.map