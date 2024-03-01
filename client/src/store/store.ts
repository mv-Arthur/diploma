import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import { AuthService } from "../services/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

export default class Store {
	user = {} as IUser;
	isAuth = false;
	isLoading = false;

	constructor() {
		makeAutoObservable(this);
	}

	setIsLoading(bool: boolean) {
		this.isLoading = bool;
	}

	setAuth(bool: boolean) {
		this.isAuth = bool;
	}

	setUser(user: IUser) {
		this.user = user;
	}

	async login(email: string, password: string) {
		try {
			const response = await AuthService.login(email, password);
			console.log(response);
			localStorage.setItem("token", response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
			return true;
		} catch (err: any) {
			console.log(err?.response?.data);
		}
	}

	async registration(email: string, password: string) {
		try {
			const response = await AuthService.registration(email, password);
			console.log(response);
			localStorage.setItem("token", response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
			return true;
		} catch (err: any) {
			console.log(err?.response?.data);
		}
	}

	async logout() {
		try {
			const response = await AuthService.logout();
			console.log(response);
			localStorage.removeItem("token");
			this.setAuth(false);
			this.setUser({} as IUser);
		} catch (err: any) {
			console.log(err?.response?.data);
		}
	}

	async checkAuth() {
		this.setIsLoading(true);
		try {
			const response = await axios.get<AuthResponse>(`${API_URL}/user/refresh`, {
				withCredentials: true,
			});
			console.log(response);
			localStorage.setItem("token", response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (err: any) {
			console.log(err?.response?.data);
		} finally {
			this.setIsLoading(false);
		}
	}
}
