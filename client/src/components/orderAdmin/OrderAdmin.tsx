import { observer } from "mobx-react-lite";
import React from "react";
import { orderAdminStore } from "../../store/orderAdminStore";
import { API_URL } from "../../http";
import { OrderComponent } from "../Order";
import { GetAllOrdersResponse } from "../../models/response/GetAllOrdersResponse";
import classes from "./style.module.css";
import Typography from "@mui/material/Typography";

const selected = {
	height: "30px",
	cursor: "pointer",
	width: "calc(100% - 20px)",
	backgroundColor: "#1976D2",
	borderRadius: "5px",
	paddingLeft: "10px",

	color: "#fff",
};

const unselected = {
	height: "30px",
	cursor: "pointer",
	paddingLeft: "10px",
	width: "calc(100% - 20px)",
};

export const OrderAdmin = observer(() => {
	const [currentUser, setCurrentUser] = React.useState<GetAllOrdersResponse>();

	React.useEffect(() => {
		(async () => {
			try {
				const response = await orderAdminStore.fetchingOrders();
				if (orderAdminStore.ordersForUsers.length) {
					setCurrentUser(orderAdminStore.ordersForUsers[0]);
				}
			} catch (err) {
				console.log(err);
			}
		})();
	}, []);
	const handleDownload = (id: number) => {
		window.location.href = `${API_URL}/user/download/${id}`;
	};

	const handleGet = async (status: string, price: string, id: number) => {
		try {
			await orderAdminStore.fetchToSetStatus(id, status);
			await orderAdminStore.fetchToSetPrice(id, price);
		} catch (err) {
			console.log(err);
		}
	};

	const handleValid = (user: GetAllOrdersResponse) => {
		if (currentUser && user) {
			if (currentUser.id === user.id) return selected;
			else return unselected;
		}
	};

	console.log(currentUser);

	return (
		<div className={classes.area}>
			<div className={classes.left}>
				{orderAdminStore.ordersForUsers.map((user) => {
					return (
						<Typography
							style={handleValid(user)}
							key={user.id}
							onClick={() => setCurrentUser(user)}
						>
							{user.email}
						</Typography>
					);
				})}
			</div>

			<div className={classes.right}>
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
			</div>
		</div>
	);
});
