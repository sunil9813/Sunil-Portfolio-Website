import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle2, FileImage, FolderPlus, ImageOff, Info, Layers3, ListTree, UploadCloud, UserRound, X } from "lucide-react";

import { createCategory, getallCategory } from "@/redux/slices/resources/categorySlice";

import { Input, InputLabel, InputTitle, Loader, StickyHeaderComponent, UseMouseMoveEffect, Wrapper } from "@/routes";

import { TypeDropdown } from "@/components/common/dropdown/CustomeDropDown";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

/* ==========================================================================
   CATEGORY LIST CARD
   ========================================================================== */

const CategoryListCard = ({ category }) => {
  const [imageError, setImageError] = useState(false);

  const categoryImage = category?.cover?.filePath;
  const categoryTitle = category?.title || "Untitled category";
  const categoryOwner = category?.user?.name || category?.createdBy?.name || "Unknown user";

  const categoryType = category?.type || "Category";

  const postCount = category?.posts?.length ?? category?.postCount ?? category?.totalPosts ?? 0;

  return (
    <article className="group/card relative min-w-0 overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-50/55 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300/30 hover:bg-white/80 hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:hover:border-indigo-300/[0.13] dark:hover:bg-white/[0.032] dark:hover:shadow-[0_16px_38px_rgba(0,0,0,0.24)]">
      {/* Restrained lighting */}
      <div className="pointer-events-none absolute -bottom-16 -right-14 size-36 rounded-full bg-indigo-500/[0.025] opacity-60 blur-[58px] transition-all duration-700 group-hover/card:scale-110 group-hover/card:opacity-90" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.022),transparent_38%,transparent_76%,rgba(255,255,255,0.003))]" />

      <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent" />

      <div className="relative z-10 flex min-w-0 items-center gap-3">
        {/* Cover */}
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-gray-200/80 bg-gray-100 dark:border-white/[0.07] dark:bg-white/[0.025]">
          {categoryImage && !imageError ? (
            <img src={categoryImage} alt={categoryTitle} onError={() => setImageError(true)} className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-white/25">
              <ImageOff size={18} strokeWidth={1.7} />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.05]" />
        </div>

        {/* Information */}
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-[12px] font-semibold capitalize tracking-[-0.01em] text-gray-900 dark:text-white/82">{categoryTitle}</h4>

          <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[9px] text-gray-500 dark:text-white/27">
            <UserRound size={9} strokeWidth={2} />

            <span className="truncate capitalize">{categoryOwner}</span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-indigo-300/[0.10] bg-indigo-300/[0.04] px-2 py-1 text-[8px] font-semibold capitalize text-indigo-700 dark:text-indigo-200/60">
              <Layers3 size={8} strokeWidth={2} />

              <span className="truncate">{categoryType}</span>
            </span>
          </div>
        </div>

        {/* Post count */}
        <div className="shrink-0 text-right">
          <span className="block text-[8px] font-medium uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">Posts</span>

          <span className="mt-1 inline-flex min-w-8 items-center justify-center rounded-full border border-gray-200 bg-white/65 px-2 py-1 text-[10px] font-bold tabular-nums text-gray-700 dark:border-white/[0.055] dark:bg-white/[0.025] dark:text-white/55">
            {postCount}
          </span>
        </div>
      </div>
    </article>
  );
};

CategoryListCard.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    postCount: PropTypes.number,
    totalPosts: PropTypes.number,
    posts: PropTypes.array,
    cover: PropTypes.shape({
      filePath: PropTypes.string,
    }),
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
    createdBy: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
};

/* ==========================================================================
   CATEGORY LIST
   ========================================================================== */

