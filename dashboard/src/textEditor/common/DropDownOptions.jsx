import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { List, ListItem } from "@material-tailwind/react";

export const DropDownOptions = ({ options, head }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      <button onBlur={() => setShowOptions(false)} onMouseDown={() => setShowOptions(!showOptions)} className="relative">
        {head}
        {showOptions && (
          <div className="dropdown-editor min-w-max absolute top-full mt-4 z-[999999] border-[1px] border-white/20 bg-sidebarbg rounded-lg">
            <List>
              {options.map(({ label, onClick }, index) => (
                <ListItem key={index} onMouseDown={onClick} className="text-textcolor hover:bg-blue-gray-600/20 hover:text-white">
                  {label}
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </button>
    </>
  );
};

export const DropDownHighLight = ({ options, head }) => {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          setShowOptions((prev) => !prev);
        }}
        className="relative"
      >
        {head}
      </button>

      {showOptions && (
        <div className="dropdown-editor min-w-max absolute top-0 mt-8 z-[999999] border border-white/20 bg-sidebarbg rounded-lg flex flex-wrap p-2 gap-2">
          {options.map(({ label, color, onClick, component }, index) => (
            <div
              key={index}
              className="flex items-center"
              onMouseDown={(e) => e.stopPropagation()} // Prevent immediate close
            >
              {component ? (
                component // Custom component (e.g., color input)
              ) : (
                <button
                  title={label}
                  className="w-6 h-6 rounded-sm bg-gray-500"
                  style={{ background: color }}
                  onClick={() => {
                    if (onClick) onClick();
                    setShowOptions(false); // Close after selecting a color
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const DropDownForFont = ({ options, head }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      <button onBlur={() => setShowOptions(false)} onMouseDown={() => setShowOptions(!showOptions)} className="relative">
        {head}
        {showOptions && (
          <div className="dropdown-editor scroll-bar-none min-w-max absolute top-full mt-4 z-[99999999] border-[1px] border-white/20 bg-sidebarbg rounded-lg h-80 overflow-y-scroll">
            <List>
              {options.map(({ label, onClick }, index) => (
                <ListItem key={index} onMouseDown={onClick} className="text-textcolor hover:bg-blue-gray-600/20 hover:text-white">
                  {label}
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </button>
    </>
  );
};

DropDownOptions.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  head: PropTypes.node.isRequired,
};
DropDownHighLight.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  head: PropTypes.node.isRequired,
};
DropDownForFont.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  head: PropTypes.node.isRequired,
};
