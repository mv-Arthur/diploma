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
	publicKey = "";
	subscription = {} as any;
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

	setSubscription() {}

	async login(email: string, password: string) {
		try {
			const response = await AuthService.login(email, password);
			const keyRes = await AuthService.getPublicKey(response.data.user.id);

			localStorage.setItem("token", response.data.accessToken);

			this.setAuth(true);
			this.setUser(response.data.user);
			console.log(this.user.id);
			if ("serviceWorker" in navigator) {
				navigator.serviceWorker.ready
					.then(async function (registration) {
						if (keyRes.data.publicKey) {
							const pushServerPublicKey = keyRes.data.publicKey;
							// subscribe and return the subscription
							const subscription = await registration.pushManager.subscribe({
								userVisibleOnly: true,
								applicationServerKey: pushServerPublicKey,
							});
							console.log(subscription);
							try {
								const resq = await AuthService.resubscribe(
									subscription,
									response.data.user.id
								);
								console.log(resq);
							} catch (err) {
								console.log(err);
							}
						}
					})
					.catch((err) => {
						console.log(err);
					});
			}

			return true;
		} catch (err: any) {
			console.log(err?.response?.data);
		}
	}

	async registration(email: string, password: string) {
		try {
			const response = await AuthService.registration(email, password);
			const keyRes = await AuthService.getPublicKey(response.data.user.id);
			console.log(response);
			localStorage.setItem("token", response.data.accessToken);

			this.setAuth(true);
			this.setUser(response.data.user);
			if ("serviceWorker" in navigator) {
				navigator.serviceWorker.ready
					.then(async function (registration) {
						if (keyRes.data.publicKey) {
							const pushServerPublicKey = keyRes.data.publicKey;
							// subscribe and return the subscription
							const subscription = await registration.pushManager.subscribe({
								userVisibleOnly: true,
								applicationServerKey: pushServerPublicKey,
							});

							try {
								const resq = await AuthService.subscription(
									subscription,
									response.data.user.id
								);
								console.log(resq);
							} catch (err) {
								console.log(err);
							}
						}
					})
					.catch((err) => {
						console.log(err);
					});
			}
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

			if ("serviceWorker" in navigator) {
				navigator.serviceWorker.ready.then(async (registration) => {
					const sub = await registration.pushManager.getSubscription();
					if (sub) {
						await sub.unsubscribe();
					}
				});
			}

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
			const keyRes = await AuthService.getPublicKey(response.data.user.id);

			localStorage.setItem("token", response.data.accessToken);

			this.setAuth(true);
			this.setUser(response.data.user);
			return true;
		} catch (err: any) {
			console.log(err?.response?.data);
			return false;
		} finally {
			this.setIsLoading(false);
		}
	}
}
