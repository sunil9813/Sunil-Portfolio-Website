import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle2, FileImage, FolderPen, ImagePlus, Info, UploadCloud, X } from "lucide-react";

import { getallCategory, getCategory, updateCategory } from "@/redux/slices/resources/categorySlice";

import { Input, InputLabel, InputTitle, Loader, StickyHeaderComponent, Wrapper } from "@/routes";

import { TypeDropdown } from "@/components/common/dropdown/CustomeDropDown";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

export const UpdateCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { id: categoryId } = useParams();

  const { category, isLoading } = useSelector((state) => state.category);

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");

  const existingCover = category?.cover?.filePath || null;
  const hasPreview = Boolean(previewImage);
  const hasNewImage = Boolean(image);

  useEffect(() => {
    if (categoryId) {
      dispatch(getCategory(categoryId));
    }
  }, [dispatch, categoryId]);

  useEffect(() => {
    if (!category) {
      return;
    }

    setTitle(category.title || "");
    setType(category.type || "");
    setPreviewImage(category.cover?.filePath || null);
    setImage(null);
  }, [category]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;

    if (newTitle.toLowerCase().includes("modal")) {
      toast.error("Modal can't be your category name. Please choose another name.");
      return;
    }

    setTitle(newTitle);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const isImageValid = (file) => {
    return ALLOWED_IMAGE_FORMATS.includes(file.type);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!isImageValid(selectedFile)) {
      toast.error("Cover must be a PNG, JPEG, or JPG image.");
      resetFileInput();
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("Cover file size exceeds the 10MB limit.");
      resetFileInput();
      return;
    }

    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    setImage(selectedFile);
    setPreviewImage(objectUrl);
  };

  const handleRemovePreview = (event) => {
    event.stopPropagation();

    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    setImage(null);
    setPreviewImage(null);
    resetFileInput();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || !type) {
      toast.error("Please fill all input fields.");
      return;
    }

    const formData = new FormData();

    formData.append("title", trimmedTitle);
    formData.append("type", type);

    if (image) {
      formData.append("cover", image);
    }

    const resultAction = await dispatch(
      updateCategory({
        formData,
        id: categoryId,
      }),
    );

    if (updateCategory.fulfilled.match(resultAction)) {
      toast.success("Category updated successfully!");

      await dispatch(getallCategory());
      navigate("/all-category");
      return;
    }

    toast.error(resultAction.payload || "Failed to update category. Please try again.");
  };

  return (
    <>
      <StickyHeaderComponent title="Update Category" path="/all-category" btntext="Update Category" handleFunction={handleSubmit} />

      {isLoading && <Loader />}

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Category details */}
        <div className="lg:col-span-8">
          <Wrapper className="group relative h-full overflow-hidden p-5 sm:p-6">
            {/* Wrapper background remains unchanged */}
            <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-indigo-500/[0.016] blur-[85px] transition-all duration-700 group-hover:bg-indigo-500/[0.024]" />

            <div className="pointer-events-none absolute -bottom-24 -right-24 size-64 rounded-full bg-cyan-500/[0.014] blur-[85px] transition-all duration-700 group-hover:bg-cyan-500/[0.022]" />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.014),transparent_32%,transparent_74%,rgba(255,255,255,0.003))]" />

            <div className="relative z-10">
              {/* Section header */}
              <div className="mb-6 flex items-center gap-3 border-b border-gray-200/80 pb-4 dark:border-white/[0.055]">
                <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-indigo-300/[0.10] bg-[linear-gradient(145deg,rgba(70,64,130,0.52),rgba(42,39,75,0.90))] text-indigo-100/80 shadow-[0_8px_22px_rgba(0,0,0,0.20)]">
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),transparent_48%)]" />

                  <FolderPen className="relative z-10" size={18} strokeWidth={1.9} />
                </div>

                <div className="min-w-0">
                  <InputTitle className="mb-0">Category Details</InputTitle>

                  <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/28">Update the category name and content type.</p>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <InputLabel>Category Name</InputLabel>

                    <span className="text-[9px] tabular-nums text-gray-400 dark:text-white/22">{title.length} characters</span>
                  </div>

                  <div className="relative">
                    <Input type="text" name="title" value={title} handleChange={handleTitleChange} placeholder="Enter category name" />
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[9px] text-gray-400 dark:text-white/23">
                    <Info size={10} strokeWidth={2} />

                    <span>Use a clear and recognisable category name.</span>
                  </div>
                </div>

                <div>
                  <InputLabel className="mb-2">Category Type</InputLabel>

                  <TypeDropdown value={type} onChange={handleTypeChange} name="type" />

                  <div className="mt-2 flex items-center gap-1.5 text-[9px] text-gray-400 dark:text-white/23">
                    <Info size={10} strokeWidth={2} />

                    <span>Select the content classification for this category.</span>
                  </div>
                </div>
              </div>

              {/* Form status */}
              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-gray-200/70 bg-gray-50/55 p-3 dark:border-white/[0.045] dark:bg-white/[0.018] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-300/[0.10] bg-emerald-300/[0.045] text-emerald-700 dark:text-emerald-200/65">
                    <CheckCircle2 size={15} strokeWidth={1.9} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-gray-700 dark:text-white/55">Category information</p>

                    <p className="mt-0.5 text-[8px] text-gray-400 dark:text-white/22">Review your changes before updating.</p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full border px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.07em] ${
                    title.trim() && type
                      ? "border-emerald-300/[0.10] bg-emerald-300/[0.045] text-emerald-700 dark:text-emerald-200/65"
                      : "border-amber-300/[0.10] bg-amber-300/[0.045] text-amber-700 dark:text-amber-200/65"
                  }`}
                >
                  {title.trim() && type ? "Ready to update" : "Information required"}
                </span>
              </div>
            </div>
          </Wrapper>
        </div>

        {/* Cover image */}
        <div className="lg:col-span-4">
          <Wrapper className="group relative h-full overflow-hidden p-5 sm:p-6">
            {/* Wrapper background remains unchanged */}
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-violet-500/[0.016] blur-[85px] transition-all duration-700 group-hover:bg-violet-500/[0.024]" />

            <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-amber-500/[0.012] blur-[85px] transition-all duration-700 group-hover:bg-amber-500/[0.020]" />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.014),transparent_32%,transparent_74%,rgba(255,255,255,0.003))]" />

            <div className="relative z-10">
              {/* Section header */}
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-200/80 pb-4 dark:border-white/[0.055]">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-300/[0.10] bg-[linear-gradient(145deg,rgba(78,66,132,0.52),rgba(43,38,75,0.90))] text-violet-100/80 shadow-[0_8px_22px_rgba(0,0,0,0.20)]">
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),transparent_48%)]" />

                    <FileImage className="relative z-10" size={18} strokeWidth={1.9} />
                  </div>

                  <div className="min-w-0">
                    <InputTitle className="mb-0">Cover Image</InputTitle>

                    <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/28">PNG, JPG or JPEG</p>
                  </div>
                </div>

                {hasNewImage && (
                  <span className="shrink-0 rounded-full border border-emerald-300/[0.10] bg-emerald-300/[0.045] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.07em] text-emerald-700 dark:text-emerald-200/65">
                    New image
                  </span>
                )}
              </div>

              {/* Upload area */}
              <div
                role="button"
                tabIndex={0}
                onClick={openFilePicker}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openFilePicker();
                  }
                }}
                className="group/upload relative flex min-h-[280px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50/45 transition-all duration-300 hover:border-violet-400/40 hover:bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-violet-400/10 dark:border-white/[0.08] dark:bg-white/[0.016] dark:hover:border-violet-300/[0.16] dark:hover:bg-white/[0.026]"
              >
                {hasPreview ? (
                  <>
                    <img src={previewImage} alt="Category cover preview" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/upload:scale-[1.025]" />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/15" />

                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />

                    {/* Image state */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                      <div className="min-w-0 rounded-xl border border-white/[0.09] bg-black/45 px-3 py-2 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                          <ImagePlus className="shrink-0 text-white/65" size={13} strokeWidth={1.9} />

                          <span className="truncate text-[10px] font-semibold text-white/80">{hasNewImage ? image?.name : "Current category cover"}</span>
                        </div>

                        <p className="mt-0.5 text-[8px] text-white/40">Click anywhere to replace this image</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemovePreview}
                      title="Remove cover preview"
                      aria-label="Remove cover preview"
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-white/[0.10] bg-black/55 text-white/70 shadow-[0_8px_20px_rgba(0,0,0,0.30)] backdrop-blur-md transition-all hover:border-rose-300/25 hover:bg-rose-500/75 hover:text-white"
                    >
                      <X size={14} strokeWidth={2.2} />
                    </button>
                  </>
                ) : (
                  <div className="relative z-10 flex max-w-[260px] flex-col items-center px-5 text-center">
                    <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-violet-300/[0.10] bg-violet-300/[0.045] text-violet-700 shadow-[0_10px_28px_rgba(0,0,0,0.10)] dark:text-violet-200/65 dark:shadow-[0_10px_28px_rgba(0,0,0,0.20)]">
                      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),transparent_48%)]" />

                      <UploadCloud className="relative z-10" size={23} strokeWidth={1.7} />
                    </div>

                    <p className="mt-4 text-[12px] font-semibold text-gray-800 dark:text-white/68">Choose a cover image</p>

                    <p className="mt-1.5 text-[10px] leading-4 text-gray-500 dark:text-white/28">Click to browse your files and select a category cover.</p>

                    <span className="mt-4 rounded-full border border-violet-300/[0.11] bg-violet-300/[0.045] px-3 py-1.5 text-[9px] font-semibold text-violet-700 transition-colors group-hover/upload:border-violet-300/[0.18] group-hover/upload:bg-violet-300/[0.07] dark:text-violet-200/65">
                      Browse image
                    </span>
                  </div>
                )}

                <input ref={fileInputRef} id="cover-input" type="file" name="cover" className="hidden" onChange={handleImageChange} accept="image/png,image/jpeg,image/jpg" />
              </div>

              {/* Upload information */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-gray-200/70 bg-gray-50/50 px-3 py-2.5 dark:border-white/[0.045] dark:bg-white/[0.016]">
                  <span className="block text-[8px] font-medium uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">File format</span>

                  <span className="mt-1 block text-[10px] font-semibold text-gray-700 dark:text-white/48">PNG, JPG, JPEG</span>
                </div>

                <div className="rounded-xl border border-gray-200/70 bg-gray-50/50 px-3 py-2.5 dark:border-white/[0.045] dark:bg-white/[0.016]">
                  <span className="block text-[8px] font-medium uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">Maximum size</span>

                  <span className="mt-1 block text-[10px] font-semibold text-gray-700 dark:text-white/48">10 MB</span>
                </div>
              </div>

              {existingCover && !previewImage && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300/[0.10] bg-amber-300/[0.035] p-3 text-amber-800 dark:text-amber-200/60">
                  <Info className="mt-0.5 shrink-0" size={13} strokeWidth={2} />

                  <p className="text-[9px] leading-4">The existing server image will remain unless you select and upload a new cover.</p>
                </div>
              )}
            </div>
          </Wrapper>
        </div>
      </section>
    </>
  );
};
