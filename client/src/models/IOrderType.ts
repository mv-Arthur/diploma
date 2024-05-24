export interface IOrderType extends IType {
	id: number;

	type: string;
	fileName: string;
}

export interface IType {
	name: string;
	description: string;
	minPrice: string;
}

export interface DeletedType {
	deletedTypeId: number;
}
