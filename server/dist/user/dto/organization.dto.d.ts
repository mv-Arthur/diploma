export declare class OrganizationDto {
    readonly email: string;
    readonly phoneNumber: string;
    readonly accNumber: string;
    readonly address: string;
    readonly description: string;
}
export declare class ExtendedOrgDto extends OrganizationDto {
    readonly id: number;
}
export declare class IdDto {
    readonly id: number;
}
