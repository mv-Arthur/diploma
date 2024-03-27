"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalDto = exports.AvatarDto = exports.phoneNumberDto = exports.patronymicDto = exports.surnameDto = exports.nameDto = void 0;
class nameDto {
}
exports.nameDto = nameDto;
class surnameDto {
}
exports.surnameDto = surnameDto;
class patronymicDto {
}
exports.patronymicDto = patronymicDto;
class phoneNumberDto {
}
exports.phoneNumberDto = phoneNumberDto;
class AvatarDto {
}
exports.AvatarDto = AvatarDto;
class PersonalDto {
    constructor(model) {
        this.name = model.name;
        this.surname = model.surname;
        this.patronymic = model.patronymic;
        this.phoneNumber = model.phoneNumber;
        this.avatar = model.avatar;
    }
}
exports.PersonalDto = PersonalDto;
//# sourceMappingURL=personalCreation.dto.js.map