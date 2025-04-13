import { NodeViewWrapper } from "@tiptap/react";
import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { CiAlignLeft, CiAlignCenterH, CiAlignRight } from "react-icons/ci";

import { MdFitScreen, MdOutlineAspectRatio } from "react-icons/md";

const ResizableImageComponent = ({ node, updateAttributes, editor, getPos, selected }) => {
  const imgRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [lockAspectRatio, setLockAspectRatio] = useState(true);

  const { src, alt, title, width, height, imageId, align } = node.attrs;

  const alignmentOptions = [
    { value: "left", icon: <CiAlignLeft size={18} />, tooltip: "Align Left" },
    { value: "center", icon: <CiAlignCenterH size={18} />, tooltip: "Align Center" },
    { value: "right", icon: <CiAlignRight size={18} />, tooltip: "Align Right" },
    { value: "full-width", icon: <MdFitScreen size={18} />, tooltip: "Full Width" },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;

      let newWidth = startSize.width + dx;
      let newHeight = startSize.height;

      if (lockAspectRatio) {
        const aspectRatio = naturalSize.width / naturalSize.height;
        newHeight = newWidth / aspectRatio;
      } else {
        newHeight = "auto";
      }

      updateAttributes({
        width: Math.max(50, newWidth),
        height: newHeight,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Shift") {
        setLockAspectRatio(false);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Shift") {
        setLockAspectRatio(true);
      }
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isResizing, startPos, startSize, naturalSize, lockAspectRatio, updateAttributes]);

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setNaturalSize({ width: naturalWidth, height: naturalHeight });

    if (!width || width === "100%") {
      updateAttributes({
        width: naturalWidth,
        height: "auto",
        align: align || "center",
      });
    }
  };

  // Apply alignment styles
  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement) return;

    // Reset all alignment styles
    imgElement.style.display = "";
    imgElement.style.marginLeft = "";
    imgElement.style.marginRight = "";
    imgElement.style.width = "";

    // Apply new alignment
    switch (align) {
      case "left":
        imgElement.style.display = "inline-block";
        imgElement.style.marginRight = "auto";
        imgElement.style.marginLeft = "0";
        break;
      case "center":
        imgElement.style.display = "inline-block";
        imgElement.style.marginLeft = "auto";
        imgElement.style.marginRight = "auto";
        break;
      case "right":
        imgElement.style.display = "inline-block";
        imgElement.style.marginLeft = "auto";
        imgElement.style.marginRight = "0";
        break;
      case "full-width":
        imgElement.style.width = "100%";
        imgElement.style.display = "block";
        imgElement.style.marginLeft = "0";
        imgElement.style.marginRight = "0";
        break;
      default:
        imgElement.style.display = "inline-block";
        imgElement.style.marginLeft = "auto";
        imgElement.style.marginRight = "auto";
    }
  }, [align]);

  const handleAlignmentChange = (newAlign) => {
    updateAttributes({
      align: newAlign,
      width: newAlign === "full-width" ? "100%" : width,
    });
  };

  const resetSize = () => {
    if (imgRef.current) {
      updateAttributes({
        width: naturalSize.width,
        height: "auto",
      });
    }
  };

  const toggleAspectRatioLock = () => {
    setLockAspectRatio(!lockAspectRatio);
  };

  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });

    const currentWidth = parseInt(width) || imgRef.current?.naturalWidth || 0;
    setStartSize({
      width: currentWidth,
      height: imgRef.current?.naturalHeight || 0,
    });
  };

  const deleteImage = () => {
    const from = getPos();
    const to = from + node.nodeSize;
    editor.commands.deleteRange({ from, to });

    if (imageId) {
      // Call your image deletion API here
      // dispatch(deleteImage(imageId));
    }
  };

  return (
    <NodeViewWrapper className={`resizable-image-container ${align || "center"}`}>
      <div className={`image-wrapper ${selected ? "selected" : ""}`}>
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          title={title}
          style={{
            width: align === "full-width" ? "100%" : width || "100%",
            height: lockAspectRatio ? height : "auto",
            maxWidth: "100%",
          }}
          onLoad={handleLoad}
          data-align={align}
        />

        {selected && (
          <div className="image-controls">
            <div className="alignment-controls">
              {alignmentOptions.map((option) => (
                <button key={option.value} className={`align-btn ${align === option.value ? "active" : ""}`} onClick={() => handleAlignmentChange(option.value)} title={option.tooltip}>
                  {option.icon}
                </button>
              ))}
            </div>

            <button className={`aspect-ratio-btn ${lockAspectRatio ? "active" : ""}`} onClick={toggleAspectRatioLock} title={lockAspectRatio ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}>
              <MdOutlineAspectRatio size={18} />
            </button>

            <button className="reset-button" onClick={resetSize} title="Reset to original size">
              <MdFitScreen size={18} />
            </button>

            <div className="resize-handle" onMouseDown={startResize} title={lockAspectRatio ? "Resize (Shift to free resize)" : "Free resizing"} />

            <button className="delete-button" onClick={deleteImage} title="Delete image">
              <IoClose size={18} />
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default ResizableImageComponent;
