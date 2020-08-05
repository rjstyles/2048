import React from "react";

export default function Cell({ number }) {
	let style = number ? "board__cell--" + number : "board__cell";
	return <div className={style}>{number}</div>;
}
