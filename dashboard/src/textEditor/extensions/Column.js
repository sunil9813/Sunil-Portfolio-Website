// extensions/Column/Column.js
import { Node } from "@tiptap/core";

// Column Container (wrapper for columns)
export const ColumnContainer = Node.create({
  name: "columnContainer",

  group: "block",
  content: "column+", // One or more columns
  isolating: true, // Prevents content from breaking out

  parseHTML() {
    return [
      {
        tag: "div[data-type='column-container']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "column-container", class: "column-container" }, 0];
  },

  addCommands() {
    return {
      insertColumnContainer:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: "columnContainer",
            content: [
              { type: "column", content: [{ type: "paragraph", content: [] }] },
              { type: "column", content: [{ type: "paragraph", content: [] }] },
            ],
          });
        },
    };
  },
});

// Individual Column
export const Column = Node.create({
  name: "column",

  group: "block",
  content: "block+", // Accepts block content (paragraphs, task lists, etc.)
  defining: true,

  parseHTML() {
    return [
      {
        tag: "div[data-type='column']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "column", class: "column" }, 0];
  },
});
