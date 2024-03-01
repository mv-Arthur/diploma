import React, { useContext } from "react";
import { Context } from "..";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
	const { store } = useContext(Context);
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const navigate = useNavigate();
	console.log(email, password);
	return (
		<div>
			<input
				type="text"
				placeholder="email"
				value={email}
				onChange={(e) => setEmail(e.currentTarget.value)}
			/>
			<input
				type="text"
				placeholder="пароль"
				value={password}
				onChange={(e) => setPassword(e.currentTarget.value)}
			/>
			<button
				onClick={async () => {
					const result = await store.registration(email, password);
					if (result) {
						navigate("/user");
					}
				}}
			>
				зарегестрироваться
			</button>
			<button
				onClick={async () => {
					const result = await store.login(email, password);
					if (result) {
						navigate("/user");
					}
				}}
			>
				авторизоваться
			</button>
		</div>
	);
};
