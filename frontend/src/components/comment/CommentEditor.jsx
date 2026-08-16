import PropTypes from "prop-types";
import { useEffect } from "react";
import { BsTypeBold, BsTypeItalic, BsTypeStrikethrough, BsTypeUnderline } from "react-icons/bs";
import { CiBoxList } from "react-icons/ci";
import { FaHighlighter } from "react-icons/fa";
import { MdFormatAlignCenter, MdFormatAlignJustify, MdFormatAlignLeft, MdFormatAlignRight } from "react-icons/md";

import { EditorContent, Extension, useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

import { Wrapper } from "../customeUI/Wrapper";
import { getFocusedEditor } from "./utils/util";

const CustomListEnter = Extension.create({
  name: "customListEnter",

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;

        if (editor.isActive("listItem")) {
          return editor.chain().focus().splitListItem("listItem").run();
        }

        if ($from.parent.type.name === "paragraph" && $from.parent.textContent.length === 0) {
          return editor.chain().focus().splitBlock().run();
        }

        return editor.chain().focus().splitBlock().run();
      },

      "Ctrl-Enter": ({ editor }) => {
        if (editor.isActive("listItem")) {
          return editor.chain().focus().liftListItem("listItem").run();
        }

        return false;
      },
    };
  },
});

const ToolbarButton = ({ active = false, children, label, onClick }) => {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex size-8 shrink-0 items-center justify-center rounded-lg border text-sm transition-all duration-200 ${
        active
          ? "border-teal-300/25 bg-teal-500/15 text-teal-700 shadow-[0_5px_14px_rgba(20,184,166,0.10)] dark:border-teal-300/[0.12] dark:bg-teal-300/[0.08] dark:text-teal-200/80"
          : "border-gray-200/70 bg-white/65 text-gray-600 hover:border-teal-300/30 hover:bg-teal-500/[0.06] hover:text-teal-700 dark:border-white/[0.05] dark:bg-white/[0.025] dark:text-white/45 dark:hover:border-teal-300/[0.10] dark:hover:bg-teal-300/[0.05] dark:hover:text-teal-200/70"
      }`}
    >
      {children}
    </button>
  );
};

const MenuBar = ({ editor, type, onSubmit, submitLabel = "Submit", disabled = false }) => {
  if (!editor) {
    return null;
  }

  const isDefault = type === "default";

  const handleSubmit = () => {
    if (!disabled && onSubmit) {
      onSubmit(editor.getHTML());
    }
  };

  return (
    <div
      className={`relative z-20 flex items-center justify-between gap-3 border-gray-200/70 bg-gray-50/75 px-2.5 py-2 backdrop-blur-xl dark:border-white/[0.05] dark:bg-white/[0.018] ${
        isDefault ? "border-b" : "border-t"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto pb-0.5">
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => getFocusedEditor(editor).toggleBold().run()}>
          <BsTypeBold />
        </ToolbarButton>

        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => getFocusedEditor(editor).toggleItalic().run()}>
          <BsTypeItalic />
        </ToolbarButton>

        <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => getFocusedEditor(editor).toggleUnderline().run()}>
          <BsTypeUnderline />
        </ToolbarButton>

        <ToolbarButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => getFocusedEditor(editor).toggleStrike().run()}>
          <BsTypeStrikethrough />
        </ToolbarButton>

        <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => getFocusedEditor(editor).toggleBulletList().run()}>
          <CiBoxList size={18} />
        </ToolbarButton>

        {!isDefault && (
          <>
            <span className="mx-2 h-5 w-px shrink-0 bg-gray-300/80 dark:bg-white/[0.07]" />

            <ToolbarButton label="Highlight" active={editor.isActive("highlight")} onClick={() => getFocusedEditor(editor).toggleHighlight().run()}>
              <FaHighlighter size={14} />
            </ToolbarButton>

            <ToolbarButton label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => getFocusedEditor(editor).setTextAlign("left").run()}>
              <MdFormatAlignLeft size={18} />
            </ToolbarButton>

            <ToolbarButton label="Align centre" active={editor.isActive({ textAlign: "center" })} onClick={() => getFocusedEditor(editor).setTextAlign("center").run()}>
              <MdFormatAlignCenter size={18} />
            </ToolbarButton>

            <ToolbarButton label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => getFocusedEditor(editor).setTextAlign("right").run()}>
              <MdFormatAlignRight size={18} />
            </ToolbarButton>

            <ToolbarButton label="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => getFocusedEditor(editor).setTextAlign("justify").run()}>
              <MdFormatAlignJustify size={18} />
            </ToolbarButton>
          </>
        )}
      </div>

      {!isDefault && (
        <button
          type="button"
          disabled={disabled}
          onClick={handleSubmit}
          className="shrink-0 rounded-lg bg-teal-600 px-4 py-2 text-[10px] font-semibold text-white shadow-none transition-all hover:bg-teal-500 hover:shadow-[0_7px_18px_rgba(20,184,166,0.18)] disabled:pointer-events-none disabled:opacity-55"
        >
          {submitLabel}
        </button>
      )}
    </div>
  );
};

