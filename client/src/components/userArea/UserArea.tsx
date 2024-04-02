import React from "react";
import classes from "./userArea.module.css";
import { GetAllOrdersResponse } from "../../models/response/GetAllOrdersResponse";
import defaultAvatar from "../../static/defaultAvatar.jpg";
import { observer } from "mobx-react-lite";
import { API_URL } from "../../http";
import { Button, Typography } from "@mui/material";
import { orderAdminStore } from "../../store/orderAdminStore";
import { OrderComponent } from "../Order";
import userImg from "../../static/unauthtorizeImg.png";
import nothinkImg from "../../static/nothinkAdmin.png";
type Props = {
	currentUser: GetAllOrdersResponse | undefined;
	handleDownload: (id: number) => void;
	handleGet: (status: string, price: string, id: number) => void;
};

export const UserArea: React.FC<Props> = observer(({ currentUser, handleDownload, handleGet }) => {
	return (
		<>
			{!currentUser ? (
				<div className={classes.imgBlock}>
					<Typography style={{ fontWeight: 100 }} variant="h4">
						нет активных пользователей
					</Typography>
					<img src={userImg} alt="" />
				</div>
			) : (
				currentUser && (
					<div className={classes.personal}>
						<div className={classes.personalLeft}>
							<img
								src={
									currentUser.personal.avatar
										? `${API_URL}/uploads/${currentUser.personal.avatar}`
										: defaultAvatar
								}
								alt="avatar"
							/>
						</div>
						<div className={classes.personalRight}>
							<Typography>
								Фамилия{" "}
								<span style={{ fontWeight: 900 }}>{currentUser.personal.surname}</span>
							</Typography>
							<Typography>
								Имя <span style={{ fontWeight: 900 }}>{currentUser.personal.name}</span>
							</Typography>
							<Typography>
								Отчество{" "}
								<span style={{ fontWeight: 900 }}>{currentUser.personal.patronymic}</span>
							</Typography>
							<Typography>
								Номер телефона{" "}
								<span style={{ fontWeight: 900 }}>{currentUser.personal.phoneNumber}</span>
							</Typography>
							<div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
								<Button
									onClick={() =>
										orderAdminStore.fetchToSelectRole("admin", currentUser.id)
									}
									variant={currentUser.role === "admin" ? "contained" : "outlined"}
								>
									Администратор
								</Button>
								<Button
									onClick={() =>
										orderAdminStore.fetchToSelectRole("accounting", currentUser.id)
									}
									variant={currentUser.role === "accounting" ? "contained" : "outlined"}
								>
									Бухгалтер
								</Button>
								<Button
									onClick={() => orderAdminStore.fetchToSelectRole("user", currentUser.id)}
									variant={currentUser.role === "user" ? "contained" : "outlined"}
								>
									Пользователь
								</Button>
							</div>
						</div>
					</div>
				)
			)}
			<div className={classes.wrap}>
				{currentUser && currentUser.order.length
					? currentUser.order.map((order) => {
							return order.type ? (
								<OrderComponent
									editble
									key={order.id}
									order={order}
									handleDownload={handleDownload}
									handleGet={handleGet}
								/>
							) : (
								<div key={order.id}>не поддерживаемый тип</div>
							);
					  })
					: currentUser && (
							<div className={classes.imgBlock}>
								<Typography style={{ fontWeight: 100 }} variant="h4">
									заявок от этого пользователя пока нет
								</Typography>
								<img src={nothinkImg} alt="" />
							</div>
					  )}
			</div>
		</>
	);
});
