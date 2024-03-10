import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "..";
import { CreateTypeForm } from "../components/CreateTypeForm";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { typeStore } from "../store/typeStore";
import { TypesArea } from "../components/TypesArea";
import { orderStore } from "../store/orderStore";
import { OrderAdmin } from "../components/OrderAdmin";
const AdminPage = () => {
	const navigate = useNavigate();
	const { store } = useContext(Context);

	React.useEffect(() => {
		(async () => {
			(async () => {
				await store.checkAuth();
				await orderStore.fetchOrders(store.user.id);
			})();
		})();
	}, []);

	return (
		<div>
			<Typography variant="h6" gutterBottom>
				Приветствую, вы авторизованы как {store.user.email}
			</Typography>
			<Typography variant="h6" gutterBottom>
				Вы администратор
			</Typography>

			<Typography variant="h6" gutterBottom>
				{store.user.isActivated
					? "подтвержденный аккаунт"
					: "пожалуйста, перейдите на почту и подтвердите аккаунт"}
			</Typography>
			<Button
				variant="contained"
				onClick={async () => {
					await store.logout();
					navigate("/");
				}}
			>
				выход
			</Button>
			<CreateTypeForm />

			<TypesArea />
			<OrderAdmin />
		</div>
	);
};

export default observer(AdminPage);
