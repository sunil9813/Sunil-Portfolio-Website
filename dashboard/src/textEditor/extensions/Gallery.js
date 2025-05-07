import { Node } from "@tiptap/core";

export const GalleryLayout = Node.create({
  name: "galleryLayout",
  group: "block",
  content: "galleryBox+", // Requires one or more GalleryBox nodes
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      layout: {
        default: "masonry",
        parseHTML: (element) => element.getAttribute("data-layout") || "masonry",
        renderHTML: (attributes) => ({
          "data-layout": attributes.layout,
        }),
      },
      columns: {
        default: 4,
        parseHTML: (element) => parseInt(element.getAttribute("data-columns") || "4"),
        renderHTML: (attributes) => ({
          "data-columns": attributes.columns,
        }),
      },
      spacing: {
        default: "8px",
        parseHTML: (element) => element.getAttribute("data-spacing") || "8px",
        renderHTML: (attributes) => ({
          "data-spacing": attributes.spacing,
        }),
      },
      radius: {
        default: "4px",
        parseHTML: (element) => element.getAttribute("data-radius") || "4px",
        renderHTML: (attributes) => ({
          "data-radius": attributes.radius,
        }),
      },
      height: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("data-height") || "auto",
        renderHTML: (attributes) => ({
          "data-height": attributes.height,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='galleryLayout']",
        getAttrs: (element) => {
          const layout = element.getAttribute("data-layout") || "masonry";
          const columns = parseInt(element.getAttribute("data-columns") || "4");
          const spacing = element.getAttribute("data-spacing") || "8px";
          const radius = element.getAttribute("data-radius") || "4px";
          const height = element.getAttribute("data-height") || "auto";
          return { layout, columns, spacing, radius, height };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "div",
      {
        "data-type": "galleryLayout",
        class: `gallery-layout gallery-layout-${node.attrs.layout} w-full my-4`,
        "data-layout": node.attrs.layout,
        "data-columns": node.attrs.columns,
        "data-spacing": node.attrs.spacing,
        "data-radius": node.attrs.radius,
        "data-height": node.attrs.height,
      },
      0, // Content placeholder for child nodes
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("div");
      dom.setAttribute("data-type", "galleryLayout");
      dom.className = `gallery-layout gallery-layout-${node.attrs.layout} w-full my-4`;
      dom.style.boxSizing = "border-box";

      const spacingPx = parseInt(node.attrs.spacing) || 8;
      const columns = node.attrs.columns || 4;
      let layoutClasses = `grid grid-cols-${columns} gap-${spacingPx / 4} w-full`;

      if (node.attrs.layout === "masonry") {
        layoutClasses += " auto-rows-min";
      } else {
        dom.style.gridAutoRows = node.attrs.height === "auto" ? "300px" : node.attrs.height;
        dom.style.minHeight = node.attrs.height === "auto" ? "300px" : node.attrs.height;
      }
      dom.className = layoutClasses;
      dom.style.boxSizing = "border-box";

      console.log("GalleryLayout attributes:", {
        layout: node.attrs.layout,
        columns: node.attrs.columns,
        spacing: node.attrs.spacing,
        radius: node.attrs.radius,
        height: node.attrs.height,
      });

      return {
        dom,
        contentDOM: dom,
        ignoreMutation: () => true,
      };
    };
  },

  addCommands() {
    return {
      setGalleryLayout:
        (attributes) =>
        ({ commands }) => {
          try {
            console.log("Inserting gallery layout with attributes:", attributes);
            return commands.insertContent({
              type: "galleryLayout",
              attrs: {
                layout: attributes.layout || "masonry",
                columns: parseInt(attributes.columns, 10) || 4,
                spacing: attributes.spacing || "8px",
                radius: attributes.radius || "4px",
                height: attributes.height || "auto",
              },
              content: attributes.boxes || [],
            });
          } catch (error) {
            console.error("Error inserting gallery layout:", error);
            return false;
          }
        },
    };
  },
});

