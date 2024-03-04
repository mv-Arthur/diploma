import React from "react";
import { Order } from "../models/IOrder";
import Button from "@mui/material/Button";
type PropsType = {
	order: Order;
	handleDownload: (id: number) => void;
};

export const OrderComponent: React.FC<PropsType> = (props) => {
	return (
		<div>
			<div>описание: {props.order.description}</div>
			<div>цена: {props.order.price}</div>
			<div>статус: {props.order.message}</div>
			<div>тип: {props.order.name}</div>
			<div>
				файл <Button onClick={() => props.handleDownload(props.order.id)}>Скачать</Button>
			</div>
		</div>
	);
};
