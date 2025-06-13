export default function Tile({
  color = "default",
  puck = null,
  rounded = "",
  onClick = null,
  owner = null, // "red" or "blue"
}) {
  const size = "w-full h-full";
  const styleVariants = {
    default: "bg-tile-default",
    "owned-red": "bg-tile-owned-red",
    "owned-blue": "bg-tile-owned-blue",
    selected: "bg-tile-selected",
    "clickable-red": "bg-tile-clickable cursor-pointer hover:bg-tile-hover-red",
    "clickable-blue":
      "bg-tile-clickable cursor-pointer hover:bg-tile-hover-blue",
  };

  // Determine if blinking is needed
  const isBlinking = color === "clickable-red" || color === "clickable-blue";

  return (
    <div
      onClick={onClick}
      className={
        "relative flex justify-center items-center " +
        size +
        (isBlinking || color === "selected" ? " cursor-pointer" : "")
      }
    >
      {/* Background layer with blinking */}
      {isBlinking ? (
        <>
          <div
            className={`${
              owner ? styleVariants["owned-" + owner] : styleVariants["default"]
            } absolute inset-0 ${rounded}`}
          />
          <div
            className={`${styleVariants[color]} ${
              isBlinking ? "blink" : ""
            } absolute inset-0 ${rounded}`}
          />
        </>
      ) : (
        <div
          className={`${styleVariants[color]} absolute inset-0 ${rounded}`}
        />
      )}

      {/* Puck on top */}
      {puck && (
        <div
          className={`relative rounded-full border border-white ${
            puck === "red" ? "bg-puck-red" : "bg-puck-blue"
          }`}
          style={{
            width: "60%",
            height: "60%",
            minWidth: "0",
            minHeight: "0",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      )}
    </div>
  );
}
