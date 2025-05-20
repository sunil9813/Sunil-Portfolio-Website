// extensions/Column/components/ColumnButton.jsx
import Button from "@/textEditor/TollBar/Button"; // Your custom Button path
import PropTypes from "prop-types";
import { TbColumns } from "react-icons/tb"; // Icon for columns

const ColumnButton = ({ editor }) => {
  const getFocusedEditor = (editorInstance) => editorInstance.chain().focus();

  return (
    <Button active={editor.isActive("columnContainer")} onClick={() => getFocusedEditor(editor).insertColumnContainer().run()} tooltip="Insert Columns">
      <TbColumns />
    </Button>
  );
};

ColumnButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default ColumnButton;
