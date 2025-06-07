import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Editor from "@/textEditor/Editor";
import { inputClassName } from "@/utils";
import { FacultyDropDown, GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, UniversityDropDown, Wrapper } from "@/utils/Router";
import { Switch, Tooltip } from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCircleQuestion, CiDiscount1, CiDollar } from "react-icons/ci";
import { FaFolder } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import TagsInput from "react-tagsinput";
import { createCourse, getAllCourse } from "@/redux/slices/universityStructure/courseSlice";
import { getAllFaculty } from "@/redux/slices/universityStructure/facultySlice";
import { getAllUniversity } from "@/redux/slices/universityStructure/universitySlice";
import { ProgramDropDown } from "../StructureAcademicDropDown";

const initialState = {
  name: "",
  metaDescription: "",
  visibility: "private",
  accessType: "unpaid",
  price: "",
  discount: "",
  tags: [],
  highlights: [""],
  university: null,
  faculty: null,
  program: null,
  scheduledPublish: "",
};

export const CreateCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const thumbnailInputRef = useRef(null);
  const resourceInputRef = useRef(null);
  const [groupId] = useState(uuidv4());

  const [subject, setSubject] = useState(initialState);
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [resourceFile, setResourceFile] = useState(null);
  const [resourcePreview, setResourcePreview] = useState(null);
  const [nameError, setNameError] = useState("");
  const [metaDescError, setMetaDescError] = useState("");
  const [resourceFileError, setResourceFileError] = useState("");
  const [tagError, setTagError] = useState("");
  const [highlightErrors, setHighlightErrors] = useState([""]);
  const [discountError, setDiscountError] = useState("");
  const [discountEnabled, setDiscountEnabled] = useState(false);

  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const { isError } = useSelector((state) => state.course); // Only select status and error
  // Get universities from Redux store
  const { universitys } = useSelector((state) => state.university);
  const { facultys } = useSelector((state) => state.faculty);
  const { facultyList } = facultys;
  const { universityList } = universitys;

  useEffect(() => {
    // Load both faculties and universities
    dispatch(getAllFaculty());
    dispatch(getAllUniversity());
  }, [dispatch]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      if (resourcePreview) URL.revokeObjectURL(resourcePreview);
    };
  }, [thumbnailPreview, resourcePreview]);

  const isImageValid = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return allowedFormats.includes(file.type);
  };

  const isResourceFileValid = (file) => {
    return file.type === "application/pdf";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubject((prev) => ({ ...prev, [name]: value }));

    if (name === "name") {
      if (value.length > 250) {
        setNameError("Title cannot exceed 250 characters.");
      } else {
        setNameError("");
      }
    }

    if (name === "metaDescription") {
      if (value.length > 160) {
        setMetaDescError("Meta description cannot exceed 160 characters.");
      } else {
        setMetaDescError("");
      }
    }

    if (name === "price" || name === "discount") {
      const priceValue = name === "price" ? parseFloat(value) || 0 : parseFloat(subject.price) || 0;
      const discountValue = name === "discount" ? parseFloat(value) || 0 : parseFloat(subject.discount) || 0;
      if (discountValue >= priceValue && discountValue > 0) {
        setDiscountError("Discount cannot be greater than or equal to the price.");
      } else if (discountValue < 0) {
        setDiscountError("Discount cannot be negative.");
      } else {
        setDiscountError("");
      }
    }
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

  const handleResourceFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isResourceFileValid(file)) {
        toast.error("Resource file must be a PDF.");
        setResourceFileError("Resource file must be a PDF.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Resource file size exceeds 5MB limit.");
        setResourceFileError("Resource file size exceeds 5MB limit.");
        return;
      }
      setResourceFile(file);
      setResourcePreview(URL.createObjectURL(file));
      setResourceFileError("");
    }
  };

  const handleDropThumbnail = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleThumbnailChange({ target: { files: [file] } });
  }, []);

  const handleDropResource = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleResourceFileChange({ target: { files: [file] } });
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
    setSubject((prev) => ({ ...prev, tags: newTags }));
  };

  const handleHighlightChange = (index, value) => {
    const updatedHighlights = [...subject.highlights];
    updatedHighlights[index] = value;
    setSubject((prev) => ({ ...prev, highlights: updatedHighlights }));
    const updatedErrors = [...highlightErrors];
    updatedErrors[index] = value.length > 100 ? "Highlight cannot exceed 100 characters." : "";
    setHighlightErrors(updatedErrors);
  };

  const validateHighlights = () => {
    const errors = subject.highlights.map((highlight) => {
      if (highlight.trim() === "") return "Highlight cannot be empty.";
      if (highlight.length > 100) return "Highlight cannot exceed 100 characters.";
      return "";
    });
    const nonEmptyHighlights = subject.highlights.filter((h) => h.trim() !== "");
    const hasDuplicate = nonEmptyHighlights.some((highlight, i) => nonEmptyHighlights.indexOf(highlight) !== i);
    if (hasDuplicate) errors[0] = errors[0] || "Highlights cannot be duplicates.";
    setHighlightErrors(errors);
    return !errors.some((error) => error) && !hasDuplicate;
  };

  const handleHighlightBlur = () => {
    validateHighlights();
  };

  const addHighlight = () => {
    setSubject((prev) => ({ ...prev, highlights: [...prev.highlights, ""] }));
    setHighlightErrors((prev) => [...prev, ""]);
  };

  const removeHighlight = (index) => {
    if (subject.highlights.length === 1) {
      toast.error("At least one highlight is required.");
      return;
    }
    setSubject((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
    setHighlightErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async (publishType) => {
    let finalVisibility = subject.visibility;
    if (publishType === "draft") {
      finalVisibility = "private";
    } else if (publishType === "publish") {
      finalVisibility = "public";
    }

    // Client-side validations
    if (!subject.name.trim()) {
      toast.error("Title is required.");
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
      toast.error("Please fix highlight errors.");
      return;
    }

    const formData = new FormData();
    formData.append("name", subject.name);
    formData.append("description", description);
    formData.append("metaDescription", subject.metaDescription);
    formData.append("groupId", groupId);
    formData.append("visibility", finalVisibility);
    formData.append("accessType", subject.accessType || "unpaid");
    formData.append("price", subject.price || 0);
    formData.append("discount", discountEnabled ? subject.discount || 0 : 0);
    if (discountEnabled && subject.discount && subject.discountDate) {
      formData.append("discountDate", subject.discountDate);
    }
    if (subject.university) {
      formData.append("university", subject.university._id || subject.university);
    }
    if (subject.faculty) {
      formData.append("faculty", subject.faculty._id || subject.faculty);
    }
    if (subject.program) {
      formData.append("program", subject.program._id || subject.program);
    }
    if (subject.tags.length > 0) {
      formData.append("tags", JSON.stringify(subject.tags.map((tag) => ({ tag }))));
    }
    if (subject.highlights.length > 0) {
      formData.append("highlights", JSON.stringify(subject.highlights.filter((h) => h.trim() !== "").map((highlight) => ({ highlight: highlight.trim() }))));
    }
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    if (resourceFile) {
      formData.append("resourceFile", resourceFile);
    }

    try {
      const resultAction = await dispatch(createCourse(formData)); // Use createSubject
      if (createCourse.fulfilled.match(resultAction)) {
        await dispatch(getAllCourse()); // Use getAllSubjects
        setSubject(initialState);
        setDescription("");
        setThumbnail(null);
        setThumbnailPreview(null);
        setResourceFile(null);
        setResourcePreview(null);
        setDiscountEnabled(false);
        toast.success(publishType === "draft" ? "Draft saved successfully!" : "Subject created successfully!");
        navigate("/all-subjects");
      } else {
        const errorMessage = isError?.message?.includes("validation failed") ? "Invalid input data. Please check fields and try again." : isError?.message || "Failed to create subject.";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Create subject error:", err);
      toast.error("An unexpected error occurred while creating the subject.");
    }
  };

  const handleUniversityChange = (selectedUniversity) => {
    setSelectedUniversity(selectedUniversity);
    setSelectedFaculty(null); // Reset faculty when university changes
    setSubject((prev) => ({
      ...prev,
      university: selectedUniversity?._id || "",
      faculty: "", // Clear faculty when university changes
    }));
  };

  const handleFacultyChange = (selectedFaculty) => {
    setSelectedFaculty(selectedFaculty);
    setSubject((prev) => ({
      ...prev,
      faculty: selectedFaculty?._id || "",
    }));
  };
  const handleProgramChange = (selectedProgram) => {
    setSelectedProgram(selectedProgram);
    setSubject((prev) => ({ ...prev, program: selectedProgram }));
  };
  return (
    <>
      <StickyHeader>
        <HeadingTwo>Create Subject</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton onClick={() => handleCreate("draft")}>Save draft</GhostButton>
          <TertiaryButton onClick={() => handleCreate("publish")}>Publish now</TertiaryButton>
        </div>
      </StickyHeader>

      <section className="flex justify-between gap-3">
        <div className="w-2/3">
          <Wrapper className="p-5">
            <InputTitle className="mb-4">Subject Details</InputTitle>
            <div className="input">
              <div className="flex items-center gap-1">
                <InputLabel className="my-2">Title</InputLabel>
                <Tooltip className="bg-black text-white dark:bg-white dark:text-black text-xs" content="Maximum 250 characters. No HTML or emoji allowed" placement="right">
                  <button>
                    <CiCircleQuestion />
                  </button>
                </Tooltip>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  name="name"
                  value={subject.name} // Use subject.name
                  handleChange={handleInputChange}
                  placeholder="e.g., Introduction to Java"
                />
                <p className="absolute bottom-1 right-3 text-primary-dark dark:text-primary text-xs 3xl:text-sm">{subject.name.length}/250</p>
                {nameError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{nameError}</p>}
              </div>
            </div>
            <div className="input mt-3">
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
                  type="text"
                  name="metaDescription"
                  value={subject.metaDescription} // Use subject.metaDescription
                  handleChange={handleInputChange}
                  placeholder="e.g., Learn Java programming basics."
                />
                <p className="absolute bottom-1 right-3 text-primary-dark dark:text-primary text-xs 3xl:text-sm">{subject.metaDescription.length}/160</p>
                {metaDescError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{metaDescError}</p>}
              </div>
            </div>
          </Wrapper>

          <Wrapper className="p-5 my-3">
            <InputTitle className="mb-4">Category & Attributes</InputTitle>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="input">
                <InputLabel className="my-2">University</InputLabel>
                <div className="relative">
                  <UniversityDropDown value={selectedUniversity} onChange={handleUniversityChange} options={universityList} placeholder="Select University" />
                </div>
              </div>
              <div className="input">
                <InputLabel className="my-2">Faculty</InputLabel>
                <div className="relative">
                  <FacultyDropDown value={selectedFaculty} onChange={handleFacultyChange} options={facultyList} universityId={selectedUniversity?._id} placeholder="Select Faculty" />
                </div>
              </div>
              <div className="input">
                <InputLabel className="my-2">Program</InputLabel>
                <div className="relative">
                  <ProgramDropDown value={selectedProgram} onChange={handleProgramChange} facultyId={selectedFaculty?._id} placeholder="Select Program" />
                </div>
              </div>
              <div>
                <InputLabel className="my-2">Access Type</InputLabel>
                <select name="accessType" className={`${inputClassName} !px-2 outline-none bg-transparent`} value={subject.accessType} onChange={handleInputChange}>
                  <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="unpaid">
                    Free
                  </option>
                  <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="paid">
                    Paid
                  </option>
                </select>
              </div>
            </div>

            <div className="input">
              <InputLabel className="my-2">Tags</InputLabel>
              <TagsInput className={`${inputClassName} !p-0 !px-2 !pt-2 rounded-xl !min-h-28 !h-auto`} value={subject.tags} onChange={handleTagChange} inputProps={{ placeholder: "Add Tag" }} />
              {tagError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{tagError}</p>}
            </div>
          </Wrapper>

          <Wrapper className="p-5 py-7 w-full my-3">
            <InputTitle className="mb-4">Highlights Key Features</InputTitle>
            {subject.highlights.map((highlight, index) => (
              <div key={index} className="mb-4">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name={`highlight-${index}`}
                    className={`${inputClassName} pl-10 pr-20 w-full ${highlightErrors[index] ? "border-red-500 dark:border-red-500" : ""}`}
                    placeholder="e.g., Learn OOP concepts"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    onBlur={handleHighlightBlur}
                  />
                  <div className="icon size-9 3xl:size-10 rounded-full flexC text-white absolute top-1 left-1">
                    <IoIosCheckmarkCircle size={25} className={highlight.trim() !== "" ? "text-green-400" : "text-gray-400"} />
                  </div>
                  {index === subject.highlights.length - 1 && (
                    <button onClick={addHighlight} className="absolute top-2.5 right-9 size-6 3xl:size-5 bg-teal-200 rounded-full flexC" title="Add another highlight">
                      <FiPlus className="text-teal-500" />
                    </button>
                  )}
                  {subject.highlights.length > 1 && (
                    <button onClick={() => removeHighlight(index)} className="absolute top-2.5 right-2 size-6 3xl:size-5 bg-red-200 rounded-full flexC" title="Remove highlight">
                      <FiMinus className="text-red-900" />
                    </button>
                  )}
                </div>
                {highlightErrors[index] && <p className="text-red-500 text-xs 3xl:text-sm mt-1 ml-2">{highlightErrors[index]}</p>}
              </div>
            ))}
          </Wrapper>
        </div>

        <div className="w-1/3">
          <Wrapper className="p-5 w-full">
            <InputTitle className="mb-4">Thumbnail Image</InputTitle>
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
                    <span className="textColor font-medium cursor-pointer pl-1" onClick={() => thumbnailInputRef.current.click()}>
                      click to browse
                    </span>
                  </p>
                </div>
              )}
              <input ref={thumbnailInputRef} id="thumbnail" type="file" name="thumbnail" className="hidden" onChange={handleThumbnailChange} accept="image/png,image/jpeg,image/jpg" />
            </div>
          </Wrapper>

          <Wrapper className="p-5 w-full my-3">
            <InputTitle className="mb-4">Upload Files</InputTitle>
            <div className="input mt-4">
              <InputLabel className="my-2">Upload Resource File (Max 5MB - PDF)</InputLabel>
              <div
                onDrop={handleDropResource}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center w-full h-56 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
              >
                {resourcePreview ? (
                  <div className="relative w-full h-56 flex flex-col items-center justify-center p-4">
                    <div className="flex items-center gap-2">
                      <FaFolder size={30} />
                      <span className="text-sm font-medium text-ellipsis overflow-hidden max-w-[200px]">{resourceFile?.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{(resourceFile?.size / (1024 * 1024)).toFixed(2)} MB</span>
                    <button
                      onClick={() => {
                        setResourceFile(null);
                        setResourcePreview(null);
                        setResourceFileError("");
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
                      Drag and drop a PDF file or
                      <span className="textColor font-medium cursor-pointer pl-1" onClick={() => resourceInputRef.current.click()}>
                        click to browse
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">Max 5MB</p>
                  </div>
                )}
                <input ref={resourceInputRef} id="resourceFile" type="file" name="resourceFile" className="hidden" onChange={handleResourceFileChange} accept="application/pdf" />
              </div>
              {resourceFile && (
                <p className="text-xs mt-2 text-gray-500">
                  File type: {resourceFile.type || "Unknown"} | Size: {(resourceFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
              {resourceFileError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{resourceFileError}</p>}
            </div>
          </Wrapper>

          {subject.accessType === "paid" && (
            <div className="h-full mb-3">
              <Wrapper className="p-5">
                <InputTitle className="mb-4">Price</InputTitle>
                <div className="input">
                  <div className="flex justify-between items-center">
                    <InputLabel className="my-2">Price (USD)</InputLabel>
                    <Tooltip content="Add Discount">
                      <Switch
                        id="custom-switch-component"
                        checked={discountEnabled}
                        onChange={(e) => setDiscountEnabled(e.target.checked)}
                        ripple={false}
                        className="group inline-flex w-11 h-6 items-center rounded-full bg-dark-surface1 shadow-[0_0_0_1.5px_inset] shadow-s-stroke2 transition-colors data-[checked]:bg-[#282828] data-[checked]:shadow-[0_1.5px_0_inset] data-[checked]:shadow-white/20 dark:shadow-[inset_0_0_0_1.5px_rgba(248,248,248,0.20),inset_2px_0_8px_2px_rgba(248,248,248,0.20)] dark:data-[checked]:shadow-[inset_2px_0_8px_2px_rgba(248,248,248,0.20)]"
                        containerProps={{ className: "w-11 h-6" }}
                        circleProps={{ className: "before:hidden left-0.5 border-none" }}
                      />
                    </Tooltip>
                  </div>

                  <div className="relative">
                    <Input type="number" name="price" className="pl-12" value={subject.price} handleChange={handleInputChange} min="0" step="0.01" />
                    <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-green-300 rounded-full flexC text-white absolute top-1 left-1">
                      <CiDollar size={25} />
                    </div>
                  </div>
                </div>
                {discountEnabled && (
                  <>
                    <div className="input py-3">
                      <div className="flexbC">
                        <InputLabel className="my-2">Discount</InputLabel>
                      </div>
                      <div className="relative mt-2">
                        <Input type="number" name="discount" className="pl-12" value={subject.discount} handleChange={handleInputChange} min="0" step="0.01" />
                        <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-red-300 rounded-full flexC text-white absolute top-1 left-1">
                          <CiDiscount1 size={25} />
                        </div>
                      </div>
                      {discountError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{discountError}</p>}
                    </div>

                    <div className="input">
                      <InputLabel className="my-2">Duration of Discount</InputLabel>
                      <div className="relative">
                        <DatePicker
                          className={`!w-full h-11 3xl:h-12 px-5 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-full placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50`}
                          selected={subject.discountDate ? new Date(subject.discountDate) : null}
                          onChange={(date) =>
                            setSubject((prev) => ({
                              ...prev,
                              discountDate: date ? date.toISOString() : "",
                            }))
                          }
                          minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Tomorrow
                          placeholderText="Select discount end date"
                        />
                      </div>
                    </div>
                  </>
                )}
              </Wrapper>
            </div>
          )}
        </div>
      </section>
      <Wrapper className="p-5 mb-5">
        <Editor customId={groupId} value={description} onChange={setDescription} folderName="subject/description" folder="subject" subfolder="description" />
      </Wrapper>
    </>
  );
};
