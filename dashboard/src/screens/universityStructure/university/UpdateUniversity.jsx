import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { BiWorld } from "react-icons/bi";
import { CiCalendar } from "react-icons/ci";
import { FaUniversity } from "react-icons/fa";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose, MdLocationPin } from "react-icons/md";

import { getAllUniversity, getUniversity, updateUniversity } from "@/redux/slices/universityStructure/universitySlice";
import Editor from "@/textEditor/Editor";
import { inputClassName } from "@/utils";
import { GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, Wrapper } from "@/routes";

const MAX_LOGO_SIZE = 10 * 1024 * 1024;

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

const LoadingSkeleton = () => {
  return (
    <>
      <div className="mb-3 h-16 animate-pulse rounded-2xl bg-gray-200 dark:bg-white/[0.035]" />

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <Wrapper className="p-5 sm:p-6">
          <div className="space-y-5">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-white/[0.045]" />

            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div className="mb-2 h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/[0.04]" />
                <div className="h-11 animate-pulse rounded-2xl bg-gray-200 dark:bg-white/[0.04]" />
              </div>
            ))}
          </div>
        </Wrapper>

        <div className="space-y-3">
          <Wrapper className="p-5">
            <div className="mb-4 h-5 w-28 animate-pulse rounded bg-gray-200 dark:bg-white/[0.045]" />
            <div className="h-64 animate-pulse rounded-3xl bg-gray-200 dark:bg-white/[0.04]" />
          </Wrapper>

          <Wrapper className="p-5">
            <div className="mb-2 h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/[0.04]" />
            <div className="h-11 animate-pulse rounded-2xl bg-gray-200 dark:bg-white/[0.04]" />
          </Wrapper>
        </div>
      </section>

      <Wrapper className="mt-3 p-5">
        <div className="mb-4 h-5 w-28 animate-pulse rounded bg-gray-200 dark:bg-white/[0.045]" />
        <div className="h-80 animate-pulse rounded-2xl bg-gray-200 dark:bg-white/[0.04]" />
      </Wrapper>
    </>
  );
};

