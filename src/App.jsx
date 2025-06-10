import React, { useState } from "react";
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

  const [showRules, setShowRules] = useState(false);

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

          <div className="flex w-full gap-2 mt-6">
            <button
              onClick={resetGame}
              className="px-6 py-2 flex-1 cursor-pointer rounded-md bg-background/30 text-white font-semibold hover:bg-background/80 transition"
            >
              ↻ Reset
            </button>
            <button
              onClick={() => setShowRules(true)}
              className="px-6 py-2 flex-1 cursor-pointer rounded-md bg-background/30 text-white font-semibold hover:bg-background/80 transition"
            >
              Rules
            </button>
          </div>
        </div>

        {showRules && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
              <button
                onClick={() => setShowRules(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center text-black">
                Rules
              </h2>
              <div className="max-h-96 overflow-y-auto pr-2">
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
                        <strong>Trapping</strong> all of your opponent’s pucks
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
    </>
  );
}

export default App;
