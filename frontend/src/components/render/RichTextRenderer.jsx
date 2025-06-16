import React, { useRef, useEffect } from "react";
import parse, { domToReact } from "html-react-parser";
import hljs from "highlight.js";
import PropTypes from "prop-types";
import MathFormulaParser from "../comment/utils/MathFormulaParser";

export const RichTextRenderer = React.memo(({ content }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [content]);

  const parsedContent = parse(content, {
    replace: (domNode) => {
      // Handle Math Formula
      if (domNode.attribs && domNode.attribs["data-type"] === "math-formula") {
        return <MathFormulaParser formula={domNode.attribs["data-formula"]} display={domNode.attribs["data-display"] === "true"} />;
      }
      // Handle Emoji
      if (domNode.attribs && domNode.attribs["data-type"] === "emoji") {
        const emoji = domNode.attribs["data-emoji"] || domNode.children[0]?.data || "😊";
        return <span className="emoji">{emoji}</span>;
      }
      // Handle Custom Image
      if (domNode.name === "img" && domNode.attribs["data-custom-image"] !== undefined) {
        const {
          src,
          alt,
          "data-size": size = "medium",
          "data-align": align = "center",
          "data-flip-x": flipX = "false",
          "data-flip-y": flipY = "false",
          width,
          height,
          "data-object-fit": objectFit = "cover",
          "data-display": display = "inline",
          "data-border-radius": borderRadius = "0",
        } = domNode.attribs;

        const getSizeStyles = () => {
          if (width && height) {
            return { width: parseInt(width, 10), height: parseInt(height, 10), maxWidth: "100%" };
          }
          if (width) {
            return { width: parseInt(width, 10), height: "auto", maxWidth: "100%" };
          }
          if (height) {
            return { height: parseInt(height, 10), width: "auto", maxWidth: "100%" };
          }

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
          transform: `${flipX === "true" ? "scaleX(-1)" : ""} ${flipY === "true" ? "scaleY(-1)" : ""}`,
        });

        const styles = {
          ...getSizeStyles(),
          ...getAlignmentStyles(),
          ...getTransformStyles(),
          objectFit,
          borderRadius: `${parseInt(borderRadius, 10)}px`,
          cursor: "default",
        };

        return (
          <span style={{ display: display === "inline" ? "inline-block" : "block" }}>
            <img src={src} alt={alt} style={styles} className="custom-image" />
          </span>
        );
      }
      // Handle Column Container
      if (domNode.attribs && domNode.attribs["data-type"] === "column-container") {
        return <div className="column-container">{domToReact(domNode.children)}</div>;
      }
      // Handle Column
      if (domNode.attribs && domNode.attribs["data-type"] === "column") {
        return <div className="column">{domToReact(domNode.children)}</div>;
      }
      // Handle Grid Box
      if (domNode.attribs && domNode.attribs["data-type"] === "grid-box") {
        return (
          <div className="grid-box" data-column-count={domNode.attribs["data-column-count"]}>
            {domToReact(domNode.children)}
          </div>
        );
      }
      // Handle Grid Cell
      if (domNode.attribs && domNode.attribs["data-type"] === "grid-cell") {
        return <div className="grid-cell">{domToReact(domNode.children)}</div>;
      }
    },
  });

  return (
    <div className="tiptap" ref={contentRef}>
      <div className="prose !prose-lg focus:outline-none prose-invert max-w-full mx-auto h-full">{parsedContent}</div>
    </div>
  );
});

RichTextRenderer.propTypes = {
  content: PropTypes.string,
};

RichTextRenderer.defaultProps = {
  content: "",
};

RichTextRenderer.displayName = "RichTextRenderer";
