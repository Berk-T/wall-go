import Wall from "./Wall";
import Tile from "./Tile";

const tileSize = "3fr";
const wallThickness = "1fr";

const sizes = [
  tileSize,
  wallThickness,
  tileSize,
  wallThickness,
  tileSize,
  wallThickness,
  tileSize,
  wallThickness,
  tileSize,
  wallThickness,
  tileSize,
  wallThickness,
  tileSize,
];

const GameBoard = ({ board, onWallClick, onTileClick }) => {
  const gridElements = [];
  board.map((tile, index) => {
    if (tile.type === "wall") {
      gridElements.push(
        <Wall
          key={index}
          color={tile.color}
          clickable={tile.clickable}
          onClick={() => onWallClick(index)}
        />
      );
    } else if (tile.type == "tile") {
      gridElements.push(
        <Tile
          key={index}
          color={tile.color}
          puck={tile.puck}
          clickable={tile.clickable}
          onClick={() => onTileClick(index)}
        />
      );
    } else {
      // Intersection between walls
      gridElements.push(<div key={index} className="bg-wall-default" />);
    }
  });
  return (
    <div className="w-full max-w-[90vmin] aspect-square">
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: sizes.join(" "),
          gridTemplateRows: sizes.join(" "),
        }}
      >
        {gridElements}
      </div>
    </div>
  );
};

export default GameBoard;
