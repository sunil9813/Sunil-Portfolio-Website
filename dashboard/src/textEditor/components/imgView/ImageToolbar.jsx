import Button from "@/textEditor/TollBar/Button";
import { CiAlignCenterH, CiAlignLeft, CiAlignRight } from "react-icons/ci";
import { LuFlipHorizontal, LuFlipVertical } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { DropdownWrapper } from "@/textEditor/common/DropdownWrapper";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Settings2 } from "lucide-react";

const NumberStepper = ({ label, value, onDecrease, onIncrease }) => (
  <div className="group/setting flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-all duration-300 hover:border-white/[0.05] hover:bg-white/[0.018]">
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-semibold text-white/35">{label}</p>
      <p className="mt-0.5 text-xs font-bold text-white/75">{value}</p>
    </div>

    <div className="flex h-8 overflow-hidden rounded-lg border border-white/[0.05] bg-white/[0.014]">
      <button type="button" onClick={onDecrease} className="flex w-9 items-center justify-center text-white/35 transition hover:bg-white/[0.03] hover:text-white/70">
        <FiMinus size={15} />
      </button>

      <button type="button" onClick={onIncrease} className="flex w-9 items-center justify-center border-l border-white/[0.05] text-white/35 transition hover:bg-white/[0.03] hover:text-white/70">
        <FiPlus size={15} />
      </button>
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, children }) => (
  <label className="group/setting flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-all duration-300 hover:border-white/[0.05] hover:bg-white/[0.018]">
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-semibold text-white/35">{label}</p>
      <p className="mt-0.5 text-xs font-bold capitalize text-white/75">{value}</p>
    </div>

    <select
      value={value}
      onChange={onChange}
      className="h-8 w-[120px] rounded-lg border border-white/[0.05] bg-white/[0.014] px-2 text-[10px] font-bold text-white/60 outline-none transition focus:border-emerald-300/[0.14]"
    >
      {children}
    </select>
  </label>
);

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

  useEffect(() => {
    setWidth(currentWidth || naturalWidth || 300);
    setHeight(currentHeight || naturalHeight || 200);
    setBorderRadius(currentBorderRadius || 0);
  }, [currentWidth, currentHeight, currentBorderRadius, naturalWidth, naturalHeight]);

  const handleWidthChange = (increment) => {
    const newWidth = Math.max(80, width + (increment ? 10 : -10));
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
    <div className="image-toolbar absolute -top-16 left-0 right-0 z-[120] flex justify-center" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-[#080c12]/95 p-2 shadow-[0_18px_42px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
        <div className="flex items-center gap-1">
          <Button active={currentSize === "small"} onClick={() => onSizeChange("small")} tooltip="Small Size">
            <span className="text-xs font-bold">S</span>
          </Button>
          <Button active={currentSize === "medium"} onClick={() => onSizeChange("medium")} tooltip="Medium Size">
            <span className="text-xs font-bold">M</span>
          </Button>
          <Button active={currentSize === "large"} onClick={() => onSizeChange("large")} tooltip="Large Size">
            <span className="text-xs font-bold">L</span>
          </Button>
        </div>

        <div className="h-5 w-px bg-white/[0.08]" />

        <div className="flex items-center gap-1">
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

        <div className="h-5 w-px bg-white/[0.08]" />

        <div className="flex items-center gap-1">
          <Button active={flipX} onClick={onFlipX} tooltip="Flip Horizontally">
            <LuFlipHorizontal />
          </Button>
          <Button active={flipY} onClick={onFlipY} tooltip="Flip Vertically">
            <LuFlipVertical />
          </Button>
        </div>

        <div className="h-5 w-px bg-white/[0.08]" />

        <Button active={isCustomOpen} onClick={() => setIsCustomOpen(!isCustomOpen)} tooltip="Custom Settings">
          <Settings2 />
        </Button>

        <Button className="!bg-red-500" onClick={onDelete} tooltip="Delete Image">
          <MdDeleteOutline />
        </Button>

        <DropdownWrapper isOpen={isCustomOpen} onClose={() => setIsCustomOpen(false)} className="!w-[320px] !p-2">
          <div className="relative overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.018] p-3">
            <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-emerald-400/[0.045] blur-2xl" />

            <div className="relative space-y-1">
              <NumberStepper label={naturalWidth ? `Natural Width: ${naturalWidth}px` : "Width"} value={width} onDecrease={() => handleWidthChange(false)} onIncrease={() => handleWidthChange(true)} />

              <NumberStepper
                label={naturalHeight ? `Natural Height: ${naturalHeight}px` : "Height"}
                value={height}
                onDecrease={() => handleHeightChange(false)}
                onIncrease={() => handleHeightChange(true)}
              />

              <SelectField label="Object Fit" value={currentObjectFit} onChange={(event) => onObjectFitChange(event.target.value)}>
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
                <option value="scale-down">Scale Down</option>
              </SelectField>

              <SelectField label="Display" value={currentDisplay} onChange={(event) => onDisplayChange(event.target.value)}>
                <option value="inline">Inline</option>
                <option value="block">Block</option>
              </SelectField>

              <NumberStepper label="Border Radius" value={borderRadius} onDecrease={() => handleBorderRadiusChange(false)} onIncrease={() => handleBorderRadiusChange(true)} />
            </div>
          </div>
        </DropdownWrapper>
      </div>
    </div>
  );
};

NumberStepper.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onDecrease: PropTypes.func.isRequired,
  onIncrease: PropTypes.func.isRequired,
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
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
  currentSize: PropTypes.oneOf(["small", "medium", "large"]),
  currentAlign: PropTypes.oneOf(["left", "center", "right"]),
  flipX: PropTypes.bool,
  flipY: PropTypes.bool,
  currentWidth: PropTypes.number,
  currentHeight: PropTypes.number,
  currentObjectFit: PropTypes.oneOf(["cover", "contain", "fill", "scale-down"]),
  currentDisplay: PropTypes.oneOf(["inline", "block"]),
  currentBorderRadius: PropTypes.number,
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
