import React, { useState, useEffect, useCallback } from "react";

import "../styles/Board.scss";
import Row from "./Row";

export default function Board({ dimension, score, setScore }) {
	const [grid, setGrid] = useState(null);

	let addRandomCell = useCallback((grid, newCell = false) => {
		//check if any space left on the board
		if (!grid.some((row) => row.some((cell) => cell.num === null))) return;

		// add new number randomly
		let randomRow = Math.floor(Math.random() * grid.length);
		let randomCol = Math.floor(Math.random() * grid.length);

		do {
			randomRow = Math.floor(Math.random() * grid.length);
			randomCol = Math.floor(Math.random() * grid.length);
		} while (grid[randomRow][randomCol].num !== null);

		grid[randomRow][randomCol] = { num: 2, newCell };
	}, []);

	const handleArrowUp = useCallback((grid) => {
		let scoreAdded = 0;
		for (let col = 0; col < grid.length; col++) {
			let tmpColToSlide = [];
			for (let row = 0; row < grid.length; row++) {
				tmpColToSlide.push(grid[row][col]);
			}
			let { cellsAfterSlide, addScore } = slide(tmpColToSlide);
			for (let row = 0; row < grid.length; row++) {
				grid[row][col] = cellsAfterSlide[row];
			}
			scoreAdded += addScore;
		}
		return scoreAdded;
	}, []);

	const handleArrowDown = useCallback((grid) => {
		let scoreAdded = 0;
		for (let col = 0; col < grid.length; col++) {
			let tmpColToSlide = [];
			for (let row = grid.length - 1; row >= 0; row--) {
				tmpColToSlide.push(grid[row][col]);
			}
			let { cellsAfterSlide, addScore } = slide(tmpColToSlide);

			for (let row = 0; row < grid.length; row++) {
				grid[grid.length - row - 1][col] = cellsAfterSlide[row];
			}
			scoreAdded += addScore;
		}
		return scoreAdded;
	}, []);

	const handleArrowLeft = useCallback((grid) => {
		let scoreAdded = 0;
		grid.forEach((row, i) => {
			let { cellsAfterSlide, addScore } = slide(row);
			grid[i] = cellsAfterSlide;
			scoreAdded += addScore;
		});
		return scoreAdded;
	}, []);

	const handleArrowRight = useCallback((grid) => {
		let scoreAdded = 0;
		grid.forEach((row, i) => {
			let { cellsAfterSlide, addScore } = slide(row.reverse());
			grid[i] = cellsAfterSlide.reverse();
			scoreAdded += addScore;
		});
		return scoreAdded;
	}, []);

	const onKeyPress = useCallback(
		({ key }) => {
			if (
				!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
					key
				)
			)
				return;

			var newGrid = grid.map((row) => {
				return row.map((cell) => {
					return cell
						? {
								num: cell.num,
								newCell: false,
						  }
						: null;
				});
			});

			let scoreToAdd = 0;

			switch (key) {
				case "ArrowUp":
					scoreToAdd = handleArrowUp(newGrid);
					break;
				case "ArrowDown":
					scoreToAdd = handleArrowDown(newGrid);
					break;
				case "ArrowLeft":
					scoreToAdd = handleArrowLeft(newGrid);
					break;
				case "ArrowRight":
					scoreToAdd = handleArrowRight(newGrid);
					break;
				default:
			}

			addRandomCell(newGrid, true);
			setGrid(newGrid);
			setScore(score + scoreToAdd);
		},
		[
			grid,
			score,
			setScore,
			handleArrowDown,
			handleArrowLeft,
			handleArrowRight,
			handleArrowUp,
			addRandomCell,
		]
	);

	useEffect(() => {
		let newGrid = [];
		Array.from(Array(dimension.row)).forEach((r, i) => {
			let row = Array.from(Array(dimension.col)).map((c, j) => {
				return { num: null, newCell: false };
			});
			newGrid.push(row);
		});

		//add two random cells
		addRandomCell(newGrid);
		addRandomCell(newGrid);

		setGrid(newGrid);
	}, [dimension, addRandomCell]);

	useEffect(() => {
		// initiate the event handler
		window.addEventListener("keydown", onKeyPress, false);
		// this will clean up the event every time the component is re-rendered
		return function cleanup() {
			window.removeEventListener("keydown", onKeyPress);
		};
	}, [onKeyPress]);

	function slide(cellsToSlide) {
		let cellsAfterSlide = [];
		let prev = null;
		let addScore = 0;

		cellsToSlide.forEach((cell) => {
			if (cell.num === null) return;
			if (prev === null) {
				prev = cell.num;
			} else {
				if (prev === cell.num) {
					cellsAfterSlide.push({
						num: prev + cell.num,
						newCell: false,
					});
					addScore += prev + cell.num;
					prev = null;
				} else {
					cellsAfterSlide.push({
						num: prev,
						newCell: false,
					});
					prev = cell.num;
				}
			}
		});

		if (prev) cellsAfterSlide.push({ num: prev, newCell: false });

		while (cellsAfterSlide.length < cellsToSlide.length)
			cellsAfterSlide.push({
				num: null,
				newCell: false,
			});

		return { cellsAfterSlide, addScore };
	}

	if (grid === null) return <div>Loading...</div>;

	return (
		<div className="board">
			{grid.map((row, i) => {
				return <Row key={i} row={row} />;
			})}
		</div>
	);
}