export const GalleryBox = Node.create({
  name: "galleryBox",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,

  addOptions() {
    return {
      onOpenGallery: () => {
        console.log("Opening GalleryModel for GalleryBox...");
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-src") || "",
        renderHTML: (attributes) => ({
          "data-src": attributes.src,
        }),
      },
      alt: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-alt") || "",
        renderHTML: (attributes) => ({
          "data-alt": attributes.alt,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='galleryBox']",
        getAttrs: (element) => {
          const src = element.getAttribute("data-src") || "";
          const alt = element.getAttribute("data-alt") || "";
          return { src, alt };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "div",
      {
        "data-type": "galleryBox",
        class: "gallery-box relative cursor-pointer flex flex-col w-full",
        "data-src": node.attrs.src,
        "data-alt": node.attrs.alt,
      },
      0,
    ];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const { onOpenGallery } = this.options;

      const dom = document.createElement("div");
      dom.setAttribute("data-type", "galleryBox");
      dom.className = `gallery-box relative cursor-pointer flex flex-col w-full`;
      dom.style.boxSizing = "border-box";

      // Get parent GalleryLayout attributes from storage
      const layoutAttrs = editor.storage.galleryLayout || {};
      const height = layoutAttrs.height === "auto" ? "300px" : layoutAttrs.height || "300px";
      const radiusPx = parseInt(layoutAttrs.radius) || 4;
      const layoutType = layoutAttrs.layout || "masonry";

      dom.style.height = layoutType === "masonry" && node.attrs.src ? "auto" : height;
      dom.style.minHeight = height;
      dom.style.overflow = "hidden";

      let radiusClass;
      switch (radiusPx) {
        case 0:
          radiusClass = "rounded-none";
          break;
        case 4:
          radiusClass = "rounded-sm";
          break;
        case 8:
          radiusClass = "rounded-md";
          break;
        case 16:
          radiusClass = "rounded-lg";
          break;
        default:
          radiusClass = "rounded-sm";
      }

      if (node.attrs.src) {
        const imgElement = document.createElement("img");
        imgElement.src = node.attrs.src;
        imgElement.alt = node.attrs.alt || "Gallery box image";
        imgElement.className = `w-full h-full ${radiusClass} object-cover`;
        imgElement.style.height = layoutType === "masonry" ? "auto" : "100%";
        imgElement.style.minHeight = "100%";
        imgElement.style.borderRadius = `${radiusPx}px`;
        imgElement.style.boxSizing = "border-box";
        dom.appendChild(imgElement);
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = `bg-gray-900/30 border border-gray-800 ${radiusClass} flex items-center justify-center text-gray-500 w-full h-full`;
        placeholder.textContent = "Click to upload";
        placeholder.style.height = "100%";
        placeholder.style.minHeight = "100%";
        placeholder.style.borderRadius = `${radiusPx}px`;
        placeholder.style.boxSizing = "border-box";

        placeholder.addEventListener("click", () => {
          onOpenGallery(getPos(), (imageData) => {
            if (imageData && imageData.src) {
              editor
                .chain()
                .focus()
                .command(({ tr }) => {
                  tr.setNodeMarkup(getPos(), undefined, {
                    src: imageData.src,
                    alt: imageData.alt || "",
                  });
                  return true;
                })
                .run();
            }
          });
        });

        dom.appendChild(placeholder);
      }

      console.log("GalleryBox attributes:", {
        src: node.attrs.src,
        alt: node.attrs.alt,
        height,
        radiusPx,
        layoutType,
      });

      return {
        dom,
        ignoreMutation: () => true,
      };
    };
  },

  addStorage() {
    return {
      galleryLayout: {}, // Store parent GalleryLayout attributes
    };
  },

  addCommands() {
    return {
      setGalleryBox:
        (attributes) =>
        ({ commands }) => {
          try {
            return commands.insertContent({
              type: "galleryBox",
              attrs: {
                src: attributes.src || "",
                alt: attributes.alt || "",
              },
            });
          } catch (error) {
            console.error("Error inserting gallery box:", error);
            return false;
          }
        },
    };
  },
});
