import { CiLocationOff } from "react-icons/ci";
import PropTypes from "prop-types";
import { useState } from "react";
import { HexColorPicker, HexColorInput, RgbaStringColorPicker } from "react-colorful";
import { rgbaToHex, isValidHex } from "../utils/colorUtils";

// Default color swatches
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

export const ColorPickerDropdown = ({ recentlyUsedColors = [], customColor = "#ffffff", onColorSelect, onCustomColorChange, onClose }) => {
  const [showAdvancedPicker, setShowAdvancedPicker] = useState(false);
  const [colorMode, setColorMode] = useState("hex"); // 'hex' or 'rgba'
  const [color, setColor] = useState(customColor);

  // Handle color change
  const handleColorChange = (newColor) => {
    setColor(newColor);
    if (colorMode === "hex") {
      onCustomColorChange(newColor);
    } else {
      onCustomColorChange(newColor);
    }
  };

  // Apply the selected color
  const applyColor = () => {
    onColorSelect(color);
    onClose();
  };

  // Convert color format based on mode
  const displayColor = colorMode === "hex" ? (isValidHex(color) ? color : rgbaToHex(color)) : color;

  return (
    <div className="w-72">
      <button
        className="flex items-center gap-2 w-full p-2 text-sm rounded bg-blue-gray-800 text-white"
        onClick={() => {
          onColorSelect("transparent");
          onClose();
        }}
      >
        <CiLocationOff size={16} />
        <span>No Color</span>
      </button>

      <div className="my-3">
        <div className="text-xs text-gray-300 mb-2">Color Swatches</div>
        <div className="grid grid-cols-10 gap-1">
          {defaultColors.map((swatch) => (
            <button key={swatch} className="w-6 h-6 rounded hover:scale-110 transition-transform" style={{ backgroundColor: swatch }} onClick={() => handleColorChange(swatch)} title={swatch} />
          ))}
        </div>
      </div>

      {recentlyUsedColors.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-gray-300 mb-2">Recently Used</div>
          <div className="grid grid-cols-8 gap-1">
            {recentlyUsedColors.map((swatch) => (
              <button key={swatch} className="w-6 h-6 rounded hover:scale-110 transition-transform" style={{ backgroundColor: swatch }} onClick={() => handleColorChange(swatch)} title={swatch} />
            ))}
          </div>
        </div>
      )}

      <button className="text-indigo-500 font-semibold pb-2" onClick={() => setShowAdvancedPicker(!showAdvancedPicker)}>
        {showAdvancedPicker ? "Hide Color Picker" : "More Colors"}
      </button>

      {showAdvancedPicker && (
        <>
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-medium text-white">Color Picker</div>
            <div className="flex gap-2">
              <button className={`text-xs px-2 py-1 rounded ${colorMode === "hex" ? "bg-indigo-500 text-white" : "bg-gray-700 text-gray-300"}`} onClick={() => setColorMode("hex")}>
                HEX
              </button>
              <button className={`text-xs px-2 py-1 rounded ${colorMode === "rgba" ? "bg-indigo-500 text-white" : "bg-gray-700 text-gray-300"}`} onClick={() => setColorMode("rgba")}>
                RGBA
              </button>
            </div>
          </div>

          <div className="mb-3">
            {colorMode === "hex" ? <HexColorPicker color={displayColor} onChange={handleColorChange} /> : <RgbaStringColorPicker color={displayColor} onChange={handleColorChange} />}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1">
              {colorMode === "hex" ? (
                <HexColorInput color={displayColor} onChange={handleColorChange} prefixed alpha className="w-full bg-blue-gray-800 text-white h-8 px-2 rounded text-sm" />
              ) : (
                <input type="text" value={displayColor} onChange={(e) => handleColorChange(e.target.value)} className="bg-blue-gray-800 text-white px-2 py-1 rounded text-sm" />
              )}
            </div>
            <div className="w-8 h-8 rounded" style={{ backgroundColor: displayColor }} />
          </div>
        </>
      )}
      <div className="flex justify-end gap-2 mt-1">
        <button className="px-3 py-1 text-sm bg-red-700 hover:bg-gray-600 rounded text-white" onClick={onClose}>
          Cancel
        </button>
        <button className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-500 rounded text-white" onClick={applyColor}>
          Apply
        </button>
      </div>
    </div>
  );
};

ColorPickerDropdown.propTypes = {
  recentlyUsedColors: PropTypes.arrayOf(PropTypes.string),
  customColor: PropTypes.string,
  onColorSelect: PropTypes.func.isRequired,
  onCustomColorChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
