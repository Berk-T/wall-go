import Wall from "./Wall";
import Tile from "./Tile";
import Intersection from "./Intersection";

const tileSize = "3fr";
const wallThickness = "0.5fr";

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
          owner={tile.owner}
          clickable={tile.clickable}
          onClick={() => onWallClick(index)}
        />
      );
    } else if (tile.type === "tile") {
      switch (index) {
        case 0:
          tile.rounded = "rounded-tl-3xl";
          break;
        case 12:
          tile.rounded = "rounded-tr-3xl";
          break;
        case 156:
          tile.rounded = "rounded-bl-3xl";
          break;
        case 168:
          tile.rounded = "rounded-br-3xl";
          break;
        default:
          tile.rounded = "";
          break;
      }

      gridElements.push(
        <Tile
          key={index}
          color={tile.color}
          puck={tile.puck}
          rounded={tile.rounded}
          onClick={() => onTileClick(index)}
        />
      );
    } else {
      // Intersection between walls
      gridElements.push(<Intersection key={index} colors={tile.colors} />);
    }
  });

  return (
    <div className="outline-solid outline-6 outline-tile-default w-full h-full aspect-square p-4 rounded-3xl shadow-lg bg-wall-default box-border">
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
