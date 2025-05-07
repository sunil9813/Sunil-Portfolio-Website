import PropTypes from "prop-types";
import Button from "@/textEditor/TollBar/Button";
import { TbTable } from "react-icons/tb";
import { useState } from "react";

export const CustomTableButton = ({ editor }) => {
  const [showGrid, setShowGrid] = useState(false);
  const [selectedRows, setSelectedRows] = useState(2);
  const [selectedCols, setSelectedCols] = useState(2);
  const maxRows = 10;
  const maxCols = 10;

  const insertTable = () => {
    if (!editor || selectedRows <= 0 || selectedCols <= 0) return;

    editor
      .chain()
      .focus()
      .insertTable({
        rows: selectedRows,
        cols: selectedCols,
        withHeaderRow: true,
        design: "default", // Set default design
      })
      .run();

    setTimeout(() => {
      const tables = editor.view.dom.querySelectorAll(".custom-table");
      if (tables.length > 0) {
        const newTable = tables[tables.length - 1];
        const pos = editor.view.posAtDOM(newTable, 0);
        if (pos !== null) {
          editor.chain().focus().setNodeSelection(pos).run();
        }
      }
    }, 200);

    setShowGrid(false);
    setSelectedRows(0);
    setSelectedCols(0);
  };

  const handleMouseEnter = (row, col) => {
    setSelectedRows(row + 1);
    setSelectedCols(col + 1);
  };

  return (
    <div className="relative">
      <Button active={editor?.isActive("table")} onClick={() => setShowGrid(!showGrid)} tooltip="Insert Table">
        <TbTable />
      </Button>

      {showGrid && (
        <div className="absolute top-full mt-2 left-0 z-[9999] bg-primarybg rounded-lg p-2 shadow-lg" onMouseLeave={() => setShowGrid(false)}>
          <div className="grid gap-1">
            {Array.from({ length: maxRows }).map((_, row) => (
              <div key={row} className="flex gap-1">
                {Array.from({ length: maxCols }).map((_, col) => (
                  <div
                    key={col}
                    className={`w-6 h-6 border rounded-sm cursor-pointer ${row < selectedRows && col < selectedCols ? "bg-white" : "border-gray-700/20"}`}
                    onMouseEnter={() => handleMouseEnter(row, col)}
                    onClick={insertTable}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-700 mt-2">
            {selectedRows}x{selectedCols}
          </div>
        </div>
      )}
    </div>
  );
};

CustomTableButton.propTypes = {
  editor: PropTypes.shape({
    chain: PropTypes.func.isRequired,
    focus: PropTypes.func.isRequired,
    insertTable: PropTypes.func.isRequired,
    isActive: PropTypes.func.isRequired,
    run: PropTypes.func.isRequired,
    setNodeSelection: PropTypes.func.isRequired,
    view: PropTypes.shape({
      dom: PropTypes.instanceOf(HTMLElement),
      posAtDOM: PropTypes.func.isRequired,
    }).isRequired,
  }),
};
