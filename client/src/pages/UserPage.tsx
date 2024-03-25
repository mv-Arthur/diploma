import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { typeStore } from "../store/typeStore";
import { CreateOrderForm } from "../components/CreateOrderForm";
import { OrderArea } from "../components/OrderArea";
import { orderStore } from "../store/orderStore";
import Container from "@mui/material/Container";

const UserPage: React.FC = () => {
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
					<Container>
						<CreateOrderForm />

						<OrderArea />
					</Container>
				</>
			)}
		</div>
	);
};

export default observer(UserPage);
