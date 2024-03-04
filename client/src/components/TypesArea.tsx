import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { typeStore } from "../store/typeStore";
import React from "react";

export const TypesArea = observer(() => {
	React.useEffect(() => {
		typeStore.fetchTypes();
	}, []);
	return (
		<div>
			{typeStore.types.length ? (
				typeStore.types.map((el) => {
					return (
						<Paper key={el.id} elevation={3}>
							<Typography>
								Тип: {el.type} Имя типа: {el.name}
								<button onClick={async () => await typeStore.fetchToDelete(el.id)}>
									x
								</button>
							</Typography>
						</Paper>
					);
				})
			) : (
				<Typography>пока типов нет</Typography>
			)}
		</div>
	);
});
