import { Type } from "../model/type.model";
export declare class TypeDto {
    readonly name: string;
    readonly description: string;
    readonly minPrice: string;
}
export declare class CreationTypeDto {
    name: string;
    description: string;
    minPrice: string;
    constructor(dto: Type);
}
export declare class CreateTypeDto extends TypeDto {
    readonly type: string;
}
export declare class CreateSettingsDto {
    readonly fulfillmentTime: string;
    readonly dealPercent: number;
    readonly fineTardiness: number;
    readonly retentionRejection: number;
    readonly userId: number;
}
