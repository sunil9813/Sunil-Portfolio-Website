import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { Tooltip } from "@material-tailwind/react";
import TagsInput from "react-tagsinput";

import { CiCircleQuestion } from "react-icons/ci";
import { HiOutlineBookOpen, HiOutlineDocumentText, HiOutlinePhoto, HiOutlineVideoCamera } from "react-icons/hi2";
import { IoCameraSharp, IoVideocam } from "react-icons/io5";
import { MdClose } from "react-icons/md";

import { createChapter, getAllChapter } from "@/redux/slices/universityStructure/chapterSlice";
import Editor from "@/textEditor/Editor";
import { inputClassName } from "@/utils";
import { GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, Wrapper } from "@/routes";
import { CourseDropDown } from "../StructureAcademicDropDown";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";

const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 10 * 1024 * 1024 * 1024;

const ALLOWED_IMAGE_FORMATS = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const ALLOWED_VIDEO_FORMATS = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"];

const initialState = {
  title: "",
  metaTitle: "",
  metaDescription: "",
  subject: "",
  tags: [],
};

const revokeObjectUrl = (url) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const formatFileSize = (size = 0) => {
  const sizeInMb = size / (1024 * 1024);

  if (sizeInMb >= 1024) {
    return `${(sizeInMb / 1024).toFixed(2)} GB`;
  }

  return `${sizeInMb.toFixed(2)} MB`;
};

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") {
    return error;
  }

  return error?.message || error?.error || error?.data?.message || fallback;
};

