import React, { useState, useEffect, useCallback } from "react";

import "../styles/Board.scss";
import Cell from "./Cell";

export default function Board({ dimension }) {
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
		for (let col = 0; col < grid.length; col++) {
			let tmpColToSlide = [];
			for (let row = 0; row < grid.length; row++) {
				tmpColToSlide.push(grid[row][col]);
			}
			let colAfterSlide = slide(tmpColToSlide);
			for (let row = 0; row < grid.length; row++) {
				grid[row][col] = colAfterSlide[row];
			}
		}
	}, []);

	const handleArrowDown = useCallback((grid) => {
		for (let col = 0; col < grid.length; col++) {
			let tmpColToSlide = [];
			for (let row = grid.length - 1; row >= 0; row--) {
				tmpColToSlide.push(grid[row][col]);
			}
			let colAfterSlide = slide(tmpColToSlide);

			for (let row = 0; row < grid.length; row++) {
				grid[grid.length - row - 1][col] = colAfterSlide[row];
			}
		}
	}, []);

	const handleArrowLeft = useCallback((grid) => {
		grid.forEach((row, i) => {
			let rowAfterSlide = slide(row);
			grid[i] = rowAfterSlide;
		});
	}, []);

	const handleArrowRight = useCallback((grid) => {
		grid.forEach((row, i) => {
			let rowAfterSlide = slide(row.reverse()).reverse();
			grid[i] = rowAfterSlide;
		});
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

			switch (key) {
				case "ArrowUp":
					handleArrowUp(newGrid);
					break;
				case "ArrowDown":
					handleArrowDown(newGrid);
					break;
				case "ArrowLeft":
					handleArrowLeft(newGrid);
					break;
				case "ArrowRight":
					handleArrowRight(newGrid);
					break;
				default:
			}

			addRandomCell(newGrid, true);
			setGrid(newGrid);
		},
		[
			grid,
			handleArrowDown,
			handleArrowLeft,
			handleArrowRight,
			handleArrowUp,
			addRandomCell,
		]
	);

	useEffect(() => {
		let newGrid = [];
		Array.from(Array(dimension)).forEach((r, i) => {
			let row = Array.from(Array(dimension)).map((c, j) => {
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

	function slide(arr) {
		let stack = [];

		arr.forEach((cell) => {
			if (cell.num === null) return;

			if (stack.length === 0) {
				stack.push({ ...cell });
			} else {
				if (stack[stack.length - 1].num === cell.num) {
					stack.push({
						num: stack.pop().num + cell.num,
						newCell: false,
					});
				} else {
					stack.push({ ...cell });
				}
			}
		});

		while (stack.length < arr.length)
			stack.push({ num: null, newCell: false });

		return stack;
	}

	if (grid === null) return <div>Loading...</div>;

	return (
		<div className="board">
			{grid.map((row, i) => {
				return row.map((cell, j) => (
					<Cell key={`${i}${j}`} cell={cell} />
				));
			})}
		</div>
	);
}
