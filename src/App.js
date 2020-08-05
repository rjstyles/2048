import React from "react";
import "./styles/App.scss";
import Board from "./components/Board";

function App() {
	let dimension = 4;

	return (
		<div className="app">
			<Board dimension={dimension} />
		</div>
	);
}

export default App;