export const CreateChapterr = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [groupId] = useState(() => uuidv4());

  const [chapter, setChapter] = useState(initialState);
  const [description, setDescription] = useState("");
  const [subheadings, setSubheadings] = useState([""]);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [courseNavigator, setCourseNavigator] = useState({ chapters: [], total: 0 });
  const [isNavigatorLoading, setIsNavigatorLoading] = useState(false);
  const [navigatorError, setNavigatorError] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");

  const [titleError, setTitleError] = useState("");
  const [metaTitleError, setMetaTitleError] = useState("");
  const [metaDescError, setMetaDescError] = useState("");
  const [tagError, setTagError] = useState("");
  const [subheadingError, setSubheadingError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { title, metaTitle, metaDescription, tags } = chapter;
  const existingChapters = courseNavigator.chapters || [];
  const nextChapterOrder = existingChapters.length + 1;

  useEffect(() => {
    return () => {
      revokeObjectUrl(thumbnailPreview);
      revokeObjectUrl(videoPreview);
    };
  }, [thumbnailPreview, videoPreview]);

  useEffect(() => {
    const fetchCourseNavigator = async () => {
      if (!selectedSubject?.slug) {
        setCourseNavigator({ chapters: [], total: 0 });
        setNavigatorError("");
        return;
      }

      try {
        setIsNavigatorLoading(true);
        setNavigatorError("");

        const response = await fetch(`${REACT_APP_BACKEND_URL}/subject/${selectedSubject.slug}/chapters`, {
          credentials: "include",
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || payload?.error || "Course navigator could not be loaded.");
        }

        setCourseNavigator({
          chapters: Array.isArray(payload?.chapters) ? payload.chapters : [],
          total: payload?.total || 0,
        });
      } catch (error) {
        setCourseNavigator({ chapters: [], total: 0 });
        setNavigatorError(error.message || "Course navigator could not be loaded.");
      } finally {
        setIsNavigatorLoading(false);
      }
    };

    fetchCourseNavigator();
  }, [selectedSubject?.slug]);

  const processThumbnail = useCallback((selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (!ALLOWED_IMAGE_FORMATS.includes(selectedFile.type)) {
      toast.error("Thumbnail must be a PNG, JPEG, JPG, or WEBP image.");
      return;
    }

    if (selectedFile.size > MAX_THUMBNAIL_SIZE) {
      toast.error("Thumbnail file size exceeds the 10MB limit.");
      return;
    }

    setThumbnailPreview((currentPreview) => {
      revokeObjectUrl(currentPreview);

      return URL.createObjectURL(selectedFile);
    });

    setThumbnail(selectedFile);
  }, []);

  const processVideo = useCallback((selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (!ALLOWED_VIDEO_FORMATS.includes(selectedFile.type)) {
      toast.error("Video must be an MP4, MOV, AVI, MKV, or WEBM file.");
      return;
    }

    if (selectedFile.size > MAX_VIDEO_SIZE) {
      toast.error("Video file size exceeds the 10GB limit.");
      return;
    }

    setVideoPreview((currentPreview) => {
      revokeObjectUrl(currentPreview);

      return URL.createObjectURL(selectedFile);
    });

    setVideo(selectedFile);
  }, []);

  const handleThumbnailChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      processThumbnail(selectedFile);
    }

    event.target.value = "";
  };

  const handleVideoChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      processVideo(selectedFile);
    }

    event.target.value = "";
  };

  const handleDropThumbnail = useCallback(
    (event) => {
      event.preventDefault();

      const selectedFile = event.dataTransfer.files?.[0];

      if (selectedFile) {
        processThumbnail(selectedFile);
      }
    },
    [processThumbnail],
  );

  const handleDropVideo = useCallback(
    (event) => {
      event.preventDefault();

      const selectedFile = event.dataTransfer.files?.[0];

      if (selectedFile) {
        processVideo(selectedFile);
      }
    },
    [processVideo],
  );

  const handleRemoveThumbnail = (event) => {
    event.preventDefault();
    event.stopPropagation();

    revokeObjectUrl(thumbnailPreview);

    setThumbnail(null);
    setThumbnailPreview("");
  };

  const handleRemoveVideo = (event) => {
    event.preventDefault();
    event.stopPropagation();

    revokeObjectUrl(videoPreview);

    setVideo(null);
    setVideoPreview("");
  };

  const handleTitleChange = (event) => {
    const value = event.target.value;

    setChapter((previousChapter) => ({
      ...previousChapter,
      title: value,
    }));

    setTitleError(value.length > 100 ? "Chapter title cannot exceed 100 characters." : "");
  };

  const handleMetaTitleChange = (event) => {
    const value = event.target.value;

    setChapter((previousChapter) => ({
      ...previousChapter,
      metaTitle: value,
    }));

    setMetaTitleError(value.length > 250 ? "Meta title cannot exceed 250 characters." : "");
  };

  const handleMetaDescriptionChange = (event) => {
    const value = event.target.value;

    setChapter((previousChapter) => ({
      ...previousChapter,
      metaDescription: value,
    }));

    setMetaDescError(value.length > 160 ? "Meta description cannot exceed 160 characters." : "");
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

    setChapter((previousChapter) => ({
      ...previousChapter,
      tags: cleanedTags,
    }));
  };

  const handleSubjectChange = (selectedCourse) => {
    setSelectedSubject(selectedCourse || null);

    setChapter((previousChapter) => ({
      ...previousChapter,
      subject: selectedCourse?._id || "",
    }));
  };

  const handleSubheadingChange = (index, value) => {
    setSubheadings((previousSubheadings) => previousSubheadings.map((subheading, subheadingIndex) => (subheadingIndex === index ? value : subheading)));
    setSubheadingError("");
  };

  const handleAddSubheading = () => {
    setSubheadings((previousSubheadings) => [...previousSubheadings, ""]);
  };

  const handleRemoveSubheading = (index) => {
    setSubheadings((previousSubheadings) => {
      if (previousSubheadings.length === 1) {
        return [""];
      }

      return previousSubheadings.filter((_, subheadingIndex) => subheadingIndex !== index);
    });

    setSubheadingError("");
  };

  const getCleanSubheadings = () => {
    const cleanedSubheadings = subheadings.map((subheading) => subheading.trim()).filter(Boolean);
    const normalizedSubheadings = cleanedSubheadings.map((subheading) => subheading.toLowerCase());
    const hasDuplicate = normalizedSubheadings.some((subheading, index) => normalizedSubheadings.indexOf(subheading) !== index);

    if (hasDuplicate) {
      return {
        data: null,
        error: "Subheadings cannot be duplicates.",
      };
    }

    const isTooLong = cleanedSubheadings.some((subheading) => subheading.length > 120);

    if (isTooLong) {
      return {
        data: null,
        error: "Each subheading must be 120 characters or less.",
      };
    }

    setSubheadingError("");

    return {
      data: cleanedSubheadings.map((subheading, index) => ({
        title: subheading,
        order: index + 1,
      })),
      error: "",
    };
  };

  const resetForm = () => {
    revokeObjectUrl(thumbnailPreview);
    revokeObjectUrl(videoPreview);

    setChapter(initialState);
    setDescription("");
    setSubheadings([""]);
    setSelectedSubject(null);
    setCourseNavigator({ chapters: [], total: 0 });
    setNavigatorError("");

    setThumbnail(null);
    setThumbnailPreview("");

    setVideo(null);
    setVideoPreview("");

    setTitleError("");
    setMetaTitleError("");
    setMetaDescError("");
    setTagError("");
    setSubheadingError("");
  };

  const handleCreate = async () => {
    if (isSubmitting) {
      return;
    }
    if (selectedSubject?.resourceFile?.file?.filePath) {
      toast.error("This course uses a PDF resource, so chapters cannot be created for it.");
      return;
    }
    if (!title.trim()) {
      toast.error("Chapter title is required.");
      return;
    }

    if (title.length > 100) {
      toast.error("Chapter title cannot exceed 100 characters.");
      return;
    }

    if (metaTitle.length > 250) {
      toast.error("Meta title cannot exceed 250 characters.");
      return;
    }

    if (!metaDescription.trim()) {
      toast.error("Meta description is required.");
      return;
    }

    if (metaDescription.length > 160) {
      toast.error("Meta description cannot exceed 160 characters.");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }

    if (!selectedSubject?._id) {
      toast.error("Please select a course.");
      return;
    }

    if (tagError) {
      toast.error(tagError);
      return;
    }

    const { data: cleanSubheadings, error: cleanSubheadingError } = getCleanSubheadings();

    if (cleanSubheadingError) {
      setSubheadingError(cleanSubheadingError);
      toast.error(cleanSubheadingError);
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("metaTitle", metaTitle.trim());
    formData.append("description", description.trim());
    formData.append("metaDescription", metaDescription.trim());
    formData.append("groupId", groupId);
    formData.append("subject", selectedSubject._id);
    formData.append("order", String(nextChapterOrder));

    if (cleanSubheadings.length > 0) {
      formData.append("subheadings", JSON.stringify(cleanSubheadings));
    }

    if (tags.length > 0) {
      formData.append("tags", JSON.stringify(tags.map((tag) => ({ tag }))));
    }

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    if (video) {
      formData.append("video", video);
    }

    try {
      setIsSubmitting(true);

      await dispatch(createChapter(formData)).unwrap();

      await dispatch(getAllChapter()).unwrap();

      resetForm();

      toast.success("Chapter created successfully.");

      navigate("/all-courses");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create chapter."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    revokeObjectUrl(thumbnailPreview);
    revokeObjectUrl(videoPreview);

    navigate("/all-Chapter");
  };

  return (
    <>
      <StickyHeader>
        <div>
          <HeadingTwo>New Chapter</HeadingTwo>

          <p className="mt-1 hidden text-[9px] text-gray-400 dark:text-white/25 sm:block">Create and publish a new course chapter.</p>
        </div>

        <div className="flex items-center gap-2">
          <GhostButton type="button" disabled={isSubmitting} onClick={handleCancel}>
            Cancel
          </GhostButton>

          <TertiaryButton type="button" disabled={isSubmitting} onClick={handleCreate}>
            {isSubmitting ? "Publishing..." : "Publish now"}
          </TertiaryButton>
        </div>
      </StickyHeader>

      <section className="mb-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.75fr)]">
        {/* Main chapter information */}
        <div className="min-w-0">
          <Wrapper className="relative z-30 !overflow-visible p-5 sm:p-6">
            {/* Decorative effects remain clipped separately */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
              <div className="absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/[0.014] blur-[90px]" />

              <div className="absolute -bottom-24 -left-24 size-64 rounded-full bg-cyan-500/[0.012] blur-[90px]" />

              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.012),transparent_40%,transparent_78%,rgba(255,255,255,0.003))]" />
            </div>

            <div className="relative z-10">
              {/* Section heading */}
              <div className="mb-6 flex flex-col gap-3 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.075] text-indigo-700 shadow-[0_10px_26px_rgba(79,70,229,0.08)] dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                    <HiOutlineBookOpen size={21} />
                  </div>

                  <div>
                    <InputTitle className="mb-1">Chapter details</InputTitle>

                    <p className="text-[9px] leading-4 text-gray-400 dark:text-white/25">Add the chapter title, search metadata and related course.</p>
                  </div>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-500/[0.05] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.11em] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.03] dark:text-indigo-200/60">
                  <span className="size-1.5 rounded-full bg-indigo-500 dark:bg-indigo-300/70" />
                  Chapter authoring
                </span>
              </div>

              {/* Course dropdown */}
              <div className="relative z-[80] mb-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <InputLabel>Course</InputLabel>

                  <span className="rounded-full border border-cyan-300/20 bg-cyan-500/[0.05] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.08em] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.03] dark:text-cyan-200/60">
                    Required
                  </span>
                </div>

                <CourseDropDown
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  disabled={isSubmitting}
                  placeholder="Select Course"
                  className="dark:!border-white/[0.07] dark:!bg-white/[0.022]"
                />
              </div>

              {/* Title fields */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <InputLabel>Chapter name</InputLabel>

                      <Tooltip
                        className="rounded-lg border border-white/[0.08] bg-[#11151d] px-3 py-2 text-[10px] text-white/90 shadow-xl"
                        content="Maximum 100 characters. No HTML or emoji allowed."
                        placement="right"
                      >
                        <button type="button" aria-label="Chapter name information" className="text-gray-400 transition-colors hover:text-indigo-500 dark:text-white/25 dark:hover:text-indigo-200/70">
                          <CiCircleQuestion />
                        </button>
                      </Tooltip>
                    </div>

                    <span className={`text-[9px] font-medium tabular-nums ${title.length >= 90 ? "text-rose-600 dark:text-rose-200/75" : "text-gray-400 dark:text-white/20"}`}>{title.length}/100</span>
                  </div>

                  <Input type="text" name="title" value={title} handleChange={handleTitleChange} placeholder="Building a Responsive Navbar" disabled={isSubmitting} />

                  {titleError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{titleError}</p>}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <InputLabel>Meta title</InputLabel>

                      <Tooltip
                        className="rounded-lg border border-white/[0.08] bg-[#11151d] px-3 py-2 text-[10px] text-white/90 shadow-xl"
                        content="Maximum 250 characters. No HTML or emoji allowed."
                        placement="right"
                      >
                        <button type="button" aria-label="Meta title information" className="text-gray-400 transition-colors hover:text-indigo-500 dark:text-white/25 dark:hover:text-indigo-200/70">
                          <CiCircleQuestion />
                        </button>
                      </Tooltip>
                    </div>

                    <span className={`text-[9px] font-medium tabular-nums ${metaTitle.length >= 235 ? "text-rose-600 dark:text-rose-200/75" : "text-gray-400 dark:text-white/20"}`}>
                      {metaTitle.length}/250
                    </span>
                  </div>

                  <Input type="text" name="metaTitle" value={metaTitle} handleChange={handleMetaTitleChange} placeholder="Responsive Navbar with Tailwind CSS" disabled={isSubmitting} />

                  {metaTitleError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{metaTitleError}</p>}
                </div>
              </div>

              {/* Meta description */}
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

                  <span className={`text-[9px] font-medium tabular-nums ${metaDescription.length >= 150 ? "text-rose-600 dark:text-rose-200/75" : "text-gray-400 dark:text-white/20"}`}>
                    {metaDescription.length}/160
                  </span>
                </div>

                <textarea
                  name="metaDescription"
                  value={metaDescription}
                  onChange={handleMetaDescriptionChange}
                  disabled={isSubmitting}
                  rows={4}
                  placeholder="Describe what students will learn in this chapter."
                  className={`${inputClassName} !h-auto min-h-28 w-full resize-none !rounded-2xl px-4 py-3 text-[11px] leading-5 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-500/[0.04] disabled:cursor-not-allowed disabled:opacity-50 dark:!border-white/[0.055] dark:!bg-white/[0.018] dark:text-white/65 dark:placeholder:text-white/20 dark:focus:border-indigo-300/[0.13]`}
                />

                {metaDescError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{metaDescError}</p>}
              </div>

              {/* Tags */}
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <InputLabel>Tags</InputLabel>

                  <span className="text-[9px] font-medium tabular-nums text-gray-400 dark:text-white/20">{tags.join("").length}/500</span>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-gray-50/55 p-1 transition-all focus-within:border-indigo-400/35 focus-within:ring-4 focus-within:ring-indigo-500/[0.04] dark:border-white/[0.055] dark:bg-white/[0.018] dark:focus-within:border-indigo-300/[0.13]">
                  <TagsInput
                    className={`${inputClassName} !h-auto !min-h-28 !border-0 !bg-transparent !px-2 !pt-2 [&_.react-tagsinput-input]:!m-0 [&_.react-tagsinput-input]:!h-8 [&_.react-tagsinput-input]:!bg-transparent [&_.react-tagsinput-input]:!text-[11px] [&_.react-tagsinput-input]:!text-gray-700 [&_.react-tagsinput-input]:!outline-none dark:[&_.react-tagsinput-input]:!text-white/65 [&_.react-tagsinput-tag]:!mb-1 [&_.react-tagsinput-tag]:!mr-1.5 [&_.react-tagsinput-tag]:!inline-flex [&_.react-tagsinput-tag]:!items-center [&_.react-tagsinput-tag]:!rounded-full [&_.react-tagsinput-tag]:!border [&_.react-tagsinput-tag]:!border-indigo-300/25 [&_.react-tagsinput-tag]:!bg-indigo-500/[0.07] [&_.react-tagsinput-tag]:!px-2.5 [&_.react-tagsinput-tag]:!py-1 [&_.react-tagsinput-tag]:!text-[9px] [&_.react-tagsinput-tag]:!text-indigo-700 dark:[&_.react-tagsinput-tag]:!border-indigo-300/[0.10] dark:[&_.react-tagsinput-tag]:!bg-indigo-300/[0.045] dark:[&_.react-tagsinput-tag]:!text-indigo-200/70`}
                    value={tags}
                    onChange={handleTagChange}
                    inputProps={{
                      placeholder: "Add tag",
                    }}
                  />
                </div>

                {tagError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{tagError}</p>}
              </div>

              {/* Dynamic course navigator */}
              <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <InputLabel>Course navigator preview</InputLabel>

                    <span className="rounded-full border border-indigo-300/20 bg-indigo-500/[0.05] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.08em] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.03] dark:text-indigo-200/60">
                      API data
                    </span>
                  </div>

                  <div className="min-h-56 rounded-2xl border border-gray-200/80 bg-gray-50/55 p-3 dark:border-white/[0.055] dark:bg-white/[0.018]">
                    {!selectedSubject?._id ? (
                      <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
                        <p className="text-[10px] font-semibold text-gray-500 dark:text-white/35">Select a course first.</p>
                        <p className="mt-1 text-[8px] leading-4 text-gray-400 dark:text-white/20">After selection, this box fetches existing chapters and subheadings from the backend.</p>
                      </div>
                    ) : isNavigatorLoading ? (
                      <div className="flex min-h-48 items-center justify-center">
                        <span className="size-5 animate-spin rounded-full border-2 border-indigo-300/20 border-t-indigo-400" />
                        <span className="ml-2 text-[10px] font-medium text-gray-400 dark:text-white/25">Loading navigator...</span>
                      </div>
                    ) : navigatorError ? (
                      <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
                        <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-200/75">{navigatorError}</p>
                      </div>
                    ) : existingChapters.length > 0 ? (
                      <div className="max-h-72 space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/[0.12]">
                        {existingChapters.map((existingChapter, chapterIndex) => {
                          const existingSubheadings = Array.isArray(existingChapter?.subheadings) ? existingChapter.subheadings : [];

                          return (
                            <div key={existingChapter?._id || chapterIndex} className="rounded-2xl border border-white/[0.045] bg-white/[0.018] p-3">
                              <div className="flex items-start gap-3">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-indigo-300/15 bg-indigo-500/[0.07] text-[9px] font-bold text-indigo-200/70">
                                  {String(existingChapter?.order || chapterIndex + 1).padStart(2, "0")}
                                </span>

                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-2 text-[10px] font-semibold leading-4 text-white/65">{existingChapter?.title || `Chapter ${chapterIndex + 1}`}</p>
                                  <p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.1em] text-white/20">Chapter {existingChapter?.order || chapterIndex + 1}</p>

                                  {existingSubheadings.length > 0 && (
                                    <div className="mt-2 space-y-1 border-l border-white/[0.07] pl-3">
                                      {existingSubheadings.map((subheading, subheadingIndex) => (
                                        <p key={subheading?._id || subheading?.slug || subheadingIndex} className="line-clamp-1 text-[9px] font-medium leading-4 text-white/38">
                                          {subheading?.title || `Subheading ${subheadingIndex + 1}`}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
                        <p className="text-[10px] font-semibold text-gray-500 dark:text-white/35">No chapters yet.</p>
                        <p className="mt-1 text-[8px] leading-4 text-gray-400 dark:text-white/20">This new chapter will become Chapter 1.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <InputLabel>Subheadings for this chapter</InputLabel>

                    <span className="rounded-full border border-cyan-300/20 bg-cyan-500/[0.05] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.08em] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.03] dark:text-cyan-200/60">
                      Chapter {nextChapterOrder}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-gray-200/80 bg-gray-50/55 p-3 dark:border-white/[0.055] dark:bg-white/[0.018]">
                    <div className="space-y-2">
                      {subheadings.map((subheading, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-500/[0.06] text-[9px] font-bold text-cyan-700 dark:text-cyan-200/65">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <input
                            type="text"
                            value={subheading}
                            onChange={(event) => handleSubheadingChange(index, event.target.value)}
                            disabled={isSubmitting}
                            maxLength={120}
                            placeholder="Example: Cost Benefit Evaluation techniques"
                            className={`${inputClassName} !h-11 flex-1 !rounded-xl px-3 text-[11px] outline-none transition-all placeholder:text-gray-400 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-500/[0.04] disabled:cursor-not-allowed disabled:opacity-50 dark:!border-white/[0.055] dark:!bg-white/[0.018] dark:text-white/65 dark:placeholder:text-white/20 dark:focus:border-cyan-300/[0.13]`}
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveSubheading(index)}
                            disabled={isSubmitting}
                            title="Remove subheading"
                            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/[0.06] text-rose-600 transition-all hover:bg-rose-500/[0.11] disabled:cursor-not-allowed disabled:opacity-45 dark:border-rose-300/[0.08] dark:text-rose-200/70"
                          >
                            <MdClose size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {subheadingError && <p className="mt-2 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{subheadingError}</p>}

                    <button
                      type="button"
                      onClick={handleAddSubheading}
                      disabled={isSubmitting}
                      className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-500/[0.055] px-3 text-[9px] font-semibold text-cyan-700 transition-all hover:-translate-y-0.5 hover:bg-cyan-500/[0.09] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65"
                    >
                      <span className="text-sm leading-none">+</span>
                      Add subheading
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Wrapper>
        </div>

        {/* Media assets */}
        <aside className="min-w-0 space-y-3">
          {/* Thumbnail */}
          <Wrapper className="group relative overflow-hidden p-5">
            <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-violet-500/[0.014] blur-[80px]" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-500/[0.07] text-violet-700 dark:border-violet-300/[0.09] dark:bg-violet-300/[0.04] dark:text-violet-200/70">
                    <HiOutlinePhoto size={17} />
                  </span>

                  <div>
                    <InputTitle className="mb-1">Thumbnail</InputTitle>

                    <p className="text-[8px] text-gray-400 dark:text-white/25">Optional cover image</p>
                  </div>
                </div>

                <span className="rounded-full border border-gray-200/70 bg-gray-50/60 px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
                  Max 10MB
                </span>
              </div>

              <div
                role="button"
                tabIndex={0}
                aria-label="Upload chapter thumbnail"
                onClick={() => {
                  if (!thumbnailPreview) {
                    thumbnailInputRef.current?.click();
                  }
                }}
                onKeyDown={(event) => {
                  if (!thumbnailPreview && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    thumbnailInputRef.current?.click();
                  }
                }}
                onDrop={handleDropThumbnail}
                onDragOver={(event) => event.preventDefault()}
                className="relative flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/55 text-center transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/[0.025] focus:outline-none focus:ring-4 focus:ring-violet-500/[0.05] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-violet-300/[0.15] dark:hover:bg-violet-300/[0.025]"
              >
                {thumbnailPreview ? (
                  <>
                    <img src={thumbnailPreview} alt="Chapter thumbnail preview" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

                    <div className="absolute bottom-3 left-3 text-left">
                      <p className="max-w-[220px] truncate text-[9px] font-semibold text-white/90">{thumbnail?.name}</p>

                      <p className="mt-0.5 text-[8px] text-white/50">{formatFileSize(thumbnail?.size)}</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      title="Remove thumbnail"
                      aria-label="Remove chapter thumbnail"
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/85 text-white shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:bg-rose-500"
                    >
                      <MdClose size={15} />
                    </button>
                  </>
                ) : (
                  <div className="flex max-w-[250px] flex-col items-center px-5">
                    <span className="flex size-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/[0.07] text-violet-600 shadow-[0_10px_26px_rgba(124,58,237,0.08)] dark:border-violet-300/[0.09] dark:bg-violet-300/[0.04] dark:text-violet-200/70">
                      <IoCameraSharp size={24} />
                    </span>

                    <p className="mt-4 text-[10px] font-semibold text-gray-600 dark:text-white/50">Drop an image here</p>

                    <p className="mt-1.5 text-[8px] leading-4 text-gray-400 dark:text-white/25">PNG, JPG, JPEG or WEBP</p>
                  </div>
                )}

                <input ref={thumbnailInputRef} id="thumbnail" type="file" name="thumbnail" className="hidden" onChange={handleThumbnailChange} accept="image/png,image/jpeg,image/jpg,image/webp" />
              </div>
            </div>
          </Wrapper>

          {/* Video */}
          <Wrapper className="group relative overflow-hidden p-5">
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-56 rounded-full bg-cyan-500/[0.012] blur-[80px]" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70">
                    <HiOutlineVideoCamera size={17} />
                  </span>

                  <div>
                    <InputTitle className="mb-1">Video lesson</InputTitle>

                    <p className="text-[8px] text-gray-400 dark:text-white/25">Optional chapter video</p>
                  </div>
                </div>

                <span className="rounded-full border border-gray-200/70 bg-gray-50/60 px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
                  Max 10GB
                </span>
              </div>

              <div
                role="button"
                tabIndex={0}
                aria-label="Upload chapter video"
                onClick={() => {
                  if (!videoPreview) {
                    videoInputRef.current?.click();
                  }
                }}
                onKeyDown={(event) => {
                  if (!videoPreview && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    videoInputRef.current?.click();
                  }
                }}
                onDrop={handleDropVideo}
                onDragOver={(event) => event.preventDefault()}
                className="relative flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/55 text-center transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/[0.025] focus:outline-none focus:ring-4 focus:ring-cyan-500/[0.05] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-cyan-300/[0.15] dark:hover:bg-cyan-300/[0.025]"
              >
                {videoPreview ? (
                  <>
                    <video src={videoPreview} controls preload="metadata" className="h-full w-full bg-black object-contain" onClick={(event) => event.stopPropagation()}>
                      Your browser does not support the video tag.
                    </video>

                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      title="Remove video"
                      aria-label="Remove chapter video"
                      className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/85 text-white shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:bg-rose-500"
                    >
                      <MdClose size={15} />
                    </button>

                    <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-white/[0.10] bg-black/45 px-2.5 py-1.5 text-left backdrop-blur-xl">
                      <p className="max-w-[210px] truncate text-[8px] font-semibold text-white/85">{video?.name}</p>

                      <p className="mt-0.5 text-[7px] text-white/45">{formatFileSize(video?.size)}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex max-w-[250px] flex-col items-center px-5">
                    <span className="flex size-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-600 shadow-[0_10px_26px_rgba(6,182,212,0.08)] dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70">
                      <IoVideocam size={25} />
                    </span>

                    <p className="mt-4 text-[10px] font-semibold text-gray-600 dark:text-white/50">Drop a video here</p>

                    <p className="mt-1.5 text-[8px] leading-4 text-gray-400 dark:text-white/25">MP4, MOV, AVI, MKV or WEBM</p>
                  </div>
                )}

                <input
                  ref={videoInputRef}
                  id="video"
                  type="file"
                  name="video"
                  className="hidden"
                  onChange={handleVideoChange}
                  accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
                />
              </div>
            </div>
          </Wrapper>
        </aside>
      </section>

      {/* Description editor */}
      <Wrapper className="group relative mb-5 overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-28 -bottom-28 size-80 rounded-full bg-indigo-500/[0.013] blur-[105px]" />

        <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-cyan-500/[0.010] blur-[90px]" />

        <div className="relative z-10">
          <div className="mb-5 flex flex-col gap-3 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                <HiOutlineDocumentText size={19} />
              </span>

              <div>
                <InputTitle className="mb-1">Chapter description</InputTitle>

                <p className="text-[9px] leading-4 text-gray-400 dark:text-white/25">Write the complete lesson content and explanation for this chapter.</p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200/70 bg-gray-50/60 px-3 py-1.5 text-[8px] font-medium text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
              <span className={`size-1.5 rounded-full ${description.trim() ? "bg-emerald-500 dark:bg-emerald-300/70" : "bg-gray-400 dark:bg-white/25"}`} />

              {description.trim() ? "Content added" : "Content required"}
            </span>
          </div>

          <div className="min-h-[440px] rounded-[24px] border border-gray-200/70 bg-gray-50/35 p-2 shadow-inner dark:border-white/[0.045] dark:bg-white/[0.014]">
            <Editor customId={groupId} value={description} onChange={setDescription} folderName="chapter/description" folder="chapter" subfolder="description" />
          </div>
        </div>
      </Wrapper>
    </>
  );
};
