import Button from "@/textEditor/TollBar/Button";
import { CiAlignCenterH, CiAlignLeft, CiAlignRight } from "react-icons/ci";
import { LuFlipHorizontal, LuFlipVertical } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { FaRulerCombined } from "react-icons/fa";
import { DropdownWrapper } from "@/textEditor/common/DropdownWrapper";
import { FiMinus, FiPlus } from "react-icons/fi";

export const ImageToolbar = ({
  onSizeChange,
  onAlignChange,
  onFlipX,
  onFlipY,
  onDelete,
  onCustomSizeChange,
  onObjectFitChange,
  onDisplayChange,
  onBorderRadiusChange,
  currentSize,
  currentAlign,
  flipX,
  flipY,
  currentWidth,
  currentHeight,
  currentObjectFit,
  currentDisplay,
  currentBorderRadius,
  naturalWidth,
  naturalHeight,
}) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [width, setWidth] = useState(currentWidth || naturalWidth || 300);
  const [height, setHeight] = useState(currentHeight || naturalHeight || 200);
  const [borderRadius, setBorderRadius] = useState(currentBorderRadius || 0);

  // Sync local state with props
  useEffect(() => {
    setWidth(currentWidth || naturalWidth || 300);
    setHeight(currentHeight || naturalHeight || 200);
    setBorderRadius(currentBorderRadius || 0);
  }, [currentWidth, currentHeight, currentBorderRadius, naturalWidth, naturalHeight]);

  const handleCustomSizeSubmit = (e) => {
    e.preventDefault();
    if (width > 0 && height > 0) {
      onCustomSizeChange(width, height);
    }
    setIsCustomOpen(false);
  };

  const handleObjectFitChange = (e) => {
    onObjectFitChange(e.target.value);
    setIsCustomOpen(false);
  };

  const handleDisplayChange = (e) => {
    onDisplayChange(e.target.value);
    setIsCustomOpen(false);
  };

  const handleWidthChange = (increment) => {
    const newWidth = Math.max(50, width + (increment ? 10 : -10));
    setWidth(newWidth);
    onCustomSizeChange(newWidth, height);
  };

  const handleHeightChange = (increment) => {
    const newHeight = Math.max(50, height + (increment ? 10 : -10));
    setHeight(newHeight);
    onCustomSizeChange(width, newHeight);
  };

  const handleBorderRadiusChange = (increment) => {
    const newRadius = Math.max(0, borderRadius + (increment ? 1 : -1));
    setBorderRadius(newRadius);
    onBorderRadiusChange(newRadius);
  };

  return (
    <div className="absolute -top-14 left-0 right-0 flex justify-center z-[120] image-toolbar" onClick={(e) => e.stopPropagation()}>
      <div className="bg-black text-white rounded-lg shadow-lg flex items-center p-2 space-x-2 relative">
        {/* Size Controls */}
        <div className="flex space-x-1">
          <Button active={currentSize === "small"} onClick={() => onSizeChange("small")} tooltip="Small Size">
            <span className="text-sm font-semibold">S</span>
          </Button>
          <Button active={currentSize === "medium"} onClick={() => onSizeChange("medium")} tooltip="Medium Size">
            <span className="text-sm font-semibold">M</span>
          </Button>
          <Button active={currentSize === "large"} onClick={() => onSizeChange("large")} tooltip="Large Size">
            <span className="text-sm font-semibold">L</span>
          </Button>
        </div>
        <div className="h-5 w-[1px] bg-white/20 mx-5" />

        {/* Alignment Controls */}
        <div className="flex space-x-1">
          <Button active={currentAlign === "left"} onClick={() => onAlignChange("left")} tooltip="Align Left">
            <CiAlignLeft />
          </Button>
          <Button active={currentAlign === "center"} onClick={() => onAlignChange("center")} tooltip="Align Center">
            <CiAlignCenterH />
          </Button>
          <Button active={currentAlign === "right"} onClick={() => onAlignChange("right")} tooltip="Align Right">
            <CiAlignRight />
          </Button>
        </div>
        <div className="h-5 w-[1px] bg-white/20 mx-5" />

        {/* Flip Controls */}
        <div className="flex space-x-1">
          <Button active={flipX} onClick={onFlipX} tooltip="Flip Horizontally">
            <LuFlipHorizontal />
          </Button>
          <Button active={flipY} onClick={onFlipY} tooltip="Flip Vertically">
            <LuFlipVertical />
          </Button>
        </div>
        <div className="h-5 w-[1px] bg-white/20 mx-5" />

        {/* Custom Settings Button */}
        <Button onClick={() => setIsCustomOpen(!isCustomOpen)} tooltip="Custom Settings">
          <FaRulerCombined />
        </Button>

        {/* Delete Button */}
        <Button onClick={onDelete} tooltip="Delete Image">
          <MdDeleteOutline />
        </Button>

        {/* Custom Settings Dropdown */}
        <DropdownWrapper isOpen={isCustomOpen} onClose={() => setIsCustomOpen(false)} className="w-64">
          <form onSubmit={handleCustomSizeSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-textcolor">{naturalWidth && `Natural Width: ${naturalWidth}px`}</label>
              <div className="flex items-center bg-gray-800 rounded-lg">
                <button type="button" onClick={() => handleWidthChange(false)} className="bg-gray-700 text-[16px] p-2 px-5 rounded-bl-md rounded-tl-md">
                  <FiMinus size={20} />
                </button>
                <span className="flex-1 text-center text-white font-semibold">{width}</span>
                <button type="button" onClick={() => handleWidthChange(true)} className="bg-gray-700 p-2 px-5 rounded-br-md rounded-tr-md">
                  <FiPlus size={20} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 text-textcolor">{naturalHeight && `Natural Height: ${naturalHeight}px`}</label>
              <div className="flex items-center bg-gray-800 rounded-lg">
                <button type="button" onClick={() => handleHeightChange(false)} className="bg-gray-700 text-[16px] p-2 px-5 rounded-bl-md rounded-tl-md">
                  <FiMinus size={20} />
                </button>
                <span className="flex-1 text-center text-white font-semibold">{height}</span>
                <button type="button" onClick={() => handleHeightChange(true)} className="bg-gray-700 p-2 px-5 rounded-br-md rounded-tr-md">
                  <FiPlus size={20} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 text-textcolor">Object Fit</label>
              <select value={currentObjectFit} onChange={handleObjectFitChange} className="w-full bg-gray-800 text-white rounded p-1 outline-none">
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
                <option value="scale-down">Scale Down</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-textcolor">Display</label>
              <select value={currentDisplay} onChange={handleDisplayChange} className="w-full bg-gray-800 text-white rounded p-1 outline-none">
                <option value="block">Block</option>
                <option value="inline">Inline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-textcolor">Border Radius (px)</label>
              <div className="flex items-center bg-gray-800 rounded-lg">
                <button type="button" onClick={() => handleBorderRadiusChange(false)} className="bg-gray-700 text-[16px] p-2 px-5 rounded-bl-md rounded-tl-md">
                  <FiMinus size={20} />
                </button>
                <span className="flex-1 text-center text-white font-semibold">{borderRadius}</span>
                <button type="button" onClick={() => handleBorderRadiusChange(true)} className="bg-gray-700 p-2 px-5 rounded-br-md rounded-tr-md">
                  <FiPlus size={20} />
                </button>
              </div>
            </div>
          </form>
        </DropdownWrapper>
      </div>
    </div>
  );
};