export const CommentEditor = ({ value = "", onChange = () => {}, onSubmit, submitLabel = "Submit", disabled = false, placeholder = "Type something here...", type, className = "" }) => {
  const isDefault = type === "default";

  const editor = useEditor({
    content: value || "",
    editable: !disabled,

    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },

    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "my-0 leading-relaxed",
          },
        },
      }),
      Underline,
      TextStyle,
      Highlight.configure({
        multicolor: false,
        HTMLAttributes: {
          class: "rounded bg-amber-300/50 px-0.5 text-gray-900 dark:bg-amber-300/30 dark:text-white/90",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "before:pointer-events-none before:float-left before:h-0 before:text-gray-400 before:content-[attr(data-placeholder)] dark:before:text-white/25",
      }),
      CustomListEnter,
    ],

    editorProps: {
      attributes: {
        class:
          "min-h-[150px] max-w-full focus:outline-none text-[12px] leading-6 text-gray-700 dark:text-white/60 [&_p]:my-0 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white/90",
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextValue = value || "";

    if (nextValue !== editor.getHTML()) {
      editor.commands.setContent(nextValue, false);
    }
  }, [editor, value]);

  if (isDefault) {
    return (
      <div
        className={`editor-default group/editor relative overflow-hidden rounded-xl border border-gray-200/70 bg-gray-100/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-all focus-within:border-teal-400/35 focus-within:shadow-[0_0_0_3px_rgba(20,184,166,0.05)] dark:border-white/[0.055] dark:bg-white/[0.025] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.015)] dark:focus-within:border-teal-300/[0.12] ${className}`}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-teal-500/[0.025] blur-[50px]" />

        <MenuBar editor={editor} type={type} onSubmit={onSubmit} submitLabel={submitLabel} disabled={disabled} />

        <EditorContent editor={editor} className="relative z-10 min-h-[150px] px-3 py-3" />
      </div>
    );
  }

  return (
    <div className={`editor-default relative ${className}`}>
      <Wrapper className="group/editor relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-teal-500/[0.018] blur-[60px] transition-all duration-500 group-focus-within/editor:bg-teal-500/[0.03]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-cyan-500/[0.014] blur-[60px]" />

        <div className="relative z-10">
          <EditorContent editor={editor} className="min-h-[170px] rounded-t-xl px-4 py-4" />
          <MenuBar editor={editor} type={type} onSubmit={onSubmit} submitLabel={submitLabel} disabled={disabled} />
        </div>
      </Wrapper>
    </div>
  );
};

ToolbarButton.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

MenuBar.propTypes = {
  type: PropTypes.string,
  editor: PropTypes.object,
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  disabled: PropTypes.bool,
};

CommentEditor.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};
