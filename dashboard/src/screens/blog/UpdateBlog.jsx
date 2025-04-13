import Editor from "@/textEditor/Editor";
import { BreadcrumbsComponent, InputCard, Loader, UseMouseMoveEffect, Wrapper } from "@/utils/Router";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { CommonClassForInput } from "@/utils";
import { CategoryDropDown } from "@/components/common/DropDown";
import { Button } from "@material-tailwind/react";
import { getallBlog, getBlogPrivate, selectBlog, updateBlog } from "@/redux/slices/blogSlice";

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
      <section className="content">
        <BreadcrumbsComponent text="Update blog" />
        <Wrapper className="p-5">
          <div id="inputcards" className="inputcards flex flex-col gap-5">
            <div className="mt-3">
              <span className="text-gray-400 block text-sm mb-2">Description</span>
              <InputCard>
                <div className="px-4 py-2.5 bg-blue-gray-600/10 border-[1px] border-white/20 outline-none rounded-lg text-textcolor text-sm w-full">
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
              </InputCard>
            </div>

            <div>
              <span className="text-gray-400 block text-sm mb-2">Title (250 characters)</span>
              <InputCard>
                <input type="text" name="title" className={`${CommonClassForInput} pb-10`} value={title} onChange={handleTitleChange} />
                <p className="absolute bottom-3 right-3 text-primary-dark dark:text-primary text-sm">{title?.length || 0}/250</p>
              </InputCard>
              {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
            </div>

            <div>
              <span className="text-gray-400 block text-sm mb-2">Tags</span>
              <InputCard>
                <TagsInput className={`${CommonClassForInput}`} value={tags} onChange={handleTagChange} />
              </InputCard>
              {tagError && <p className="text-red-500 text-sm mt-1">{tagError}</p>}
            </div>

            <div className="flex justify-between gap-5">
              <div className="w-full">
                <span className="text-gray-400 block text-sm mb-2">Category</span>
                <InputCard>
                  <CategoryDropDown type="blog" value={category} onChange={(selectedOption) => setBlog({ ...blog, category: selectedOption })} />
                </InputCard>
              </div>
            </div>

            <div>
              <span className="text-gray-400 block text-sm mb-2">Thumbnail</span>
              <InputCard>
                <input
                  className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded-lg bg-blue-gray-600/10 border border-white/20 text-primary bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-textcolor transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primarybg focus:text-neutral-700 focus:outline-none"
                  id="formFileLg"
                  type="file"
                  name="cover"
                  onChange={handleImageChange}
                />
              </InputCard>
              {imagePreviews && (
                <div className="mt-3">
                  <img src={imagePreviews} alt="imagePreviews" className="w-56 h-32 rounded-lg object-contain" />
                </div>
              )}
            </div>

            <div>
              <span className="text-gray-400 block text-sm mb-2">Meta description (160 characters)</span>
              <InputCard>
                <input type="text" name="metaDescription" className={`${CommonClassForInput} pb-10`} placeholder="Meta description" value={metaDescription} onChange={handleMetaDescriptionChange} />
                <p className="absolute bottom-3 right-3 text-primary-dark dark:text-primary text-sm">{metaDescription?.length || 0}/160</p>
              </InputCard>
              {metaDescError && <p className="text-red-500 text-sm mt-1">{metaDescError}</p>}
            </div>

            {/* Put description box here  */}

            <div className="w-56">
              <Button color="indigo" type="submit" onClick={handleUpdate}>
                Update
              </Button>
            </div>
          </div>
        </Wrapper>
      </section>
    </>
  );
};
