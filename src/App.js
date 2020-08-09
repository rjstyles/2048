import React, { useState } from "react";

import "./styles/App.scss";
import Board from "./components/Board";
import Header from "./components/Header";

function App() {
	const [score, setScore] = useState(0);
	const [dimension, setDimension] = useState({ row: 4, col: 4 });

	function handleGameReset() {
		setScore(0);
		setDimension((dim) => ({ ...dim }));
	}

	return (
		<div className="app">
			<Header score={score} handleGameReset={handleGameReset} />
			<Board dimension={dimension} score={score} setScore={setScore} />
		</div>
	);
}

export default App;
