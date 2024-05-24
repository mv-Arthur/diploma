import $api from "../http";
import { AddOrderResponse, UnattachType } from "../models/response/AddOrderResponse";
import { AttachResponse, GetAllOrdersResponse } from "../models/response/GetAllOrdersResponse";
import { RoleType } from "../models/RoleType";
import { IType } from "../models/IOrderType";

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

	static async setReport() {
		return $api.post<AddOrderResponse>("/user/acc");
	}

	static async switchRole(id: number, role: RoleType) {
		return $api.post<AddOrderResponse>("/user/switchRole", { role, id });
	}

	static async attachType(userId: number, typeId: number) {
		return $api.post<AttachResponse>("/user/attachType", {
			typeId: typeId,
			userId: userId,
		});
	}

	//typeid is require in param
	static async unattachType(id: number) {
		return $api.delete<UnattachType>(`/user/attachType/${id}`);
	}

	static async updateType(id: number, type: IType) {
		return $api.patch<AddOrderResponse>(`/user/types/${id}`, type);
	}
}
