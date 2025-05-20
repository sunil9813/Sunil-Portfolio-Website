// extensions/Emoji/Emoji.js
import { Node } from "@tiptap/core";

export const Emoji = Node.create({
  name: "emoji",

  group: "inline",
  inline: true,
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      emoji: {
        default: "😊",
        parseHTML: (element) => element.getAttribute("data-emoji") || "😊",
        renderHTML: (attributes) => ({
          "data-emoji": attributes.emoji,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-type='emoji']",
        getAttrs: (element) => {
          const emoji = element.getAttribute("data-emoji") || "😊";
          return { emoji };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { emoji } = node.attrs;
    return [
      "span",
      {
        "data-type": "emoji",
        "data-emoji": emoji,
        class: "emoji",
      },
      // No content; rendering handled by addNodeView
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("span");
      dom.setAttribute("data-type", "emoji");
      dom.className = "emoji";
      dom.innerHTML = node.attrs.emoji; // Render the emoji directly
      dom.contentEditable = "false";

      return {
        dom,
        ignoreMutation: () => true, // Prevent Tiptap from modifying the DOM
      };
    };
  },

  addCommands() {
    return {
      setEmoji:
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
