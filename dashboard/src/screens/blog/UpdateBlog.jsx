import Editor from "@/textEditor/Editor";
import { Input, Loader, StickyHeaderComponent, UseMouseMoveEffect, Wrapper } from "@/utils/Router";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { CommonClassForInput } from "@/utils";
import { CategoryDropDown } from "@/components/common/DropDown";
import { getallBlog, getBlogPrivate, selectBlog, updateBlog } from "@/redux/slices/blogSlice";
import { TextareaInput } from "@/components/customeUI/Input";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";

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
  const [tagError, setTagError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [metaDescError, setMetaDescError] = useState("");
  const [description, setDescription] = useState("");

  const { title, category, metaDescription, tags, groupId } = blog || {};

  useEffect(() => {
    dispatch(getBlogPrivate(slug));
  }, [slug, dispatch]);

  useEffect(() => {
    if (blogEdit) {
      setBlog({
        title: blogEdit.title || "",
        groupId: blogEdit.groupId || "",
        metaDescription: blogEdit.metaDescription || "",
        visibility: blogEdit.visibility || "",
        category: blogEdit.category || null,
        tags: blogEdit.tags ? blogEdit.tags.map((t) => t.tag) : [],
      });
      setDescription(blogEdit.description || "");
      setImagePreviews(blogEdit.cover?.filePath || "");
    }
  }, [blogEdit]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreviews && imagePreviews.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviews);
      }
    };
  }, [imagePreviews]);

  const handleUpdate = async () => {
    if (title.trim().length > 0) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("metaDescription", metaDescription);
      if (blogImages) formData.append("cover", blogImages);

      if (tags.length > 0) {
        const formattedTags = tags.map((tag) => ({ tag }));
        formData.append("tags", JSON.stringify(formattedTags));
      }

      if (category) {
        formData.append("category", category._id || category);
      }

      try {
        await dispatch(updateBlog({ slug, formData })).unwrap();
        await dispatch(getallBlog());
        setImagePreviews("");
        setBlogImages(null);
        navigate("/all-blog");
      } catch (error) {
        toast.error(`Failed to update blog: ${error}`);
      }
    }
  };

  const isImageValid = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return allowedFormats.includes(file.type);
  };

  const handleThumbnailChange = (selectedFile) => {
    if (selectedFile && isImageValid(selectedFile)) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("Thumbnail file size exceeds 2MB limit.");
        return;
      }
      setBlogImages(selectedFile);
      setImagePreviews(URL.createObjectURL(selectedFile));
    } else {
      toast.error("Please select a valid PNG, JPEG, or JPG image.");
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleThumbnailChange(selectedFile);
    }
  };

  const handleDropThumbnail = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleThumbnailChange(file);
    }
  }, []);

  const handleTagChange = (newTags) => {
    // Ensure tags don't exceed the 500 characters limit
    const totalLength = newTags.join("").length;

    if (totalLength > 500) {
      setTagError("Tags exceed the maximum length of 500 characters.");
      return; // Don't update the tags if limit exceeded
    }

    // Check for duplicates
    const hasDuplicate = newTags.some((tag, index) => newTags.indexOf(tag) !== index);
    if (hasDuplicate) {
      setTagError("Tags cannot be duplicates.");
      return;
    }

    setTagError("");
    setBlog((prevBlog) => ({ ...prevBlog, tags: newTags })); // Use functional update
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length > 250) {
      setTitleError("Title cannot exceed 250 characters.");
    } else {
      setTitleError("");
      setBlog({ ...blog, title: value });
    }
  };

  const handleMetaDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length > 160) {
      setMetaDescError("Meta description cannot exceed 160 characters.");
    } else {
      setMetaDescError("");
      setBlog({ ...blog, metaDescription: value });
    }
  };

  if (isLoading || !blogEdit) {
    return <Loader />;
  }

  return (
    <>
      <StickyHeaderComponent title="Update Blog" path="/all-blog" btntext="Update now" handleFunction={handleUpdate} />

      <section className="flex justify-between gap-3">
        <Wrapper className="p-5 w-2/3">
          <div className="relative">
            <span className="textColor block text-xs 3xl:text-xs mb-2">Title (250 characters)</span>

            <Input type="text" name="title" value={title} handleChange={handleTitleChange} placeholder="Blog title" />
            <p className="absolute bottom-3 right-3 text-primary-dark dark:text-primary text-xs 3xl:text-sm">{title.length}/250</p>
            {titleError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{titleError}</p>}
          </div>

          <div className="tags py-3">
            <span className="textColor block text-xs 3xl:text-sm mb-2">Tags</span>
            <div
              className={`w-full h-auto py-1 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-3xl placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50`}
            >
              <TagsInput className={`${CommonClassForInput}`} value={tags} onChange={handleTagChange} inputProps={{ placeholder: "Add a tag" }} />
            </div>
            {tagError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{tagError}</p>}
          </div>

          <div className="cate">
            <span className="textColor block text-xs 3xl:text-sm mb-2">Category</span>
            <CategoryDropDown type="blog" value={category} onChange={(selectedOption) => setBlog({ ...blog, category: selectedOption })} />
          </div>

          <div className="mt-3 relative">
            <span className="textColor block text-xs 3xl:text-sm mb-2">Meta description (160 characters)</span>

            <TextareaInput
              type="textarea"
              name="metaDescription"
              className={`${CommonClassForInput}`}
              value={metaDescription}
              handleChange={handleMetaDescriptionChange}
              placeholder="Enter meta description for SEO"
            />
            <p className="absolute bottom-3 right-3 text-primary-dark dark:text-primary text-xs 3xl:text-sm">{metaDescription.length}/160</p>
            {metaDescError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{metaDescError}</p>}
          </div>
        </Wrapper>

        {/* Right column - Thumbnail upload (Updated to match CreateBlog) */}
        <div className="w-1/3">
          <Wrapper className="p-5 w-full">
            <span className="textColor block text-xs 3xl:text-sm mb-4 font-medium">Thumbnail Image</span>
            <div
              onDrop={handleDropThumbnail}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center w-full h-[390px] transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
            >
              {imagePreviews ? (
                <div className="relative w-full h-[390px] flex items-center justify-center">
                  <img src={imagePreviews} alt="Thumbnail Preview" className="w-full h-full rounded-3xl object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBlogImages(null);
                      // Only clear preview if it's a blob URL, otherwise keep the existing image
                      if (imagePreviews.startsWith("blob:")) {
                        URL.revokeObjectURL(imagePreviews);
                        setImagePreviews("");
                      } else {
                        // If it's an existing image from the server, clear it
                        setImagePreviews("");
                        // You might want to add a flag to indicate the image should be removed
                      }
                    }}
                    className="absolute top-3 right-3 shadow-xl bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove Thumbnail"
                    aria-label="Remove thumbnail image"
                  >
                    <MdClose />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <IoCameraSharp size={30} className="text-gray-400 dark:text-gray-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 textSizeSm">
                    Drag and drop an image or
                    <span className="textColor font-medium cursor-pointer pl-1" onClick={() => thumbnailInputRef.current.click()}>
                      click to browse
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                </div>
              )}
              <input ref={thumbnailInputRef} id="thumbnail" type="file" name="cover" className="hidden" onChange={handleFileInputChange} accept="image/png,image/jpeg,image/jpg" />
            </div>
            {blogEdit?.cover?.filePath && !imagePreviews && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Existing image will be kept. Click the remove button above to delete it.</p>}
          </Wrapper>
        </div>
      </section>

      {/* Blog Content Editor Section */}
      <div className="mt-5 pb-5">
        <Wrapper className="p-5">
          <span className="textColor block text-xs 3xl:text-sm mb-2 font-medium">Blog Content</span>
          <div className="mt-5 outline-none rounded-lg textColor text-xs 3xl:text-sm w-full min-h-[400px]">
            <Editor
              key={slug} // Force re-render on slug change
              customId={groupId}
              value={description || ""} // Ensure value is always a string
              onChange={(newValue) => {
                setDescription(newValue);
              }}
              folderName="blog/description"
              folder="blog"
              subfolder="description"
            />
          </div>
        </Wrapper>
      </div>
    </>
  );
};
