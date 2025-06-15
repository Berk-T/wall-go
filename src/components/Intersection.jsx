import React from "react";

const Intersection = ({ colors }) => {
  const {
    top = "--intersection-default",
    right = "--intersection-default",
    bottom = "--intersection-default",
    left = "--intersection-default",
  } = colors;

  return (
    <div className="relative w-full h-full">
      {/* Top triangle */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `var(${top})`,
          clipPath: "polygon(0 0, 100% 0, 50% 50%)",
        }}
      />

      {/* Right triangle */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `var(${right})`,
          clipPath: "polygon(100% 0, 100% 100%, 50% 50%)",
        }}
      />

      {/* Bottom triangle */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `var(${bottom})`,
          clipPath: "polygon(0 100%, 100% 100%, 50% 50%)",
        }}
      />
      {/* Left triangle */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `var(${left})`,
          clipPath: "polygon(0 0, 50% 50%, 0 100%)",
        }}
      />
    </div>
  );
};

export default Intersection;
