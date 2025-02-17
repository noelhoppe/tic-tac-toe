import "./styles/components/game.css";
import "./styles/components/start-screen.css";
import { useEffect, useState } from "react";
import type { GameStats, GameMode, Marks } from "./types.ts";
import { calculateWinner, monteCarloMove } from "./utils/GameLogic.ts";
import StartScreen from "./components/StartScreen.tsx";
import {
  Header,
  Board,
  GameStats as GameStatsComponent,
} from "./components/Game.tsx";
import RoundResult from "./components/RoundResult.tsx";

export default function App() {
  const [showStartScreen, setShowStartScreen] = useState<boolean>(true);
  const [XIsNext, setXIsNext] = useState<boolean>(true);
  const [playerMark, setPlayerMark] = useState<Marks | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [squares, setSquares] = useState<(Marks | null)[]>(Array(9).fill(null));
  const [gameStats, setGameStats] = useState<GameStats>({
    wins: 0,
    ties: 0,
    losses: 0,
  });
  const { winner, winningSquares } = calculateWinner(squares);
  const isFinished =
    squares.every((square) => square !== null) ||
    winner === "X" ||
    winner === "O";

  /**
   * Initialisiert ein neues Spiel mit dem ausgewählten Markenzeichen und Spielmodus.
   *
   * Diese Funktion setzt den Spielzustand zurück, einschließlich des Spielbretts, der Spielerreihenfolge und der Spielstatistiken.
   * Sie blendet auch den Startbildschirm aus und startet das Spiel mit dem angegebenen Markenzeichen (entweder "X" oder "O")
   * und dem gewählten Spielmodus (z. B. Einzelspieler oder Mehrspieler).
   *
   * @param selectedMark - Das vom Spieler ausgewählte Markenzeichen ("X" oder "O").
   * @param gameMode - Der Spielmodus, der entweder "CPU" für Einzelspieler gegen den Computer oder "PLAYER" für Mehrspieler ist.
   */
  function initializeGame(selectedMark: Marks, gameMode: GameMode) {
    setShowStartScreen(false);
    setXIsNext(true);
    setPlayerMark(selectedMark);
    setGameMode(gameMode);
    setSquares(Array(9).fill(null));
    setGameStats({ wins: 0, ties: 0, losses: 0 });
  }

  /**
   * Führt einen Spielzug aus, falls das Feld frei ist und das Spiel noch keinen Gewinner hat.
   *
   * @param idx - Der Index des Feldes im Spielfeld-Array, auf das der Spieler setzen möchte.
   * @returns void - Falls das Feld bereits belegt ist oder das Spiel vorbei ist, wird die Funktion frühzeitig beendet.
   */
  function makeMove(idx: number) {
    const copy_squares = [...squares];
    if (
      copy_squares[idx] !== null ||
      calculateWinner(copy_squares).winner !== null
    )
      return;
    copy_squares[idx] = XIsNext ? "X" : "O";
    setSquares(copy_squares);
    setXIsNext(!XIsNext);
  }

  useEffect(() => {
    updateGameStats(
      calculateWinner(squares).winner,
      squares.every((value) => value !== null),
    );
  }, [squares]);

  useEffect(() => {
    const winner = calculateWinner(squares).winner;
    const isDraw = squares.every((value) => value !== null);
    if (
      !winner &&
      !isDraw &&
      gameMode === "CPU" &&
      (XIsNext ? "X" : "O") !== playerMark
    ) {
      setTimeout(() => {
        const bestMove = monteCarloMove(squares, XIsNext ? "X" : "O");

        const newSquares = [...squares];
        newSquares[bestMove] = XIsNext ? "X" : "O";

        setSquares(newSquares);
        setXIsNext(!XIsNext);
      }, 500);
    }
  }, [squares, XIsNext, gameMode, playerMark]);

  /**
   * Aktualisiert die Spielstatistiken (Siege, Niederlagen, Unentschieden).
   *
   * Falls das Spiel unentschieden endet, wird die Anzahl der Unentschieden erhöht.
   * Falls es einen Gewinner gibt, wird geprüft, ob der Spieler gewonnen oder verloren hat,
   * und die entsprechenden Statistiken werden angepasst.
   *
   * @param winner - Das Markenzeichen des Gewinners ("X" oder "O"), oder `null` falls kein Gewinner existiert.
   * @param isDraw - Ein boolescher Wert, der angibt, ob das Spiel unentschieden ausgegangen ist.
   */
  function updateGameStats(winner: Marks | null, isDraw: boolean): void {
    setGameStats((prevStats) => {
      if (isDraw) return { ...prevStats, ties: prevStats.ties + 1 };
      if (!winner) return prevStats;

      return winner === playerMark
        ? { ...prevStats, wins: prevStats.wins + 1 }
        : { ...prevStats, losses: prevStats.losses + 1 };
    });
  }

  /**
   * Startet eine neue Runde mit den vorherigen Einstellungen, ohne dabei die Spielstatistik zurückzusetzen.
   */
  function restartRound() {
    setXIsNext(true);
    setSquares(Array(9).fill(null));
  }

  /**
   * Verlasse das aktuelle Spiel und kehre zum Startbildschirm zurück.
   */
  function quitGame() {
    setShowStartScreen(true);
    setXIsNext(true);
    setPlayerMark(null);
    setGameMode(null);
    setSquares(Array(9).fill(null));
    setGameStats({ wins: 0, ties: 0, losses: 0 });
  }

  return showStartScreen ? (
    <StartScreen startGame={initializeGame} />
  ) : (
    <>
      <section className="game container">
        <div className="game__header">
          <Header
            nextPlayer={XIsNext ? "X" : "O"}
            handleRestartRound={restartRound}
          />
        </div>
        <div className="game__board">
          <Board
            squares={squares}
            handleSquareClick={makeMove}
            XIsNext={XIsNext}
            winningSquares={winningSquares}
          />
        </div>
        <div className="game__results">
          <GameStatsComponent
            playerMark={playerMark}
            gameMode={gameMode}
            gameStats={gameStats}
          />
        </div>
      </section>
      {isFinished ? (
        <RoundResult
          winner={winner}
          playerMark={playerMark}
          gameMode={gameMode}
          handleStartNextRound={restartRound}
          handleQuitGame={quitGame}
        />
      ) : (
        ""
      )}
      ;
    </>
  );
}
