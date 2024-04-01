import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import TextField from "@mui/material/TextField";
import { SetTypeSelect } from "../SetTypeSelect";
import Button from "@mui/material/Button";
import { typeStore } from "../../store/typeStore";
import SimpleMDE from "react-simplemde-editor";
import { Context } from "../..";
import classes from "./orderForm.module.css";
import { orderStore } from "../../store/orderStore";
import { Typography } from "@mui/material";

export const formItemStyle = {
	width: "210px",
	height: "56px",
	backgroundColor: "#fff",
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
		<>
			<input
				ref={inputRef}
				type="file"
				style={{ display: "none" }}
				onChange={(e) => {
					if (e.currentTarget.files) setFile(e.currentTarget.files[0]);
				}}
			/>
			<div className={classes.container}>
				<div className={classes.wrapper}>
					<div>
						<Button
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

					<SetTypeSelect />

					<textarea
						onChange={(e) => {
							setDescription(e.currentTarget.value);
						}}
						value={description}
						className={classes.textArea}
						placeholder="Введите описание"
					/>
				</div>
				<Button style={{ ...formItemStyle, marginTop: 10 }} onClick={onSubmit}>
					заказать
				</Button>
			</div>
		</>
	);
});
