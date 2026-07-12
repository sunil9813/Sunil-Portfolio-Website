import PropTypes from "prop-types";
import Image from "./Image";
import { BsCardImage } from "react-icons/bs";
import { FaRegImages } from "react-icons/fa";
import { GoTrash } from "react-icons/go";

const getImageSrc = (image) => image?.filePath || image?.url || image?.src || "";

const SectionTitle = ({ icon, title }) => (
  <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-300/[0.08] bg-emerald-300/[0.035] px-3 py-2 text-xs font-bold text-emerald-100/75">
    {icon}
    {title}
  </div>
);

const LoadingCard = ({ type }) => (
  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.018]">
    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.08] via-white/[0.025] to-transparent" />

    <div className="relative flex h-full flex-col items-center justify-center gap-2 text-white/35">
      {type === "delete" ? <GoTrash size={28} /> : <BsCardImage size={30} />}

      <span className="text-[10px] font-bold">{type === "delete" ? "Deleting..." : "Uploading..."}</span>
    </div>
  </div>
);

const Gallery = ({ images = { recentImages: [], olderImages: [] }, uploadPreviews = [], onSelect, uploading, deleting, selectedImage = "", deleteImage }) => {
  const recentImages = Array.isArray(images?.recentImages) ? images.recentImages : [];

  const olderImages = Array.isArray(images?.olderImages) ? images.olderImages : [];

  const previews = Array.isArray(uploadPreviews) ? uploadPreviews : [];

  const hasContent = previews.length > 0 || recentImages.length > 0 || olderImages.length > 0;

  return (
    <div className="p-3">
      {!hasContent && !uploading && !deleting && (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-white/[0.06] bg-black/10 text-center">
          <p className="text-xs font-semibold text-white/30">No images uploaded yet.</p>
        </div>
      )}

      {(previews.length > 0 || recentImages.length > 0 || uploading || deleting) && (
        <div className="mb-5">
          <SectionTitle icon={<FaRegImages size={15} />} title="Recent Images" />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {previews.map((preview) => (
              <div key={preview.id} className="relative">
                <Image src={preview.previewUrl} selected={false} onClick={() => {}} />

                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/45 backdrop-blur-[1px]">
                  <span className="rounded-full border border-white/[0.08] bg-black/50 px-3 py-1 text-[10px] font-bold text-white/70">Uploading...</span>
                </div>
              </div>
            ))}

            {uploading && previews.length === 0 && <LoadingCard />}
            {deleting && <LoadingCard type="delete" />}

            {recentImages.map((image) => {
              const src = getImageSrc(image);
              const imageId = image?._id || image?.id;

              return <Image key={imageId || src} src={src} selected={selectedImage === src} imageId={imageId} onClick={() => onSelect(src)} recentImages deleteImage={deleteImage} />;
            })}
          </div>
        </div>
      )}

      {olderImages.length > 0 && (
        <div>
          <SectionTitle icon={<FaRegImages size={15} />} title="Older Images" />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {olderImages.map((image) => {
              const src = getImageSrc(image);

              return <Image key={image?._id || image?.id || src} src={src} selected={selectedImage === src} onClick={() => onSelect(src)} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

SectionTitle.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

LoadingCard.propTypes = {
  type: PropTypes.string,
};

LoadingCard.defaultProps = {
  type: "upload",
};

Gallery.propTypes = {
  images: PropTypes.shape({
    recentImages: PropTypes.array,
    olderImages: PropTypes.array,
  }),
  uploadPreviews: PropTypes.array,
  onSelect: PropTypes.func.isRequired,
  deleteImage: PropTypes.func,
  uploading: PropTypes.bool,
  deleting: PropTypes.bool,
  selectedImage: PropTypes.string,
};

Gallery.defaultProps = {
  images: {
    recentImages: [],
    olderImages: [],
  },
  uploadPreviews: [],
  uploading: false,
  deleting: false,
  selectedImage: "",
  deleteImage: () => {},
};

export default Gallery;
