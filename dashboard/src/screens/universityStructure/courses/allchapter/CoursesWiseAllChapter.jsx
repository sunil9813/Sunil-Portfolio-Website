import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BiSolidChevronRight } from "react-icons/bi";
import { FaComments, FaDownload, FaExternalLinkAlt, FaFileAlt, FaFileExcel, FaFilePdf, FaFilePowerpoint, FaFileWord, FaImage } from "react-icons/fa";
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineBookOpen, HiOutlineListBullet } from "react-icons/hi2";
import { IoCheckmarkCircle, IoEye } from "react-icons/io5";
import { MdOutlinePlayCircle } from "react-icons/md";

import { getChaptersBySubjectSlug } from "@/redux/slices/universityStructure/courseSlice";
import { generateItemColor } from "@/utils";
import { LikeButton, RichTextRenderer, Wrapper } from "@/routes";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3940/3940417.png";

const getBackendResourcePreviewUrl = (slug, index) => {
  const baseUrl = REACT_APP_BACKEND_URL.replace(/\/$/, "");
  return `${baseUrl}/subject/${encodeURIComponent(slug)}/resource/${index}`;
};

const getPdfPreviewUrl = (slug, index) => {
  return `${getBackendResourcePreviewUrl(slug, index)}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`;
};

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

const getLessonKey = (lesson) => lesson?._id || lesson?.slug || lesson?.title || "";

const getSortedLessons = (lessons = []) => {
  return [...lessons].sort((firstLesson, secondLesson) => Number(firstLesson?.order || 0) - Number(secondLesson?.order || 0));
};

const findNestedLesson = (lessons = [], lessonKey = "") => {
  if (!lessonKey) return null;

  for (const lesson of lessons) {
    if (getLessonKey(lesson) === lessonKey) {
      return lesson;
    }

    const nestedLesson = findNestedLesson(lesson?.children || [], lessonKey);

    if (nestedLesson) {
      return nestedLesson;
    }
  }

  return null;
};

const formatFileSize = (size = 0) => {
  const sizeInMb = Number(size || 0) / (1024 * 1024);

  if (sizeInMb >= 1024) {
    return `${(sizeInMb / 1024).toFixed(2)} GB`;
  }

  return `${sizeInMb.toFixed(2)} MB`;
};

const getResourceDisplayName = (resource) => {
  return resource?.displayName || resource?.fileName || resource?.originalName || resource?.publicId || "Course resource";
};