ImageToolbar.propTypes = {
  onSizeChange: PropTypes.func.isRequired,
  onAlignChange: PropTypes.func.isRequired,
  onFlipX: PropTypes.func.isRequired,
  onFlipY: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCustomSizeChange: PropTypes.func.isRequired,
  onObjectFitChange: PropTypes.func.isRequired,
  onDisplayChange: PropTypes.func.isRequired,
  onBorderRadiusChange: PropTypes.func.isRequired,
  currentSize: PropTypes.oneOf(["small", "medium", "large"]).isRequired,
  currentAlign: PropTypes.oneOf(["left", "center", "right"]).isRequired,
  flipX: PropTypes.bool.isRequired,
  flipY: PropTypes.bool.isRequired,
  currentWidth: PropTypes.number,
  currentHeight: PropTypes.number,
  currentObjectFit: PropTypes.oneOf(["cover", "contain", "fill", "scale-down"]).isRequired,
  currentDisplay: PropTypes.oneOf(["block", "inline"]).isRequired,
  currentBorderRadius: PropTypes.number.isRequired,
  naturalWidth: PropTypes.number,
  naturalHeight: PropTypes.number,
};

ImageToolbar.defaultProps = {
  currentSize: "medium",
  currentAlign: "center",
  flipX: false,
  flipY: false,
  currentWidth: null,
  currentHeight: null,
  currentObjectFit: "cover",
  currentDisplay: "inline",
  currentBorderRadius: 0,
  naturalWidth: null,
  naturalHeight: null,
};
