import React from "react";

const ScoreBoard = ({ score, gameOver, currentPlayer }) => {
  return (
    <>
      <div className="flex flex-row mb-3 sm:mb-4 md:mb-5 justify-center gap-2 sm:gap-4 md:gap-8 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold">
        <div
          className={`flex items-center gap-1 sm:gap-2 border-solid border border-white/30 bg-background/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 ${
            currentPlayer === "red" && !gameOver.gameOver ? "glow-red" : ""
          }`}
        >
          <span className="flex items-center gap-1 sm:gap-2 text-scoreboard-red">
            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-scoreboard-red rounded-sm"></span>
            {score.red}
          </span>
        </div>
        <div
          className={`flex items-center border-solid border border-white/30 gap-1 sm:gap-2 bg-background/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 ${
            currentPlayer === "blue" && !gameOver.gameOver ? "glow-blue" : ""
          }`}
        >
          <span className="flex items-center gap-1 sm:gap-2 text-scoreboard-blue">
            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-scoreboard-blue rounded-sm"></span>
            {score.blue}
          </span>
        </div>
      </div>
    </>
  );
};

export default ScoreBoard;
