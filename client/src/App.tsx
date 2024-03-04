import React, { useContext } from "react";

import { observer } from "mobx-react-lite";

import CustomRouter from "./routes/routes";
import { Context } from ".";
import { useNavigate } from "react-router-dom";

function App() {
	const { store } = useContext(Context);
	const navigate = useNavigate();
	React.useEffect(() => {
		if (localStorage.getItem("token")) {
			(async () => {
				await store.checkAuth();
				navigate("/user");
			})();
		}
	}, []);
	return (
		<div className="App">
			<CustomRouter isAuth={store.isAuth} />
		</div>
	);
}

export default observer(App);
