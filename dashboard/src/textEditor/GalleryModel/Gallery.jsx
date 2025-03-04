import PropTypes from "prop-types";
import Image from "./Image";
import { BsCardImage } from "react-icons/bs";
import Masonry from "react-masonry-css";
import { Alert } from "@material-tailwind/react";
import { FaRegImages } from "react-icons/fa";
import { GoTrash } from "react-icons/go";

const Gallery = ({ images, onSelect, uploading, deleting, selectedImage = "", subfolder, folder, deleteImage }) => {
  return (
    <div className="flex flex-wrap p-2">
      {images?.recentImages?.length > 0 && (
        <Alert icon={<FaRegImages size={20} />} className="rounded-sm p-3 mb-2 flex items-center border-l-4 border-[#2ec946] bg-[#2ec946]/10 font-medium text-[#2ec946]">
          Recent Images
        </Alert>
      )}

      <Masonry breakpointCols={3} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
        {uploading && !deleting && (
          <div className="basis-1/4 p-1 mb-2 aspect-square flex flex-col items-center justify-center bg-teal-300 text-white rounded-lg animate-pulse">
            <BsCardImage size={60} />
            <p>Uploading</p>
          </div>
        )}
        {deleting && !uploading && (
          <div className="basis-1/4 p-1 mb-2 aspect-square flex flex-col items-center justify-center bg-red-500 text-white rounded-lg animate-pulse">
            <GoTrash size={60} />
            <p>Deleting</p>
          </div>
        )}
        {images?.recentImages?.map((image, index) => {
          const src = image?.filePath;
          const imageId = image?._id;
          return (
            <div key={index}>
              <Image src={src} selected={selectedImage === src} imageId={imageId} onClick={() => onSelect(src)} recentImages={true} subfolder={subfolder} folder={folder} deleteImage={deleteImage} />
            </div>
          );
        })}
      </Masonry>
      {images?.olderImages?.length > 0 && (
        <Alert icon={<FaRegImages size={20} />} className="rounded-sm p-3 mb-2 flex items-center border-l-4 border-[#2ec946] bg-[#2ec946]/10 font-medium text-[#2ec946]">
          Old Images
        </Alert>
      )}
      <Masonry breakpointCols={3} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
        {images?.olderImages?.map((image, index) => {
          const src = image?.filePath;
          return (
            <div key={index}>
              <Image src={src} selected={selectedImage === src} onClick={() => onSelect(src)} />
            </div>
          );
        })}
      </Masonry>
    </div>
  );
};

Gallery.propTypes = {
  images: PropTypes.shape({
    recentImages: PropTypes.arrayOf(
      PropTypes.shape({
        filePath: PropTypes.string.isRequired,
      })
    ).isRequired,
    olderImages: PropTypes.arrayOf(
      PropTypes.shape({
        filePath: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  deleteImage: PropTypes.func,
  uploading: PropTypes.bool,
  deleting: PropTypes.bool, // New prop for delete loading
  selectedImage: PropTypes.string,
  subfolder: PropTypes.string,
  folder: PropTypes.string,
};

export default Gallery;
