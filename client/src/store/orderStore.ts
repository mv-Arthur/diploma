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
		this.orders = [...orders];
	}

	async fetchOrders(userId: number) {
		try {
			const orders = await OrderService.fetchOrders(userId);
			this.addFetchedOrders(orders.data);
		} catch (err) {
			console.log(err);
		}
	}

	async fetchAddOrder(userId: number, formData: FormData) {
		try {
			const response = await OrderService.addOrder(userId, formData);
			this.addOrder(response.data);
		} catch (err) {
			console.log(err);
		}
	}
}

export const orderStore = new OrderStore();
