import { Personal } from "../model/personal.model";
export declare class nameDto {
    readonly userId: number;
    readonly name: string;
}
export declare class surnameDto {
    readonly userId: number;
    readonly surname: string;
}
export declare class patronymicDto {
    readonly userId: number;
    readonly patronymic: string;
}
export declare class phoneNumberDto {
    readonly userId: number;
    readonly phoneNumber: string;
}
export declare class AvatarDto {
    readonly userId: number;
}
export declare class PersonalDto {
    name: string;
    surname: string;
    patronymic: string;
    phoneNumber: string;
    avatar: string;
    constructor(model: Personal);
}
