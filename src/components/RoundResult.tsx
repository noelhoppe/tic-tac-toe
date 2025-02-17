import type { GameMode, Marks } from "../types.ts";

function RoundResult({
  winner,
  playerMark,
  gameMode,
  handleStartNextRound,
  handleQuitGame,
}: {
  winner: Marks | null;
  playerMark: Marks | null;
  gameMode: GameMode | null;
  handleStartNextRound: () => void;
  handleQuitGame: () => void;
}) {
  return (
    <div className="round-result-overlay">
      <div className="round-result">
        {gameMode === "CPU" ? (
          <p className="round-result__motivation">
            {winner === playerMark ? "YOU WON!" : "OH NO, YOU LOST..."}
          </p>
        ) : (
          <p className="round-result__motivation">
            {winner === "X" ? "Player 1 Wins!" : "Player 2 Wins!"}
          </p>
        )}

        <div className="round-result__winner-container">
          {winner === "O" ? (
            <svg
              className="icon-o-default"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" />
            </svg>
          ) : winner === "X" ? (
            <svg
              className="icon-x-default"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z"
                fill-rule="evenodd"
              />
            </svg>
          ) : (
            ""
          )}
          {!winner ? (
            <p
              className={`round-result__winner ${winner === "O" ? "color-o" : "color-x"}`}
            >
              ROUND TIED
            </p>
          ) : (
            <p
              className={`round-result__winner ${winner === "O" ? "color-o" : "color-x"}`}
            >
              TAKES THE ROUND
            </p>
          )}
        </div>
        <div className="round-result__btn-container">
          <button onClick={() => handleQuitGame()} className="btn btn-quit">
            Quit
          </button>
          <button
            onClick={() => handleStartNextRound()}
            className="btn btn-next-round"
          >
            Next Round
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoundResult;
