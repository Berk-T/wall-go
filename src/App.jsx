import { useState } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import { useGameLogic } from "./hooks/useGameLogic";
import Wall from "./components/Wall";
import Tile from "./components/Tile";
function App() {
  const { board, currentPlayer, handleWallClick, handleTileClick } =
    useGameLogic();

  return (
    <div className="bg-backround flex justify-center items-center min-h-screen">
      <GameBoard
        board={board}
        onWallClick={handleWallClick}
        onTileClick={handleTileClick}
      />
    </div>
  );
}

export default App;
