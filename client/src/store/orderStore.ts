import { makeAutoObservable } from "mobx";
import { Order } from "../models/IOrder";
import { OrderService } from "../services/OrderService";

class OrderStore {
	orders = [] as Order[];

	constructor() {
		makeAutoObservable(this);
	}

	addOrder(order: Order) {
		this.orders.push(order);
	}

	addFetchedOrders(orders: Order[]) {
		this.orders = [...this.orders, ...orders];
	}

	async fetchOrders(userId: number) {
		const orders = await OrderService.fetchOrders(userId);
		this.addFetchedOrders(orders.data);
	}

	async fetchAddOrder(userId: number, formData: FormData) {
		const response = await OrderService.addOrder(userId, formData);
		this.addOrder(response.data);
	}
}

export const orderStore = new OrderStore();
