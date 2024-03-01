import React from "react";

import { observer } from "mobx-react-lite";

import CustomRouter from "./routes/routes";

function App() {
	return (
		<div className="App">
			<CustomRouter />
		</div>
	);
}

export default observer(App);
