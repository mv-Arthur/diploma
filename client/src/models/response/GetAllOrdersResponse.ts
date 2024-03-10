import { Order } from "../IOrder";

export interface GetAllOrdersResponse {
	id: number;
	email: string;
	order: Order[];
}
