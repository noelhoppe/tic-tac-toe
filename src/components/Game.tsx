import type { GameMode, Marks, GameStats } from "../types.ts";
import Logo from "./Logo.tsx";

function Header({
  nextPlayer,
  handleRestartRound,
}: {
  nextPlayer: Marks;
  handleRestartRound: () => void;
}) {
  return (
    <>
      <Logo />
      <div className="game__turn-indicator">
        <svg
          className="icon-x-default"
          style={{ display: nextPlayer === "O" ? "block" : "none" }}
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" />
        </svg>
        <svg
          className="icon-o-default"
          style={{ display: nextPlayer === "X" ? "block" : "none" }}
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z"
            fill-rule="evenodd"
          />
        </svg>
        <p>Turn</p>
      </div>
      <button onClick={() => handleRestartRound()} className="game__restart">
        <svg
          id="icon-restart"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.524 0h-1.88a.476.476 0 0 0-.476.499l.159 3.284A9.81 9.81 0 0 0 9.835.317C4.415.317-.004 4.743 0 10.167.004 15.597 4.406 20 9.835 20a9.796 9.796 0 0 0 6.59-2.536.476.476 0 0 0 .019-.692l-1.348-1.349a.476.476 0 0 0-.65-.022 6.976 6.976 0 0 1-9.85-.63 6.987 6.987 0 0 1 .63-9.857 6.976 6.976 0 0 1 10.403 1.348l-4.027-.193a.476.476 0 0 0-.498.476v1.881c0 .263.213.476.476.476h7.944A.476.476 0 0 0 20 8.426V.476A.476.476 0 0 0 19.524 0Z"
            fill="evenodd"
          />
        </svg>
      </button>
    </>
  );
}

function Board({
  squares,
  handleSquareClick,
  XIsNext,
  winningSquares,
}: {
  squares: (Marks | null)[];
  handleSquareClick: (index: number) => void;
  XIsNext: boolean;
  winningSquares: number[] | null;
}) {
  return (
    <>
      {squares.map((mark, index) => (
        <Square
          key={index}
          index={index}
          value={mark}
          onSquareClick={() => handleSquareClick(index)}
          XIsNext={XIsNext}
          winningSquares={winningSquares}
        />
      ))}
    </>
  );
}

function Square({
  value,
  index,
  onSquareClick,
  XIsNext,
  winningSquares,
}: {
  value: Marks | null;
  index: number;
  onSquareClick: () => void;
  XIsNext: boolean;
  winningSquares: number[] | null;
}) {
  const btnClass =
    value === "X" ? "selected-x" : value === "O" ? "selected-o" : "";

  const isWinningSquare = winningSquares?.includes(index);

  return (
    <button
      className={`game__square ${btnClass} ${XIsNext ? "hover-x" : "hover-o"} ${isWinningSquare ? (value === "X" ? "winning-x" : "winning-o") : ""}`}
      onClick={() => onSquareClick()}
    ></button>
  );
}

function GameStats({
  playerMark,
  gameMode,
  gameStats,
}: {
  playerMark: Marks | null;
  gameMode: GameMode | null;
  gameStats: GameStats;
}) {
  return (
    <>
      <div className="results-wrapper">
        {gameMode === "PLAYER" ? (
          <p>X (P1)</p>
        ) : playerMark === "X" ? (
          <p>X (YOU) </p>
        ) : (
          <p>X (CPU) </p>
        )}
        {playerMark === "X" ? (
          <p>{gameStats.wins}</p>
        ) : (
          <p>{gameStats.losses}</p>
        )}
      </div>
      <div className="results-wrapper">
        <p>Ties</p>
        <p>{gameStats.ties}</p>
      </div>
      <div className="results-wrapper">
        {gameMode === "PLAYER" ? (
          <p>O (P2)</p>
        ) : playerMark === "O" ? (
          <p>O (You)</p>
        ) : (
          <p>O (CPU)</p>
        )}
        {playerMark === "O" ? (
          <p>{gameStats.wins}</p>
        ) : (
          <p>{gameStats.losses}</p>
        )}
      </div>
    </>
  );
}

export { Header, Board, Square, GameStats };
