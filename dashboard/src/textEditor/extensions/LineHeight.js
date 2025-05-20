// extensions/LineHeight.js
import { Extension } from "@tiptap/core";

export const LineHeight = Extension.create({
  name: "lineHeight",

  addOptions() {
    return {
      types: ["paragraph", "heading", "listItem"],
      heights: ["auto", "1", "1.15", "1.3", "1.5", "2", "2.5", "3"],
      defaultHeight: "auto",
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultHeight,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight || attributes.lineHeight === "auto") {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
            parseHTML: (element) => {
              const lineHeight = element.style.lineHeight;
              // Return "auto" if no line-height is specified or if it's invalid
              return lineHeight && lineHeight !== "" ? lineHeight : "auto";
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (height) =>
        ({ commands }) => {
          if (!this.options.heights.includes(height)) return false;
          return this.options.types.every((type) => commands.updateAttributes(type, { lineHeight: height }));
        },
      unsetLineHeight:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) => commands.resetAttributes(type, "lineHeight"));
        },
    };
  },
});
