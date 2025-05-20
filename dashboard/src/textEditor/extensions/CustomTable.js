import TiptapTable from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";

// Utility function to determine if a color is light or dark
function isLightColor(color) {
  let r, g, b;
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (color.startsWith("rgb")) {
    [r, g, b] = color.match(/\d+/g).map(Number);
  } else {
    return false; // Unknown format, default to dark
  }
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

export const CustomTable = TiptapTable.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      resizable: true,
      lastColumnResizable: true,
      allowTableNodeSelection: false,
      HTMLAttributes: {
        class: "custom-table",
      },
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      design: {
        default: "default",
        parseHTML: (element) => element.getAttribute("data-design") || "default",
        renderHTML: (attributes) => {
          const classes = `custom-table table-design-${attributes.design}`;
          return {
            "data-design": attributes.design,
            class: classes,
          };
        },
      },
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) return {};
          const isLight = isLightColor(attributes.backgroundColor);
          return {
            style: `background-color: ${attributes.backgroundColor}; color: ${isLight ? "#000" : "#fff"}`,
          };
        },
      },
      borderStyle: {
        default: "solid",
        parseHTML: (element) => element.style.borderStyle || "solid",
        renderHTML: (attributes) => {
          if (attributes.design === "borderless") return {};
          return { style: `border-style: ${attributes.borderStyle}` };
        },
      },
      borderColor: {
        default: "#ccc",
        parseHTML: (element) => element.style.borderColor || "#ccc",
        renderHTML: (attributes) => {
          if (attributes.design === "borderless") return {};
          return { style: `border-color: ${attributes.borderColor}` };
        },
      },
      borderWidth: {
        default: "1px",
        parseHTML: (element) => element.style.borderWidth || "1px",
        renderHTML: (attributes) => {
          if (attributes.design === "borderless") return {};
          return { style: `border-width: ${attributes.borderWidth}` };
        },
      },
      borderRadius: {
        default: "0px",
        parseHTML: (element) => element.style.borderRadius || "0px",
        renderHTML: (attributes) => {
          return { "data-border-radius": attributes.borderRadius };
        },
      },
    };
  },

  addExtensions() {
    const CustomTableCell = TableCell.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          backgroundColor: {
            default: null,
            parseHTML: (element) => element.style.backgroundColor || null,
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) return {};
              const isLight = isLightColor(attributes.backgroundColor);
              return {
                style: `background-color: ${attributes.backgroundColor}; color: ${isLight ? "#000" : "#fff"}`,
              };
            },
          },
          padding: {
            default: "10px",
            parseHTML: (element) => element.style.padding || "10px",
            renderHTML: (attributes) => {
              return { style: `padding: ${attributes.padding}` };
            },
          },
          borderStyle: {
            default: "solid",
            parseHTML: (element) => element.style.borderStyle || "solid",
            renderHTML: (attributes) => {
              if (attributes.design === "borderless") return {};
              return { style: `border-style: ${attributes.borderStyle}` };
            },
          },
          borderColor: {
            default: "#ccc",
            parseHTML: (element) => element.style.borderColor || "#ccc",
            renderHTML: (attributes) => {
              if (attributes.design === "borderless") return {};
              return { style: `border-color: ${attributes.borderColor}` };
            },
          },
          borderWidth: {
            default: "1px",
            parseHTML: (element) => element.style.borderWidth || "1px",
            renderHTML: (attributes) => {
              if (attributes.design === "borderless") return {};
              return { style: `border-width: ${attributes.borderWidth}` };
            },
          },
        };
      },
    });

    const CustomTableHeader = TableHeader.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          backgroundColor: {
            default: null,
            parseHTML: (element) => element.style.backgroundColor || null,
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) return {};
              const isLight = isLightColor(attributes.backgroundColor);
              return {
                style: `background-color: ${attributes.backgroundColor}; color: ${isLight ? "#000" : "#fff"}`,
              };
            },
          },
          padding: {
            default: "10px",
            parseHTML: (element) => element.style.padding || "10px",
            renderHTML: (attributes) => {
              return { style: `padding: ${attributes.padding}` };
            },
          },
          borderStyle: {
            default: "solid",
            parseHTML: (element) => element.style.borderStyle || "solid",
            renderHTML: (attributes) => {
              if (attributes.design === "borderless") return {};
              return { style: `border-style: ${attributes.borderStyle}` };
            },
          },
          borderColor: {
            default: "#ccc",
            parseHTML: (element) => element.style.borderColor || "#ccc",
            renderHTML: (attributes) => {
              if (attributes.design === "borderless") return {};
              return { style: `border-color: ${attributes.borderColor}` };
            },
          },
          borderWidth: {
            default: "1px",
            parseHTML: (element) => element.style.borderWidth || "1px",
            renderHTML: (attributes) => {
              if (attributes.design === "borderless") return {};
              return { style: `border-width: ${attributes.borderWidth}` };
            },
          },
        };
      },
    });

    return [TableRow, CustomTableHeader, CustomTableCell];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setTableDesign:
        (design, borderRadius) =>
        ({ commands }) => {
          const attrs = { design, borderRadius: borderRadius || "0px" };
          if (design === "borderless") {
            attrs.borderStyle = "none";
            attrs.borderWidth = "0px";
            attrs.borderColor = "transparent";
          }
          return commands.updateAttributes("table", attrs);
        },
    };
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("div");
      dom.className = "custom-table-wrapper";
      dom.style.overflow = "hidden"; // Clip table to rounded corners
      if (node.attrs.borderRadius) {
        dom.style.borderRadius = node.attrs.borderRadius; // Apply borderRadius to wrapper
      }

      const table = document.createElement("table");
      table.className = `custom-table table-design-${node.attrs.design}`;
      table.style.borderCollapse = "collapse";
      table.style.width = "100%";
      table.style.margin = "0 auto";
      table.style.tableLayout = "fixed";

      if (node.attrs.design === "rounded-cells") {
        table.style.borderCollapse = "separate";
        table.style.borderSpacing = "2px";
      }

      if (node.attrs.backgroundColor) {
        table.style.backgroundColor = node.attrs.backgroundColor;
        const isLight = isLightColor(node.attrs.backgroundColor);
        table.style.color = isLight ? "#000" : "#fff";
      }

      if (node.attrs.design !== "borderless") {
        if (node.attrs.borderStyle) {
          table.style.borderStyle = node.attrs.borderStyle;
        }
        if (node.attrs.borderColor) {
          table.style.borderColor = node.attrs.borderColor;
        }
        if (node.attrs.borderWidth) {
          table.style.borderWidth = node.attrs.borderWidth;
        }
      } else {
        table.style.border = "none";
      }

      dom.appendChild(table);

      return {
        dom,
        contentDOM: table,
      };
    };
  },
});
