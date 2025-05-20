import { useState } from "react";
import PropTypes from "prop-types";
import { AiFillCaretDown } from "react-icons/ai";
import { TfiText } from "react-icons/tfi";
import { RiSubscript, RiSuperscript } from "react-icons/ri";
import { NoSpaceDropDownOptions } from "@/textEditor/common/DropDownOptions";
import { Tooltip } from "@material-tailwind/react";

export const DropDownTextFormat = ({ editor }) => {
  const [showOptions, setShowOptions] = useState(false);

  const options = [
    {
      label: "Superscript",
      icon: <RiSuperscript />,
      onClick: () => editor.chain().focus().toggleSuperscript().run(),
      active: editor.isActive("superscript"),
      tooltip: "Toggle superscript (Ctrl+.)",
    },
    {
      label: "Subscript",
      icon: <RiSubscript />,
      onClick: () => editor.chain().focus().toggleSubscript().run(),
      active: editor.isActive("subscript"),
      tooltip: "Toggle subscript (Ctrl+,)",
    },
  ];

  const FormatHead = () => {
    return (
      <Tooltip
        content="Text Formatting"
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
          className="flex items-center bg-white dark:bg-black/20 gap-1 hover:bg-green-400 h-6 3xl:h-8 rounded w-auto px-2 hover:text-white hover:scale-110 hover:shadow-md transition"
        >
          <TfiText />
          <AiFillCaretDown />
        </button>
      </Tooltip>
    );
  };

  return (
    <NoSpaceDropDownOptions
      options={options.map(({ label, icon, onClick, tooltip }) => ({
        label: (
          <div className="flex items-center gap-2">
            {icon}
            {label}
          </div>
        ),
        onClick: () => {
          onClick();
          setShowOptions(false);
        },
        title: tooltip,
      }))}
      head={<FormatHead />}
      width="w-[120px]"
    />
  );
};

DropDownTextFormat.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default DropDownTextFormat;
