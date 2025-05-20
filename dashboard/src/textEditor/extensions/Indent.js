import { Extension } from "@tiptap/core";

export const Indent = Extension.create({
  name: "indent",

  addOptions() {
    return {
      types: ["paragraph", "heading", "listItem"],
      min: 0,
      max: 20,
      step: 1,
      unit: "em",
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            renderHTML: (attributes) => {
              if (attributes.indent && attributes.indent > 0) {
                return {
                  style: `margin-left: ${attributes.indent}${this.options.unit}`,
                };
              }
              return {};
            },
            parseHTML: (element) => {
              const marginLeft = element.style.marginLeft;
              if (!marginLeft) return 0;
              const value = parseFloat(marginLeft);
              return isNaN(value) ? 0 : value;
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          let changed = false;

          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent = node.attrs.indent || 0;
              const newIndent = currentIndent + this.options.step;

              if (newIndent <= this.options.max) {
                if (dispatch) {
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    indent: newIndent,
                  });
                }
                changed = true;
              }
            }
          });

          if (changed && dispatch) {
            dispatch(tr);
          }
          return changed;
        },

      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          let changed = false;

          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent = node.attrs.indent || 0;
              const newIndent = Math.max(currentIndent - this.options.step, this.options.min);

              if (newIndent !== currentIndent) {
                if (dispatch) {
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    indent: newIndent,
                  });
                }
                changed = true;
              }
            }
          });

          if (changed && dispatch) {
            dispatch(tr);
          }
          return changed;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      "Shift-Tab": () => this.editor.commands.outdent(),
    };
  },
});
