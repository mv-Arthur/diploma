import React, { useContext } from "react";
import { IUser } from "../models/IUser";
import { observer } from "mobx-react-lite";
import { AuthService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { Context } from "..";
import { SetTypeSelect } from "../components/SetTypeSelect";
import { typeStore } from "../store/typeStore";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { CreateOrderForm } from "../components/CreateOrderForm";
import { OrderArea } from "../components/OrderArea";
import { orderStore } from "../store/orderStore";
const UserPage: React.FC = () => {
	const navigate = useNavigate();
	const { store } = useContext(Context);

	React.useEffect(() => {
		(async () => {
			await store.checkAuth();
			await typeStore.fetchTypes();
			await orderStore.fetchOrders(store.user.id);
		})();
	}, []);

	return (
		<div>
			{store.isLoading ? (
				"загрузка"
			) : (
				<>
					<Typography>Приветствую, вы авторизованы как {store.user.email}</Typography>
					<Typography>Вы пользователь</Typography>
					<Typography>
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

					<CreateOrderForm />

					<OrderArea />
				</>
			)}
		</div>
	);
};

export default observer(UserPage);
