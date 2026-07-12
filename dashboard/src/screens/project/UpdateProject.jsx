import { getAssetsLimit } from "@/redux/slices/settings/AssestLimitSlice";
import { getAllProject, getProjectPrivate, updateProject } from "@/redux/slices/projectSlice";
import { HeadingTwo, GhostButton, Input, InputLabel, InputTitle, Loader, StickyHeader, TertiaryButton, Wrapper } from "@/routes";
import { inputClassName } from "@/utils";
import { CategoryDropDown } from "@/components/common/DropDown";
import Editor from "@/textEditor/Editor";
import { ProjectToolsSection } from "./ProjectToolsSection";
import { Switch, Tooltip } from "@material-tailwind/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TagsInput from "react-tagsinput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { MdClose } from "react-icons/md";
import { CiCircleQuestion, CiDiscount1, CiDollar } from "react-icons/ci";
import { IoCameraSharp } from "react-icons/io5";
import { FaFolder } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";

const initialState = {
  title: "",
  metaDescription: "",
  visibility: "private",
  layout: "",
  urllink: "",
  price: "",
  discount: "",
  discountDate: "",
  category: null,
  groupId: "",
  tags: [],
  formats: [],
};

export const UpdateProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();

  const thumbnailInputRef = useRef(null);
  const assetsInputRef = useRef(null);
  const resourceInputRef = useRef(null);

  const { project: projectEdit, isLoading } = useSelector((state) => state.project);
  const { assetLimit } = useSelector((state) => state.assetlimit);

  const [project, setProject] = useState(initialState);
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState([""]);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [assets, setAssets] = useState([]);
  const [assetsPreviews, setAssetsPreviews] = useState([]);
  const [existingAssets, setExistingAssets] = useState([]);

  const [resourceFileUpload, setResourceFileUpload] = useState(null);
  const [resourceFileUrl, setResourceFileUrl] = useState("");
  const [resourcePreview, setResourcePreview] = useState(null);
  const [existingResourceFile, setExistingResourceFile] = useState(null);

  const [tagError, setTagError] = useState("");
  const [formatError, setFormatError] = useState("");
  const [highlightErrors, setHighlightErrors] = useState([""]);
  const [titleError, setTitleError] = useState("");
  const [metaDescError, setMetaDescError] = useState("");
  const [resourceFileError, setResourceFileError] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [discountEnabled, setDiscountEnabled] = useState(false);

  const { title, category, metaDescription, visibility, tags, formats, layout, urllink, price, discount, groupId } = project;

  useEffect(() => {
    dispatch(getAssetsLimit());
    dispatch(getProjectPrivate(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (!projectEdit) return;

    setProject({
      title: projectEdit.title || "",
      metaDescription: projectEdit.metaDescription || "",
      visibility: projectEdit.visibility || "private",
      layout: projectEdit.layout || "",
      urllink: projectEdit.urllink || "",
      price: projectEdit.price || "",
      discount: projectEdit.discount || "",
      discountDate: projectEdit.discountDate || "",
      category: projectEdit.category || null,
      groupId: projectEdit.groupId || uuidv4(),
      tags: projectEdit.tags ? projectEdit.tags.map((item) => item.tag) : [],
      formats: projectEdit.formats ? projectEdit.formats.map((item) => item.format) : [],
    });

    setDescription(projectEdit.description || "");
    setHighlights(projectEdit.highlights?.length ? projectEdit.highlights.map((item) => item.highlight) : [""]);
    setHighlightErrors(projectEdit.highlights?.length ? projectEdit.highlights.map(() => "") : [""]);
    setThumbnailPreview(projectEdit.thumbnail?.filePath || "");
    setExistingAssets(projectEdit.assets || []);
    setDiscountEnabled(Number(projectEdit.discount || 0) > 0 || Boolean(projectEdit.discountDate));

    if (projectEdit.resourceFile?.type === "url") {
      setResourceFileUrl(projectEdit.resourceFile.url || "");
      setExistingResourceFile(null);
    } else if (projectEdit.resourceFile?.type === "file") {
      setExistingResourceFile(projectEdit.resourceFile.file || projectEdit.resourceFile);
      setResourceFileUrl("");
    }
  }, [projectEdit]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith("blob:")) URL.revokeObjectURL(thumbnailPreview);
      if (resourcePreview) URL.revokeObjectURL(resourcePreview);
      assetsPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [thumbnailPreview, resourcePreview, assetsPreviews]);

  const isImageValid = (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));

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

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length > 250) return setTitleError("Title cannot exceed 250 characters.");
    setTitleError("");
    setProject((prev) => ({ ...prev, title: value }));
  };

  const handleMetaDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length > 160) return setMetaDescError("Meta description cannot exceed 160 characters.");
    setMetaDescError("");
    setProject((prev) => ({ ...prev, metaDescription: value }));
  };

  const handleTagChange = (newTags) => {
    if (newTags.join("").length > 500) return setTagError("Tags exceed the maximum length of 500 characters.");
    if (newTags.some((tag, index) => newTags.indexOf(tag) !== index)) return setTagError("Tags cannot be duplicates.");
    setTagError("");
    setProject((prev) => ({ ...prev, tags: newTags }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isImageValid(file)) return toast.error("Thumbnail must be a PNG, JPEG, or JPG image.");
    if (file.size > 10 * 1024 * 1024) return toast.error("Thumbnail file size exceeds 10MB limit.");

    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleAssetsChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
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
    if (existingAssets.length + assets.length + validFiles.length > limit) {
      toast.error(`Cannot upload more than ${limit} assets.`);
      return;
    }

    setAssets((prev) => [...prev, ...validFiles]);
    setAssetsPreviews((prev) => [...prev, ...validFiles.map((file) => URL.createObjectURL(file))]);
  };

  const handleDeleteExistingAsset = (index) => {
    setExistingAssets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteNewAsset = (index) => {
    setAssets((prev) => prev.filter((_, i) => i !== index));
    setAssetsPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResourceFileUrlChange = (e) => {
    const value = e.target.value;
    setResourceFileUrl(value);
    setResourceFileUpload(null);
    setResourcePreview(null);
    setExistingResourceFile(null);

    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    setResourceFileError(value && !urlRegex.test(value) ? "Please enter a valid URL (e.g., https://github.com/user/repo)" : "");
  };

  const handleResourceFileUploadChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) return toast.error("Resource file size exceeds 100MB limit.");

    setResourceFileUpload(file);
    setResourcePreview(URL.createObjectURL(file));
    setResourceFileUrl("");
    setExistingResourceFile(null);
    setResourceFileError("");
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

    const nonEmptyHighlights = highlights.filter((item) => item.trim() !== "");
    const hasDuplicate = nonEmptyHighlights.some((item, index) => nonEmptyHighlights.indexOf(item) !== index);
    if (hasDuplicate) errors[0] = errors[0] || "Highlights cannot be duplicates.";

    setHighlightErrors(errors);
    return !errors.some(Boolean) && !hasDuplicate;
  };

  const addHighlight = () => {
    setHighlights((prev) => [...prev, ""]);
    setHighlightErrors((prev) => [...prev, ""]);
  };

  const removeHighlight = (index) => {
    if (highlights.length === 1) return toast.error("At least one highlight is required.");
    setHighlights((prev) => prev.filter((_, i) => i !== index));
    setHighlightErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDropThumbnail = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleThumbnailChange({ target: { files: [file] } });
  }, []);

  const handleDropAssets = useCallback(
    (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length) handleAssetsChange({ target: { files } });
    },
    [assets, existingAssets, assetLimit],
  );

  const handleDropResource = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleResourceFileUploadChange({ target: { files: [file] } });
  }, []);

  const handleUpdate = async (publishType = "save") => {
    const finalVisibility = publishType === "publish" ? "public" : visibility;

    if (!title.trim()) return toast.error("Title is required.");
    if (!category) return toast.error("Category is required.");
    if (resourceFileUrl && resourceFileUpload) return toast.error("Please provide either a URL or an uploaded file, not both.");
    if (resourceFileError) return toast.error(resourceFileError);
    if (discountError) return toast.error(discountError);

    if (discountEnabled && parseFloat(discount) > 0 && !project.discountDate) {
      return toast.error("Discount date is required when a discount is provided.");
    }

    if (discountEnabled && project.discountDate) {
      const selectedDate = new Date(project.discountDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        return toast.error("Discount date must be in the future.");
      }
    }

    if (!validateHighlights()) return toast.error("Please fix highlight errors.");

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description || "");
    formData.append("metaDescription", metaDescription || "");
    formData.append("groupId", groupId || uuidv4());
    formData.append("visibility", finalVisibility);
    formData.append("layout", layout || "");
    formData.append("urllink", urllink || "");
    formData.append("price", price || 0);
    formData.append("discount", discountEnabled ? discount || 0 : 0);

    if (discountEnabled && discount && project.discountDate) {
      formData.append("discountDate", project.discountDate);
    }

    if (thumbnail) formData.append("thumbnail", thumbnail);

    formData.append("tags", JSON.stringify(tags.map((tag) => ({ tag }))));
    formData.append("formats", JSON.stringify(formats.map((format) => ({ format }))));
    formData.append("highlights", JSON.stringify(highlights.filter((item) => item.trim() !== "").map((highlight) => ({ highlight: highlight.trim() }))));
    formData.append("category", category._id || category);

    formData.append("existingAssets", JSON.stringify(existingAssets));
    assets.forEach((asset) => formData.append("assets", asset));

    if (resourceFileUrl) {
      formData.append("resourceFile", JSON.stringify({ type: "url", url: resourceFileUrl }));
    } else if (resourceFileUpload) {
      formData.append("resourceFileUpload", resourceFileUpload);
      formData.append("resourceFile", JSON.stringify({ type: "file" }));
    }

    try {
      await dispatch(updateProject({ slug, formData })).unwrap();
      await dispatch(getAllProject());
      toast.success("Project updated successfully");
      navigate("/all-project");
    } catch (error) {
      toast.error(`Failed to update project: ${error}`);
    }
  };

  if (isLoading && !projectEdit) return <Loader />;

  return (
    <>
      <StickyHeader>
        <HeadingTwo>Update Project</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton onClick={() => navigate(-1)}>Cancel</GhostButton>
          <TertiaryButton onClick={() => handleUpdate("save")}>Update Now</TertiaryButton>
        </div>
      </StickyHeader>

      <section className="flex justify-between gap-3">
        <div className="w-2/3">
          <Wrapper className="p-5">
            <InputTitle className="mb-4">Project details</InputTitle>

            <div className="input">
              <div className="flex items-center gap-1">
                <InputLabel className="my-2">Project Title</InputLabel>
                <Tooltip className="bg-black text-white dark:bg-white dark:text-black text-xs" content="Maximum 250 characters. No HTML or emoji allowed" placement="right">
                  <button type="button">
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
                  <button type="button">
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
          </Wrapper>

          <Wrapper className="p-5 my-3">
            <InputTitle className="mb-4">Category & attributes</InputTitle>

            <div className="input">
              <InputLabel className="my-2">Tags</InputLabel>
              <TagsInput className={`${inputClassName} !p-0 !px-2 !pt-2 rounded-xl !min-h-20 !h-auto`} value={tags} onChange={handleTagChange} inputProps={{ placeholder: "Add Tag" }} />
              {tagError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{tagError}</p>}
            </div>

            <div className="input my-5">
              <InputLabel className="my-2">Category</InputLabel>
              <CategoryDropDown type="project" value={category} onChange={(selectedOption) => setProject((prev) => ({ ...prev, category: selectedOption }))} />
            </div>

            <div>
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
          </Wrapper>

          <Wrapper className="p-5 w-full my-3">
            <InputTitle className="mb-4">Project Showcase Images</InputTitle>
            <InputLabel className="my-2">
              Asset Images ({existingAssets.length + assets.length}/{assetLimit?.assetLimit || 5})
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
                <input ref={assetsInputRef} id="assets" type="file" name="assets" multiple className="hidden" onChange={handleAssetsChange} accept="image/png,image/jpeg,image/jpg" />
              </div>
            </div>

            {(existingAssets.length > 0 || assetsPreviews.length > 0) && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {existingAssets.map((asset, index) => (
                  <div key={asset._id || asset.publicId || index} className="relative w-32 h-32">
                    <img src={asset.filePath || asset.url} alt={asset.publicId || `Existing Asset ${index}`} className="w-full h-full rounded-lg object-cover" />
                    <button
                      onClick={() => handleDeleteExistingAsset(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      title="Delete Image"
                    >
                      <MdClose />
                    </button>
                  </div>
                ))}

                {assetsPreviews.map((preview, index) => (
                  <div key={preview} className="relative w-32 h-32">
                    <img src={preview} alt={`New Asset Preview ${index}`} className="w-full h-full rounded-lg object-cover" />
                    <button
                      onClick={() => handleDeleteNewAsset(index)}
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

          <Wrapper className="p-5">
            <InputTitle className="mb-4">Project Description</InputTitle>
            <Editor customId={groupId || slug} value={description} onChange={setDescription} folderName="project/description" folder="project" subfolder="description" />
          </Wrapper>
        </div>

        <div className="w-1/3">
          <Wrapper className="p-5 w-full">
            <InputTitle className="mb-4">Upload product files</InputTitle>

            <div className="input">
              <InputLabel className="my-2">Resource File URL</InputLabel>
              <Input type="text" name="resourceFileUrl" placeholder="https://github.com/user/repo" value={resourceFileUrl} handleChange={handleResourceFileUrlChange} />
              {resourceFileError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{resourceFileError}</p>}
            </div>

            <div className="input mt-4">
              <InputLabel className="my-2">Upload Resource File</InputLabel>

              <div
                onDrop={handleDropResource}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center w-full h-40 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
              >
                {resourceFileUpload || existingResourceFile ? (
                  <div className="relative w-full h-40 flex flex-col items-center justify-center p-4">
                    <div className="flex items-center gap-2">
                      <FaFolder size={30} />
                      <span className="text-sm font-medium text-ellipsis overflow-hidden max-w-[200px]">
                        {resourceFileUpload?.name || existingResourceFile?.originalName || existingResourceFile?.publicId || "Existing resource file"}
                      </span>
                    </div>

                    {resourceFileUpload?.size && <span className="text-xs text-gray-500 mt-2">{(resourceFileUpload.size / (1024 * 1024)).toFixed(2)} MB</span>}

                    <button
                      onClick={() => {
                        setResourceFileUpload(null);
                        setResourcePreview(null);
                        setExistingResourceFile(null);
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
                      Drag and drop any file or
                      <span className="textColor font-medium cursor-pointer pl-1" onClick={() => resourceInputRef.current.click()}>
                        click to browse
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">Max 100MB</p>
                  </div>
                )}

                <input ref={resourceInputRef} id="resourceFileUpload" type="file" name="resourceFileUpload" className="hidden" onChange={handleResourceFileUploadChange} />
              </div>
            </div>
          </Wrapper>

          <Wrapper className="p-5 w-full my-3">
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
                      setThumbnailPreview("");
                    }}
                    className="absolute top-3 right-3 shadow-xl bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove Thumbnail"
                  >
                    <MdClose />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <IoCameraSharp size={30} />
                  <p className="text-sm text-gray-500 dark:text-gray-400 textSizeSm">
                    Drag and drop an image or
                    <span className="textColor font-medium cursor-pointer pl-1" onClick={() => thumbnailInputRef.current.click()}>
                      click to browse
                    </span>
                  </p>
                </div>
              )}

              <input ref={thumbnailInputRef} id="thumbnail" type="file" name="thumbnail" className="hidden" onChange={handleThumbnailChange} accept="image/png,image/jpeg,image/jpg" />
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
                  className="group inline-flex w-11 h-6 items-center rounded-full bg-dark-surface1 shadow-[0_0_0_1.5px_inset] shadow-s-stroke2 transition-colors data-[checked]:bg-[#282828]"
                  containerProps={{ className: "w-11 h-6" }}
                  circleProps={{ className: "before:hidden left-0.5 border-none" }}
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
                <DatePicker
                  className="!w-full h-11 3xl:h-12 px-5 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-full placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50"
                  selected={project.discountDate ? new Date(project.discountDate) : null}
                  onChange={(date) => setProject((prev) => ({ ...prev, discountDate: date ? date.toISOString() : "" }))}
                  minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                  placeholderText="Select discount end date"
                />
              </div>
            )}
          </Wrapper>

          <Wrapper className="p-5 w-full my-3">
            <InputTitle className="mb-4">Demos</InputTitle>
            <InputLabel className="my-2">Live demo</InputLabel>
            <Input type="text" name="urllink" placeholder="Please enter url link" value={urllink} handleChange={handleInputChange} />
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
                    onBlur={validateHighlights}
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

          <ProjectToolsSection formats={formats} setProject={setProject} formatError={formatError} setFormatError={setFormatError} />
          <div className="pb-96"></div>
        </div>
      </section>
    </>
  );
};
