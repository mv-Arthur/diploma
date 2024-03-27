import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import TextField from "@mui/material/TextField";
import { SetTypeSelect } from "./SetTypeSelect";
import Button from "@mui/material/Button";
import { typeStore } from "../store/typeStore";

import { Context } from "..";

import { orderStore } from "../store/orderStore";
import { Typography } from "@mui/material";

export const formItemStyle = {
	width: "210px",
	height: "56px",
};

const wrapperFormStyle = {
	display: "flex",
	gap: "10px",
	marginTop: 20,
};

export const CreateOrderForm = observer(() => {
	const [file, setFile] = React.useState<any>(null);
	const [description, setDescription] = React.useState("");
	const { store } = useContext(Context);
	const inputRef = React.useRef<null | HTMLInputElement>(null);
	const onSubmit = async () => {
		console.log(file, description, typeStore.current.type);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("description", description);
		formData.append("type", typeStore.current.type);
		console.log(formData);

		await orderStore.fetchAddOrder(store.user.id, formData);
	};

	return (
		<div style={wrapperFormStyle}>
			<input
				ref={inputRef}
				type="file"
				placeholder="загрузите файл"
				style={{ display: "none" }}
				onChange={(e) => {
					if (e.currentTarget.files) setFile(e.currentTarget.files[0]);
				}}
			/>
			<div>
				<Button
					variant="outlined"
					style={formItemStyle}
					onClick={() => {
						if (inputRef) {
							inputRef.current?.click();
						}
					}}
				>
					Выберете файл
				</Button>
				<Typography
					style={{
						textOverflow: "ellipsis",
						width: "210px",
						overflow: "hidden",
						whiteSpace: "nowrap",
					}}
				>
					{file && file.name ? file.name : null}
				</Typography>
			</div>
			<TextField
				style={formItemStyle}
				id="outlined-basic"
				label="введите описание"
				variant="outlined"
				onChange={(e) => {
					setDescription(e.currentTarget.value);
				}}
			/>
			<SetTypeSelect />
			<Button style={formItemStyle} variant="outlined" onClick={onSubmit}>
				заказать
			</Button>
		</div>
	);
});
