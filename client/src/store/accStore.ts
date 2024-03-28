import { GetAllAccResponse } from "../models/response/AccResponse";
import { AccService } from "../services/AccService";

class AccStore {
	report = [] as GetAllAccResponse[];

	addFetcht(data: GetAllAccResponse[]) {
		this.report = [...data];
	}

	async fetchReports() {
		const response = await AccService.getAllAcc();
		this.addFetcht(response.data);
	}
}

export const accStore = new AccStore();