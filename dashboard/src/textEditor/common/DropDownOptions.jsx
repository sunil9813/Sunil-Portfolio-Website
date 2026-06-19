import { useState } from "react";
import PropTypes from "prop-types";
import { List, ListItem, Tooltip } from "@material-tailwind/react";

export const NoSpaceDropDownOptions = ({ options, head, width }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      <button onBlur={() => setShowOptions(false)} onMouseDown={() => setShowOptions(!showOptions)} className="relative">
        {head}
        {showOptions && (
          <div className={`dropdown-editor ${width} overflow-hidden absolute top-full mt-4 z-[999999] border-[1px] border-white/20 bg-sidebarbg rounded-lg`}>
            <List className="p-0 w-full">
              {options.map(({ label, onClick }, index) => (
                <ListItem key={index} onMouseDown={onClick} className="group w-full rounded-none py-1.5 px-3 text-sm font-normal text-textcolor hover:bg-blue-gray-600/20 hover:text-white">
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

export const DropDownOptions = ({ options, head }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      <button onBlur={() => setShowOptions(false)} onMouseDown={() => setShowOptions(!showOptions)} className="relative">
        {head}
        {showOptions && (
          <div className="dropdown-editor min-w-max absolute top-full mt-4 z-[999999] border-[1px] border-white/20 bg-sidebarbg rounded-lg">
            <List className="p-0">
              {options.map(({ label, onClick }, index) => (
                <ListItem key={index} onMouseDown={onClick} className="px-3 py-2 rounded-none text-textcolor hover:bg-blue-gray-600/20 hover:text-white">
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

export const DropDownForFont = ({ options, head }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      <button onBlur={() => setShowOptions(false)} onMouseDown={() => setShowOptions(!showOptions)} className="relative">
        {head}
        {showOptions && (
          <div className="dropdown-editor scroll-bar-none absolute top-full mt-4 z-[99999999] border-[1px] border-white/20 bg-sidebarbg rounded-lg h-80 overflow-y-scroll">
            <List className="p-0 rounded-none">
              {options.map(({ label, onClick }, index) => (
                <ListItem key={index} onMouseDown={onClick} className="px-3 py-1.5 rounded-none text-textcolor hover:bg-blue-gray-600/20 hover:text-white">
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

export const DropDownOptionsWithIcon = ({ options, head, customClasses = "" }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative">
      <Tooltip
        content="Text Alignment"
        placement="top"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 10 },
        }}
        className="bg-black text-white px-3 py-2 text-xs shadow-xl rounded-none"
      >
        <button onBlur={() => setShowOptions(false)} onMouseDown={() => setShowOptions(!showOptions)} className="relative">
          {head}
        </button>
      </Tooltip>

      {/* Dropdown content */}
      {showOptions && (
        <div className={`dropdown-editor absolute top-full mt-4 z-[999999] border border-white/20 bg-sidebarbg rounded-lg p-2 ${customClasses}`}>
          <div className="flex items-center gap-2">
            {options.map(({ onClick, icon, active, tooltip }, index) => (
              <Tooltip
                key={index}
                content={tooltip}
                placement="top"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 10 },
                }}
                className="bg-black text-white px-3 py-2 text-xs shadow-xl rounded-none"
              >
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onClick();
                    setShowOptions(false);
                  }}
                  className={`w-8 h-8 flex justify-center items-center rounded text-lg text-textcolor hover:bg-blue-gray-600/20 hover:text-white transition-colors ${
                    active ? "bg-blue-gray-600/20" : ""
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

NoSpaceDropDownOptions.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.any,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  head: PropTypes.node.isRequired,
  width: PropTypes.any,
};
DropDownOptions.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  head: PropTypes.node.isRequired,
};
DropDownOptionsWithIcon.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  head: PropTypes.node.isRequired,
  customClasses: PropTypes.any,
};

DropDownForFont.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  head: PropTypes.node.isRequired,
};
