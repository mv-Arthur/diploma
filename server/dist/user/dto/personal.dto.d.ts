import { Personal } from "../model/personal.model";
export declare class PersonalDto {
    name: string;
    surname: string;
    patronymic: string;
    phoneNumber: string;
    avatar: string;
    constructor(personalModel: Personal);
}
