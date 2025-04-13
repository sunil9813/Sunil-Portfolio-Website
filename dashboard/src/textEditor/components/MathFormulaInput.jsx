import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import Button from "../TollBar/Button";
import { TbMathOff } from "react-icons/tb";

const MathFormulaInput = ({ editor, onClose }) => {
  const [mathInput, setMathInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (mathInput.trim()) {
      editor.commands.setMathFormula({
        formula: mathInput.trim(),
        display: false,
      });
      setMathInput("");
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="absolute w-56 top-full mt-2 left-0 z-[9999] bg-sidebarbg border border-white/20 rounded-lg p-2 shadow-lg">
      <div className="mb-2">
        <textarea
          ref={inputRef}
          rows={3}
          value={mathInput}
          onChange={(e) => setMathInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter LaTeX (e.g., x^2)"
          className="w-full px-2 py-1 bg-green-400/20 text-white border border-green-400 rounded focus:outline-none placeholder:text-green-400"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
          Insert
        </button>
        <button type="button" onClick={onClose} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
          Cancel
        </button>
      </div>
    </form>
  );
};

const MathFormulaButton = ({ editor }) => {
  const [showMathInput, setShowMathInput] = useState(false);

  return (
    <div className="relative">
      <Button onClick={() => setShowMathInput(true)} active={showMathInput} tooltip="Insert Math Formula">
        <TbMathOff />
      </Button>

      {showMathInput && <MathFormulaInput editor={editor} onClose={() => setShowMathInput(false)} />}
    </div>
  );
};

MathFormulaInput.propTypes = {
  editor: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

MathFormulaButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default MathFormulaButton;
