import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TagsInput from "react-tagsinput";
import { v4 as uuidv4 } from "uuid";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import axios from "axios";

import Editor from "@/textEditor/Editor";
import { createBlog, getallBlog } from "@/redux/slices/blogSlice";
import { Input, Loader, StickyHeaderComponent, UseMouseMoveEffect, Wrapper } from "@/routes";
import { CommonClassForInput } from "@/utils";
import { CategoryDropDown } from "@/components/common/DropDown";
import { VisibilityDropdown } from "@/components/common/dropdown/CustomeDropDown";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";

import "react-tagsinput/react-tagsinput.css";

const initialState = {
  title: "",
  metaDescription: "",
  visibility: "",
  category: null,
  tags: [],
  seoTitle: "",
  canonicalUrl: "",
  ogImage: "",
  keywords: [],
  relatedPosts: [],
};

export const CreateBlog = () => {
  UseMouseMoveEffect("inputcards");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const thumbnailInputRef = useRef(null);

  const [blog, setBlog] = useState(initialState);
  const [blogImages, setBlogImages] = useState(null);
  const [imagePreviews, setImagePreviews] = useState("");
  const [description, setDescription] = useState("");
  const [groupId] = useState(() => uuidv4());
  const [availableBlogs, setAvailableBlogs] = useState([]);

  const [tagError, setTagError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [metaDescError, setMetaDescError] = useState("");

  const { title, category, metaDescription, visibility, tags, seoTitle, canonicalUrl, ogImage, keywords, relatedPosts } = blog;

  const { isLoading } = useSelector((state) => state.blog);

  useEffect(() => {
    axios
      .get(`${REACT_APP_BACKEND_URL}/blog/all`)
      .then((response) => setAvailableBlogs(response.data?.BlogList || []))
      .catch(() => setAvailableBlogs([]));
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviews?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviews);
      }
    };
  }, [imagePreviews]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setBlog((previousBlog) => ({
      ...previousBlog,
      [name]: value,
    }));
  };

  const handleKeywordChange = (newKeywords) => {
    setBlog((previousBlog) => ({
      ...previousBlog,
      keywords: newKeywords.map((keyword) => keyword.trim()).filter(Boolean),
    }));
  };

  const handleRelatedPostToggle = (postId) => {
    setBlog((previousBlog) => {
      const isSelected = previousBlog.relatedPosts.includes(postId);
      return {
        ...previousBlog,
        relatedPosts: isSelected ? previousBlog.relatedPosts.filter((id) => id !== postId) : [...previousBlog.relatedPosts, postId].slice(0, 6),
      };
    });
  };

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

  const handleCreate = async () => {
    if (!title.trim()) {
      setTitleError("Blog title is required.");
      toast.error("Please enter a blog title.");
      return;
    }

    if (!blogImages) {
      toast.error("Please upload a thumbnail image.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("description", description || "");
    formData.append("metaDescription", metaDescription.trim());
    formData.append("groupId", groupId);
    formData.append("cover", blogImages);
    formData.append("visibility", visibility);
    formData.append("seoTitle", seoTitle.trim());
    formData.append("canonicalUrl", canonicalUrl.trim());
    formData.append("ogImage", ogImage.trim());
    formData.append("keywords", JSON.stringify(keywords));
    formData.append("relatedPosts", JSON.stringify(relatedPosts));

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
      await dispatch(createBlog(formData)).unwrap();
      await dispatch(getallBlog()).unwrap();

      if (imagePreviews?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviews);
      }

      setImagePreviews("");
      setBlogImages(null);

      toast.success("Blog created successfully.");
      navigate("/all-blog");
    } catch (error) {
      toast.error(error?.message || `Failed to create blog: ${error}`);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <StickyHeaderComponent title="Create Blog" path="/all-blog" btntext="Create now" handleFunction={handleCreate} />

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        {/* Blog information */}
        <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
          {/* Wrapper background remains unchanged */}

          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/[0.016] blur-[90px] transition-all duration-700 group-hover:bg-indigo-500/[0.026]" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-cyan-500/[0.012] blur-[90px] transition-all duration-700 group-hover:bg-cyan-500/[0.022]" />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.012),transparent_35%,transparent_75%,rgba(255,255,255,0.003))]" />

          <div className="relative z-10 space-y-5">
            {/* Title */}
            <div>
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
                  className={`${CommonClassForInput} !border-0 !bg-transparent !p-1.5 [&_.react-tagsinput-input]:!m-0 [&_.react-tagsinput-input]:!h-8 [&_.react-tagsinput-input]:!bg-transparent [&_.react-tagsinput-input]:!text-[11px] [&_.react-tagsinput-input]:!text-gray-700 [&_.react-tagsinput-input]:!outline-none dark:[&_.react-tagsinput-input]:!text-white/65 [&_.react-tagsinput-tag]:!mb-1 [&_.react-tagsinput-tag]:!mr-1.5 [&_.react-tagsinput-tag]:!inline-flex [&_.react-tagsinput-tag]:!items-center [&_.react-tagsinput-tag]:!rounded-full [&_.react-tagsinput-tag]:!border [&_.react-tagsinput-tag]:!border-indigo-300/25 [&_.react-tagsinput-tag]:!bg-indigo-500/[0.07] [&_.react-tagsinput-tag]:!px-2.5 [&_.react-tagsinput-tag]:!py-1 [&_.react-tagsinput-tag]:!text-[9px] [&_.react-tagsinput-tag]:!text-indigo-700 dark:[&_.react-tagsinput-tag]:!border-indigo-300/[0.10] dark:[&_.react-tagsinput-tag]:!bg-indigo-300/[0.045] dark:[&_.react-tagsinput-tag]:!text-indigo-200/70`}
                  value={tags}
                  onChange={handleTagChange}
                  inputProps={{
                    placeholder: "Add a tag",
                  }}
                />
              </div>

              {tagError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{tagError}</p>}
            </div>

            {/* Category and visibility */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <span className="mb-2 block text-[11px] font-semibold text-gray-700 dark:text-white/70">Category</span>

                <div className="rounded-2xl border border-gray-200/80 bg-gray-50/45 p-1 dark:border-white/[0.05] dark:bg-white/[0.016]">
                  <CategoryDropDown type="blog" value={category} onChange={handleCategoryChange} placeholder="Select category" />
                </div>
              </div>

              <div>
                <span className="mb-2 block text-[11px] font-semibold text-gray-700 dark:text-white/70">Visibility</span>

                <div className="rounded-2xl border border-gray-200/80 bg-gray-50/45 p-1 dark:border-white/[0.05] dark:bg-white/[0.016]">
                  <VisibilityDropdown value={visibility} onChange={handleInputChange} name="visibility" />
                </div>
              </div>
            </div>

            {/* Meta description */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="metaDescription" className="text-[11px] font-semibold text-gray-700 dark:text-white/70">
                  Meta description
                </label>

                <span className={`text-[9px] font-medium tabular-nums ${metaDescription.length >= 150 ? "text-rose-600 dark:text-rose-200/75" : "text-gray-400 dark:text-white/25"}`}>
                  {metaDescription.length}/160
                </span>
              </div>

              <Input type="text" name="metaDescription" value={metaDescription} handleChange={handleMetaDescriptionChange} placeholder="Enter meta description for SEO" />

              {metaDescError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{metaDescError}</p>}
            </div>

            <BlogSeoAndRelatedFields
              seoTitle={seoTitle}
              canonicalUrl={canonicalUrl}
              ogImage={ogImage}
              keywords={keywords}
              relatedPosts={relatedPosts}
              availableBlogs={availableBlogs}
              onInputChange={handleInputChange}
              onKeywordChange={handleKeywordChange}
              onRelatedPostToggle={handleRelatedPostToggle}
            />
          </div>
        </Wrapper>

        {/* Thumbnail */}
        <Wrapper className="group relative h-full overflow-hidden p-5 sm:p-6">
          {/* Wrapper background remains unchanged */}

          <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-violet-500/[0.016] blur-[80px] transition-all duration-700 group-hover:bg-violet-500/[0.026]" />

          <div className="pointer-events-none absolute -bottom-20 -left-20 size-56 rounded-full bg-cyan-500/[0.012] blur-[80px]" />

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
              onClick={() => {
                if (!imagePreviews) {
                  thumbnailInputRef.current?.click();
                }
              }}
              className="relative flex h-[340px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/60 transition-all duration-300 hover:border-indigo-400/40 hover:bg-indigo-500/[0.025] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-indigo-300/[0.15] dark:hover:bg-indigo-300/[0.025]"
            >
              {imagePreviews ? (
                <div className="relative h-full w-full">
                  <img src={imagePreviews} alt="Thumbnail preview" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

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
                <div className="flex max-w-[270px] flex-col items-center justify-center px-5 text-center">
                  <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-600 shadow-[0_10px_26px_rgba(79,70,229,0.10)] dark:border-indigo-300/[0.10] dark:bg-indigo-300/[0.045] dark:text-indigo-200/70">
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] to-transparent" />

                    <IoCameraSharp className="relative z-10" size={25} />
                  </div>

                  <p className="mt-4 text-[11px] font-medium text-gray-600 dark:text-white/50">Drag and drop an image here</p>

                  <p className="mt-1.5 text-[9px] leading-5 text-gray-400 dark:text-white/25">
                    or <span className="font-semibold text-indigo-600 dark:text-indigo-200/70">click to browse</span>
                  </p>

                  <p className="mt-3 rounded-full border border-gray-200/70 bg-white/60 px-3 py-1 text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/25">
                    PNG, JPG or JPEG
                  </p>
                </div>
              )}

              <input ref={thumbnailInputRef} id="thumbnail" type="file" name="cover" className="hidden" onChange={handleFileInputChange} accept="image/png,image/jpeg,image/jpg" />
            </div>
          </div>
        </Wrapper>
      </section>

      {/* Blog content */}
      <div className="mt-3 pb-5">
        <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
          {/* Wrapper background remains unchanged */}

          <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-teal-500/[0.014] blur-[95px] transition-all duration-700 group-hover:bg-teal-500/[0.024]" />

          <div className="relative z-10">
            <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
              <h3 className="text-[12px] font-semibold text-gray-800 dark:text-white/90">Blog content</h3>

              <p className="mt-1 text-[9px] text-gray-400 dark:text-white/25">Write and format the main content of your blog post</p>
            </div>

            <div className="min-h-[400px] w-full rounded-2xl border border-gray-200/70 bg-gray-50/35 p-2 text-xs text-gray-700 dark:border-white/[0.045] dark:bg-white/[0.014] dark:text-white/65">
              <Editor customId={groupId} value={description} onChange={setDescription} folderName="blog/description" folder="blog" subfolder="description" />
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

const BlogSeoAndRelatedFields = ({ seoTitle, canonicalUrl, ogImage, keywords, relatedPosts, availableBlogs, onInputChange, onKeywordChange, onRelatedPostToggle }) => (
  <div className="space-y-4 rounded-3xl border border-gray-200/70 bg-gray-50/45 p-4 dark:border-white/[0.05] dark:bg-white/[0.016]">
    <div>
      <p className="text-[11px] font-semibold text-gray-700 dark:text-white/70">SEO & preview controls</p>
      <p className="mt-1 text-[9px] text-gray-400 dark:text-white/25">Optional fields for richer search previews and manual related posts.</p>
    </div>

    <div className="grid gap-3 md:grid-cols-2">
      <Input type="text" name="seoTitle" value={seoTitle} handleChange={onInputChange} placeholder="SEO title optional" />
      <Input type="text" name="canonicalUrl" value={canonicalUrl} handleChange={onInputChange} placeholder="Canonical URL optional" />
      <Input type="text" name="ogImage" value={ogImage} handleChange={onInputChange} placeholder="Open Graph image URL optional" />
      <div className="rounded-2xl border border-gray-200/80 bg-gray-50/65 p-1 dark:border-white/[0.055] dark:bg-white/[0.022]">
        <TagsInput
          className={`${CommonClassForInput} !border-0 !bg-transparent !p-1.5 [&_.react-tagsinput-input]:!m-0 [&_.react-tagsinput-input]:!h-8 [&_.react-tagsinput-input]:!bg-transparent [&_.react-tagsinput-input]:!text-[11px] [&_.react-tagsinput-input]:!outline-none dark:[&_.react-tagsinput-input]:!text-white/65 [&_.react-tagsinput-tag]:!mb-1 [&_.react-tagsinput-tag]:!mr-1.5 [&_.react-tagsinput-tag]:!rounded-full [&_.react-tagsinput-tag]:!border [&_.react-tagsinput-tag]:!border-teal-300/20 [&_.react-tagsinput-tag]:!bg-teal-500/[0.07] [&_.react-tagsinput-tag]:!px-2.5 [&_.react-tagsinput-tag]:!py-1 [&_.react-tagsinput-tag]:!text-[9px] dark:[&_.react-tagsinput-tag]:!text-teal-200/70`}
          value={keywords}
          onChange={onKeywordChange}
          inputProps={{ placeholder: "SEO keywords" }}
        />
      </div>
    </div>

    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-white/35">Manual related posts</span>
        <span className="text-[9px] text-gray-400 dark:text-white/25">{relatedPosts.length}/6 selected</span>
      </div>
      <div className="grid max-h-56 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
        {availableBlogs.length ? (
          availableBlogs.map((post) => (
            <button
              key={post._id}
              type="button"
              onClick={() => onRelatedPostToggle(post._id)}
              className={`rounded-2xl border p-3 text-left text-[11px] transition ${
                relatedPosts.includes(post._id)
                  ? "border-cyan-300/25 bg-cyan-300/[0.08] text-cyan-700 dark:text-cyan-100/80"
                  : "border-gray-200/70 bg-white/35 text-gray-600 hover:bg-white/60 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/45 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span className="line-clamp-2 font-semibold">{post.title}</span>
            </button>
          ))
        ) : (
          <p className="text-[10px] text-gray-400 dark:text-white/30">Create more blogs to select related posts.</p>
        )}
      </div>
    </div>
  </div>
);
