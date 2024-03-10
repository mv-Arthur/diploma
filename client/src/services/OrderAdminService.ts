import $api from "../http";
import { AddOrderResponse } from "../models/response/AddOrderResponse";
import { GetAllOrdersResponse } from "../models/response/GetAllOrdersResponse";

export class OrderAdminService {
	static async getAllOrders() {
		return $api.get<GetAllOrdersResponse[]>("/user/getOrder");
	}
	static async setStatus(id: number, status: string) {
		return $api.patch<AddOrderResponse>("/user/setStatus", { id, status });
	}
	static async setPrice(id: number, price: string) {
		return $api.patch<AddOrderResponse>("/user/setPrice", { id, price });
	}
}
