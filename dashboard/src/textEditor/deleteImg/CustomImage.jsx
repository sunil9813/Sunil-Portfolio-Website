import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableImageComponent from "./ImageComponent";

const ResizableImage = Node.create({
  name: "resizableImage",
  group: "block",
  content: "",
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: "100%" },
      height: { default: "auto" },
      imageId: { default: null },
      align: {
        default: "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
          class: `image-align-${attributes.align}`,
        }),
        parseHTML: (element) => ({
          align: element.getAttribute("data-align") || "center",
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (dom) => ({
          src: dom.getAttribute("src"),
          alt: dom.getAttribute("alt"),
          title: dom.getAttribute("title"),
          width: dom.getAttribute("width"),
          height: dom.getAttribute("height"),
          align: dom.getAttribute("data-align") || "center",
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", HTMLAttributes];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },

  addCommands() {
    return {
      setResizableImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              ...options,
              align: options.align || "center",
            },
          });
        },
      setImageAlign:
        (align) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { align });
        },
    };
  },
});

export default ResizableImage;
