import { observer } from "mobx-react-lite";
import React from "react";
import { orderStore } from "../store/orderStore";
import Button from "@mui/material/Button";
import $api, { API_URL } from "../http";
import { OrderComponent } from "./Order";

const orderAreaStyles = {
	display: "flex",
};

export const OrderArea = observer(() => {
	const handleDownload = (id: number) => {
		window.location.href = `${API_URL}/user/download/${id}`;
	};
	console.log(orderStore.orders);
	return (
		<div
			style={{
				display: "flex",
				gap: 10,
				flexWrap: "wrap",
				marginTop: 20,
				width: 878,
			}}
		>
			{orderStore.orders.length ? (
				orderStore.orders.map((order) => {
					return (
						<OrderComponent key={order.id} order={order} handleDownload={handleDownload} />
					);
				})
			) : (
				<h2>заявок нет</h2>
			)}
		</div>
	);
});
