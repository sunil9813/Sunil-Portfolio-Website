import { useState, useEffect, useRef } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { ImageToolbar } from "./ImageToolbar";
import PropTypes from "prop-types";

export const ImageView = ({ node, updateAttributes, selected, editor }) => {
  const { src, alt, size, align, flipX, flipY, width, height, objectFit, display, borderRadius } = node.attrs;
  const [isResizing, setIsResizing] = useState(false);
  const [isSelected, setIsSelected] = useState(selected);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, corner: null });
  const [naturalDimensions, setNaturalDimensions] = useState({ naturalWidth: null, naturalHeight: null });
  const imageRef = useRef(null);

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  useEffect(() => {
    const handleSelectionUpdate = () => {
      const { selection } = editor.state;
      const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : -1;
      const { from, to } = selection;
      const isNodeSelected = pos >= 0 && from <= pos && to >= pos;
      setIsSelected(isNodeSelected);
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => editor.off("selectionUpdate", handleSelectionUpdate);
  }, [editor, node]);

  // Calculate natural dimensions when image loads
  useEffect(() => {
    const img = imageRef.current;
    if (img && img.complete) {
      setNaturalDimensions({
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
    } else if (img) {
      img.onload = () => {
        setNaturalDimensions({
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
      };
    }
    return () => {
      if (img) img.onload = null;
    };
  }, [src]);

  const getSizeStyles = () => {
    // Prioritize custom width and height if set
    if (width && height) {
      return { width, height, maxWidth: "100%" };
    }
    if (width) {
      return { width, height: "auto", maxWidth: "100%" };
    }
    if (height) {
      return { height, width: "auto", maxWidth: "100%" };
    }

    // Fallback to size-based defaults
    if (size === "large") {
      return {
        width: display === "inline" ? 300 : "100%",
        height: "auto",
        maxWidth: "100%",
      };
    }

    const sizes = {
      small: { width: display === "inline" ? 200 : 400, height: "auto" },
      medium: { width: display === "inline" ? 300 : 600, height: "auto" },
    };
    return sizes[size] || sizes.medium;
  };

  const getAlignmentStyles = () => {
    if (display === "inline") {
      return {
        margin: align === "left" ? "0 8px 0 0" : align === "right" ? "0 0 0 8px" : "0 8px",
        display: "inline-block",
        verticalAlign: "middle",
      };
    }

    return {
      display: "block",
      margin: align === "center" ? "0 auto" : align === "left" ? "0 0 0 0" : "0 0 0 auto",
      width: size === "large" ? "100%" : width || getSizeStyles().width,
    };
  };

  const getTransformStyles = () => ({
    transform: `${flipX ? "scaleX(-1)" : ""} ${flipY ? "scaleY(-1)" : ""}`,
  });

  const handleMouseDown = (e, corner) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: width || imageRef.current?.naturalWidth || 300,
      height: height || imageRef.current?.naturalHeight || 200,
      corner,
    });
    const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : 0;
    editor.commands.setNodeSelection(pos);
    setIsSelected(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const dx = e.clientX - resizeStart.x;
    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    const aspectRatio = resizeStart.width / resizeStart.height;

    switch (resizeStart.corner) {
      case "top-left":
        newWidth = resizeStart.width - dx;
        newHeight = newWidth / aspectRatio;
        break;
      case "top-right":
        newWidth = resizeStart.width + dx;
        newHeight = newWidth / aspectRatio;
        break;
      case "bottom-left":
        newWidth = resizeStart.width - dx;
        newHeight = newWidth / aspectRatio;
        break;
      case "bottom-right":
        newWidth = resizeStart.width + dx;
        newHeight = newWidth / aspectRatio;
        break;
    }

    if (newWidth < 50) newWidth = 50;
    if (newHeight < 50) newHeight = 50;

    updateAttributes({ width: Math.round(newWidth), height: Math.round(newHeight), size: null });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : 0;
    editor.commands.setNodeSelection(pos);
    setIsSelected(true);
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : 0;
    editor.commands.setNodeSelection(pos);
    setIsSelected(true);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const styles = {
    ...getSizeStyles(),
    ...getAlignmentStyles(),
    ...getTransformStyles(),
    objectFit, // Ensure objectFit is applied directly
    borderRadius: `${borderRadius}px`,
    position: "relative",
    cursor: "default",
  };

  return (
    <NodeViewWrapper as="span" style={{ display: display === "inline" ? "inline-block" : "block" }}>
      <div className="relative" style={{ display: display === "inline" ? "inline-block" : "block" }} onClick={(e) => e.stopPropagation()}>
        {isSelected && (
          <ImageToolbar
            onSizeChange={(newSize) => {
              updateAttributes({ size: newSize, width: null, height: null });
              const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : 0;
              editor.commands.setNodeSelection(pos);
              setIsSelected(true);
            }}
            onAlignChange={(newAlign) => {
              updateAttributes({ align: newAlign });
              const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : 0;
              editor.commands.setNodeSelection(pos);
              setIsSelected(true);
            }}
            onFlipX={(e) => {
              e.stopPropagation();
              updateAttributes({ flipX: !flipX });
              const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : 0;
              editor.commands.setNodeSelection(pos);
              setIsSelected(true);
            }}
            onFlipY={(e) => {
              e.stopPropagation();
              updateAttributes({ flipY: !flipY });
              const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : 0;
              editor.commands.setNodeSelection(pos);
              setIsSelected(true);
            }}
            onDelete={() => {
              editor.commands.deleteImage();
              setIsSelected(false);
            }}
            onCustomSizeChange={(newWidth, newHeight) => {
              updateAttributes({ width: newWidth, height: newHeight, size: null });
              const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : 0;
              editor.commands.setNodeSelection(pos);
              setIsSelected(true);
            }}
            onObjectFitChange={(newObjectFit) => {
              updateAttributes({ objectFit: newObjectFit });
              const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : 0;
              editor.commands.setNodeSelection(pos);
              setIsSelected(true);
            }}
            onDisplayChange={(newDisplay) => {
              updateAttributes({ display: newDisplay });
              const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : 0;
              editor.commands.setNodeSelection(pos);
              setIsSelected(true);
            }}
            onBorderRadiusChange={(newRadius) => {
              updateAttributes({ borderRadius: newRadius });
              const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : 0;
              editor.commands.setNodeSelection(pos);
              setIsSelected(true);
            }}
            currentSize={size}
            currentAlign={align}
            flipX={flipX}
            flipY={flipY}
            currentWidth={width}
            currentHeight={height}
            currentObjectFit={objectFit}
            currentDisplay={display}
            currentBorderRadius={borderRadius}
            naturalWidth={naturalDimensions.naturalWidth}
            naturalHeight={naturalDimensions.naturalHeight}
          />
        )}
        <img ref={imageRef} src={src} alt={alt} style={styles} className={`custom-image ${isSelected ? "custom-image-selected" : ""}`} onClick={handleImageClick} />
        {(isSelected || isResizing) && (
          <>
            <div className="resize-handle top-left" onMouseDown={(e) => handleMouseDown(e, "top-left")} style={{ top: 0, left: 0, transform: "translate(-50%, -50%)", cursor: "nwse-resize" }} />
            <div className="resize-handle top-right" onMouseDown={(e) => handleMouseDown(e, "top-right")} style={{ top: 0, right: 0, transform: "translate(50%, -50%)", cursor: "nesw-resize" }} />
            <div
              className="resize-handle bottom-left"
              onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
              style={{ bottom: 0, left: 0, transform: "translate(-50%, 50%)", cursor: "nesw-resize" }}
            />
            <div
              className="resize-handle bottom-right"
              onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
              style={{ bottom: 0, right: 0, transform: "translate(50%, 50%)", cursor: "nwse-resize" }}
            />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};

ImageView.propTypes = {
  node: PropTypes.shape({
    attrs: PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
      size: PropTypes.oneOf(["small", "medium", "large"]),
      align: PropTypes.oneOf(["left", "center", "right"]),
      flipX: PropTypes.bool,
      flipY: PropTypes.bool,
      width: PropTypes.number,
      height: PropTypes.number,
      objectFit: PropTypes.oneOf(["contain", "cover", "fill", "none", "scale-down"]),
      display: PropTypes.oneOf(["inline", "block"]),
      borderRadius: PropTypes.number,
    }).isRequired,
  }).isRequired,
  updateAttributes: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  editor: PropTypes.shape({
    state: PropTypes.shape({
      selection: PropTypes.shape({
        from: PropTypes.number,
        to: PropTypes.number,
      }),
    }),
    view: PropTypes.shape({
      posAtDOM: PropTypes.func,
    }),
    on: PropTypes.func,
    off: PropTypes.func,
    commands: PropTypes.shape({
      setNodeSelection: PropTypes.func,
      deleteImage: PropTypes.func,
    }),
  }).isRequired,
};
