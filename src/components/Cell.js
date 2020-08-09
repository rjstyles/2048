import React, { useState, useEffect } from "react";

export default function Cell({ cell }) {
	const [style, setStyle] = useState("board__cell");
	const [number, setNumber] = useState(null);

	useEffect(() => {
		if (cell && cell.newCell) {
			let timer = setTimeout(() => {
				setNumber(cell.num);
				setStyle(
					cell && cell.num
						? `board__cell--${cell.num} board__cell__new`
						: "board__cell"
				);
			}, 250);

			return () => {
				clearTimeout(timer);
			};
		} else {
			setNumber(cell.num);
			setStyle(
				cell && cell.num ? "board__cell--" + cell.num : "board__cell"
			);
		}
	}, [cell]);

	return <div className={style}>{number}</div>;
}
