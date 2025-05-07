import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { ImageView } from "../components/imgView/ImageView";

const CustomImage = Node.create({
  name: "customImage",
  group: "inline",
  inline: true, // Explicitly mark as inline
  atom: true, // Mark as a leaf node (no content)
  selectable: true,
  draggable: true,
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      size: {
        default: "medium",
        parseHTML: (element) => element.getAttribute("data-size") || "medium",
        renderHTML: (attributes) => ({
          "data-size": attributes.size,
        }),
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
      },
      flipX: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-flip-x") === "true",
        renderHTML: (attributes) => ({
          "data-flip-x": attributes.flipX,
        }),
      },
      flipY: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-flip-y") === "true",
        renderHTML: (attributes) => ({
          "data-flip-y": attributes.flipY,
        }),
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.getAttribute("width") || element.style.width || null;
          return width ? parseInt(width, 10) : null;
        },
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.getAttribute("height") || element.style.height || null;
          return height ? parseInt(height, 10) : null;
        },
        renderHTML: (attributes) => ({
          height: attributes.height,
        }),
      },
      objectFit: {
        default: "cover",
        parseHTML: (element) => element.getAttribute("data-object-fit") || "cover",
        renderHTML: (attributes) => ({
          "data-object-fit": attributes.objectFit,
        }),
      },
      display: {
        default: "inline",
        parseHTML: (element) => element.getAttribute("data-display") || "inline",
        renderHTML: (attributes) => ({
          "data-display": attributes.display,
        }),
      },
      borderRadius: {
        default: 0,
        parseHTML: (element) => {
          const radius = element.getAttribute("data-border-radius") || element.style.borderRadius || 0;
          return parseInt(radius, 10);
        },
        renderHTML: (attributes) => ({
          "data-border-radius": attributes.borderRadius,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[data-custom-image]",
        getAttrs: (element) => ({
          src: element.getAttribute("src"),
          alt: element.getAttribute("alt"),
          size: element.getAttribute("data-size") || "medium",
          align: element.getAttribute("data-align") || "center",
          flipX: element.getAttribute("data-flip-x") === "true",
          flipY: element.getAttribute("data-flip-y") === "true",
          width: element.getAttribute("width") ? parseInt(element.getAttribute("width"), 10) : null,
          height: element.getAttribute("height") ? parseInt(element.getAttribute("height"), 10) : null,
          objectFit: element.getAttribute("data-object-fit") || "cover",
          display: element.getAttribute("data-display") || "inline",
          borderRadius: element.getAttribute("data-border-radius") ? parseInt(element.getAttribute("data-border-radius"), 10) : 0,
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(
        {
          "data-custom-image": "",
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      updateImage:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options);
        },
      deleteImage:
        () =>
        ({ commands }) => {
          return commands.deleteNode(this.name);
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("customImageSelection"),
        props: {
          decorations: ({ doc, selection }) => {
            const decorations = [];
            const { from, to } = selection;

            doc.descendants((node, pos) => {
              if (node.type.name === this.name) {
                const isSelected = from <= pos + 1 && to >= pos + 1;
                if (isSelected) {
                  decorations.push(
                    Decoration.node(pos, pos + node.nodeSize, {
                      class: "custom-image-selected",
                      "data-selected": "true",
                    })
                  );
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export default CustomImage;
