import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import Button from "../TollBar/Button";
import { TbGif } from "react-icons/tb";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Initialize Giphy API with your API key
const giphyFetch = new GiphyFetch("eBMWa8HxWuZBLJG97cSSFgg3g1uTSN6J");

const GifPickerComponent = ({ editor, onClose }) => {
  const pickerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchGifs = (offset) => {
    if (debouncedSearchQuery.trim()) {
      return giphyFetch.search(debouncedSearchQuery, { offset, limit: 10 });
    }
    return giphyFetch.trending({ offset, limit: 10 });
  };

  const handleGifSelect = (gif) => {
    const src = gif.images.fixed_height.url;
    editor
      .chain()
      .focus()
      .deleteSelection()
      .setGif({ src, alt: gif.title || "GIF" })
      .run();
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={pickerRef} className="absolute top-full mt-2 left-0 z-[9999] bg-gray-800 border border-white/20 rounded-lg p-2 shadow-lg w-80">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search GIFs..."
        className="w-full px-2 py-1 mb-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-green-400"
      />
      <div className="overflow-auto" style={{ maxHeight: "300px" }}>
        <Grid width={256} columns={3} fetchGifs={fetchGifs} onGifClick={handleGifSelect} noLink={true} gutter={6} key={debouncedSearchQuery} />
      </div>
      <button onClick={onClose} className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-full">
        Close
      </button>
    </div>
  );
};

const GifPicker = ({ editor }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <Button onClick={() => setShowPicker(true)} tooltip="Insert GIF">
        <TbGif />
      </Button>

      {showPicker && <GifPickerComponent editor={editor} onClose={() => setShowPicker(false)} />}
    </div>
  );
};

GifPickerComponent.propTypes = {
  editor: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

GifPicker.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default GifPicker;
