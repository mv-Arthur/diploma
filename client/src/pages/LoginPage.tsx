import React, { useContext } from "react";
import { Context } from "..";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
export const LoginPage = () => {
	const { store } = useContext(Context);
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const navigate = useNavigate();

	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Авторизация
					</Typography>
					<Typography>
						Для начала работы, пожалуйста, авторизуйтесь либо зарегестрируйтесь
					</Typography>
				</Toolbar>
			</AppBar>
			<Paper
				style={{
					width: "500px",
					height: "350px",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					margin: "0 auto",
					marginTop: "100px",
				}}
			>
				<div style={{ display: "flex", gap: 6 }}>
					<TextField
						type="text"
						label="email"
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
					/>
					<TextField
						type="text"
						label="пароль"
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
					/>
				</div>
				<div>
					<Button
						onClick={async () => {
							const result = await store.registration(email, password);
							if (result) {
								navigate("/user");
							}
						}}
					>
						зарегестрироваться
					</Button>
					/
					<Button
						onClick={async () => {
							const result = await store.login(email, password);
							if (result) {
								navigate("/user");
							}
						}}
					>
						авторизоваться
					</Button>
				</div>
			</Paper>
		</div>
	);
};
