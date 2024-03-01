import $api from "../http/index";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
export class AuthService {
	static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>("/user/login", { email, password });
	}

	static async registration(
		email: string,
		password: string
	): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>("/user/registration", { email, password });
	}

	static async logout(): Promise<void> {
		return $api.post("/user/logout");
	}
}
