import React, { useState, useEffect } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import ScoreBoard from "./components/ScoreBoard";
import AnimatedBackground from "./components/AnimatedBackground";
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

  const [showRules, setShowRules] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [resetCount, setResetCount] = useState(0); // Used to trigger re-render on reset

  useEffect(() => {
    if (gameOver.gameOver) {
      setShowGameOver(true);
    } else {
      setShowGameOver(false);
    }
  }, [gameOver]);

  return (
    <>
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-4 pb-16`}
      >
        <AnimatedBackground currentPlayer={currentPlayer} />
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white mb-4 drop-shadow-md text-center">
          Wall Go
        </h1>

        <div className="w-full max-w-lg flex flex-col items-center">
          <ScoreBoard
            score={score}
            gameOver={gameOver}
            currentPlayer={currentPlayer}
          />

          <div className="w-full flex justify-center my-4">
            <div className="w-full max-w-full sm:max-w-lg">
              <GameBoard
                board={board}
                resetCount={resetCount}
                onWallClick={handleWallClick}
                onTileClick={handleTileClick}
              />
            </div>
          </div>

          <div className="flex w-full gap-2 mt-6">
            <button
              onClick={() => {
                resetGame();
                setResetCount((prev) => prev + 1);
              }}
              className="px-6 py-2 flex-1 cursor-pointer rounded-md bg-background/30 text-white font-semibold hover:bg-background/80 transition"
            >
              Reset
            </button>
            <button
              onClick={() => setShowRules(true)}
              className="px-6 py-2 flex-1 cursor-pointer rounded-md bg-background/30 text-white font-semibold hover:bg-background/80 transition"
            >
              Rules
            </button>
          </div>
          <div className="fixed bottom-0 left-0 w-full bg-black bg-opacity-10 text-white text-center py-2 z-50 text-xs sm:text-sm">
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
        </div>

        {showGameOver && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowGameOver()}
          >
            <div className="bg-black text-center rounded-lg shadow-lg p-4 sm:p-6 max-w-[95vw] sm:max-w-md w-full relative">
              <button
                onClick={() => setShowGameOver()}
                className="absolute top-1 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
              <h2
                className={`text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 ${
                  gameOver.winner === "red"
                    ? "text-scoreboard-red"
                    : gameOver.winner === "blue"
                    ? "text-scoreboard-blue"
                    : "text-gray-400"
                }`}
              >
                <span className="text-white">Winner: </span>
                {gameOver.winner.charAt(0).toUpperCase() +
                  gameOver.winner.slice(1)}
              </h2>
              <p className="text-white mb-2 text-xs sm:text-sm md:text-base">
                {gameOver.reason}
              </p>
            </div>
          </div>
        )}

        {showRules && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRules(false)}
          >
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-[95vw] sm:max-w-md w-full relative">
              <button
                onClick={() => setShowRules(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-center text-black mb-4">
                Rules
              </h2>
              <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto pr-2 text-sm sm:text-base">
                <ol>
                  <li>
                    <strong>🎯 Objective</strong>
                    <br />
                    Win by either:
                    <ul>
                      <li>
                        Claiming <strong>more tiles than your opponent</strong>{" "}
                        when all tiles are either claimed or are cut off from
                        both players, or
                      </li>
                      <li>
                        <strong>Trapping</strong> all of your opponent's pucks
                        so they cannot move.
                      </li>
                    </ul>
                  </li>
                  <br />
                  <li>
                    <strong>🧊 Initial Placement Phase</strong>
                    <ul>
                      <li>
                        Each player starts with <strong>2 pucks</strong> already
                        placed.
                      </li>
                      <li>
                        Players then take turns placing{" "}
                        <strong>2 additional pucks</strong>, for a total of{" "}
                        <strong>4</strong> per player.
                      </li>
                      <li>
                        After placement, the game enters the main turn-based
                        phase.
                      </li>
                    </ul>
                  </li>
                  <br />
                  <li>
                    <strong>🔁 Turn Structure</strong>
                    <br />
                    On your turn:
                    <ul>
                      <li>
                        <strong>Move</strong> one of your pucks up to{" "}
                        <strong>2 tiles</strong> (orthogonally, no diagonals).
                        <ul>
                          <li>
                            Pucks cannot move through walls or other pucks.
                          </li>
                          <li>You may end on the same tile you started.</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Place a wall</strong> in an{" "}
                        <strong>empty</strong> wall slot adjacent to the tile
                        your puck landed on.
                        <ul>
                          <li>
                            Walls cannot be placed over existing ones or on the
                            outer perimeter.
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <br />
                  <li>
                    <strong>🧮 Scoring</strong>
                    <ul>
                      <li>
                        An enclosed area is considered "controlled" if all pucks
                        within it belong to the same player.
                      </li>
                      <li>
                        The player gains{" "}
                        <strong>points equal to the number of tiles</strong> in
                        that area.
                      </li>
                      <li>
                        Points are <strong>lost</strong> if the opponent later
                        breaks control of the area.
                      </li>
                    </ul>
                  </li>
                  <br />
                  <li>
                    <strong>🏁 Game End Conditions</strong>
                    <br />
                    The game ends when:
                    <ul>
                      <li>
                        A player <strong>controls at least 25 tiles</strong> →
                        they win.
                      </li>
                      <li>
                        A player <strong>cannot move any of their pucks</strong>{" "}
                        → their opponent wins.
                      </li>
                      <li>
                        All tiles are either{" "}
                        <strong>controlled or cut off from both players</strong>{" "}
                        → player with most tiles controlled wins.
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
