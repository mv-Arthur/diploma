import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { orderAdminStore } from "../../store/orderAdminStore";
import { API_URL } from "../../http";
import { OrderComponent } from "../Order";
import { GetAllOrdersResponse } from "../../models/response/GetAllOrdersResponse";
import classes from "./style.module.css";
import Typography from "@mui/material/Typography";
import { Context } from "../..";
import defaultAvatar from "../../static/defaultAvatar.jpg";
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

const findFirst = (arr: GetAllOrdersResponse[]) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].role === "user") {
			return arr[i];
		}
	}
};

export const OrderAdmin = observer(() => {
	const [currentUser, setCurrentUser] = React.useState<GetAllOrdersResponse>();
	const { store } = useContext(Context);
	React.useEffect(() => {
		(async () => {
			try {
				const response = await orderAdminStore.fetchingOrders();
				if (orderAdminStore.ordersForUsers.length) {
					setCurrentUser(findFirst(orderAdminStore.ordersForUsers));
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
					if (user.id !== store.user.id) {
						return (
							<Typography
								style={handleValid(user)}
								key={user.id}
								onClick={() => setCurrentUser(user)}
							>
								{user.email}
							</Typography>
						);
					} else {
						return null;
					}
				})}
			</div>

			<div className={classes.right}>
				{currentUser && (
					<div className={classes.personal}>
						<div className={classes.personalLeft}>
							<img
								src={
									currentUser.personal.avatar
										? `${API_URL}/uploads/${currentUser.personal.avatar}`
										: defaultAvatar
								}
								alt="avatar"
							/>
						</div>
						<div className={classes.personalRight}>
							<Typography>
								Фамилия{" "}
								<span style={{ fontWeight: 900 }}>{currentUser.personal.surname}</span>
							</Typography>
							<Typography>
								Имя <span style={{ fontWeight: 900 }}>{currentUser.personal.name}</span>
							</Typography>
							<Typography>
								Отчество{" "}
								<span style={{ fontWeight: 900 }}>{currentUser.personal.patronymic}</span>
							</Typography>
							<Typography>
								Номер телефона{" "}
								<span style={{ fontWeight: 900 }}>{currentUser.personal.phoneNumber}</span>
							</Typography>
						</div>
					</div>
				)}
				<div className={classes.wrap}>
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
		</div>
	);
});
