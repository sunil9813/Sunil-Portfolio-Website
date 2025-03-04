import PropTypes from "prop-types";
import { AiFillCaretDown } from "react-icons/ai";
import { BsTypeStrikethrough, BsBraces, BsCode, BsListOl, BsListUl, BsTypeBold, BsTypeItalic, BsTypeUnderline, BsImageFill } from "react-icons/bs";
import { RiDoubleQuotesL } from "react-icons/ri";
import { getFocusedEditor } from "../utils/EditorUtils";
import { DropDownOptions, DropDownHighLight, DropDownForFont } from "../common/DropDownOptions";
import Button from "./Button";
import EmbedYoutube from "./EmbedYoutube";
import InsertLink from "../link/InsertLink";
import Table from "../table/Table";
import { PiHighlighterFill } from "react-icons/pi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { FontFamilies, HighlightColors } from "../utils/Option";
import { ImTable2 } from "react-icons/im";
import { useState } from "react";
import { MdFormatAlignCenter, MdFormatAlignJustify, MdFormatAlignLeft, MdFormatAlignRight } from "react-icons/md";
import { BubbleMenu } from "@tiptap/react";

const TollBar = ({ editor, onOpenImageClick }) => {
  const [openTable, setopenTable] = useState(false);
  if (!editor) return null;

  const handleTableButtonClick = () => {
    // Toggle the table visibility
    setopenTable((prev) => !prev);
  };

  const getFontLabel = () => {
    if (editor.isActive("textStyle", { fontFamily: "Arial" })) return "Arial";
    if (editor.isActive("textStyle", { fontFamily: "Roboto, sans-serif" })) return "Roboto";
    if (editor.isActive("textStyle", { fontFamily: "'Inter', sans-serif" })) return "Inter";
    if (editor.isActive("textStyle", { fontFamily: "Times New Roman, serif" })) return "Times";
    if (editor.isActive("textStyle", { fontFamily: "Courier New, monospace" })) return "Courier";
    if (editor.isActive("textStyle", { fontFamily: "Georgia, serif" })) return "Georgia";
    if (editor.isActive("textStyle", { fontFamily: "Verdana, Geneva, sans-serif" })) return "Verdana";
    if (editor.isActive("textStyle", { fontFamily: "Tahoma, Geneva, sans-serif" })) return "Tahoma";
    if (editor.isActive("textStyle", { fontFamily: "Trebuchet MS, Helvetica, sans-serif" })) return "Trebuchet MS";
    if (editor.isActive("textStyle", { fontFamily: "Impact, Charcoal, sans-serif" })) return "Impact";
    if (editor.isActive("textStyle", { fontFamily: "Comic Sans MS, cursive, sans-serif" })) return "Comic Sans MS";
    if (editor.isActive("textStyle", { fontFamily: "Lucida Console, Monaco, monospace" })) return "Lucida Console";
    if (editor.isActive("textStyle", { fontFamily: "Palatino, 'Palatino Linotype', 'Book Antiqua', serif" })) return "Palatino";
    if (editor.isActive("textStyle", { fontFamily: "Century Gothic, sans-serif" })) return "Century Gothic";
    if (editor.isActive("textStyle", { fontFamily: "'Frank Ruhl Libre', serif" })) return "Frank Ruhl Libre";
    if (editor.isActive("textStyle", { fontFamily: "'Merriweather', serif" })) return "Merriweather";
    if (editor.isActive("textStyle", { fontFamily: "'Lora', serif" })) return "Lora";
    if (editor.isActive("textStyle", { fontFamily: "'Open Sans', sans-serif" })) return "Open Sans";
    if (editor.isActive("textStyle", { fontFamily: "'Lato', sans-serif" })) return "Lato";
    if (editor.isActive("textStyle", { fontFamily: "'Montserrat', sans-serif" })) return "Montserrat";
    if (editor.isActive("textStyle", { fontFamily: "'Ubuntu', sans-serif" })) return "Ubuntu";
    if (editor.isActive("textStyle", { fontFamily: "'Playfair Display', serif" })) return "Playfair Display";
    if (editor.isActive("textStyle", { fontFamily: "'Slabo 27px', serif" })) return "Slabo 27px";
    if (editor.isActive("textStyle", { fontFamily: "'Dancing Script', cursive" })) return "Dancing Script";
    if (editor.isActive("textStyle", { fontFamily: "'Barlow Condensed', sans-serif" })) return "Barlow Condensed";
    if (editor.isActive("textStyle", { fontFamily: "'Moon Dance', cursive" })) return "Moon Dance";
    return "Font Family";
  };

  const FontHead = () => {
    return (
      <div className="flex items-center gap-3 text-textcolor">
        <p>{getFontLabel()}</p>
        <AiFillCaretDown size={20} />
      </div>
    );
  };

  const handleFontChange = (font) => {
    editor.chain().focus().setFontFamily(font).run();
  };

  const options = [
    { label: "Paragraph", onClick: () => getFocusedEditor(editor).setParagraph().run() },
    { label: "Heading 1", onClick: () => getFocusedEditor(editor).toggleHeading({ level: 1 }).run() },
    { label: "Heading 2", onClick: () => getFocusedEditor(editor).toggleHeading({ level: 2 }).run() },
    { label: "Heading 3", onClick: () => getFocusedEditor(editor).toggleHeading({ level: 3 }).run() },
  ];

  const getLabel = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    return "Paragraph";
  };

  const Head = () => {
    return (
      <div className="flex items-center gap-3 text-textcolor">
        <p>{getLabel()}</p>
        <AiFillCaretDown />
      </div>
    );
  };

  const HighlightHead = () => {
    return (
      <Button>
        <PiHighlighterFill />
      </Button>
    );
  };
  const ColortHead = () => {
    return (
      <Button>
        <IoColorPaletteOutline />
      </Button>
    );
  };

  const handleLinkSubmit = ({ url, openInNewTab }) => {
    const { commands } = editor;
    if (openInNewTab) commands.setLink({ href: url, target: "_blank" });
    else commands.setLink({ href: url });
  };

  const handleEmbedYoutube = (url) => {
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  return (
    <>
      <div className="flex items-center flex-wrap">
        <DropDownForFont
          options={FontFamilies.map(({ label, font }) => ({
            label,
            onClick: () => handleFontChange(font),
          }))}
          head={<FontHead />}
        />
        <div className="h-4 w-[1px] bg-white/20  mx-8" />
        {/* paragraph, heading 1, 2, 3 */}
        <DropDownOptions options={options} head={<Head />} />

        <div className="h-4 w-[1px] bg-white/20  mx-8" />

        <div className="flex items-center space-x-3">
          {editor && (
            <BubbleMenu className="bubble-menu bg-black p-2 rounded-md flex gap-2" tippyOptions={{ duration: 100 }} editor={editor}>
              <Button active={editor.isActive("bold")} onClick={() => getFocusedEditor(editor).toggleBold().run()}>
                <BsTypeBold />
              </Button>
              <Button active={editor.isActive("italic")} onClick={() => getFocusedEditor(editor).toggleItalic().run()}>
                <BsTypeItalic />
              </Button>
              <Button active={editor.isActive("underline")} onClick={() => getFocusedEditor(editor).toggleUnderline().run()}>
                <BsTypeUnderline />
              </Button>
              <Button active={editor.isActive("strike")} onClick={() => getFocusedEditor(editor).toggleStrike().run()}>
                <BsTypeStrikethrough />
              </Button>
            </BubbleMenu>
          )}

          <Button active={editor.isActive("bold")} onClick={() => getFocusedEditor(editor).toggleBold().run()}>
            <BsTypeBold />
          </Button>
          <Button active={editor.isActive("italic")} onClick={() => getFocusedEditor(editor).toggleItalic().run()}>
            <BsTypeItalic />
          </Button>
          <Button active={editor.isActive("underline")} onClick={() => getFocusedEditor(editor).toggleUnderline().run()}>
            <BsTypeUnderline />
          </Button>
          <Button active={editor.isActive("strike")} onClick={() => getFocusedEditor(editor).toggleStrike().run()}>
            <BsTypeStrikethrough />
          </Button>

          <DropDownHighLight
            options={[
              {
                label: "Custom",
                color: "",
                component: (
                  <input
                    type="color"
                    onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
                    value={editor.getAttributes("textStyle").color || "#000000"}
                    className="w-8 h-8 rounded-sm cursor-pointer outline-none border-none"
                  />
                ),
              },
              ...HighlightColors.map(({ label, color }) => ({
                label,
                color,
                onClick: () => {
                  const focusedEditor = getFocusedEditor(editor);
                  if (label === "None") {
                    focusedEditor.unsetHighlight().run();
                  } else {
                    focusedEditor.toggleHighlight({ color }).run();
                  }
                },
              })),
            ]}
            head={<HighlightHead />}
          />

          <DropDownHighLight
            options={[
              {
                label: "Custom",
                color: "",
                component: (
                  <input
                    type="color"
                    onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
                    value={editor.getAttributes("textStyle").color || "#000000"}
                    className="w-8 h-8 rounded-sm cursor-pointer outline-none border-none"
                  />
                ),
              },
              ...HighlightColors.map(({ label, color }) => ({
                label,
                color,
                onClick: () => {
                  const focusedEditor = getFocusedEditor(editor);
                  if (label === "None") {
                    focusedEditor.unsetColor().run();
                  } else {
                    focusedEditor.setColor(color).run();
                  }
                },
              })),
            ]}
            head={<ColortHead />}
          />
        </div>

        <div className="h-4 w-[1px] bg-white/20  mx-8" />
        <div className="flex items-center space-x-3">
          <Button active={editor.isActive({ textAlign: "left" })} onClick={() => getFocusedEditor(editor).setTextAlign("left").run()}>
            <MdFormatAlignLeft />
          </Button>
          <Button active={editor.isActive({ textAlign: "center" })} onClick={() => getFocusedEditor(editor).setTextAlign("center").run()}>
            <MdFormatAlignCenter />
          </Button>
          <Button active={editor.isActive({ textAlign: "right" })} onClick={() => getFocusedEditor(editor).setTextAlign("right").run()}>
            <MdFormatAlignRight />
          </Button>
          <Button active={editor.isActive({ textAlign: "justify" })} onClick={() => getFocusedEditor(editor).setTextAlign("justify").run()}>
            <MdFormatAlignJustify />
          </Button>
        </div>

        <div className="h-4 w-[1px] bg-white/20  mx-8" />

        <div className="flex items-center space-x-3">
          <Button active={editor.isActive("blockquote")} onClick={() => getFocusedEditor(editor).toggleBlockquote().run()}>
            <RiDoubleQuotesL />
          </Button>

          <Button active={editor.isActive("code")} onClick={() => getFocusedEditor(editor).toggleCode().run()}>
            <BsCode />
          </Button>

          <Button active={editor.isActive("codeBlock")} onClick={() => getFocusedEditor(editor).toggleCodeBlock().run()}>
            <BsBraces />
          </Button>

          <InsertLink onSubmit={handleLinkSubmit} />

          <Button active={editor.isActive("orderedList")} onClick={() => getFocusedEditor(editor).toggleOrderedList().run()}>
            <BsListOl />
          </Button>

          <Button active={editor.isActive("bulletList")} onClick={() => getFocusedEditor(editor).toggleBulletList().run()}>
            <BsListUl />
          </Button>
        </div>

        <div className="h-4 w-[1px] bg-white/20  mx-8" />

        <div className="flex items-center space-x-3">
          <EmbedYoutube onSubmit={handleEmbedYoutube} />
          <Button onClick={onOpenImageClick}>
            <BsImageFill />
          </Button>
          {/*  <Button active={editor.isActive("horizontalRule")} onClick={() => getFocusedEditor(editor).setHorizontalRule().run()}>
            <FaGripLines />
          </Button> */}
          <Button active={editor.isActive("table")} onClick={handleTableButtonClick}>
            <ImTable2 />
          </Button>
        </div>
      </div>
      {openTable && <Table editor={editor} />}
    </>
  );
};

TollBar.propTypes = {
  editor: PropTypes.object,
  onOpenImageClick: PropTypes.func,
};

export default TollBar;
