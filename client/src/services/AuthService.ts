import $api from "../http/index";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { KeyResponse } from "../models/response/KeyResponse";
import { AddOrderResponse } from "../models/response/AddOrderResponse";
import { ISubscription } from "../models/ISubscription";
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

	static async getPublicKey(id: number): Promise<AxiosResponse<KeyResponse>> {
		return $api.get(`/user/pushKey/${id}`);
	}

	static async subscription(
		subscription: PushSubscription,
		id: number
	): Promise<AxiosResponse<AddOrderResponse>> {
		return $api.post("/user/subscription", { subscription: subscription, id: id });
	}

	static async resubscribe(
		subscription: PushSubscription,
		id: number
	): Promise<AxiosResponse<AddOrderResponse>> {
		return $api.post("/user/resubscribe", { subscription: subscription, id: id });
	}
}
