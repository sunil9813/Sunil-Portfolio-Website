import PropTypes from "prop-types";
import CheckMark from "../common/CheckMark";
import { IconButton } from "@material-tailwind/react";
import { MdDelete } from "react-icons/md";
import { useState } from "react";

const Image = ({ src, selected, onClick, recentImages, deleteImage, imageId }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative rounded-xl overflow-hidden cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <img src={src} onClick={onClick} alt="overflow" className="bg-white hover:scale-110 transition-transform object-cover rounded-xl" />

      {/* Icons - Only visible on hover */}
      {recentImages && (
        <div className={`icons flex items-center gap-2 absolute top-0 right-0 m-2 transition-opacity duration-300 ${hovered ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <IconButton onClick={() => deleteImage(imageId)} color="red" size="sm" className="rounded-full">
            <MdDelete size={20} />
          </IconButton>
        </div>
      )}

      {/* Checkmark */}
      <div className="absolute top-2 left-2 rounded-full text-white">
        <CheckMark visible={selected || false} />
      </div>
    </div>
  );
};

// PropTypes for type checking
Image.propTypes = {
  src: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  recentImages: PropTypes.bool,
  imageId: PropTypes.any,
  folder: PropTypes.string,
  subfolder: PropTypes.string,
  onClick: PropTypes.func,
  deleteImage: PropTypes.func,
};

// Default props
Image.defaultProps = {
  selected: false,
  onClick: () => {},
};
export default Image;
