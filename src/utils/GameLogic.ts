import type { Marks } from "../types.ts";

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

export { calculateWinner, monteCarloMove };
