import { observer } from "mobx-react-lite";
import React from "react";
import { orderStore } from "../store/orderStore";
import Button from "@mui/material/Button";
import $api, { API_URL } from "../http";
import { OrderComponent } from "./Order";
export const OrderArea = observer(() => {
	const handleDownload = (id: number) => {
		window.location.href = `${API_URL}/user/download/${id}`;
	};

	return (
		<div>
			{orderStore.orders.map((order) => {
				return <OrderComponent key={order.id} order={order} handleDownload={handleDownload} />;
			})}
		</div>
	);
});
