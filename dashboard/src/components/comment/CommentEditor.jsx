import { BsTypeBold, BsTypeItalic, BsTypeStrikethrough, BsTypeUnderline } from "react-icons/bs";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { FaHighlighter } from "react-icons/fa";
import Highlight from "@tiptap/extension-highlight";
import { MdFormatAlignCenter, MdFormatAlignJustify, MdFormatAlignLeft, MdFormatAlignRight } from "react-icons/md";
import TextAlign from "@tiptap/extension-text-align";
import HardBreak from "@tiptap/extension-hard-break"; // Import HardBreak extension
import PropTypes from "prop-types";
import { Wrapper } from "../customeUI/Wrapper";
import { Button } from "@material-tailwind/react";
import { getFocusedEditor } from "@/textEditor/utils/EditorUtils";

export const CommentEditor = ({ value, onChange }) => {
  const editor = useEditor({
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    extensions: [
      StarterKit.configure({
        // Disable the default paragraph behavior
        paragraph: {
          HTMLAttributes: {
            class: "my-0", // Remove margin for <p> tags
          },
        },
      }),
      Underline,
      TextStyle,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({ placeholder: "Type something here..." }),
      HardBreak.extend({
        // Configure HardBreak to replace <p> with <br>
        addKeyboardShortcuts() {
          return {
            Enter: () => this.editor.commands.setHardBreak(),
          };
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose focus:outline-none prose-invert max-w-full mx-auto h-full text-white",
      },
    },
  });

  return (
    <div className="relative">
      <Wrapper>
        <EditorContent editor={editor} className="min-h-[150px] rounded-lg p-3" />
      </Wrapper>
      <MenuBar editor={editor} />
    </div>
  );
};

CommentEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="absolute bottom-2 left-2 w-full flex items-center justify-between">
      <div className="flex items-center gap-1">
        <button className={editor.isActive("bold") ? "is-active bg-teal-400 p-2 px-3 rounded-sm" : "p-2 px-3"} onClick={() => getFocusedEditor(editor).toggleBold().run()}>
          <BsTypeBold size={20} />
        </button>
        <button className={editor.isActive("italic") ? "is-active bg-teal-400 p-2 px-3 rounded-sm" : "p-2 px-3"} onClick={() => getFocusedEditor(editor).toggleItalic().run()}>
          <BsTypeItalic size={20} />
        </button>
        <button className={editor.isActive("underline") ? "is-active bg-teal-400 p-2 px-3 rounded-sm" : "p-2 px-3"} onClick={() => getFocusedEditor(editor).toggleUnderline().run()}>
          <BsTypeUnderline size={20} />
        </button>
        <button className={editor.isActive("strike") ? "is-active bg-teal-400 p-2 px-3 rounded-sm" : "p-2 px-3"} onClick={() => getFocusedEditor(editor).toggleStrike().run()}>
          <BsTypeStrikethrough size={20} />
        </button>

        <div className="h-4 w-[1px] bg-white/20  mx-4" />
        <div className="flex items-center space-x-1">
          <button className={editor.isActive("highlight") ? "is-active bg-teal-400 p-2 px-3 rounded-sm" : "p-2 px-3"} onClick={() => getFocusedEditor(editor).toggleHighlight().run()}>
            <FaHighlighter size={18} />
          </button>
          <button onClick={() => getFocusedEditor(editor).setTextAlign("left").run()} className={editor.isActive({ textAlign: "left" }) ? "bg-teal-400 p-2 px-3 rounded-sm" : "p-2 px-3"}>
            <MdFormatAlignLeft />
          </button>
          <button onClick={() => getFocusedEditor(editor).setTextAlign("center").run()} className={editor.isActive({ textAlign: "center" }) ? "bg-teal-400 p-2 px-3 rounded-sm" : "p-2 px-3"}>
            <MdFormatAlignCenter />
          </button>
          <button onClick={() => getFocusedEditor(editor).setTextAlign("right").run()} className={editor.isActive({ textAlign: "right" }) ? "bg-teal-400 p-2 px-3 rounded-sm" : "p-2 px-3"}>
            <MdFormatAlignRight />
          </button>
          <button onClick={() => getFocusedEditor(editor).setTextAlign("justify").run()} className={editor.isActive({ textAlign: "justify" }) ? "bg-teal-400 p-2 px-3 rounded-sm" : "p-2 px-3"}>
            <MdFormatAlignJustify />
          </button>
        </div>
      </div>
      <Button type="submit" color="teal" className="mr-4">
        Submit
      </Button>
    </div>
  );
};

MenuBar.propTypes = {
  editor: PropTypes.object.isRequired,
};
