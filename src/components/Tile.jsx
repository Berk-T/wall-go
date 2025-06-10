export default function Tile({
  color = "default",
  puck = null,
  rounded = "",
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

  // Determine if blinking is needed
  const isBlinking = color === "clickable-red" || color === "clickable-blue";

  return (
    <div
      onClick={onClick}
      className={
        "relative flex justify-center items-center " +
        size +
        (isBlinking ? " cursor-pointer" : "")
      }
    >
      {/* Background layer with blinking */}
      <div
        className={`${styleVariants[color]} ${
          isBlinking ? "blink" : ""
        } absolute inset-0 ${rounded}`}
      ></div>

      {/* Puck on top */}
      {puck && (
        <div
          className={`relative w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-white ${
            puck === "red" ? "bg-puck-red" : "bg-puck-blue"
          }`}
        />
      )}
    </div>
  );
}
