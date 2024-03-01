import React from "react";
import { Route, Routes } from "react-router-dom";
import UserPage from "../pages/UserPage";
import { IUser } from "../models/IUser";
import { LoginPage } from "../pages/LoginPage";

const PrivateRoutes: React.FC = () => {
	return (
		<div>
			<Routes>
				<Route path={"/user"} element={<UserPage />} />
			</Routes>
		</div>
	);
};

export default PrivateRoutes;
