// extensions/GridBox.js
import { Node } from "@tiptap/core";

export const GridBox = Node.create({
  name: "gridBox",

  group: "block",
  content: "gridCell+",
  isolating: true,

  addAttributes() {
    return {
      columnCount: { default: 2 },
      spacing: { default: "16px" },
      width: { default: "100%" },
      height: { default: "200px" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='grid-box']",
        getAttrs: (element) => ({
          columnCount: parseInt(element.getAttribute("data-column-count")) || 2,
          spacing: element.style.gap || "16px",
          width: element.style.width || "100%",
          height: element.style.height || "200px",
        }),
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "div",
      {
        "data-type": "grid-box",
        class: "grid-box",
        "data-column-count": node.attrs.columnCount,
        style: `
          display: grid;
          grid-template-columns: repeat(${node.attrs.columnCount}, 1fr);
          gap: ${node.attrs.spacing};
          width: ${node.attrs.width};
          height: ${node.attrs.height};
          box-sizing: border-box;
          overflow: hidden;
        `,
      },
      0,
    ];
  },

  addCommands() {
    return {
      insertGridBox:
        (options) =>
        ({ commands }) => {
          const cells = Array.from({ length: options.columnCount }, () => ({
            type: "gridCell",
            attrs: {
              borderWidth: options.borderWidth || "1px",
              borderStyle: options.borderStyle || "solid",
              borderColor: options.borderColor || "#e0e0e0",
              borderRadius: options.borderRadius || "4px",
            },
            content: [{ type: "paragraph", content: [{ type: "text", text: "Click to add image" }] }],
          }));
          return commands.insertContent({
            type: "gridBox",
            attrs: {
              columnCount: options.columnCount,
              spacing: options.spacing,
              width: options.width,
              height: options.height,
            },
            content: cells,
          });
        },
    };
  },
});

export const GridCell = Node.create({
  name: "gridCell",

  group: "block",
  content: "block+",
  defining: true,

  addOptions() {
    return {
      onOpenGallery: () => {},
    };
  },

  addAttributes() {
    return {
      hasImage: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-has-image") === "true",
        renderHTML: (attributes) => ({ "data-has-image": attributes.hasImage }),
      },
      borderWidth: {
        default: "1px",
        parseHTML: (element) => element.style.borderWidth || "1px",
        renderHTML: (attributes) => ({ "data-border-width": attributes.borderWidth }),
      },
      borderStyle: {
        default: "solid",
        parseHTML: (element) => element.style.borderStyle || "solid",
        renderHTML: (attributes) => ({ "data-border-style": attributes.borderStyle }),
      },
      borderColor: {
        default: "#e0e0e0",
        parseHTML: (element) => element.style.borderColor || "#e0e0e0",
        renderHTML: (attributes) => ({ "data-border-color": attributes.borderColor }),
      },
      borderRadius: {
        default: "4px",
        parseHTML: (element) => element.style.borderRadius || "4px",
        renderHTML: (attributes) => ({ "data-border-radius": attributes.borderRadius }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='grid-cell']" }];
  },

  renderHTML({ node }) {
    return [
      "div",
      {
        "data-type": "grid-cell",
        class: "grid-cell",
        "data-has-image": node.attrs.hasImage,
        "data-border-width": node.attrs.borderWidth,
        "data-border-style": node.attrs.borderStyle,
        "data-border-color": node.attrs.borderColor,
        "data-border-radius": node.attrs.borderRadius,
        style: `
          height: 100%;
          width: 100%;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${node.attrs.hasImage ? "transparent" : "#f5f5f5"};
          border: ${node.attrs.borderWidth} ${node.attrs.borderStyle} ${node.attrs.borderColor};
          border-radius: ${node.attrs.borderRadius};
        `,
      },
      0,
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const { onOpenGallery } = this.options;

      const dom = document.createElement("div");
      dom.setAttribute("data-type", "grid-cell");
      dom.className = "grid-cell";
      dom.setAttribute("data-has-image", node.attrs.hasImage);
      dom.setAttribute("data-border-width", node.attrs.borderWidth);
      dom.setAttribute("data-border-style", node.attrs.borderStyle);
      dom.setAttribute("data-border-color", node.attrs.borderColor);
      dom.setAttribute("data-border-radius", node.attrs.borderRadius);
      dom.style.height = "100%";
      dom.style.width = "100%";
      dom.style.overflow = "hidden";
      dom.style.cursor = "pointer";
      dom.style.display = "flex";
      dom.style.alignItems = "center";
      dom.style.justifyContent = "center";
      dom.style.background = node.attrs.hasImage ? "transparent" : "#f5f5f5";
      dom.style.border = `${node.attrs.borderWidth} ${node.attrs.borderStyle} ${node.attrs.borderColor}`;
      dom.style.borderRadius = node.attrs.borderRadius;

      const handleClick = () => {
        if (!node.attrs.hasImage) {
          onOpenGallery(getPos());
        }
      };

      dom.addEventListener("click", handleClick);

      const updateImages = () => {
        const images = dom.getElementsByTagName("img");
        for (let img of images) {
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "cover";
          img.style.display = "block";
          img.style.border = `${node.attrs.borderWidth} ${node.attrs.borderStyle} ${node.attrs.borderColor}`;
          img.style.borderRadius = node.attrs.borderRadius;
          dom.style.background = "transparent";
        }
        node.attrs.hasImage = images.length > 0;
        dom.setAttribute("data-has-image", node.attrs.hasImage);
      };

      const observer = new MutationObserver(updateImages);
      observer.observe(dom, { childList: true, subtree: true });

      updateImages();

      return {
        dom,
        contentDOM: dom,
        destroy: () => {
          dom.removeEventListener("click", handleClick);
          observer.disconnect();
        },
      };
    };
  },
});
