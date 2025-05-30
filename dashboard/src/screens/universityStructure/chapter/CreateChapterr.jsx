import { createChapter, getAllChapter } from "@/redux/slices/universityStructure/chapterSlice";
import Editor from "@/textEditor/Editor";
import { GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, Wrapper } from "@/utils/Router";
import { Tooltip } from "@material-tailwind/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CiCircleQuestion } from "react-icons/ci";
import { IoCameraSharp, IoVideocam } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { CourseDropDown } from "../StructureAcademicDropDown";
import TagsInput from "react-tagsinput";
import { inputClassName } from "@/utils";

const initialState = {
  title: "",
  metaTitle: "",
  description: "",
  metaDescription: "",
  subject: "",
  groupId: "",
  tags: [],
};

export const CreateChapterr = () => {
  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(initialState);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [metaTitleError, setMetaTitleError] = useState("");
  const [metaDescError, setMetaDescError] = useState("");
  const [tagError, setTagError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [groupId] = useState(uuidv4());

  const { title, metaTitle, metaDescription } = chapter;

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [thumbnailPreview, videoPreview]);

  const isImageValid = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    return allowedFormats.includes(file.type);
  };

  const isVideoValid = (file) => {
    const allowedFormats = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"];
    return allowedFormats.includes(file.type);
  };

  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!isImageValid(selectedFile)) {
        toast.error("Thumbnail must be a PNG, JPEG, JPG, or WEBP image.");
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

  const handleVideoChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!isVideoValid(selectedFile)) {
        toast.error("Video must be an MP4, MOV, AVI, MKV, or WEBM file.");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024 * 1024) {
        toast.error("Video file size exceeds 10GB limit.");
        return;
      }
      setVideo(selectedFile);
      setVideoPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDropThumbnail = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleThumbnailChange({ target: { files: [file] } });
  }, []);

  const handleDropVideo = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleVideoChange({ target: { files: [file] } });
  }, []);

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
    setChapter((prev) => ({ ...prev, tags: newTags }));
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Chapter title is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (!metaDescription.trim()) {
      toast.error("Meta description is required.");
      return;
    }
    if (!selectedSubject) {
      toast.error("Please select a subject.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("metaTitle", metaTitle);
    formData.append("description", description);
    formData.append("metaDescription", metaDescription);
    formData.append("groupId", groupId);
    formData.append("subject", selectedSubject._id);
    if (chapter.tags.length > 0) {
      formData.append("tags", JSON.stringify(chapter.tags.map((tag) => ({ tag }))));
    }
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    if (video) {
      formData.append("video", video);
    }

    try {
      const resultAction = await dispatch(createChapter(formData));
      if (createChapter.fulfilled.match(resultAction)) {
        await dispatch(getAllChapter());
        setThumbnail(null);
        setThumbnailPreview(null);
        setVideo(null);
        setVideoPreview(null);
        setChapter(initialState);
        setDescription("");
        navigate("/overview-chapter");
        toast.success("Chapter created successfully!");
      } else {
        toast.error(resultAction.payload?.error || "Failed to create chapter.");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length > 100) {
      setTitleError("Chapter title cannot exceed 100 characters.");
    } else {
      setTitleError("");
      setChapter({ ...chapter, title: value });
    }
  };

  const handleMetaTitleChange = (e) => {
    const value = e.target.value;
    if (value.length > 250) {
      setMetaTitleError("Meta title cannot exceed 250 characters.");
    } else {
      setMetaTitleError("");
      setChapter({ ...chapter, metaTitle: value });
    }
  };

  const handleMetaDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length > 160) {
      setMetaDescError("Meta description cannot exceed 160 characters.");
    } else {
      setMetaDescError("");
      setChapter({ ...chapter, metaDescription: value });
    }
  };

  return (
    <>
      <StickyHeader>
        <HeadingTwo>New Chapter</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton onClick={() => navigate("/all-Chapter")}>Cancel</GhostButton>
          <TertiaryButton onClick={handleCreate}>Publish now</TertiaryButton>
        </div>
      </StickyHeader>
      <section className="flex justify-between gap-3 mb-3">
        <div className="w-2/3">
          <Wrapper className="p-5">
            <InputTitle className="mb-4">Chapter Details</InputTitle>
            <div className="input py-2">
              <InputLabel className="my-2">Course</InputLabel>
              <div className="relative">
                <CourseDropDown value={selectedSubject} onChange={setSelectedSubject} placeholder="Select Course" />
              </div>
            </div>
            <div className="input my-3">
              <div className="flex items-center gap-1">
                <InputLabel className="my-2">Chapter Name</InputLabel>
                <Tooltip className="bg-black text-white dark:bg-white dark:text-black text-xs" content="Maximum 100 characters. No HTML or emoji allowed" placement="right">
                  <button>
                    <CiCircleQuestion />
                  </button>
                </Tooltip>
              </div>
              <div className="relative">
                <Input type="text" name="title" value={title} handleChange={handleTitleChange} placeholder="ie. Building a Responsive Navbar with Tailwind CSS" />
                <p className="absolute bottom-1 right-3 text-primary-dark dark:text-primary text-xs 3xl:text-sm">{title.length}/100</p>
                {titleError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{titleError}</p>}
              </div>
            </div>
            <div className="input my-3">
              <div className="flex items-center gap-1">
                <InputLabel className="my-2">Meta Title</InputLabel>
                <Tooltip className="bg-black text-white dark:bg-white dark:text-black text-xs" content="Maximum 250 characters. No HTML or emoji allowed" placement="right">
                  <button>
                    <CiCircleQuestion />
                  </button>
                </Tooltip>
              </div>
              <div className="relative">
                <Input type="text" name="metaTitle" value={metaTitle} handleChange={handleMetaTitleChange} placeholder="ie. Building a Responsive Navbar with Tailwind CSS" />
                <p className="absolute bottom-1 right-3 text-primary-dark dark:text-primary text-xs 3xl:text-sm">{metaTitle.length}/250</p>
                {metaTitleError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{metaTitleError}</p>}
              </div>
            </div>
            <div className="input">
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

            <div className="input">
              <InputLabel className="my-2">Tags</InputLabel>
              <TagsInput className={`${inputClassName} !p-0 !px-2 !pt-2 rounded-xl !min-h-28 !h-auto`} value={chapter.tags} onChange={handleTagChange} inputProps={{ placeholder: "Add Tag" }} />
              {tagError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{tagError}</p>}
            </div>
          </Wrapper>
        </div>
        <div className="w-1/3">
          <Wrapper className="p-5 w-full">
            <InputTitle className="mb-4">Thumbnail Image (Optional)</InputTitle>
            <div
              onDrop={handleDropThumbnail}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center w-full h-40 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
            >
              {thumbnailPreview ? (
                <div className="relative w-full h-40 flex items-center justify-center">
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
                    <span className="textColor font-medium cursor-pointer pl-1" onClick={() => thumbnailInputRef.current.click()}>
                      click to browse
                    </span>
                  </p>
                </div>
              )}
              <input ref={thumbnailInputRef} id="thumbnail" type="file" name="thumbnail" className="hidden" onChange={handleThumbnailChange} accept="image/png,image/jpeg,image/jpg,image/webp" />
            </div>
          </Wrapper>
          <Wrapper className="p-5 w-full mt-3">
            <InputTitle className="mb-4">Video (Optional)</InputTitle>
            <div
              onDrop={handleDropVideo}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center w-full h-40 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
            >
              {videoPreview ? (
                <div className="relative w-full h-40 flex items-center justify-center">
                  <video src={videoPreview} controls className="w-full h-full rounded-3xl object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideo(null);
                      setVideoPreview(null);
                    }}
                    className="absolute top-3 right-3 shadow-xl bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove Video"
                    aria-label="Remove video"
                  >
                    <MdClose />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <IoVideocam size={30} />
                  <p className="text-sm text-gray-500 dark:text-gray-400 textSizeSm">
                    Drag and drop a video or
                    <span className="textColor font-medium cursor-pointer pl-1" onClick={() => videoInputRef.current.click()}>
                      click to browse
                    </span>
                  </p>
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
          </Wrapper>
        </div>
      </section>
      <Wrapper className="p-5 mb-5">
        <InputTitle className="mb-4">Description</InputTitle>
        <Editor customId={groupId} value={description} onChange={setDescription} folderName="chapter/description" folder="chapter" subfolder="description" />
      </Wrapper>
    </>
  );
};
