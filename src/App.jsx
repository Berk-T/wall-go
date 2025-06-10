import "./App.css";
import GameBoard from "./components/GameBoard";
import ScoreBoard from "./components/ScoreBoard";
import { useGameLogic } from "./hooks/useGameLogic";

function App() {
  const {
    board,
    currentPlayer,
    score,
    gameOver,
    handleWallClick,
    handleTileClick,
    resetGame,
  } = useGameLogic();

  return (
    <div className="bg min-h-screen flex flex-col items-center justify-start p-4">
      <h1 className="text-6xl font-extrabold text-white mb-4 drop-shadow-md">
        Wall Go
      </h1>

      <ScoreBoard
        score={score}
        gameOver={gameOver}
        currentPlayer={currentPlayer}
      />

      <GameBoard
        board={board}
        onWallClick={handleWallClick}
        onTileClick={handleTileClick}
      />

      <button
        onClick={resetGame}
        className="mt-6 px-6 py-2 cursor-pointer rounded-md bg-background/30 text-white font-semibold hover:bg-background/80 transition"
      >
        ↻ Reset
      </button>
    </div>
  );
}

export default App;
