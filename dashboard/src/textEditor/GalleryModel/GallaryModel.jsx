/* import { useCallback, useState, useEffect } from "react";
import Gallery from "./Gallery";
import { AiOutlineCloudUpload } from "react-icons/ai";
import PropTypes from "prop-types";
import ModalContainer from "../common/ModelContainer";
import ActionButton from "../common/ActionButton";
import { Textarea } from "@material-tailwind/react";
import { FaSpinner } from "react-icons/fa"; // For loading spinner

const GallaryModel = ({ visible, onClose, onFileSelect, onSelect, images, uploading, deleting, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState(null); // Can be a File object (upload) or string (gallery selection)
  const [altText, setAltText] = useState("");

  const handleClose = useCallback(() => {
    setSelectedImage(null);
    setAltText("");
    onClose && onClose();
  }, [onClose]);

  const handleOnImageChange = ({ target }) => {
    const { files } = target;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedImage(fileArray[0]); // Set as File object for upload
      onFileSelect(fileArray);
    }
  };

  const handleSubmit = () => {
    if (!selectedImage) return handleClose();
    const src = typeof selectedImage === "string" ? selectedImage : URL.createObjectURL(selectedImage);
    onSelect({ src, altText });
    handleClose();
  };

  const handleDelete = (imageId) => {
    onDelete(imageId);
    setSelectedImage(null);
  };

  useEffect(() => {
    if (!uploading && selectedImage && typeof selectedImage !== "string") {
      // Reset only if it’s a new upload (File object), not a gallery selection (string)
      setSelectedImage(null);
      setAltText("");
    }
  }, [uploading]);

  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div className="max-w-4xl p-2 bg-blue-gray-900 rounded-xl">
        <div className="flex">
          <div className="basis-[75%] max-h-[450px] overflow-y-auto">
            <Gallery
              images={images}
              onSelect={(src) => {
                setSelectedImage(src); // Set as string for gallery selection
                setAltText(""); // Reset alt text when selecting a new image
              }}
              selectedImage={selectedImage}
              uploading={uploading}
              deleting={deleting}
              deleteImage={handleDelete}
            />
          </div>
          <div className="basis-1/4 p-2">
            <div className="space-y-4">
              <div className="bg-indigo-500 text-white rounded-xl relative">
                <input onChange={handleOnImageChange} hidden type="file" name="image-input" id="image-input" multiple disabled={uploading || deleting} />
                <label htmlFor="image-input">
                  <div
                    className={`w-full border-2 border-indigo-500 text-action flex justify-center items-center space-x-2 p-2 cursor-pointer rounded-lg ${
                      uploading || deleting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploading ? <FaSpinner className="animate-spin" size={20} /> : <AiOutlineCloudUpload size={20} />}
                    <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                  </div>
                </label>
              </div>
              {selectedImage && !uploading && !deleting ? (
                <>
                  <Textarea label="Alt text" color="indigo" value={altText} onChange={({ target }) => setAltText(target.value)} />
                  <ActionButton title="Select" onClick={handleSubmit} />
                  <div className="relative aspect-video bg-gray-50 rounded-xl">
                    <img src={typeof selectedImage === "string" ? selectedImage : URL.createObjectURL(selectedImage)} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                  </div>
                </>
              ) : uploading ? (
                <div className="text-center text-gray-400">Uploading image, please wait...</div>
              ) : deleting ? (
                <div className="text-center text-gray-400">Deleting image, please wait...</div>
              ) : (
                <div className="text-center text-gray-400">Select an image to preview</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

GallaryModel.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  onFileSelect: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  images: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      recentImages: PropTypes.array,
      olderImages: PropTypes.array,
    }),
  ]),
  uploading: PropTypes.bool,
  deleting: PropTypes.bool,
};

GallaryModel.defaultProps = {
  visible: false,
  onClose: () => {},
  uploading: false,
  deleting: false,
};

export default GallaryModel;
 */
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
        {uploading && (
          // Uploading indicator - appears in first grid position
          <div className="p-1 mb-2 aspect-square">
            <div className="relative rounded-xl overflow-hidden bg-blue-gray-800 h-full w-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <BsCardImage size={40} className="mb-2 text-indigo-400" />
                <p className="text-sm font-medium text-gray-300">Uploading...</p>
                <p className="text-xs text-gray-400 mt-1">Please wait</p>
              </div>
            </div>
          </div>
        )}

        {images?.recentImages?.map((image, index) => {
          const src = image?.filePath;
          const imageId = image?._id;
          return (
            <div key={imageId || index} className="p-1 mb-2 aspect-square">
              {deleting && selectedImage === src ? (
                // Deleting indicator - shows in the exact same spot as the image being deleted
                <div className="relative rounded-xl overflow-hidden bg-red-900/30 h-full w-full flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <GoTrash size={40} className="mb-2 text-red-400 animate-pulse" />
                    <p className="text-sm font-medium text-gray-300">Deleting...</p>
                    <p className="text-xs text-gray-400 mt-1">Please wait</p>
                  </div>
                </div>
              ) : (
                // Normal image
                <Image
                  src={src}
                  selected={selectedImage === src}
                  imageId={imageId}
                  onClick={() => onSelect(src)}
                  recentImages={true}
                  subfolder={subfolder}
                  folder={folder}
                  deleteImage={deleteImage}
                  // Pass whether this image is being deleted
                  isDeleting={deleting && selectedImage === src}
                />
              )}
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
          const imageId = image?._id;
          return (
            <div key={imageId || index} className="p-1 mb-2 aspect-square">
              {deleting && selectedImage === src ? (
                // Deleting indicator for older images
                <div className="relative rounded-xl overflow-hidden bg-red-900/30 h-full w-full flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <GoTrash size={40} className="mb-2 text-red-400 animate-pulse" />
                    <p className="text-sm font-medium text-gray-300">Deleting...</p>
                    <p className="text-xs text-gray-400 mt-1">Please wait</p>
                  </div>
                </div>
              ) : (
                <Image
                  src={src}
                  selected={selectedImage === src}
                  onClick={() => onSelect(src)}
                  // Pass whether this image is being deleted
                  isDeleting={deleting && selectedImage === src}
                />
              )}
            </div>
          );
        })}
      </Masonry>
    </div>
  );
};

Gallery.propTypes = {
  images: PropTypes.oneOfType([
    PropTypes.shape({
      recentImages: PropTypes.arrayOf(
        PropTypes.shape({
          filePath: PropTypes.string.isRequired,
          _id: PropTypes.string,
        })
      ),
      olderImages: PropTypes.arrayOf(
        PropTypes.shape({
          filePath: PropTypes.string.isRequired,
          _id: PropTypes.string,
        })
      ),
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        filePath: PropTypes.string,
        src: PropTypes.string,
        _id: PropTypes.string,
      })
    ),
  ]).isRequired,
  onSelect: PropTypes.func.isRequired,
  deleteImage: PropTypes.func,
  uploading: PropTypes.bool,
  deleting: PropTypes.bool,
  selectedImage: PropTypes.string,
  subfolder: PropTypes.string,
  folder: PropTypes.string,
};

export default Gallery;
