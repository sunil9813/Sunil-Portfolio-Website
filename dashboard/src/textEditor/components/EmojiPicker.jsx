import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { TbMoodSmile } from "react-icons/tb";
import Picker from "emoji-picker-react";
import Button from "../TollBar/Button";

const EmojiPickerComponent = ({ editor, onClose }) => {
  const pickerRef = useRef(null); // Ref to track the picker container

  const onEmojiClick = (emojiObject) => {
    editor.chain().focus().deleteSelection().setEmoji({ emoji: emojiObject.emoji }).run();
    console.log("Editor HTML after emoji insertion:", editor.getHTML());
    onClose();
  };

  // Handle clicks outside the picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose(); // Close the picker if click is outside
      }
    };

    // Add event listener when picker is open
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener when component unmounts or picker closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={pickerRef} className="absolute top-full mt-2 left-0 z-[9999] bg-sidebarbg border border-white/20 rounded-lg p-2 shadow-lg">
      <Picker onEmojiClick={onEmojiClick} theme="dark" />
      <button onClick={onClose} className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-full">
        Close
      </button>
    </div>
  );
};

const EmojiPicker = ({ editor }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <Button onClick={() => setShowPicker(true)} tooltip="Insert Emoji">
        <TbMoodSmile />
      </Button>

      {showPicker && <EmojiPickerComponent editor={editor} onClose={() => setShowPicker(false)} />}
    </div>
  );
};

EmojiPickerComponent.propTypes = {
  editor: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

EmojiPicker.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default EmojiPicker;
