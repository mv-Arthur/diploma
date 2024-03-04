import $api from "../http";
import { DeletedType, IOrderType } from "../models/IOrderType";
import { CreateTypeResponse } from "../models/response/CreateTypeResponse";

export class OrderTypeService {
	static async addType(name: string, type: string) {
		return $api.post<CreateTypeResponse>("/user/createType", { type, name });
	}

	static async getAll() {
		return $api.get<IOrderType[]>("/user/types");
	}

	static async deleteById(id: number) {
		return $api.delete<DeletedType>(`/user/types/${id}`);
	}
}
