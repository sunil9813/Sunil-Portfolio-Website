import PropTypes from "prop-types";
import CheckMark from "../common/CheckMark";
import { MdDelete } from "react-icons/md";
import { useState } from "react";

const Image = ({ src, selected, onClick, recentImages, deleteImage, imageId }) => {
  const [hovered, setHovered] = useState(false);

  if (!src) return null;

  return (
    <div
      className={`group/image relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border bg-black/25 transition-all duration-300 hover:-translate-y-0.5 ${
        selected
          ? "border-emerald-300/40 shadow-[0_0_0_1px_rgba(52,211,153,0.16),0_14px_32px_rgba(16,185,129,0.12)]"
          : "border-white/[0.05] hover:border-white/[0.1] hover:shadow-[0_14px_32px_rgba(0,0,0,0.35)]"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <img src={src} alt="Gallery item" className="h-full w-full object-cover transition-transform duration-500 group-hover/image:scale-105" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/[0.04] opacity-70" />

      {recentImages && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            deleteImage(imageId);
          }}
          className={`absolute right-2 top-2 flex size-8 items-center justify-center rounded-lg border border-red-300/[0.12] bg-black/55 text-red-200/70 backdrop-blur-xl transition-all duration-300 hover:bg-red-500/15 hover:text-red-100 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <MdDelete size={16} />
        </button>
      )}

      <div className="absolute left-2 top-2">
        <CheckMark visible={selected || false} />
      </div>
    </div>
  );
};

Image.propTypes = {
  src: PropTypes.string,
  selected: PropTypes.bool,
  recentImages: PropTypes.bool,
  imageId: PropTypes.any,
  onClick: PropTypes.func,
  deleteImage: PropTypes.func,
};

Image.defaultProps = {
  src: "",
  selected: false,
  recentImages: false,
  onClick: () => {},
  deleteImage: () => {},
};

export default Image;
