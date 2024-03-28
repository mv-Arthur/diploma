import { AxiosResponse } from "axios";
import $api from "../http";
import { GetAllAccResponse } from "../models/response/AccResponse";

export class AccService {
	static async getAllAcc(): Promise<AxiosResponse<GetAllAccResponse[]>> {
		return $api.get("/user/acc");
	}
}
