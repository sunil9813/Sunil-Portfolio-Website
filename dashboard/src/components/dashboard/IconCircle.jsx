import React, { useRef } from "react";

export const IconCircle = ({ bgColor, children, id, size = "medium", className = "", iconSize = 20, variant = "gradient" }) => {
  const colors = [
    "#1d4ed8",
    "#7c3aed",
    "#dc2626",
    "#059669",
    "#ea580c",
    "#0891b2",
    "#db2777",
    "#65a30d",
    "#4338ca",
    "#be185d",
    "#0284c7",
    "#9333ea",
    "#16a34a",
    "#d97706",
    "#2563eb",
    "#7e22ce",
    "#e11d48",
    "#047857",
    "#c2410c",
    "#0e7490",
  ];

  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-12 h-12",
    large: "w-14 h-14",
    xlarge: "w-16 h-16",
  };

  // 🔒 Lock color forever
  const colorRef = useRef(null);

  if (!colorRef.current) {
    colorRef.current = bgColor || colors[Math.floor(Math.random() * colors.length)];
  }

  const selectedColor = colorRef.current;
  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  if (variant === "gradient") {
    return (
      <div
        className={`
          ${sizeClass}
          rounded-xl flex items-center justify-center
          relative transition-all duration-300
          hover:scale-105 ${className}
        `}
        style={{
          background: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}99)`,
          boxShadow: `0 8px 25px ${selectedColor}50`,
        }}
      >
        <div
          className="absolute inset-0 rounded-xl opacity-30"
          style={{
            background: "radial-gradient(circle at 30% 30%, white 0%, transparent 50%)",
            mixBlendMode: "overlay",
          }}
        />

        <div className="relative z-10">
          {React.isValidElement(children) ? (
            React.cloneElement(children, {
              size: iconSize,
              className: "text-white drop-shadow-sm",
            })
          ) : (
            <span className="text-white font-bold">{children}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizeClass}
        rounded-full flex items-center justify-center
        transition-all duration-300 hover:scale-105
        shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2),inset_2px_2px_4px_rgba(255,255,255,0.7)]
        dark:shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.4),inset_2px_2px_4px_rgba(255,255,255,0.1)]
        ${className}
      `}
      style={{ backgroundColor: selectedColor }}
    >
      <div className="relative z-10">
        {React.isValidElement(children) ? (
          React.cloneElement(children, {
            size: iconSize,
            className: "text-white drop-shadow-sm",
          })
        ) : (
          <span className="text-white font-bold">{children}</span>
        )}
      </div>
    </div>
  );
};
