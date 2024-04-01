import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "..";
import { orderStore } from "../store/orderStore";
import { OrderAdmin } from "../components/orderAdmin/OrderAdmin";
import { Button } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { orderAdminStore } from "../store/orderAdminStore";
const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	height: 300,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
};
const AdminPage = () => {
	const { store } = useContext(Context);
	const [open, setOpen] = React.useState(false);
	React.useEffect(() => {
		(async () => {
			(async () => {
				await store.checkAuth();
				await orderStore.fetchOrders(store.user.id);
			})();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	return (
		<div>
			<OrderAdmin />
			<Button
				onClick={handleOpen}
				variant="outlined"
				style={{ position: "fixed", right: 100, bottom: 50 }}
			>
				Отправить отчет <ArticleIcon style={{ marginLeft: "5px" }} />
			</Button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Отправка отчета
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						ВНИМАНИЕ! все заявки со статусом "готово к выдаче" и "отклонено" будут удалены из
						вашей рабочей области и отправлены в бухгалтерию, уверены что хотите продолжить?
					</Typography>
					<div style={{ position: "absolute", bottom: 20, right: 20 }}>
						<Button
							onClick={async () => {
								handleClose();
								await orderAdminStore.setReport();
							}}
						>
							да
						</Button>
						<Button onClick={handleClose}>нет</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default observer(AdminPage);
