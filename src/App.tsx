import { useState, useEffect } from "react";
import "./App.css";
import { toast } from "react-toastify";

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function generateSolvedBoard() {
  const base = [
    [1,2,3,4,5,6,7,8,9],
    [4,5,6,7,8,9,1,2,3],
    [7,8,9,1,2,3,4,5,6],
    [2,3,4,5,6,7,8,9,1],
    [5,6,7,8,9,1,2,3,4],
    [8,9,1,2,3,4,5,6,7],
    [3,4,5,6,7,8,9,1,2],
    [6,7,8,9,1,2,3,4,5],
    [9,1,2,3,4,5,6,7,8]
  ];

  const nums = shuffle([1,2,3,4,5,6,7,8,9]);
  return base.map(row => row.map(n => nums[n - 1]));
}

function generateBoard() {
  const solved = generateSolvedBoard();
  const puzzle = solved.map(row => [...row]);

  let removed = 0;
  while (removed < 45) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      removed++;
    }
  }

  return { puzzle, solved };
}

export default function Sudoku() {
  const [board, setBoard] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);

  function newGame() {
    const { puzzle, solved } = generateBoard();
    setBoard(puzzle);
    setSolution(solved);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    newGame();
  }, []);

  function handleChange(row: number, col: number, value: string) {
    const num = Number(value);
    if (!num || num < 1 || num > 9) return;

    if (num !== solution[row][col]) {
      toast("Errou! Novo jogo iniciado 😈", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      newGame();
      return;
    }

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);
  }

  return (
    <div className="container">
      <h1 className="title">Sudoku</h1>

      <div className="board">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isFixed = cell !== 0;

            return (
              <input
                key={`${r}-${c}`}
                value={cell === 0 ? "" : cell}
                disabled={isFixed}
                onChange={(e) => handleChange(r, c, e.target.value)}
                className={`cell ${isFixed ? "fixed" : "editable"} ${r % 3 === 0 ? "border-top" : ""} ${c % 3 === 0 ? "border-left" : ""} ${r === 8 ? "border-bottom" : ""} ${c === 8 ? "border-right" : ""}`}
              />
            );
          })
        )}
      </div>

      <button className="button" onClick={newGame}>
        Novo jogo
      </button>
    </div>
  );
}