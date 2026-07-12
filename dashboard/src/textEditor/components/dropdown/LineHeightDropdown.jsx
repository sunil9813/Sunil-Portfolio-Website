import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { FaTextHeight } from "react-icons/fa";
import { AiFillCaretDown } from "react-icons/ai";
import { NoSpaceDropDownOptions } from "@/textEditor/common/DropDownOptions";

const LineHeightDropdown = ({ editor }) => {
  const [currentLineHeight, setCurrentLineHeight] = useState("auto");

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

    updateLineHeight();

    editor.on("selectionUpdate", updateLineHeight);
    editor.on("transaction", updateLineHeight);

    return () => {
      editor.off("selectionUpdate", updateLineHeight);
      editor.off("transaction", updateLineHeight);
    };
  }, [editor]);

  const LineHeightHead = () => (
    <>
      <FaTextHeight />
      <span>{currentLineHeight === "auto" ? "Auto" : currentLineHeight}</span>
      <AiFillCaretDown />
    </>
  );

  return (
    <NoSpaceDropDownOptions
      options={lineHeightOptions.map(({ label, value }) => ({
        label,
        onClick: () => {
          editor.chain().focus().setLineHeight(value).run();
          setCurrentLineHeight(value);
        },
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
