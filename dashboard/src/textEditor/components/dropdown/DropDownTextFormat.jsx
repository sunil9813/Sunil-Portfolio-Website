import PropTypes from "prop-types";
import { AiFillCaretDown } from "react-icons/ai";
import { TfiText } from "react-icons/tfi";
import { RiSubscript, RiSuperscript } from "react-icons/ri";
import { NoSpaceDropDownOptions } from "@/textEditor/common/DropDownOptions";

export const DropDownTextFormat = ({ editor }) => {
  const options = [
    {
      label: (
        <span className="flex items-center gap-2">
          <RiSuperscript />
          Superscript
        </span>
      ),
      onClick: () => editor.chain().focus().toggleSuperscript().run(),
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <RiSubscript />
          Subscript
        </span>
      ),
      onClick: () => editor.chain().focus().toggleSubscript().run(),
    },
  ];

  const FormatHead = () => (
    <>
      <TfiText />
      <AiFillCaretDown />
    </>
  );

  return <NoSpaceDropDownOptions options={options} head={<FormatHead />} width="w-[140px]" />;
};

DropDownTextFormat.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default DropDownTextFormat;
