import PropTypes from "prop-types";
import { AiFillCaretDown } from "react-icons/ai";
import { BsTypeStrikethrough, BsBraces, BsCode, BsListOl, BsListUl, BsTypeBold, BsTypeItalic, BsTypeUnderline, BsImageFill } from "react-icons/bs";
import { RiDoubleQuotesL } from "react-icons/ri";
import { getFocusedEditor } from "../utils/EditorUtils";
import { DropDownOptions, DropDownForFont, DropDownOptionsWithIcon } from "../common/DropDownOptions";
import Button from "./Button";
import EmbedYoutube from "./EmbedYoutube";
import InsertLink from "../link/InsertLink";
import { PiHighlighterFill } from "react-icons/pi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { FontFamilies } from "../utils/Option";
import { MdFormatAlignCenter, MdFormatAlignJustify, MdFormatAlignLeft, MdFormatAlignRight } from "react-icons/md";
import { TbIndentDecrease, TbIndentIncrease } from "react-icons/tb";
import LineHeightDropdown from "../components/dropdown/LineHeightDropdown";
import { DropDownTextFormat } from "../components/dropdown/DropDownTextFormat";
import MathFormulaButton from "../components/MathFormulaInput";
import EmojiButton from "../components/EmojiPicker";
import GiftPicker from "../components/GiftPicker";
import ColumnButton from "../components/ColumnButton";
import { CustomTableButton } from "../components/table/CustomTableButton";
import GalleryPickerComponent from "../components/GalleryPickerComponent";
import { ColorPickerDropdown } from "../common/ColorPickerDropdown";
import { useState } from "react";
import { DropdownWrapper } from "../common/DropdownWrapper";

