import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";
import { typeStore } from "../../store/typeStore";
import { API_URL } from "../../http";
import classes from "./fullType.module.css";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Button } from "@mui/material";
import { IOrderType } from "../../models/IOrderType";
import { orderAdminStore } from "../../store/orderAdminStore";
import tempAvatar from "../../static/defaultAvatar.jpg";
import { GetAllOrdersResponse } from "../../models/response/GetAllOrdersResponse";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
type FormValuesType = {
	name: string;
	minPrice: string;
	description: string;
};

class FormDto {
	name: string;
	minPrice: string;
	description: string;
	constructor(model: IOrderType) {
		this.name = model.name;
		this.minPrice = model.minPrice;
		this.description = model.description;
	}
}

type ChangeActionType = "name" | "minPrice" | "description";

export const FullType = observer(() => {
	const [editMode, setEditMode] = React.useState(false);
	const [formData, setFormData] = React.useState<FormValuesType>({} as FormValuesType);
	const [current, setCurrent] = React.useState<GetAllOrdersResponse>({} as GetAllOrdersResponse);

	const params = useParams();
	const typeId = Number(params.id);
	const type = React.useMemo(() => {
		const founded = typeStore.types.find((type) => type.id === typeId);
		if (founded) setFormData(new FormDto(founded));
		return founded;
	}, [typeId]);

	const operators = React.useMemo(
		() =>
			orderAdminStore.ordersForUsers.filter((user) => user.role === "operator" && !user.typeId),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[orderAdminStore.ordersForUsers]
	);

	const attachedOperator = React.useMemo(
		() =>
			orderAdminStore.ordersForUsers.find((operator) => {
				return operator.typeId === typeId;
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[orderAdminStore.ordersForUsers]
	);
	console.log(operators);
	React.useEffect(() => {
		const cb = (e: KeyboardEvent) => {
			if (e.key === "Escape") setCurrent({} as GetAllOrdersResponse);
		};
		orderAdminStore.fetchingOrders();

		document.addEventListener("keydown", cb);
		return () => document.removeEventListener("keydown", cb);
	}, []);

	const switchEditMode = (bol: boolean) => setEditMode(bol);

	const onAttach = async (userId: number, typeId: number) => {
		await orderAdminStore.fetchToAttach(userId, typeId);
	};

	const onUnattach = async (id: number) => {
		await orderAdminStore.fetchToUnattach(id);
	};

	const changeAction = (type: ChangeActionType, value: string) => {
		switch (type) {
			case "description":
				setFormData((prev) => ({ ...prev, description: value }));
				break;
			case "minPrice":
				setFormData((prev) => ({ ...prev, minPrice: value }));
				break;
			case "name":
				setFormData((prev) => ({ ...prev, name: value }));
		}
	};

	return (
		<div className={classes.main}>
			{!!orderAdminStore.snackbar && (
				<Snackbar
					open
					anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
					onClose={() => orderAdminStore.setSnackBar(null)}
					autoHideDuration={6000}
				>
					<Alert
						{...orderAdminStore.snackbar}
						onClose={() => orderAdminStore.setSnackBar(null)}
					/>
				</Snackbar>
			)}
			<div className={classes.left}>
				{type ? (
					<div className={classes.block}>
						<div className={classes.btngroup}>
							<Button
								onClick={() => switchEditMode(false)}
								variant={!editMode ? "contained" : "text"}
							>
								<RemoveRedEyeIcon />
							</Button>
							<Button
								onClick={() => switchEditMode(true)}
								variant={editMode ? "contained" : "text"}
							>
								<EditIcon />
							</Button>
						</div>
						<div className={classes.imgBlock}>
							<img src={`${API_URL}/uploads/${type?.fileName}`} alt="type promo" />
						</div>
						<div className={classes.grid}>
							<div className={classes.promoItem + " " + classes.name}>
								<div>Наименование</div>
								<br />
								{editMode ? (
									<input
										onChange={(e) => changeAction("name", e.currentTarget.value)}
										value={formData.name}
										placeholder="введите новое наименование"
										className={classes.input}
										type="text"
									/>
								) : (
									<p>{type.name}</p>
								)}
							</div>
							<div className={classes.promoItem + " " + classes.minPrice}>
								<div>Минимальная цена</div>
								<br />
								{editMode ? (
									<input
										value={formData.minPrice}
										onChange={(e) => changeAction("minPrice", e.currentTarget.value)}
										placeholder="введите новую мин. цену"
										className={classes.input}
										type="text"
									/>
								) : (
									<p>{type.minPrice} рублей</p>
								)}
							</div>
							<div className={classes.promoItem + " " + classes.descr}>
								<div>Описание</div>
								<br />
								{editMode ? (
									<textarea
										value={formData.description}
										onChange={(e) => changeAction("description", e.currentTarget.value)}
										placeholder="введите новое описание"
										className={classes.textarea}
									/>
								) : (
									<p>{type.description}</p>
								)}
							</div>
						</div>
						<div></div>
					</div>
				) : (
					<div>не найдено</div>
				)}
			</div>
			<div className={classes.right}>
				{attachedOperator ? (
					<div>
						<div className={classes.rightHeader}>За обработку этих заявок отвечает:</div>
						<div className={classes.attachedOperator} style={{ cursor: "default" }}>
							<div className={classes.attachedInfoBlock}>
								<img
									src={
										attachedOperator.personal.avatar
											? `${API_URL}/uploads/${attachedOperator.personal.avatar}`
											: tempAvatar
									}
									alt="avatar"
								/>
								<div className={classes.attachedTextWrap}>
									<div className={classes.attachedPersonal}>
										{attachedOperator.personal.surname
											? `${attachedOperator.personal.surname} ${attachedOperator.personal.name} ${attachedOperator.personal.name}`
											: "Личные данные не заполнены"}
									</div>
									<div className={classes.attachedPhoneNumber}>
										{attachedOperator.personal.phoneNumber
											? `${attachedOperator.personal.phoneNumber}`
											: "номер не указан"}
									</div>
								</div>
							</div>
							<div className={classes.attachedBtn}>
								<Button onClick={() => onUnattach(typeId)}>
									Открепить{" "}
									<GroupRemoveIcon style={{ transform: "translate(7px, -2px)" }} />
								</Button>
							</div>
						</div>
						<div>here</div>
					</div>
				) : (
					<div>
						<div className={classes.rightHeader}>Закрепите оператора за услугой</div>
						<Button
							style={{ display: "block", margin: "0 auto", marginTop: "20px" }}
							disabled={!current.id}
							onClick={() => onAttach(current.id, typeId)}
						>
							закрепить
							<GroupAddIcon style={{ transform: "translate(10px, 6px)" }} />
						</Button>
						{operators.length ? (
							operators.map((operator) => {
								console.log(operator.personal.avatar);
								return (
									<div
										onClick={() => setCurrent(operator)}
										key={operator.id}
										className={classes.operator}
										style={
											current.id === operator.id ? { backgroundColor: "#f7f7f7" } : {}
										}
									>
										<img
											src={
												operator.personal.avatar
													? `${API_URL}/uploads/${operator.personal.avatar}`
													: tempAvatar
											}
											alt="avatar"
										/>
										<div className={classes.textWrap}>
											<div className={classes.personal}>
												{!operator.personal.surname
													? "Нет личных данных"
													: `${operator.personal.surname} ${operator.personal.name} ${operator.personal.patronymic}`}
											</div>
											<div className={classes.phoneNumber}>
												{operator.personal.phoneNumber
													? operator.personal.phoneNumber
													: "Номер не указан"}
											</div>
										</div>
									</div>
								);
							})
						) : (
							<div>нет активных операторов</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
});
