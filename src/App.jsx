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
  } = useGameLogic();

  return (
    <div className="bg-gradient-to-b from-background to-white min-h-screen w-full flex flex-col items-center justify-start py-6 px-4 sm:px-8 overflow-y-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 text-center">
        Wall Maze Duel
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
    </div>
  );
}

export default App;
