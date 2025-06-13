export default function AnimatedBackground({ currentPlayer }) {
  const backgroundColors = {
    red: "bg-background-red",
    blue: "bg-background-blue",
  };
  return (
    <>
      <div className={`bg-animated-gradient`} />
      <div
        className={`bg-cover transition-all duration-1500 ease-in-out ${backgroundColors[currentPlayer]}`}
      />
    </>
  );
}
