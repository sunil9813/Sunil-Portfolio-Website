import { BsTypeBold, BsTypeItalic, BsTypeStrikethrough, BsTypeUnderline } from "react-icons/bs";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { FaHighlighter } from "react-icons/fa";
import Highlight from "@tiptap/extension-highlight";
import { MdFormatAlignCenter, MdFormatAlignJustify, MdFormatAlignLeft, MdFormatAlignRight } from "react-icons/md";
import TextAlign from "@tiptap/extension-text-align";
import PropTypes from "prop-types";
import { Wrapper } from "../customeUI/Wrapper";
import { Button } from "@material-tailwind/react";
import { getFocusedEditor } from "@/textEditor/utils/EditorUtils";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { CiBoxList } from "react-icons/ci";

const CustomListEnter = Extension.create({
  name: "customListEnter",
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        console.log("Enter pressed, node:", $from.parent.type.name); // Debug

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

export const CommentEditor = ({ value, onChange, type, className }) => {
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
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      BulletList.configure({
        itemTypeName: "listItem",
        HTMLAttributes: {
          class: "list-disc pl-5",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "my-0",
        },
      }),
      Placeholder.configure({ placeholder: "Type something here..." }),
      CustomListEnter,
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none max-w-full mx-auto textSizeSm h-full textColor [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_p]:my-0 [&_li]:my-0",
      },
    },
  });

  return (
    <div className="relative editor-default">
      {type === "default" ? (
        <div className={`${className} bg-gray-900/10 dark:bg-gray-50/10 rounded-md`}>
          <MenuBar editor={editor} type={type} />
          <EditorContent editor={editor} className="min-h-[150px] pt-10 px-2" />
        </div>
      ) : (
        <>
          <Wrapper>
            <EditorContent editor={editor} className="min-h-[150px] rounded-lg p-3" />
          </Wrapper>
          <MenuBar editor={editor} type={type} />
        </>
      )}
    </div>
  );
};

CommentEditor.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const MenuBar = ({ editor, type }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      {type === "default" ? (
        <div className={`${type ? "absolute top-2 left-2 w-full flex items-center justify-between z-20" : "absolute bottom-2 left-2 w-full flex items-center justify-between"}`}>
          <div className="flex items-center gap-1">
            <button
              className={
                editor.isActive("bold") ? "is-active bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC bg-gray-800/10 dark:bg-gray-50/10 rounded-md  text-gray-700 dark:text-white"
              }
              onClick={() => getFocusedEditor(editor).toggleBold().run()}
            >
              <BsTypeBold />
            </button>
            <button
              className={
                editor.isActive("italic") ? "is-active bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC bg-gray-800/10 dark:bg-gray-50/10 rounded-md  text-gray-700 dark:text-white"
              }
              onClick={() => getFocusedEditor(editor).toggleItalic().run()}
            >
              <BsTypeItalic />
            </button>
            <button
              className={
                editor.isActive("underline") ? "is-active bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC bg-gray-800/10 dark:bg-gray-50/10 rounded-md  text-gray-700 dark:text-white"
              }
              onClick={() => getFocusedEditor(editor).toggleUnderline().run()}
            >
              <BsTypeUnderline />
            </button>
            <button
              className={
                editor.isActive("strike") ? "is-active bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC bg-gray-800/10 dark:bg-gray-50/10 rounded-md  text-gray-700 dark:text-white"
              }
              onClick={() => getFocusedEditor(editor).toggleStrike().run()}
            >
              <BsTypeStrikethrough />
            </button>
            <button
              onClick={() => getFocusedEditor(editor).toggleBulletList().run()}
              className={
                editor.isActive("bulletList") ? "is-active bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC bg-gray-800/10 dark:bg-gray-50/10 rounded-md  text-gray-700 dark:text-white"
              }
            >
              <CiBoxList />
            </button>
          </div>
        </div>
      ) : (
        <div className={`${type ? "absolute top-2 left-2 w-full flex items-center justify-between z-20" : "absolute bottom-2 left-2 w-full flex items-center justify-between"}`}>
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
                className={editor.isActive("highlight") ? "is-active bg-teal-400 text-white size-7 flexC  rounded-md" : "size-7 flexC"}
                onClick={() => getFocusedEditor(editor).toggleHighlight().run()}
              >
                <FaHighlighter size={18} />
              </button>
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
          <Button type="submit" color="teal" className="mr-4">
            Submit
          </Button>
        </div>
      )}
    </>
  );
};

MenuBar.propTypes = {
  type: PropTypes.string,
  editor: PropTypes.object.isRequired,
};
