import { useId } from "react";
import PropTypes from "prop-types";

export const Logo = ({ className = "", size = "medium" }) => {
  const id = useId().replace(/:/g, "");

  const sizes = {
    small: "size-6",
    medium: "size-8",
    large: "size-10",
  };

  const dots = [
    {
      x: 20.4,
      y: 4.6,
      gradient: `top-${id}`,
      colors: ["#ffffff", "#a7bdff", "#3b4a96", "#080a18"],
      glow: "#8fa8ff",
    },
    {
      x: 20.4,
      y: 39.4,
      gradient: `bottom-${id}`,
      colors: ["#fffaf0", "#e8c77c", "#6b431f", "#090504"],
      glow: "#e7bd61",
    },
    {
      x: 5.3,
      y: 13.3,
      gradient: `leftTop-${id}`,
      colors: ["#ffffff", "#e4e4ef", "#777784", "#0c0c12"],
      glow: "#dedeee",
    },
    {
      x: 35.5,
      y: 30.7,
      gradient: `rightBottom-${id}`,
      colors: ["#fff2ec", "#e59b70", "#713426", "#090403"],
      glow: "#e28c58",
    },
    {
      x: 35.5,
      y: 13.3,
      gradient: `rightTop-${id}`,
      colors: ["#ffffff", "#f4f4f8", "#a5a5af", "#15151a"],
      glow: "#f1f1ff",
    },
    {
      x: 5.3,
      y: 30.7,
      gradient: `leftBottom-${id}`,
      colors: ["#f6ffff", "#a4e8e4", "#2c6577", "#060a0d"],
      glow: "#92e2de",
    },
  ];

  return (
    <div
      className={`
        logo relative inline-flex items-center justify-center rounded-full
        ${sizes[size]} ${className}
      `}
      aria-label="Logo"
      role="img"
    >
      <span className="absolute -inset-1 rounded-full bg-white/10 blur-xl opacity-30" />

      <svg className="relative h-full w-full overflow-visible" focusable="false" viewBox="0 0 44 44" fill="none">
        <defs>
          <style>
            {`
              @keyframes logoCosmicSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }

              .logo-cosmic-spin-${id} {
                transform-origin: 22px 22px;
                animation: logoCosmicSpin 14s linear infinite;
              }
            `}
          </style>

          {dots.map((dot) => (
            <radialGradient key={dot.gradient} id={dot.gradient} cx="30%" cy="23%" r="84%">
              <stop offset="0%" stopColor={dot.colors[0]} />
              <stop offset="20%" stopColor={dot.colors[0]} />
              <stop offset="45%" stopColor={dot.colors[1]} />
              <stop offset="74%" stopColor={dot.colors[2]} />
              <stop offset="100%" stopColor={dot.colors[3]} />
            </radialGradient>
          ))}

          <filter id={`softGlow-${id}`} x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur stdDeviation="1.45" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.58 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className={`logo-cosmic-spin-${id}`}>
          {dots.map((dot, index) => (
            <g key={dot.gradient} filter={`url(#softGlow-${id})`}>
              <circle cx={dot.x} cy={dot.y} r="5" fill={dot.glow} opacity="0.16" />

              <circle cx={dot.x} cy={dot.y} r="4.5" fill={`url(#${dot.gradient})`} />

              <ellipse cx={dot.x - 1.2} cy={dot.y - 1.55} rx="1.25" ry="0.82" fill="white" opacity="0.68" transform={`rotate(-24 ${dot.x - 1.2} ${dot.y - 1.55})`} />

              <circle cx={dot.x + 1.35} cy={dot.y + 1.5} r="0.38" fill="white" opacity={index % 2 === 0 ? "0.22" : "0.14"} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

Logo.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};
