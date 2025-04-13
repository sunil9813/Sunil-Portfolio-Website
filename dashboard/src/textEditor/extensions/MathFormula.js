import { Node } from "@tiptap/core";
import katex from "katex";
import "katex/dist/katex.min.css";

export const MathFormula = Node.create({
  name: "mathFormula",
  group: "inline",
  inline: true,
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      formula: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-formula") || "",
        renderHTML: (attributes) => ({
          "data-formula": attributes.formula,
        }),
      },
      display: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-display") === "true",
        renderHTML: (attributes) => ({
          "data-display": attributes.display,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-type='math-formula']",
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "span",
      {
        "data-type": "math-formula",
        "data-formula": node.attrs.formula,
        "data-display": node.attrs.display,
        class: `math-node ${node.attrs.display ? "is-display" : "is-inline"}`,
      },
    ];
  },

  addNodeView() {
    return ({ node, editor }) => {
      const container = document.createElement("span");
      container.className = `math-node ${node.attrs.display ? "is-display" : "is-inline"}`;
      container.dataset.type = "math-formula";
      container.dataset.formula = node.attrs.formula;
      container.dataset.display = node.attrs.display;

      const renderFormula = () => {
        container.innerHTML = ""; // Clear previous content

        try {
          katex.render(node.attrs.formula, container, {
            displayMode: node.attrs.display,
            throwOnError: false,
            output: "htmlAndMathml",
          });
          container.classList.remove("has-error");
        } catch (error) {
          const errorSpan = document.createElement("span");
          errorSpan.className = "math-error";
          errorSpan.textContent = node.attrs.formula;
          container.appendChild(errorSpan);
          container.classList.add("has-error");
        }
      };

      renderFormula();

      // Handle click to select
      container.addEventListener("click", (e) => {
        e.preventDefault();
        editor.commands.focus();
        const pos = editor.state.selection.from;
        editor.commands.setNodeSelection(pos);
      });

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== "mathFormula") return false;
          renderFormula();
          return true;
        },
        ignoreMutation: () => true,
      };
    };
  },

  addCommands() {
    return {
      setMathFormula:
        (attrs) =>
        ({ chain }) => {
          return chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs,
            })
            .run();
        },
      toggleMathDisplay:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph");
        },
    };
  },

  addInputRules() {
    return [
      {
        find: /\$([^$]+)\$/,
        handler: ({ state, range, match }) => {
          const formula = match[1].trim();
          if (!formula) return null;

          // Check if we're already inside a math formula
          const $from = state.doc.resolve(range.from);
          if ($from.parent.type.spec.group?.includes("math")) {
            return null;
          }

          return state.tr.replaceWith(range.from, range.to, this.type.create({ formula, display: false }));
        },
      },
      {
        find: /\$\$([^$]+)\$\$/,
        handler: ({ state, range, match }) => {
          const formula = match[1].trim();
          if (!formula) return null;

          return state.tr.replaceWith(range.from, range.to, this.type.create({ formula, display: true }));
        },
      },
    ];
  },
});
