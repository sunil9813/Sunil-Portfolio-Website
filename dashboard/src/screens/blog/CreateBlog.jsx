import { createBlog, getallBlog } from "@/redux/slices/blogSlice";
import { BreadcrumbsComponent, InputCard, Loader, UseMouseMoveEffect, Wrapper } from "@/utils/Router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TagsInput from "react-tagsinput"; // Import TagsInput
import "react-tagsinput/react-tagsinput.css"; // Import the necessary CSS
import { CommonClassForInput } from "@/utils";
import { CategoryDropDown } from "@/components/common/DropDown";
import { Button } from "@material-tailwind/react";
import { v4 as uuidv4 } from "uuid";
import Editor from "@/textEditor/Editor";

const initialState = {
  title: "",
  metaDescription: "",
  visibility: "",
  category: null,
  tags: [], // Tags remain as an array for TagsInput
};

export const CreateBlog = () => {
  UseMouseMoveEffect("inputcards");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [blog, setBlog] = useState(initialState);
  const [blogImages, setBlogImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tagError, setTagError] = useState(""); // State to hold tag validation error message
  const [titleError, setTitleError] = useState(""); // State to hold title validation error message
  const [metaDescError, setMetaDescError] = useState(""); // State to hold meta description validation error message
  const [description, setDescription] = useState("");
  const [groupId] = useState(uuidv4()); // Shared between blog and images

  const { title, category, metaDescription, visibility, tags } = blog;
  const { isLoading } = useSelector((state) => state.blog);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  const handleCreate = async () => {
    if (title.trim().length > 0 && blogImages) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description); // Use editor content as the description
      formData.append("metaDescription", metaDescription);
      formData.append("groupId", groupId);
      formData.append("cover", blogImages);
      formData.append("visibility", visibility); // "public" or "private"

      if (tags.length > 0) {
        // Convert tags array of strings into array of objects with a 'tag' property
        const formattedTags = tags.map((tag) => ({ tag }));
        formData.append("tags", JSON.stringify(formattedTags));
      }

      if (category) {
        formData.append("category", category._id);
      }

      const resultAction = await dispatch(createBlog(formData));
      await dispatch(getallBlog());
      if (createBlog.fulfilled.match(resultAction)) {
        setImagePreviews(null);
        setBlogImages(null);
        navigate("/all-blog");
      }
    } else {
      toast.error("Please fill all input fields.");
    }
  };

  const isImageValid = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return allowedFormats.includes(file.type);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isImageValid(selectedFile)) {
      setBlogImages(selectedFile);
      setImagePreviews(URL.createObjectURL(selectedFile));
    } else {
      toast.error("Please select a valid PNG, JPEG, or JPG image.");
    }
  };

  const handleTagChange = (newTags) => {
    // Ensure tags don't exceed the 500 characters limit
    const totalLength = newTags.join("").length;

    if (totalLength > 500) {
      setTagError("Tags exceed the maximum length of 500 characters.");
      return; // Don't update the tags if limit exceeded
    }

    // Check for duplicate tags
    const hasDuplicate = newTags.some((tag, index) => newTags.indexOf(tag) !== index);
    if (hasDuplicate) {
      setTagError("Tags cannot be duplicates.");
      return;
    }

    setTagError(""); // Reset error if validation passes
    setBlog({ ...blog, tags: newTags });
  };

  // Title validation
  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length > 250) {
      setTitleError("Title cannot exceed 250 characters.");
    } else {
      setTitleError(""); // Reset error if valid
      setBlog({ ...blog, title: value });
    }
  };

  // Meta Description validation
  const handleMetaDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length > 160) {
      setMetaDescError("Meta description cannot exceed 160 characters.");
    } else {
      setMetaDescError(""); // Reset error if valid
      setBlog({ ...blog, metaDescription: value });
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Wrapper className="p-5">
        <BreadcrumbsComponent currentPage="Create Blogs" space={false} />
        <div className="form-input flex flex-col gap-5 mt-5">
          <div>
            <span className="textColor block text-xs 3xl:text-xs mb-2">Title (250 characters)</span>
            <input type="text" name="title" className={`${CommonClassForInput} pb-10`} value={title} onChange={handleTitleChange} />
            <p className="absolute bottom-3 right-3 text-primary-dark dark:text-primary text-xs 3xl:text-sm">{title.length}/250</p>
            {titleError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{titleError}</p>} {/* Display title error */}
          </div>

          <div>
            <span className="textColor block text-xs 3xl:text-sm mb-2">Tags</span>
            <InputCard>
              <TagsInput
                className={`${CommonClassForInput}`}
                value={tags} // Current tags state
                onChange={handleTagChange} // Update the tags array when changed
              />
            </InputCard>
            {tagError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{tagError}</p>} {/* Display tag error */}
          </div>

          <div className="flex justify-between gap-5">
            <div className="w-1/2">
              <span className="textColor block text-xs 3xl:text-sm mb-2">Category</span>
              <InputCard>
                <CategoryDropDown
                  type="blog" // Adjust type as per your requirement
                  value={category}
                  onChange={(selectedOption) => setBlog({ ...blog, category: selectedOption })}
                />
              </InputCard>
            </div>
            <div className="w-1/2">
              <span className="textColor block text-xs 3xl:text-sm mb-2">Visibility</span>
              <InputCard>
                <select name="visibility" className={`${CommonClassForInput} px-4 py-2.5 textColor text-xs 3xl:text-sm outline-none`} value={visibility} onChange={handleInputChange}>
                  <option className="textColor text-xs 3xl:text-sm" value="">
                    Select Visibility
                  </option>
                  <option className="textColor text-xs 3xl:text-sm" value="public">
                    Public
                  </option>
                  <option className="textColor text-xs 3xl:text-sm" value="private">
                    Private
                  </option>
                </select>
              </InputCard>
            </div>
          </div>

          <div>
            <span className="textColor block text-xs 3xl:text-sm mb-2">Thumbnail</span>
            <InputCard>
              <input
                className="relative m-0 block w-full text-xs 3xl:text min-w-0 flex-auto cursor-pointer rounded-lg textColor highlightbg bg-clip-padding px-3 py-[8px] font-normal leading-[2.15] transition duration-300 ease-in-out file:-mx-3 file:-my-[8px] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[8px] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primarybg focus:text-neutral-700 focus:outline-none"
                id="formFileLg"
                type="file"
                name="cover"
                onChange={handleImageChange}
              />
            </InputCard>
            {imagePreviews?.length > 0 && imagePreviews && (
              <div className="mt-3">
                <img src={imagePreviews} alt="imagePreviews" className="w-56 h-32 rounded-lg object-contain" />
              </div>
            )}
          </div>

          <div>
            <span className="textColor block text-xs 3xl:text-sm mb-2">Meta description (160 characters)</span>
            <InputCard>
              <input type="text" name="metaDescription" className={`${CommonClassForInput} pb-10`} value={metaDescription} onChange={handleMetaDescriptionChange} />
              <p className="absolute bottom-3 right-3 textColor text-xs 3xl:text-sm">{metaDescription.length}/160</p>
            </InputCard>
            {metaDescError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{metaDescError}</p>} {/* Display meta description error */}
          </div>

          <div className="mt-3">
            <div className="p-4 mt-2 highlightbg outline-none rounded-lg textColor text-xs 3xl:text-sm w-full">
              <Editor
                customId={groupId}
                // pass the customid
                value={description}
                onChange={setDescription}
                folderName="blog/description"
                folder="blog"
                subfolder="description"
              />
            </div>
          </div>

          <div className="w-56">
            <Button color="indigo" type="submit" onClick={handleCreate}>
              Create
            </Button>
          </div>
        </div>
      </Wrapper>
    </>
  );
};
