import { observer } from "mobx-react-lite";
import React from "react";
import { orderStore } from "../../store/orderStore";
import Button from "@mui/material/Button";
import $api, { API_URL } from "../../http";
import { OrderComponent } from "../Order";
import nothinkImg from "../../static/nothinkClient.png";
import classes from "./orderArea.module.css";
import { Typography } from "@mui/material";
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
				width: "100%",
				backgroundColor: "#F7F7F7",
				padding: "10px",
				borderRadius: "10px",
			}}
		>
			{orderStore.orders.length ? (
				orderStore.orders.map((order) => {
					return (
						<OrderComponent key={order.id} order={order} handleDownload={handleDownload} />
					);
				})
			) : (
				<div className={classes.imgBlock}>
					<Typography style={{ fontWeight: 100 }} variant="h3">
						Пока заявок нет{"("}
					</Typography>
					<img src={nothinkImg} alt="" />
				</div>
			)}
		</div>
	);
});