export const ListItemCategory = () => {
  const dispatch = useDispatch();

  const { categorys } = useSelector((state) => state.category);

  const categoryList = Array.isArray(categorys) ? categorys : categorys?.categoryList || [];

  useEffect(() => {
    dispatch(getallCategory());
  }, [dispatch]);

  if (categoryList.length === 0) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/40 px-5 text-center dark:border-white/[0.07] dark:bg-white/[0.012]">
        <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-indigo-300/[0.10] bg-indigo-300/[0.04] text-indigo-700 dark:text-indigo-200/55">
          <ListTree size={23} strokeWidth={1.7} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-gray-800 dark:text-white/65">No categories found</h3>

        <p className="mt-1.5 max-w-sm text-[10px] leading-5 text-gray-500 dark:text-white/27">Create your first category using the form above. It will appear in this list after it has been saved.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {categoryList.map((category) => (
        <CategoryListCard key={category?._id || category?.title} category={category} />
      ))}
    </div>
  );
};

/* ==========================================================================
   ADD CATEGORY
   ========================================================================== */

export const AddCategory = () => {
  UseMouseMoveEffect("inputcards");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const coverInputRef = useRef(null);

  const { isLoading } = useSelector((state) => state?.category);

  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [parent, setParent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const isFormComplete = Boolean(title.trim() && type && cover);

  const resetFileInput = () => {
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    coverInputRef.current?.click();
  };

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

  const processCoverFile = useCallback((selectedFile) => {
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

    const previewUrl = URL.createObjectURL(selectedFile);

    setCover(selectedFile);
    setCoverPreview(previewUrl);
  }, []);

  const handleCoverChange = (event) => {
    const selectedFile = event.target.files?.[0];
    processCoverFile(selectedFile);
  };

  const handleDropCover = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragging(false);

      const selectedFile = event.dataTransfer.files?.[0];

      processCoverFile(selectedFile);
    },
    [processCoverFile],
  );

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveCover = (event) => {
    event.stopPropagation();

    setCover(null);
    setCoverPreview(null);
    resetFileInput();
  };

  const handleCreate = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle || !cover || !type) {
      toast.error("Please fill all input fields.");
      return;
    }

    const formData = new FormData();

    formData.append("title", trimmedTitle);
    formData.append("cover", cover);
    formData.append("type", type);

    if (parent?._id) {
      formData.append("parent", parent._id);
    }

    const resultAction = await dispatch(createCategory(formData));

    if (createCategory.fulfilled.match(resultAction)) {
      toast.success("Category created successfully!");

      setTitle("");
      setCover(null);
      setCoverPreview(null);
      setType("");
      setParent(null);
      resetFileInput();

      navigate("/all-category");
      return;
    }

    toast.error(resultAction.payload || "Failed to create category. Please try again.");
  };

  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  return (
    <>
      <StickyHeaderComponent title="New Category" path="/all-category" btntext="Add Category" handleFunction={handleCreate} />

      {isLoading && <Loader />}

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Category details */}
        <div className="lg:col-span-8">
          <Wrapper className="inputcards group relative h-full overflow-hidden p-5 sm:p-6">
            {/* Wrapper background remains unchanged */}
            <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-indigo-500/[0.016] blur-[85px] transition-all duration-700 group-hover:bg-indigo-500/[0.024]" />

            <div className="pointer-events-none absolute -bottom-24 -right-24 size-64 rounded-full bg-cyan-500/[0.014] blur-[85px] transition-all duration-700 group-hover:bg-cyan-500/[0.022]" />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.014),transparent_32%,transparent_74%,rgba(255,255,255,0.003))]" />

            <div className="relative z-10">
              {/* Heading */}
              <div className="mb-6 flex items-center gap-3 border-b border-gray-200/80 pb-4 dark:border-white/[0.055]">
                <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-indigo-300/[0.10] bg-[linear-gradient(145deg,rgba(70,64,130,0.52),rgba(42,39,75,0.90))] text-indigo-100/80 shadow-[0_8px_22px_rgba(0,0,0,0.20)]">
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),transparent_48%)]" />

                  <FolderPlus className="relative z-10" size={18} strokeWidth={1.9} />
                </div>

                <div className="min-w-0">
                  <InputTitle className="mb-0">Category Details</InputTitle>

                  <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/28">Enter the basic information for your category.</p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <InputLabel>Category Name</InputLabel>

                    <span className="text-[9px] tabular-nums text-gray-400 dark:text-white/22">{title.length} characters</span>
                  </div>

                  <Input type="text" name="title" value={title} handleChange={handleTitleChange} placeholder="Enter category name" />

                  <div className="mt-2 flex items-center gap-1.5 text-[9px] text-gray-400 dark:text-white/23">
                    <Info size={10} strokeWidth={2} />
                    Use a clear and recognisable category name.
                  </div>
                </div>

                <div>
                  <InputLabel className="mb-2">Category Type</InputLabel>

                  <TypeDropdown value={type} onChange={handleTypeChange} name="type" />

                  <div className="mt-2 flex items-center gap-1.5 text-[9px] text-gray-400 dark:text-white/23">
                    <Info size={10} strokeWidth={2} />
                    Select the content classification for this category.
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-gray-200/70 bg-gray-50/50 p-3 dark:border-white/[0.045] dark:bg-white/[0.016] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${
                      isFormComplete
                        ? "border-emerald-300/[0.10] bg-emerald-300/[0.045] text-emerald-700 dark:text-emerald-200/65"
                        : "border-amber-300/[0.10] bg-amber-300/[0.045] text-amber-700 dark:text-amber-200/65"
                    }`}
                  >
                    <CheckCircle2 size={15} strokeWidth={1.9} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-gray-700 dark:text-white/55">Category information</p>

                    <p className="mt-0.5 text-[8px] text-gray-400 dark:text-white/22">Complete all required fields before saving.</p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full border px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.07em] ${
                    isFormComplete
                      ? "border-emerald-300/[0.10] bg-emerald-300/[0.045] text-emerald-700 dark:text-emerald-200/65"
                      : "border-amber-300/[0.10] bg-amber-300/[0.045] text-amber-700 dark:text-amber-200/65"
                  }`}
                >
                  {isFormComplete ? "Ready to create" : "Information required"}
                </span>
              </div>
            </div>
          </Wrapper>
        </div>

        {/* Cover image */}
        <div className="lg:col-span-4">
          <Wrapper className="inputcards group relative h-full overflow-hidden p-5 sm:p-6">
            {/* Wrapper background remains unchanged */}
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-violet-500/[0.016] blur-[85px] transition-all duration-700 group-hover:bg-violet-500/[0.024]" />

            <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-amber-500/[0.012] blur-[85px] transition-all duration-700 group-hover:bg-amber-500/[0.02]" />

            <div className="relative z-10">
              {/* Heading */}
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-200/80 pb-4 dark:border-white/[0.055]">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-300/[0.10] bg-[linear-gradient(145deg,rgba(78,66,132,0.52),rgba(43,38,75,0.90))] text-violet-100/80 shadow-[0_8px_22px_rgba(0,0,0,0.20)]">
                    <FileImage className="relative z-10" size={18} strokeWidth={1.9} />
                  </div>

                  <div className="min-w-0">
                    <InputTitle className="mb-0">Cover Image</InputTitle>

                    <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/28">PNG, JPG or JPEG</p>
                  </div>
                </div>

                {cover && (
                  <span className="rounded-full border border-emerald-300/[0.10] bg-emerald-300/[0.045] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.07em] text-emerald-700 dark:text-emerald-200/65">
                    Selected
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
                onDrop={handleDropCover}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`group/upload relative flex min-h-[280px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400/10 ${
                  isDragging
                    ? "border-violet-400/50 bg-violet-500/[0.06] dark:border-violet-300/[0.22] dark:bg-violet-400/[0.055]"
                    : "border-gray-300 bg-gray-50/45 hover:border-violet-400/40 hover:bg-gray-50/80 dark:border-white/[0.08] dark:bg-white/[0.016] dark:hover:border-violet-300/[0.16] dark:hover:bg-white/[0.026]"
                }`}
              >
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Category cover preview" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/upload:scale-[1.025]" />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/15" />

                    <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/[0.09] bg-black/45 px-3 py-2 backdrop-blur-md">
                      <p className="truncate text-[10px] font-semibold text-white/80">{cover?.name}</p>

                      <p className="mt-0.5 text-[8px] text-white/40">Click or drop another image to replace</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      title="Remove cover"
                      aria-label="Remove cover image"
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-white/[0.10] bg-black/55 text-white/70 shadow-[0_8px_20px_rgba(0,0,0,0.30)] backdrop-blur-md transition-all hover:border-rose-300/25 hover:bg-rose-500/75 hover:text-white"
                    >
                      <X size={14} strokeWidth={2.2} />
                    </button>
                  </>
                ) : (
                  <div className="relative z-10 flex max-w-[270px] flex-col items-center px-5 text-center">
                    <div className="relative flex size-14 items-center justify-center rounded-2xl border border-violet-300/[0.10] bg-violet-300/[0.045] text-violet-700 dark:text-violet-200/65">
                      <UploadCloud size={23} strokeWidth={1.7} />
                    </div>

                    <p className="mt-4 text-[12px] font-semibold text-gray-800 dark:text-white/68">Upload a cover image</p>

                    <p className="mt-1.5 text-[10px] leading-4 text-gray-500 dark:text-white/28">Drag and drop an image here or click to browse your files.</p>

                    <span className="mt-4 rounded-full border border-violet-300/[0.11] bg-violet-300/[0.045] px-3 py-1.5 text-[9px] font-semibold text-violet-700 dark:text-violet-200/65">
                      Browse image
                    </span>
                  </div>
                )}

                <input ref={coverInputRef} id="cover" type="file" name="cover" className="hidden" onChange={handleCoverChange} accept="image/png,image/jpeg,image/jpg" />
              </div>

              {/* File rules */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-gray-200/70 bg-gray-50/50 px-3 py-2.5 dark:border-white/[0.045] dark:bg-white/[0.016]">
                  <span className="block text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">Formats</span>

                  <span className="mt-1 block text-[10px] font-semibold text-gray-700 dark:text-white/48">PNG, JPG, JPEG</span>
                </div>

                <div className="rounded-xl border border-gray-200/70 bg-gray-50/50 px-3 py-2.5 dark:border-white/[0.045] dark:bg-white/[0.016]">
                  <span className="block text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">Maximum</span>

                  <span className="mt-1 block text-[10px] font-semibold text-gray-700 dark:text-white/48">10 MB</span>
                </div>
              </div>
            </div>
          </Wrapper>
        </div>
      </section>

      {/* Existing category list */}
      <Wrapper className="group relative my-5 overflow-hidden p-5 sm:p-6">
        {/* Wrapper background remains unchanged */}
        <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-indigo-500/[0.016] blur-[85px]" />

        <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-cyan-500/[0.012] blur-[85px]" />

        <div className="relative z-10">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-200/80 pb-4 dark:border-white/[0.055]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-300/[0.10] bg-[linear-gradient(145deg,rgba(70,64,130,0.52),rgba(42,39,75,0.90))] text-indigo-100/80">
                <ListTree size={18} strokeWidth={1.9} />
              </div>

              <div className="min-w-0">
                <InputTitle className="mb-0">Category Lists</InputTitle>

                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/28">Recently created and available categories</p>
              </div>
            </div>

            <span className="rounded-full border border-indigo-300/[0.10] bg-indigo-300/[0.04] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-indigo-700 dark:text-indigo-200/60">
              All categories
            </span>
          </div>

          <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
            <ListItemCategory />
          </div>
        </div>
      </Wrapper>
    </>
  );
};
