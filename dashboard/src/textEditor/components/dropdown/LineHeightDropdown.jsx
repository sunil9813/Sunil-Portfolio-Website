import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { FaTextHeight } from "react-icons/fa";
import { AiFillCaretDown } from "react-icons/ai";
import { NoSpaceDropDownOptions } from "@/textEditor/common/DropDownOptions";
import { Tooltip } from "@material-tailwind/react"; // Adjust this import based on your actual Tooltip component

const LineHeightDropdown = ({ editor }) => {
  const [currentLineHeight, setCurrentLineHeight] = useState("auto");
  const [showOptions, setShowOptions] = useState(false);

  const lineHeightOptions = [
    { label: "Auto", value: "auto" },
    { label: "1", value: "1" },
    { label: "1.15", value: "1.15" },
    { label: "1.3", value: "1.3" },
    { label: "1.5", value: "1.5" },
    { label: "2", value: "2" },
    { label: "2.5", value: "2.5" },
    { label: "3", value: "3" },
  ];

  // Update current line height when selection changes
  useEffect(() => {
    if (!editor) return;

    const updateLineHeight = () => {
      const { selection } = editor.state;
      let height = null;

      editor.state.doc.nodesBetween(selection.from, selection.to, (node) => {
        if (["paragraph", "heading", "listItem"].includes(node.type.name)) {
          height = node.attrs.lineHeight || "auto";
        }
      });
      setCurrentLineHeight(height || "auto");
    };

    editor.on("selectionUpdate", updateLineHeight);
    editor.on("transaction", updateLineHeight); // Add this to catch changes from commands
    return () => {
      editor.off("selectionUpdate", updateLineHeight);
      editor.off("transaction", updateLineHeight);
    };
  }, [editor]);

  const LineHeightHead = () => {
    return (
      <Tooltip
        content="Line Height"
        placement="top"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 10 },
        }}
        className="bg-black text-white px-3 py-2 text-xs shadow-xl rounded-none"
      >
        <button
          onBlur={() => setShowOptions(false)}
          onMouseDown={() => setShowOptions(!showOptions)}
          className="flex items-center gap-1 text-xs bg-white dark:bg-black/20 hover:bg-green-400 h-6 3xl:h-8 rounded w-auto px-2 hover:text-white hover:scale-110 hover:shadow-md transition"
        >
          <FaTextHeight />
          <span className="ml-1 text-xs">{currentLineHeight === "auto" ? "Auto" : currentLineHeight}</span>
          <AiFillCaretDown />
        </button>
      </Tooltip>
    );
  };

  return (
    <NoSpaceDropDownOptions
      options={lineHeightOptions.map(({ label, value }) => ({
        label,
        onClick: () => {
          editor.chain().focus().setLineHeight(value).run(); // Apply to editor
          setCurrentLineHeight(value); // Update local state
          setShowOptions(false); // Close dropdown
        },
        active: currentLineHeight === value,
      }))}
      head={<LineHeightHead />}
      width="w-[95px]"
    />
  );
};

LineHeightDropdown.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default LineHeightDropdown;
