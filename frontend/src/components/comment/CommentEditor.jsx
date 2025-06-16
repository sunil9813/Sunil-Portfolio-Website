import { BsTypeBold, BsTypeItalic, BsTypeStrikethrough, BsTypeUnderline } from "react-icons/bs";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { MdFormatAlignCenter, MdFormatAlignJustify, MdFormatAlignLeft, MdFormatAlignRight } from "react-icons/md";
import TextAlign from "@tiptap/extension-text-align";
import PropTypes from "prop-types";
import { ActionButton, Button, TertiaryButton } from "../customeUI/Button";
import { getFocusedEditor } from "./utils/util";

const CustomListEnter = Extension.create({
  name: "customListEnter",
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name === "listItem") {
          console.log("Splitting list item"); // Debug
          return editor.chain().focus().splitListItem("listItem").run();
        }

        if ($from.parent.type.name === "paragraph" && $from.parent.textContent.length === 0) {
          console.log("Empty paragraph, preventing split"); // Debug
          return true; // Prevent extra paragraph
        }

        return editor.chain().focus().splitBlock().run();
      },
      // Optional: Exit list with Ctrl+Enter
      "Ctrl-Enter": ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name === "listItem") {
          return editor.chain().focus().liftListItem("listItem").run();
        }

        return false;
      },
    };
  },
});

export const CommentEditor = ({ value, onChange, type }) => {
  const editor = useEditor({
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    extensions: [
      StarterKit.configure({
        // Disable the default paragraph behavior
        paragraph: {
          HTMLAttributes: {
            class: "my-0 leading-snug", // Remove margin and set tight line height
          },
        },
      }),
      Underline,
      TextStyle,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({ placeholder: "Type something here..." }),
      CustomListEnter,
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none max-w-full mx-auto textSizeSm h-full textColor",
      },
    },
  });

  return (
    <div className="relative editor-default bg-dark-highlight/30 rounded-2xl my-3">
      <EditorContent editor={editor} className="min-h-[150px] rounded-lg p-5" />
      <MenuBar editor={editor} type={type} />
    </div>
  );
};

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="absolute bottom-2 left-2 w-full flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button className={editor.isActive("bold") ? "is-active bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC"} onClick={() => getFocusedEditor(editor).toggleBold().run()}>
            <BsTypeBold />
          </button>
          <button className={editor.isActive("italic") ? "is-active bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC"} onClick={() => getFocusedEditor(editor).toggleItalic().run()}>
            <BsTypeItalic />
          </button>
          <button
            className={editor.isActive("underline") ? "is-active bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC"}
            onClick={() => getFocusedEditor(editor).toggleUnderline().run()}
          >
            <BsTypeUnderline />
          </button>
          <button className={editor.isActive("strike") ? "is-active bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC"} onClick={() => getFocusedEditor(editor).toggleStrike().run()}>
            <BsTypeStrikethrough />
          </button>

          <div className="h-4 w-[1px] bg-white/20  mx-4" />
          <div className="flex items-center space-x-1">
            <button
              onClick={() => getFocusedEditor(editor).setTextAlign("left").run()}
              className={editor.isActive({ textAlign: "left" }) ? "bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC"}
            >
              <MdFormatAlignLeft />
            </button>
            <button
              onClick={() => getFocusedEditor(editor).setTextAlign("center").run()}
              className={editor.isActive({ textAlign: "center" }) ? "bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC"}
            >
              <MdFormatAlignCenter />
            </button>
            <button
              onClick={() => getFocusedEditor(editor).setTextAlign("right").run()}
              className={editor.isActive({ textAlign: "right" }) ? "bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC"}
            >
              <MdFormatAlignRight />
            </button>
            <button
              onClick={() => getFocusedEditor(editor).setTextAlign("justify").run()}
              className={editor.isActive({ textAlign: "justify" }) ? "bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC"}
            >
              <MdFormatAlignJustify />
            </button>
          </div>
        </div>
        <div className="flex justify-end mx-5">
          <TertiaryButton>Submit</TertiaryButton>
        </div>
      </div>
    </>
  );
};

CommentEditor.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

MenuBar.propTypes = {
  type: PropTypes.string,
  editor: PropTypes.object.isRequired,
};
