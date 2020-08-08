import React, { useState, useEffect, useCallback } from "react";

import "../styles/Board.scss";
import Cell from "./Cell";

export default function Board({ dimension }) {
	const [grid, setGrid] = useState(null);

	let addRandomCell = useCallback((grid) => {
		//check if any space left on the board
		if (!grid.some((row) => row.some((cell) => cell === null))) return;

		// add new number randomly
		let randomRow = Math.floor(Math.random() * grid.length);
		let randomCol = Math.floor(Math.random() * grid.length);

		do {
			randomRow = Math.floor(Math.random() * grid.length);
			randomCol = Math.floor(Math.random() * grid.length);
		} while (grid[randomRow][randomCol] !== null);

		grid[randomRow][randomCol] = 2;
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

			var newGrid = grid.map((row) => row.slice());

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

			addRandomCell(newGrid);
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
				return null;
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

		arr.forEach((num) => {
			if (num === null) return;

			if (stack.length === 0) {
				stack.push(num);
			} else {
				if (stack[stack.length - 1] === num) {
					stack.push(stack.pop() + num);
				} else {
					stack.push(num);
				}
			}
		});

		while (stack.length < arr.length) stack.push(null);

		return stack;
	}

	if (grid === null) return <div>Loading...</div>;

	return (
		<div className="board">
			{grid.map((row, i) => {
				return row.map((cell, j) => (
					<Cell key={`${i}${j}`} number={cell} />
				));
			})}
		</div>
	);
}
