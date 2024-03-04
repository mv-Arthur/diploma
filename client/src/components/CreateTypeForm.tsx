import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { typeStore } from "../store/typeStore";
export const CreateTypeForm = observer(() => {
	const [typeUnique, setTypeUnique] = React.useState<string>("");
	const [name, setName] = React.useState<string>("");

	const onSubmit = () => {
		typeStore.addNewFetch(name, typeUnique);
	};

	return (
		<Box
			component="form"
			sx={{
				"& > :not(style)": { m: 1, width: "25ch" },
			}}
			noValidate
			autoComplete="off"
		>
			<Typography variant="h6" gutterBottom>
				Здесь добавляются новые поддерживаемые услуги
			</Typography>
			<Typography variant="h6" gutterBottom>
				Важно, чтобы тип был уникальным значением
			</Typography>
			<TextField
				onChange={(e) => setTypeUnique(e.currentTarget.value)}
				id="outlined-basic"
				label="введите тип"
				variant="outlined"
			/>
			<TextField
				onChange={(e) => setName(e.currentTarget.value)}
				id="outlined-basic"
				label="введтие название типа"
				variant="outlined"
			/>
			<Button onClick={onSubmit} variant="contained">
				добавить
			</Button>
		</Box>
	);
});
