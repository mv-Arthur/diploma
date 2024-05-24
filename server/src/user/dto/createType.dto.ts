export class TypeDto {
	readonly name: string;
	readonly description: string;
	readonly minPrice: string;
}

export class CreateTypeDto extends TypeDto {
	readonly type: string;
}
