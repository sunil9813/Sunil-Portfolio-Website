import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import TagsInput from "react-tagsinput";
import DatePicker from "react-datepicker";
import { Switch, Tooltip } from "@material-tailwind/react";

import { CiCircleQuestion, CiDiscount1, CiDollar } from "react-icons/ci";
import { FaFolder } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { PiGraduationCap } from "react-icons/pi";

import Editor from "@/textEditor/Editor";
import { inputClassName } from "@/utils";
import { FacultyDropDown, GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, UniversityDropDown, Wrapper } from "@/routes";
import { createCourse, getAllCourse } from "@/redux/slices/universityStructure/courseSlice";
import { ProgramDropDown } from "../StructureAcademicDropDown";
import { AccessTypeDropdown } from "@/components/common/dropdown/CustomeDropDown";

import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";

const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024;
const MAX_RESOURCE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

const initialState = {
  name: "",
  metaDescription: "",
  visibility: "private",
  accessType: "unpaid",
  price: "",
  discount: "",
  discountDate: "",
  tags: [],
  highlights: [""],
  university: "",
  faculty: "",
  program: "",
  scheduledPublish: "",
};

const revokeObjectUrl = (url) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const getErrorMessage = (error, fallbackMessage) => {
  if (typeof error === "string") {
    return error;
  }

  return error?.message || fallbackMessage;
};

