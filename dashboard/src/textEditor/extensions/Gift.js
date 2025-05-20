// extensions/Gif/Gif.js
import { Node } from "@tiptap/core";

export const Gif = Node.create({
  name: "gif",

  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element) => element.getAttribute("src") || "",
        renderHTML: (attributes) => ({
          src: attributes.src,
        }),
      },
      alt: {
        default: "GIF",
        parseHTML: (element) => element.getAttribute("alt") || "GIF",
        renderHTML: (attributes) => ({
          alt: attributes.alt,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[data-type='gif']",
        getAttrs: (element) => ({
          src: element.getAttribute("src"),
          alt: element.getAttribute("alt") || "GIF",
        }),
      },
    ];
  },

  renderHTML({ node }) {
    const { src, alt } = node.attrs;
    return [
      "img",
      {
        "data-type": "gif",
        src,
        alt,
        class: "editor-gif",
      },
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("img");
      dom.setAttribute("data-type", "gif");
      dom.src = node.attrs.src;
      dom.alt = node.attrs.alt;
      dom.className = "editor-gif";
      dom.contentEditable = "false";

      return {
        dom,
        ignoreMutation: () => true,
      };
    };
  },

  addCommands() {
    return {
      setGif:
        (attributes) =>
        ({ chain }) => {
          return chain()
            .focus()
            .deleteSelection()
            .insertContent({
              type: this.name,
              attrs: attributes,
            })
            .run();
        },
    };
  },
});
