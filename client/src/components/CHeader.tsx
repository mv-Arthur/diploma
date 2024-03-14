import { observer } from "mobx-react-lite";

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "..";
import { CreateTypeForm } from "../components/CreateTypeForm";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { TypesArea } from "../components/TypesArea";
import { orderStore } from "../store/orderStore";
import { OrderAdmin } from "../components/OrderAdmin";

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
const CHeader = () => {
	const [open, setOpen] = React.useState(false);
	const { store } = useContext(Context);
	const navigate = useNavigate();
	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen);
	};
	const DrawerList = (
		<Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
			<List>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/types")}>
						<ListItemIcon>
							{" "}
							<TypeSpecimenIcon />
						</ListItemIcon>
						<ListItemText primary={"Типы"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/user")}>
						<ListItemIcon>
							{" "}
							<SupervisedUserCircleIcon />
						</ListItemIcon>
						<ListItemText primary={"Пользователи"} />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);
	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					{store.user.role === "admin" && (
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2 }}
							onClick={toggleDrawer(true)}
						>
							<MenuIcon />
						</IconButton>
					)}
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Приветствую, вы авторизованы как {store.user.email}
						<Typography>
							Вы {store.user.role === "admin" ? "Администратор" : "Пользователь"}
						</Typography>
						<Typography>
							{store.user.isActivated
								? "подтвержденный аккаунт"
								: "пожалуйста, перейдите на почту и подтвердите аккаунт"}
						</Typography>
					</Typography>
					<Button
						color="inherit"
						onClick={async () => {
							await store.logout();
							navigate("/");
						}}
					>
						выход
					</Button>
				</Toolbar>
			</AppBar>
			<Drawer open={open} onClose={toggleDrawer(false)}>
				{DrawerList}
			</Drawer>
		</div>
	);
};

export default observer(CHeader);
