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
    <>
      <div className="bg min-h-screen flex flex-col items-center justify-start p-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-md text-center">
          Wall Go
        </h1>

        <div className="w-full max-w-lg flex flex-col items-center">
          <ScoreBoard
            score={score}
            gameOver={gameOver}
            currentPlayer={currentPlayer}
          />

          <div className="w-full flex justify-center">
            <GameBoard
              board={board}
              onWallClick={handleWallClick}
              onTileClick={handleTileClick}
            />
          </div>

          <button
            onClick={resetGame}
            className="mt-6 px-6 py-2 w-full sm:w-auto cursor-pointer rounded-md bg-background/30 text-white font-semibold hover:bg-background/80 transition"
          >
            ↻ Reset
          </button>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-black bg-opacity-80 text-white text-center py-2 z-50 text-xs sm:text-sm">
        Made with <span className="text-red-500">♥</span> by&nbsp;
        <a
          href="https://github.com/Berk-T/wall-go"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 group inline-block"
        >
          <span className="inline-block transition-transform duration-300 hover:scale-125">
            🦀
          </span>
        </a>
      </div>
    </>
  );
}

export default App;
