import React, { useContext } from "react";
import { IUser } from "../models/IUser";
import { observer } from "mobx-react-lite";
import { AuthService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { Context } from "..";

const UserPage: React.FC = () => {
	const navigate = useNavigate();
	const { store } = useContext(Context);

	React.useEffect(() => {
		(async () => await store.checkAuth())();
	}, []);

	return (
		<div>
			{store.isLoading ? (
				"загрузка"
			) : (
				<>
					<h2>Приветствую, вы авторизованы как {store.user.email}</h2>
					<h3>Вы {store.user.role === "admin" ? "администратор" : "пользователь"}</h3>
					<p>
						{store.user.isActivated
							? "подтвержденный аккаунт"
							: "пожалуйста, перейдите на почту и подтвердите аккаунт"}
					</p>
					<button
						onClick={async () => {
							await store.logout();
							navigate("/");
						}}
					>
						выход
					</button>

					<input type="file" placeholder="загрузите файл" />
					<input type="text" placeholder="введите описание" />
					<select name="выберете тип" id=""></select>
				</>
			)}
		</div>
	);
};

export default observer(UserPage);
