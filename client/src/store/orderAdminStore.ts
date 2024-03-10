import { makeAutoObservable } from "mobx";
import { GetAllOrdersResponse } from "../models/response/GetAllOrdersResponse";
import { OrderAdminService } from "../services/OrderAdminService";

class OrderAdminStore {
	ordersForUsers = [] as GetAllOrdersResponse[];

	constructor() {
		makeAutoObservable(this, {}, { deep: true });
	}

	addMany(orders: GetAllOrdersResponse[]) {
		this.ordersForUsers = [...orders];
	}

	setStatus(id: number, status: string) {
		this.ordersForUsers = this.ordersForUsers.map((user) => {
			return {
				...user,
				order: user.order.map((order) => {
					if (order.id === id) return { ...order, status: status };
					return order;
				}),
			};
		});
	}

	setPice(id: number, price: string) {
		this.ordersForUsers = this.ordersForUsers.map((user) => {
			return {
				...user,
				order: user.order.map((order) => {
					if (order.id === id) return { ...order, price: price };
					return order;
				}),
			};
		});
	}

	async fetchToSetStatus(id: number, status: string) {
		try {
			const response = await OrderAdminService.setStatus(id, status);
			this.setStatus(id, status);
		} catch (err) {
			console.log(err);
		}
	}

	async fetchToSetPrice(id: number, price: string) {
		try {
			const response = await OrderAdminService.setPrice(id, price);
			this.setPice(id, price);
		} catch (err) {
			console.log(err);
		}
	}

	async fetchingOrders() {
		try {
			const response = await OrderAdminService.getAllOrders();
			this.addMany(response.data);
			return response;
		} catch (err) {
			console.log(err);
		}
	}
}

export const orderAdminStore = new OrderAdminStore();
