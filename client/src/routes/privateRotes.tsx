import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import UserPage from "../pages/UserPage";
import Container from "@mui/material/Container";
import { LoginPage } from "../pages/LoginPage";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import AdminPage from "../pages/AdminPage";
import CHeader from "../components/CHeader";
import { CreateTypeForm } from "../components/CreateTypeForm";
import { TypesArea } from "../components/TypesArea";
import Typography from "@mui/material/Typography";
import { Office } from "../pages/office/Office";
const PrivateRoutes: React.FC = () => {
	const { store } = useContext(Context);
	React.useEffect(() => {
		(async () => await store.checkAuth())();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				<Route path={"/office"} element={<Office />} />
				{store.user.role === "admin" ? (
					<Route
						path={"/types"}
						element={
							<Container>
								<CreateTypeForm />

								<TypesArea />
							</Container>
						}
					/>
				) : (
					<Route
						path="/types"
						element={
							<Container>
								<Typography style={{ marginTop: "10px" }} variant="h4">
									Поддерживаемые услуги
								</Typography>
								<Typography>
									цена может меняться в зависимости от сложности и обьема работ
								</Typography>

								<TypesArea user />
							</Container>
						}
					/>
				)}
			</Routes>
		</div>
	);
};

export default observer(PrivateRoutes);
