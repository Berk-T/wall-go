// useGameLogic.js
import { useState } from "react";

export function useGameLogic() {
  const [currentPlayer, setCurrentPlayer] = useState("red");
  const [selectedTile, setSelectedTile] = useState(null);
  const [remainingPlacements, setRemainingPlacements] = useState(4);
  const [score, setScore] = useState({ red: 0, blue: 0 });
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    winner: null,
    reason: null,
  });

  const createBoard = () => {
    const board = [];
    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 13; col++) {
        let tile = {};
        if (row % 2 === 1) {
          if (col % 2 === 0) {
            tile = {
              type: "wall",
              color: "default",
              onClick: () => handleWallClick(row * 13 + col),
            };
          } else {
            tile = {
              type: "intersection",
              colors: {
                top: "--intersection-default",
                right: "--intersection-default",
                bottom: "--intersection-default",
                left: "--intersection-default",
              },
            };
          }
        } else if (col % 2 === 1) {
          tile = {
            type: "wall",
            color: "default",
            onClick: () => handleWallClick(row * 13 + col),
          };
        } else {
          tile = {
            type: "tile",
            color: "clickable-red",
            puck: null,
            onClick: () => handleTileClick(row * 13 + col),
          };
        }
        board.push(tile);
      }
    }

    // Starting pucks
    board[28].puck = "red";
    board[28].color = "default";
    board[140].puck = "red";
    board[140].color = "default";
    board[36].puck = "blue";
    board[36].color = "default";
    board[132].puck = "blue";
    board[132].color = "default";

    return board;
  };
  const [board, setBoard] = useState(createBoard);

  const switchPlayer = () => {
    setCurrentPlayer((prev) => (prev === "red" ? "blue" : "red"));
  };

  const getNextPlayer = () => {
    return currentPlayer === "red" ? "blue" : "red";
  };

  const handleWallClick = (index) => {
    console.log("Wall clicked", index);
    if (!board[index].color.includes("clickable")) {
      console.log("Wall not clickable:", index);
      return;
    }

    let newBoard = board.map((tile, idx) => {
      if (idx === index) {
        return {
          ...tile,
          color: "owned-" + currentPlayer,
        };
      } else {
        return {
          ...tile,
          color: tile.color.includes("owned") ? tile.color : "default", // Keep owned unchanged, reset others
        };
      }
    });

    // Change intersection colors
    newBoard = calculateIntersectionColors(newBoard, index);
    // If wall is placed without moving
    setSelectedTile(null);

    // Check claimed areas, tally scores, and update board
    const areas = getAreas(newBoard);
    console.log("Areas found:", areas.length);
    let scores = { red: 0, blue: 0 };
    let allAreasEnclosed = null;
    if (areas.length > 1) {
      allAreasEnclosed = true; // Assume all areas are enclosed unless proven otherwise
      for (const area of areas) {
        const owner = getAreaOwner(newBoard, area);
        if (owner === "mixed") {
          allAreasEnclosed = false; // Mixed area
        }

        if (owner === "red" || owner === "blue") {
          console.log("Area claimed by:", owner);
          scores[owner] += area.length; // Tally score based on area size
          area.forEach((tileIndex) => {
            newBoard[tileIndex].color = "owned-" + owner;
            newBoard[tileIndex].owner = owner;
          });
        } else {
          area.forEach((tileIndex) => {
            newBoard[tileIndex].color = "default"; // Reset unclaimed areas
            newBoard[tileIndex].owner = null;
          });
        }
      }
      setScore(scores);
    }

    // Calculate clickable tiles (pucks)
    const { newBoard: boardWithClickables, movablePucks } =
      calculateClickablePucks(newBoard, getNextPlayer());

    setBoard(boardWithClickables);
    // Check if game over (no movable pucks left OR one player has >= 25 points)
    if (checkGameOver(scores, movablePucks, allAreasEnclosed)) {
      freezeBoard(boardWithClickables);
      return; // Game is over, no need to switch player
    }
    // Hand over turn
    switchPlayer();
  };

  const calculateIntersectionColors = (board, index) => {
    const newBoard = [...board];
    // Check if wall is horizontal or vertical
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const isHorizontal = row % 2 === 1;
    let intersections = [];
    if (isHorizontal) {
      if (col !== 0) {
        intersections.push(index - 1); // Left neighbor
      }
      if (col !== BOARD_SIZE - 1) {
        intersections.push(index + 1); // Right neighbor
      }
    } else {
      if (row !== 0) {
        intersections.push(index - BOARD_SIZE); // Top neighbor
      }
      if (row !== BOARD_SIZE - 1) {
        intersections.push(index + BOARD_SIZE); // Bottom neighbor
      }
    }

    for (const intersectionIndex of intersections) {
      const neighbors = {
        left: intersectionIndex - 1,
        right: intersectionIndex + 1,
        top: intersectionIndex - BOARD_SIZE,
        bottom: intersectionIndex + BOARD_SIZE,
      };

      let colors = {};
      for (const key in neighbors) {
        const neighborColor = board[neighbors[key]].color;
        if (neighborColor.includes("owned")) {
          colors[key] = "--intersection-" + neighborColor.substring(6); // Keep owned color
        } else {
          colors[key] = "--intersection-default"; // Default color for unowned
        }
      }

      let updatedColors = { ...colors };
      const adjacents = {
        top: ["left", "right"],
        right: ["top", "bottom"],
        bottom: ["left", "right"],
        left: ["top", "bottom"],
      };
      for (const side in adjacents) {
        for (const neighbor of adjacents[side]) {
          if (
            colors[side] === colors[neighbor] &&
            colors[side] !== "--intersection-default"
          ) {
            updatedColors[side] = colors[side];
            updatedColors[neighbor] = colors[side];
          }
        }
      }
      newBoard[intersectionIndex] = {
        ...newBoard[intersectionIndex],
        colors: updatedColors,
      };
      newBoard[intersectionIndex];
    }

    return newBoard;
  };

  const freezeBoard = (board) => {
    const newBoard = board.map((tile) => {
      if (tile.type === "tile") {
        return {
          ...tile,
          color: tile.owner ? "owned-" + tile.owner : "default",
        };
      } else {
        return {
          ...tile,
          color: tile.color.includes("owned") ? tile.color : "default",
        };
      }
    });

    setBoard(newBoard);
    setSelectedTile(null);
  };

  const checkGameOver = (scores, movablePucks, allAreasEnclosed) => {
    if (movablePucks > 0 && !allAreasEnclosed) {
      return false; // Game continues
    }

    console.log("Game Over");
    if (movablePucks === 0) {
      console.log("No movable pucks left");
      setGameOver({
        gameOver: true,
        winner: getNextPlayer(),
        reason: "No movable pucks left",
      });
    } else if (scores.red >= 25) {
      console.log("Red player wins with score:", scores.red);
      setGameOver({
        gameOver: true,
        winner: "red",
        reason: "Red player reached 25 points",
      });
    } else if (scores.blue >= 25) {
      console.log("Blue player wins with score:", scores.blue);
      setGameOver({
        gameOver: true,
        winner: "blue",
        reason: "Blue player reached 25 points",
      });
    } else if (allAreasEnclosed) {
      console.log("All areas enclosed, game over");
      setGameOver({
        gameOver: true,
        winner:
          scores.red > scores.blue
            ? "red"
            : scores.red === scores.blue
            ? "tie"
            : "blue",
        reason: "All areas enclosed",
      });
    }

    return true; // Game is over
  };

  const handlePlacement = (index) => {
    if (board[index].occupant) return;

    const newBoard = board.map((tile) => {
      return {
        ...tile,
        color:
          tile.type === "tile"
            ? tile.puck
              ? "default"
              : "clickable-" + getNextPlayer()
            : "default",
      };
    });
    newBoard[index].color = "default";
    newBoard[index].puck = currentPlayer;

    switchPlayer();
    setRemainingPlacements((prev) => prev - 1);

    if (remainingPlacements - 1 === 0) {
      // If no placements left, calculate clickable pucks
      const { newBoard: newBoardWithClickables } = calculateClickablePucks(
        newBoard,
        getNextPlayer()
      );
      setBoard(newBoardWithClickables);
    } else {
      // If placements left, just update the board
      setBoard(newBoard);
    }

    return;
  };

  const calculateClickablePucks = (board, player) => {
    let movablePucks = 0;
    const newBoard = board.map((tile, idx) => {
      if (tile.type === "tile") {
        if (tile.puck === player && puckHasMoves(board, idx)) {
          movablePucks++;
        }

        return {
          ...tile,
          color:
            tile.puck === player && puckHasMoves(board, idx)
              ? "clickable-" + player
              : tile.color.includes("owned")
              ? tile.color
              : "default",
        };
      } else {
        return {
          ...tile,
          color: tile.color.includes("owned") ? tile.color : "default",
        };
      }
    });
    return { newBoard, movablePucks };
  };

  const calculateClickableWalls = (board, index) => {
    const directions = [
      -13, // Up
      13, // Down
      -1, // Left
      1, // Right
    ];
    for (const dir of directions) {
      const neighborIndex = index + dir;
      if (
        neighborIndex >= 0 &&
        neighborIndex < board.length &&
        board[neighborIndex].type === "wall" &&
        !board[neighborIndex].color.includes("owned")
      ) {
        // If wall is not owned, make it clickable
        board[neighborIndex].color = "clickable-" + currentPlayer;
      }
    }
    return board;
  };

  const puckHasMoves = (board, index) => {
    const neighbors = getTileNeighbors(board, index);
    for (const neighborIndex of neighbors) {
      if (
        !board[neighborIndex].puck &&
        !isWallBetweenTiles(board, index, neighborIndex)
      ) {
        return true; // Found a valid move
      }
    }
    return false;
  };

  const handleTileClick = (index) => {
    console.log("Tile clicked", index);

    // Deselecting tile
    if (board[index].color === "selected") {
      setSelectedTile(null);
      const { newBoard } = calculateClickablePucks(board, currentPlayer);
      newBoard[index].color = "clickable-" + currentPlayer;
      setBoard(newBoard);
      console.log("Deselected tile:", index);
      return;
    }

    if (!board[index].color.includes("clickable")) {
      console.log("Tile not clickable:", index);
      return;
    }

    if (remainingPlacements > 0) {
      handlePlacement(index);
      return;
    }

    // Selecting puck to move
    if (!selectedTile && board[index].puck === currentPlayer) {
      console.log("Selecting tile:", index);
      setSelectedTile(index);
      const newBoard = calculateMovableTiles(board, index);
      newBoard[index].color = "selected"; // Highlight selected tile
      setBoard(newBoard);
      return;
    }

    // Move puck
    const newBoard = board.map((tile, idx) => {
      if (idx === selectedTile) {
        return {
          ...tile,
          puck: null,
          color: tile.owner ? "owned-" + tile.owner : "default", // Reset to previous color or default
        };
      } else if (idx === index) {
        return {
          ...tile,
          puck: currentPlayer,
          color: tile.owner ? "owned-" + tile.owner : "default", // Set to owned color or default
        };
      } else {
        if (tile.type === "tile") {
          return {
            ...tile,
            color: tile.owner ? "owned-" + tile.owner : "default",
          };
        } else {
          return {
            ...tile,
            color: tile.color.includes("owned") ? tile.color : "default", // Keep owned tiles unchanged
          };
        }
      }
    });

    const boardWithClickables = calculateClickableWalls(newBoard, index);
    setBoard(boardWithClickables);
    setSelectedTile(null);
  };

  const canMoveToSameTile = (board, index) => {
    const neighbors = getTileNeighbors(board, index);
    for (const neighborIndex of neighbors) {
      if (board[neighborIndex].puck) continue; // Skip if neighbor has a puck
      if (getTileNeighbors(board, neighborIndex).includes(index)) {
        return true;
      }
    }
    return false;
  };

  const calculateMovableTiles = (board, index) => {
    const newBoard = board.map((tile) => {
      if (tile.type === "tile") {
        return {
          ...tile,
          color: tile.owner ? "owned-" + tile.owner : "default",
        };
      } else {
        return tile;
      }
    });
    let queue = [[index, 2]];
    const visited = new Set();

    while (queue.length > 0) {
      const [currentIndex, currentSteps] = queue.shift();

      if (visited.has(currentIndex) || currentSteps <= 0) continue;
      visited.add(currentIndex);

      // Check neighbors
      for (const neighborIndex of getTileNeighbors(newBoard, currentIndex)) {
        if (
          !visited.has(neighborIndex) &&
          !newBoard[neighborIndex].puck &&
          !isWallBetweenTiles(newBoard, currentIndex, neighborIndex)
        ) {
          queue.push([neighborIndex, currentSteps - 1]);
          newBoard[neighborIndex].color = "clickable-" + currentPlayer;
        }
      }
    }

    // May also be able to place walls next to current puck
    // (moving 1 space and then moving back to the same tile)
    if (canMoveToSameTile(newBoard, index)) {
      for (const neighborIndex of getWallNeighbors(newBoard, index)) {
        if (!newBoard[neighborIndex].color.includes("owned")) {
          newBoard[neighborIndex].color = "clickable-" + currentPlayer;
        }
      }
    }
    return newBoard;
  };

  const resetGame = () => {
    setCurrentPlayer("red");
    setSelectedTile(null);
    setRemainingPlacements(4);
    setScore({ red: 0, blue: 0 });
    setGameOver({ gameOver: false, winner: null, reason: null });
    setBoard(createBoard());
  };

  return {
    board,
    currentPlayer,
    score,
    gameOver,
    handleTileClick,
    handleWallClick,
    resetGame,
  };
}

