import React from "react";

export default function AnimatedProgressBar({ value = 0, color = "#22c55e", height = 16 }) {
  const progress = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full bg-gray-200 rounded-full" style={{ height }}>
      <div
        className="rounded-full transition-all duration-700 ease-in-out flex items-center justify-end"
        style={{
          width: `${progress}%`,
          background: color,
          height,
        }}
      >
        <span
          className="text-xs font-bold pr-2 text-white"
          style={{ color: "#fff" }}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
}