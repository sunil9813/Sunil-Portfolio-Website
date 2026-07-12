import { useCallback, useEffect, useRef, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { ImageToolbar } from "./ImageToolbar";
import PropTypes from "prop-types";

export const ImageView = ({ node, updateAttributes, selected, editor }) => {
  const { src, alt, size, align, flipX, flipY, width, height, objectFit, display, borderRadius } = node.attrs;

  const [isResizing, setIsResizing] = useState(false);
  const [isSelected, setIsSelected] = useState(selected);
  const [previewSize, setPreviewSize] = useState({
    width: width || null,
    height: height || null,
  });
  const [naturalDimensions, setNaturalDimensions] = useState({
    naturalWidth: null,
    naturalHeight: null,
  });

  const imageRef = useRef(null);
  const resizeStartRef = useRef(null);
  const latestPreviewSizeRef = useRef(previewSize);
  const frameRef = useRef(null);

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  useEffect(() => {
    latestPreviewSizeRef.current = previewSize;
  }, [previewSize]);

  useEffect(() => {
    if (!isResizing) {
      setPreviewSize({
        width: width || null,
        height: height || null,
      });
    }
  }, [width, height, isResizing]);

  const selectImage = useCallback(() => {
    const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : -1;

    if (pos >= 0) {
      editor.commands.setNodeSelection(pos);
    }

    setIsSelected(true);
  }, [editor]);

  const updateCurrentImage = useCallback(
    (attrs) => {
      updateAttributes(attrs);
      selectImage();
    },
    [updateAttributes, selectImage],
  );

  useEffect(() => {
    const handleSelectionUpdate = () => {
      const { selection } = editor.state;
      const pos = imageRef.current ? editor.view.posAtDOM(imageRef.current, 0) : -1;
      const { from, to } = selection;

      setIsSelected(pos >= 0 && from <= pos && to >= pos);
    };

    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => editor.off("selectionUpdate", handleSelectionUpdate);
  }, [editor]);

  useEffect(() => {
    const img = imageRef.current;

    if (!img) return;

    const updateNaturalSize = () => {
      setNaturalDimensions({
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
    };

    if (img.complete) {
      updateNaturalSize();
    } else {
      img.onload = updateNaturalSize;
    }

    return () => {
      img.onload = null;
    };
  }, [src]);

  const getBaseSize = () => {
    const activeWidth = previewSize.width || width;
    const activeHeight = previewSize.height || height;

    if (activeWidth && activeHeight) {
      return {
        width: activeWidth,
        height: activeHeight,
        maxWidth: "100%",
      };
    }

    if (activeWidth) {
      return {
        width: activeWidth,
        height: "auto",
        maxWidth: "100%",
      };
    }

    if (activeHeight) {
      return {
        height: activeHeight,
        width: "auto",
        maxWidth: "100%",
      };
    }

    if (size === "large") {
      return {
        width: "100%",
        height: "auto",
        maxWidth: "100%",
      };
    }

    if (size === "small") {
      return {
        width: 220,
        height: "auto",
        maxWidth: "100%",
      };
    }

    return {
      width: 420,
      height: "auto",
      maxWidth: "100%",
    };
  };

  const getLayoutStyles = () => {
    const isLeftInline = display === "inline" && align === "left";

    if (isLeftInline) {
      return {
        wrapperStyle: {
          display: "inline-block",
          width: "auto",
          maxWidth: "100%",
          margin: "0 10px 10px 0",
          verticalAlign: "middle",
          textAlign: "left",
        },
        frameStyle: {
          display: "inline-block",
          maxWidth: "100%",
        },
        imageStyle: {
          display: "block",
          margin: 0,
        },
      };
    }

    return {
      wrapperStyle: {
        display: "block",
        width: "100%",
        maxWidth: "100%",
        margin: "0 0 16px 0",
        textAlign: align === "right" ? "right" : align === "center" ? "center" : "left",
      },
      frameStyle: {
        display: "inline-block",
        maxWidth: "100%",
      },
      imageStyle: {
        display: "block",
        margin: 0,
      },
    };
  };

  const layout = getLayoutStyles();

  const imageStyles = {
    ...getBaseSize(),
    ...layout.imageStyle,
    objectFit,
    borderRadius: `${borderRadius || 0}px`,
    transform: `${flipX ? "scaleX(-1)" : ""} ${flipY ? "scaleY(-1)" : ""}`,
    cursor: "default",
  };

  const handleImageClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    selectImage();
  };

  const handleMouseDown = (event, corner) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = imageRef.current.getBoundingClientRect();

    resizeStartRef.current = {
      x: event.clientX,
      width: rect.width,
      height: rect.height,
      corner,
    };

    const startSize = {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };

    setPreviewSize(startSize);
    latestPreviewSizeRef.current = startSize;

    setIsResizing(true);
    selectImage();
  };

  const handleMouseMove = useCallback((event) => {
    if (!resizeStartRef.current) return;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      const start = resizeStartRef.current;
      const dx = event.clientX - start.x;
      const aspectRatio = start.width / start.height;

      let nextWidth = start.corner === "top-left" || start.corner === "bottom-left" ? start.width - dx : start.width + dx;

      nextWidth = Math.max(80, nextWidth);

      const nextSize = {
        width: Math.round(nextWidth),
        height: Math.round(Math.max(50, nextWidth / aspectRatio)),
      };

      latestPreviewSizeRef.current = nextSize;
      setPreviewSize(nextSize);
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    const finalSize = latestPreviewSizeRef.current;

    setIsResizing(false);

    if (finalSize.width && finalSize.height) {
      updateCurrentImage({
        width: finalSize.width,
        height: finalSize.height,
        size: null,
      });
    }

    resizeStartRef.current = null;
    selectImage();
  }, [selectImage, updateCurrentImage]);

  useEffect(() => {
    if (!isResizing) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <NodeViewWrapper as="span" className={`custom-image-node custom-image-node--${align || "left"}`} style={layout.wrapperStyle}>
      <div className={`custom-image-frame ${isSelected ? "is-selected" : ""}`} style={layout.frameStyle} onClick={(event) => event.stopPropagation()}>
        {isSelected && (
          <ImageToolbar
            onSizeChange={(newSize) => {
              updateCurrentImage({
                size: newSize,
                width: null,
                height: null,
              });
            }}
            onAlignChange={(newAlign) => {
              updateCurrentImage({
                align: newAlign,
              });
            }}
            onFlipX={(event) => {
              event.stopPropagation();
              updateCurrentImage({ flipX: !flipX });
            }}
            onFlipY={(event) => {
              event.stopPropagation();
              updateCurrentImage({ flipY: !flipY });
            }}
            onDelete={() => {
              editor.commands.deleteImage();
              setIsSelected(false);
            }}
            onCustomSizeChange={(newWidth, newHeight) => {
              updateCurrentImage({
                width: newWidth,
                height: newHeight,
                size: null,
              });
            }}
            onObjectFitChange={(newObjectFit) => {
              updateCurrentImage({ objectFit: newObjectFit });
            }}
            onDisplayChange={(newDisplay) => {
              updateCurrentImage({ display: newDisplay });
            }}
            onBorderRadiusChange={(newRadius) => {
              updateCurrentImage({ borderRadius: newRadius });
            }}
            currentSize={size}
            currentAlign={align}
            flipX={flipX}
            flipY={flipY}
            currentWidth={previewSize.width || width}
            currentHeight={previewSize.height || height}
            currentObjectFit={objectFit}
            currentDisplay={display}
            currentBorderRadius={borderRadius}
            naturalWidth={naturalDimensions.naturalWidth}
            naturalHeight={naturalDimensions.naturalHeight}
          />
        )}
        <img ref={imageRef} src={src} alt={alt || ""} style={imageStyles} className={`custom-image ${isSelected ? "custom-image-selected" : ""}`} onClick={handleImageClick} draggable={false} />

        {(isSelected || isResizing) && (
          <span className="image-resize-handle image-resize-handle-bottom-right" data-resize-handle="bottom-right" onMouseDown={(event) => handleMouseDown(event, "bottom-right")} />
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
  editor: PropTypes.object.isRequired,
};
