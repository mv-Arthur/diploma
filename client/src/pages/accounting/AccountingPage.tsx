import { observer } from "mobx-react-lite";
import React from "react";
import { accStore } from "../../store/accStore";
import classes from "./style.module.css";
import { GetAllAccResponse } from "../../models/response/AccResponse";
export const AccountingPage = observer(() => {
	const [current, setCurrent] = React.useState<GetAllAccResponse>();

	React.useEffect(() => {
		(async () => {
			try {
				await accStore.fetchReports();
				console.log(accStore.report);
			} catch (err) {
				console.log(err);
			}
		})();
	}, []);

	return (
		<div className={classes.area}>
			<div className={classes.left}>
				{accStore.report.map((report) => {
					return "";
				})}
			</div>
			<div className={classes.right}></div>
		</div>
	);
});
