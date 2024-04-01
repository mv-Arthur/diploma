import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { typeStore } from "../../store/typeStore";
import { v4 } from "uuid";
import classes from "./createTypeForm.module.css";
export const CreateTypeForm = observer(() => {
	const [name, setName] = React.useState<string>("");
	const [file, setFile] = React.useState<any>(null);
	const [description, setDescription] = React.useState<string>("");
	const [minPrice, setMinPrice] = React.useState("");
	const inputFileRef = React.useRef<HTMLInputElement>(null);
	const onSubmit = () => {
		const formData = new FormData();
		const type = v4();
		formData.append("name", name);
		formData.append("type", type);
		formData.append("file", file);
		formData.append("description", description);
		formData.append("minPrice", minPrice);
		typeStore.addNewFetch(formData);
	};

	return (
		<>
			<input
				onChange={(e) => {
					if (e.currentTarget.files) setFile(e.currentTarget.files[0]);
				}}
				type="file"
				ref={inputFileRef}
				style={{ display: "none" }}
			/>
			<div className={classes.container}>
				<div className={classes.wrap}>
					<div>
						<Button
							onClick={() => inputFileRef.current && inputFileRef.current.click()}
							variant="contained"
						>
							Прикрепить
						</Button>
						<Typography
							style={{
								textOverflow: "ellipsis",
								width: "127px",
								overflow: "hidden",
								whiteSpace: "nowrap",
								fontSize: "13px",
								fontWeight: 100,
							}}
						>
							{file && file.name ? file.name : "не прикреплен"}
						</Typography>
					</div>
					<TextField
						onChange={(e) => setName(e.currentTarget.value)}
						value={name}
						id="outlined-basic"
						label="введтие название типа"
						variant="outlined"
						style={{ backgroundColor: "#fff" }}
					/>

					<TextField
						onChange={(e) => setMinPrice(e.currentTarget.value)}
						value={minPrice}
						id="outlined-basic"
						label="минимальная цена"
						variant="outlined"
						type="number"
						style={{ backgroundColor: "#fff" }}
					/>
				</div>
				<div className={classes.areaWrap}>
					<textarea
						onChange={(e) => {
							setDescription(e.currentTarget.value);
						}}
						value={description}
						className={classes.textArea}
						placeholder="Введите описание"
					/>
					<Button
						style={{ height: 56, backgroundColor: "#fff", width: 210, marginTop: "10px" }}
						onClick={onSubmit}
						variant="outlined"
					>
						добавить
					</Button>
				</div>
			</div>
		</>
	);
});
