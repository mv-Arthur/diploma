import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { typeStore } from "../../store/typeStore";
import React from "react";
import { API_URL } from "../../http";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActionArea, CardActions } from "@mui/material";
import classes from "./typesArea.module.css";
import nothinkImg from "../../static/nothinkTypes.png";
type AreaPropsType = {
	user?: boolean;
};

export const TypesArea: React.FC<AreaPropsType> = observer((props) => {
	React.useEffect(() => {
		typeStore.fetchTypes();
	}, []);
	console.log(typeStore.types);
	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
			{typeStore.types.length ? (
				typeStore.types.map((el) => {
					return (
						<Card key={el.id} sx={{ width: 300 }}>
							<CardActionArea>
								<CardMedia
									component="img"
									height="140"
									image={`${API_URL}/uploads/${el.fileName}`}
								/>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div">
										{el.name}
									</Typography>
									<Typography
										style={{ wordBreak: "break-all" }}
										variant="body2"
										color="text.secondary"
									>
										{el.description}
										<br />
										Минимальная цена - {el.minPrice}р
									</Typography>
								</CardContent>
							</CardActionArea>
							{props.user ? null : (
								<CardActions>
									<Button
										onClick={async () => await typeStore.fetchToDelete(el.id)}
										size="small"
										color="primary"
									>
										удалить
									</Button>
								</CardActions>
							)}
						</Card>
					);
				})
			) : (
				<div className={classes.imgBlock}>
					<Typography style={{ fontWeight: 100 }} variant="h4">
						Пока поддерживаемых услуг нет
					</Typography>
					<img src={nothinkImg} alt="" />
				</div>
			)}
		</div>
	);
});
