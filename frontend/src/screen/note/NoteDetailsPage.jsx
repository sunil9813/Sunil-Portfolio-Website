import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiFillLike } from "react-icons/ai";
import { BiSolidChevronRight } from "react-icons/bi";
import { FaBookmark, FaComments, FaDownload, FaExternalLinkAlt, FaFileAlt, FaFileExcel, FaFilePdf, FaFilePowerpoint, FaFileWord, FaImage, FaLock } from "react-icons/fa";
import { HiOutlineBookOpen, HiOutlineListBullet } from "react-icons/hi2";
import { IoCheckmarkCircle, IoEye } from "react-icons/io5";
import { toast } from "react-toastify";

import { getUserFavorite, toggleFavorite } from "@/redux/slices/common/favoriteSlice";
import { setInitialLikes, toggleLike, updateLikeLocally } from "@/redux/slices/common/likeSlice";
import { getChaptersBySubjectSlug } from "@/redux/slices/universityStructure/courseSlice";
import { REACT_APP_BACKEND_URL } from "@/utils/api";
import { shouldTrackViewOnce } from "@/utils/viewTracker";
import { RichTextRenderer } from "@/components/render/RichTextRenderer";
import { Comments } from "@/components/comment/Comments";

const getBackendResourcePreviewUrl = (slug, index) => {
  const baseUrl = REACT_APP_BACKEND_URL.replace(/\/$/, "");
  return `${baseUrl}/subject/${encodeURIComponent(slug)}/resource/${index}`;
};

const getPdfPreviewUrl = (slug, index) => {
  return `${getBackendResourcePreviewUrl(slug, index)}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`;
};

const formatFileSize = (size = 0) => {
  const sizeInMb = Number(size || 0) / (1024 * 1024);

  if (sizeInMb >= 1024) {
    return `${(sizeInMb / 1024).toFixed(2)} GB`;
  }

  return `${sizeInMb.toFixed(2)} MB`;
};

const getCount = (value) => {
  if (Array.isArray(value)) return value.length;

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : 0;
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-AU").format(getCount(value));
};

const getIsFavorite = (favoriteResource, resourceType, resourceId) => {
  const resources = favoriteResource?.[resourceType];

  if (!resources || !resourceId) return false;

  if (Array.isArray(resources)) {
    return resources.some((resource) => String(resource?._id || resource) === String(resourceId));
  }

  return Boolean(resources?.[resourceId]);
};

