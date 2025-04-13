import { CiLocationOff } from "react-icons/ci";
import PropTypes from "prop-types";

const tailwindColors = {
  gray: ["#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563", "#374151", "#1f2937", "#111827"],
  red: ["#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"],
  amber: ["#fffbeb", "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f"],
  teal: ["#f0fdfa", "#ccfbf1", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a"],
  indigo: ["#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81"],
  fuchsia: ["#fdf4ff", "#fae8ff", "#f5d0fe", "#f0abfc", "#e879f9", "#d946ef", "#c026d3", "#a21caf", "#86198f", "#701a75"],
  rose: ["#fff1f2", "#ffe4e6", "#fecdd3", "#fda4af", "#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337"],
};

const defaultColors = Object.values(tailwindColors).flat();

export const ColorPickerDropdown = ({ recentlyUsedColors, customColor, onColorSelect, onCustomColorChange }) => {
  return (
    <div className="absolute top-10 left-0 p-3 bg-blue-gray-900 rounded-xl z-50">
      <div className="color-section">
        <button className="flex items-center gap-2 p-1 text-sm rounded-sm mb-2 bg-primarybg w-full" onClick={() => onColorSelect("transparent")}>
          <CiLocationOff size={18} />
          <span>No Fill</span>
        </button>
        <div className="w-60 flex flex-wrap">
          {defaultColors.map((color) => (
            <div
              key={color}
              className="h-4 w-4 rounded color-swatch hover:scale-110 transition-transform m-0.5"
              style={{ backgroundColor: color, border: `1px solid ${color}` }}
              onClick={() => onColorSelect(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      {recentlyUsedColors.length > 0 && (
        <div className="color-section mt-3">
          <div className="text-xs text-gray-300 mb-1">Recently Used</div>
          <div className="w-60 flex flex-wrap">
            {recentlyUsedColors.map((color) => (
              <div
                key={color}
                className="h-4 w-4 rounded color-swatch hover:scale-110 transition-transform m-0.5"
                style={{ backgroundColor: color, border: `1px solid ${color}` }}
                onClick={() => onColorSelect(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-3">
        <div className="text-xs text-gray-300 mb-1">More Colors</div>
        <div className="flex items-center gap-2 p-1">
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              const color = e.target.value;
              onCustomColorChange(color);
              onColorSelect(color);
            }}
            className="w-full h-5 rounded cursor-pointer outline-none border-none"
          />
          <div className="text-xs text-gray-300">{customColor.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
};

ColorPickerDropdown.propTypes = {
  recentlyUsedColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  customColor: PropTypes.string.isRequired,
  onColorSelect: PropTypes.func.isRequired,
  onCustomColorChange: PropTypes.func.isRequired,
};
