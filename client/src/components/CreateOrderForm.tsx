import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import TextField from "@mui/material/TextField";
import { SetTypeSelect } from "./SetTypeSelect";
import Button from "@mui/material/Button";
import { typeStore } from "../store/typeStore";
import $api from "../http";
import { Context } from "..";
import { OrderService } from "../services/OrderService";
import { orderStore } from "../store/orderStore";
export const CreateOrderForm = observer(() => {
	const [file, setFile] = React.useState<any>(null);
	const [description, setDescription] = React.useState("");
	const { store } = useContext(Context);
	const onSubmit = async () => {
		console.log(file, description, typeStore.current.type);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("description", description);
		formData.append("type", typeStore.current.type);
		console.log(formData);
		try {
			await orderStore.fetchAddOrder(store.user.id, formData);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<input
				type="file"
				placeholder="загрузите файл"
				onChange={(e) => {
					if (e.currentTarget.files) setFile(e.currentTarget.files[0]);
				}}
			/>

			<TextField
				id="outlined-basic"
				label="введите описание"
				variant="outlined"
				onChange={(e) => {
					setDescription(e.currentTarget.value);
				}}
			/>
			<SetTypeSelect />
			<Button variant="outlined" onClick={onSubmit}>
				заказать
			</Button>
		</div>
	);
});
