import type { GameMode, Marks } from "../types.ts";
import { useState } from "react";
import Logo from "../components/Logo";

function StartScreen({
  startGame,
}: {
  startGame: (selectedMark: Marks, gameMode: GameMode) => void;
}) {
  const [selectedMark, setSelectedMark] = useState<Marks>("O");

  return (
    <section className="start-screen container">
      <Logo />
      <div className="start-screen__player-selection">
        <p className="start-screen__text">PICK PLAYER 1'S MARK</p>
        <div className="start-screen__mark-options">
          <label className="start-screen__mark-label">
            <input
              className="start-screen__mark-input"
              checked={selectedMark === "X"}
              onChange={() => setSelectedMark("X")}
              type="radio"
              name="mark"
              value="X"
              aria-label="Choose X"
            />
            <svg
              className="icon-x-default"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-hidden="true"
            >
              <path
                d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z"
                fill-rule="evenodd"
              />
            </svg>
          </label>
          <label className="start-screen__mark-label">
            <input
              className="start-screen__mark-input"
              checked={selectedMark === "O"}
              onChange={() => setSelectedMark("O")}
              type="radio"
              name="mark"
              value="O"
              aria-label="Choose O"
            />
            <svg
              className="icon-o-default"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-hidden="true"
            >
              <path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" />
            </svg>
          </label>
        </div>
        <p className="start-screen__reminder">REMEMBER: X GOES FIRST</p>
      </div>
      <div className="start-screen__game-mode">
        <button
          className="start-screen__game-mode-btn start-screen__game-mode-btn-cpu"
          onClick={() => startGame(selectedMark, "CPU")}
        >
          NEW GAME (VS CPU)
        </button>
        <button
          className="start-screen__game-mode-btn start-screen__game-mode-btn-player"
          onClick={() => startGame(selectedMark, "PLAYER")}
        >
          NEW GAME (VS PLAYER)
        </button>
      </div>
    </section>
  );
}
export default StartScreen;
