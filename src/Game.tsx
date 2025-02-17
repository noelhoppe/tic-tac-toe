import "./styles/components/game.css";
import "./styles/components/start-screen.css";
import { useEffect, useState } from "react";

type GameStats = {
  wins: number;
  ties: number;
  losses: number;
};
type GameMode = "CPU" | "PLAYER";
type Marks = "X" | "O";

export default function Game() {
  const [showStartScreen, setsShowStartScreen] = useState<boolean>(true);
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
    setsShowStartScreen(false);
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
    setsShowStartScreen(true);
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
          <GameStats
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

function Logo() {
  return (
    <svg
      className="game__logo"
      viewBox="0 0 72 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fill-rule="evenodd">
        <path
          d="M8.562 1.634 16 9.073l7.438-7.439a3 3 0 0 1 4.243 0l2.685 2.685a3 3 0 0 1 0 4.243L22.927 16l7.439 7.438a3 3 0 0 1 0 4.243l-2.685 2.685a3 3 0 0 1-4.243 0L16 22.927l-7.438 7.439a3 3 0 0 1-4.243 0L1.634 27.68a3 3 0 0 1 0-4.243L9.073 16 1.634 8.562a3 3 0 0 1 0-4.243L4.32 1.634a3 3 0 0 1 4.243 0Z"
          fill="#31C3BD"
        />
        <path
          d="M56.1 0c8.765 0 15.87 7.106 15.87 15.87 0 8.766-7.105 15.871-15.87 15.871-8.765 0-15.87-7.105-15.87-15.87C40.23 7.106 47.334 0 56.1 0Zm0 9.405a6.466 6.466 0 1 0 0 12.931 6.466 6.466 0 0 0 0-12.931Z"
          fill="#F2B137"
          fill-rule="nonzero"
        />
      </g>
    </svg>
  );
}

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

/**
 * Prüft, ob es einen Gewinner im Tic-Tac-Toe-Spiel gibt.
 *
 * Diese Funktion überprüft das Spielfeld auf eine der vordefinierten
 * Gewinnkombinationen. Falls eine Kombination gefunden wird, gibt sie den
 * Gewinner ("X" oder "O") und die entsprechende Gewinnreihe zurück.
 * Falls kein Gewinner existiert, wird `{ winner: null, winningSquares: null }` zurückgegeben.
 *
 * @param squares - Ein Array mit 9 Feldern, das den aktuellen Spielstatus repräsentiert.
 *                  Jedes Feld kann "X", "O" oder `null` enthalten.
 * @returns Ein Objekt mit den Eigenschaften:
 *          - `winner`: Der Gewinner ("X" oder "O") oder `null`, falls kein Gewinner existiert.
 *          - `winningSquares`: Ein Array mit den Indizes der Gewinnfelder oder `null`, falls kein Gewinner existiert.
 */
function calculateWinner(squares: (Marks | null)[]) {
  const WINNING_COMBINATIONS = [
    /* horizontal */
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    /* vertical */
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    /* diagonal */
    [0, 4, 8],
    [6, 4, 2],
  ];
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return { winner: null, winningSquares: null };
}

/**
 * Ermittelt alle verfügbaren Züge auf dem Spielfeld.
 * @param squares - Das Spielfeld als Array aus `null` oder `Marks`
 * @returns - Den Index aller freien Felder des Spielfeldes
 */
function getAvailableMoves(squares: (Marks | null)[]) {
  return squares
    .map((square, index) => (square === null ? index : null))
    .filter((index) => index !== null);
}

/**
 * Simuliert ein zufälliges Tic-Tac-Toe-Spiel ab dem aktuellen Spielstand.
 *
 * Die Funktion setzt zufällige Züge, bis entweder ein Gewinner feststeht oder keine weiteren Züge mehr möglich sind.
 * Der Gewinner des simulierten Spiels wird zurückgegeben oder `null`, falls es unentschieden endet.
 *
 * @param squares - Das aktuelle Spielfeld als Array aus `null`oder `Marks`
 * @param player - Der Spieler ('X' oder 'O') der den ersten Zug in der Simulation macht
 * @returns - Der Gewinner des Spiels (`"X"` oder `"O"`) oder `null` bei Unentschieden.
 */
function playRandomGame(squares: (Marks | null)[], player: Marks) {
  const tempSquares = [...squares];
  let currentPlayer = player;

  while (
    !calculateWinner(tempSquares).winner &&
    getAvailableMoves(tempSquares).length > 0
  ) {
    const moves = getAvailableMoves(tempSquares);
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    tempSquares[randomMove] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
  return calculateWinner(tempSquares).winner;
}

/**
 * Bestimmt den besten Zug mit Monte-Carlo-Simulationen.
 *
 * @param squares - Das aktuelle Spielfeld als Array.
 * @param player - Der aktuelle Spieler (`X` oder `O`).
 * @param simulations - Die Anzahl der durchzuführenden Simulationen (Standard: 1000).
 * @returns - Der Index des besten Zuges basierend auf den Simulationsergebnissen.
 */
function monteCarloMove(
  squares: (Marks | null)[],
  player: Marks,
  simulations: number = 1_000,
) {
  const moves = getAvailableMoves(squares);
  const scores: number[] = new Array(moves.length).fill(0);

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];

    for (let j = 0; j < simulations; j++) {
      const tempSquares = [...squares];
      tempSquares[move] = player;
      const result = playRandomGame(tempSquares, player === "X" ? "O" : "X");
      if (result === player) scores[i]++;
      else if (result === null) scores[i] += 0.5;
    }
  }
  const bestMoveIdx = scores.indexOf(Math.max(...scores));
  return moves[bestMoveIdx];
}
