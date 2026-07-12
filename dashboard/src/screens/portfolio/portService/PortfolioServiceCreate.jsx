import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { HiOutlineBriefcase, HiOutlineCheckBadge, HiOutlineDocumentText, HiOutlineInformationCircle, HiOutlinePhoto, HiOutlineSparkles } from "react-icons/hi2";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { VscVerifiedFilled } from "react-icons/vsc";

import { CommentEditor } from "@/components/comment/CommentEditor";
import { createService, getAllService } from "@/redux/slices/portfolio/portServiceService";
import { GhostButton, HeadingTwo, Input, InputTitle, StickyHeader, TertiaryButton, Wrapper } from "@/routes";

const MAX_COVER_SIZE = 2 * 1024 * 1024;

const ALLOWED_COVER_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

const initialState = {
  title: "",
};

const revokeObjectUrl = (url) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const formatFileSize = (size = 0) => {
  if (!size) {
    return "0 MB";
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const getPlainText = (html = "") => {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
};

const getErrorMessage = (error, fallback = "Failed to create service.") => {
  if (typeof error === "string") {
    return error;
  }

  return error?.response?.data?.error || error?.response?.data?.message || error?.data?.error || error?.data?.message || error?.message || error?.error || fallback;
};

const SectionHeader = ({ icon: Icon, eyebrow, title, description, accentClass, trailing }) => {
  return (
    <div className="mb-5 flex flex-col gap-4 border-b border-slate-200/70 pb-5 dark:border-white/[0.055] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm ${accentClass}`}>
          <Icon size={19} />
        </span>

        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-white/25">{eyebrow}</p>

          <InputTitle className="mt-1">{title}</InputTitle>

          <p className="mt-1 max-w-xl text-[9px] leading-4 text-slate-400 dark:text-white/25">{description}</p>
        </div>
      </div>

      {trailing}
    </div>
  );
};

export const PortfolioServiceCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const coverInputRef = useRef(null);

  const [serviceForm, setServiceForm] = useState(initialState);

  const [description, setDescription] = useState("");

  const [cover, setCover] = useState(null);

  const [coverPreview, setCoverPreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { title } = serviceForm;

  const plainDescription = useMemo(() => getPlainText(description), [description]);

  const titleLength = title.length;

  const descriptionLength = plainDescription.length;

  useEffect(() => {
    return () => {
      revokeObjectUrl(coverPreview);
    };
  }, [coverPreview]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setServiceForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const validateCover = (file) => {
    if (!ALLOWED_COVER_FORMATS.includes(file.type)) {
      toast.error("Cover must be a PNG, JPEG, or JPG image.");

      return false;
    }

    if (file.size > MAX_COVER_SIZE) {
      toast.error("Cover file size exceeds the 2MB limit.");

      return false;
    }

    return true;
  };

  const processCover = useCallback((selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (!validateCover(selectedFile)) {
      return;
    }

    setCoverPreview((currentPreview) => {
      revokeObjectUrl(currentPreview);

      return URL.createObjectURL(selectedFile);
    });

    setCover(selectedFile);
  }, []);

  const handleCoverChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      processCover(selectedFile);
    }

    event.target.value = "";
  };

  const handleDropCover = useCallback(
    (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      const selectedFile = event.dataTransfer.files?.[0];

      if (selectedFile) {
        processCover(selectedFile);
      }
    },
    [isSubmitting, processCover],
  );

  const handleRemoveCover = (event) => {
    event.preventDefault();
    event.stopPropagation();

    revokeObjectUrl(coverPreview);

    setCover(null);
    setCoverPreview("");
  };

  const resetForm = () => {
    revokeObjectUrl(coverPreview);

    setServiceForm(initialState);
    setDescription("");
    setCover(null);
    setCoverPreview("");
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Please enter a service title.");

      return false;
    }

    if (title.trim().length < 3) {
      toast.error("Service title must contain at least 3 characters.");

      return false;
    }

    if (!plainDescription) {
      toast.error("Please enter a service description.");

      return false;
    }

    if (!cover) {
      toast.error("Please upload a service cover image.");

      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (isSubmitting || !validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("title", title.trim());

      formData.append("description", description);

      formData.append("cover", cover);

      const result = await dispatch(createService(formData)).unwrap();

      /*
       * Refresh the service collection without allowing a
       * refresh failure to incorrectly report that creation failed.
       */
      await dispatch(getAllService());

      toast.success(result?.message || "Service created successfully.");

      resetForm();
      navigate("/service");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    revokeObjectUrl(coverPreview);
    navigate("/service");
  };

  return (
    <>
      <StickyHeader>
        <div>
          <HeadingTwo>Create Portfolio Service</HeadingTwo>

          <p className="mt-1 hidden text-[9px] text-slate-400 dark:text-white/25 sm:block">Build and publish a professional service for your portfolio.</p>
        </div>

        <div className="flex items-center gap-2">
          <GhostButton type="button" disabled={isSubmitting} onClick={handleCancel}>
            Cancel
          </GhostButton>

          <TertiaryButton type="button" disabled={isSubmitting} onClick={handleCreate}>
            {isSubmitting ? "Creating..." : "Create Service"}
          </TertiaryButton>
        </div>
      </StickyHeader>

      <section className="space-y-3 pb-8">
        {/* Page introduction */}
        <Wrapper className="relative overflow-hidden p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-indigo-500/[0.022] blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-cyan-500/[0.016] blur-[100px]" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-[20px] border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 shadow-[0_12px_30px_rgba(79,70,229,0.08)] dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                <HiOutlineBriefcase size={24} />
              </span>

              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-200/50">Service creation studio</p>

                <h1 className="mt-1 text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-white/90 sm:text-3xl">Present Your Professional Expertise</h1>

                <p className="mt-2 max-w-2xl text-[10px] leading-5 text-slate-500 dark:text-white/35">
                  Add a clear service title, detailed description and professional cover image to create an attractive portfolio offering.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="min-w-[92px] rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.05] p-3 text-center dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.03]">
                <p className="text-sm font-black tabular-nums text-indigo-700 dark:text-indigo-200/70">{titleLength}</p>

                <p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.09em] text-slate-400 dark:text-white/20">Title chars</p>
              </div>

              <div className="min-w-[92px] rounded-2xl border border-cyan-300/20 bg-cyan-500/[0.05] p-3 text-center dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.03]">
                <p className="text-sm font-black tabular-nums text-cyan-700 dark:text-cyan-200/70">{descriptionLength}</p>

                <p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.09em] text-slate-400 dark:text-white/20">Description</p>
              </div>

              <div className="min-w-[92px] rounded-2xl border border-emerald-300/20 bg-emerald-500/[0.05] p-3 text-center dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.03]">
                <p className="text-sm font-black text-emerald-700 dark:text-emerald-200/70">{cover ? "Ready" : "—"}</p>

                <p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.09em] text-slate-400 dark:text-white/20">Cover</p>
              </div>
            </div>
          </div>
        </Wrapper>

        {/* Main creation workspace */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">
          {/* Form content */}
          <main className="min-w-0 space-y-3">
            {/* Service title */}
            <Wrapper className="relative overflow-hidden p-5 sm:p-6">
              <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/[0.018] blur-[90px]" />

              <div className="relative z-10">
                <SectionHeader
                  icon={HiOutlineBriefcase}
                  eyebrow="Service identity"
                  title="Service Title"
                  description="Use a concise title that clearly explains the service you provide."
                  accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70"
                  trailing={
                    <span
                      className={`rounded-full border px-3 py-1.5 text-[8px] font-semibold tabular-nums ${
                        titleLength > 100
                          ? "border-amber-300/20 bg-amber-500/[0.06] text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.035] dark:text-amber-200/65"
                          : "border-slate-200/70 bg-slate-50/55 text-slate-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/30"
                      }`}
                    >
                      {titleLength}/120
                    </span>
                  }
                />

                <div>
                  <div className="relative">
                    <Input type="text" name="title" value={title} handleChange={handleInputChange} placeholder="e.g. Mobile App Design" maxLength={120} disabled={isSubmitting} className="pl-12" />

                    <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-indigo-300/20 bg-indigo-500/[0.08] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.04] dark:text-indigo-200/65 3xl:size-10">
                      <HiOutlineSparkles size={15} />
                    </span>
                  </div>

                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-slate-200/70 bg-slate-50/45 px-3 py-2.5 dark:border-white/[0.05] dark:bg-white/[0.012]">
                    <HiOutlineInformationCircle className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-200/60" />

                    <p className="text-[8px] leading-4 text-slate-400 dark:text-white/25">
                      A focused title such as “Website Development” or “UI/UX Design” helps visitors understand your offering immediately.
                    </p>
                  </div>
                </div>
              </div>
            </Wrapper>

            {/* Description */}
            <Wrapper className="relative overflow-visible p-5 sm:p-6">
              <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-cyan-500/[0.016] blur-[90px]" />

              <div className="relative z-10">
                <SectionHeader
                  icon={HiOutlineDocumentText}
                  eyebrow="Service information"
                  title="Detailed Description"
                  description="Explain the service, process, deliverables and value clients can expect."
                  accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70"
                  trailing={
                    <span className="rounded-full border border-slate-200/70 bg-slate-50/55 px-3 py-1.5 text-[8px] font-semibold tabular-nums text-slate-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/30">
                      {descriptionLength} characters
                    </span>
                  }
                />

                <div className="overflow-visible rounded-[22px] border border-slate-200/75 bg-slate-50/35 p-1 dark:border-white/[0.055] dark:bg-white/[0.01]">
                  <CommentEditor
                    type="default"
                    value={description}
                    onChange={setDescription}
                    className="!border-0 !bg-transparent"
                    placeholder="Describe your service, expertise, working process, deliverables and expected outcomes..."
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {["Describe the service", "Explain your process", "Highlight client value"].map((item, index) => (
                    <div key={item} className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50/45 px-3 py-2.5 dark:border-white/[0.05] dark:bg-white/[0.012]">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-500/[0.06] text-[8px] font-black text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/65">
                        {index + 1}
                      </span>

                      <span className="text-[8px] font-medium text-slate-500 dark:text-white/30">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Wrapper>
          </main>

          {/* Media and live preview */}
          <aside className="min-w-0 space-y-3">
            {/* Cover image */}
            <Wrapper className="relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-indigo-500/[0.018] blur-[80px]" />

              <div className="relative z-10">
                <SectionHeader
                  icon={HiOutlinePhoto}
                  eyebrow="Service media"
                  title="Cover Image"
                  description="Upload a professional image representing your service."
                  accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70"
                  trailing={
                    cover && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/[0.05] px-3 py-1.5 text-[8px] font-semibold text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.03] dark:text-emerald-200/65">
                        <HiOutlineCheckBadge size={13} />
                        Ready
                      </span>
                    )
                  }
                />

                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Upload service cover image"
                  onClick={() => {
                    if (!isSubmitting) {
                      coverInputRef.current?.click();
                    }
                  }}
                  onKeyDown={(event) => {
                    if (!isSubmitting && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();

                      coverInputRef.current?.click();
                    }
                  }}
                  onDrop={handleDropCover}
                  onDragOver={(event) => event.preventDefault()}
                  className="group/upload relative flex h-72 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[26px] border border-dashed border-slate-300/75 bg-slate-50/45 text-center outline-none transition-all duration-300 hover:border-indigo-400/40 hover:bg-indigo-500/[0.025] focus:ring-4 focus:ring-indigo-500/[0.05] dark:border-white/[0.08] dark:bg-white/[0.014] dark:hover:border-indigo-300/[0.15] dark:hover:bg-indigo-300/[0.022]"
                >
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} alt="Service cover preview" className="h-full w-full object-cover transition-transform duration-700 group-hover/upload:scale-[1.02]" />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

                      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-left">
                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-semibold text-white/90">{cover?.name}</p>

                          <p className="mt-1 text-[8px] text-white/50">{formatFileSize(cover?.size)}</p>
                        </div>

                        <span className="shrink-0 rounded-lg border border-white/[0.14] bg-black/35 px-2.5 py-1.5 text-[8px] font-medium text-white/75 backdrop-blur-xl">Click to replace</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        title="Remove cover"
                        aria-label="Remove cover image"
                        className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-xl border border-red-300/20 bg-red-500/85 text-white shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:bg-red-500"
                      >
                        <MdClose size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="flex max-w-[270px] flex-col items-center px-5">
                      <span className="flex size-16 items-center justify-center rounded-[22px] border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-600 shadow-[0_12px_30px_rgba(79,70,229,0.10)] transition-transform duration-300 group-hover/upload:-translate-y-1 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                        <IoCameraSharp size={27} />
                      </span>

                      <p className="mt-4 text-[11px] font-semibold text-slate-600 dark:text-white/50">Drop your service cover here</p>

                      <p className="mt-1.5 text-[8px] leading-4 text-slate-400 dark:text-white/25">PNG, JPG or JPEG · Maximum 2MB</p>

                      <span className="mt-4 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.06] px-3 py-2 text-[8px] font-semibold text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65">
                        Browse image
                      </span>
                    </div>
                  )}

                  <input ref={coverInputRef} id="cover" type="file" name="cover" className="hidden" onChange={handleCoverChange} accept="image/png,image/jpeg,image/jpg" disabled={isSubmitting} />
                </div>
              </div>
            </Wrapper>

            {/* Live service preview */}
            <Wrapper className="relative overflow-hidden p-4">
              <div className="pointer-events-none absolute -bottom-20 -right-20 size-56 rounded-full bg-cyan-500/[0.016] blur-[80px]" />

              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-cyan-600 dark:text-cyan-200/50">Live preview</p>

                    <h2 className="mt-1 text-[12px] font-black text-slate-900 dark:text-white/75">Service Card</h2>
                  </div>

                  <span className="flex size-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65">
                    <HiOutlineSparkles size={16} />
                  </span>
                </div>

                <div className="overflow-hidden rounded-[24px] border border-slate-200/75 bg-slate-50/45 dark:border-white/[0.055] dark:bg-white/[0.014]">
                  <div className="relative aspect-[16/9] overflow-hidden bg-[radial-gradient(circle_at_80%_12%,rgba(99,102,241,0.25),transparent_34%),radial-gradient(circle_at_12%_90%,rgba(6,182,212,0.18),transparent_40%),linear-gradient(145deg,#172033,#090e18)]">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Live service preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <HiOutlinePhoto className="text-4xl text-white/15" />
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/5" />

                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/[0.14] bg-black/30 px-2.5 py-1.5 text-[7px] font-semibold uppercase tracking-[0.09em] text-white/75 backdrop-blur-xl">
                      <HiOutlineBriefcase size={11} />
                      Service
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start gap-2">
                      <h3 className="line-clamp-2 flex-1 text-[12px] font-bold capitalize leading-5 text-slate-900 dark:text-white/75">{title.trim() || "Your service title"}</h3>

                      <VscVerifiedFilled className="mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-300/70" />
                    </div>

                    <p className="mt-2 line-clamp-3 text-[9px] leading-5 text-slate-500 dark:text-white/35">
                      {plainDescription || "Your service description will appear here as you enter the details."}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3 dark:border-white/[0.05]">
                      <span className="inline-flex items-center gap-2 text-[8px] font-medium text-slate-400 dark:text-white/25">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Portfolio service
                      </span>

                      <span className="text-[8px] font-semibold text-indigo-600 dark:text-indigo-200/60">Preview</span>
                    </div>
                  </div>
                </div>
              </div>
            </Wrapper>
          </aside>
        </div>
      </section>
    </>
  );
};
