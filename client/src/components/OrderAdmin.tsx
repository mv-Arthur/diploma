import { observer } from "mobx-react-lite";
import React from "react";
import { orderAdminStore } from "../store/orderAdminStore";
import { API_URL } from "../http";
import { OrderComponent } from "./Order";

export const OrderAdmin = observer(() => {
	React.useEffect(() => {
		(async () => {
			const response = await orderAdminStore.fetchingOrders();
			console.log(response);
		})();
	}, []);
	const handleDownload = (id: number) => {
		window.location.href = `${API_URL}/user/download/${id}`;
	};

	const handleGet = async (status: string, price: string, id: number) => {
		await orderAdminStore.fetchToSetStatus(id, status);
		await orderAdminStore.fetchToSetPrice(id, price);
	};

	return (
		<div>
			{orderAdminStore.ordersForUsers.map((user) => {
				return (
					<div key={user.id}>
						<div>пользователь: {user.email}</div>
						{user.order.length ? (
							user.order.map((order) => {
								return order.type ? (
									<OrderComponent
										editble
										key={order.id}
										order={order}
										handleDownload={handleDownload}
										handleGet={handleGet}
									/>
								) : (
									<div key={order.id}>не поддерживаемый тип</div>
								);
							})
						) : (
							<div>список заявок пуст</div>
						)}
					</div>
				);
			})}
		</div>
	);
});
