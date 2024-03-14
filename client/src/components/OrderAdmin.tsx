import { observer } from "mobx-react-lite";
import React from "react";
import { orderAdminStore } from "../store/orderAdminStore";
import { API_URL } from "../http";
import { OrderComponent } from "./Order";
import { GetAllOrdersResponse } from "../models/response/GetAllOrdersResponse";

export const OrderAdmin = observer(() => {
	const [currentUser, setCurrentUser] = React.useState<GetAllOrdersResponse>();

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

	console.log(currentUser);

	return (
		<div>
			{orderAdminStore.ordersForUsers.map((user) => {
				return (
					<div key={user.id} onClick={() => setCurrentUser(user)}>
						{user.email}
					</div>
				);
			})}
			------------------
			{currentUser && currentUser.order.length ? (
				currentUser.order.map((order) => {
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
				<div>заявок нет</div>
			)}
			{/* {orderAdminStore.ordersForUsers.map((user) => {
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
			})} */}
		</div>
	);
});
