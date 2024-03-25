import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "..";
import { CreateTypeForm } from "../components/CreateTypeForm";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { TypesArea } from "../components/TypesArea";
import { orderStore } from "../store/orderStore";
import { OrderAdmin } from "../components/orderAdmin/OrderAdmin";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Drawer from "@mui/material/Drawer";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import TypeSpecimenIcon from "@mui/icons-material/TypeSpecimen";
const AdminPage = () => {
	const { store } = useContext(Context);

	React.useEffect(() => {
		(async () => {
			(async () => {
				await store.checkAuth();
				await orderStore.fetchOrders(store.user.id);
			})();
		})();
	}, []);

	return (
		<div>
			<OrderAdmin />
		</div>
	);
};

export default observer(AdminPage);
