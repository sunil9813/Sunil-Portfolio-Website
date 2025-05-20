import { useState, useEffect, useRef } from "react";
import { CellSelection } from "@tiptap/pm/tables";
import Button from "@/textEditor/TollBar/Button";
import { TbColumnInsertLeft, TbColumnInsertRight, TbRowInsertBottom, TbRowInsertTop } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { RiDeleteColumn, RiDeleteRow } from "react-icons/ri";
import { FaBorderAll, FaSquare, FaPalette } from "react-icons/fa";
import { Slider } from "@material-tailwind/react";
import { ColorPickerDropdown } from "@/textEditor/common/ColorPickerDropdown";
import PropTypes from "prop-types";
import { LuLayoutDashboard } from "react-icons/lu";
import { TableDesign } from "./design/TableDesign";
import { DropdownWrapper } from "@/textEditor/common/DropdownWrapper";

const RECENT_COLORS_KEY = "tableEditorRecentColors";

const getRecentColors = () => {
  try {
    const stored = localStorage.getItem(RECENT_COLORS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const TableActionPopup = ({ editor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showSplitCell, setShowSplitCell] = useState(false);
  const [showTableDesign, setShowTableDesign] = useState(false);
  const [showBorderDropdown, setShowBorderDropdown] = useState(false);
  const [showPaddingDropdown, setShowPaddingDropdown] = useState(false);
  const [showCellColorDropdown, setShowCellColorDropdown] = useState(false);
  const [borderStyle, setBorderStyle] = useState("solid");
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [padding, setPadding] = useState(10);
  const [borderRadius, setBorderRadius] = useState(0);
  const [recentlyUsedColors, setRecentlyUsedColors] = useState(getRecentColors());
  const [customColor, setCustomColor] = useState("#ffffff");

  const popupRef = useRef(null);

  const getActiveTable = () => {
    if (!editor) return null;
    const tables = editor.view.dom.querySelectorAll(".custom-table");
    if (!tables.length) return null;

    const { from } = editor.state.selection;
    return (
      Array.from(tables).find((table) => {
        const tablePos = editor.view.posAtDOM(table, 0);
        if (tablePos !== null) {
          const tableEndPos = tablePos + table.outerHTML.length;
          return from >= tablePos && from <= tableEndPos;
        }
        return false;
      }) || tables[tables.length - 1]
    );
  };

  const updatePopupPosition = () => {
    const table = getActiveTable();
    if (!table || !popupRef.current) return;

    const tableRect = table.getBoundingClientRect();
    const popupHeight = popupRef.current.offsetHeight || 40;
    const popupWidth = popupRef.current.offsetWidth || 500;

    const newPosition = {
      top: tableRect.top - popupHeight - 230 + window.scrollY,
      left: Math.max(0, Math.min(tableRect.left + tableRect.width / 4 - popupWidth / 2 + window.scrollX, window.innerWidth - popupWidth)),
    };

    setPosition(newPosition);
  };

  const applyPropertiesToTableAndCells = (options = {}) => {
    if (!editor) return;
    const { state } = editor;
    const tr = state.tr;
    const { applyPaddingToSelectedCells = false, paddingValue, applyBackgroundToSelectedCells = false, backgroundColor } = options;

    state.doc.descendants((node, pos) => {
      if (node.type.name === "table") {
        tr.setNodeMarkup(pos, null, {
          ...node.attrs,
          borderStyle,
          borderWidth: `${borderWidth}px`,
          borderColor,
          borderRadius: `${borderRadius}px`,
        });

        if (!applyPaddingToSelectedCells && !applyBackgroundToSelectedCells) {
          node.descendants((childNode, childPos) => {
            if (childNode.type.name === "tableCell" || childNode.type.name === "tableHeader") {
              const absolutePos = pos + childPos + 1;
              tr.setNodeMarkup(absolutePos, null, {
                ...childNode.attrs,
                borderStyle,
                borderWidth: `${borderWidth}px`,
                borderColor,
              });
            }
          });
        }
      }
    });

    if (applyPaddingToSelectedCells && state.selection instanceof CellSelection) {
      state.selection.forEachCell((cellNode, cellPos) => {
        if (cellNode.type.name === "tableCell" || cellNode.type.name === "tableHeader") {
          tr.setNodeMarkup(cellPos, null, {
            ...cellNode.attrs,
            padding: `${paddingValue}px`,
          });
        }
      });
    }

    if (applyBackgroundToSelectedCells && state.selection instanceof CellSelection) {
      state.selection.forEachCell((cellNode, cellPos) => {
        if (cellNode.type.name === "tableCell" || cellNode.type.name === "tableHeader") {
          tr.setNodeMarkup(cellPos, null, {
            ...cellNode.attrs,
            backgroundColor,
          });
        }
      });
    }

    if (tr.docChanged) {
      editor.view.dispatch(tr);
    }
  };

  const updatePaddingValue = () => {
    if (!editor || !editor.state.selection || !(editor.state.selection instanceof CellSelection)) {
      setPadding(10);
      return;
    }

    let firstPadding = null;
    editor.state.selection.forEachCell((cellNode) => {
      if (cellNode.type.name === "tableCell" || cellNode.type.name === "tableHeader") {
        const cellPadding = cellNode.attrs.padding ? parseInt(cellNode.attrs.padding, 10) : 10;
        if (firstPadding === null) {
          firstPadding = cellPadding;
        }
      }
    });

    setPadding(firstPadding !== null ? firstPadding : 10);
  };

  const handleCellBackgroundColor = (color) => {
    if (!editor) return;

    if (color !== "transparent") {
      setRecentlyUsedColors((prev) => {
        const updatedColors = prev.includes(color) ? prev : [color, ...prev].slice(0, 10);
        localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updatedColors));
        return updatedColors;
      });
    }

    const { state } = editor;
    if (state.selection instanceof CellSelection) {
      editor
        .chain()
        .focus()
        .setCellAttribute("backgroundColor", color === "transparent" ? null : color)
        .run();
    }
    setShowCellColorDropdown(false);
  };

  const handleAction = (action, value) => {
    if (!editor) return;
    const chain = editor.chain().focus();

    switch (action) {
      case "add-row-before":
        chain.addRowBefore().run();
        applyPropertiesToTableAndCells();
        break;
      case "add-row-after":
        chain.addRowAfter().run();
        applyPropertiesToTableAndCells();
        break;
      case "add-col-before":
        chain.addColumnBefore().run();
        applyPropertiesToTableAndCells();
        break;
      case "add-col-after":
        chain.addColumnAfter().run();
        applyPropertiesToTableAndCells();
        break;
      case "merge-cells":
        chain.mergeCells().run();
        break;
      case "split-cell":
        chain.splitCell().run();
        break;
      case "delete-row":
        chain.deleteRow().run();
        break;
      case "delete-col":
        chain.deleteColumn().run();
        break;
      case "delete-table":
        chain.deleteTable().run();
        setIsVisible(false);
        break;
      case "set-border-style":
        setBorderStyle(value);
        applyPropertiesToTableAndCells();
        break;
      case "set-border-width":
        setBorderWidth(Number(value));
        applyPropertiesToTableAndCells();
        break;
      case "set-border-color":
        setBorderColor(value);
        applyPropertiesToTableAndCells();
        break;
      case "set-padding":
        setPadding(Number(value));
        applyPropertiesToTableAndCells({
          applyPaddingToSelectedCells: true,
          paddingValue: Number(value),
        });
        setShowPaddingDropdown(false);
        break;
      case "set-border-radius":
        setBorderRadius(Number(value));
        applyPropertiesToTableAndCells();
        break;
      case "set-table-design":
        chain.setTableDesign(value).run();
        setShowTableDesign(false);
        break;
      default:
        break;
    }
    setTimeout(updatePopupPosition, 50);
  };

  const updateSplitCellVisibility = () => {
    if (!editor || !editor.state.selection) {
      setShowSplitCell(false);
      return;
    }

    const { selection } = editor.state;
    if (!(selection instanceof CellSelection)) {
      setShowSplitCell(false);
      return;
    }

    const hasMergeableCells = selection.someCell((cell, pos) => {
      const cellNode = editor.state.doc.nodeAt(pos);
      return cellNode && (cellNode.attrs.colspan > 1 || cellNode.attrs.rowspan > 1);
    });

    setShowSplitCell(hasMergeableCells);
  };

  useEffect(() => {
    if (!editor) return;

    const checkTablePresence = () => {
      const isTableActive = editor.isActive("table");
      setIsVisible(isTableActive);
      if (isTableActive) {
        updatePopupPosition();
        updateSplitCellVisibility();
      }
    };

    editor.on("transaction", checkTablePresence);
    editor.on("selectionUpdate", checkTablePresence);
    window.addEventListener("scroll", updatePopupPosition);
    window.addEventListener("resize", updatePopupPosition);

    checkTablePresence();

    return () => {
      editor.off("transaction", checkTablePresence);
      editor.off("selectionUpdate", checkTablePresence);
      window.removeEventListener("scroll", updatePopupPosition);
      window.removeEventListener("resize", updatePopupPosition);
    };
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowBorderDropdown(false);
        setShowPaddingDropdown(false);
        setShowCellColorDropdown(false);
        setShowTableDesign(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showPaddingDropdown) {
      updatePaddingValue();
    }
  }, [showPaddingDropdown, editor, editor?.state.selection]);

  if (!isVisible) return null;

  return (
    <div
      ref={popupRef}
      className="absolute bg-black text-white p-2 rounded-lg flex flex-wrap gap-2 justify-center z-[1000] shadow-lg"
      style={{ top: `${position.top}px`, left: `${position.left}px`, minWidth: "500px" }}
    >
      <div className="flex items-center space-x-2">
        <Button onClick={() => handleAction("add-row-before")} tooltip="Add Row Before">
          <TbRowInsertTop />
        </Button>
        <Button onClick={() => handleAction("add-row-after")} tooltip="Add Row After">
          <TbRowInsertBottom />
        </Button>
        <Button onClick={() => handleAction("delete-row")} tooltip="Delete Row">
          <RiDeleteRow />
        </Button>
        <div className="h-5 w-[1px] bg-white/20 mx-5" />
        <Button onClick={() => handleAction("add-col-before")} tooltip="Add Col Before">
          <TbColumnInsertLeft />
        </Button>
        <Button onClick={() => handleAction("add-col-after")} tooltip="Add Col After">
          <TbColumnInsertRight />
        </Button>
        <Button onClick={() => handleAction("delete-col")} tooltip="Delete Col">
          <RiDeleteColumn />
        </Button>
        <div className="h-5 w-[1px] bg-white/20 mx-5" />
        <Button onClick={() => handleAction("merge-cells")} tooltip="Merge Cells">
          ⊞
        </Button>
        {showSplitCell && (
          <Button onClick={() => handleAction("split-cell")} tooltip="Split Cell">
            ⊟
          </Button>
        )}
        <div className="relative">
          <Button onClick={() => setShowCellColorDropdown(!showCellColorDropdown)} tooltip="Cell Background Colors">
            <FaPalette />
          </Button>
          <DropdownWrapper isOpen={showCellColorDropdown} onClose={() => setShowCellColorDropdown(false)} className="shadow-lg">
            <ColorPickerDropdown recentlyUsedColors={recentlyUsedColors} customColor={customColor} onColorSelect={handleCellBackgroundColor} onCustomColorChange={setCustomColor} />
          </DropdownWrapper>
        </div>

        <div className="relative">
          <Button onClick={() => setShowBorderDropdown(!showBorderDropdown)} tooltip="Border Properties">
            <FaBorderAll />
          </Button>
          <DropdownWrapper isOpen={showBorderDropdown} onClose={() => setShowBorderDropdown(false)} className="shadow-lg">
            <div className="mb-4">
              <label className="block mb-2">Border Style</label>
              <select value={borderStyle} onChange={(e) => handleAction("set-border-style", e.target.value)} className="w-full p-2 bg-blue-gray-800 text-white rounded">
                {["solid", "dashed", "dotted", "double", "none"].map((style) => (
                  <option key={style} value={style} className="capitalize">
                    {style}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Border Width: {borderWidth.toFixed(0)}px</label>
              <Slider value={borderWidth.toFixed(0)} onChange={({ target: { value } }) => handleAction("set-border-width", Number(value))} color="green" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Border Color</label>
              <input type="color" value={borderColor} onChange={(e) => handleAction("set-border-color", e.target.value)} className="w-full h-10 rounded cursor-pointer outline-none border-none" />
            </div>
            <div>
              <label className="block mb-2">Border Radius: {borderRadius}px</label>
              <input
                type="number"
                min={0}
                max={50}
                value={borderRadius}
                onChange={(e) => handleAction("set-border-radius", Number(e.target.value))}
                className="w-full p-2 bg-blue-gray-800 text-white rounded"
              />
            </div>
          </DropdownWrapper>
        </div>
        <div className="relative">
          <Button onClick={() => setShowPaddingDropdown(!showPaddingDropdown)} tooltip="Padding">
            <FaSquare />
          </Button>
          <DropdownWrapper isOpen={showPaddingDropdown} onClose={() => setShowPaddingDropdown(false)} className="shadow-lg">
            <label className="block mb-2">Cell Padding: {padding.toFixed(0)}px</label>
            <Slider value={padding.toFixed(0)} onChange={({ target: { value } }) => handleAction("set-padding", Number(value))} color="green" />
          </DropdownWrapper>
        </div>

        <div className="relative">
          <Button onClick={() => setShowTableDesign(!showTableDesign)} tooltip="Table Design">
            <LuLayoutDashboard />
          </Button>
          {showTableDesign && <TableDesign onSelectDesign={(design, borderRadius) => handleAction("set-table-design", design, borderRadius)} />}
        </div>
        <button className="w-8 h-8 flex justify-center items-center rounded bg-red-500 hover:bg-red-600 hover:scale-110 transition" onClick={() => handleAction("delete-table")}>
          <MdDeleteOutline />
        </button>
      </div>
    </div>
  );
};

TableActionPopup.propTypes = {
  editor: PropTypes.shape({
    isActive: PropTypes.func.isRequired,
    chain: PropTypes.func.isRequired,
    focus: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired,
    view: PropTypes.shape({
      dom: PropTypes.instanceOf(HTMLElement),
      posAtDOM: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      state: PropTypes.shape({
        selection: PropTypes.oneOfType([PropTypes.instanceOf(CellSelection), PropTypes.object]).isRequired,
        doc: PropTypes.shape({
          descendants: PropTypes.func.isRequired,
          nodeAt: PropTypes.func.isRequired,
        }).isRequired,
        tr: PropTypes.shape({
          setNodeMarkup: PropTypes.func.isRequired,
          docChanged: PropTypes.bool.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    state: PropTypes.shape({
      selection: PropTypes.shape({
        from: PropTypes.number,
        forEachCell: PropTypes.func.isRequired,
        someCell: PropTypes.func.isRequired,
        $anchorCell: PropTypes.object,
        $headCell: PropTypes.object,
      }).isRequired,
      doc: PropTypes.shape({
        nodeAt: PropTypes.func.isRequired,
        descendants: PropTypes.func.isRequired,
      }).isRequired,
      tr: PropTypes.shape({
        setNodeMarkup: PropTypes.func.isRequired,
        docChanged: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
    addRowBefore: PropTypes.func.isRequired,
    addRowAfter: PropTypes.func.isRequired,
    addColumnBefore: PropTypes.func.isRequired,
    addColumnAfter: PropTypes.func.isRequired,
    mergeCells: PropTypes.func.isRequired,
    splitCell: PropTypes.func.isRequired,
    deleteRow: PropTypes.func.isRequired,
    deleteColumn: PropTypes.func.isRequired,
    deleteTable: PropTypes.func.isRequired,
    setCellAttribute: PropTypes.func.isRequired,
    setTableDesign: PropTypes.func.isRequired,
  }).isRequired,
};