export const CreateCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const thumbnailInputRef = useRef(null);
  const resourceInputRef = useRef(null);

  const [groupId] = useState(() => uuidv4());

  const [subject, setSubject] = useState(initialState);
  const [description, setDescription] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [resourceFile, setResourceFile] = useState(null);
  const [resourcePreview, setResourcePreview] = useState("");

  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [nameError, setNameError] = useState("");
  const [metaDescError, setMetaDescError] = useState("");
  const [resourceFileError, setResourceFileError] = useState("");
  const [tagError, setTagError] = useState("");
  const [highlightErrors, setHighlightErrors] = useState([""]);
  const [discountError, setDiscountError] = useState("");

  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isError } = useSelector((state) => state.course);

  useEffect(() => {
    return () => {
      revokeObjectUrl(thumbnailPreview);
      revokeObjectUrl(resourcePreview);
    };
  }, [thumbnailPreview, resourcePreview]);

  const isImageValid = useCallback((file) => {
    return ALLOWED_IMAGE_FORMATS.includes(file?.type);
  }, []);

  const isResourceFileValid = useCallback((file) => {
    return file?.type === "application/pdf";
  }, []);

  const validateDiscount = (currentPrice, currentDiscount) => {
    const priceValue = parseFloat(currentPrice) || 0;
    const discountValue = parseFloat(currentDiscount) || 0;

    if (discountValue >= priceValue && discountValue > 0) {
      setDiscountError("Discount cannot be greater than or equal to the price.");
      return;
    }

    if (discountValue < 0) {
      setDiscountError("Discount cannot be negative.");
      return;
    }

    setDiscountError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setSubject((previousSubject) => ({
      ...previousSubject,
      [name]: value,
    }));

    if (name === "name") {
      setNameError(value.length > 250 ? "Title cannot exceed 250 characters." : "");
    }

    if (name === "metaDescription") {
      setMetaDescError(value.length > 160 ? "Meta description cannot exceed 160 characters." : "");
    }

    if (name === "price") {
      validateDiscount(value, subject.discount);
    }

    if (name === "discount") {
      validateDiscount(subject.price, value);
    }
  };

  const processThumbnail = useCallback(
    (selectedFile) => {
      if (!selectedFile) {
        return;
      }

      if (!isImageValid(selectedFile)) {
        toast.error("Thumbnail must be a PNG, JPEG, or JPG image.");
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
    },
    [isImageValid],
  );

  const handleThumbnailChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      processThumbnail(selectedFile);
    }

    event.target.value = "";
  };

  const handleRemoveThumbnail = (event) => {
    event.preventDefault();
    event.stopPropagation();

    revokeObjectUrl(thumbnailPreview);

    setThumbnail(null);
    setThumbnailPreview("");
  };

  const processResourceFile = useCallback(
    (selectedFile) => {
      if (!selectedFile) {
        return;
      }

      if (!isResourceFileValid(selectedFile)) {
        const message = "Resource file must be a PDF.";

        toast.error(message);
        setResourceFileError(message);
        return;
      }

      if (selectedFile.size > MAX_RESOURCE_SIZE) {
        const message = "Resource file size exceeds the 5MB limit.";

        toast.error(message);
        setResourceFileError(message);
        return;
      }

      setResourcePreview((currentPreview) => {
        revokeObjectUrl(currentPreview);
        return URL.createObjectURL(selectedFile);
      });

      setResourceFile(selectedFile);
      setResourceFileError("");
    },
    [isResourceFileValid],
  );

  const handleResourceFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      processResourceFile(selectedFile);
    }

    event.target.value = "";
  };

  const handleRemoveResource = (event) => {
    event.preventDefault();
    event.stopPropagation();

    revokeObjectUrl(resourcePreview);

    setResourceFile(null);
    setResourcePreview("");
    setResourceFileError("");
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

  const handleDropResource = useCallback(
    (event) => {
      event.preventDefault();

      const selectedFile = event.dataTransfer.files?.[0];

      if (selectedFile) {
        processResourceFile(selectedFile);
      }
    },
    [processResourceFile],
  );

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

    setSubject((previousSubject) => ({
      ...previousSubject,
      tags: cleanedTags,
    }));
  };

  const handleHighlightChange = (index, value) => {
    setSubject((previousSubject) => ({
      ...previousSubject,
      highlights: previousSubject.highlights.map((highlight, highlightIndex) => (highlightIndex === index ? value : highlight)),
    }));

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
    const errors = subject.highlights.map((highlight) => {
      if (!highlight.trim()) {
        return "Highlight cannot be empty.";
      }

      if (highlight.length > 100) {
        return "Highlight cannot exceed 100 characters.";
      }

      return "";
    });

    const normalizedHighlights = subject.highlights.filter((highlight) => highlight.trim()).map((highlight) => highlight.trim().toLowerCase());

    const hasDuplicate = normalizedHighlights.some((highlight, index) => normalizedHighlights.indexOf(highlight) !== index);

    if (hasDuplicate) {
      errors[0] = errors[0] || "Highlights cannot contain duplicates.";
    }

    setHighlightErrors(errors);

    return !errors.some(Boolean) && !hasDuplicate;
  };

  const addHighlight = () => {
    setSubject((previousSubject) => ({
      ...previousSubject,
      highlights: [...previousSubject.highlights, ""],
    }));

    setHighlightErrors((previousErrors) => [...previousErrors, ""]);
  };

  const removeHighlight = (index) => {
    if (subject.highlights.length === 1) {
      toast.error("At least one highlight is required.");
      return;
    }

    setSubject((previousSubject) => ({
      ...previousSubject,
      highlights: previousSubject.highlights.filter((_, highlightIndex) => highlightIndex !== index),
    }));

    setHighlightErrors((previousErrors) => previousErrors.filter((_, errorIndex) => errorIndex !== index));
  };

  const handleUniversityChange = (universityOption) => {
    setSelectedUniversity(universityOption);
    setSelectedFaculty(null);
    setSelectedProgram(null);

    setSubject((previousSubject) => ({
      ...previousSubject,
      university: universityOption?._id || "",
      faculty: "",
      program: "",
    }));
  };

  const handleFacultyChange = (facultyOption) => {
    setSelectedFaculty(facultyOption);
    setSelectedProgram(null);

    setSubject((previousSubject) => ({
      ...previousSubject,
      faculty: facultyOption?._id || "",
      program: "",
    }));
  };

  const handleProgramChange = (programOption) => {
    setSelectedProgram(programOption);

    setSubject((previousSubject) => ({
      ...previousSubject,
      program: programOption?._id || "",
    }));
  };

  const resetForm = () => {
    revokeObjectUrl(thumbnailPreview);
    revokeObjectUrl(resourcePreview);

    setSubject(initialState);
    setDescription("");

    setThumbnail(null);
    setThumbnailPreview("");

    setResourceFile(null);
    setResourcePreview("");

    setSelectedUniversity(null);
    setSelectedFaculty(null);
    setSelectedProgram(null);

    setNameError("");
    setMetaDescError("");
    setResourceFileError("");
    setTagError("");
    setHighlightErrors([""]);
    setDiscountError("");

    setDiscountEnabled(false);
  };

  const handleCreate = async (publishType) => {
    if (isSubmitting) {
      return;
    }

    const finalVisibility = publishType === "draft" ? "private" : publishType === "publish" ? "public" : subject.visibility;

    if (!subject.name.trim()) {
      toast.error("Course title is required.");
      return;
    }

    if (subject.name.length > 250) {
      toast.error("Title cannot exceed 250 characters.");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }

    if (!subject.metaDescription.trim()) {
      toast.error("Meta description is required.");
      return;
    }

    if (subject.metaDescription.length > 160) {
      toast.error("Meta description cannot exceed 160 characters.");
      return;
    }

    if (!thumbnail) {
      toast.error("Thumbnail is required.");
      return;
    }

    if (resourceFileError) {
      toast.error(resourceFileError);
      return;
    }

    if (subject.accessType === "paid" && (!subject.price || parseFloat(subject.price) <= 0)) {
      toast.error("Please enter a valid course price.");
      return;
    }

    if (discountError) {
      toast.error(discountError);
      return;
    }

    if (discountEnabled && parseFloat(subject.discount) > 0 && !subject.discountDate) {
      toast.error("Discount date is required when a discount is provided.");
      return;
    }

    if (discountEnabled && subject.discountDate) {
      const selectedDate = new Date(subject.discountDate);

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

    formData.append("name", subject.name.trim());
    formData.append("description", description.trim());
    formData.append("metaDescription", subject.metaDescription.trim());
    formData.append("groupId", groupId);
    formData.append("visibility", finalVisibility);
    formData.append("accessType", subject.accessType || "unpaid");
    formData.append("price", subject.accessType === "paid" ? subject.price || 0 : 0);
    formData.append("discount", subject.accessType === "paid" && discountEnabled ? subject.discount || 0 : 0);

    if (subject.accessType === "paid" && discountEnabled && subject.discount && subject.discountDate) {
      formData.append("discountDate", subject.discountDate);
    }

    if (subject.university) {
      formData.append("university", subject.university);
    }

    if (subject.faculty) {
      formData.append("faculty", subject.faculty);
    }

    if (subject.program) {
      formData.append("program", subject.program);
    }

    if (subject.tags.length > 0) {
      formData.append("tags", JSON.stringify(subject.tags.map((tag) => ({ tag }))));
    }

    const formattedHighlights = subject.highlights
      .filter((highlight) => highlight.trim())
      .map((highlight) => ({
        highlight: highlight.trim(),
      }));

    if (formattedHighlights.length > 0) {
      formData.append("highlights", JSON.stringify(formattedHighlights));
    }

    formData.append("thumbnail", thumbnail);

    if (resourceFile) {
      formData.append("resourceFile", resourceFile);
    }

    try {
      setIsSubmitting(true);

      await dispatch(createCourse(formData)).unwrap();
      await dispatch(getAllCourse()).unwrap();

      resetForm();

      toast.success(publishType === "draft" ? "Course draft saved successfully." : "Course published successfully.");

      navigate("/all-subjects");
    } catch (error) {
      const errorMessage = isError?.message?.includes("validation failed")
        ? "Invalid input data. Please check all fields and try again."
        : getErrorMessage(error, isError?.message || "Failed to create course.");

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StickyHeader>
        <HeadingTwo>Create Course</HeadingTwo>

        <div className="flex items-center gap-2">
          <GhostButton type="button" disabled={isSubmitting} onClick={() => handleCreate("draft")}>
            Save draft
          </GhostButton>

          <TertiaryButton type="button" disabled={isSubmitting} onClick={() => handleCreate("publish")}>
            {isSubmitting ? "Publishing..." : "Publish now"}
          </TertiaryButton>
        </div>
      </StickyHeader>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(330px,1fr)]">
        {/* Main column */}
        <div className="min-w-0">
          {/* Course details */}
          <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/[0.014] blur-[90px] transition-all duration-700 group-hover:bg-indigo-500/[0.024]" />

            <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-cyan-500/[0.011] blur-[90px]" />

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                    <HiOutlineBookOpen size={19} />
                  </span>

                  <div>
                    <InputTitle className="mb-1">Course details</InputTitle>

                    <p className="text-[9px] text-gray-400 dark:text-white/25">Add the primary course information.</p>
                  </div>
                </div>

                <span className="rounded-full border border-indigo-300/20 bg-indigo-500/[0.05] px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.03] dark:text-indigo-200/60">
                  New course
                </span>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <InputLabel>Course title</InputLabel>

                    <Tooltip
                      className="rounded-lg border border-white/[0.08] bg-[#11151d] px-3 py-2 text-[10px] text-white/90 shadow-xl"
                      content="Maximum 250 characters. No HTML or emoji allowed."
                      placement="right"
                    >
                      <button type="button" aria-label="Course title information" className="text-gray-400 transition-colors hover:text-indigo-500 dark:text-white/25 dark:hover:text-indigo-200/70">
                        <CiCircleQuestion />
                      </button>
                    </Tooltip>
                  </div>

                  <span className={`text-[9px] font-medium tabular-nums ${subject.name.length >= 240 ? "text-rose-600 dark:text-rose-200/75" : "text-gray-400 dark:text-white/25"}`}>
                    {subject.name.length}/250
                  </span>
                </div>

                <Input type="text" name="name" value={subject.name} handleChange={handleInputChange} placeholder="Introduction to Java Programming" />

                {nameError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{nameError}</p>}
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

                  <span className={`text-[9px] font-medium tabular-nums ${subject.metaDescription.length >= 150 ? "text-rose-600 dark:text-rose-200/75" : "text-gray-400 dark:text-white/25"}`}>
                    {subject.metaDescription.length}/160
                  </span>
                </div>

                <Input
                  type="text"
                  name="metaDescription"
                  value={subject.metaDescription}
                  handleChange={handleInputChange}
                  placeholder="Learn Java fundamentals, object-oriented programming and application development."
                />

                {metaDescError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{metaDescError}</p>}
              </div>
            </div>
          </Wrapper>

          {/* Academic structure */}
          <Wrapper className="relative z-30 my-3 !overflow-visible p-5 sm:p-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
              <div className="absolute -right-24 -top-24 size-64 rounded-full bg-cyan-500/[0.013] blur-[90px]" />

              <div className="absolute -bottom-24 -left-24 size-64 rounded-full bg-violet-500/[0.011] blur-[90px]" />
            </div>

            <div className="relative z-10">
              <div className="mb-5 flex items-center gap-3 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
                <span className="flex size-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70">
                  <PiGraduationCap size={20} />
                </span>

                <div>
                  <InputTitle className="mb-1">Academic structure</InputTitle>

                  <p className="text-[9px] text-gray-400 dark:text-white/25">Connect the course with its academic hierarchy.</p>
                </div>
              </div>

              <div className="relative z-50 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative z-[54]">
                  <InputLabel className="mb-2">University</InputLabel>

                  <UniversityDropDown value={selectedUniversity} onChange={handleUniversityChange} placeholder="Select University" disabled={isSubmitting} />
                </div>

                <div className="relative z-[53]">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <InputLabel>Faculty</InputLabel>

                    {!selectedUniversity && <span className="text-[8px] text-gray-400 dark:text-white/20">Select university first</span>}
                  </div>

                  <FacultyDropDown
                    value={selectedFaculty}
                    onChange={handleFacultyChange}
                    universityId={selectedUniversity?._id || ""}
                    disabled={!selectedUniversity || isSubmitting}
                    placeholder="Select Faculty"
                  />
                </div>

                <div className="relative z-[52]">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <InputLabel>Program</InputLabel>

                    {!selectedFaculty && <span className="text-[8px] text-gray-400 dark:text-white/20">Select faculty first</span>}
                  </div>

                  <ProgramDropDown
                    value={selectedProgram}
                    onChange={handleProgramChange}
                    facultyId={selectedFaculty?._id || ""}
                    disabled={!selectedFaculty || isSubmitting}
                    placeholder="Select Program"
                  />
                </div>

                <div className="relative z-[51]">
                  <InputLabel className="mb-2">Access type</InputLabel>

                  <AccessTypeDropdown value={subject.accessType} onChange={handleInputChange} name="accessType" />
                </div>
              </div>

              <div className="relative z-10 mt-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <InputLabel>Tags</InputLabel>

                  <span className="text-[9px] text-gray-400 dark:text-white/25">{subject.tags.join("").length}/500</span>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-gray-50/55 p-1 transition-all focus-within:border-indigo-400/35 focus-within:ring-4 focus-within:ring-indigo-500/[0.04] dark:border-white/[0.055] dark:bg-white/[0.02] dark:focus-within:border-indigo-300/[0.13]">
                  <TagsInput
                    className={`${inputClassName} !h-auto !min-h-28 !border-0 !bg-transparent !px-2 !pt-2 [&_.react-tagsinput-input]:!m-0 [&_.react-tagsinput-input]:!h-8 [&_.react-tagsinput-input]:!bg-transparent [&_.react-tagsinput-input]:!text-[11px] [&_.react-tagsinput-input]:!text-gray-700 [&_.react-tagsinput-input]:!outline-none dark:[&_.react-tagsinput-input]:!text-white/65 [&_.react-tagsinput-tag]:!mb-1 [&_.react-tagsinput-tag]:!mr-1.5 [&_.react-tagsinput-tag]:!inline-flex [&_.react-tagsinput-tag]:!items-center [&_.react-tagsinput-tag]:!rounded-full [&_.react-tagsinput-tag]:!border [&_.react-tagsinput-tag]:!border-indigo-300/25 [&_.react-tagsinput-tag]:!bg-indigo-500/[0.07] [&_.react-tagsinput-tag]:!px-2.5 [&_.react-tagsinput-tag]:!py-1 [&_.react-tagsinput-tag]:!text-[9px] [&_.react-tagsinput-tag]:!text-indigo-700 dark:[&_.react-tagsinput-tag]:!border-indigo-300/[0.10] dark:[&_.react-tagsinput-tag]:!bg-indigo-300/[0.045] dark:[&_.react-tagsinput-tag]:!text-indigo-200/70`}
                    value={subject.tags}
                    onChange={handleTagChange}
                    inputProps={{
                      placeholder: "Add tag",
                    }}
                  />
                </div>

                {tagError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{tagError}</p>}
              </div>
            </div>
          </Wrapper>

          {/* Highlights */}
          <Wrapper className="group relative my-3 overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-emerald-500/[0.012] blur-[80px]" />

            <div className="relative z-10">
              <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
                <InputTitle className="mb-1">Key highlights</InputTitle>

                <p className="text-[9px] text-gray-400 dark:text-white/25">Add the main learning features and outcomes.</p>
              </div>

              <div className="space-y-3">
                {subject.highlights.map((highlight, index) => (
                  <div key={index}>
                    <div className="relative">
                      <input
                        type="text"
                        name={`highlight-${index}`}
                        className={`${inputClassName} w-full !rounded-2xl pl-11 pr-20 ${
                          highlightErrors[index] ? "!border-rose-500/70 dark:!border-rose-300/40" : "!border-gray-200/80 dark:!border-white/[0.055]"
                        } !bg-gray-50/55 dark:!bg-white/[0.018]`}
                        placeholder="Learn object-oriented programming concepts"
                        value={highlight}
                        onChange={(event) => handleHighlightChange(index, event.target.value)}
                        onBlur={validateHighlights}
                      />

                      <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full 3xl:size-10">
                        <IoIosCheckmarkCircle size={23} className={highlight.trim() ? "text-emerald-500 dark:text-emerald-200/70" : "text-gray-400 dark:text-white/20"} />
                      </span>

                      {subject.highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          title="Remove highlight"
                          aria-label="Remove highlight"
                          className="absolute right-10 top-1 flex size-9 items-center justify-center rounded-full text-rose-500 transition-all hover:bg-rose-500/[0.08] dark:text-rose-200/70"
                        >
                          <FiMinus size={16} />
                        </button>
                      )}

                      {index === subject.highlights.length - 1 && (
                        <button
                          type="button"
                          onClick={addHighlight}
                          title="Add another highlight"
                          aria-label="Add another highlight"
                          className="absolute right-1 top-1 flex size-9 items-center justify-center rounded-full text-cyan-600 transition-all hover:bg-cyan-500/[0.08] dark:text-cyan-200/70"
                        >
                          <FiPlus size={17} />
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

          {/* Editor */}
          <Wrapper className="group relative mb-5 overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-indigo-500/[0.013] blur-[95px]" />

            <div className="relative z-10">
              <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
                <InputTitle className="mb-1">Course description</InputTitle>

                <p className="text-[9px] text-gray-400 dark:text-white/25">Write the complete course overview and learning content.</p>
              </div>

              <div className="min-h-[420px] rounded-2xl border border-gray-200/70 bg-gray-50/35 p-2 dark:border-white/[0.045] dark:bg-white/[0.014]">
                <Editor customId={groupId} value={description} onChange={setDescription} folderName="subject/description" folder="subject" subfolder="description" />
              </div>
            </div>
          </Wrapper>
        </div>

        {/* Side column */}
        <aside className="min-w-0">
          {/* Thumbnail */}
          <Wrapper className="group relative overflow-hidden p-5">
            <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-violet-500/[0.014] blur-[80px]" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <InputTitle className="mb-1">Thumbnail image</InputTitle>

                  <p className="text-[9px] text-gray-400 dark:text-white/25">Course cover image</p>
                </div>

                <span className="rounded-full border border-gray-200/70 bg-gray-50/60 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
                  Max 10MB
                </span>
              </div>

              <div
                role="button"
                tabIndex={0}
                aria-label="Upload course thumbnail"
                onClick={() => thumbnailInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    thumbnailInputRef.current?.click();
                  }
                }}
                onDrop={handleDropThumbnail}
                onDragOver={(event) => event.preventDefault()}
                className="relative flex h-60 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/60 text-center transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/[0.025] focus:outline-none focus:ring-4 focus:ring-violet-500/[0.05] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-violet-300/[0.15] dark:hover:bg-violet-300/[0.025]"
              >
                {thumbnailPreview ? (
                  <>
                    <img src={thumbnailPreview} alt="Course thumbnail preview" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                    <span className="absolute bottom-3 left-3 rounded-lg border border-white/[0.12] bg-black/45 px-2.5 py-1.5 text-[9px] font-medium text-white/90 backdrop-blur-xl">
                      Thumbnail preview
                    </span>

                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      title="Remove thumbnail"
                      aria-label="Remove course thumbnail"
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/85 text-white shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:bg-rose-500"
                    >
                      <MdClose size={15} />
                    </button>
                  </>
                ) : (
                  <div className="flex max-w-[260px] flex-col items-center px-5">
                    <span className="flex size-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/[0.07] text-violet-600 shadow-[0_10px_26px_rgba(124,58,237,0.10)] dark:border-violet-300/[0.10] dark:bg-violet-300/[0.045] dark:text-violet-200/70">
                      <IoCameraSharp size={25} />
                    </span>

                    <p className="mt-4 text-[11px] font-medium text-gray-600 dark:text-white/50">Drag and drop an image</p>

                    <p className="mt-1.5 text-[9px] text-gray-400 dark:text-white/25">or click to browse PNG, JPG or JPEG</p>
                  </div>
                )}

                <input ref={thumbnailInputRef} id="thumbnail" type="file" name="thumbnail" className="hidden" onChange={handleThumbnailChange} accept="image/png,image/jpeg,image/jpg" />
              </div>
            </div>
          </Wrapper>

          {/* Resource PDF */}
          <Wrapper className="group relative my-3 overflow-hidden p-5">
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-56 rounded-full bg-amber-500/[0.011] blur-[80px]" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <InputTitle className="mb-1">Course resource</InputTitle>

                  <p className="text-[9px] text-gray-400 dark:text-white/25">Optional PDF document</p>
                </div>

                <span className="rounded-full border border-gray-200/70 bg-gray-50/60 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
                  Max 5MB
                </span>
              </div>

              <div
                role="button"
                tabIndex={0}
                aria-label="Upload course resource PDF"
                onClick={() => resourceInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    resourceInputRef.current?.click();
                  }
                }}
                onDrop={handleDropResource}
                onDragOver={(event) => event.preventDefault()}
                className="relative flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/60 p-4 text-center transition-all duration-300 hover:border-amber-400/40 hover:bg-amber-500/[0.025] focus:outline-none focus:ring-4 focus:ring-amber-500/[0.05] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-amber-300/[0.15] dark:hover:bg-amber-300/[0.025]"
              >
                {resourcePreview ? (
                  <>
                    <span className="flex size-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-500/[0.08] text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70">
                      <FaFolder size={21} />
                    </span>

                    <p className="mt-3 max-w-[240px] truncate text-[11px] font-semibold text-gray-700 dark:text-white/65">{resourceFile?.name}</p>

                    <p className="mt-1 text-[9px] text-gray-400 dark:text-white/25">{((resourceFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB</p>

                    <button
                      type="button"
                      onClick={handleRemoveResource}
                      title="Remove resource"
                      aria-label="Remove resource PDF"
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/85 text-white shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:bg-rose-500"
                    >
                      <MdClose size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex size-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-500/[0.08] text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70">
                      <FaFolder size={21} />
                    </span>

                    <p className="mt-3 text-[10px] font-medium text-gray-600 dark:text-white/50">Drag and drop a PDF</p>

                    <p className="mt-1 text-[9px] text-gray-400 dark:text-white/25">or click to browse</p>
                  </>
                )}

                <input ref={resourceInputRef} id="resourceFile" type="file" name="resourceFile" className="hidden" onChange={handleResourceFileChange} accept="application/pdf" />
              </div>

              {resourceFileError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{resourceFileError}</p>}
            </div>
          </Wrapper>

          {/* Pricing */}
          {subject.accessType === "paid" && (
            <Wrapper className="group relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -right-20 -bottom-20 size-56 rounded-full bg-emerald-500/[0.012] blur-[80px]" />

              <div className="relative z-10">
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
                  <InputTitle>Course pricing</InputTitle>

                  <Tooltip content="Enable discount">
                    <Switch
                      id="course-discount-switch"
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
                  </Tooltip>
                </div>

                <div>
                  <InputLabel className="mb-2">Price (USD)</InputLabel>

                  <div className="relative">
                    <Input type="number" name="price" className="pl-12" value={subject.price} handleChange={handleInputChange} min="0" step="0.01" />

                    <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-500/[0.10] text-emerald-700 dark:border-emerald-300/[0.10] dark:bg-emerald-300/[0.055] dark:text-emerald-200/75 3xl:size-10">
                      <CiDollar size={23} />
                    </span>
                  </div>
                </div>

                {discountEnabled && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <InputLabel className="mb-2">Discount price</InputLabel>

                      <div className="relative">
                        <Input type="number" name="discount" className="pl-12" value={subject.discount} handleChange={handleInputChange} min="0" step="0.01" />

                        <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-rose-300/20 bg-rose-500/[0.10] text-rose-700 dark:border-rose-300/[0.10] dark:bg-rose-300/[0.055] dark:text-rose-200/75 3xl:size-10">
                          <CiDiscount1 size={23} />
                        </span>
                      </div>

                      {discountError && <p className="mt-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-200/75">{discountError}</p>}
                    </div>

                    <div>
                      <InputLabel className="mb-2">Discount end date</InputLabel>

                      <DatePicker
                        className="h-11 w-full rounded-2xl border border-gray-200/80 bg-gray-50/55 px-4 text-[11px] text-gray-700 outline-none transition-all focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-500/[0.04] dark:border-white/[0.055] dark:bg-white/[0.02] dark:text-white/65 dark:focus:border-indigo-300/[0.13] 3xl:h-12"
                        selected={subject.discountDate ? new Date(subject.discountDate) : null}
                        onChange={(date) =>
                          setSubject((previousSubject) => ({
                            ...previousSubject,
                            discountDate: date ? date.toISOString() : "",
                          }))
                        }
                        minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                        placeholderText="Select discount end date"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Wrapper>
          )}
        </aside>
      </section>
    </>
  );
};
