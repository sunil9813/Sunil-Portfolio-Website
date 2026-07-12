import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import TagsInput from "react-tagsinput";
import DatePicker from "react-datepicker";
import { Switch, Tooltip } from "@material-tailwind/react";

import { MdClose } from "react-icons/md";
import { CiCircleQuestion, CiDiscount1, CiDollar } from "react-icons/ci";
import { IoCameraSharp } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaFolder } from "react-icons/fa";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";

import Editor from "@/textEditor/Editor";
import { createProject, getAllProject } from "@/redux/slices/projectSlice";
import { getAssetsLimit } from "@/redux/slices/settings/AssestLimitSlice";
import { CategoryDropDown } from "@/components/common/DropDown";
import { GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, Wrapper } from "@/routes";
import { inputClassName } from "@/utils";
import { ProjectToolsSection } from "./ProjectToolsSection";

import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import { CustomDropdown } from "@/components/common/dropdown/CustomeDropDown";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_RESOURCE_SIZE = 100 * 1024 * 1024;

const ALLOWED_IMAGE_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

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
  tags: [],
  formats: [],
  highlights: [],
};

const revokeObjectUrl = (url) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

export const CreateProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const thumbnailInputRef = useRef(null);
  const assetsInputRef = useRef(null);
  const resourceInputRef = useRef(null);

  const thumbnailPreviewRef = useRef(null);
  const resourcePreviewRef = useRef(null);
  const assetsPreviewsRef = useRef([]);

  const [project, setProject] = useState(initialState);
  const [highlights, setHighlights] = useState([""]);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [assets, setAssets] = useState([]);
  const [assetsPreviews, setAssetsPreviews] = useState([]);

  const [resourceFileUpload, setResourceFileUpload] = useState(null);
  const [resourceFileUrl, setResourceFileUrl] = useState("");
  const [resourcePreview, setResourcePreview] = useState("");

  const [description, setDescription] = useState("");
  const [groupId] = useState(() => uuidv4());
  const [discountEnabled, setDiscountEnabled] = useState(false);

  const [tagError, setTagError] = useState("");
  const [formatError, setFormatError] = useState("");
  const [highlightErrors, setHighlightErrors] = useState([""]);
  const [titleError, setTitleError] = useState("");
  const [metaDescError, setMetaDescError] = useState("");
  const [resourceFileError, setResourceFileError] = useState("");
  const [discountError, setDiscountError] = useState("");

  const { title, category, metaDescription, visibility, tags, formats, layout, urllink, price, discount } = project;

  const { isError } = useSelector((state) => state.project);

  const { assetLimit } = useSelector((state) => state.assetlimit);

  const maximumAssets = assetLimit?.assetLimit || 5;

  useEffect(() => {
    dispatch(getAssetsLimit());
  }, [dispatch]);

  useEffect(() => {
    thumbnailPreviewRef.current = thumbnailPreview;
  }, [thumbnailPreview]);

  useEffect(() => {
    resourcePreviewRef.current = resourcePreview;
  }, [resourcePreview]);

  useEffect(() => {
    assetsPreviewsRef.current = assetsPreviews;
  }, [assetsPreviews]);

  useEffect(() => {
    return () => {
      revokeObjectUrl(thumbnailPreviewRef.current);
      revokeObjectUrl(resourcePreviewRef.current);

      assetsPreviewsRef.current.forEach((preview) => {
        revokeObjectUrl(preview);
      });
    };
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setProject((previousProject) => ({
      ...previousProject,
      [name]: value,
    }));

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

  const handleResourceFileUrlChange = (event) => {
    const value = event.target.value;

    setResourceFileUrl(value);

    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/;

    if (value && !urlRegex.test(value)) {
      setResourceFileError("Please enter a valid URL, such as https://github.com/user/repo.");
    } else {
      setResourceFileError("");
    }
  };

  const processResourceFile = useCallback(
    (file) => {
      if (!file) {
        return;
      }

      if (file.size > MAX_RESOURCE_SIZE) {
        toast.error("Resource file size exceeds the 100MB limit.");
        return;
      }

      revokeObjectUrl(resourcePreview);

      setResourceFileUpload(file);
      setResourcePreview(URL.createObjectURL(file));
      setResourceFileError("");
    },
    [resourcePreview],
  );

  const handleResourceFileUploadChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      processResourceFile(selectedFile);
    }

    event.target.value = "";
  };

  const isImageValid = useCallback((file) => {
    return ALLOWED_IMAGE_FORMATS.includes(file?.type);
  }, []);

  const processThumbnail = useCallback(
    (selectedFile) => {
      if (!selectedFile) {
        return;
      }

      if (!isImageValid(selectedFile)) {
        toast.error("Thumbnail must be a PNG, JPEG, or JPG image.");
        return;
      }

      if (selectedFile.size > MAX_IMAGE_SIZE) {
        toast.error("Thumbnail file size exceeds the 10MB limit.");
        return;
      }

      revokeObjectUrl(thumbnailPreview);

      setThumbnail(selectedFile);
      setThumbnailPreview(URL.createObjectURL(selectedFile));
    },
    [isImageValid, thumbnailPreview],
  );

  const handleThumbnailChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      processThumbnail(selectedFile);
    }

    event.target.value = "";
  };

  const processAssets = useCallback(
    (selectedFiles) => {
      const files = Array.from(selectedFiles || []);

      if (!files.length) {
        return;
      }

      const validFiles = files.filter((file) => {
        if (!isImageValid(file)) {
          toast.error(`${file.name} is not a valid PNG, JPEG, or JPG image.`);

          return false;
        }

        if (file.size > MAX_IMAGE_SIZE) {
          toast.error(`${file.name} exceeds the 10MB limit.`);

          return false;
        }

        return true;
      });

      if (assets.length + validFiles.length > maximumAssets) {
        toast.error(`You cannot upload more than ${maximumAssets} project assets.`);

        return;
      }

      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

      setAssets((previousAssets) => [...previousAssets, ...validFiles]);

      setAssetsPreviews((previousPreviews) => [...previousPreviews, ...newPreviews]);
    },
    [assets.length, isImageValid, maximumAssets],
  );

  const handleAssetsChange = (event) => {
    processAssets(event.target.files);
    event.target.value = "";
  };

  const handleDeleteAsset = (index) => {
    revokeObjectUrl(assetsPreviews[index]);

    setAssets((previousAssets) => previousAssets.filter((_, assetIndex) => assetIndex !== index));

    setAssetsPreviews((previousPreviews) => previousPreviews.filter((_, previewIndex) => previewIndex !== index));
  };

  const handleRemoveThumbnail = (event) => {
    event.preventDefault();
    event.stopPropagation();

    revokeObjectUrl(thumbnailPreview);

    setThumbnail(null);
    setThumbnailPreview("");
  };

  const handleRemoveResource = (event) => {
    event.preventDefault();
    event.stopPropagation();

    revokeObjectUrl(resourcePreview);

    setResourceFileUpload(null);
    setResourcePreview("");
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

    setProject((previousProject) => ({
      ...previousProject,
      tags: cleanedTags,
    }));
  };

  const handleHighlightChange = (index, value) => {
    setHighlights((previousHighlights) => previousHighlights.map((highlight, highlightIndex) => (highlightIndex === index ? value : highlight)));

    setHighlightErrors((previousErrors) =>
      previousErrors.map((error, errorIndex) => {
        if (errorIndex !== index) {
          return error;
        }

        return value.length > 100 ? "Highlight cannot exceed 100 characters." : "";
      }),
    );
  };

  const validateHighlights = () => {
    const normalizedHighlights = highlights.filter((highlight) => highlight.trim()).map((highlight) => highlight.trim().toLowerCase());

    const hasDuplicate = normalizedHighlights.some((highlight, index) => normalizedHighlights.indexOf(highlight) !== index);

    const errors = highlights.map((highlight) => {
      if (!highlight.trim()) {
        return "Highlight cannot be empty.";
      }

      if (highlight.length > 100) {
        return "Highlight cannot exceed 100 characters.";
      }

      return "";
    });

    if (hasDuplicate) {
      errors[0] = errors[0] || "Highlights cannot contain duplicates.";
    }

    setHighlightErrors(errors);

    return !errors.some(Boolean) && !hasDuplicate;
  };

  const addHighlight = () => {
    setHighlights((previousHighlights) => [...previousHighlights, ""]);

    setHighlightErrors((previousErrors) => [...previousErrors, ""]);
  };

  const removeHighlight = (index) => {
    if (highlights.length === 1) {
      toast.error("At least one highlight is required.");
      return;
    }

    setHighlights((previousHighlights) => previousHighlights.filter((_, highlightIndex) => highlightIndex !== index));

    setHighlightErrors((previousErrors) => previousErrors.filter((_, errorIndex) => errorIndex !== index));
  };

  const handleTitleChange = (event) => {
    const value = event.target.value;

    if (value.length > 250) {
      setTitleError("Title cannot exceed 250 characters.");
      return;
    }

    setTitleError("");

    setProject((previousProject) => ({
      ...previousProject,
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

    setProject((previousProject) => ({
      ...previousProject,
      metaDescription: value,
    }));
  };

  const handleDropThumbnail = useCallback(
    (event) => {
      event.preventDefault();

      const file = event.dataTransfer.files?.[0];

      if (file) {
        processThumbnail(file);
      }
    },
    [processThumbnail],
  );

  const handleDropAssets = useCallback(
    (event) => {
      event.preventDefault();

      processAssets(event.dataTransfer.files);
    },
    [processAssets],
  );

  const handleDropResource = useCallback(
    (event) => {
      event.preventDefault();

      const file = event.dataTransfer.files?.[0];

      if (file) {
        processResourceFile(file);
      }
    },
    [processResourceFile],
  );

  const clearCreatedFilePreviews = () => {
    revokeObjectUrl(thumbnailPreview);
    revokeObjectUrl(resourcePreview);

    assetsPreviews.forEach((preview) => {
      revokeObjectUrl(preview);
    });
  };

  const handleCreate = async (publishType) => {
    const finalVisibility = publishType === "draft" ? "private" : publishType === "publish" ? "public" : visibility;

    if (!title.trim()) {
      setTitleError("Project title is required.");
      toast.error("Project title is required.");
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
      toast.error("Please provide either a resource URL or an uploaded file, not both.");
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
      toast.error("Please fix the highlight errors.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("description", description || "");
    formData.append("metaDescription", metaDescription.trim());
    formData.append("groupId", groupId);
    formData.append("thumbnail", thumbnail);
    formData.append("visibility", finalVisibility);
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
      const formattedHighlights = highlights
        .filter((highlight) => highlight.trim())
        .map((highlight) => ({
          highlight: highlight.trim(),
        }));

      formData.append("highlights", JSON.stringify(formattedHighlights));
    }

    formData.append("category", category?._id || category);

    assets.forEach((asset) => {
      formData.append("assets", asset);
    });

    if (resourceFileUrl) {
      formData.append(
        "resourceFile",
        JSON.stringify({
          type: "url",
          url: resourceFileUrl,
        }),
      );
    } else if (resourceFileUpload) {
      if (!(resourceFileUpload instanceof File)) {
        toast.error("Invalid resource file selected.");
        return;
      }

      formData.append("resourceFileUpload", resourceFileUpload);

      formData.append(
        "resourceFile",
        JSON.stringify({
          type: "file",
        }),
      );
    }

    try {
      const resultAction = await dispatch(createProject(formData));

      if (createProject.fulfilled.match(resultAction)) {
        await dispatch(getAllProject());

        clearCreatedFilePreviews();

        setThumbnail(null);
        setThumbnailPreview("");
        setAssets([]);
        setAssetsPreviews([]);
        setResourceFileUpload(null);
        setResourceFileUrl("");
        setResourcePreview("");
        setProject(initialState);
        setDescription("");
        setHighlights([""]);
        setHighlightErrors([""]);
        setDiscountEnabled(false);

        toast.success(publishType === "draft" ? "Draft saved successfully." : "Project published successfully.");

        navigate("/all-projects");
      } else {
        const errorMessage = isError?.message?.includes("validation failed")
          ? "Invalid input data. Check the tags, formats, highlights, or resource file."
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

        <div className="flex items-center gap-2">
          <GhostButton type="button" onClick={() => handleCreate("draft")}>
            Save draft
          </GhostButton>

          <TertiaryButton type="button" onClick={() => handleCreate("publish")}>
            Publish now
          </TertiaryButton>
        </div>
      </StickyHeader>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
        {/* Left column */}
        <div className="min-w-0">
          {/* Project details */}
          <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
            {/* Wrapper background remains unchanged */}

            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/[0.016] blur-[90px] transition-all duration-700 group-hover:bg-indigo-500/[0.026]" />

            <div className="relative z-10">
              <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
                <InputTitle className="mb-1">Project details</InputTitle>

                <p className="text-[9px] text-gray-400 dark:text-white/25">Add the title and short description for your project.</p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <InputLabel>Project title</InputLabel>

                    <Tooltip
                      className="rounded-lg border border-white/[0.08] bg-[#11151d] px-3 py-2 text-[10px] text-white/90 shadow-xl"
                      content="Maximum 250 characters. No HTML or emoji allowed."
                      placement="right"
                    >
                      <button type="button" aria-label="Project title information" className="text-gray-400 transition-colors hover:text-indigo-500 dark:text-white/25 dark:hover:text-indigo-200/70">
                        <CiCircleQuestion />
                      </button>
                    </Tooltip>
                  </div>

                  <span className={`text-[9px] font-medium tabular-nums ${title.length >= 240 ? "text-rose-600 dark:text-rose-200/75" : "text-gray-400 dark:text-white/25"}`}>{title.length}/250</span>
                </div>

                <Input type="text" name="title" value={title} handleChange={handleTitleChange} placeholder="Building a responsive navbar with Tailwind CSS" />

                {titleError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{titleError}</p>}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <InputLabel>Meta description</InputLabel>

                    <Tooltip
                      className="rounded-lg border border-white/[0.08] bg-[#11151d] px-3 py-2 text-[10px] text-white/90 shadow-xl"
                      content="Maximum 160 characters. No HTML or emoji allowed."
                      placement="right"
                    >
                      <button
                        type="button"
                        aria-label="Meta description information"
                        className="text-gray-400 transition-colors hover:text-indigo-500 dark:text-white/25 dark:hover:text-indigo-200/70"
                      >
                        <CiCircleQuestion />
                      </button>
                    </Tooltip>
                  </div>

                  <span className={`text-[9px] font-medium tabular-nums ${metaDescription.length >= 150 ? "text-rose-600 dark:text-rose-200/75" : "text-gray-400 dark:text-white/25"}`}>
                    {metaDescription.length}/160
                  </span>
                </div>

                <Input
                  className="rounded-xl pb-20 pt-5"
                  type="text"
                  name="metaDescription"
                  value={metaDescription}
                  handleChange={handleMetaDescriptionChange}
                  placeholder="Describe the purpose and main features of the project."
                />

                {metaDescError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{metaDescError}</p>}
              </div>
            </div>
          </Wrapper>

          {/* Category and attributes */}
          <Wrapper className="group relative my-3 overflow-hidden p-5 sm:p-6">
            {/* Wrapper background remains unchanged */}

            <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-cyan-500/[0.012] blur-[90px] transition-all duration-700 group-hover:bg-cyan-500/[0.022]" />

            <div className="relative z-10">
              <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
                <InputTitle className="mb-1">Category & attributes</InputTitle>

                <p className="text-[9px] text-gray-400 dark:text-white/25">Organise the project using tags, a category, and layout type.</p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <InputLabel>Tags</InputLabel>

                  <span className="text-[9px] text-gray-400 dark:text-white/25">{tags.join("").length}/500</span>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-gray-50/55 p-1 transition-all focus-within:border-indigo-400/35 focus-within:ring-4 focus-within:ring-indigo-500/[0.04] dark:border-white/[0.055] dark:bg-white/[0.02] dark:focus-within:border-indigo-300/[0.13]">
                  <TagsInput
                    className={`${inputClassName} !h-auto !min-h-20 !border-0 !bg-transparent !px-2 !pt-2 [&_.react-tagsinput-input]:!m-0 [&_.react-tagsinput-input]:!h-8 [&_.react-tagsinput-input]:!bg-transparent [&_.react-tagsinput-input]:!text-[11px] [&_.react-tagsinput-input]:!text-gray-700 [&_.react-tagsinput-input]:!outline-none dark:[&_.react-tagsinput-input]:!text-white/65 [&_.react-tagsinput-tag]:!mb-1 [&_.react-tagsinput-tag]:!mr-1.5 [&_.react-tagsinput-tag]:!inline-flex [&_.react-tagsinput-tag]:!items-center [&_.react-tagsinput-tag]:!rounded-full [&_.react-tagsinput-tag]:!border [&_.react-tagsinput-tag]:!border-indigo-300/25 [&_.react-tagsinput-tag]:!bg-indigo-500/[0.07] [&_.react-tagsinput-tag]:!px-2.5 [&_.react-tagsinput-tag]:!py-1 [&_.react-tagsinput-tag]:!text-[9px] [&_.react-tagsinput-tag]:!text-indigo-700 dark:[&_.react-tagsinput-tag]:!border-indigo-300/[0.10] dark:[&_.react-tagsinput-tag]:!bg-indigo-300/[0.045] dark:[&_.react-tagsinput-tag]:!text-indigo-200/70`}
                    value={tags}
                    onChange={handleTagChange}
                    inputProps={{
                      placeholder: "Add tag",
                    }}
                  />
                </div>

                {tagError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{tagError}</p>}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <InputLabel className="mb-2">Category</InputLabel>

                  <div className="rounded-2xl border border-gray-200/80 bg-gray-50/45   dark:border-white/[0.05] dark:bg-white/[0.018]">
                    <CategoryDropDown
                      type="project"
                      value={category}
                      onChange={(selectedOption) =>
                        setProject((previousProject) => ({
                          ...previousProject,
                          category: selectedOption,
                        }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <InputLabel className="mb-2">Layout</InputLabel>

                  <CustomDropdown
                    name="layout"
                    value={layout}
                    onChange={handleInputChange}
                    placeholder="Select layout"
                    className="w-full"
                    options={[
                      { value: "flex", label: "Flex" },
                      { value: "grid", label: "Grid" },
                      { value: "responsive", label: "Responsive" },
                      { value: "non-responsive", label: "Non-responsive" },
                    ]}
                  />
                </div>
                {/*  <div>
                  <InputLabel className="mb-2">Layout</InputLabel>

                  <select
                    name="layout"
                    value={layout}
                    onChange={handleInputChange}
                    className={`${inputClassName} !rounded-2xl !border-gray-200/80 !bg-gray-50/45 !px-3 !text-[11px] outline-none dark:!border-white/[0.055] dark:!bg-white/[0.018] dark:!text-white/65`}
                  >
                    <option className="bg-white text-gray-800 dark:bg-[#11151d] dark:text-white/90" value="">
                      Select layout
                    </option>

                    <option className="bg-white text-gray-800 dark:bg-[#11151d] dark:text-white/90" value="flex">
                      Flex
                    </option>

                    <option className="bg-white text-gray-800 dark:bg-[#11151d] dark:text-white/90" value="grid">
                      Grid
                    </option>

                    <option className="bg-white text-gray-800 dark:bg-[#11151d] dark:text-white/90" value="responsive">
                      Responsive
                    </option>

                    <option className="bg-white text-gray-800 dark:bg-[#11151d] dark:text-white/90" value="non-responsive">
                      Non-responsive
                    </option>
                  </select>
                </div> */}
              </div>
            </div>
          </Wrapper>

          {/* Project assets */}
          <Wrapper className="group relative my-3 overflow-hidden p-5 sm:p-6">
            {/* Wrapper background remains unchanged */}

            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-violet-500/[0.014] blur-[90px] transition-all duration-700 group-hover:bg-violet-500/[0.024]" />

            <div className="relative z-10">
              <div className="mb-5 flex items-start justify-between gap-3 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
                <div>
                  <InputTitle className="mb-1">Project showcase images</InputTitle>

                  <p className="text-[9px] text-gray-400 dark:text-white/25">Upload images that demonstrate the project interface and features.</p>
                </div>

                <span className="rounded-full border border-violet-300/20 bg-violet-500/[0.055] px-2.5 py-1 text-[8px] font-semibold text-violet-700 dark:border-violet-300/[0.09] dark:bg-violet-300/[0.04] dark:text-violet-200/70">
                  {assets.length}/{maximumAssets}
                </span>
              </div>

              <button
                type="button"
                onClick={() => assetsInputRef.current?.click()}
                onDrop={handleDropAssets}
                onDragOver={(event) => event.preventDefault()}
                className="flex h-56 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/60 px-5 text-center transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/[0.025] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-violet-300/[0.15] dark:hover:bg-violet-300/[0.025]"
              >
                <span className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-violet-300/20 bg-violet-500/[0.07] text-violet-600 shadow-[0_10px_26px_rgba(124,58,237,0.10)] dark:border-violet-300/[0.10] dark:bg-violet-300/[0.045] dark:text-violet-200/70">
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] to-transparent" />

                  <IoCameraSharp className="relative z-10" size={25} />
                </span>

                <span className="mt-4 text-[11px] font-medium text-gray-600 dark:text-white/50">Drag and drop project images</span>

                <span className="mt-1.5 text-[9px] text-gray-400 dark:text-white/25">or click to browse PNG, JPG and JPEG</span>

                <span className="mt-3 rounded-full border border-gray-200/70 bg-white/60 px-3 py-1 text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/25">
                  Maximum 10MB each
                </span>
              </button>

              <input ref={assetsInputRef} id="assets" type="file" name="assets" multiple className="hidden" onChange={handleAssetsChange} accept="image/png,image/jpeg,image/jpg" />

              {assetsPreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {assetsPreviews.map((preview, index) => (
                    <div
                      key={`${preview}-${index}`}
                      className="group/asset relative aspect-square overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-100 dark:border-white/[0.055] dark:bg-white/[0.018]"
                    >
                      <img src={preview} alt={`Project asset ${index + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover/asset:scale-105" />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover/asset:opacity-100" />

                      <button
                        type="button"
                        onClick={() => handleDeleteAsset(index)}
                        title="Delete image"
                        aria-label={`Delete asset ${index + 1}`}
                        className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-lg border border-rose-300/20 bg-rose-500/85 text-white shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:bg-rose-500"
                      >
                        <MdClose size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Wrapper>

          {/* Editor */}
          <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
            {/* Wrapper background remains unchanged */}

            <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-teal-500/[0.014] blur-[95px] transition-all duration-700 group-hover:bg-teal-500/[0.024]" />

            <div className="relative z-10">
              <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
                <InputTitle className="mb-1">Project content</InputTitle>

                <p className="text-[9px] text-gray-400 dark:text-white/25">Write and format the full project overview.</p>
              </div>

              <div className="min-h-[400px] rounded-2xl border border-gray-200/70 bg-gray-50/35 p-2 dark:border-white/[0.045] dark:bg-white/[0.014]">
                <Editor customId={groupId} value={description} onChange={setDescription} folderName="project/description" folder="project" subfolder="description" />
              </div>
            </div>
          </Wrapper>
        </div>

        {/* Right column */}
        <aside className="min-w-0">
          {/* Product files */}
          <Wrapper className="group relative overflow-hidden p-5">
            {/* Wrapper background remains unchanged */}

            <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-blue-500/[0.014] blur-[80px] transition-all duration-700 group-hover:bg-blue-500/[0.024]" />

            <div className="relative z-10">
              <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
                <InputTitle className="mb-1">Upload product files</InputTitle>

                <p className="text-[9px] text-gray-400 dark:text-white/25">Add either an external URL or upload a resource file.</p>
              </div>

              <div>
                <InputLabel className="mb-2">Resource file URL</InputLabel>

                <Input type="text" name="resourceFileUrl" placeholder="https://github.com/user/repo" value={resourceFileUrl} handleChange={handleResourceFileUrlChange} />

                {resourceFileError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{resourceFileError}</p>}
              </div>

              <div className="my-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200 dark:bg-white/[0.05]" />

                <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Or upload</span>

                <span className="h-px flex-1 bg-gray-200 dark:bg-white/[0.05]" />
              </div>

              <button
                type="button"
                onClick={() => resourceInputRef.current?.click()}
                onDrop={handleDropResource}
                onDragOver={(event) => event.preventDefault()}
                className="relative flex h-44 w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/60 p-4 text-center transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-500/[0.025] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-blue-300/[0.15] dark:hover:bg-blue-300/[0.025]"
              >
                {resourcePreview ? (
                  <>
                    <span className="flex size-12 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-500/[0.07] text-blue-600 dark:border-blue-300/[0.09] dark:bg-blue-300/[0.04] dark:text-blue-200/70">
                      <FaFolder size={22} />
                    </span>

                    <span className="mt-3 max-w-[230px] truncate text-[11px] font-semibold text-gray-700 dark:text-white/65">{resourceFileUpload?.name}</span>

                    <span className="mt-1 text-[9px] text-gray-400 dark:text-white/25">{((resourceFileUpload?.size || 0) / (1024 * 1024)).toFixed(2)} MB</span>

                    <button
                      type="button"
                      onClick={handleRemoveResource}
                      title="Remove resource"
                      aria-label="Remove resource file"
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/85 text-white shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:bg-rose-500"
                    >
                      <MdClose size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex size-12 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-500/[0.07] text-blue-600 dark:border-blue-300/[0.09] dark:bg-blue-300/[0.04] dark:text-blue-200/70">
                      <FaFolder size={22} />
                    </span>

                    <span className="mt-3 text-[10px] font-medium text-gray-600 dark:text-white/50">Drag and drop any file</span>

                    <span className="mt-1 text-[9px] text-gray-400 dark:text-white/25">ZIP, PDF, images and other files</span>

                    <span className="mt-2 text-[8px] font-semibold uppercase tracking-[0.08em] text-blue-600 dark:text-blue-200/60">Maximum 100MB</span>
                  </>
                )}
              </button>

              <input ref={resourceInputRef} id="resourceFileUpload" type="file" name="resourceFileUpload" className="hidden" onChange={handleResourceFileUploadChange} />
            </div>
          </Wrapper>

          {/* Thumbnail */}
          <Wrapper className="group relative my-3 overflow-hidden p-5">
            {/* Wrapper background remains unchanged */}

            <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-violet-500/[0.014] blur-[80px] transition-all duration-700 group-hover:bg-violet-500/[0.024]" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <InputTitle>Thumbnail image</InputTitle>

                <span className="rounded-full border border-gray-200/70 bg-gray-50/60 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
                  Max 10MB
                </span>
              </div>

              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                onDrop={handleDropThumbnail}
                onDragOver={(event) => event.preventDefault()}
                className="relative flex h-60 w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/60 text-center transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/[0.025] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-violet-300/[0.15] dark:hover:bg-violet-300/[0.025]"
              >
                {thumbnailPreview ? (
                  <>
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

                    <span className="absolute bottom-3 left-3 rounded-lg border border-white/[0.12] bg-black/45 px-2.5 py-1.5 text-[9px] font-medium text-white/90 backdrop-blur-xl">
                      Thumbnail preview
                    </span>

                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      title="Remove thumbnail"
                      aria-label="Remove thumbnail image"
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/85 text-white shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:bg-rose-500"
                    >
                      <MdClose size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-violet-300/20 bg-violet-500/[0.07] text-violet-600 shadow-[0_10px_26px_rgba(124,58,237,0.10)] dark:border-violet-300/[0.10] dark:bg-violet-300/[0.045] dark:text-violet-200/70">
                      <IoCameraSharp size={25} />
                    </span>

                    <span className="mt-4 text-[11px] font-medium text-gray-600 dark:text-white/50">Drag and drop an image</span>

                    <span className="mt-1.5 text-[9px] text-gray-400 dark:text-white/25">or click to browse</span>
                  </>
                )}
              </button>

              <input ref={thumbnailInputRef} id="thumbnail" type="file" name="thumbnail" className="hidden" onChange={handleThumbnailChange} accept="image/png,image/jpeg,image/jpg" />
            </div>
          </Wrapper>

          {/* Price */}
          <Wrapper className="group relative overflow-hidden p-5">
            {/* Wrapper background remains unchanged */}

            <div className="pointer-events-none absolute -bottom-20 -right-20 size-56 rounded-full bg-emerald-500/[0.014] blur-[80px] transition-all duration-700 group-hover:bg-emerald-500/[0.024]" />

            <div className="relative z-10">
              <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
                <InputTitle>Price</InputTitle>
              </div>

              <div>
                <InputLabel className="mb-2">Price (USD)</InputLabel>

                <div className="relative">
                  <Input type="number" name="price" className="pl-12" value={price} handleChange={handleInputChange} min="0" step="0.01" />

                  <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-500/[0.10] text-emerald-700 dark:border-emerald-300/[0.10] dark:bg-emerald-300/[0.055] dark:text-emerald-200/75 3xl:size-10">
                    <CiDollar size={23} />
                  </span>
                </div>
              </div>

              <div className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <InputLabel>Discount</InputLabel>

                    <p className="mt-1 text-[8px] text-gray-400 dark:text-white/20">Apply a temporary reduced price</p>
                  </div>

                  <Switch
                    id="discount-switch"
                    checked={discountEnabled}
                    onChange={(event) => setDiscountEnabled(event.target.checked)}
                    ripple={false}
                    className="h-full w-full bg-gray-300 checked:bg-rose-500 dark:bg-white/[0.12]"
                    containerProps={{
                      className: "w-11 h-6",
                    }}
                    circleProps={{
                      className: "before:hidden left-0.5 border-none",
                    }}
                  />
                </div>

                {discountEnabled && (
                  <div className="relative mt-3">
                    <Input type="number" name="discount" className="pl-12" value={discount} handleChange={handleInputChange} min="0" step="0.01" />

                    <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-rose-300/20 bg-rose-500/[0.10] text-rose-700 dark:border-rose-300/[0.10] dark:bg-rose-300/[0.055] dark:text-rose-200/75 3xl:size-10">
                      <CiDiscount1 size={23} />
                    </span>
                  </div>
                )}

                {discountError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{discountError}</p>}
              </div>

              {discountEnabled && (
                <div>
                  <InputLabel className="mb-2">Discount end date</InputLabel>

                  <DatePicker
                    className="h-11 w-full rounded-2xl border border-gray-200/80 bg-gray-50/55 px-4 text-[11px] text-gray-700 outline-none transition-all focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-500/[0.04] dark:border-white/[0.055] dark:bg-white/[0.02] dark:text-white/65 dark:focus:border-indigo-300/[0.13] 3xl:h-12"
                    selected={project.discountDate ? new Date(project.discountDate) : null}
                    onChange={(date) =>
                      setProject((previousProject) => ({
                        ...previousProject,
                        discountDate: date ? date.toISOString() : "",
                      }))
                    }
                    minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                    placeholderText="Select discount end date"
                  />
                </div>
              )}
            </div>
          </Wrapper>

          {/* Demo */}
          <Wrapper className="group relative my-3 overflow-hidden p-5">
            {/* Wrapper background remains unchanged */}

            <div className="relative z-10">
              <InputTitle className="mb-4">Demo</InputTitle>

              <InputLabel className="mb-2">Live demo URL</InputLabel>

              <Input type="text" name="urllink" placeholder="https://your-project-demo.com" value={urllink} handleChange={handleInputChange} />
            </div>
          </Wrapper>

          {/* Highlights */}
          <Wrapper className="group relative my-3 overflow-hidden p-5">
            {/* Wrapper background remains unchanged */}

            <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-amber-500/[0.012] blur-[80px]" />

            <div className="relative z-10">
              <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
                <InputTitle className="mb-1">Highlights</InputTitle>

                <p className="text-[9px] text-gray-400 dark:text-white/25">Add the main benefits and features of the project.</p>
              </div>

              <div className="space-y-3">
                {highlights.map((highlight, index) => (
                  <div key={index}>
                    <div className="relative">
                      <input
                        type="text"
                        name={`highlight-${index}`}
                        className={`${inputClassName} w-full !rounded-2xl pl-11 pr-20 ${
                          highlightErrors[index] ? "!border-rose-500/70 dark:!border-rose-300/40" : "!border-gray-200/80 dark:!border-white/[0.055]"
                        } !bg-gray-50/55 dark:!bg-white/[0.018]`}
                        placeholder="Write a main project highlight"
                        value={highlight}
                        onChange={(event) => handleHighlightChange(index, event.target.value)}
                        onBlur={validateHighlights}
                      />

                      <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full 3xl:size-10">
                        <IoIosCheckmarkCircle size={23} className={highlight.trim() ? "text-emerald-500 dark:text-emerald-200/70" : "text-gray-400 dark:text-white/20"} />
                      </span>

                      {highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="absolute right-10 top-1 flex size-9 items-center justify-center rounded-full text-rose-500 transition-all hover:bg-rose-500/[0.08] dark:text-rose-200/70"
                          title="Remove highlight"
                          aria-label="Remove highlight"
                        >
                          <FaCircleMinus size={18} />
                        </button>
                      )}

                      {index === highlights.length - 1 && (
                        <button
                          type="button"
                          onClick={addHighlight}
                          className="absolute right-1 top-1 flex size-9 items-center justify-center rounded-full text-blue-500 transition-all hover:bg-blue-500/[0.08] dark:text-blue-200/70"
                          title="Add another highlight"
                          aria-label="Add another highlight"
                        >
                          <FaCirclePlus size={18} />
                        </button>
                      )}
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-3 px-2">
                      {highlightErrors[index] ? <p className="text-[9px] font-medium text-rose-600 dark:text-rose-200/75">{highlightErrors[index]}</p> : <span />}

                      <span className="text-[8px] tabular-nums text-gray-400 dark:text-white/20">{highlight.length}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Wrapper>

          <ProjectToolsSection formats={formats} setProject={setProject} formatError={formatError} setFormatError={setFormatError} />

          <div className="h-16" />
        </aside>
      </section>
    </>
  );
};
