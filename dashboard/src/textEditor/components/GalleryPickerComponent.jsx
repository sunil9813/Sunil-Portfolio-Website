import PropTypes from "prop-types";
import { useState } from "react";
import { DropdownWrapper } from "../common/DropdownWrapper";
import Button from "../TollBar/Button";
import { LuLayoutGrid } from "react-icons/lu";

const GalleryPickerComponent = ({ editor, onClose }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [layout, setLayout] = useState("masonry");
  const [columns, setColumns] = useState("4");
  const [spacing, setSpacing] = useState("8px");
  const [radius, setRadius] = useState("4px");
  const [height, setHeight] = useState("auto");
  const [numBoxes, setNumBoxes] = useState("6");

  const handleInsertGallery = () => {
    if (!editor) {
      console.error("Editor instance is not available");
      return;
    }
    const parsedColumns = parseInt(columns, 10) || 4;
    const parsedNumBoxes = parseInt(numBoxes, 10) || 6;
    const validHeight = height.trim() || "auto";

    if (parsedNumBoxes < 1) {
      console.error("Number of boxes must be at least 1");
      return;
    }

    // Create array of GalleryBox nodes
    const boxes = Array(parsedNumBoxes)
      .fill()
      .map(() => ({
        type: "galleryBox",
        attrs: { src: "", alt: "" },
      }));

    try {
      // Store GalleryLayout attributes in editor storage
      editor.storage.galleryLayout = {
        layout,
        columns: parsedColumns,
        spacing,
        radius,
        height: validHeight,
      };

      editor
        .chain()
        .focus()
        .setGalleryLayout({
          layout,
          columns: parsedColumns,
          spacing,
          radius,
          height: validHeight,
          boxes,
        })
        .run();
      setIsDropdownOpen(false);
      onClose();
    } catch (error) {
      console.error("Failed to insert gallery layout:", error);
    }
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <Button onClick={handleToggleDropdown} tooltip="Insert Gallery">
        <LuLayoutGrid />
      </Button>
      <DropdownWrapper
        isOpen={isDropdownOpen}
        onClose={() => {
          setIsDropdownOpen(false);
          onClose();
        }}
        className="w-64 p-4"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-1">Layout Type</label>
          <select value={layout} onChange={(e) => setLayout(e.target.value)} className="w-full border border-gray-300 p-2 rounded bg-gray-800 text-white">
            <option value="masonry">Masonry</option>
            <option value="flex">Flex</option>
            <option value="grid">Grid</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-1">Total Number of Boxes</label>
          <input type="text" value={numBoxes} onChange={(e) => setNumBoxes(e.target.value)} placeholder="e.g., 6" className="w-full border border-gray-300 p-2 rounded bg-gray-800 text-white" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-1">Boxes per Row</label>
          <input type="text" value={columns} onChange={(e) => setColumns(e.target.value)} placeholder="e.g., 4" className="w-full border border-gray-300 p-2 rounded bg-gray-800 text-white" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-1">Spacing</label>
          <select value={spacing} onChange={(e) => setSpacing(e.target.value)} className="w-full border border-gray-300 p-2 rounded bg-gray-800 text-white">
            <option value="0px">0px</option>
            <option value="4px">4px</option>
            <option value="8px">8px</option>
            <option value="16px">16px</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-1">Border Radius</label>
          <select value={radius} onChange={(e) => setRadius(e.target.value)} className="w-full border border-gray-300 p-2 rounded bg-gray-800 text-white">
            <option value="0px">0px</option>
            <option value="4px">4px</option>
            <option value="8px">8px</option>
            <option value="16px">16px</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-1">Height (Grid/Flex only)</label>
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g., 200px or auto"
            className="w-full border border-gray-300 p-2 rounded bg-gray-800 text-white"
            disabled={layout === "masonry"}
          />
        </div>
        <button onClick={handleInsertGallery} className="w-full px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2">
          Insert Gallery
        </button>
        <button
          onClick={() => {
            setIsDropdownOpen(false);
            onClose();
          }}
          className="w-full px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </DropdownWrapper>
    </div>
  );
};

GalleryPickerComponent.propTypes = {
  editor: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GalleryPickerComponent;
