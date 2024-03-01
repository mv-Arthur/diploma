import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Store from "./store/store";
import { BrowserRouter } from "react-router-dom";

interface State {
	store: Store;
}

const store = new Store();

export const Context = createContext<State>({
	store,
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<Context.Provider
		value={{
			store,
		}}
	>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Context.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
