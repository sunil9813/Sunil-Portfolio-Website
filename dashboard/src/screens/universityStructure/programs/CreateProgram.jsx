import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";

import { createProgram, getAllProgram } from "@/redux/slices/universityStructure/programSlice";
import { getAllFaculty } from "@/redux/slices/universityStructure/facultySlice";
import { getAllUniversity } from "@/redux/slices/universityStructure/universitySlice";
import Editor from "@/textEditor/Editor";
import { FacultyDropDown, GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, UniversityDropDown, Wrapper } from "@/routes";

const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

const initialState = {
  name: "",
  description: "",
  groupId: "",
  university: "",
  faculty: "",
};

export const CreateProgram = () => {
  const thumbnailInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [program, setProgram] = useState(initialState);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [description, setDescription] = useState("");
  const [groupId] = useState(() => uuidv4());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, university, faculty } = program;

  useEffect(() => {
    dispatch(getAllUniversity());
    dispatch(getAllFaculty());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleInputChange = (event) => {
    const { name: fieldName, value } = event.target;

    setProgram((previousProgram) => ({
      ...previousProgram,
      [fieldName]: value,
    }));
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

      if (selectedFile.size > MAX_THUMBNAIL_SIZE) {
        toast.error("Thumbnail file size exceeds the 10MB limit.");
        return;
      }

      setThumbnailPreview((currentPreview) => {
        if (currentPreview?.startsWith("blob:")) {
          URL.revokeObjectURL(currentPreview);
        }

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

  const handleRemoveThumbnail = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (thumbnailPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnail(null);
    setThumbnailPreview("");
  };

  const handleUniversityChange = (universityOption) => {
    setSelectedUniversity(universityOption);
    setSelectedFaculty(null);

    setProgram((previousProgram) => ({
      ...previousProgram,
      university: universityOption?._id || "",
      faculty: "",
    }));
  };

  const handleFacultyChange = (facultyOption) => {
    setSelectedFaculty(facultyOption);

    setProgram((previousProgram) => ({
      ...previousProgram,
      faculty: facultyOption?._id || "",
    }));
  };

  const handleCreate = async () => {
    if (!university) {
      toast.error("Please select a university.");
      return;
    }

    if (!faculty) {
      toast.error("Please select a faculty.");
      return;
    }

    if (!name.trim()) {
      toast.error("Program name is required.");
      return;
    }

    if (!thumbnail) {
      toast.error("Program thumbnail is required.");
      return;
    }

    if (isSubmitting) {
      return;
    }

    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("description", description || "");
    formData.append("groupId", groupId);
    formData.append("university", university);
    formData.append("faculty", faculty);
    formData.append("thumbnail", thumbnail);

    try {
      setIsSubmitting(true);

      await dispatch(createProgram(formData)).unwrap();
      await dispatch(getAllProgram()).unwrap();

      if (thumbnailPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }

      setProgram(initialState);
      setSelectedUniversity(null);
      setSelectedFaculty(null);
      setThumbnail(null);
      setThumbnailPreview("");
      setDescription("");

      toast.success("Program created successfully.");
      navigate("/all-program");
    } catch (error) {
      toast.error(error?.message || error || "Failed to create program.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StickyHeader>
        <HeadingTwo>Create Program</HeadingTwo>

        <div className="flex items-center gap-2">
          <GhostButton type="button" disabled={isSubmitting} onClick={() => navigate("/all-program")}>
            Cancel
          </GhostButton>

          <TertiaryButton type="button" disabled={isSubmitting} onClick={handleCreate}>
            {isSubmitting ? "Publishing..." : "Publish now"}
          </TertiaryButton>
        </div>
      </StickyHeader>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        {/* Program details */}
        <Wrapper className="group relative h-full overflow-hidden p-5 sm:p-6">
          {/* Wrapper background remains unchanged */}

          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-sky-500/[0.014] blur-[90px] transition-all duration-700 group-hover:bg-sky-500/[0.024]" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-violet-500/[0.012] blur-[90px] transition-all duration-700 group-hover:bg-violet-500/[0.022]" />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.012),transparent_40%,transparent_75%,rgba(255,255,255,0.003))]" />

          <div className="relative z-10">
            <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
              <InputTitle className="mb-1">Program details</InputTitle>

              <p className="text-[9px] leading-5 text-gray-400 dark:text-white/25">Connect the program to its university and faculty, then provide the program name.</p>
            </div>

            <div className="space-y-5">
              {/* University */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <InputLabel>University</InputLabel>

                  <span className="rounded-full border border-emerald-300/20 bg-emerald-500/[0.05] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/60">
                    Required
                  </span>
                </div>

                <UniversityDropDown value={selectedUniversity} onChange={handleUniversityChange} placeholder="Select University" />
              </div>

              {/* Faculty */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <InputLabel>Faculty</InputLabel>

                  {!selectedUniversity && <span className="text-[8px] text-gray-400 dark:text-white/20">Select a university first</span>}
                </div>

                <FacultyDropDown value={selectedFaculty} onChange={handleFacultyChange} universityId={selectedUniversity?._id || ""} disabled={!selectedUniversity} placeholder="Select Faculty" />
              </div>

              {/* Program name */}
              <div>
                <InputLabel className="mb-2">Program name</InputLabel>

                <Input type="text" name="name" value={name} handleChange={handleInputChange} placeholder="BBA, BCA, BIT" />

                <p className="mt-1.5 text-[9px] text-gray-400 dark:text-white/20">Enter the official name or abbreviation of the academic program.</p>
              </div>
            </div>
          </div>
        </Wrapper>

        {/* Thumbnail */}
        <Wrapper className="group relative h-full overflow-hidden p-5 sm:p-6">
          {/* Wrapper background remains unchanged */}

          <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-violet-500/[0.014] blur-[80px] transition-all duration-700 group-hover:bg-violet-500/[0.024]" />

          <div className="pointer-events-none absolute -bottom-20 -left-20 size-52 rounded-full bg-cyan-500/[0.010] blur-[80px]" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <InputTitle className="mb-1">Thumbnail image</InputTitle>

                <p className="text-[9px] text-gray-400 dark:text-white/25">Program cover or identification image</p>
              </div>

              <span className="rounded-full border border-gray-200/70 bg-gray-50/60 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
                Max 10MB
              </span>
            </div>

            <div
              role="button"
              tabIndex={0}
              aria-label="Upload program thumbnail"
              onClick={() => thumbnailInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  thumbnailInputRef.current?.click();
                }
              }}
              onDrop={handleDropThumbnail}
              onDragOver={(event) => event.preventDefault()}
              className="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/60 text-center transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/[0.025] focus:outline-none focus:ring-4 focus:ring-violet-500/[0.05] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-violet-300/[0.15] dark:hover:bg-violet-300/[0.025]"
            >
              {thumbnailPreview ? (
                <>
                  <img src={thumbnailPreview} alt="Program thumbnail preview" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                  <span className="absolute bottom-3 left-3 rounded-lg border border-white/[0.12] bg-black/45 px-2.5 py-1.5 text-[9px] font-medium text-white/90 backdrop-blur-xl">
                    Thumbnail preview
                  </span>

                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    title="Remove thumbnail"
                    aria-label="Remove program thumbnail"
                    className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/85 text-white shadow-[0_8px_20px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all hover:scale-105 hover:bg-rose-500"
                  >
                    <MdClose size={15} />
                  </button>
                </>
              ) : (
                <div className="flex max-w-[260px] flex-col items-center px-5">
                  <span className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-violet-300/20 bg-violet-500/[0.07] text-violet-600 shadow-[0_10px_26px_rgba(124,58,237,0.10)] dark:border-violet-300/[0.10] dark:bg-violet-300/[0.045] dark:text-violet-200/70">
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] to-transparent" />

                    <IoCameraSharp className="relative z-10" size={25} />
                  </span>

                  <p className="mt-4 text-[11px] font-medium text-gray-600 dark:text-white/50">Drag and drop an image</p>

                  <p className="mt-1.5 text-[9px] text-gray-400 dark:text-white/25">or click to browse PNG, JPG or JPEG</p>

                  <span className="mt-3 rounded-full border border-gray-200/70 bg-white/60 px-3 py-1 text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/25">
                    Required image
                  </span>
                </div>
              )}

              <input ref={thumbnailInputRef} id="thumbnail" type="file" name="thumbnail" className="hidden" onChange={handleThumbnailChange} accept="image/png,image/jpeg,image/jpg" />
            </div>
          </div>
        </Wrapper>
      </section>

      {/* Description editor */}
      <Wrapper className="group relative mt-3 overflow-hidden p-5 sm:p-6">
        {/* Wrapper background remains unchanged */}

        <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-sky-500/[0.014] blur-[95px] transition-all duration-700 group-hover:bg-sky-500/[0.024]" />

        <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-violet-500/[0.010] blur-[90px]" />

        <div className="relative z-10">
          <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
            <InputTitle className="mb-1">Program description</InputTitle>

            <p className="text-[9px] leading-5 text-gray-400 dark:text-white/25">Add the program overview, learning outcomes, duration, requirements and career opportunities.</p>
          </div>

          <div className="min-h-[400px] rounded-2xl border border-gray-200/70 bg-gray-50/35 p-2 dark:border-white/[0.045] dark:bg-white/[0.014]">
            <Editor customId={groupId} value={description} onChange={setDescription} folderName="program/description" folder="program" subfolder="description" />
          </div>
        </div>
      </Wrapper>
    </>
  );
};
