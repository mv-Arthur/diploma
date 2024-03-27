import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "..";
import { orderStore } from "../store/orderStore";
import { OrderAdmin } from "../components/orderAdmin/OrderAdmin";

const AdminPage = () => {
	const { store } = useContext(Context);

	React.useEffect(() => {
		(async () => {
			(async () => {
				await store.checkAuth();
				await orderStore.fetchOrders(store.user.id);
			})();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<OrderAdmin />
		</div>
	);
};

export default observer(AdminPage);
