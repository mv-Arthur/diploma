import React, { ChangeEvent } from "react";
import { Order } from "../models/IOrder";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
type PropsType = {
	order: Order;
	handleDownload: (id: number) => void;
	editble?: boolean;
	handleGet?: (status: string, price: string, id: number) => void;
};

export const OrderComponent: React.FC<PropsType> = (props) => {
	const [status, setStatus] = React.useState(props.order.status);
	const [price, setPrice] = React.useState(props.order.price);
	const handleChange = (event: SelectChangeEvent) => {
		setStatus(event.target.value as string);
	};
	const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
		setPrice(e.currentTarget.value);
	};

	const clickHandler = () => {
		if (props.handleGet) props.handleGet(status, price, props.order.id);
	};

	return (
		<Paper style={{ width: "210px", height: "260px" }}>
			<div>описание: {props.order.description}</div>
			<div>
				цена:{" "}
				{props.editble ? (
					<TextField
						type="number"
						id="standard-basic"
						value={price}
						onChange={handleChangeText}
						label="цена"
						variant="standard"
					/>
				) : (
					props.order.price
				)}
			</div>
			<div>
				статус:{" "}
				{props.editble ? (
					<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
						<Select
							labelId="demo-simple-select-standard-label"
							id="demo-simple-select-standard"
							value={status}
							label="Статус"
							onChange={handleChange}
						>
							<MenuItem value={"pending"}>ожидает принятия</MenuItem>
							<MenuItem value={"job"}>в работе</MenuItem>
							<MenuItem value={"resolved"}>готово к выдаче</MenuItem>
						</Select>
					</FormControl>
				) : (
					props.order.message
				)}
			</div>
			<div>тип: {props.order.name}</div>
			<div>
				файл <Button onClick={() => props.handleDownload(props.order.id)}>Скачать</Button>
			</div>
			<div>{props.editble && <Button onClick={clickHandler}>Сохранить</Button>}</div>
		</Paper>
	);
};