export const UpdateUniversity = () => {
  const logoInputRef = useRef(null);
  const fallbackGroupIdRef = useRef(uuidv4());

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const { university: currentUniversity } = useSelector((state) => state.university);

  const [university, setUniversity] = useState(initialState);
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { name, edate, location, website, type, groupId } = university;

  const editorGroupId = groupId && groupId !== "undefined" && groupId !== "null" ? groupId : fallbackGroupIdRef.current;

  useEffect(() => {
    const loadUniversity = async () => {
      if (!slug) {
        return;
      }

      try {
        setIsLoading(true);

        await dispatch(getUniversity(slug)).unwrap();
        await dispatch(getAllUniversity()).unwrap();
      } catch (error) {
        toast.error(error?.message || error || "Failed to load university data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUniversity();
  }, [dispatch, slug]);

  useEffect(() => {
    if (!currentUniversity) {
      return;
    }

    setUniversity({
      name: currentUniversity.name || "",
      description: currentUniversity.description || "",
      edate: currentUniversity.edate || "",
      location: currentUniversity.location || "",
      website: currentUniversity.website || "",
      type: currentUniversity.type || "",
      groupId: currentUniversity.groupId || fallbackGroupIdRef.current,
    });

    setDescription(currentUniversity.description || "");
    setLogoPreview(currentUniversity.logo?.filePath || "");
  }, [currentUniversity]);

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

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
        toast.error("Logo file size exceeds the 10MB limit.");
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

  const handleRemoveSelectedLogo = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setLogo(null);

    setLogoPreview(currentUniversity?.logo?.filePath || "");
  };

  const handleInputChange = (event) => {
    const { name: fieldName, value } = event.target;

    setUniversity((previousUniversity) => ({
      ...previousUniversity,
      [fieldName]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("University name is required.");
      return;
    }

    if (!type) {
      toast.error("University type is required.");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description || "");
      formData.append("edate", edate);
      formData.append("location", location.trim());
      formData.append("website", website.trim());
      formData.append("type", type);
      formData.append("groupId", editorGroupId);

      if (logo) {
        formData.append("logo", logo);
      }

      await dispatch(
        updateUniversity({
          slug,
          formData,
        }),
      ).unwrap();

      await dispatch(getAllUniversity()).unwrap();

      toast.success("University updated successfully.");
      navigate("/all-university");
    } catch (error) {
      toast.error(error?.message || error || "Failed to update university.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !currentUniversity) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <StickyHeader>
        <HeadingTwo>Update University</HeadingTwo>

        <div className="flex items-center gap-2">
          <GhostButton type="button" onClick={() => navigate("/all-university")}>
            Cancel
          </GhostButton>

          <TertiaryButton type="button" onClick={handleUpdate}>
            Update University
          </TertiaryButton>
        </div>
      </StickyHeader>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        {/* University details */}
        <Wrapper className="group relative h-full overflow-hidden p-5 sm:p-6">
          {/* Wrapper background remains unchanged */}

          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-emerald-500/[0.014] blur-[90px] transition-all duration-700 group-hover:bg-emerald-500/[0.024]" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-indigo-500/[0.012] blur-[90px] transition-all duration-700 group-hover:bg-indigo-500/[0.022]" />

          <div className="relative z-10">
            <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
              <InputTitle className="mb-1">University details</InputTitle>

              <p className="text-[9px] leading-5 text-gray-400 dark:text-white/25">Update the institution name, location, website and university type.</p>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <InputLabel className="mb-2">University name</InputLabel>

                <div className="relative">
                  <Input type="text" name="name" className="pl-12" value={name} handleChange={handleInputChange} placeholder="University name" />

                  <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-500/[0.10] text-emerald-700 dark:border-emerald-300/[0.10] dark:bg-emerald-300/[0.055] dark:text-emerald-200/75">
                    <FaUniversity size={16} />
                  </span>
                </div>
              </div>

              {/* Address */}
              <div>
                <InputLabel className="mb-2">Address</InputLabel>

                <div className="relative">
                  <Input type="text" name="location" className="pl-12" value={location} handleChange={handleInputChange} placeholder="Searcy, AR, USA" />

                  <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-violet-300/20 bg-violet-500/[0.10] text-violet-700 dark:border-violet-300/[0.10] dark:bg-violet-300/[0.055] dark:text-violet-200/75">
                    <MdLocationPin size={17} />
                  </span>
                </div>
              </div>

              {/* Website */}
              <div>
                <InputLabel className="mb-2">Website URL</InputLabel>

                <div className="relative">
                  <Input type="text" name="website" className="pl-12" value={website} handleChange={handleInputChange} placeholder="https://www.example.com" />

                  <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-blue-300/20 bg-blue-500/[0.10] text-blue-700 dark:border-blue-300/[0.10] dark:bg-blue-300/[0.055] dark:text-blue-200/75">
                    <BiWorld size={17} />
                  </span>
                </div>
              </div>

              {/* University type */}
              <div>
                <InputLabel className="mb-2">University type</InputLabel>

                <select
                  name="type"
                  value={type}
                  onChange={handleInputChange}
                  required
                  className={`${inputClassName} !rounded-2xl !border-gray-200/80 !bg-gray-50/55 !px-3 !text-[11px] text-gray-700 outline-none transition-all focus:!border-indigo-400/40 dark:!border-white/[0.055] dark:!bg-white/[0.02] dark:!text-white/65 dark:focus:!border-indigo-300/[0.13]`}
                >
                  <option value="" className="bg-white text-gray-800 dark:bg-[#11151d] dark:text-white/90">
                    Select university type
                  </option>

                  <option value="Public" className="bg-white text-gray-800 dark:bg-[#11151d] dark:text-white/90">
                    Public
                  </option>

                  <option value="Private" className="bg-white text-gray-800 dark:bg-[#11151d] dark:text-white/90">
                    Private
                  </option>

                  <option value="Autonomous" className="bg-white text-gray-800 dark:bg-[#11151d] dark:text-white/90">
                    Autonomous
                  </option>
                </select>
              </div>
            </div>
          </div>
        </Wrapper>

        {/* Right column */}
        <div className="space-y-3">
          {/* Logo */}
          <Wrapper className="group relative overflow-hidden p-5">
            {/* Wrapper background remains unchanged */}

            <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-violet-500/[0.014] blur-[80px] transition-all duration-700 group-hover:bg-violet-500/[0.024]" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <InputTitle className="mb-1">Logo image</InputTitle>

                  <p className="text-[9px] text-gray-400 dark:text-white/25">PNG, JPG or JPEG</p>
                </div>

                <span className="rounded-full border border-gray-200/70 bg-gray-50/60 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
                  Max 10MB
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

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

                    <span className="absolute bottom-3 left-3 rounded-lg border border-white/[0.12] bg-black/45 px-2.5 py-1.5 text-[9px] font-medium text-white/90 backdrop-blur-xl">
                      {logo ? "New logo preview" : "Current university logo"}
                    </span>

                    {logo && (
                      <button
                        type="button"
                        onClick={handleRemoveSelectedLogo}
                        title="Restore existing logo"
                        aria-label="Restore existing university logo"
                        className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/85 text-white shadow-[0_8px_20px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all hover:scale-105 hover:bg-rose-500"
                      >
                        <MdClose size={15} />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex max-w-[250px] flex-col items-center px-5">
                    <span className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-violet-300/20 bg-violet-500/[0.07] text-violet-600 shadow-[0_10px_26px_rgba(124,58,237,0.10)] dark:border-violet-300/[0.10] dark:bg-violet-300/[0.045] dark:text-violet-200/70">
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] to-transparent" />

                      <IoCameraSharp className="relative z-10" size={25} />
                    </span>

                    <p className="mt-4 text-[11px] font-medium text-gray-600 dark:text-white/50">Drag and drop a logo</p>

                    <p className="mt-1.5 text-[9px] text-gray-400 dark:text-white/25">or click to browse your files</p>
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

                <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-teal-300/20 bg-teal-500/[0.10] text-teal-700 dark:border-teal-300/[0.10] dark:bg-teal-300/[0.055] dark:text-teal-200/75">
                  <CiCalendar size={18} />
                </span>
              </div>
            </div>
          </Wrapper>
        </div>
      </section>

      {/* Description editor */}
      <Wrapper className="group relative mt-3 overflow-hidden p-5 sm:p-6">
        {/* Wrapper background remains unchanged */}

        <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-indigo-500/[0.014] blur-[95px] transition-all duration-700 group-hover:bg-indigo-500/[0.024]" />

        <div className="relative z-10">
          <div className="mb-5 border-b border-gray-200/70 pb-4 dark:border-white/[0.05]">
            <InputTitle className="mb-1">Description</InputTitle>

            <p className="text-[9px] text-gray-400 dark:text-white/25">Update the full overview and information about this university.</p>
          </div>

          <div className="min-h-[400px] rounded-2xl border border-gray-200/70 bg-gray-50/35 p-2 dark:border-white/[0.045] dark:bg-white/[0.014]">
            <Editor
              key={`university-update-${editorGroupId}`}
              customId={editorGroupId}
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
