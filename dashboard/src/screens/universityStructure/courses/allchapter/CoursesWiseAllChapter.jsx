import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BiSolidChevronRight } from "react-icons/bi";
import { FaComments, FaFilePdf } from "react-icons/fa";
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineBookOpen, HiOutlineListBullet } from "react-icons/hi2";
import { IoCheckmarkCircle, IoEye } from "react-icons/io5";
import { MdOutlinePlayCircle } from "react-icons/md";

import { getChaptersBySubjectSlug } from "@/redux/slices/universityStructure/courseSlice";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import { generateItemColor } from "@/utils";
import { LikeButton, RichTextRenderer, Wrapper } from "@/routes";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3940/3940417.png";

const getSavedChapterIndex = (slug) => {
  if (!slug) return 0;

  const savedIndex = Number.parseInt(localStorage.getItem(`chapterIndex_${slug}`), 10);
  return Number.isNaN(savedIndex) ? 0 : savedIndex;
};

const getCollectionCount = (value) => {
  if (Array.isArray(value)) return value.length;

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const CoursesWiseAllChapter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();

  const [currentIndex, setCurrentIndex] = useState(() => getSavedChapterIndex(slug));
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfFailed, setPdfFailed] = useState(false);

  const { chapterByCourse } = useSelector((state) => state.course);

  const chapters = chapterByCourse?.chapters || [];
  const subject = chapterByCourse?.subject;
  const total = chapterByCourse?.total;

  const originalPdfUrl = subject?.resourceFile?.file?.filePath || "";
  const cleanPdfUrl = slug ? `${REACT_APP_BACKEND_URL}/subject/${slug}/pdf` : "";
  const pdfFileName = subject?.resourceFile?.file?.fileName || subject?.resourceFile?.file?.originalName || `${subject?.name || "Course"} PDF`;
  const isPdfCourse = Boolean(originalPdfUrl) || Boolean(chapterByCourse?.isPdfCourse);

  useEffect(() => {
    if (slug) {
      dispatch(getChaptersBySubjectSlug(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (isPdfCourse) {
      setCurrentIndex(0);
      return;
    }

    if (chapters.length === 0) {
      setCurrentIndex(0);
      return;
    }

    const savedIndex = getSavedChapterIndex(slug);
    setCurrentIndex(Math.min(Math.max(savedIndex, 0), chapters.length - 1));
  }, [chapters.length, slug, isPdfCourse]);

  useEffect(() => {
    if (slug && chapters.length > 0 && !isPdfCourse) {
      localStorage.setItem(`chapterIndex_${slug}`, String(currentIndex));
    }
  }, [currentIndex, slug, chapters.length, isPdfCourse]);

  useEffect(() => {
    let objectUrl = "";
    let isActive = true;

    const loadPdfPreview = async () => {
      if (!isPdfCourse || !cleanPdfUrl) {
        setPdfPreviewUrl("");
        setPdfFailed(false);
        setPdfLoading(false);
        return;
      }

      try {
        setPdfLoading(true);
        setPdfFailed(false);
        setPdfPreviewUrl("");

        const response = await fetch(cleanPdfUrl, {
          method: "GET",
          headers: {
            Accept: "application/pdf",
          },
        });

        if (!response.ok) {
          throw new Error("PDF request failed");
        }

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.toLowerCase().includes("application/pdf")) {
          throw new Error("Response is not a PDF");
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        if (isActive) {
          setPdfPreviewUrl(objectUrl);
        }
      } catch (error) {
        console.error("PDF preview failed:", error);

        if (isActive) {
          setPdfFailed(true);
          setPdfPreviewUrl("");
        }
      } finally {
        if (isActive) {
          setPdfLoading(false);
        }
      }
    };

    loadPdfPreview();

    return () => {
      isActive = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isPdfCourse, cleanPdfUrl]);

  const currentChapter = chapters[currentIndex];

  const totalChapters = isPdfCourse ? 1 : Number(total) || chapters.length;
  const progressPercentage = isPdfCourse ? 100 : chapters.length > 0 ? ((currentIndex + 1) / chapters.length) * 100 : 0;

  const viewCount = isPdfCourse ? getCollectionCount(subject?.numOfViews) : getCollectionCount(currentChapter?.numOfViews);
  const commentCount = currentChapter?.comments?.length ?? currentChapter?.commentCount ?? 200;

  const authorName = currentChapter?.user?.name || currentChapter?.name || "Unknown author";
  const authorAvatar = currentChapter?.user?.avatar?.url || currentChapter?.avatar?.url;
  const authorAvatarPublicId = currentChapter?.user?.avatar?.publicId || currentChapter?.avatar?.publicId || authorName;
  const useGeneratedAvatar = !authorAvatar || authorAvatar === DEFAULT_AVATAR;

  const subjectBackground = useMemo(() => {
    const fallback = "linear-gradient(135deg, #172033 0%, #101827 48%, #0b1120 100%)";

    try {
      if (!subject?.logo?.filePath) return fallback;
      return generateItemColor(subject.logo.filePath) || fallback;
    } catch (error) {
      console.error("Unable to generate subject colour:", error);
      return fallback;
    }
  }, [subject?.logo?.filePath]);

  const authorBackground = useMemo(() => {
    try {
      return generateItemColor(authorName) || "linear-gradient(135deg, #06b6d4, #6366f1)";
    } catch {
      return "linear-gradient(135deg, #06b6d4, #6366f1)";
    }
  }, [authorName]);

  const handlePrevious = () => {
    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((previousIndex) => Math.min(previousIndex + 1, chapters.length - 1));
  };

  const handleFilterClick = (filterType, value) => {
    if (!value) return;

    if (filterType === "category") {
      navigate(`/filter?category=${encodeURIComponent(value)}`);
      return;
    }

    if (filterType === "tag") {
      navigate(`/filter?tag=${encodeURIComponent(value)}`);
    }
  };

  return (
    <Wrapper className="relative p-3 sm:p-4">
      <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-cyan-500/[0.012] blur-[115px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-indigo-500/[0.012] blur-[115px]" />

      <div className="relative z-10 grid grid-cols-1 gap-3 lg:grid-cols-[285px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/55 shadow-[0_16px_38px_rgba(15,23,42,0.06)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.20)]">
            <div className="p-3">
              <div className="relative overflow-hidden rounded-[20px] p-4" style={{ background: subjectBackground }}>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/5 via-black/15 to-black/65" />
                <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-white/[0.08] blur-[35px]" />

                <div className="relative z-10 flex items-center gap-3">
                  <div className="size-14 shrink-0 overflow-hidden rounded-2xl border border-white/[0.16] bg-white/[0.08] shadow-[0_12px_28px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                    {subject?.logo?.filePath ? (
                      <img src={subject.logo.filePath} alt={subject?.logo?.publicId || subject?.name || "Course logo"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-black text-white/90">{subject?.name?.charAt(0)?.toUpperCase() || "C"}</div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-white/45">Course workspace</p>
                    <h2 className="mt-1 line-clamp-2 text-sm font-bold capitalize leading-5 text-white/90">{subject?.name || "Course chapters"}</h2>
                    <p className="mt-1.5 text-[9px] text-white/50">{isPdfCourse ? "PDF course resource" : `${totalChapters} ${totalChapters === 1 ? "chapter" : "chapters"}`}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-y border-gray-200/70 px-4 py-4 dark:border-white/[0.05]">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <HiOutlineBookOpen className="text-cyan-600 dark:text-cyan-200/65" />
                  <span className="text-[9px] font-semibold text-gray-600 dark:text-white/50">{isPdfCourse ? "Resource progress" : "Course progress"}</span>
                </div>

                <span className="text-[9px] font-semibold tabular-nums text-cyan-700 dark:text-cyan-200/70">
                  {isPdfCourse ? "1/1" : `${chapters.length > 0 ? currentIndex + 1 : 0}/${chapters.length}`}
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/[0.055]">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-[width] duration-500" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            <div className="p-2.5">
              <div className="mb-2 flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <HiOutlineListBullet className="text-gray-400 dark:text-white/30" />
                  <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-gray-400 dark:text-white/25">{isPdfCourse ? "Resource navigator" : "Chapter navigator"}</p>
                </div>
              </div>

              <div className="max-h-[440px] space-y-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300/70 dark:scrollbar-thumb-white/[0.10]">
                {isPdfCourse ? (
                  <button
                    type="button"
                    aria-current="page"
                    className="group/chapter relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-cyan-300/30 bg-cyan-500/[0.07] px-3 py-3 text-left shadow-[0_10px_24px_rgba(6,182,212,0.08)] transition-all duration-300 dark:border-cyan-300/[0.12] dark:bg-cyan-300/[0.045]"
                  >
                    <span className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500" />

                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-500/[0.10] text-[11px] font-bold text-cyan-700 dark:border-cyan-300/[0.10] dark:bg-cyan-300/[0.06] dark:text-cyan-200/75">
                      <FaFilePdf />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[10px] font-semibold capitalize leading-4 text-gray-900 dark:text-white/85">{pdfFileName}</span>
                      <span className="mt-1 block text-[7px] font-medium uppercase tracking-[0.09em] text-gray-400 dark:text-white/20">PDF Resource</span>
                    </span>

                    <IoCheckmarkCircle className="shrink-0 text-cyan-600 dark:text-cyan-200/70" />
                  </button>
                ) : chapters.length > 0 ? (
                  chapters.map((chapter, index) => {
                    const isActive = currentIndex === index;

                    return (
                      <button
                        key={chapter?._id || index}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        aria-current={isActive ? "page" : undefined}
                        className={`group/chapter relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 text-left transition-all duration-300 ${
                          isActive
                            ? "border-cyan-300/30 bg-cyan-500/[0.07] shadow-[0_10px_24px_rgba(6,182,212,0.08)] dark:border-cyan-300/[0.12] dark:bg-cyan-300/[0.045]"
                            : "border-transparent hover:border-gray-200/80 hover:bg-gray-100/65 dark:hover:border-white/[0.05] dark:hover:bg-white/[0.025]"
                        }`}
                      >
                        {isActive && <span className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500" />}

                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-xl border text-[9px] font-bold tabular-nums transition-all ${
                            isActive
                              ? "border-cyan-300/25 bg-cyan-500/[0.10] text-cyan-700 dark:border-cyan-300/[0.10] dark:bg-cyan-300/[0.06] dark:text-cyan-200/75"
                              : "border-gray-200/75 bg-gray-50/70 text-gray-400 group-hover/chapter:text-gray-600 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/25 dark:group-hover/chapter:text-white/45"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className={`line-clamp-2 text-[10px] font-semibold capitalize leading-4 ${isActive ? "text-gray-900 dark:text-white/85" : "text-gray-600 dark:text-white/45"}`}>
                            {chapter?.title || chapter?.metaTitle || `Chapter ${index + 1}`}
                          </span>
                          <span className="mt-1 block text-[7px] font-medium uppercase tracking-[0.09em] text-gray-400 dark:text-white/20">Chapter {index + 1}</span>
                        </span>

                        {isActive ? (
                          <IoCheckmarkCircle className="shrink-0 text-cyan-600 dark:text-cyan-200/70" />
                        ) : (
                          <BiSolidChevronRight className="shrink-0 text-gray-300 transition-transform duration-300 group-hover/chapter:translate-x-0.5 group-hover/chapter:text-gray-500 dark:text-white/10 dark:group-hover/chapter:text-white/30" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300/80 px-4 text-center dark:border-white/[0.07]">
                    <HiOutlineBookOpen size={23} className="text-gray-400 dark:text-white/25" />
                    <p className="mt-3 text-[10px] font-semibold text-gray-600 dark:text-white/45">No chapters available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          {isPdfCourse ? (
            <div className="space-y-3">
              <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/50 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="relative z-10">
                  <div className="flex flex-col gap-5 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/[0.055] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65">
                          <span className="size-1.5 rounded-full bg-cyan-500 dark:bg-cyan-300/70" />
                          PDF Resource
                        </span>

                        <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Course file</span>
                      </div>

                      <h1 className="mt-4 max-w-5xl text-2xl font-black capitalize leading-[1.12] tracking-[-0.035em] text-gray-950 dark:text-white/90 sm:text-3xl">{subject?.name || "Course PDF"}</h1>
                    </div>

                    {cleanPdfUrl && (
                      <a
                        href={cleanPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-500/[0.07] px-3.5 text-[9px] font-semibold text-cyan-700 transition-all hover:-translate-y-0.5 hover:bg-cyan-500/[0.11] dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70 dark:hover:bg-cyan-300/[0.07]"
                      >
                        <FaFilePdf />
                        Open PDF
                      </a>
                    )}
                  </div>

                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleFilterClick("category", subject?.name)}
                        className="max-w-48 truncate text-[10px] font-medium capitalize text-gray-500 transition-colors hover:text-cyan-700 dark:text-white/35 dark:hover:text-cyan-200/70"
                      >
                        {subject?.name || "Course"}
                      </button>

                      <span className="rounded-full border border-indigo-300/20 bg-indigo-500/[0.05] px-2.5 py-1 text-[8px] font-semibold text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65">
                        PDF Course
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200/75 bg-white/55 px-3 text-[9px] font-medium text-gray-500 dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/35">
                        <IoEye size={14} />
                        <span className="tabular-nums">{viewCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {subject?.description && (
                <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/45 shadow-[0_16px_38px_rgba(15,23,42,0.045)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:shadow-[0_18px_42px_rgba(0,0,0,0.16)]">
                  <article className="p-5 text-gray-700 dark:text-white/65 sm:p-7 lg:p-8">
                    <RichTextRenderer content={subject.description || ""} />
                  </article>
                </section>
              )}

              <section className="overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/45 p-3 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-2 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/[0.07] text-rose-600 dark:border-rose-300/[0.08] dark:bg-rose-300/[0.04] dark:text-rose-200/70">
                      <FaFilePdf size={16} />
                    </span>

                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-rose-600 dark:text-rose-200/55">Course resource</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-gray-700 dark:text-white/55">{pdfFileName}</p>
                    </div>
                  </div>
                </div>

                <div className="min-h-[78vh] overflow-hidden rounded-[20px] border border-gray-200/70 bg-white dark:border-white/[0.06]">
                  {pdfLoading ? (
                    <div className="flex min-h-[70vh] items-center justify-center px-6 text-center">
                      <p className="text-sm font-semibold text-gray-600">Loading PDF...</p>
                    </div>
                  ) : !cleanPdfUrl || pdfFailed || !pdfPreviewUrl ? (
                    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
                      <FaFilePdf size={34} className="text-red-500" />
                      <h3 className="mt-4 text-sm font-semibold text-gray-800">PDF preview is not available</h3>
                      <p className="mt-2 max-w-md text-xs leading-5 text-gray-500">The PDF preview could not load in this page, but the backend PDF route is available.</p>

                      {cleanPdfUrl && (
                        <a href={cleanPdfUrl} target="_blank" rel="noreferrer" className="mt-5 rounded-xl bg-red-500 px-5 py-2 text-xs font-semibold text-white">
                          Open PDF
                        </a>
                      )}
                    </div>
                  ) : (
                    <iframe src={pdfPreviewUrl} title={pdfFileName} className="h-[78vh] w-full bg-white" />
                  )}
                </div>
              </section>
            </div>
          ) : currentChapter ? (
            <div className="space-y-3">
              <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/50 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="relative z-10">
                  <div className="flex flex-col gap-5 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/[0.055] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65">
                          <span className="size-1.5 rounded-full bg-cyan-500 dark:bg-cyan-300/70" />
                          Chapter {currentIndex + 1}
                        </span>

                        <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">of {chapters.length}</span>
                      </div>

                      <h1 className="mt-4 max-w-5xl text-2xl font-black capitalize leading-[1.12] tracking-[-0.035em] text-gray-950 dark:text-white/90 sm:text-3xl">
                        {currentChapter?.metaTitle || currentChapter?.title || `Chapter ${currentIndex + 1}`}
                      </h1>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        aria-label="Previous chapter"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200/80 bg-white/65 px-3.5 text-[9px] font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-cyan-300/35 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 dark:border-white/[0.06] dark:bg-white/[0.022] dark:text-white/45 dark:hover:border-cyan-300/[0.12] dark:hover:text-cyan-200/70"
                      >
                        <HiOutlineArrowLeft size={14} />
                        Previous
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={currentIndex === chapters.length - 1}
                        aria-label="Next chapter"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-500/[0.07] px-3.5 text-[9px] font-semibold text-cyan-700 transition-all hover:-translate-y-0.5 hover:bg-cyan-500/[0.11] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70 dark:hover:bg-cyan-300/[0.07]"
                      >
                        Next
                        <HiOutlineArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                      {useGeneratedAvatar ? (
                        <div
                          className="flex size-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold uppercase text-white shadow-[0_8px_20px_rgba(15,23,42,0.15)]"
                          style={{ background: authorBackground }}
                        >
                          {authorName.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <div className="size-9 shrink-0 overflow-hidden rounded-xl border border-gray-200/70 dark:border-white/[0.07]">
                          <img src={authorAvatar} alt={authorAvatarPublicId} className="h-full w-full object-cover" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Written by</p>
                        <p className="mt-0.5 max-w-40 truncate text-[10px] font-semibold capitalize text-gray-700 dark:text-white/60">{authorName}</p>
                      </div>

                      <BiSolidChevronRight className="text-gray-300 dark:text-white/15" />

                      <button
                        type="button"
                        onClick={() => handleFilterClick("category", currentChapter?.category?.title || subject?.name)}
                        className="max-w-48 truncate text-[10px] font-medium capitalize text-gray-500 transition-colors hover:text-cyan-700 dark:text-white/35 dark:hover:text-cyan-200/70"
                      >
                        {subject?.name || "Course"}
                      </button>

                      <span className="rounded-full border border-indigo-300/20 bg-indigo-500/[0.05] px-2.5 py-1 text-[8px] font-semibold text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65">
                        {totalChapters} {totalChapters === 1 ? "Chapter" : "Chapters"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200/75 bg-white/55 px-3 text-[9px] font-medium text-gray-500 dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/35">
                        <IoEye size={14} />
                        <span className="tabular-nums">{viewCount}</span>
                      </div>

                      <div className="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200/75 bg-white/55 px-3 text-[9px] font-medium text-gray-500 dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/35">
                        <FaComments size={13} />
                        <span className="tabular-nums">{commentCount}</span>
                      </div>

                      <div className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200/75 bg-white/55 px-2.5 text-gray-500 dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/35">
                        <LikeButton resourceType="currentChapter" contentId={currentChapter?._id} initialLikes={currentChapter?.likes || []} showtrue />
                        <span className="text-[9px] font-medium tabular-nums">{currentChapter?.likeCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/45 shadow-[0_16px_38px_rgba(15,23,42,0.045)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:shadow-[0_18px_42px_rgba(0,0,0,0.16)]">
                <div className="relative z-10">
                  {currentChapter?.tags?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 border-b border-gray-200/70 px-5 py-4 dark:border-white/[0.05] sm:px-7">
                      <span className="mr-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-white/25">Topics</span>

                      {currentChapter.tags.map((tag) => (
                        <button
                          key={tag?._id || tag?.tag}
                          type="button"
                          onClick={() => handleFilterClick("tag", tag?.tag)}
                          className="rounded-full border border-cyan-300/20 bg-cyan-500/[0.045] px-2.5 py-1 text-[8px] font-medium text-cyan-700 transition-all hover:border-cyan-400/35 hover:bg-cyan-500/[0.08] dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.03] dark:text-cyan-200/65 dark:hover:bg-cyan-300/[0.06]"
                        >
                          #{tag?.tag}
                        </button>
                      ))}
                    </div>
                  )}

                  <article className="p-5 text-gray-700 dark:text-white/65 sm:p-7 lg:p-8">
                    <RichTextRenderer content={currentChapter?.description || ""} />
                  </article>
                </div>
              </section>

              {currentChapter?.video?.filePath && (
                <section className="overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/45 p-3 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-4">
                  <div className="mb-3 flex items-center gap-3 px-2 pt-1">
                    <span className="flex size-9 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/[0.07] text-rose-600 dark:border-rose-300/[0.08] dark:bg-rose-300/[0.04] dark:text-rose-200/70">
                      <MdOutlinePlayCircle size={18} />
                    </span>

                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-rose-600 dark:text-rose-200/55">Chapter media</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-gray-700 dark:text-white/55">Video lesson</p>
                    </div>
                  </div>

                  <video src={currentChapter.video.filePath} controls preload="metadata" className="aspect-video w-full rounded-[20px] bg-black object-contain">
                    Your browser does not support the video tag.
                  </video>
                </section>
              )}
            </div>
          ) : (
            <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[26px] border border-dashed border-gray-300/80 bg-gray-50/40 px-6 text-center dark:border-white/[0.07] dark:bg-white/[0.014]">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-600 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/65">
                <HiOutlineBookOpen size={25} />
              </div>

              <h2 className="mt-4 text-sm font-semibold text-gray-700 dark:text-white/60">No chapter selected</h2>
              <p className="mt-1.5 max-w-sm text-[10px] leading-5 text-gray-400 dark:text-white/25">Select a chapter from the course navigator to begin reading.</p>
            </div>
          )}
        </main>
      </div>
    </Wrapper>
  );
};
