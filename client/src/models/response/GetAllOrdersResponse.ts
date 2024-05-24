import { Order } from "../IOrder";

export interface GetAllOrdersResponse {
	id: number;
	email: string;
	role: string;
	typeId: number | null;
	order: Order[];
	personal: Personal;
}

interface Personal {
	name: string;
	surname: string;
	patronymic: string;
	phoneNumber: string;
	avatar: string;
}

export interface AttachResponse {
	typeId: number;
	userId: number;
}
