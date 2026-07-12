import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

import Gallery from "./Gallery";
import ModalContainer from "../common/ModelContainer";

const GallaryModel = ({ visible, onClose, onFileSelect, onSelect, images, uploading, deleting, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [altText, setAltText] = useState("");
  const [uploadPreviews, setUploadPreviews] = useState([]);
  const uploadPreviewUrlsRef = useRef([]);

  const clearUploadPreviews = useCallback(() => {
    uploadPreviewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    uploadPreviewUrlsRef.current = [];
    setUploadPreviews([]);
  }, []);

  const handleOnImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const previews = files.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      uploadPreviewUrlsRef.current.push(previewUrl);

      return {
        id: `${file.name}-${file.lastModified}-${previewUrl}`,
        previewUrl,
        name: file.name,
      };
    });

    setUploadPreviews((previous) => [...previews, ...previous]);
    onFileSelect(files);
    event.target.value = "";
  };

  useEffect(() => {
    if (!uploading && uploadPreviews.length > 0) {
      const timer = setTimeout(() => {
        clearUploadPreviews();
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [uploading, uploadPreviews.length, clearUploadPreviews]);

  useEffect(() => {
    if (!visible) clearUploadPreviews();

    return () => clearUploadPreviews();
  }, [visible, clearUploadPreviews]);

  const handleClose = useCallback(() => {
    setSelectedImage("");
    setAltText("");
    onClose?.();
  }, [onClose]);

  const handleSubmit = () => {
    if (!selectedImage) return;

    onSelect({
      src: selectedImage,
      altText,
    });

    handleClose();
  };

  const handleDelete = (imageId) => {
    if (!imageId) return;

    onDelete?.(imageId);
    setSelectedImage("");
  };

  useEffect(() => {
    if (!visible) {
      setSelectedImage("");
      setAltText("");
    }
  }, [visible]);

  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div
        className="
          w-[min(1020px,calc(100vw-32px))]
          max-h-[88vh]
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.05]
          bg-dark-surface2
          shadow-dropDownDark
        "
      >
        <div
          className="
            relative
            overflow-hidden
            rounded-xl
            border
            border-white/[0.04]
            bg-white/[0.018]
          "
        >
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-emerald-400/[0.045] blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 size-40 rounded-full bg-indigo-400/[0.035] blur-3xl" />

          <div className="relative flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <div>
              <h3 className="text-sm font-bold text-white/80">Image gallery</h3>
              <p className="mt-0.5 text-[11px] font-medium text-white/35">Upload or select an image for this editor.</p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="
                group/close
                flex
                size-8
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.05]
                bg-white/[0.014]
                text-white/35
                transition-all
                duration-300
                hover:border-red-300/[0.08]
                hover:bg-red-300/[0.025]
                hover:text-red-200/70
              "
            >
              <IoCloseOutline size={18} />
            </button>
          </div>

          <div className="relative grid max-h-[calc(88vh-74px)] gap-3 overflow-hidden p-4 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div
              className="
                min-h-[320px]
                overflow-hidden
                rounded-xl
                border
                border-white/[0.05]
                bg-black/20
              "
            >
              <div className="max-h-[62vh] overflow-y-auto scroll-bar-none">
                <Gallery
                  images={images || { recentImages: [], olderImages: [] }}
                  uploadPreviews={uploadPreviews}
                  onSelect={setSelectedImage}
                  selectedImage={selectedImage}
                  uploading={uploading}
                  deleting={deleting}
                  deleteImage={handleDelete}
                />
              </div>
            </div>

            <aside
              className="
                flex
                min-h-[320px]
                flex-col
                gap-3
                rounded-xl
                border
                border-white/[0.05]
                bg-white/[0.018]
                p-3
              "
            >
              <input
                id="editor-image-input"
                type="file"
                name="image"
                hidden
                multiple
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleOnImageChange}
                disabled={uploading || deleting}
              />

              <label
                htmlFor="editor-image-input"
                className={`
                  flex
                  h-11
                  w-full
                  cursor-pointer
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/[0.055]
                  bg-dark-highlight
                  text-xs
                  font-semibold
                  text-white/55
                  shadow-[0_8px_24px_rgba(0,0,0,0.16)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-white/[0.1]
                  hover:bg-white/[0.026]
                  hover:text-white/75
                  ${uploading || deleting ? "pointer-events-none cursor-not-allowed opacity-45" : ""}
                `}
              >
                {uploading ? <FaSpinner className="animate-spin" size={16} /> : <AiOutlineCloudUpload size={18} />}

                <span>{uploading ? "Uploading..." : "Upload Image"}</span>
              </label>

              {selectedImage ? (
                <>
                  <label className="space-y-2">
                    <span className="text-[10px] font-semibold text-white/35">Alt text</span>

                    <textarea
                      value={altText}
                      onChange={(event) => setAltText(event.target.value)}
                      placeholder="Describe this image..."
                      rows={3}
                      className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-white/[0.05]
                        bg-black/20
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-white/70
                        outline-none
                        transition
                        placeholder:text-white/20
                        focus:border-emerald-300/[0.16]
                        focus:bg-black/25
                      "
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={uploading || deleting}
                    className="
                      flex
                      h-10
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-emerald-300/[0.14]
                      bg-emerald-300/[0.035]
                      text-[11px]
                      font-bold
                      text-emerald-100/80
                      shadow-[0_8px_24px_rgba(16,185,129,0.08)]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-emerald-300/[0.055]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Select Image
                  </button>

                  <div className="overflow-hidden rounded-xl border border-white/[0.05] bg-black/25">
                    <div className="aspect-video">
                      <img src={selectedImage} alt="Preview" className="h-full w-full object-contain" />
                    </div>
                  </div>
                </>
              ) : uploading ? (
                <p className="mt-3 text-center text-xs font-medium text-white/35">Uploading image, please wait...</p>
              ) : deleting ? (
                <p className="mt-3 text-center text-xs font-medium text-white/35">Deleting image, please wait...</p>
              ) : (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/[0.06] bg-black/10 px-4 text-center">
                  <p className="text-xs font-medium text-white/30">Select an image to preview.</p>
                </div>
              )}
            </aside>
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
  onDelete: () => {},
  images: {
    recentImages: [],
    olderImages: [],
  },
  uploading: false,
  deleting: false,
};

export default GallaryModel;
