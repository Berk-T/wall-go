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
    <div className="w-full max-w-[600px] mx-auto px-4 sm:px-6 py-4 bg-white shadow-md rounded-2xl mb-6 text-center">
      {isGameOver ? (
        <>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold mb-2 ${
              gameOver.winner === "red" ? "text-red-600" : "text-blue-600"
            }`}
          >
            {winnerText} Wins!
          </h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {gameOver.reason}
          </p>
        </>
      ) : (
        <>
          <p className="mb-4 text-base sm:text-lg text-gray-700">
            Current Turn:{" "}
            <span
              className={`font-bold ${
                currentPlayer === "red" ? "text-red-600" : "text-blue-600"
              }`}
            >
              {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}
            </span>
          </p>
        </>
      )}
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-base sm:text-lg font-bold">
        <span className="text-red-600">{`Red: ${score.red}`}</span>
        <span className="text-blue-600">{`Blue: ${score.blue}`}</span>
      </div>
    </div>
  );
};

export default ScoreBoard;
