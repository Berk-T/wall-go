// useGameLogic.js
import { useState } from "react";

export function useGameLogic() {
  const [currentPlayer, setCurrentPlayer] = useState("red");
  const [selectedTile, setSelectedTile] = useState(null);
  const [remainingPlacements, setRemainingPlacements] = useState(4);

  const createBoard = () => {
    const board = [];
    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 13; col++) {
        let tile = {};
        if (row % 2 === 1) {
          if (col % 2 === 0) {
            tile = {
              type: "wall",
              onClick: () => handleWallClick(row * 13 + col),
            };
          } else {
            tile = { type: "intersection" };
          }
        } else if (col % 2 === 1) {
          tile = {
            type: "wall",
            onClick: () => handleWallClick(row * 13 + col),
          };
        } else {
          tile = {
            type: "tile",
            color: "clickable-" + currentPlayer,
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

    // // Color testing
    // board[0].color = "owned-red";
    // board[0].puck = "red";

    // board[1].color = "owned-red";

    // board[2].color = "owned-blue";
    // board[2].puck = "blue";

    // board[3].color = "owned-blue";

    // board[4].color = "selected";

    // board[5].color = "owned-blue";

    // board[6].color = "clickable-red";
    // board[6].puck = "blue";

    // board[7].color = "owned-red";

    // board[8].color = "clickable-blue";
    // board[8].puck = "red";

    // board[9].color = "clickable-red";

    // board[11].color = "clickable-blue";
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
    console.log(index);
    if (!board[index].color.includes("clickacble")) {
      console.log("Wall not clickable:", index);
      return;
    }

    const wall = board[index];
    const newBoard = [
      ...board.slice(0, index),
      {
        ...wall,
        ownedBy: currentPlayer,
        isClickable: false,
      },
      ...board.slice(index + 1),
    ];
    setBoard(newBoard);

    // Check if area is claimed now
    // Check if game over
    // Hand over turn
    switchPlayer();
    // Calculate clickable tiles
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
      const newBoardWithClickable = calculateClickablePucks(
        newBoard,
        getNextPlayer()
      );
      setBoard(newBoardWithClickable);
    } else {
      // If placements left, just update the board
      setBoard(newBoard);
    }

    return;
  };

  const calculateClickablePucks = (board, player) => {
    const newBoard = board.map((tile) => {
      return {
        ...tile,
        color: tile.puck === player ? "clickable-" + player : "default",
      };
    });
    return newBoard;
  };

  const handleTileClick = (index) => {
    console.log(index);

    // Deselecting tile
    if (board[index].color === "selected") {
      setSelectedTile(null);
      const newBoard = calculateClickablePucks(board, currentPlayer);
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
    if (!selectedTile && board[index].color === "clickable-" + currentPlayer) {
      console.log("Selecting tile:", index);
      setSelectedTile(index);
      const movableTiles = calculateMovableTiles(index);
      const newBoard = board.map((tile, idx) => {
        return {
          ...tile,
          color: movableTiles.includes(idx)
            ? "clickable-" + currentPlayer
            : "default",
        };
      });
      newBoard[index].color = "selected"; // Highlight selected tile
      console.log("Movable tiles:", movableTiles);
      setBoard(newBoard);
      return;
    }

    // Move puck
    let newBoard = board.map((tile, idx) => {
      if (idx === selectedTile) {
        return {
          ...tile,
          puck: null,
          color: "default",
        };
      } else if (idx === index) {
        return {
          ...tile,
          puck: currentPlayer,
          color: "default",
        };
      } else {
        return {
          ...tile,
          color: "default",
        };
      }
    });

    setBoard(newBoard);
    setSelectedTile(null);
    //calculateClickableWalls(index)
  };

  const calculateMovableTiles = (index) => {
    let queue = [[index, 2]];
    const visited = new Set();
    const movableTiles = [];
    const directions = [
      -26, // Up
      26, // Down
      -2, // Left
      2, // Right
    ];

    while (queue.length > 0) {
      const [currentIndex, currentSteps] = queue.shift();
      console.log(
        `Visiting index: ${currentIndex}, steps left: ${currentSteps}`
      );
      if (visited.has(currentIndex) || currentSteps <= 0) continue;
      visited.add(currentIndex);

      // Check neighbors
      for (const dir of directions) {
        const neighborIndex = currentIndex + dir;
        console.log(
          `Checking neighbor index: ${neighborIndex} from current index: ${currentIndex}`
        );
        if (
          neighborIndex >= 0 &&
          neighborIndex < board.length &&
          !visited.has(neighborIndex) &&
          board[neighborIndex].type === "tile" &&
          !board[neighborIndex].puck &&
          !isWallBetweenTiles(board, currentIndex, neighborIndex)
        ) {
          console.log(`Adding neighbor index: ${neighborIndex}`);
          queue.push([neighborIndex, currentSteps - 1]);
          movableTiles.push(neighborIndex);
        }
      }
    }

    return movableTiles;
  };

  return {
    board,
    currentPlayer,
    handleTileClick,
    handleWallClick,
  };
}

const BOARD_SIZE = 13; // 13x13 board

function isWallBetweenTiles(board, index1, index2) {
  // r1, c1, r2, c2 are indices of tiles in 13x13 board, all even numbers
  const r1 = Math.floor(index1 / BOARD_SIZE);
  const c1 = index1 % BOARD_SIZE;
  const r2 = Math.floor(index2 / BOARD_SIZE);
  const c2 = index2 % BOARD_SIZE;

  if (r1 === r2 && Math.abs(c1 - c2) === 2) {
    // Horizontal neighbors
    console.log("Horizontal neighbors");
    const wallCol = Math.min(c1, c2) + 1; // odd col between tiles
    const wallRow = r1; // same row
    const wallIndex = wallRow * BOARD_SIZE + wallCol;

    return board[wallIndex].color.includes("owned");
  }

  if (c1 === c2 && Math.abs(r1 - r2) === 2) {
    // Vertical neighbors
    console.log("Vertical neighbors");
    const wallRow = Math.min(r1, r2) + 1;
    const wallCol = c1; // same col
    const wallIndex = wallRow * BOARD_SIZE + wallCol;
    return board[wallIndex].color.includes("owned");
  }

  // Not neighbors or invalid

  return true;
}

function getTileNeighbors(board, index) {
  const r = Math.floor(index / BOARD_SIZE);
  const c = index % BOARD_SIZE;
  const neighbors = [];
  const directions = [
    [-2, 0], // up
    [2, 0], // down
    [0, -2], // left
    [0, 2], // right
  ];

  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;

    if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
      if (!isWallBetweenTiles(board, r, c, nr, nc)) {
        neighbors.push([nr, nc]);
      }
    }
  }
  return neighbors;
}

export function findEnclosedAreas(board) {
  const visited = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(false));
  const enclosedAreas = [];

  for (let r = 0; r < BOARD_SIZE; r += 2) {
    for (let c = 0; c < BOARD_SIZE; c += 2) {
      if (!visited[r][c]) {
        const queue = [[r, c]];
        visited[r][c] = true;
        const component = [];
        let touchesBoundary = false;

        while (queue.length > 0) {
          const [cr, cc] = queue.shift();
          component.push([cr, cc]);

          // Check if tile touches boundary
          if (
            cr === 0 ||
            cr === BOARD_SIZE - 1 ||
            cc === 0 ||
            cc === BOARD_SIZE - 1
          ) {
            touchesBoundary = true;
          }

          // Explore neighbors without walls between
          const neighbors = getTileNeighbors(board, cr, cc);
          for (const [nr, nc] of neighbors) {
            if (!visited[nr][nc]) {
              visited[nr][nc] = true;
              queue.push([nr, nc]);
            }
          }
        }

        if (!touchesBoundary) {
          enclosedAreas.push(component);
        }
      }
    }
  }

  return enclosedAreas; // enclosed tile groups
}