const getResourceDisplayName = (resource) => {
  return resource?.displayName || resource?.fileName || resource?.originalName || resource?.publicId || "Note resource";
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
        displayName: legacyFile.displayName || legacyFile.fileName || "Note resource",
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

export const NoteDetailsPage = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const [activeView, setActiveView] = useState("overview");
  const [activeResourceIndex, setActiveResourceIndex] = useState(0);

  const { chapterByCourse } = useSelector((state) => state.course);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { favoriteResource, isFavoriteLoading } = useSelector((state) => state.favorite);

  const subject = chapterByCourse?.subject;
  const resources = useMemo(() => getNormalizedResources(subject), [subject]);
  const activeResource = resources[activeResourceIndex];
  const resourceType = getResourceType(activeResource);
  const canViewResources = Boolean(isLoggedIn || user);
  const userId = user?._id;
  const subjectId = subject?._id;
  const initialLikes = useMemo(() => {
    if (Array.isArray(subject?.likes)) return subject.likes;

    return Array(getCount(subject?.likesCount)).fill("count");
  }, [subject?.likes, subject?.likesCount]);
  const currentLikeCount = useSelector((state) => state.like.likeCounts.course?.[subjectId]) ?? getCount(subject?.likes ?? subject?.likesCount);
  const isSubjectLiked = useSelector((state) => state.like.likedPosts.course?.[subjectId]) ?? initialLikes.some((likedUserId) => String(likedUserId) === String(userId));
  const commentCount = getCount(subject?.commentsCount ?? subject?.comments);
  const isSubjectFavorited = getIsFavorite(favoriteResource, "Courses", subjectId);
  const [localBookmarkCount, setLocalBookmarkCount] = useState(0);
  const [localViewCount, setLocalViewCount] = useState(0);
  const viewCount = localViewCount;

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
    if (activeResourceIndex >= resources.length) {
      setActiveResourceIndex(0);
    }
  }, [activeResourceIndex, resources.length]);

  useEffect(() => {
    if (subjectId) {
      dispatch(setInitialLikes({ resourceType: "course", id: subjectId, likes: initialLikes }));
    }
  }, [dispatch, initialLikes, subjectId]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserFavorite());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    setLocalBookmarkCount(
      getCount(subject?.bookmarksCount ?? subject?.bookmarkCount ?? subject?.favoritesCount ?? subject?.favoriteCount ?? subject?.bookmarks ?? subject?.favorites)
    );
  }, [subject?.bookmarks, subject?.bookmarkCount, subject?.bookmarksCount, subject?.favoriteCount, subject?.favorites, subject?.favoritesCount]);

  useEffect(() => {
    setLocalViewCount(getCount(subject?.numOfViews));
  }, [subject?.numOfViews]);

  useEffect(() => {
    if (!slug || !subjectId) return;
    if (!shouldTrackViewOnce(`note:overview:${subjectId}`)) return;

    const trackNoteOverviewView = async () => {
      try {
        const response = await axios.post(`${REACT_APP_BACKEND_URL}/subject/${slug}/view`);
        setLocalViewCount(getCount(response.data?.numOfViews));
      } catch {
        // View tracking should never block note reading.
      }
    };

    trackNoteOverviewView();
  }, [slug, subjectId]);

  const subjectBackground = useMemo(() => {
    const palettes = [
      {
        base: "rgb(8, 13, 31)",
        mid: "rgb(30, 64, 175)",
        glow: "rgb(34, 211, 238)",
        accent: "rgb(99, 102, 241)",
      },
      {
        base: "rgb(12, 10, 29)",
        mid: "rgb(76, 29, 149)",
        glow: "rgb(168, 85, 247)",
        accent: "rgb(56, 189, 248)",
      },
      {
        base: "rgb(6, 24, 38)",
        mid: "rgb(15, 118, 110)",
        glow: "rgb(45, 212, 191)",
        accent: "rgb(14, 165, 233)",
      },
      {
        base: "rgb(20, 10, 32)",
        mid: "rgb(131, 24, 67)",
        glow: "rgb(244, 114, 182)",
        accent: "rgb(129, 140, 248)",
      },
      {
        base: "rgb(4, 18, 36)",
        mid: "rgb(29, 78, 216)",
        glow: "rgb(96, 165, 250)",
        accent: "rgb(45, 212, 191)",
      },
      {
        base: "rgb(14, 20, 38)",
        mid: "rgb(55, 48, 163)",
        glow: "rgb(129, 140, 248)",
        accent: "rgb(34, 211, 238)",
      },
      {
        base: "rgb(9, 26, 24)",
        mid: "rgb(21, 128, 61)",
        glow: "rgb(74, 222, 128)",
        accent: "rgb(45, 212, 191)",
      },
      {
        base: "rgb(25, 13, 39)",
        mid: "rgb(109, 40, 217)",
        glow: "rgb(217, 70, 239)",
        accent: "rgb(59, 130, 246)",
      },
    ];

    const key = subject?.name || subject?.slug || subject?.logo?.filePath || subject?.thumbnail?.filePath || "course";

    const hash = Array.from(key).reduce((total, char, index) => {
      return total + char.charCodeAt(0) * (index + 1);
    }, 0);

    const palette = palettes[hash % palettes.length];
    const angle = 125 + (hash % 35);
    const glowX = 18 + (hash % 58);
    const glowY = 12 + ((hash >> 3) % 48);

    return `
    radial-gradient(circle at ${glowX}% ${glowY}%, ${palette.glow}55 0%, transparent 34%),
    linear-gradient(${angle}deg, ${palette.base} 0%, ${palette.mid} 54%, ${palette.accent} 100%)
  `;
  }, [subject?.name, subject?.slug, subject?.logo?.filePath, subject?.thumbnail?.filePath]);

  const handleResourceClick = (index) => {
    setActiveResourceIndex(index);
    setActiveView("resource");
  };

  const handleNoteLike = () => {
    if (!canViewResources || !subjectId || !userId) {
      toast.info("Please login to like this note.");
      return;
    }

    const currentLikes = Array(currentLikeCount).fill("user");
    const nextLikes = isSubjectLiked ? currentLikes.slice(0, Math.max(0, currentLikes.length - 1)) : [...currentLikes, userId];

    dispatch(updateLikeLocally({ resourceType: "course", id: subjectId, likes: nextLikes, userId, isLiked: isSubjectLiked }));

    dispatch(toggleLike({ resourceType: "course", id: subjectId, newLikes: nextLikes }))
      .unwrap()
      .catch(() => {
        dispatch(updateLikeLocally({ resourceType: "course", id: subjectId, likes: currentLikes, userId, isLiked: !isSubjectLiked }));
      });
  };

  const handleNoteBookmark = async () => {
    if (!canViewResources || !subjectId) {
      toast.info("Please login to bookmark this note.");
      return;
    }

    const nextIsFavorited = !isSubjectFavorited;
    setLocalBookmarkCount((currentValue) => Math.max(0, currentValue + (nextIsFavorited ? 1 : -1)));

    const response = await dispatch(toggleFavorite({ resourceType: "Courses", resourceId: subjectId }));

    if (response?.error) {
      setLocalBookmarkCount((currentValue) => Math.max(0, currentValue + (nextIsFavorited ? -1 : 1)));
      return;
    }

    dispatch(getUserFavorite());
  };

  const renderNoteStats = ({ includeFileMeta = false } = {}) => (
    <div className="mt-3 flex flex-wrap items-center gap-2 pb-0">
      {includeFileMeta && (
        <>
          <span className="inline-flex h-8 items-center rounded-full bg-slate-950/[0.045] px-3 text-[8px] font-bold uppercase tracking-[0.09em] text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:bg-white/[0.035] dark:text-white/38">
            {formatFileSize(activeResource?.size)}
          </span>

          <span className="inline-flex h-8 items-center rounded-full bg-slate-950/[0.045] px-3 text-[8px] font-bold uppercase tracking-[0.09em] text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:bg-white/[0.035] dark:text-white/38">
            {activeResource?.fileType || "File"}
          </span>
        </>
      )}

      <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-sky-500/[0.10] px-3 text-[8px] font-bold uppercase tracking-[0.09em] text-sky-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:bg-sky-300/[0.07] dark:text-sky-200/75">
        <IoEye size={12} />
        {formatNumber(viewCount)} Views
      </span>

      <button
        type="button"
        onClick={handleNoteLike}
        className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[8px] font-bold uppercase tracking-[0.09em] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:-translate-y-0.5 ${
          isSubjectLiked
            ? "bg-rose-500/[0.16] text-rose-700 dark:bg-rose-300/[0.10] dark:text-rose-200/85"
            : "bg-rose-500/[0.10] text-rose-700 hover:bg-rose-500/[0.14] dark:bg-rose-300/[0.07] dark:text-rose-200/75 dark:hover:bg-rose-300/[0.10]"
        }`}
      >
        <AiFillLike size={12} />
        {formatNumber(currentLikeCount)} Likes
      </button>

      <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-emerald-500/[0.10] px-3 text-[8px] font-bold uppercase tracking-[0.09em] text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:bg-emerald-300/[0.07] dark:text-emerald-200/75">
        <FaComments size={11} />
        {formatNumber(commentCount)} Comments
      </span>

      <button
        type="button"
        onClick={handleNoteBookmark}
        disabled={isFavoriteLoading}
        className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[8px] font-bold uppercase tracking-[0.09em] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60 ${
          isSubjectFavorited
            ? "bg-violet-500/[0.16] text-violet-700 dark:bg-violet-300/[0.10] dark:text-violet-200/85"
            : "bg-violet-500/[0.10] text-violet-700 hover:bg-violet-500/[0.14] dark:bg-violet-300/[0.07] dark:text-violet-200/75 dark:hover:bg-violet-300/[0.10]"
        }`}
      >
        <FaBookmark size={10} />
        {formatNumber(localBookmarkCount)} Bookmarks
      </button>
    </div>
  );

  return (
    <section className="course-details-page overflow-hidden p-3 sm:p-4">
      <div className="project-bg !overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <span className="absolute -left-[10%] top-[20%] block aspect-[1.5489] w-[87.5%] -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] rounded-[100%] bg-[#2B2B44] opacity-30 blur-3xl"></span>
          <span className="absolute -top-[20%] -right-[30%] block aspect-[1.3555] w-[69%] -rotate-45 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,#268D8C_0%,rgba(38,141,140,0)_100%)] opacity-35 blur-3xl"></span>
        </div>
      </div>
      <div className="container relative z-10 grid grid-cols-1 gap-3 lg:grid-cols-[285px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="min-w-0">
          <div className="overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/55 shadow-[0_16px_38px_rgba(15,23,42,0.06)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.20)]">
            <div className="p-3">
              <div className="relative overflow-hidden rounded-[20px] p-4" style={{ background: subjectBackground }}>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/5 via-black/15 to-black/65" />
                <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-white/[0.08] blur-[35px]" />

                <div className="relative z-10 flex items-center gap-3">
                  <div className="size-14 shrink-0 overflow-hidden rounded-2xl border border-white/[0.16] bg-white/[0.08] shadow-[0_12px_28px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                    {subject?.logo?.filePath ? (
                      <img src={subject.logo.filePath} alt={subject?.logo?.publicId || subject?.name || "Note logo"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-black text-white/90">{subject?.name?.charAt(0)?.toUpperCase() || "N"}</div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-white/45">Notes workspace</p>
                    <h2 className="mt-1 line-clamp-2 text-sm font-bold capitalize leading-5 text-white/90">{subject?.name || "Notes"}</h2>
                    <p className="mt-1.5 text-[9px] text-white/50">
                      {resources.length} {resources.length === 1 ? "resource" : "resources"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2.5">
              <div className="mb-2 flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <HiOutlineListBullet className="text-gray-400 dark:text-white/30" />
                  <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-gray-400 dark:text-white/25">Note navigator</p>
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
                      Note overview
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
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          {activeView === "overview" && (
            <div className="space-y-3">
              <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/50 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/[0.055] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65">
                        <span className="size-1.5 rounded-full bg-cyan-500 dark:bg-cyan-300/70" />
                        Note Overview
                      </span>
                      <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Introduction</span>
                    </div>

                    <h1 className="mt-3 max-w-5xl text-2xl font-black capitalize leading-[1.12] tracking-[-0.035em] text-gray-950 dark:text-white/90 sm:text-3xl">
                      {subject?.name || "Note overview"}
                    </h1>
                  </div>

                  <span className="rounded-full border border-amber-300/20 bg-amber-500/[0.05] px-3 py-1.5 text-[8px] font-semibold text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.035] dark:text-amber-200/65">
                    {resources.length} {resources.length === 1 ? "Resource" : "Resources"}
                  </span>
                </div>

                {renderNoteStats()}

                <div className="mt-3 text-gray-700 dark:text-white/65">
                  <div>
                    <RichTextRenderer content={subject?.description || subject?.metaDescription || "No note overview available."} />
                  </div>
                </div>
              </section>

              {resources.length > 0 && (
                <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/45 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.045)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:shadow-[0_18px_42px_rgba(0,0,0,0.16)] sm:p-6">
                  <div className="mb-4">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-amber-600 dark:text-amber-200/55">Note resources</p>
                    <h2 className="mt-1 text-lg font-black tracking-[-0.025em] text-gray-900 dark:text-white/90">Files included</h2>
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

          {activeView === "resource" && activeResource && !canViewResources && (
            <div className="space-y-3">
              <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/50 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="flex flex-col items-center justify-center py-16 text-center sm:py-20">
                  <span className="flex size-16 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-500/[0.08] text-2xl text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70">
                    <FaLock />
                  </span>

                  <p className="mt-5 text-[8px] font-semibold uppercase tracking-[0.14em] text-amber-600 dark:text-amber-200/55">Login required</p>

                  <h1 className="mt-2 max-w-xl text-2xl font-black capitalize leading-[1.12] tracking-[-0.035em] text-gray-950 dark:text-white/90 sm:text-3xl">
                    Login to view this resource
                  </h1>

                  <p className="mt-3 max-w-md text-[11px] leading-6 text-gray-500 dark:text-white/35">
                    The note overview is available to everyone. Please login to open, preview, or download the resource files.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <Link
                      to="/login"
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-300/25 bg-amber-500/[0.10] px-4 text-[10px] font-semibold text-amber-700 transition-all hover:-translate-y-0.5 hover:bg-amber-500/[0.14] dark:border-amber-300/[0.09] dark:bg-amber-300/[0.05] dark:text-amber-200/75 dark:hover:bg-amber-300/[0.08]"
                    >
                      <FaLock size={11} />
                      Login to view
                    </Link>

                    <button
                      type="button"
                      onClick={() => setActiveView("overview")}
                      className="inline-flex h-10 items-center rounded-xl border border-gray-200/80 bg-white/65 px-4 text-[10px] font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-cyan-300/35 hover:text-cyan-700 dark:border-white/[0.06] dark:bg-white/[0.022] dark:text-white/45 dark:hover:border-cyan-300/[0.12] dark:hover:text-cyan-200/70"
                    >
                      Back to overview
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeView === "resource" && activeResource && canViewResources && (
            <div className="space-y-3">
              <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/50 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-500/[0.055] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.035] dark:text-amber-200/65">
                        {getResourceIcon(activeResource)}
                        {getResourceLabel(activeResource)}
                      </span>

                      <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Resource {activeResourceIndex + 1}</span>
                    </div>

                    <h1 className="mt-3 max-w-5xl text-2xl font-black capitalize leading-[1.12] tracking-[-0.035em] text-gray-950 dark:text-white/90 sm:text-3xl">
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

                {renderNoteStats({ includeFileMeta: true })}
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

          {subject?._id && (
            <section className="mt-3">
              <Comments resourceId={subject._id} resourceType="Courses" />
            </section>
          )}
        </main>
      </div>
    </section>
  );
};
