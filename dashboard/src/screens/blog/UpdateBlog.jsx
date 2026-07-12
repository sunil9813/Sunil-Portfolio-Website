import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TagsInput from "react-tagsinput";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";

import Editor from "@/textEditor/Editor";
import { Input, Loader, StickyHeaderComponent, UseMouseMoveEffect, Wrapper } from "@/routes";
import { CommonClassForInput } from "@/utils";
import { CategoryDropDown } from "@/components/common/DropDown";
import { TextareaInput } from "@/components/customeUI/Input";
import { getallBlog, getBlogPrivate, selectBlog, updateBlog } from "@/redux/slices/blogSlice";

import "react-tagsinput/react-tagsinput.css";

const initialState = {
  title: "",
  metaDescription: "",
  category: null,
  groupId: "",
  tags: [],
};

export const UpdateBlog = () => {
  UseMouseMoveEffect("inputcards");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { isLoading } = useSelector((state) => state.blog);
  const blogEdit = useSelector(selectBlog);

  const thumbnailInputRef = useRef(null);

  const [blog, setBlog] = useState(initialState);
  const [blogImages, setBlogImages] = useState(null);
  const [imagePreviews, setImagePreviews] = useState("");
  const [description, setDescription] = useState("");

  const [tagError, setTagError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [metaDescError, setMetaDescError] = useState("");

  const { title, category, metaDescription, tags, groupId } = blog;

  useEffect(() => {
    if (slug) {
      dispatch(getBlogPrivate(slug));
    }
  }, [slug, dispatch]);

  useEffect(() => {
    if (!blogEdit) {
      return;
    }

    setBlog({
      title: blogEdit.title || "",
      groupId: blogEdit.groupId || "",
      metaDescription: blogEdit.metaDescription || "",
      visibility: blogEdit.visibility || "",
      category: blogEdit.category || null,
      tags: blogEdit.tags ? blogEdit.tags.map((tag) => tag.tag) : [],
    });

    setDescription(blogEdit.description || "");
    setImagePreviews(blogEdit.cover?.filePath || "");
  }, [blogEdit]);

  useEffect(() => {
    return () => {
      if (imagePreviews?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviews);
      }
    };
  }, [imagePreviews]);

  const isImageValid = useCallback((file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];

    return allowedFormats.includes(file?.type);
  }, []);

  const handleThumbnailChange = useCallback(
    (selectedFile) => {
      if (!selectedFile || !isImageValid(selectedFile)) {
        toast.error("Please select a valid PNG, JPEG, or JPG image.");
        return;
      }

      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("Thumbnail file size exceeds the 2MB limit.");
        return;
      }

      setImagePreviews((currentPreview) => {
        if (currentPreview?.startsWith("blob:")) {
          URL.revokeObjectURL(currentPreview);
        }

        return URL.createObjectURL(selectedFile);
      });

      setBlogImages(selectedFile);
    },
    [isImageValid],
  );

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      handleThumbnailChange(selectedFile);
    }

    event.target.value = "";
  };

  const handleDropThumbnail = useCallback(
    (event) => {
      event.preventDefault();

      const selectedFile = event.dataTransfer.files?.[0];

      if (selectedFile) {
        handleThumbnailChange(selectedFile);
      }
    },
    [handleThumbnailChange],
  );

  const handleRemoveThumbnail = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (imagePreviews?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviews);
    }

    setBlogImages(null);
    setImagePreviews("");
  };

  const handleTagChange = (newTags) => {
    const cleanedTags = newTags.map((tag) => tag.trim()).filter(Boolean);

    const totalLength = cleanedTags.join("").length;

    if (totalLength > 500) {
      setTagError("Tags exceed the maximum length of 500 characters.");
      return;
    }

    const normalizedTags = cleanedTags.map((tag) => tag.toLowerCase());

    const hasDuplicate = normalizedTags.some((tag, index) => normalizedTags.indexOf(tag) !== index);

    if (hasDuplicate) {
      setTagError("Tags cannot be duplicates.");
      return;
    }

    setTagError("");

    setBlog((previousBlog) => ({
      ...previousBlog,
      tags: cleanedTags,
    }));
  };

  const handleTitleChange = (event) => {
    const value = event.target.value;

    if (value.length > 250) {
      setTitleError("Title cannot exceed 250 characters.");
      return;
    }

    setTitleError("");

    setBlog((previousBlog) => ({
      ...previousBlog,
      title: value,
    }));
  };

  const handleMetaDescriptionChange = (event) => {
    const value = event.target.value;

    if (value.length > 160) {
      setMetaDescError("Meta description cannot exceed 160 characters.");
      return;
    }

    setMetaDescError("");

    setBlog((previousBlog) => ({
      ...previousBlog,
      metaDescription: value,
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setBlog((previousBlog) => ({
      ...previousBlog,
      category: selectedOption,
    }));
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      setTitleError("Blog title is required.");
      toast.error("Please enter a blog title.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("description", description || "");
    formData.append("metaDescription", metaDescription.trim());

    if (blogImages) {
      formData.append("cover", blogImages);
    }

    if (tags.length > 0) {
      const formattedTags = tags.map((tag) => ({
        tag,
      }));

      formData.append("tags", JSON.stringify(formattedTags));
    }

    if (category) {
      formData.append("category", category?._id || category);
    }

    try {
      await dispatch(
        updateBlog({
          slug,
          formData,
        }),
      ).unwrap();

      await dispatch(getallBlog()).unwrap();

      setImagePreviews("");
      setBlogImages(null);

      toast.success("Blog updated successfully.");
      navigate("/all-blog");
    } catch (error) {
      toast.error(error?.message || `Failed to update blog: ${error}`);
    }
  };

  if (isLoading || !blogEdit) {
    return <Loader />;
  }

  return (
    <>
      <StickyHeaderComponent title="Update Blog" path="/all-blog" btntext="Update now" handleFunction={handleUpdate} />

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        {/* Blog information */}
        <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
          {/* Wrapper background remains unchanged */}

          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/[0.016] blur-[90px] transition-all duration-700 group-hover:bg-indigo-500/[0.026]" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-cyan-500/[0.012] blur-[90px] transition-all duration-700 group-hover:bg-cyan-500/[0.022]" />

          <div className="relative z-10 space-y-5">
            {/* Title */}
            <div className="relative">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="title" className="text-[11px] font-semibold text-gray-700 dark:text-white/70">
                  Blog title
                </label>

                <span className={`text-[9px] font-medium tabular-nums ${title.length >= 240 ? "text-rose-600 dark:text-rose-200/75" : "text-gray-400 dark:text-white/25"}`}>{title.length}/250</span>
              </div>

              <Input type="text" name="title" value={title} handleChange={handleTitleChange} placeholder="Enter your blog title" />

              {titleError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{titleError}</p>}
            </div>

            {/* Tags */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold text-gray-700 dark:text-white/70">Tags</span>

                <span className="text-[9px] text-gray-400 dark:text-white/25">{tags.join("").length}/500</span>
              </div>

              <div className="rounded-2xl border border-gray-200/80 bg-gray-50/65 p-1 transition-all focus-within:border-indigo-400/35 focus-within:ring-4 focus-within:ring-indigo-500/[0.04] dark:border-white/[0.055] dark:bg-white/[0.022] dark:focus-within:border-indigo-300/[0.13]">
                <TagsInput
                  className={`${CommonClassForInput} !border-0 !bg-transparent !p-1.5 [&_.react-tagsinput-input]:!m-0 [&_.react-tagsinput-input]:!h-8 [&_.react-tagsinput-input]:!bg-transparent [&_.react-tagsinput-input]:!text-[11px] [&_.react-tagsinput-input]:!text-gray-700 dark:[&_.react-tagsinput-input]:!text-white/65 [&_.react-tagsinput-input]:!outline-none [&_.react-tagsinput-tag]:!mb-1 [&_.react-tagsinput-tag]:!mr-1.5 [&_.react-tagsinput-tag]:!inline-flex [&_.react-tagsinput-tag]:!items-center [&_.react-tagsinput-tag]:!rounded-full [&_.react-tagsinput-tag]:!border [&_.react-tagsinput-tag]:!border-indigo-300/25 [&_.react-tagsinput-tag]:!bg-indigo-500/[0.07] [&_.react-tagsinput-tag]:!px-2.5 [&_.react-tagsinput-tag]:!py-1 [&_.react-tagsinput-tag]:!text-[9px] [&_.react-tagsinput-tag]:!text-indigo-700 dark:[&_.react-tagsinput-tag]:!border-indigo-300/[0.10] dark:[&_.react-tagsinput-tag]:!bg-indigo-300/[0.045] dark:[&_.react-tagsinput-tag]:!text-indigo-200/70`}
                  value={tags}
                  onChange={handleTagChange}
                  inputProps={{
                    placeholder: "Add a tag",
                  }}
                />
              </div>

              {tagError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{tagError}</p>}
            </div>

            {/* Category */}
            <div>
              <span className="mb-2 block text-[11px] font-semibold text-gray-700 dark:text-white/70">Category</span>

              <div className="rounded-2xl border border-gray-200/80 bg-gray-50/45 p-1 dark:border-white/[0.05] dark:bg-white/[0.016]">
                <CategoryDropDown type="blog" value={category} onChange={handleCategoryChange} />
              </div>
            </div>

            {/* Meta description */}
            <div className="relative">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="metaDescription" className="text-[11px] font-semibold text-gray-700 dark:text-white/70">
                  Meta description
                </label>

                <span className={`text-[9px] font-medium tabular-nums ${metaDescription.length >= 150 ? "text-rose-600 dark:text-rose-200/75" : "text-gray-400 dark:text-white/25"}`}>
                  {metaDescription.length}/160
                </span>
              </div>

              <TextareaInput
                type="textarea"
                name="metaDescription"
                className={`${CommonClassForInput} min-h-[130px]`}
                value={metaDescription}
                handleChange={handleMetaDescriptionChange}
                placeholder="Enter a concise description for search engines"
              />

              {metaDescError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{metaDescError}</p>}
            </div>
          </div>
        </Wrapper>

        {/* Thumbnail */}
        <Wrapper className="group relative h-full overflow-hidden p-5 sm:p-6">
          {/* Wrapper background remains unchanged */}

          <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-violet-500/[0.016] blur-[80px] transition-all duration-700 group-hover:bg-violet-500/[0.026]" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[11px] font-semibold text-gray-700 dark:text-white/70">Thumbnail image</h3>

                <p className="mt-1 text-[9px] text-gray-400 dark:text-white/25">Recommended landscape image</p>
              </div>

              <span className="rounded-full border border-gray-200/70 bg-gray-50/60 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
                Max 2MB
              </span>
            </div>

            <div
              onDrop={handleDropThumbnail}
              onDragOver={(event) => event.preventDefault()}
              className="relative flex h-[390px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/60 transition-all duration-300 hover:border-indigo-400/40 hover:bg-indigo-500/[0.025] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-indigo-300/[0.15] dark:hover:bg-indigo-300/[0.025]"
            >
              {imagePreviews ? (
                <div className="relative h-full w-full">
                  <img src={imagePreviews} alt="Thumbnail preview" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

                  <div className="absolute bottom-3 left-3 rounded-lg border border-white/[0.12] bg-black/45 px-2.5 py-1.5 text-[9px] font-medium text-white/90 backdrop-blur-xl">
                    Thumbnail preview
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    title="Remove thumbnail"
                    aria-label="Remove thumbnail image"
                    className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/80 text-white shadow-[0_8px_20px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-all hover:scale-105 hover:bg-rose-500"
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex max-w-[260px] flex-col items-center justify-center px-5 text-center">
                  <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-600 shadow-[0_10px_26px_rgba(79,70,229,0.10)] dark:border-indigo-300/[0.10] dark:bg-indigo-300/[0.045] dark:text-indigo-200/70">
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] to-transparent" />

                    <IoCameraSharp className="relative z-10" size={25} />
                  </div>

                  <p className="mt-4 text-[11px] font-medium text-gray-600 dark:text-white/50">Drag and drop an image here</p>

                  <p className="mt-1.5 text-[9px] leading-5 text-gray-400 dark:text-white/25">
                    or{" "}
                    <button
                      type="button"
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-200/70 dark:hover:text-indigo-200/90"
                    >
                      click to browse
                    </button>
                  </p>

                  <p className="mt-3 rounded-full border border-gray-200/70 bg-white/60 px-3 py-1 text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/25">
                    PNG, JPG or JPEG
                  </p>
                </div>
              )}

              <input ref={thumbnailInputRef} id="thumbnail" type="file" name="cover" className="hidden" onChange={handleFileInputChange} accept="image/png,image/jpeg,image/jpg" />
            </div>

            {blogEdit?.cover?.filePath && !imagePreviews && (
              <p className="mt-3 rounded-xl border border-amber-300/20 bg-amber-500/[0.05] px-3 py-2 text-[9px] leading-5 text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.035] dark:text-amber-200/65">
                The existing thumbnail preview has been removed. Upload another image before updating to replace it.
              </p>
            )}
          </div>
        </Wrapper>
      </section>

      {/* Blog editor */}
      <div className="mt-3 pb-5">
        <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
          {/* Wrapper background remains unchanged */}

          <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-teal-500/[0.014] blur-[95px] transition-all duration-700 group-hover:bg-teal-500/[0.024]" />

          <div className="relative z-10">
            <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
              <h3 className="text-[12px] font-semibold text-gray-800 dark:text-white/90">Blog content</h3>

              <p className="mt-1 text-[9px] text-gray-400 dark:text-white/25">Edit the main content and formatting of your blog post</p>
            </div>

            <div className="min-h-[400px] w-full rounded-2xl border border-gray-200/70 bg-gray-50/35 p-2 text-xs text-gray-700 dark:border-white/[0.045] dark:bg-white/[0.014] dark:text-white/65">
              <Editor key={slug} customId={groupId} value={description || ""} onChange={setDescription} folderName="blog/description" folder="blog" subfolder="description" />
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};
