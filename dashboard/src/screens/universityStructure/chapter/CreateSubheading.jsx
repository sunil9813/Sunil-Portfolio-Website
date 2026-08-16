import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import TagsInput from "react-tagsinput";

import { HiOutlineBookOpen, HiOutlineDocumentText, HiOutlinePhoto, HiOutlineVideoCamera } from "react-icons/hi2";
import { IoCameraSharp, IoVideocam } from "react-icons/io5";
import { MdClose } from "react-icons/md";

import { createSubheading } from "@/redux/slices/universityStructure/chapterSlice";
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
  if (typeof error === "string") return error;

  return error?.message || error?.error || error?.data?.message || fallback;
};

export const CreateSubheading = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [groupId] = useState(() => uuidv4());
  const [form, setForm] = useState(initialState);
  const [description, setDescription] = useState("");

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [selectedParentSubheadingId, setSelectedParentSubheadingId] = useState("");
  const [courseNavigator, setCourseNavigator] = useState({ chapters: [], total: 0 });
  const [isNavigatorLoading, setIsNavigatorLoading] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagError, setTagError] = useState("");

  const { title, metaTitle, metaDescription, tags } = form;
  const chapters = courseNavigator.chapters || [];
  const selectedChapter = chapters.find((chapter) => chapter?._id === selectedChapterId);
  const selectedParentSubheading = selectedChapter?.subheadings?.find((subheading) => subheading?._id === selectedParentSubheadingId);
  const nextSubheadingOrder = selectedParentSubheading ? (selectedParentSubheading?.children?.length || 0) + 1 : (selectedChapter?.subheadings?.length || 0) + 1;
  const createLevelLabel = selectedParentSubheadingId ? "Nested subheading" : "Chapter subheading";

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
        setSelectedChapterId("");
        return;
      }

      try {
        setIsNavigatorLoading(true);

        const response = await fetch(`${REACT_APP_BACKEND_URL}/subject/${selectedSubject.slug}/chapters`, {
          credentials: "include",
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || payload?.error || "Course chapters could not be loaded.");
        }

        const fetchedChapters = Array.isArray(payload?.chapters) ? payload.chapters : [];
        setCourseNavigator({ chapters: fetchedChapters, total: payload?.total || fetchedChapters.length });
        setSelectedChapterId(fetchedChapters[0]?._id || "");
        setSelectedParentSubheadingId("");
      } catch (error) {
        setCourseNavigator({ chapters: [], total: 0 });
        setSelectedChapterId("");
        setSelectedParentSubheadingId("");
        toast.error(error.message || "Course chapters could not be loaded.");
      } finally {
        setIsNavigatorLoading(false);
      }
    };

    fetchCourseNavigator();
  }, [selectedSubject?.slug]);

  const processThumbnail = useCallback((selectedFile) => {
    if (!selectedFile) return;

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
    if (!selectedFile) return;

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

  const handleChange = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleTagChange = (newTags) => {
    const cleanedTags = newTags.map((tag) => tag.trim()).filter(Boolean);
    const normalizedTags = cleanedTags.map((tag) => tag.toLowerCase());
    const hasDuplicate = normalizedTags.some((tag, index) => normalizedTags.indexOf(tag) !== index);

    if (cleanedTags.join("").length > 500) {
      setTagError("Tags exceed the maximum length of 500 characters.");
      return;
    }

    if (hasDuplicate) {
      setTagError("Tags cannot be duplicates.");
      return;
    }

    setTagError("");
    handleChange("tags", cleanedTags);
  };

  const resetForm = () => {
    revokeObjectUrl(thumbnailPreview);
    revokeObjectUrl(videoPreview);
    setForm(initialState);
    setDescription("");
    setThumbnail(null);
    setThumbnailPreview("");
    setVideo(null);
    setVideoPreview("");
    setTagError("");
  };

  const handleCreate = async () => {
    if (isSubmitting) return;

    if (!selectedSubject?._id) {
      toast.error("Please select a course.");
      return;
    }

    if (!selectedChapterId) {
      toast.error("Please select a chapter.");
      return;
    }

    if (!title.trim()) {
      toast.error("Subheading title is required.");
      return;
    }

    if (title.length > 120) {
      toast.error("Subheading title cannot exceed 120 characters.");
      return;
    }

    if (metaTitle.length > 250) {
      toast.error("Meta title cannot exceed 250 characters.");
      return;
    }

    if (metaDescription.length > 160) {
      toast.error("Meta description cannot exceed 160 characters.");
      return;
    }

    if (!description.trim()) {
      toast.error("Subheading content is required.");
      return;
    }

    if (tagError) {
      toast.error(tagError);
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("metaTitle", metaTitle.trim());
    formData.append("metaDescription", metaDescription.trim());
    formData.append("description", description.trim());
    formData.append("order", String(nextSubheadingOrder));

    if (selectedParentSubheadingId) {
      formData.append("parentSubheadingId", selectedParentSubheadingId);
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
      const createdResponse = await dispatch(createSubheading({ chapterId: selectedChapterId, formData })).unwrap();
      resetForm();

      if (createdResponse?.chapter?._id) {
        setCourseNavigator((currentNavigator) => ({
          ...currentNavigator,
          chapters: (currentNavigator.chapters || []).map((chapter) => (chapter?._id === createdResponse.chapter._id ? createdResponse.chapter : chapter)),
        }));
        setSelectedChapterId(createdResponse.chapter._id);
        setSelectedParentSubheadingId(createdResponse.parentSubheadingId ? String(createdResponse.parentSubheadingId) : "");
      }

      const response = await fetch(`${REACT_APP_BACKEND_URL}/subject/${selectedSubject.slug}/chapters`, {
        credentials: "include",
      });
      const payload = await response.json();
      const fetchedChapters = Array.isArray(payload?.chapters) ? payload.chapters : [];
      setCourseNavigator({ chapters: fetchedChapters, total: payload?.total || fetchedChapters.length });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create subheading."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StickyHeader>
        <div>
          <HeadingTwo>New Subheading</HeadingTwo>
          <p className="mt-1 hidden text-[9px] text-gray-400 dark:text-white/25 sm:block">Create level 2 or level 3 course content inside a chapter.</p>
        </div>

        <div className="flex items-center gap-2">
          <GhostButton type="button" disabled={isSubmitting} onClick={() => navigate("/all-chapter")}>
            Cancel
          </GhostButton>

          <TertiaryButton type="button" disabled={isSubmitting} onClick={handleCreate}>
            {isSubmitting ? "Creating..." : "Create now"}
          </TertiaryButton>
        </div>
      </StickyHeader>

      <section className="mb-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.75fr)]">
        <div className="min-w-0 space-y-3">
          <Wrapper className="relative z-30 !overflow-visible p-5 sm:p-6">
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3 border-b border-gray-200/70 pb-5 dark:border-white/[0.05]">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.075] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                  <HiOutlineBookOpen size={21} />
                </span>

                <div>
                  <InputTitle className="mb-1">Select course and chapter</InputTitle>
                  <p className="text-[9px] leading-4 text-gray-400 dark:text-white/25">Course dropdown loads chapters from API, then choose exactly where this new item will be created.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="relative z-[90]">
                  <InputLabel className="mb-2">Course</InputLabel>
                  <CourseDropDown value={selectedSubject} onChange={setSelectedSubject} disabled={isSubmitting} placeholder="Select Course" className="dark:!border-white/[0.07] dark:!bg-white/[0.022]" />
                </div>

                <div>
                  <InputLabel className="mb-2">Chapter</InputLabel>
                  <select
                    value={selectedChapterId}
                    onChange={(event) => {
                      setSelectedChapterId(event.target.value);
                      setSelectedParentSubheadingId("");
                    }}
                    disabled={isSubmitting || isNavigatorLoading || chapters.length === 0}
                    className={`${inputClassName} !h-11 w-full !rounded-xl !bg-transparent px-3 text-[11px] capitalize outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:!border-white/[0.055] dark:!bg-white/[0.018] dark:text-white/65`}
                  >
                    <option className="dark:bg-black" value="">
                      {isNavigatorLoading ? "Loading chapters..." : "Select Chapter"}
                    </option>

                    {chapters.map((chapter, index) => (
                      <option className="dark:bg-black" key={chapter?._id} value={chapter?._id}>
                        {chapter?.order || index + 1}. {chapter?.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <InputLabel>Create under</InputLabel>

                  <span className="rounded-full border border-cyan-300/20 bg-cyan-500/[0.05] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.08em] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.03] dark:text-cyan-200/60">
                    Level {selectedParentSubheadingId ? "3" : "2"}
                  </span>
                </div>

                <select
                  value={selectedParentSubheadingId}
                  onChange={(event) => setSelectedParentSubheadingId(event.target.value)}
                  disabled={isSubmitting || !selectedChapterId}
                  className={`${inputClassName} !h-11 w-full !rounded-xl !bg-transparent px-3 text-[11px] outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:!border-white/[0.055] dark:!bg-white/[0.018] dark:text-white/65`}
                >
                  <option className="dark:bg-black" value="">
                    Create directly under selected chapter
                  </option>

                  {selectedChapter?.subheadings?.map((subheading, index) => (
                    <option className="dark:bg-black" key={subheading?._id || subheading?.slug || index} value={subheading?._id}>
                      Create inside {index + 1}. {subheading?.title}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-[8px] leading-4 text-gray-400 dark:text-white/25">
                  You are creating: {createLevelLabel}. Choose the chapter to create a main subheading, or choose an existing subheading to create a nested one inside it.
                </p>
              </div>

              {selectedChapter && (
                <div className="mt-5 rounded-2xl border border-white/[0.055] bg-white/[0.018] p-3">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-white/25">Existing navigator tree</p>

                  {selectedChapter?.subheadings?.length > 0 ? (
                    <div className="mt-3 max-h-48 space-y-2 overflow-y-auto border-l border-white/[0.07] pl-3">
                      {selectedChapter.subheadings.map((subheading, index) => (
                        <div key={subheading?._id || subheading?.slug || index}>
                          <p className="line-clamp-1 text-[9px] font-semibold text-white/48">
                            {index + 1}. {subheading?.title}
                          </p>

                          {subheading?.children?.length > 0 && (
                            <div className="mt-1 space-y-1 border-l border-white/[0.06] pl-3">
                              {subheading.children.map((childSubheading, childIndex) => (
                                <p key={childSubheading?._id || childSubheading?.slug || childIndex} className="line-clamp-1 text-[8px] font-medium text-white/32">
                                  {index + 1}.{childIndex + 1} {childSubheading?.title}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-[9px] text-white/25">No subheadings yet. This will become level 2 item {nextSubheadingOrder}.</p>
                  )}
                </div>
              )}
            </div>
          </Wrapper>

          <Wrapper className="p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-gray-200/70 pb-5 dark:border-white/[0.05]">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/[0.075] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70">
                <HiOutlineDocumentText size={21} />
              </span>

              <div>
                <InputTitle className="mb-1">Subheading details</InputTitle>
                <p className="text-[9px] leading-4 text-gray-400 dark:text-white/25">Same idea as chapter creation, but saved inside the selected chapter.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <InputLabel className="mb-2">Subheading title</InputLabel>
                <Input type="text" name="title" value={title} handleChange={(event) => handleChange("title", event.target.value)} placeholder="Example: Cost Benefit Evaluation techniques" disabled={isSubmitting} />
              </div>

              <div>
                <InputLabel className="mb-2">Meta title</InputLabel>
                <Input type="text" name="metaTitle" value={metaTitle} handleChange={(event) => handleChange("metaTitle", event.target.value)} placeholder="SEO title for this subheading" disabled={isSubmitting} />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <InputLabel>Meta description</InputLabel>
                <span className={`text-[9px] font-medium tabular-nums ${metaDescription.length >= 150 ? "text-rose-600 dark:text-rose-200/75" : "text-gray-400 dark:text-white/20"}`}>
                  {metaDescription.length}/160
                </span>
              </div>

              <textarea
                value={metaDescription}
                onChange={(event) => handleChange("metaDescription", event.target.value)}
                disabled={isSubmitting}
                rows={3}
                placeholder="Describe what students will learn in this subheading."
                className={`${inputClassName} !h-auto min-h-24 w-full resize-none !rounded-2xl px-4 py-3 text-[11px] leading-5 outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:!border-white/[0.055] dark:!bg-white/[0.018] dark:text-white/65`}
              />
            </div>

            <div className="mt-5">
              <InputLabel className="mb-2">Tags</InputLabel>
              <div className="rounded-2xl border border-gray-200/80 bg-gray-50/55 p-1 dark:border-white/[0.055] dark:bg-white/[0.018]">
                <TagsInput
                  className={`${inputClassName} !h-auto !min-h-24 !border-0 !bg-transparent !px-2 !pt-2 [&_.react-tagsinput-input]:!m-0 [&_.react-tagsinput-input]:!h-8 [&_.react-tagsinput-input]:!bg-transparent [&_.react-tagsinput-input]:!text-[11px] [&_.react-tagsinput-input]:!outline-none dark:[&_.react-tagsinput-input]:!text-white/65 [&_.react-tagsinput-tag]:!mb-1 [&_.react-tagsinput-tag]:!mr-1.5 [&_.react-tagsinput-tag]:!inline-flex [&_.react-tagsinput-tag]:!rounded-full [&_.react-tagsinput-tag]:!border [&_.react-tagsinput-tag]:!border-cyan-300/25 [&_.react-tagsinput-tag]:!bg-cyan-500/[0.07] [&_.react-tagsinput-tag]:!px-2.5 [&_.react-tagsinput-tag]:!py-1 [&_.react-tagsinput-tag]:!text-[9px] [&_.react-tagsinput-tag]:!text-cyan-700 dark:[&_.react-tagsinput-tag]:!text-cyan-200/70`}
                  value={tags}
                  onChange={handleTagChange}
                  inputProps={{ placeholder: "Add tag" }}
                />
              </div>

              {tagError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{tagError}</p>}
            </div>
          </Wrapper>
        </div>

        <aside className="min-w-0 space-y-3">
          <Wrapper className="group relative overflow-hidden p-5">
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
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => !thumbnailPreview && thumbnailInputRef.current?.click()}
              onDrop={(event) => {
                event.preventDefault();
                processThumbnail(event.dataTransfer.files?.[0]);
              }}
              onDragOver={(event) => event.preventDefault()}
              className="relative flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/55 text-center dark:border-white/[0.08] dark:bg-white/[0.018]"
            >
              {thumbnailPreview ? (
                <>
                  <img src={thumbnailPreview} alt="Subheading thumbnail preview" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => { revokeObjectUrl(thumbnailPreview); setThumbnail(null); setThumbnailPreview(""); }} className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-xl bg-rose-500/85 text-white">
                    <MdClose size={15} />
                  </button>
                  <p className="absolute bottom-3 left-3 max-w-[220px] truncate text-[9px] font-semibold text-white/90">{thumbnail?.name}</p>
                </>
              ) : (
                <div className="flex max-w-[250px] flex-col items-center px-5">
                  <span className="flex size-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/[0.07] text-violet-600 dark:text-violet-200/70">
                    <IoCameraSharp size={24} />
                  </span>
                  <p className="mt-4 text-[10px] font-semibold text-gray-600 dark:text-white/50">Drop an image here</p>
                  <p className="mt-1.5 text-[8px] leading-4 text-gray-400 dark:text-white/25">PNG, JPG, JPEG or WEBP</p>
                </div>
              )}

              <input ref={thumbnailInputRef} type="file" className="hidden" onChange={(event) => { processThumbnail(event.target.files?.[0]); event.target.value = ""; }} accept="image/png,image/jpeg,image/jpg,image/webp" />
            </div>
          </Wrapper>

          <Wrapper className="group relative overflow-hidden p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70">
                  <HiOutlineVideoCamera size={17} />
                </span>

                <div>
                  <InputTitle className="mb-1">Video lesson</InputTitle>
                  <p className="text-[8px] text-gray-400 dark:text-white/25">Optional subheading video</p>
                </div>
              </div>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => !videoPreview && videoInputRef.current?.click()}
              onDrop={(event) => {
                event.preventDefault();
                processVideo(event.dataTransfer.files?.[0]);
              }}
              onDragOver={(event) => event.preventDefault()}
              className="relative flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/55 text-center dark:border-white/[0.08] dark:bg-white/[0.018]"
            >
              {videoPreview ? (
                <>
                  <video src={videoPreview} controls preload="metadata" className="h-full w-full bg-black object-contain" onClick={(event) => event.stopPropagation()}>
                    Your browser does not support the video tag.
                  </video>
                  <button type="button" onClick={() => { revokeObjectUrl(videoPreview); setVideo(null); setVideoPreview(""); }} className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-xl bg-rose-500/85 text-white">
                    <MdClose size={15} />
                  </button>
                  <p className="absolute bottom-3 left-3 rounded-xl bg-black/45 px-2.5 py-1.5 text-[8px] font-semibold text-white/85">{video?.name} / {formatFileSize(video?.size)}</p>
                </>
              ) : (
                <div className="flex max-w-[250px] flex-col items-center px-5">
                  <span className="flex size-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-600 dark:text-cyan-200/70">
                    <IoVideocam size={25} />
                  </span>
                  <p className="mt-4 text-[10px] font-semibold text-gray-600 dark:text-white/50">Drop a video here</p>
                  <p className="mt-1.5 text-[8px] leading-4 text-gray-400 dark:text-white/25">MP4, MOV, AVI, MKV or WEBM</p>
                </div>
              )}

              <input ref={videoInputRef} type="file" className="hidden" onChange={(event) => { processVideo(event.target.files?.[0]); event.target.value = ""; }} accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm" />
            </div>
          </Wrapper>
        </aside>
      </section>

      <Wrapper className="group relative mb-5 overflow-hidden p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3 border-b border-gray-200/70 pb-5 dark:border-white/[0.05]">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
            <HiOutlineDocumentText size={19} />
          </span>

          <div>
            <InputTitle className="mb-1">Subheading content</InputTitle>
            <p className="text-[9px] leading-4 text-gray-400 dark:text-white/25">Write the complete lesson content for this subheading.</p>
          </div>
        </div>

        <div className="min-h-[440px] rounded-[24px] border border-gray-200/70 bg-gray-50/35 p-2 shadow-inner dark:border-white/[0.045] dark:bg-white/[0.014]">
          <Editor customId={groupId} value={description} onChange={setDescription} folderName="chapter/subheading" folder="chapter" subfolder="subheading" />
        </div>
      </Wrapper>
    </>
  );
};
