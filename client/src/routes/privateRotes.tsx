import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import UserPage from "../pages/UserPage";
import { IUser } from "../models/IUser";
import { LoginPage } from "../pages/LoginPage";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import AdminPage from "../pages/AdminPage";
import CHeader from "../components/CHeader";
import { CreateTypeForm } from "../components/CreateTypeForm";
import { TypesArea } from "../components/TypesArea";
const PrivateRoutes: React.FC = () => {
	const { store } = useContext(Context);
	React.useEffect(() => {
		(async () => await store.checkAuth())();
	}, []);
	return (
		<div>
			<CHeader />
			<Routes>
				{store.user.role === "user" ? (
					<Route path={"/user"} element={<UserPage />} />
				) : (
					<Route path={"/user"} element={<AdminPage />} />
				)}
				<Route path={"/"} element={<LoginPage />} />

				{store.user.role === "admin" && (
					<Route
						path={"/types"}
						element={
							<div>
								<CreateTypeForm />

								<TypesArea />
							</div>
						}
					/>
				)}
			</Routes>
		</div>
	);
};

export default observer(PrivateRoutes);
