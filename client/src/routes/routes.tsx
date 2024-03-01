import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import UserPage from "../pages/UserPage";

import PublicRoutes from "./publicRoutes";
import PrivateRoutes from "./privateRotes";
const CustomRouter: React.FC = () => {
	const { store } = useContext(Context);
	React.useEffect(() => {
		if (localStorage.getItem("token")) (async () => await store.checkAuth())();
	}, []);
	return <>{store.isAuth ? <PrivateRoutes /> : <PublicRoutes />}</>;
};

export default observer(CustomRouter);