const TollBar = ({ editor, onOpenImageClick }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [recentlyUsedColors, setRecentlyUsedColors] = useState([]);
  const [recentlyUsedHighlights, setRecentlyUsedHighlights] = useState([]);
  const [customColor, setCustomColor] = useState("#ffffff");
  const [customHighlight, setCustomHighlight] = useState("#ffffff");
  if (!editor) return null;

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
      <div className="flex items-center gap-1 bg-white dark:bg-black/20 hover:bg-green-400 h-6 3xl:h-8 rounded w-auto px-2 hover:text-white hover:scale-110 hover:shadow-md transition">
        <p className="text-xs">{getFontLabel()}</p>
        <AiFillCaretDown />
      </div>
    );
  };

  const handleFontChange = (font) => {
    editor.chain().focus().setFontFamily(font).run();
    setActiveDropdown(null);
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

  const Head = () => (
    <div
      className="flex items-center gap-1 bg-white dark:bg-black/20 hover:bg-green-400 h-6 3xl:h-8 rounded w-auto px-2 hover:text-white hover:scale-110 hover:shadow-md transition"
      onClick={() => setActiveDropdown(activeDropdown === "heading" ? null : "heading")}
    >
      <p className="text-xs">{getLabel()}</p>
      <AiFillCaretDown />
    </div>
  );

  const HighlightHead = () => (
    <Button onClick={() => setActiveDropdown(activeDropdown === "highlight" ? null : "highlight")}>
      <PiHighlighterFill />
    </Button>
  );

  const ColorHead = () => (
    <Button onClick={() => setActiveDropdown(activeDropdown === "color" ? null : "color")}>
      <IoColorPaletteOutline />
    </Button>
  );

  const handleLinkSubmit = ({ url, openInNewTab }) => {
    const { commands } = editor;
    if (openInNewTab) commands.setLink({ href: url, target: "_blank" });
    else commands.setLink({ href: url });
  };

  const handleEmbedYoutube = (url) => {
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  /* ---------- for alignment ------------- */
  // Get current alignment for display
  const getCurrentAlignmentIcon = () => {
    if (editor.isActive({ textAlign: "center" })) return <MdFormatAlignCenter />;
    if (editor.isActive({ textAlign: "right" })) return <MdFormatAlignRight />;
    if (editor.isActive({ textAlign: "justify" })) return <MdFormatAlignJustify />;
    return <MdFormatAlignLeft />; // Default to left
  };

  const alignmentOptions = [
    {
      icon: <MdFormatAlignLeft />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      active: editor.isActive({ textAlign: "left" }),
      tooltip: "Align Left",
    },
    {
      icon: <MdFormatAlignCenter />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      active: editor.isActive({ textAlign: "center" }),
      tooltip: "Align Center",
    },
    {
      icon: <MdFormatAlignRight />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      active: editor.isActive({ textAlign: "right" }),
      tooltip: "Align Right",
    },
    {
      icon: <MdFormatAlignJustify />,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      active: editor.isActive({ textAlign: "justify" }),
      tooltip: "Justify Text",
    },
  ];

  const AlignHead = () => (
    <div
      className="flex items-center gap-1 bg-white dark:bg-black/20 hover:bg-green-400 h-6 3xl:h-8 rounded w-auto px-2 hover:text-white hover:scale-110 hover:shadow-md transition"
      onClick={() => setActiveDropdown(activeDropdown === "align" ? null : "align")}
    >
      <p className="text-xs">{getCurrentAlignmentIcon()}</p>
      <AiFillCaretDown />
    </div>
  );

  const handleColorSelect = (color) => {
    const focusedEditor = getFocusedEditor(editor);
    if (color === "transparent") {
      focusedEditor.unsetColor().run();
    } else {
      focusedEditor.setColor(color).run();
      setRecentlyUsedColors((prev) => [color, ...prev.filter((c) => c !== color)].slice(0, 10));
    }
    setActiveDropdown(null); // Close dropdown after selection
  };

  const handleHighlightSelect = (color) => {
    const focusedEditor = getFocusedEditor(editor);
    if (color === "transparent") {
      focusedEditor.unsetHighlight().run();
    } else {
      focusedEditor.toggleHighlight({ color }).run();
      setRecentlyUsedHighlights((prev) => [color, ...prev.filter((c) => c !== color)].slice(0, 10));
    }
    setActiveDropdown(null); // Close dropdown after selection
  };

  return (
    <>
      <div className="flex items-center flex-wrap gap-1 w-full">
        <DropDownForFont
          options={FontFamilies.map(({ label, font }) => ({
            label,
            onClick: () => handleFontChange(font),
          }))}
          head={<FontHead />}
        />
        <div className="h-4 w-[1px] bg-white/20  mx-2" />
        {/* paragraph, heading 1, 2, 3 */}
        <DropDownOptions options={options} head={<Head />} />

        <div className="h-4 w-[1px] bg-white/20 mx-2" />

        <div className="flex items-center space-x-1.5">
          {/*   {editor && (
            <BubbleMenu
              className="bubble-menu bg-black p-2 rounded-md flex gap-2"
              tippyOptions={{ duration: 100 }}
              editor={editor}
              shouldShow={({ editor, from, to }) => {
                // Only show when text is selected (not empty selection)
                if (from === to) return false;

                // Don't show when an image or other node is selected
                const { selection } = editor.state;
                const { $from, $to } = selection;

                // Check if selection spans multiple nodes or contains non-text nodes
                if ($from.parent !== $to.parent) return false;
                if ($from.parent.isTextblock === false) return false;

                return true;
              }}
            >
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
          )} */}

          <Button active={editor.isActive("bold")} onClick={() => getFocusedEditor(editor).toggleBold().run()} tooltip="Bold (Ctrl+B)">
            <BsTypeBold />
          </Button>
          <Button active={editor.isActive("italic")} onClick={() => getFocusedEditor(editor).toggleItalic().run()} tooltip="Italic (Ctrl+I)">
            <BsTypeItalic />
          </Button>
          <Button active={editor.isActive("underline")} onClick={() => getFocusedEditor(editor).toggleUnderline().run()} tooltip="Underline (Ctrl + U)">
            <BsTypeUnderline />
          </Button>
          <Button active={editor.isActive("strike")} onClick={() => getFocusedEditor(editor).toggleStrike().run()} tooltip="Strike">
            <BsTypeStrikethrough />
          </Button>

          <div className="relative">
            <HighlightHead />
            <DropdownWrapper isOpen={activeDropdown === "highlight"} onClose={() => setActiveDropdown(null)} className="shadow-lg">
              <ColorPickerDropdown
                recentlyUsedColors={recentlyUsedHighlights}
                customColor={customHighlight}
                onColorSelect={handleHighlightSelect}
                onCustomColorChange={setCustomHighlight}
                onClose={() => setActiveDropdown(null)}
              />
            </DropdownWrapper>
          </div>

          <div className="relative">
            <ColorHead />
            <DropdownWrapper isOpen={activeDropdown === "color"} onClose={() => setActiveDropdown(null)} className="shadow-lg">
              <ColorPickerDropdown
                recentlyUsedColors={recentlyUsedColors}
                customColor={customColor}
                onColorSelect={handleColorSelect}
                onCustomColorChange={setCustomColor}
                onClose={() => setActiveDropdown(null)}
              />
            </DropdownWrapper>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-white/20  mx-2" />
        <div className="flex items-center space-x-1.5">
          <DropDownOptionsWithIcon options={alignmentOptions} head={<AlignHead />} customClasses="min-w-[120px]" />
          <Button onClick={() => editor.chain().focus().indent().run()} disabled={!editor.can().indent()} tooltip="Indent (Tab)">
            <TbIndentIncrease />
          </Button>
          <Button onClick={() => editor.chain().focus().outdent().run()} disabled={!editor.can().outdent()} tooltip="Outdent (Shift+Tab)">
            <TbIndentDecrease />
          </Button>
          <LineHeightDropdown editor={editor} />
          <DropDownTextFormat editor={editor} />
        </div>
        <div className="h-4 w-[1px] bg-white/20  mx-2" />

        <div className="flex items-center space-x-1.5">
          <MathFormulaButton editor={editor} />
          <EmojiButton editor={editor} />
          <GiftPicker editor={editor} />
          <ColumnButton editor={editor} />
          <CustomTableButton editor={editor} />
          <GalleryPickerComponent editor={editor} />
        </div>
        <div className="h-4 w-[1px] bg-white/20  mx-2" />

        <div className="flex items-center space-x-1.5">
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

        <div className="h-4 w-[1px] bg-white/20  mx-2" />

        <div className="flex items-center space-x-1.5">
          <EmbedYoutube onSubmit={handleEmbedYoutube} />
          <Button onClick={onOpenImageClick}>
            <BsImageFill />
          </Button>
        </div>
      </div>
    </>
  );
};

TollBar.propTypes = {
  editor: PropTypes.object,
  onOpenImageClick: PropTypes.func,
};

export default TollBar;
