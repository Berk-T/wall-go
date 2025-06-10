const Wall = ({ color = "default", onClick = null }) => {
  const size = "w-full h-full";
  const styleVariants = {
    default: "bg-wall-default",
    "owned-red": "bg-wall-red",
    "owned-blue": "bg-wall-blue",
    "clickable-red":
      "bg-wall-clickable-red cursor-pointer hover:bg-wall-hover-red",
    "clickable-blue":
      "bg-wall-clickable-blue cursor-pointer hover:bg-wall-hover-blue",
  };

  return (
    <div className={styleVariants[color] + " " + size} onClick={onClick} />
  );
};

export default Wall;
