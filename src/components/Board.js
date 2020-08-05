import React, { useState, useEffect, useCallback } from "react";

import "../styles/Board.scss";
import Cell from "./Cell";

export default function Board({ dimension }) {
	const [grid, setGrid] = useState(null);

	let addRandomCell = useCallback(
		(grid) => {
			// add new number randomly
			let randomRow = Math.floor(Math.random() * dimension);
			let randomCol = Math.floor(Math.random() * dimension);

			do {
				randomRow = Math.floor(Math.random() * dimension);
				randomCol = Math.floor(Math.random() * dimension);
			} while (grid[randomRow][randomCol] !== null);

			grid[randomRow][randomCol] = 2;
		},
		[dimension]
	);

	const handleArrowUp = useCallback(() => {
		var newGrid = grid.map((row) => row.slice());

		for (let col = 0; col < dimension; col++) {
			let tmpColToSlide = [];
			for (let row = 0; row < dimension; row++) {
				tmpColToSlide.push(grid[row][col]);
			}
			let colAfterSlide = slide(tmpColToSlide);
			for (let row = 0; row < dimension; row++) {
				newGrid[row][col] = colAfterSlide[row];
			}
		}

		addRandomCell(newGrid);
		setGrid(newGrid);
	}, [addRandomCell, dimension, grid]);

	const handleArrowDown = useCallback(() => {
		var newGrid = grid.map((row) => row.slice());

		for (let col = 0; col < dimension; col++) {
			let tmpColToSlide = [];
			for (let row = dimension - 1; row >= 0; row--) {
				tmpColToSlide.push(grid[row][col]);
			}
			let colAfterSlide = slide(tmpColToSlide);

			for (let row = 0; row < dimension; row++) {
				newGrid[dimension - row - 1][col] = colAfterSlide[row];
			}
		}

		addRandomCell(newGrid);
		setGrid(newGrid);
	}, [addRandomCell, dimension, grid]);

	const handleArrowLeft = useCallback(() => {
		var newGrid = grid.map((row) => row.slice());

		grid.forEach((row, i) => {
			let rowAfterSlide = slide(row);
			newGrid[i] = rowAfterSlide;
		});

		addRandomCell(newGrid);
		setGrid(newGrid);
	}, [addRandomCell, grid]);

	const handleArrowRight = useCallback(() => {
		var newGrid = grid.map((row) => row.slice());

		grid.forEach((row, i) => {
			let rowAfterSlide = slide(row.reverse()).reverse();
			newGrid[i] = rowAfterSlide;
		});

		addRandomCell(newGrid);
		setGrid(newGrid);
	}, [addRandomCell, grid]);

	const onKeyPress = useCallback(
		({ key }) => {
			switch (key) {
				case "ArrowUp":
					handleArrowUp();
					break;
				case "ArrowDown":
					handleArrowDown();
					break;
				case "ArrowLeft":
					handleArrowLeft();
					break;
				case "ArrowRight":
					handleArrowRight();
					break;
				default:
			}
		},
		[handleArrowDown, handleArrowLeft, handleArrowRight, handleArrowUp]
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
	}, [grid, onKeyPress]);

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
