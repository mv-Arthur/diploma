export declare class TypeDto {
    readonly name: string;
    readonly description: string;
    readonly minPrice: string;
}
export declare class CreateTypeDto extends TypeDto {
    readonly type: string;
}
