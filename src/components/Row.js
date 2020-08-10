import React from "react";

import Cell from "./Cell";

export default function Row({ row, rowId }) {
	return (
		<div className="board__row">
			{row.map((cell, id) => (
				<Cell key={`${rowId}${id}`} cell={cell} />
			))}
		</div>
	);
}
