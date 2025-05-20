import PropTypes from "prop-types";

const designs = [
  { name: "default", borderRadius: "0px" },
  { name: "minimal", borderRadius: "0px" },
  { name: "modern", borderRadius: "8px" },
  { name: "striped", borderRadius: "4px" },
  { name: "grid", borderRadius: "0px" },
  { name: "borderless", borderRadius: "0px" },
  { name: "professional", borderRadius: "6px" },
  { name: "vibrant", borderRadius: "10px" },
  { name: "compact", borderRadius: "2px" },
  { name: "elegant", borderRadius: "10px" },
  { name: "retro", borderRadius: "5px" },
  { name: "clean", borderRadius: "0px" },
  { name: "gradient", borderRadius: "8px" },
  { name: "shadowed", borderRadius: "4px" },
  { name: "rounded-cells", borderRadius: "0px" },
];

export const TableDesign = ({ onSelectDesign }) => {
  return (
    <div className="absolute top-10 left-0 bg-blue-gray-900 rounded-xl p-4 z-50 w-72">
      <h3 className="text-white mb-2">Select Table Design</h3>
      <div className="grid grid-cols-2 gap-2">
        {designs.map((design) => (
          <button key={design.name} onClick={() => onSelectDesign(design.name, design.borderRadius)} className="capitalize bg-blue-gray-800 text-white rounded px-2 py-1 hover:bg-blue-gray-700">
            {design.name}
          </button>
        ))}
      </div>
    </div>
  );
};

TableDesign.propTypes = {
  onSelectDesign: PropTypes.func.isRequired,
};