const BOARD_SIZE = 13; // 13x13 board

const getTileNeighbors = (board, index) => {
  const neighbors = [];
  const directions = [
    -26, // up
    26, // down
    -2, // left
    2, // right
  ];

  for (const dir of directions) {
    const neighborIndex = index + dir;
    if (
      neighborIndex >= 0 &&
      neighborIndex < board.length &&
      !isWallBetweenTiles(board, index, neighborIndex)
    ) {
      neighbors.push(neighborIndex);
    }
  }
  return neighbors;
};

const getWallNeighbors = (board, index) => {
  const neighbors = [];
  const directions = [
    -13, // up
    13, // down
    -1, // left
    1, // right
  ];

  for (const dir of directions) {
    const neighborIndex = index + dir;
    if (neighborIndex >= 0 && neighborIndex < board.length) {
      neighbors.push(neighborIndex);
    }
  }
  return neighbors;
};

const isWallBetweenTiles = (board, index1, index2) => {
  // r1, c1, r2, c2 are indices of tiles in 13x13 board, all even numbers
  const r1 = Math.floor(index1 / BOARD_SIZE);
  const c1 = index1 % BOARD_SIZE;
  const r2 = Math.floor(index2 / BOARD_SIZE);
  const c2 = index2 % BOARD_SIZE;

  if (r1 === r2 && Math.abs(c1 - c2) === 2) {
    // Horizontal neighbors
    const wallCol = Math.min(c1, c2) + 1; // odd col between tiles
    const wallRow = r1; // same row
    const wallIndex = wallRow * BOARD_SIZE + wallCol;

    return board[wallIndex].color.includes("owned");
  }

  if (c1 === c2 && Math.abs(r1 - r2) === 2) {
    // Vertical neighbors
    const wallRow = Math.min(r1, r2) + 1;
    const wallCol = c1; // same col
    const wallIndex = wallRow * BOARD_SIZE + wallCol;
    return board[wallIndex].color.includes("owned");
  }

  // Not neighbors or invalid

  return true;
};

const getAreas = (board) => {
  const visited = new Set();
  const areas = [];

  const dfs = (index, area) => {
    if (visited.has(index)) return;
    visited.add(index);
    area.push(index);

    for (const neighbor of getTileNeighbors(board, index)) {
      dfs(neighbor, area);
    }
  };

  for (let i = 0; i < board.length; i += 2) {
    if (Math.floor(i / BOARD_SIZE) % 2 === 1) {
      // Skip walls and intersections
      continue;
    }

    if (!visited.has(i)) {
      const area = [];
      dfs(i, area);
      if (area.length > 0) {
        area.sort((a, b) => a - b); // Sort area indices
        areas.push(area);
      }
    }
  }

  return areas;
};

const getAreaOwner = (board, area) => {
  const redCount = area.filter((index) => board[index].puck === "red").length;
  const blueCount = area.filter((index) => board[index].puck === "blue").length;

  if (redCount > 0 && blueCount === 0) {
    return "red";
  } else if (blueCount > 0 && redCount === 0) {
    return "blue";
  } else if (redCount > 0 && blueCount > 0) {
    return "mixed"; // Both players have pucks in the area
  }

  return "empty"; // No pucks in the area
};
