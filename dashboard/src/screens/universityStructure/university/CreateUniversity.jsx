import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { BiWorld } from "react-icons/bi";
import { CiCalendar } from "react-icons/ci";
import { FaUniversity } from "react-icons/fa";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose, MdLocationPin } from "react-icons/md";

import { TypeVisiDropdown } from "@/components/common/dropdown/CustomeDropDown";
import { createUniversity, getAllUniversity } from "@/redux/slices/universityStructure/universitySlice";
import Editor from "@/textEditor/Editor";
import { GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, Wrapper } from "@/routes";

const MAX_LOGO_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

const initialState = {
  name: "",
  description: "",
  edate: "",
  location: "",
  website: "",
  type: "",
  groupId: "",
};

export const CreateUniversity = () => {
  const logoInputRef = useRef(null);
  const groupIdRef = useRef(uuidv4());
  const groupId = groupIdRef.current;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [university, setUniversity] = useState(initialState);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, edate, location, website, type } = university;

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleInputChange = (event) => {
    const { name: fieldName, value } = event.target;

    setUniversity((previousUniversity) => ({
      ...previousUniversity,
      [fieldName]: value,
    }));
  };

  const isImageValid = useCallback((file) => {
    return ALLOWED_IMAGE_FORMATS.includes(file?.type);
  }, []);

  const processLogo = useCallback(
    (selectedFile) => {
      if (!selectedFile) {
        return;
      }

      if (!isImageValid(selectedFile)) {
        toast.error("Logo must be a PNG, JPEG, or JPG image.");
        return;
      }

      if (selectedFile.size > MAX_LOGO_SIZE) {
        toast.error("Logo file size exceeds the 2MB limit.");
        return;
      }

      setLogoPreview((currentPreview) => {
        if (currentPreview?.startsWith("blob:")) {
          URL.revokeObjectURL(currentPreview);
        }

        return URL.createObjectURL(selectedFile);
      });

      setLogo(selectedFile);
    },
    [isImageValid],
  );

  const handleLogoChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      processLogo(selectedFile);
    }

    event.target.value = "";
  };

  const handleDropLogo = useCallback(
    (event) => {
      event.preventDefault();

      const selectedFile = event.dataTransfer.files?.[0];

      if (selectedFile) {
        processLogo(selectedFile);
      }
    },
    [processLogo],
  );

  const handleRemoveLogo = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogo(null);
    setLogoPreview("");
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("University name is required.");
      return;
    }

    if (!type) {
      toast.error("University type is required.");
      return;
    }

    if (!logo) {
      toast.error("University logo is required.");
      return;
    }

    if (isSubmitting) {
      return;
    }

    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("description", description || "");
    formData.append("groupId", groupId);
    formData.append("edate", edate.trim());
    formData.append("website", website.trim());
    formData.append("location", location.trim());
    formData.append("logo", logo);
    formData.append("type", type);

    try {
      setIsSubmitting(true);

      await dispatch(createUniversity(formData)).unwrap();

      await dispatch(getAllUniversity()).unwrap();

      if (logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }

      setUniversity(initialState);
      setDescription("");
      setLogo(null);
      setLogoPreview("");

      toast.success("University created successfully.");

      navigate("/all-university");
    } catch (error) {
      toast.error(error?.message || error || "Failed to create university.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StickyHeader>
        <HeadingTwo>New University</HeadingTwo>

        <div className="flex items-center gap-2">
          <GhostButton type="button" disabled={isSubmitting} onClick={() => navigate("/all-university")}>
            Cancel
          </GhostButton>

          <TertiaryButton type="button" disabled={isSubmitting} onClick={handleCreate}>
            {isSubmitting ? "Publishing..." : "Publish now"}
          </TertiaryButton>
        </div>
      </StickyHeader>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        {/* University information */}
        <Wrapper className="group relative h-full overflow-hidden p-5 sm:p-6">
          {/* Wrapper background remains unchanged */}

          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-emerald-500/[0.014] blur-[90px] transition-all duration-700 group-hover:bg-emerald-500/[0.024]" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-indigo-500/[0.012] blur-[90px] transition-all duration-700 group-hover:bg-indigo-500/[0.022]" />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.012),transparent_40%,transparent_75%,rgba(255,255,255,0.003))]" />

          <div className="relative z-10">
            <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
              <InputTitle className="mb-1">University details</InputTitle>

              <p className="text-[9px] leading-5 text-gray-400 dark:text-white/25">Add the institution name, address, website and university type.</p>
            </div>

            <div className="space-y-5">
              {/* University name */}
              <div>
                <InputLabel className="mb-2">University name</InputLabel>

                <div className="relative">
                  <Input type="text" name="name" className="pl-12" value={name} handleChange={handleInputChange} placeholder="Enter university name" />

                  <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-500/[0.10] text-emerald-700 dark:border-emerald-300/[0.10] dark:bg-emerald-300/[0.055] dark:text-emerald-200/75 3xl:size-10">
                    <FaUniversity size={17} />
                  </span>
                </div>
              </div>

              {/* Address */}
              <div>
                <InputLabel className="mb-2">Address</InputLabel>

                <div className="relative">
                  <Input type="text" name="location" className="pl-12" value={location} handleChange={handleInputChange} placeholder="Searcy, AR, USA" />

                  <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-violet-300/20 bg-violet-500/[0.10] text-violet-700 dark:border-violet-300/[0.10] dark:bg-violet-300/[0.055] dark:text-violet-200/75 3xl:size-10">
                    <MdLocationPin size={18} />
                  </span>
                </div>
              </div>

              {/* Website */}
              <div>
                <InputLabel className="mb-2">Website URL</InputLabel>

                <div className="relative">
                  <Input type="text" name="website" className="pl-12" value={website} handleChange={handleInputChange} placeholder="https://www.example.com" />

                  <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-blue-300/20 bg-blue-500/[0.10] text-blue-700 dark:border-blue-300/[0.10] dark:bg-blue-300/[0.055] dark:text-blue-200/75 3xl:size-10">
                    <BiWorld size={18} />
                  </span>
                </div>
              </div>

              {/* Type */}
              <div>
                <InputLabel className="mb-2">University type</InputLabel>

                <div className="rounded-2xl border border-gray-200/80 bg-gray-50/45 p-1 transition-all focus-within:border-indigo-400/35 dark:border-white/[0.05] dark:bg-white/[0.016] dark:focus-within:border-indigo-300/[0.13]">
                  <TypeVisiDropdown value={type} onChange={handleInputChange} name="type" />
                </div>
              </div>
            </div>
          </div>
        </Wrapper>

        {/* Right column */}
        <div className="space-y-3">
          {/* Logo image */}
          <Wrapper className="group relative overflow-hidden p-5">
            {/* Wrapper background remains unchanged */}

            <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-violet-500/[0.014] blur-[80px] transition-all duration-700 group-hover:bg-violet-500/[0.024]" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <InputTitle className="mb-1">Logo image</InputTitle>

                  <p className="text-[9px] text-gray-400 dark:text-white/25">Square image recommended</p>
                </div>

                <span className="rounded-full border border-gray-200/70 bg-gray-50/60 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
                  Max 2MB
                </span>
              </div>

              <div
                role="button"
                tabIndex={0}
                aria-label="Upload university logo"
                onClick={() => logoInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    logoInputRef.current?.click();
                  }
                }}
                onDrop={handleDropLogo}
                onDragOver={(event) => event.preventDefault()}
                className="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300/80 bg-gray-50/60 text-center transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/[0.025] focus:outline-none focus:ring-4 focus:ring-violet-500/[0.05] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-violet-300/[0.15] dark:hover:bg-violet-300/[0.025]"
              >
                {logoPreview ? (
                  <>
                    <img src={logoPreview} alt="University logo preview" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                    <span className="absolute bottom-3 left-3 rounded-lg border border-white/[0.12] bg-black/45 px-2.5 py-1.5 text-[9px] font-medium text-white/90 backdrop-blur-xl">Logo preview</span>

                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      title="Remove logo"
                      aria-label="Remove university logo"
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

                    <p className="mt-4 text-[11px] font-medium text-gray-600 dark:text-white/50">Drag and drop a logo</p>

                    <p className="mt-1.5 text-[9px] text-gray-400 dark:text-white/25">or click to browse PNG, JPG or JPEG</p>

                    <span className="mt-3 rounded-full border border-gray-200/70 bg-white/60 px-3 py-1 text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/25">
                      Required image
                    </span>
                  </div>
                )}

                <input ref={logoInputRef} id="logo" type="file" name="logo" className="hidden" onChange={handleLogoChange} accept="image/png,image/jpeg,image/jpg" />
              </div>
            </div>
          </Wrapper>

          {/* Founded date */}
          <Wrapper className="group relative overflow-hidden p-5">
            {/* Wrapper background remains unchanged */}

            <div className="pointer-events-none absolute -bottom-20 -right-20 size-48 rounded-full bg-teal-500/[0.012] blur-[75px]" />

            <div className="relative z-10">
              <InputLabel className="mb-2">Founded</InputLabel>

              <div className="relative">
                <Input type="text" name="edate" className="pl-12" value={edate} handleChange={handleInputChange} placeholder="24 August 1999" />

                <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-teal-300/20 bg-teal-500/[0.10] text-teal-700 dark:border-teal-300/[0.10] dark:bg-teal-300/[0.055] dark:text-teal-200/75 3xl:size-10">
                  <CiCalendar size={18} />
                </span>
              </div>
            </div>
          </Wrapper>
        </div>
      </section>

      {/* Description */}
      <Wrapper className="group relative mb-5 mt-3 overflow-hidden p-5 sm:p-6">
        {/* Wrapper background remains unchanged */}

        <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-indigo-500/[0.014] blur-[95px] transition-all duration-700 group-hover:bg-indigo-500/[0.024]" />

        <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-cyan-500/[0.010] blur-[90px]" />

        <div className="relative z-10">
          <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
            <InputTitle className="mb-1">University description</InputTitle>

            <p className="text-[9px] leading-5 text-gray-400 dark:text-white/25">Write a detailed overview of the university, its history, courses and facilities.</p>
          </div>

          <div className="min-h-[400px] rounded-2xl border border-gray-200/70 bg-gray-50/35 p-2 dark:border-white/[0.045] dark:bg-white/[0.014]">
            <Editor
              key={`university-create-${groupId}`}
              customId={groupId}
              value={description || ""}
              onChange={setDescription}
              folderName="university/description"
              folder="university"
              subfolder="description"
            />
          </div>
        </div>
      </Wrapper>
    </>
  );
};
