import Button from "@/textEditor/TollBar/Button";
import PropTypes from "prop-types";
import { TbGridDots } from "react-icons/tb";
import { useState } from "react";

const GridBoxButton = ({ editor }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [columnCount, setColumnCount] = useState(2);
  const [borderWidth, setBorderWidth] = useState("1px");
  const [borderStyle, setBorderStyle] = useState("solid");
  const [borderColor, setBorderColor] = useState("#e0e0e0");
  const [borderRadius, setBorderRadius] = useState("4px");
  const [spacing, setSpacing] = useState("16px");
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("200px");

  const insertGrid = () => {
    editor
      .chain()
      .focus()
      .insertGridBox({
        columnCount,
        borderWidth,
        borderStyle,
        borderColor,
        borderRadius,
        spacing,
        width,
        height,
      })
      .run();
    setShowOptions(false);
  };

  const columnOptions = [
    { label: "2 Columns", value: 2 },
    { label: "3 Columns", value: 3 },
    { label: "4 Columns", value: 4 },
    { label: "5 Columns", value: 5 },
  ];
  const borderWidthOptions = ["0px", "1px", "2px", "4px"];
  const borderStyleOptions = ["solid", "dashed", "dotted"];
  const borderColorOptions = [
    { label: "Gray", value: "#e0e0e0" },
    { label: "Black", value: "#000000" },
    { label: "Blue", value: "#0000ff" },
    { label: "Red", value: "#ff0000" },
  ];
  const borderRadiusOptions = ["0px", "4px", "8px", "12px"];
  const spacingOptions = ["8px", "16px", "24px", "32px"];
  const widthOptions = ["100%", "75%", "50%"];
  const heightOptions = ["200px", "300px", "400px", "500px"];

  return (
    <div className="relative">
      <Button active={editor.isActive("gridBox")} onClick={() => setShowOptions(!showOptions)} tooltip="Insert Grid">
        <TbGridDots />
      </Button>
      {showOptions && (
        <div className="absolute top-full mt-2 left-0 z-[9999] bg-white border border-gray-200 rounded-lg p-4 shadow-lg w-80 max-h-[80vh] overflow-y-auto">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Columns:</label>
            <select value={columnCount} onChange={(e) => setColumnCount(parseInt(e.target.value))} className="w-full p-1 border rounded">
              {columnOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Border Width:</label>
            <select value={borderWidth} onChange={(e) => setBorderWidth(e.target.value)} className="w-full p-1 border rounded">
              {borderWidthOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Border Style:</label>
            <select value={borderStyle} onChange={(e) => setBorderStyle(e.target.value)} className="w-full p-1 border rounded">
              {borderStyleOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Border Color:</label>
            <select value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full p-1 border rounded">
              {borderColorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Border Radius:</label>
            <select value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="w-full p-1 border rounded">
              {borderRadiusOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Spacing (Gap):</label>
            <select value={spacing} onChange={(e) => setSpacing(e.target.value)} className="w-full p-1 border rounded">
              {spacingOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Width:</label>
            <select value={width} onChange={(e) => setWidth(e.target.value)} className="w-full p-1 border rounded">
              {widthOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Height:</label>
            <select value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-1 border rounded">
              {heightOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <button onClick={insertGrid} className="w-full px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Insert Grid
          </button>
        </div>
      )}
    </div>
  );
};

GridBoxButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default GridBoxButton;
