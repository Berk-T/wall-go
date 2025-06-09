export default function Tile({
  color = "default",
  puck = null,
  onClick = () => console.log("tile"),
}) {
  const size = "w-full h-full";
  const styleVariants = {
    default: "bg-tile-default",
    "owned-red": "bg-tile-owned-red",
    "owned-blue": "bg-tile-owned-blue",
    selected: "bg-tile-selected",
    "clickable-red":
      "bg-tile-clickable-red cursor-pointer hover:bg-tile-hover-red",
    "clickable-blue":
      "bg-tile-clickable-blue cursor-pointer hover:bg-tile-hover-blue",
  };

  return (
    <div
      onClick={onClick}
      className={
        styleVariants[color] + " flex justify-center items-center " + size
      }
    >
      {puck && (
        <div
          className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-gray-50 ${
            puck === "red" ? "bg-puck-red" : "bg-puck-blue"
          }`}
        />
      )}
    </div>
  );
}
