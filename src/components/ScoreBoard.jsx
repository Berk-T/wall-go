import React from "react";

const ScoreBoard = ({ score, gameOver, currentPlayer }) => {
  const isGameOver = gameOver.gameOver;
  const winnerText =
    gameOver.winner === "red"
      ? "Red"
      : gameOver.winner === "blue"
      ? "Blue"
      : "";

  return (
    <>
      {isGameOver ? (
        <>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold mb-2 ${
              gameOver.winner === "red"
                ? "text-scoreboard-red"
                : "text-scoreboard-blue"
            }`}
          >
            <span className="text-white">Winner: </span>
            {winnerText}
          </h2>
          <p className="text-white mb-2 text-sm sm:text-base">
            {gameOver.reason}
          </p>
        </>
      ) : null}

      <div className="flex flex-col sm:flex-row mb-5 justify-center gap-4 sm:gap-8 text-base sm:text-lg font-bold">
        <div
          className={`flex items-center gap-2 border-solid border border-white/30 bg-background/10 rounded-xl px-3 py-1 ${
            currentPlayer === "red" && !gameOver.gameOver ? "glow-red" : ""
          }`}
        >
          <span className="flex items-center gap-2 text-scoreboard-red">
            <span className="w-3 h-3 bg-scoreboard-red rounded-sm"></span>
            {score.red}
          </span>
        </div>
        <div
          className={`flex items-center border-solid border border-white/30 gap-2 bg-background/10 rounded-xl px-3 py-1 ${
            currentPlayer === "blue" && !gameOver.gameOver ? "glow-blue" : ""
          }`}
        >
          <span className="flex items-center gap-2 text-scoreboard-blue">
            <span className="w-3 h-3 bg-scoreboard-blue rounded-sm"></span>
            {score.blue}
          </span>
        </div>
      </div>
    </>
  );
};

export default ScoreBoard;
