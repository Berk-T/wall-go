import React from "react";

const ScoreBoard = ({ score, gameOver, currentPlayer }) => {
  return (
    <>
      <div className="flex flex-row sm:flex-row mb-5 justify-center gap-4 sm:gap-8 text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
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
