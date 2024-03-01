import { RoleType } from "../types/RoleType";
import { User } from "../model/user.model";
export declare class UserDto {
    email: string;
    id: number;
    isActivated: boolean;
    role: RoleType;
    constructor(model: User);
}