const getResourceType = (resource) => {
  const fileName = `${resource?.fileName || resource?.displayName || ""}`.toLowerCase();
  const fileType = `${resource?.fileType || ""}`.toLowerCase();
  const resourceType = `${resource?.resourceType || ""}`.toLowerCase();

  if (resourceType === "pdf" || fileType.includes("pdf") || fileName.endsWith(".pdf")) return "pdf";
  if (resourceType === "word" || fileType.includes("word") || fileName.endsWith(".doc") || fileName.endsWith(".docx")) return "word";
  if (resourceType === "excel" || fileType.includes("excel") || fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) return "excel";
  if (resourceType === "ppt" || fileType.includes("powerpoint") || fileName.endsWith(".ppt") || fileName.endsWith(".pptx")) return "ppt";
  if (resourceType === "image" || fileType.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp"].some((extension) => fileName.endsWith(extension))) return "image";

  return "file";
};

const getResourceLabel = (resource) => {
  const type = getResourceType(resource);

  if (type === "pdf") return "PDF";
  if (type === "word") return "WORD";
  if (type === "excel") return "EXCEL";
  if (type === "ppt") return "PPT";
  if (type === "image") return "IMAGE";

  return "FILE";
};

const getResourceIcon = (resource, className = "") => {
  const type = getResourceType(resource);

  if (type === "pdf") return <FaFilePdf className={className} />;
  if (type === "word") return <FaFileWord className={className} />;
  if (type === "excel") return <FaFileExcel className={className} />;
  if (type === "ppt") return <FaFilePowerpoint className={className} />;
  if (type === "image") return <FaImage className={className} />;

  return <FaFileAlt className={className} />;
};

const getNormalizedResources = (subject) => {
  const resources = Array.isArray(subject?.resourceFiles) ? [...subject.resourceFiles] : [];

  if (subject?.resourceFile?.file?.filePath) {
    const legacyFile = subject.resourceFile.file;
    const alreadyExists = resources.some((resource) => resource?.publicId && resource.publicId === legacyFile.publicId);

    if (!alreadyExists) {
      resources.push({
        ...legacyFile,
        displayName: legacyFile.displayName || legacyFile.fileName || "Course resource",
        order: legacyFile.order || resources.length + 1,
      });
    }
  }

  return resources
    .filter((resource) => resource?.filePath)
    .sort((a, b) => {
      const firstOrder = Number(a?.order || 0);
      const secondOrder = Number(b?.order || 0);

      return firstOrder - secondOrder;
    });
};

export const CoursesWiseAllChapter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();

  const [currentIndex, setCurrentIndex] = useState(() => getSavedChapterIndex(slug));
  const [activeSubheadingSlug, setActiveSubheadingSlug] = useState("");
  const [expandedChapterIndex, setExpandedChapterIndex] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [activeResourceIndex, setActiveResourceIndex] = useState(0);

  const { chapterByCourse } = useSelector((state) => state.course);

  const chapters = chapterByCourse?.chapters || [];
  const subject = chapterByCourse?.subject;
  const total = chapterByCourse?.total;
  const resources = useMemo(() => getNormalizedResources(subject), [subject]);

  const currentChapter = chapters[currentIndex];
  const currentSubheading =
    activeSubheadingSlug && currentChapter?.subheadings?.length > 0
      ? findNestedLesson(currentChapter.subheadings, activeSubheadingSlug)
      : null;
  const activeLesson = currentSubheading || currentChapter;
  const activeResource = resources[activeResourceIndex];

  const totalChapters = Number(total) || chapters.length;
  const progressPercentage = chapters.length > 0 ? ((currentIndex + 1) / chapters.length) * 100 : resources.length > 0 ? 100 : 0;

  const viewCount = activeView === "chapter" ? getCollectionCount(activeLesson?.numOfViews) : getCollectionCount(subject?.numOfViews);
  const commentCount = activeLesson?.comments?.length ?? activeLesson?.commentCount ?? 200;

  const authorName = currentChapter?.user?.name || currentChapter?.name || "Unknown author";
  const authorAvatar = currentChapter?.user?.avatar?.url || currentChapter?.avatar?.url;
  const authorAvatarPublicId = currentChapter?.user?.avatar?.publicId || currentChapter?.avatar?.publicId || authorName;
  const useGeneratedAvatar = !authorAvatar || authorAvatar === DEFAULT_AVATAR;

  const isOfficeResource = (resource) => {
    const type = getResourceType(resource);

    return type === "word" || type === "excel" || type === "ppt";
  };

  const getOfficePreviewUrl = (fileUrl = "") => {
    if (!fileUrl) return "";
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
  };

  const getGooglePreviewUrl = (fileUrl = "") => {
    if (!fileUrl) return "";

    return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(fileUrl)}`;
  };

  useEffect(() => {
    if (slug) {
      dispatch(getChaptersBySubjectSlug(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (chapters.length === 0) {
      setCurrentIndex(0);
      return;
    }

    const savedIndex = getSavedChapterIndex(slug);
    const safeIndex = Math.min(Math.max(savedIndex, 0), chapters.length - 1);

    setCurrentIndex(safeIndex);
    setExpandedChapterIndex((previousIndex) => {
      if (Number.isInteger(previousIndex) && previousIndex >= 0 && previousIndex < chapters.length) {
        return previousIndex;
      }

      return safeIndex;
    });
  }, [chapters.length, slug]);

  useEffect(() => {
    if (slug && chapters.length > 0 && activeView === "chapter") {
      localStorage.setItem(`chapterIndex_${slug}`, String(currentIndex));
    }
  }, [currentIndex, slug, chapters.length, activeView]);

  useEffect(() => {
    if (activeResourceIndex >= resources.length) {
      setActiveResourceIndex(0);
    }
  }, [activeResourceIndex, resources.length]);

  const subjectBackground = useMemo(() => {
    const key = [subject?._id, subject?.slug, subject?.name, slug, subject?.logo?.filePath, subject?.thumbnail?.filePath].filter(Boolean).join("-");

    const source = key || `course-${slug || "default"}`;

    let hash = 0;

    for (let index = 0; index < source.length; index += 1) {
      hash = source.charCodeAt(index) + ((hash << 5) - hash);
      hash = hash & hash;
    }

    const positiveHash = Math.abs(hash);

    const hueOne = positiveHash % 360;
    const hueTwo = (hueOne + 38 + (positiveHash % 80)) % 360;
    const hueThree = (hueOne + 170 + (positiveHash % 35)) % 360;

    const glowX = 18 + (positiveHash % 58);
    const glowY = 12 + ((positiveHash >> 4) % 52);
    const angle = 125 + (positiveHash % 50);

    const base = `hsl(${hueOne}, 58%, 10%)`;
    const mid = `hsl(${hueTwo}, 70%, 27%)`;
    const accent = `hsl(${hueThree}, 82%, 48%)`;
    const glow = `hsla(${hueThree}, 95%, 62%, 0.34)`;

    return `
    radial-gradient(circle at ${glowX}% ${glowY}%, ${glow} 0%, transparent 34%),
    linear-gradient(${angle}deg, ${base} 0%, ${mid} 55%, ${accent} 100%)
  `;
  }, [subject?._id, subject?.slug, subject?.name, subject?.logo?.filePath, subject?.thumbnail?.filePath, slug]);
  const authorBackground = useMemo(() => {
    try {
      return generateItemColor(authorName) || "linear-gradient(135deg, #06b6d4, #6366f1)";
    } catch {
      return "linear-gradient(135deg, #06b6d4, #6366f1)";
    }
  }, [authorName]);

  const handlePrevious = () => {
    const nextIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(nextIndex);
    setExpandedChapterIndex(nextIndex);
    setActiveSubheadingSlug("");
    setActiveView("chapter");
  };

  const handleNext = () => {
    const nextIndex = Math.min(currentIndex + 1, chapters.length - 1);
    setCurrentIndex(nextIndex);
    setExpandedChapterIndex(nextIndex);
    setActiveSubheadingSlug("");
    setActiveView("chapter");
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

  const handleResourceClick = (index) => {
    setActiveResourceIndex(index);
    setActiveSubheadingSlug("");
    setActiveView("resource");
  };

  const handleChapterClick = (index) => {
    setCurrentIndex(index);
    setExpandedChapterIndex(index);
    setActiveSubheadingSlug("");
    setActiveView("chapter");
  };

  const handleSubheadingClick = (index, subheading) => {
    setCurrentIndex(index);
    setExpandedChapterIndex(index);
    setActiveSubheadingSlug(getLessonKey(subheading));
    setActiveView("chapter");
  };

  const renderSubheadingNavigator = (subheadings = [], chapterIndex, level = 0) => {
    return getSortedLessons(subheadings).map((subheading, subheadingIndex) => {
      const subheadingKey = getLessonKey(subheading) || `${chapterIndex}-${level}-${subheadingIndex}`;
      const childSubheadings = getSortedLessons(subheading?.children || []);
      const isSubheadingActive = activeView === "chapter" && currentIndex === chapterIndex && activeSubheadingSlug === subheadingKey;

      return (
        <div key={subheadingKey}>
          <button
            type="button"
            onClick={() => handleSubheadingClick(chapterIndex, subheading)}
            aria-current={isSubheadingActive ? "page" : undefined}
            className={`group/sub relative flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left transition-all duration-300 ${
              isSubheadingActive
                ? "bg-cyan-500/[0.08] text-gray-900 dark:bg-cyan-300/[0.055] dark:text-white/80"
                : "text-gray-500 hover:bg-gray-100/65 hover:text-gray-700 dark:text-white/36 dark:hover:bg-white/[0.025] dark:hover:text-white/60"
            }`}
          >
            {isSubheadingActive && <span className="absolute -left-[13px] bottom-2 top-2 w-[2px] rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500" />}
            <span className={`${level > 0 ? "size-1" : "size-1.5"} shrink-0 rounded-full bg-current opacity-45`} />
            <span className={`${level > 0 ? "text-[8px]" : "text-[9px]"} line-clamp-2 min-w-0 flex-1 font-semibold leading-4`}>{subheading?.title || `Topic ${subheadingIndex + 1}`}</span>
          </button>

          {level === 0 && childSubheadings.length > 0 && <div className="ml-4 border-l border-gray-200/50 pl-2 dark:border-white/[0.06]">{renderSubheadingNavigator(childSubheadings, chapterIndex, level + 1)}</div>}
        </div>
      );
    });
  };

  const resourceType = getResourceType(activeResource);

  return (
    <Wrapper className="course-details-page relative overflow-hidden p-3 sm:p-4">
      <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-cyan-500/[0.2] blur-[115px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-indigo-500/[0.15] blur-[115px]" />
      <div className="relative z-10 grid grid-cols-1 gap-3 lg:grid-cols-[285px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="min-w-0">
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
                    <h2 className="mt-1 line-clamp-2 text-sm font-bold capitalize leading-5 text-white/90">{subject?.name || "Course"}</h2>
                    <p className="mt-1.5 text-[9px] text-white/50">
                      {totalChapters} {totalChapters === 1 ? "chapter" : "chapters"} / {resources.length} {resources.length === 1 ? "resource" : "resources"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-y border-gray-200/70 px-4 py-4 dark:border-white/[0.05]">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <HiOutlineBookOpen className="text-cyan-600 dark:text-cyan-200/65" />
                  <span className="text-[9px] font-semibold text-gray-600 dark:text-white/50">Course progress</span>
                </div>

                <span className="text-[9px] font-semibold tabular-nums text-cyan-700 dark:text-cyan-200/70">{chapters.length > 0 ? `${currentIndex + 1}/${chapters.length}` : "0/0"}</span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/[0.055]">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-[width] duration-500" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            <div className="p-2.5">
              <div className="mb-2 flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <HiOutlineListBullet className="text-gray-400 dark:text-white/30" />
                  <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-gray-400 dark:text-white/25">Course navigator</p>
                </div>
              </div>

              <div className="space-y-1 pr-1">
                <button
                  type="button"
                  onClick={() => setActiveView("overview")}
                  aria-current={activeView === "overview" ? "page" : undefined}
                  className={`group/chapter relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 text-left transition-all duration-300 ${
                    activeView === "overview"
                      ? "border-cyan-300/30 bg-cyan-500/[0.07] shadow-[0_10px_24px_rgba(6,182,212,0.08)] dark:border-cyan-300/[0.12] dark:bg-cyan-300/[0.045]"
                      : "border-transparent hover:border-gray-200/80 hover:bg-gray-100/65 dark:hover:border-white/[0.05] dark:hover:bg-white/[0.025]"
                  }`}
                >
                  {activeView === "overview" && <span className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500" />}

                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-xl border text-[11px] font-bold transition-all ${
                      activeView === "overview"
                        ? "border-cyan-300/25 bg-cyan-500/[0.10] text-cyan-700 dark:border-cyan-300/[0.10] dark:bg-cyan-300/[0.06] dark:text-cyan-200/75"
                        : "border-gray-200/75 bg-gray-50/70 text-gray-400 group-hover/chapter:text-gray-600 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/25 dark:group-hover/chapter:text-white/45"
                    }`}
                  >
                    <HiOutlineBookOpen />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`line-clamp-2 text-[10px] font-semibold capitalize leading-4 ${activeView === "overview" ? "text-gray-900 dark:text-white/85" : "text-gray-600 dark:text-white/45"}`}
                    >
                      Course overview
                    </span>
                    <span className="mt-1 block text-[7px] font-medium uppercase tracking-[0.09em] text-gray-400 dark:text-white/20">Introduction</span>
                  </span>

                  {activeView === "overview" ? (
                    <IoCheckmarkCircle className="shrink-0 text-cyan-600 dark:text-cyan-200/70" />
                  ) : (
                    <BiSolidChevronRight className="shrink-0 text-gray-300 transition-transform duration-300 group-hover/chapter:translate-x-0.5 group-hover/chapter:text-gray-500 dark:text-white/10 dark:group-hover/chapter:text-white/30" />
                  )}
                </button>

                {resources.length > 0 && (
                  <>
                    <div className="px-2 pb-1 pt-3">
                      <p className="text-[7px] font-semibold uppercase tracking-[0.13em] text-gray-400 dark:text-white/20">Resources</p>
                    </div>

                    {resources.map((resource, index) => {
                      const isActive = activeView === "resource" && activeResourceIndex === index;

                      return (
                        <button
                          key={resource?.publicId || resource?.filePath || index}
                          type="button"
                          onClick={() => handleResourceClick(index)}
                          aria-current={isActive ? "page" : undefined}
                          className={`group/chapter relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 text-left transition-all duration-300 ${
                            isActive
                              ? "border-amber-300/30 bg-amber-500/[0.07] shadow-[0_10px_24px_rgba(245,158,11,0.08)] dark:border-amber-300/[0.12] dark:bg-amber-300/[0.045]"
                              : "border-transparent hover:border-gray-200/80 hover:bg-gray-100/65 dark:hover:border-white/[0.05] dark:hover:bg-white/[0.025]"
                          }`}
                        >
                          {isActive && <span className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />}

                          <span
                            className={`flex size-8 shrink-0 items-center justify-center rounded-xl border text-[11px] font-bold transition-all ${
                              isActive
                                ? "border-amber-300/25 bg-amber-500/[0.10] text-amber-700 dark:border-amber-300/[0.10] dark:bg-amber-300/[0.06] dark:text-amber-200/75"
                                : "border-gray-200/75 bg-gray-50/70 text-gray-400 group-hover/chapter:text-gray-600 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/25 dark:group-hover/chapter:text-white/45"
                            }`}
                          >
                            {getResourceIcon(resource)}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className={`line-clamp-2 text-[10px] font-semibold capitalize leading-4 ${isActive ? "text-gray-900 dark:text-white/85" : "text-gray-600 dark:text-white/45"}`}>
                              {getResourceDisplayName(resource)}
                            </span>
                            <span className="mt-1 block text-[7px] font-medium uppercase tracking-[0.09em] text-gray-400 dark:text-white/20">
                              {getResourceLabel(resource)} / {formatFileSize(resource?.size)}
                            </span>
                          </span>

                          {isActive ? (
                            <IoCheckmarkCircle className="shrink-0 text-amber-600 dark:text-amber-200/70" />
                          ) : (
                            <BiSolidChevronRight className="shrink-0 text-gray-300 transition-transform duration-300 group-hover/chapter:translate-x-0.5 group-hover/chapter:text-gray-500 dark:text-white/10 dark:group-hover/chapter:text-white/30" />
                          )}
                        </button>
                      );
                    })}
                  </>
                )}

                <div className="px-2 pb-1 pt-3">
                  <p className="text-[7px] font-semibold uppercase tracking-[0.13em] text-gray-400 dark:text-white/20">Chapters</p>
                </div>

                {chapters.length > 0 ? (
                  chapters.map((chapter, index) => {
                    const isActive = activeView === "chapter" && currentIndex === index;
                    const subheadings = Array.isArray(chapter?.subheadings) ? chapter.subheadings : [];
                    const hasSubheadings = subheadings.length > 0;
                    const isExpanded = hasSubheadings && expandedChapterIndex === index;

                    return (
                      <div key={chapter?._id || index} className="relative">
                        <button
                          type="button"
                          onClick={() => handleChapterClick(index)}
                          aria-current={isActive && !activeSubheadingSlug ? "page" : undefined}
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
                            <span className={`line-clamp-2 text-[10px] font-semibold leading-4 ${isActive ? "text-gray-900 dark:text-white/85" : "text-gray-600 dark:text-white/45"}`}>
                              {chapter?.title || chapter?.metaTitle || `Chapter ${index + 1}`}
                            </span>
                            <span className="mt-1 block text-[7px] font-medium uppercase tracking-[0.09em] text-gray-400 dark:text-white/20">Chapter {index + 1}</span>
                          </span>

                          {hasSubheadings ? (
                            <BiSolidChevronRight
                              className={`shrink-0 text-gray-300 transition-transform duration-300 group-hover/chapter:text-gray-500 dark:text-white/18 dark:group-hover/chapter:text-white/35 ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          ) : isActive ? (
                            <IoCheckmarkCircle className="shrink-0 text-cyan-600 dark:text-cyan-200/70" />
                          ) : (
                            <BiSolidChevronRight className="shrink-0 text-gray-300 transition-transform duration-300 group-hover/chapter:translate-x-0.5 group-hover/chapter:text-gray-500 dark:text-white/10 dark:group-hover/chapter:text-white/30" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="relative ml-[25px] mt-1.5 space-y-0.5 border-l border-gray-200/70 pl-3 dark:border-white/[0.07]">
                            {renderSubheadingNavigator(subheadings, index)}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300/80 px-4 text-center dark:border-white/[0.07]">
                    <HiOutlineBookOpen size={23} className="text-gray-400 dark:text-white/25" />
                    <p className="mt-3 text-[10px] font-semibold text-gray-600 dark:text-white/45">No chapters available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
        <main className="min-w-0">
          {activeView === "overview" && (
            <div className="space-y-3">
              <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/50 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="relative z-10">
                  <div className="flex flex-col gap-5 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/[0.055] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65">
                          <span className="size-1.5 rounded-full bg-cyan-500 dark:bg-cyan-300/70" />
                          Course Overview
                        </span>

                        <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Introduction</span>
                      </div>

                      <h1 className="mt-4 max-w-5xl text-2xl font-black capitalize leading-[1.12] tracking-[-0.035em] text-gray-950 dark:text-white/90 sm:text-3xl">
                        {subject?.name || "Course overview"}
                      </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-indigo-300/20 bg-indigo-500/[0.05] px-3 py-1.5 text-[8px] font-semibold text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65">
                        {totalChapters} {totalChapters === 1 ? "Chapter" : "Chapters"}
                      </span>

                      <span className="rounded-full border border-amber-300/20 bg-amber-500/[0.05] px-3 py-1.5 text-[8px] font-semibold text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.035] dark:text-amber-200/65">
                        {resources.length} {resources.length === 1 ? "Resource" : "Resources"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 text-gray-700 dark:text-white/65">
                    <RichTextRenderer content={subject?.description || subject?.metaDescription || "No course overview available."} />
                  </div>
                </div>
              </section>

              {resources.length > 0 && (
                <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/45 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.045)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:shadow-[0_18px_42px_rgba(0,0,0,0.16)] sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-amber-600 dark:text-amber-200/55">Course resources</p>
                      <h2 className="mt-1 text-lg font-black tracking-[-0.025em] text-gray-900 dark:text-white/90">Files included</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {resources.map((resource, index) => (
                      <button
                        key={resource?.publicId || resource?.filePath || index}
                        type="button"
                        onClick={() => handleResourceClick(index)}
                        className="flex items-center gap-3 rounded-2xl border border-gray-200/70 bg-white/55 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-amber-300/35 hover:bg-amber-500/[0.035] dark:border-white/[0.055] dark:bg-white/[0.022] dark:hover:border-amber-300/[0.10] dark:hover:bg-amber-300/[0.035]"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-500/[0.08] text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70">
                          {getResourceIcon(resource)}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[10px] font-semibold text-gray-800 dark:text-white/70">{getResourceDisplayName(resource)}</span>
                          <span className="mt-1 block text-[8px] font-medium uppercase tracking-[0.08em] text-gray-400 dark:text-white/25">
                            {getResourceLabel(resource)} / {formatFileSize(resource?.size)}
                          </span>
                        </span>

                        <BiSolidChevronRight className="shrink-0 text-gray-300 dark:text-white/15" />
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeView === "resource" && activeResource && (
            <div className="space-y-3">
              <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/50 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="flex flex-col gap-5 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-500/[0.055] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.035] dark:text-amber-200/65">
                        {getResourceIcon(activeResource)}
                        {getResourceLabel(activeResource)}
                      </span>

                      <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Resource {activeResourceIndex + 1}</span>
                    </div>

                    <h1 className="mt-4 max-w-5xl text-2xl font-black capitalize leading-[1.12] tracking-[-0.035em] text-gray-950 dark:text-white/90 sm:text-3xl">
                      {getResourceDisplayName(activeResource)}
                    </h1>

                    <p className="mt-3 text-[10px] text-gray-400 dark:text-white/30">{activeResource?.fileName}</p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <a
                      href={activeResource.filePath}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-300/25 bg-amber-500/[0.07] px-3.5 text-[9px] font-semibold text-amber-700 transition-all hover:-translate-y-0.5 hover:bg-amber-500/[0.11] dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70 dark:hover:bg-amber-300/[0.07]"
                    >
                      <FaExternalLinkAlt size={12} />
                      Open
                    </a>

                    <a
                      href={activeResource.filePath}
                      download={activeResource.fileName}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200/80 bg-white/65 px-3.5 text-[9px] font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-amber-300/35 hover:text-amber-700 dark:border-white/[0.06] dark:bg-white/[0.022] dark:text-white/45 dark:hover:border-amber-300/[0.12] dark:hover:text-amber-200/70"
                    >
                      <FaDownload size={12} />
                      Download
                    </a>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-gray-200/70 bg-white/55 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:border-white/[0.055] dark:bg-white/[0.02] dark:text-white/35">
                    {formatFileSize(activeResource?.size)}
                  </span>

                  <span className="rounded-full border border-gray-200/70 bg-white/55 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:border-white/[0.055] dark:bg-white/[0.02] dark:text-white/35">
                    {activeResource?.fileType || "File"}
                  </span>
                </div>
              </section>

              <section className="overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/45 p-3 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-4">
                {resourceType === "image" ? (
                  <div className="overflow-hidden rounded-[20px] border border-gray-200/70 bg-white dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <img src={activeResource.filePath} alt={getResourceDisplayName(activeResource)} className="max-h-[78vh] w-full object-contain" />
                  </div>
                ) : resourceType === "pdf" ? (
                  <iframe
                    src={getPdfPreviewUrl(slug, activeResourceIndex)}
                    title={getResourceDisplayName(activeResource)}
                    className="h-[calc(100dvh-330px)] min-h-[420px] w-full rounded-[20px] border border-gray-200/70 bg-white dark:border-white/[0.06]"
                  />
                ) : isOfficeResource(activeResource) ? (
                  <div className="overflow-hidden rounded-[20px] border border-gray-200/70 bg-white dark:border-white/[0.06]">
                    <iframe src={getOfficePreviewUrl(activeResource.filePath)} title={getResourceDisplayName(activeResource)} className="h-[78vh] w-full bg-white" allowFullScreen />

                    <div className="border-t border-gray-200/70 bg-gray-50/90 px-4 py-3 dark:border-white/[0.06] dark:bg-black/25">
                      <p className="text-[9px] leading-5 text-gray-500 dark:text-white/35">If preview does not load, open the file directly. Office preview requires the file URL to be public.</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={getGooglePreviewUrl(activeResource.filePath)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200/80 bg-white/70 px-3 text-[9px] font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-amber-300/35 hover:text-amber-700 dark:border-white/[0.06] dark:bg-white/[0.022] dark:text-white/45 dark:hover:border-amber-300/[0.12] dark:hover:text-amber-200/70"
                        >
                          <FaExternalLinkAlt size={11} />
                          Google preview
                        </a>

                        <a
                          href={activeResource.filePath}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 items-center gap-2 rounded-xl border border-amber-300/25 bg-amber-500/[0.07] px-3 text-[9px] font-semibold text-amber-700 transition-all hover:-translate-y-0.5 hover:bg-amber-500/[0.11] dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70 dark:hover:bg-amber-300/[0.07]"
                        >
                          <FaExternalLinkAlt size={11} />
                          Open original
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[56vh] flex-col items-center justify-center rounded-[20px] border border-dashed border-gray-300/80 bg-white/55 px-6 text-center dark:border-white/[0.07] dark:bg-white/[0.02]">
                    <span className="flex size-16 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-500/[0.08] text-2xl text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70">
                      {getResourceIcon(activeResource)}
                    </span>

                    <h2 className="mt-4 max-w-md text-sm font-semibold text-gray-800 dark:text-white/70">{getResourceDisplayName(activeResource)}</h2>

                    <p className="mt-2 max-w-md text-[10px] leading-5 text-gray-400 dark:text-white/25">
                      This file type may not preview inside the browser. Open or download it to view the full resource.
                    </p>

                    <a
                      href={activeResource.filePath}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-4 text-[10px] font-semibold text-white transition-all hover:-translate-y-0.5"
                    >
                      <FaExternalLinkAlt size={12} />
                      Open resource
                    </a>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeView === "chapter" &&
            (currentChapter ? (
              <div className="space-y-3">
                <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/50 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-6">
                  <div className="relative z-10">
                    <div className="flex flex-col gap-5 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/[0.055] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65">
                            <span className="size-1.5 rounded-full bg-cyan-500 dark:bg-cyan-300/70" />
                            {currentSubheading ? "Subheading" : `Chapter ${currentIndex + 1}`}
                          </span>

                          <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">
                            {currentSubheading ? currentChapter?.title || `Chapter ${currentIndex + 1}` : `of ${chapters.length}`}
                          </span>
                        </div>

                        <h1 className="mt-4 max-w-5xl text-2xl font-black capitalize leading-[1.12] tracking-[-0.035em] text-gray-950 dark:text-white/90 sm:text-3xl">
                          {activeLesson?.metaTitle || activeLesson?.title || `Chapter ${currentIndex + 1}`}
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
                    {activeLesson?.tags?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200/70 px-5 py-4 dark:border-white/[0.05] sm:px-7">
                        <span className="mr-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-white/25">Topics</span>

                        {activeLesson.tags.map((tag) => (
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
                      <RichTextRenderer content={activeLesson?.description || currentChapter?.description || ""} />
                    </article>
                  </div>
                </section>

                {activeLesson?.video?.filePath && (
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

                    <video src={activeLesson.video.filePath} controls preload="metadata" className="aspect-video w-full rounded-[20px] bg-black object-contain">
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
            ))}
        </main>
      </div>
    </Wrapper>
  );
};
