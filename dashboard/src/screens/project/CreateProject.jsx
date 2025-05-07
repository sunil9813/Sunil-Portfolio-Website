import { createProject, getAllProject } from "@/redux/slices/projectSlice";
import { GhostButton, HeadingTwo, Input, InputLabel, InputTitle, Loader, StickyHeader, TertiaryButton, Wrapper } from "@/utils/Router";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TagsInput from "react-tagsinput";
import { CategoryDropDown } from "@/components/common/DropDown";
import { Switch, Tooltip } from "@material-tailwind/react";
import Editor from "@/textEditor/Editor";
import { MdClose } from "react-icons/md";
import { getAssetsLimit } from "@/redux/slices/settings/AssestLimitSlice";
import { CiCircleQuestion, CiDiscount1, CiDollar } from "react-icons/ci";
import { IoCameraSharp } from "react-icons/io5";
import { FaFolder } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";

const initialState = {
  title: "",
  metaDescription: "",
  visibility: "",
  layout: "",
  urllink: "",
  price: "",
  discount: "",
  category: null,
  tags: [],
  formats: [],
  highlights: [],
};

const inputClassName =
  "w-full h-11 3xl:h-12 px-5 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-full placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50";

export const CreateProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const thumbnailInputRef = useRef(null);
  const assetsInputRef = useRef(null);
  const resourceInputRef = useRef(null);

  const [project, setProject] = useState(initialState);
  const [highlights, setHighlights] = useState([""]);
  const [thumbnail, setThumbnail] = useState(null);
  const [resourceFileUpload, setResourceFileUpload] = useState(null);
  const [resourceFileUrl, setResourceFileUrl] = useState("");
  const [assets, setAssets] = useState([]);
  const [resourcePreview, setResourcePreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [assetsPreviews, setAssetsPreviews] = useState([]);
  const [tagError, setTagError] = useState("");
  const [formatError, setFormatError] = useState("");
  const [highlightErrors, setHighlightErrors] = useState([""]);
  const [titleError, setTitleError] = useState("");
  const [metaDescError, setMetaDescError] = useState("");
  const [resourceFileError, setResourceFileError] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [description, setDescription] = useState("");
  const [groupId] = useState(uuidv4());
  const [discountEnabled, setDiscountEnabled] = useState(false);

  const { title, category, metaDescription, visibility, tags, formats, layout, urllink, price, discount } = project;
  const { isLoading, isError, uploadProgress } = useSelector((state) => state.project);
  const { assetLimit } = useSelector((state) => state.assetlimit);

  // Fetch asset limit on mount
  useEffect(() => {
    dispatch(getAssetsLimit());
  }, [dispatch]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      if (resourcePreview) URL.revokeObjectURL(resourcePreview);
      assetsPreviews.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, [thumbnailPreview, assetsPreviews, resourcePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
    if (name === "price" || name === "discount") {
      const priceValue = name === "price" ? parseFloat(value) || 0 : parseFloat(price) || 0;
      const discountValue = name === "discount" ? parseFloat(value) || 0 : parseFloat(discount) || 0;
      if (discountValue >= priceValue && discountValue > 0) {
        setDiscountError("Discount cannot be greater than or equal to the price.");
      } else if (discountValue < 0) {
        setDiscountError("Discount cannot be negative.");
      } else {
        setDiscountError("");
      }
    }
  };

  const handleResourceFileUrlChange = (e) => {
    const value = e.target.value;
    setResourceFileUrl(value);
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    if (value && !urlRegex.test(value)) {
      setResourceFileError("Please enter a valid URL (e.g., https://github.com/user/repo)");
    } else {
      setResourceFileError("");
    }
  };

  const handleResourceFileUploadChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Resource file size exceeds 100MB limit.");
        return;
      }
      setResourceFileUpload(file);
      setResourcePreview(URL.createObjectURL(file));
      setResourceFileError("");
    }
  };

  const isImageValid = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return allowedFormats.includes(file.type);
  };

  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!isImageValid(selectedFile)) {
        toast.error("Thumbnail must be a PNG, JPEG, or JPG image.");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Thumbnail file size exceeds 10MB limit.");
        return;
      }
      setThumbnail(selectedFile);
      setThumbnailPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleAssetsChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) => {
      if (!isImageValid(file)) {
        toast.error(`Asset ${file.name} is not a valid PNG, JPEG, or JPG image.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Asset ${file.name} exceeds 10MB limit.`);
        return false;
      }
      return true;
    });
    const limit = assetLimit?.assetLimit || 5;
    if (assets.length + validFiles.length > limit) {
      toast.error(`Cannot upload more than ${limit} assets.`);
      return;
    }
    setAssets((prevAssets) => [...prevAssets, ...validFiles]);
    setAssetsPreviews((prevPreviews) => [...prevPreviews, ...validFiles.map((file) => URL.createObjectURL(file))]);
  };

  const handleDeleteAsset = (index) => {
    setAssets((prevAssets) => prevAssets.filter((_, i) => i !== index));
    setAssetsPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleTagChange = (newTags) => {
    const totalLength = newTags.join("").length;
    if (totalLength > 500) {
      setTagError("Tags exceed the maximum length of 500 characters.");
      return;
    }
    const hasDuplicate = newTags.some((tag, index) => newTags.indexOf(tag) !== index);
    if (hasDuplicate) {
      setTagError("Tags cannot be duplicates.");
      return;
    }
    setTagError("");
    setProject({ ...project, tags: newTags });
  };

  const handleFormatChange = (newFormats) => {
    const hasDuplicate = newFormats.some((format, index) => newFormats.indexOf(format) !== index);
    if (hasDuplicate) {
      setFormatError("Formats cannot be duplicates.");
      return;
    }
    setFormatError("");
    setProject({ ...project, formats: newFormats });
  };

  const handleHighlightChange = (index, value) => {
    const updatedHighlights = [...highlights];
    updatedHighlights[index] = value;
    setHighlights(updatedHighlights);
    const updatedErrors = [...highlightErrors];
    updatedErrors[index] = value.length > 100 ? "Highlight cannot exceed 100 characters." : "";
    setHighlightErrors(updatedErrors);
  };

  const validateHighlights = () => {
    const errors = highlights.map((highlight) => {
      if (highlight.trim() === "") return "Highlight cannot be empty.";
      if (highlight.length > 100) return "Highlight cannot exceed 100 characters.";
      return "";
    });
    const nonEmptyHighlights = highlights.filter((h) => h.trim() !== "");
    const hasDuplicate = nonEmptyHighlights.some((highlight, i) => nonEmptyHighlights.indexOf(highlight) !== i);
    if (hasDuplicate) errors[0] = errors[0] || "Highlights cannot be duplicates.";
    setHighlightErrors(errors);
    return !errors.some((error) => error) && !hasDuplicate;
  };

  const handleHighlightBlur = () => {
    validateHighlights();
  };

  const addHighlight = () => {
    setHighlights([...highlights, ""]);
    setHighlightErrors([...highlightErrors, ""]);
  };

  const removeHighlight = (index) => {
    if (highlights.length === 1) {
      toast.error("At least one highlight is required.");
      return;
    }
    setHighlights(highlights.filter((_, i) => i !== index));
    setHighlightErrors(highlightErrors.filter((_, i) => i !== index));
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length > 250) {
      setTitleError("Title cannot exceed 250 characters.");
    } else {
      setTitleError("");
      setProject({ ...project, title: value });
    }
  };

  const handleMetaDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length > 160) {
      setMetaDescError("Meta description cannot exceed 160 characters.");
    } else {
      setMetaDescError("");
      setProject({ ...project, metaDescription: value });
    }
  };

  const handleDropThumbnail = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleThumbnailChange({ target: { files: [file] } });
  }, []);

  const handleDropAssets = useCallback((event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length) handleAssetsChange({ target: { files } });
  }, []);

  const handleDropResource = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleResourceFileUploadChange({ target: { files: [file] } });
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!thumbnail) {
      toast.error("Thumbnail is required.");
      return;
    }
    if (!category) {
      toast.error("Category is required.");
      return;
    }
    if (resourceFileUrl && resourceFileUpload) {
      toast.error("Please provide either a URL or an uploaded file, not both.");
      return;
    }
    if (resourceFileError) {
      toast.error(resourceFileError);
      return;
    }
    if (discountError) {
      toast.error(discountError);
      return;
    }
    if (discountEnabled && parseFloat(discount) > 0 && !project.discountDate) {
      toast.error("Discount date is required when a discount is provided.");
      return;
    }
    if (discountEnabled && project.discountDate) {
      const selectedDate = new Date(project.discountDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        toast.error("Discount date must be in the future.");
        return;
      }
    }
    if (!validateHighlights()) {
      toast.error("Please fix highlight errors.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("metaDescription", metaDescription);
    formData.append("groupId", groupId);
    formData.append("thumbnail", thumbnail);
    formData.append("visibility", visibility);
    formData.append("layout", layout);
    formData.append("urllink", urllink);
    formData.append("price", price || 0);
    formData.append("discount", discountEnabled ? discount || 0 : 0);
    if (discountEnabled && discount && project.discountDate) {
      formData.append("discountDate", project.discountDate);
    }
    if (tags.length > 0) {
      formData.append("tags", JSON.stringify(tags.map((tag) => ({ tag }))));
    }
    if (formats.length > 0) {
      formData.append("formats", JSON.stringify(formats.map((format) => ({ format }))));
    }
    if (highlights.length > 0) {
      formData.append("highlights", JSON.stringify(highlights.filter((h) => h.trim() !== "").map((highlight) => ({ highlight: highlight.trim() }))));
    }
    if (category) {
      formData.append("category", category._id);
    }
    assets.forEach((asset) => {
      formData.append("assets", asset);
    });
    if (resourceFileUrl) {
      formData.append("resourceFile", JSON.stringify({ type: "url", url: resourceFileUrl }));
    } else if (resourceFileUpload) {
      if (!(resourceFileUpload instanceof File)) {
        toast.error("Invalid resource file selected. Please upload a valid file.");
        return;
      }
      formData.append("resourceFileUpload", resourceFileUpload);
      formData.append("resourceFile", JSON.stringify({ type: "file" }));
    }

    // Debug FormData contents
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
    }

    try {
      const resultAction = await dispatch(createProject(formData));
      if (createProject.fulfilled.match(resultAction)) {
        await dispatch(getAllProject());
        setThumbnail(null);
        setAssets([]);
        setResourceFileUpload(null);
        setResourceFileUrl("");
        setThumbnailPreview(null);
        setAssetsPreviews([]);
        setResourcePreview(null);
        setProject(initialState);
        setDescription("");
        setHighlights([""]);
        setHighlightErrors([""]);
        setDiscountEnabled(false);
        toast.success("Project created successfully!");
        navigate("/all-projects");
      } else {
        const errorMessage = isError?.message?.includes("validation failed")
          ? "Invalid input data. Please check tags, formats, highlights, or resource file."
          : isError?.message || "Failed to create project.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Create project error:", error);
      toast.error("An unexpected error occurred while creating the project.");
    }
  };

  return (
    <>
      <StickyHeader>
        <HeadingTwo>New Project</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton>Save draft</GhostButton>
          <TertiaryButton onClick={handleCreate} disabled={isLoading}>
            {isLoading ? `Uploading... ${uploadProgress}%` : "Publish now"}
          </TertiaryButton>
        </div>
      </StickyHeader>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-surface1 p-6 rounded-lg shadow-lg">
            <Loader />
            <p className="text-center mt-4 text-lg">Uploading: {uploadProgress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      <section className="flex justify-between gap-3">
        <div className="w-2/3">
          <Wrapper className="p-5">
            <InputTitle className="mb-4">Project details</InputTitle>
            <div className="input">
              <div className="flex items-center gap-1">
                <InputLabel className="my-2">Project Title</InputLabel>
                <Tooltip className="bg-black text-white dark:bg-white dark:text-black text-xs" content="Maximum 250 characters. No HTML or emoji allowed" placement="right">
                  <button>
                    <CiCircleQuestion />
                  </button>
                </Tooltip>
              </div>
              <div className="relative">
                <Input type="text" name="title" value={title} handleChange={handleTitleChange} placeholder="ie. Building a Responsive Navbar with Tailwind CSS" />
                <p className="absolute bottom-1 right-3 text-primary-dark dark:text-primary text-xs 3xl:text-sm">{title.length}/250</p>
                {titleError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{titleError}</p>}
              </div>
            </div>
            <div className="input mt-4">
              <div className="flex items-center gap-1">
                <InputLabel className="my-2">Meta Description</InputLabel>
                <Tooltip className="bg-black text-white dark:bg-white dark:text-black text-xs" content="Maximum 160 characters. No HTML or emoji allowed" placement="right">
                  <button>
                    <CiCircleQuestion />
                  </button>
                </Tooltip>
              </div>
              <div className="relative">
                <Input
                  className="pt-5 pb-20 rounded-xl"
                  type="text"
                  name="metaDescription"
                  value={metaDescription}
                  handleChange={handleMetaDescriptionChange}
                  placeholder="ie. Learn how to build modern web applications using the latest frontend and backend technologies."
                />
                <p className="absolute bottom-1 right-3 text-primary-dark dark:text-primary text-xs 3xl:text-sm">{metaDescription.length}/160</p>
                {metaDescError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{metaDescError}</p>}
              </div>
            </div>
            <div className="input mt-4">
              <InputLabel className="my-2">Description</InputLabel>
              <Editor customId={groupId} value={description} onChange={setDescription} folderName="project/description" folder="project" subfolder="description" />
            </div>
          </Wrapper>
          <Wrapper className="p-5 my-3">
            <InputTitle className="mb-4">Category & attributes</InputTitle>
            <div className="input">
              <InputLabel className="my-2">Tags</InputLabel>
              <TagsInput className={`${inputClassName} !p-0 !px-2 !pt-2 rounded-xl !min-h-20 !h-auto`} value={tags} onChange={handleTagChange} inputProps={{ placeholder: "Add Tag" }} />
              {tagError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{tagError}</p>}
            </div>
            <div className="input py-3">
              <InputLabel className="my-2">Languages</InputLabel>
              <TagsInput className={`${inputClassName} !p-0 !px-2 !pt-2 rounded-xl !min-h-20 !h-auto`} value={formats} onChange={handleFormatChange} inputProps={{ placeholder: "Add Language" }} />
              {formatError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{formatError}</p>}
            </div>
            <div className="input">
              <InputLabel className="my-2">Category</InputLabel>
              <CategoryDropDown type="project" value={category} onChange={(selectedOption) => setProject({ ...project, category: selectedOption })} />
            </div>
          </Wrapper>
          <Wrapper className="p-5">
            <InputTitle className="mb-4">Layout & Visibility</InputTitle>
            <div className="flex justify-between gap-3 items-center">
              <div className="w-1/2">
                <InputLabel className="my-2">Visibility</InputLabel>
                <select name="visibility" className={`${inputClassName} !px-2 outline-none bg-transparent`} value={visibility} onChange={handleInputChange}>
                  <option className="text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="">
                    Select Visibility
                  </option>
                  <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="public">
                    Public
                  </option>
                  <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="private">
                    Private
                  </option>
                </select>
              </div>
              <div className="w-1/2">
                <InputLabel className="my-2">Layout</InputLabel>
                <select name="layout" className={`${inputClassName} !px-2 outline-none bg-transparent`} value={layout} onChange={handleInputChange}>
                  <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="">
                    Select Layout
                  </option>
                  <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="flex">
                    Flex
                  </option>
                  <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="grid">
                    Grid
                  </option>
                  <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="responsive">
                    Responsive
                  </option>
                  <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="non-responsive">
                    Non-Responsive
                  </option>
                </select>
              </div>
            </div>
          </Wrapper>
          <Wrapper className="p-5 w-full my-3">
            <InputTitle className="mb-4">Project Showcase Images</InputTitle>
            <InputLabel className="my-2">
              Asset Images ({assets.length}/{assetLimit?.assetLimit || 5})
            </InputLabel>
            <div
              onDrop={handleDropAssets}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center w-full h-56 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <IoCameraSharp size={30} />
                <p className="text-sm text-gray-500 dark:text-gray-400 textSizeSm">
                  Drag and drop an image or
                  <span className="textColor font-medium cursor-pointer pl-1" onClick={() => assetsInputRef.current.click()}>
                    click to browse
                  </span>
                </p>
                <input
                  ref={assetsInputRef}
                  id="assets"
                  type="file"
                  name="assets"
                  multiple
                  className="relative m-0 w-full text-xs 3xl:text min-w-0 flex-auto cursor-pointer rounded-lg textColor highlightbg bg-clip-padding px-3 py-1 3xl:py-[8px] font-normal leading-[2.15] transition duration-300 ease-in-out file:-mx-3 file:-my-[8px] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[8px] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primarybg focus:text-neutral-700 focus:outline-none hidden"
                  onChange={handleAssetsChange}
                  accept="image/png,image/jpeg,image/jpg"
                />
              </div>
            </div>
            {assetsPreviews.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {assetsPreviews.map((preview, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <img src={preview} alt={`Asset Preview ${index}`} className="w-full h-full rounded-lg object-cover" />
                    <button
                      onClick={() => handleDeleteAsset(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      title="Delete Image"
                    >
                      <MdClose />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Wrapper>
        </div>

        <div className="w-1/3">
          <Wrapper className="p-5 w-full">
            <InputTitle className="mb-4">Thumbnail image</InputTitle>
            <div
              onDrop={handleDropThumbnail}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center w-full h-56 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
            >
              {thumbnailPreview ? (
                <div className="relative w-full h-56 flex items-center justify-center">
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full rounded-3xl object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setThumbnail(null);
                      setThumbnailPreview(null);
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
                  <IoCameraSharp size={30} />
                  <p className="text-sm text-gray-500 dark:text-gray-400 textSizeSm">
                    Drag and drop an image or
                    <span className="textColor font-medium cursor-pointer" onClick={() => thumbnailInputRef.current.click()}>
                      click to browse
                    </span>
                  </p>
                </div>
              )}
              <input ref={thumbnailInputRef} id="thumbnail" type="file" name="thumbnail" className="hidden" onChange={handleThumbnailChange} accept="image/png,image/jpeg,image/jpg" />
            </div>
          </Wrapper>
          <Wrapper className="p-5 w-full my-3">
            <InputTitle className="mb-4">Upload product files</InputTitle>
            <div className="input">
              <InputLabel className="my-2">Resource File URL (e.g., GitHub link)</InputLabel>
              <Input type="text" name="resourceFileUrl" placeholder="https://github.com/user/repo" value={resourceFileUrl} handleChange={handleResourceFileUrlChange} />
              {resourceFileError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{resourceFileError}</p>}
            </div>
            <div className="input mt-4">
              <InputLabel className="my-2">Upload Resource File (Max 100MB - ZIP, PDF, Images, etc.)</InputLabel>
              <div
                onDrop={handleDropResource}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center w-full h-40 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
              >
                {resourcePreview ? (
                  <div className="relative w-full h-40 flex flex-col items-center justify-center p-4">
                    <div className="flex items-center gap-2">
                      <FaFolder size={30} />
                      <span className="text-sm font-medium text-ellipsis overflow-hidden max-w-[200px]">{resourceFileUpload.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{(resourceFileUpload.size / (1024 * 1024)).toFixed(2)} MB</span>
                    <button
                      onClick={() => {
                        setResourceFileUpload(null);
                        setResourcePreview(null);
                      }}
                      className="absolute top-3 right-3 shadow-xl bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      title="Remove Resource"
                    >
                      <MdClose />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FaFolder size={30} />
                    <p className="text-sm text-gray-500 dark:text-gray-400 textSizeSm">
                      Drag and drop any file (ZIP, PDF, etc.) or
                      <span className="textColor font-medium cursor-pointer pl-1" onClick={() => resourceInputRef.current.click()}>
                        click to browse
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">Max 100MB</p>
                  </div>
                )}
                <input ref={resourceInputRef} id="resourceFileUpload" type="file" name="resourceFileUpload" className="hidden" onChange={handleResourceFileUploadChange} />
              </div>
              {resourceFileUpload && (
                <p className="text-xs mt-2 text-gray-500">
                  File type: {resourceFileUpload.type || "Unknown"} | Size: {(resourceFileUpload.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
            </div>
          </Wrapper>
          <Wrapper className="p-5">
            <InputTitle className="mb-4">Price</InputTitle>
            <div className="input">
              <InputLabel className="my-2">Price (USD)</InputLabel>
              <div className="relative">
                <Input type="number" name="price" className="pl-12" value={price} handleChange={handleInputChange} min="0" step="0.01" />
                <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-green-300 rounded-full flexC text-white absolute top-1 left-1">
                  <CiDollar size={25} />
                </div>
              </div>
            </div>
            <div className="input py-3">
              <div className="flexbC">
                <InputLabel className="my-2">Discount</InputLabel>
                <Switch
                  id="custom-switch-component"
                  checked={discountEnabled}
                  onChange={(e) => setDiscountEnabled(e.target.checked)}
                  ripple={false}
                  className="group inline-flex w-11 h-6 items-center rounded-full bg-dark-surface1 shadow-[0_0_0_1.5px_inset] shadow-s-stroke2 transition-colors data-[checked]:bg-[#282828] data-[checked]:shadow-[0_1.5px_0_inset] data-[checked]:shadow-white/20 dark:shadow-[inset_0_0_0_1.5px_rgba(248,248,248,0.20),inset_2px_0_8px_2px_rgba(248,248,248,0.20)] dark:data-[checked]:shadow-[inset_2px_0_8px_2px_rgba(248,248,248,0.20)]"
                  containerProps={{
                    className: "w-11 h-6",
                  }}
                  circleProps={{
                    className: "before:hidden left-0.5 border-none",
                  }}
                />
              </div>
              {discountEnabled && (
                <>
                  <div className="relative mt-2">
                    <Input type="number" name="discount" className="pl-12" value={discount} handleChange={handleInputChange} min="0" step="0.01" />
                    <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-red-300 rounded-full flexC text-white absolute top-1 left-1">
                      <CiDiscount1 size={25} />
                    </div>
                  </div>
                  {discountError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{discountError}</p>}
                </>
              )}
            </div>
            {discountEnabled && (
              <div className="input">
                <InputLabel className="my-2">Duration of Discount</InputLabel>
                <div className="relative">
                  <DatePicker
                    className={`!w-full h-11 3xl:h-12 px-5 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-full placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50`}
                    selected={project.discountDate ? new Date(project.discountDate) : null}
                    onChange={(date) => setProject({ ...project, discountDate: date ? date.toISOString() : "" })}
                    minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Tomorrow
                    placeholderText="Select discount end date"
                  />
                </div>
              </div>
            )}
          </Wrapper>
          <Wrapper className="p-5 w-full my-3">
            <InputTitle className="mb-4">Demos</InputTitle>
            <div className="input">
              <InputLabel className="my-2">Live demo</InputLabel>
              <Input type="text" name="urllink" placeholder="Please enter url link" value={urllink} handleChange={handleInputChange} />
            </div>
          </Wrapper>
          <Wrapper className="p-5 w-full my-3">
            <InputTitle className="mb-4">Highlights</InputTitle>
            {highlights.map((highlight, index) => (
              <div key={index} className="mb-4">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name={`highlight-${index}`}
                    className={`${inputClassName} pl-10 pr-20 w-full ${highlightErrors[index] ? "border-red-500 dark:border-red-500" : ""}`}
                    placeholder="Write the main highlight of project"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    onBlur={handleHighlightBlur}
                  />
                  <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 rounded-full flexC text-white absolute top-1 left-1">
                    <IoIosCheckmarkCircle size={25} className={highlight.trim() !== "" ? "text-green-400" : "text-gray-400"} />
                  </div>
                  {index === highlights.length - 1 && (
                    <button onClick={addHighlight} className="absolute top-1 right-1 h-9 w-9 3xl:h-10 3xl:w-10 rounded-full flexC text-white" title="Add another highlight">
                      <FaCirclePlus size={20} className="text-blue-500" />
                    </button>
                  )}
                  {highlights.length > 1 && (
                    <button onClick={() => removeHighlight(index)} className="absolute top-1 right-10 h-9 w-9 3xl:h-10 3xl:w-10 rounded-full flexC text-white" title="Remove highlight">
                      <FaCircleMinus size={20} className="text-red-500" />
                    </button>
                  )}
                </div>
                {highlightErrors[index] && <p className="text-red-500 text-xs 3xl:text-sm mt-1 ml-2">{highlightErrors[index]}</p>}
              </div>
            ))}
          </Wrapper>
        </div>
      </section>
    </>
  );
};
