import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { BiSolidChevronRight } from "react-icons/bi";
import { FaAward, FaBookmark, FaComments, FaLock, FaShoppingCart } from "react-icons/fa";
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineBookOpen, HiOutlineListBullet } from "react-icons/hi2";
import { IoCheckmarkCircle, IoEye } from "react-icons/io5";
import { MdOutlinePlayCircle } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";

import { generateItemColor } from "@/utils";
import { RichTextRenderer } from "@/components/render/RichTextRenderer";
import { Comments } from "@/components/comment/Comments";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductQuestions } from "@/components/product/ProductQuestions";
import { addCartItem } from "@/utils/cart";
import { toast } from "react-toastify";
import { REACT_APP_BACKEND_URL } from "@/utils/api";
import { shouldTrackViewOnce } from "@/utils/viewTracker";
import { getUserFavorite } from "@/redux/slices/common/favoriteSlice";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3940/3940417.png";
const COURSE_DETAIL_EMPTY = { subject: null, chapters: [], total: 0 };

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

const getProgressLessonKey = (type, id) => (id ? `${type}:${id}` : "");

const getLessonStats = (lesson = {}) => ({
  views: getCollectionCount(lesson?.numOfViews),
  likes: getCollectionCount(lesson?.likesCount ?? lesson?.likes),
  bookmarks: getCollectionCount(lesson?.bookmarksCount ?? lesson?.bookmarks),
});

const flattenSubheadingLessons = (subheadings = [], chapterIndex, chapter) => {
  return getSortedLessons(subheadings).flatMap((subheading) => {
    const item = {
      type: "subheading",
      lesson: subheading,
      chapter,
      chapterIndex,
      lessonKey: getLessonKey(subheading),
      progressKey: getProgressLessonKey("subheading", subheading?._id),
    };

    return [item, ...flattenSubheadingLessons(subheading?.children || [], chapterIndex, chapter)];
  });
};

const getCourseLessonSequence = (chapters = []) => {
  return getSortedLessons(chapters).flatMap((chapter, sortedIndex) => {
    const chapterIndex = chapters.findIndex((item) => String(item?._id || item?.slug || item?.title) === String(chapter?._id || chapter?.slug || chapter?.title));
    const safeChapterIndex = chapterIndex >= 0 ? chapterIndex : sortedIndex;
    const subheadingLessons = flattenSubheadingLessons(chapter?.subheadings || [], safeChapterIndex, chapter);

    if (subheadingLessons.length > 0) {
      return subheadingLessons;
    }

    return [
      {
        type: "chapter",
        lesson: chapter,
        chapter,
        chapterIndex: safeChapterIndex,
        lessonKey: getLessonKey(chapter),
        progressKey: getProgressLessonKey("chapter", chapter?._id),
      },
    ];
  });
};

const getCourseAggregateStats = (subject, chapters = []) => {
  const stats = getLessonStats(subject);

  const addLessonStats = (lesson) => {
    const lessonStats = getLessonStats(lesson);
    stats.views += lessonStats.views;
    stats.likes += lessonStats.likes;
    stats.bookmarks += lessonStats.bookmarks;

    (lesson?.children || []).forEach(addLessonStats);
  };

  chapters.forEach((chapter) => {
    addLessonStats(chapter);
    (chapter?.subheadings || []).forEach(addLessonStats);
  });

  return stats;
};

export const CourseDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [currentIndex, setCurrentIndex] = useState(() => getSavedChapterIndex(slug));
  const [activeSubheadingSlug, setActiveSubheadingSlug] = useState("");
  const [expandedChapterIndex, setExpandedChapterIndex] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [access, setAccess] = useState({ hasAccess: false, orderId: "", expiresAt: "" });
  const [learningProgress, setLearningProgress] = useState({ completedChapters: [], completedLessons: [], percent: 0, totalChapters: 0, totalLessons: 0, certificate: null });
  const [courseDetails, setCourseDetails] = useState(COURSE_DETAIL_EMPTY);
  const [courseStatus, setCourseStatus] = useState({ isLoading: true, isError: false, message: "" });
  const [retryKey, setRetryKey] = useState(0);
  const [statsOverrides, setStatsOverrides] = useState({});

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const chapters = courseDetails.chapters;
  const subject = courseDetails.subject;
  const total = courseDetails.total;
  const userId = user?._id;
  const lessonSequence = useMemo(() => getCourseLessonSequence(chapters), [chapters]);

  const currentChapter = chapters[currentIndex];
  const currentSubheading = activeSubheadingSlug && currentChapter?.subheadings?.length > 0 ? findNestedLesson(currentChapter.subheadings, activeSubheadingSlug) : null;
  const activeLesson = currentSubheading || currentChapter;
  const commentResourceId = activeView === "chapter" && currentChapter?._id ? currentChapter._id : subject?._id;
  const commentResourceType = activeView === "chapter" && currentChapter?._id ? "Chapter" : "Courses";
  const totalChapters = Number(total) || chapters.length;
  const normalizedAccessType = String(subject?.accessType || "").toLowerCase();
  const coursePrice = Number(subject?.price || 0);
  const isPaidCourse = ["paid", "pro"].includes(normalizedAccessType) || coursePrice > 0;
  const isUserLoggedIn = Boolean(isLoggedIn || user?._id);
  const hasPurchasedCourse = Boolean(access.hasAccess);
  const canAccessCourse = isPaidCourse ? hasPurchasedCourse : isUserLoggedIn;
  const needsLoginForPaidCourse = isPaidCourse && !isUserLoggedIn;
  const needsPurchaseForPaidCourse = isPaidCourse && isUserLoggedIn && !hasPurchasedCourse;
  const secureCourseDownloadUrl = subject?._id ? `${REACT_APP_BACKEND_URL}/business/download-link/course/${subject._id}` : "";
  const certificateDownloadUrl = learningProgress?.certificate?.downloadUrl || (subject?._id ? `${REACT_APP_BACKEND_URL}/business/certificate/${subject._id}?format=pdf` : "");
  const activeProgressKey = currentSubheading ? getProgressLessonKey("subheading", currentSubheading?._id) : getProgressLessonKey("chapter", currentChapter?._id);
  const completedLessonKeys = new Set([
    ...(learningProgress.completedLessons || []),
    ...(learningProgress.completedChapters || []).map((chapterId) => getProgressLessonKey("chapter", chapterId?._id || chapterId)),
  ]);
  const isCurrentLessonCompleted = activeProgressKey ? completedLessonKeys.has(activeProgressKey) : false;
  const hasLoadedCourse = Boolean(subject?._id);
  const progressPercentage = Number(learningProgress.percent || 0);
  const activeSequenceIndex = activeView === "chapter" ? lessonSequence.findIndex((item) => item.chapterIndex === currentIndex && item.lessonKey === getLessonKey(activeLesson)) : -1;
  const overviewStats = useMemo(() => getCourseAggregateStats(subject, chapters), [subject, chapters]);
  const activeInteractionType = activeView === "overview" ? "overview" : currentSubheading ? "subheading" : "chapter";
  const activeInteractionId = activeView === "overview" ? subject?._id : currentSubheading?._id || currentChapter?._id;
  const activeInteractionKey = `${activeInteractionType}:${activeInteractionId || "none"}`;
  const currentStats = statsOverrides[activeInteractionKey] || (activeView === "overview" ? overviewStats : getLessonStats(activeLesson));
  const activeLikes = Array.isArray(activeLesson?.likes) ? activeLesson.likes : [];
  const subjectLikes = Array.isArray(subject?.likes) ? subject.likes : [];
  const activeBookmarks = Array.isArray(activeLesson?.bookmarks) ? activeLesson.bookmarks : [];
  const isActiveLiked =
    statsOverrides[activeInteractionKey]?.liked ?? (activeView === "overview" ? subjectLikes : activeLikes).some((likedUserId) => String(likedUserId?._id || likedUserId) === String(userId));
  const isActiveBookmarked =
    statsOverrides[activeInteractionKey]?.bookmarked ??
    (activeView === "chapter" && currentSubheading ? activeBookmarks.some((bookmarkUserId) => String(bookmarkUserId?._id || bookmarkUserId) === String(userId)) : false);

  const viewCount = currentStats.views;
  const commentCount = activeLesson?.comments?.length ?? activeLesson?.commentCount ?? 200;
  const likeCount = currentStats.likes;
  const bookmarkCount = currentStats.bookmarks;

  const authorName = currentChapter?.user?.name || currentChapter?.name || "Unknown author";
  const authorAvatar = currentChapter?.user?.avatar?.url || currentChapter?.avatar?.url;
  const authorAvatarPublicId = currentChapter?.user?.avatar?.publicId || currentChapter?.avatar?.publicId || authorName;
  const useGeneratedAvatar = !authorAvatar || authorAvatar === DEFAULT_AVATAR;

  useEffect(() => {
    if (!slug) {
      setCourseDetails(COURSE_DETAIL_EMPTY);
      setCourseStatus({ isLoading: false, isError: true, message: "Course slug is missing." });
      return undefined;
    }

    const controller = new AbortController();

    const fetchCourseDetails = async () => {
      setCourseStatus({ isLoading: true, isError: false, message: "" });
      setCourseDetails(COURSE_DETAIL_EMPTY);
      setAccess({ hasAccess: false, orderId: "", expiresAt: "" });
      setLearningProgress({ completedChapters: [], completedLessons: [], percent: 0, totalChapters: 0, totalLessons: 0, certificate: null });

      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/subject/${slug}/chapters`, {
          signal: controller.signal,
          timeout: 15000,
          withCredentials: true,
        });

        const payload = response.data || {};

        setCourseDetails({
          ...payload,
          subject: payload.subject || null,
          chapters: Array.isArray(payload.chapters) ? payload.chapters : [],
          total: payload.total ?? (Array.isArray(payload.chapters) ? payload.chapters.length : 0),
        });
        setCourseStatus({ isLoading: false, isError: false, message: "" });
      } catch (error) {
        if (axios.isCancel?.(error) || error.name === "CanceledError") {
          return;
        }

        setCourseDetails(COURSE_DETAIL_EMPTY);
        setCourseStatus({
          isLoading: false,
          isError: true,
          message: error.response?.data?.message || error.response?.data?.error || error.message || "Course could not be loaded.",
        });
      }
    };

    fetchCourseDetails();

    return () => {
      controller.abort();
    };
  }, [slug, retryKey]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isUserLoggedIn || !subject?._id || !isPaidCourse) {
        setAccess({ hasAccess: false, orderId: "", expiresAt: "" });
        return;
      }

      setAccess({ hasAccess: false, orderId: "", expiresAt: "" });

      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/order/access/Course/${subject._id}`, { withCredentials: true });
        setAccess(response.data || { hasAccess: false, orderId: "", expiresAt: "" });
      } catch {
        setAccess({ hasAccess: false, orderId: "", expiresAt: "" });
      }
    };

    checkAccess();
  }, [isPaidCourse, isUserLoggedIn, subject?._id]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isUserLoggedIn || !subject?._id || !canAccessCourse) return;

      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/business/progress/${subject._id}`, { withCredentials: true });
        setLearningProgress({
          ...(response.data?.progress || {}),
          totalChapters: response.data?.totalChapters || 0,
          totalLessons: response.data?.totalLessons || 0,
          completedLessons: response.data?.completedLessons || response.data?.progress?.completedLessons || [],
          percent: response.data?.percent ?? response.data?.progress?.percent ?? 0,
          certificate: response.data?.certificate || null,
        });
      } catch {
        setLearningProgress({ completedChapters: [], completedLessons: [], percent: 0, totalChapters: 0, totalLessons: 0, certificate: null });
      }
    };

    fetchProgress();
  }, [canAccessCourse, isUserLoggedIn, subject?._id]);

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
    if (!hasLoadedCourse || !activeInteractionId) return;
    if (activeView === "chapter" && !canAccessCourse) return;
    if (!shouldTrackViewOnce(`course:${activeInteractionKey}`)) return;

    const trackView = async () => {
      try {
        let response;

        if (activeView === "overview") {
          response = await axios.post(`${REACT_APP_BACKEND_URL}/subject/${slug}/view`);
        } else if (currentSubheading?._id && currentChapter?._id) {
          response = await axios.post(`${REACT_APP_BACKEND_URL}/subject/chapter/${currentChapter._id}/subheading/${currentSubheading._id}/view`);
        } else if (currentChapter?._id) {
          response = await axios.post(`${REACT_APP_BACKEND_URL}/subject/chapter/${currentChapter._id}/view`);
        }

        if (response?.data) {
          setStatsOverrides((currentStatsOverrides) => ({
            ...currentStatsOverrides,
            [activeInteractionKey]: {
              ...(currentStatsOverrides[activeInteractionKey] || currentStats),
              views: activeView === "overview" ? Math.max(currentStats.views, overviewStats.views + 1) : (response.data.numOfViews ?? currentStats.views),
              likes: response.data.likesCount ?? currentStats.likes,
              bookmarks: response.data.bookmarksCount ?? currentStats.bookmarks,
            },
          }));
        }
      } catch {
        // View tracking should never block reading.
      }
    };

    trackView();
  }, [activeInteractionId, activeInteractionKey, activeView, canAccessCourse, currentChapter?._id, currentStats, currentSubheading?._id, hasLoadedCourse, overviewStats.views, slug]);

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
  const authorBackground = useMemo(() => {
    try {
      return generateItemColor(authorName) || "linear-gradient(135deg, #06b6d4, #6366f1)";
    } catch {
      return "linear-gradient(135deg, #06b6d4, #6366f1)";
    }
  }, [authorName]);

  const handlePrevious = () => {
    const nextSequenceIndex = Math.max(activeSequenceIndex - 1, 0);
    const nextLesson = lessonSequence[nextSequenceIndex];

    if (!nextLesson) return;

    setCurrentIndex(nextLesson.chapterIndex);
    setExpandedChapterIndex(nextLesson.chapterIndex);
    setActiveSubheadingSlug(nextLesson.type === "subheading" ? nextLesson.lessonKey : "");
    setActiveView("chapter");
  };

  const handleNext = () => {
    const nextSequenceIndex = activeSequenceIndex >= 0 ? Math.min(activeSequenceIndex + 1, lessonSequence.length - 1) : 0;
    const nextLesson = lessonSequence[nextSequenceIndex];

    if (!nextLesson) return;

    setCurrentIndex(nextLesson.chapterIndex);
    setExpandedChapterIndex(nextLesson.chapterIndex);
    setActiveSubheadingSlug(nextLesson.type === "subheading" ? nextLesson.lessonKey : "");
    setActiveView("chapter");
  };

  const handleToggleChapterComplete = async () => {
    if (!currentChapter?._id || !subject?._id || !activeProgressKey) return;

    try {
      const response = await axios.patch(
        `${REACT_APP_BACKEND_URL}/business/progress/${subject._id}`,
        {
          chapterId: currentChapter._id,
          lessonKey: activeProgressKey,
          completed: !isCurrentLessonCompleted,
        },
        { withCredentials: true },
      );

      setLearningProgress({
        ...(response.data?.progress || {}),
        totalChapters: response.data?.totalChapters || 0,
        totalLessons: response.data?.totalLessons || 0,
        certificate: response.data?.certificate || null,
      });

      toast.success(!isCurrentLessonCompleted ? "Marked as read." : "Marked as unread.");
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to update progress.");
    }
  };

  const handleChapterClick = (index) => {
    const chapter = chapters[index];
    const firstSubheading = getSortedLessons(chapter?.subheadings || [])[0];

    setCurrentIndex(index);
    setActiveSubheadingSlug(firstSubheading ? getLessonKey(firstSubheading) : "");
    setExpandedChapterIndex(index);
    setActiveView("chapter");
  };

  const handleSubheadingClick = (index, subheading) => {
    setCurrentIndex(index);
    setActiveSubheadingSlug(getLessonKey(subheading));
    setExpandedChapterIndex(index);
    setActiveView("chapter");
  };

  const handleAddToCart = () => {
    if (!subject?._id) return;

    if (!isUserLoggedIn) {
      toast.info("Please login before buying this course.");
      navigate("/login");
      return;
    }

    if (isPaidCourse && coursePrice <= 0) {
      toast.error("This premium course has no price yet. Please set a price from admin before checkout.");
      return;
    }

    addCartItem(subject, "Course");
    toast.success(`${subject?.name || "Course"} added to cart.`);
  };

  const handleToggleLike = async () => {
    if (!isLoggedIn || !activeInteractionId) {
      toast.info("Please login to like this lesson.");
      return;
    }

    const nextLiked = !isActiveLiked;
    const nextLikes = Math.max(0, likeCount + (nextLiked ? 1 : -1));

    setStatsOverrides((currentStatsOverrides) => ({
      ...currentStatsOverrides,
      [activeInteractionKey]: {
        ...(currentStatsOverrides[activeInteractionKey] || currentStats),
        likes: nextLikes,
        liked: nextLiked,
      },
    }));

    try {
      let response;

      if (activeView === "overview") {
        response = await axios.post(`${REACT_APP_BACKEND_URL}/like/course/${subject._id}`, {}, { withCredentials: true });
      } else if (currentSubheading?._id && currentChapter?._id) {
        response = await axios.post(`${REACT_APP_BACKEND_URL}/subject/chapter/${currentChapter._id}/subheading/${currentSubheading._id}/like`, {}, { withCredentials: true });
      } else if (currentChapter?._id) {
        response = await axios.post(`${REACT_APP_BACKEND_URL}/like/chapter/${currentChapter._id}`, {}, { withCredentials: true });
      }

      if (response?.data?.likesCount !== undefined) {
        setStatsOverrides((currentStatsOverrides) => ({
          ...currentStatsOverrides,
          [activeInteractionKey]: {
            ...(currentStatsOverrides[activeInteractionKey] || currentStats),
            likes: response.data.likesCount,
            liked: response.data.status === "added",
          },
        }));
      }
    } catch (error) {
      setStatsOverrides((currentStatsOverrides) => ({
        ...currentStatsOverrides,
        [activeInteractionKey]: {
          ...(currentStatsOverrides[activeInteractionKey] || currentStats),
          likes: likeCount,
          liked: isActiveLiked,
        },
      }));
      toast.error(error.response?.data?.error || "Unable to update like.");
    }
  };

  const handleToggleBookmark = async () => {
    if (!isLoggedIn || !activeInteractionId) {
      toast.info("Please login to bookmark this lesson.");
      return;
    }

    const nextBookmarked = !isActiveBookmarked;
    const nextBookmarks = Math.max(0, bookmarkCount + (nextBookmarked ? 1 : -1));

    setStatsOverrides((currentStatsOverrides) => ({
      ...currentStatsOverrides,
      [activeInteractionKey]: {
        ...(currentStatsOverrides[activeInteractionKey] || currentStats),
        bookmarks: nextBookmarks,
        bookmarked: nextBookmarked,
      },
    }));

    try {
      let response;

      if (activeView === "overview") {
        response = await axios.post(`${REACT_APP_BACKEND_URL}/favorite/`, { resourceType: "Courses", resourceId: subject._id }, { withCredentials: true });
      } else if (currentSubheading?._id && currentChapter?._id) {
        response = await axios.post(`${REACT_APP_BACKEND_URL}/subject/chapter/${currentChapter._id}/subheading/${currentSubheading._id}/bookmark`, {}, { withCredentials: true });
      } else if (currentChapter?._id) {
        response = await axios.post(`${REACT_APP_BACKEND_URL}/favorite/`, { resourceType: "Chapter", resourceId: currentChapter._id }, { withCredentials: true });
      }

      if (response?.data?.bookmarksCount !== undefined || response?.data?.status) {
        setStatsOverrides((currentStatsOverrides) => ({
          ...currentStatsOverrides,
          [activeInteractionKey]: {
            ...(currentStatsOverrides[activeInteractionKey] || currentStats),
            bookmarks: response.data.bookmarksCount ?? nextBookmarks,
            bookmarked: response.data.status === "added",
          },
        }));
      }

      if (activeView === "overview" || currentChapter?._id) {
        dispatch(getUserFavorite());
      }
    } catch (error) {
      setStatsOverrides((currentStatsOverrides) => ({
        ...currentStatsOverrides,
        [activeInteractionKey]: {
          ...(currentStatsOverrides[activeInteractionKey] || currentStats),
          bookmarks: bookmarkCount,
          bookmarked: isActiveBookmarked,
        },
      }));
      toast.error(error.response?.data?.error || "Unable to update bookmark.");
    }
  };

  const handleRetryLoadCourse = () => {
    setRetryKey((currentValue) => currentValue + 1);
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

  const renderSubheadingNavigator = (subheadings = [], chapterIndex, level = 0) => {
    return getSortedLessons(subheadings).map((subheading, subheadingIndex) => {
      const subheadingKey = getLessonKey(subheading) || `${chapterIndex}-${level}-${subheadingIndex}`;

      const childSubheadings = getSortedLessons(subheading?.children || []);

      const isSubheadingActive = activeView === "chapter" && currentIndex === chapterIndex && activeSubheadingSlug === subheadingKey;

      const isSubheadingCompleted = completedLessonKeys.has(getProgressLessonKey("subheading", subheading?._id));

      return (
        <div key={subheadingKey} className="relative">
          <button
            type="button"
            onClick={() => handleSubheadingClick(chapterIndex, subheading)}
            aria-current={isSubheadingActive ? "page" : undefined}
            className={`
              group/sub relative flex w-full items-center
              rounded-xl border text-left
              transition-all duration-300
              ${level > 0 ? "gap-2 px-2.5 py-2" : "gap-2.5 px-3 py-2.5"}
              ${
                isSubheadingActive
                  ? `
                    border-cyan-400/20
                    bg-cyan-500/[0.075]
                    text-gray-900
                    shadow-[0_6px_16px_rgba(6,182,212,0.06)]
                    dark:border-cyan-300/[0.09]
                    dark:bg-cyan-300/[0.05]
                    dark:text-white
                    dark:shadow-none
                  `
                  : `
                    border-transparent
                    text-gray-500
                    hover:border-gray-200/70
                    hover:bg-gray-100/65
                    hover:text-gray-750
                    dark:text-white/36
                    dark:hover:border-white/[0.045]
                    dark:hover:bg-white/[0.025]
                    dark:hover:text-white/62
                  `
              }
            `}
          >
            {/* Improved circle and center dot */}
            <span
              className={`
                relative flex shrink-0 items-center justify-center
                rounded-full border
                transition-all duration-300
                ${level > 0 ? "size-[19px]" : "size-6"}
                ${
                  isSubheadingCompleted
                    ? `
                      border-emerald-400/30
                      bg-emerald-500/[0.08]
                      text-emerald-600
                      shadow-[inset_0_0_0_3px_rgba(16,185,129,0.035)]
                      dark:border-emerald-300/[0.12]
                      dark:bg-emerald-300/[0.045]
                      dark:text-emerald-200/75
                    `
                    : isSubheadingActive
                      ? `
                        border-cyan-400/40
                        bg-cyan-500/[0.11]
                        text-cyan-600
                        shadow-[inset_0_0_0_3px_rgba(6,182,212,0.04),0_0_0_3px_rgba(6,182,212,0.025)]
                        dark:border-cyan-300/[0.18]
                        dark:bg-cyan-300/[0.07]
                        dark:text-cyan-200/80
                        dark:shadow-[inset_0_0_0_3px_rgba(94,234,212,0.02),0_0_0_3px_rgba(94,234,212,0.01)]
                      `
                      : `
                        border-gray-300/90
                        bg-white/60
                        text-gray-400
                        shadow-[inset_0_0_0_3px_rgba(15,23,42,0.018)]
                        group-hover/sub:border-cyan-400/30
                        group-hover/sub:bg-cyan-500/[0.055]
                        group-hover/sub:text-cyan-600
                        dark:border-white/20
                        dark:bg-white/[0.018]
                        dark:text-white/30
                        dark:shadow-[inset_0_0_0_3px_rgba(255,255,255,0.012)]
                        dark:group-hover/sub:border-cyan-300/20
                        dark:group-hover/sub:bg-cyan-300/[0.04]
                        dark:group-hover/sub:text-cyan-200/65
                      `
                }
              `}
            >
              {isSubheadingCompleted ? (
                <IoCheckmarkCircle size={level > 0 ? 13 : 16} className="drop-shadow-[0_2px_5px_rgba(16,185,129,0.18)]" />
              ) : (
                <span
                  className={`
                    rounded-full transition-all duration-300
                    ${level > 0 ? "size-1.5" : "size-[7px]"}
                    ${
                      isSubheadingActive
                        ? `
                          bg-cyan-500
                          shadow-[0_0_7px_rgba(6,182,212,0.60)]
                          dark:bg-cyan-300/80
                        `
                        : `
                          bg-gray-400/55
                          group-hover/sub:bg-cyan-500
                          group-hover/sub:shadow-[0_0_6px_rgba(6,182,212,0.35)]
                          dark:bg-white/25
                          dark:group-hover/sub:bg-cyan-300/65
                        `
                    }
                  `}
                />
              )}
            </span>

            {/* Subheading title */}
            <span
              className={`
                min-w-0 flex-1 line-clamp-2
                font-semibold leading-4
                transition-colors duration-300
                ${level > 0 ? "text-[8px]" : "text-[9px]"}
              `}
            >
              {subheading?.title || `Topic ${subheadingIndex + 1}`}
            </span>
          </button>

          {/* Nested subheadings */}
          {level === 0 && childSubheadings.length > 0 && (
            <div
              className="
                relative ml-3 mt-0.5 pl-4
                before:pointer-events-none
                before:absolute before:bottom-2 before:left-3
                before:top-0 before:w-px
                before:bg-gradient-to-b
                before:from-cyan-400/25
                before:via-gray-200/70
                before:to-transparent
                dark:before:from-cyan-300/12
                dark:before:via-white/[0.055]
              "
            >
              {renderSubheadingNavigator(childSubheadings, chapterIndex, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (courseStatus.isLoading && !hasLoadedCourse) {
    return (
      <section className="course-details-page flex min-h-[70vh] items-center justify-center overflow-hidden p-3 sm:p-4">
        <div className="relative z-10 w-full max-w-2xl rounded-[30px] border border-white/10 bg-white/[0.035] p-8 text-center shadow-2xl shadow-cyan-500/10 backdrop-blur">
          <div className="mx-auto mb-5 size-14 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-400" />
          <h1 className="text-xl font-semibold text-gray-950 dark:text-white/90">Loading course...</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-white/35">Preparing your lessons and course workspace.</p>
        </div>
      </section>
    );
  }

  if (courseStatus.isError && !hasLoadedCourse) {
    return (
      <section className="course-details-page flex min-h-[70vh] items-center justify-center overflow-hidden p-3 sm:p-4">
        <div className="relative z-10 w-full max-w-2xl rounded-[30px] border border-rose-300/20 bg-rose-500/[0.045] p-8 text-center shadow-2xl shadow-rose-500/10 backdrop-blur">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-rose-300/25 bg-rose-500/[0.08] text-rose-600 dark:text-rose-100/75">!</div>
          <h1 className="text-xl font-semibold text-gray-950 dark:text-white/90">Course could not be loaded</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-white/35">{courseStatus.message || "Please restart the backend and try again."}</p>
          <button type="button" onClick={handleRetryLoadCourse} className="mt-5 rounded-xl bg-rose-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-rose-500">
            Try again
          </button>
        </div>
      </section>
    );
  }

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
          <div
            className="
      relative overflow-hidden rounded-[26px]
      border border-gray-200/75
      bg-gray-50/60
      shadow-[0_18px_45px_rgba(15,23,42,0.065)]
      dark:border-white/[0.06]
      dark:bg-[#171a1f]
      dark:shadow-[0_22px_55px_rgba(0,0,0,0.22)]
    "
          >
            <div
              className="
        pointer-events-none absolute inset-x-12 top-0 h-px
        bg-gradient-to-r from-transparent
        via-cyan-400/50 to-transparent
        dark:via-cyan-300/16
      "
            />

            {/* Course information */}
            <div className="p-3">
              <div
                className="
          relative overflow-hidden rounded-[20px]
          border border-white/[0.10] p-4
          shadow-[0_14px_32px_rgba(0,0,0,0.20)]
        "
                style={{ background: subjectBackground }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/[0.04] via-black/20 to-black/70" />

                <div
                  className="
            pointer-events-none absolute -right-12 -top-12
            size-32 rounded-full bg-white/[0.09] blur-[35px]
          "
                />

                <div
                  className="
            pointer-events-none absolute inset-x-8 top-0 h-px
            bg-gradient-to-r from-transparent
            via-white/35 to-transparent
          "
                />

                <div className="relative z-10 flex items-center gap-3.5">
                  <div
                    className="
              size-14 shrink-0 overflow-hidden rounded-2xl
              border border-white/[0.16]
              bg-white/[0.08]
              shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_12px_28px_rgba(0,0,0,0.24)]
              backdrop-blur-xl
            "
                  >
                    {subject?.logo?.filePath || subject?.thumbnail?.filePath ? (
                      <img src={subject?.logo?.filePath || subject?.thumbnail?.filePath} alt={subject?.name || "Course logo"} className="h-full w-full object-cover" />
                    ) : (
                      <div
                        className="
                  flex h-full w-full items-center justify-center
                  text-xl font-black text-white/90
                "
                      >
                        {subject?.name?.charAt(0)?.toUpperCase() || "C"}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                text-[7px] font-bold uppercase
                tracking-[0.15em] text-white/45
              "
                    >
                      Course workspace
                    </p>

                    <h2
                      className="
                mt-1 line-clamp-2 text-sm font-black
                capitalize leading-5 tracking-[-0.02em]
                text-white/90
              "
                    >
                      {subject?.name || "Course"}
                    </h2>

                    <p className="mt-1.5 text-[9px] font-medium text-white/50">{learningProgress.totalLessons || lessonSequence.length || totalChapters} lessons</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course progress */}
            <div
              className="
        border-y border-gray-200/70
        bg-white/40 px-4 py-4
        dark:border-white/[0.05]
        dark:bg-white/[0.01]
      "
            >
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <HiOutlineBookOpen size={14} className="text-cyan-600 dark:text-cyan-200/60" />

                  <span
                    className="
              text-[9px] font-bold
              text-gray-600 dark:text-white/48
            "
                  >
                    Course progress
                  </span>
                </div>

                <span
                  className="
            rounded-lg border border-cyan-400/15
            bg-cyan-500/[0.055] px-2 py-1
            text-[8px] font-black tabular-nums
            text-cyan-700
            dark:border-cyan-300/[0.07]
            dark:bg-cyan-300/[0.03]
            dark:text-cyan-200/65
          "
                >
                  {completedLessonKeys.size}/{learningProgress.totalLessons || lessonSequence.length || 0}
                </span>
              </div>

              <div
                className="
          h-1.5 overflow-hidden rounded-full
          bg-gray-200/80
          dark:bg-white/[0.055]
        "
              >
                <div
                  className="
            h-full rounded-full
            bg-gradient-to-r
            from-cyan-500 via-blue-500 to-indigo-500
            shadow-[0_0_9px_rgba(6,182,212,0.24)]
            transition-[width] duration-500
          "
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Course navigator */}
            <div className="p-2.5">
              <div className="mb-2 flex items-center justify-between px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <HiOutlineListBullet size={14} className="text-gray-400 dark:text-white/28" />

                  <p
                    className="
              text-[8px] font-bold uppercase
              tracking-[0.14em]
              text-gray-400 dark:text-white/25
            "
                  >
                    Course navigator
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                {/* Overview */}
                <button
                  type="button"
                  onClick={() => setActiveView("overview")}
                  aria-current={activeView === "overview" ? "page" : undefined}
                  className={`
            group/chapter relative flex w-full items-center
            gap-3 overflow-hidden rounded-[16px]
            border px-3 py-3 text-left
            transition-all duration-300
            ${
              activeView === "overview"
                ? `
                  border-cyan-400/25
                  bg-cyan-500/[0.075]
                  shadow-[0_9px_22px_rgba(6,182,212,0.07)]
                  dark:border-cyan-300/[0.11]
                  dark:bg-cyan-300/[0.045]
                `
                : `
                  border-transparent
                  hover:border-gray-200/80
                  hover:bg-white/65
                  dark:hover:border-white/[0.05]
                  dark:hover:bg-white/[0.025]
                `
            }
          `}
                >
                  {activeView === "overview" && (
                    <span
                      className="
                absolute bottom-3 left-0 top-3
                w-[2px] rounded-r-full
                bg-cyan-500
                dark:bg-cyan-300/55
              "
                    />
                  )}

                  <span
                    className={`
              flex size-8 shrink-0 items-center justify-center
              rounded-xl border text-[11px] font-bold
              transition-all duration-300
              ${
                activeView === "overview"
                  ? `
                    border-cyan-400/25
                    bg-cyan-500/[0.11]
                    text-cyan-700
                    dark:border-cyan-300/[0.10]
                    dark:bg-cyan-300/[0.06]
                    dark:text-cyan-200/75
                  `
                  : `
                    border-gray-200/75
                    bg-white/65
                    text-gray-400
                    group-hover/chapter:border-gray-300
                    group-hover/chapter:text-gray-600
                    dark:border-white/[0.05]
                    dark:bg-white/[0.018]
                    dark:text-white/25
                    dark:group-hover/chapter:border-white/[0.08]
                    dark:group-hover/chapter:text-white/45
                  `
              }
            `}
                  >
                    <HiOutlineBookOpen />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`
                line-clamp-2 text-[10px] font-bold
                capitalize leading-4
                ${activeView === "overview" ? "text-gray-900 dark:text-white/85" : "text-gray-600 dark:text-white/45"}
              `}
                    >
                      Course overview
                    </span>

                    <span
                      className="
                mt-1 block text-[7px] font-medium
                uppercase tracking-[0.10em]
                text-gray-400 dark:text-white/20
              "
                    >
                      Introduction
                    </span>
                  </span>

                  {activeView === "overview" ? (
                    <IoCheckmarkCircle className="shrink-0 text-cyan-600 dark:text-cyan-200/70" />
                  ) : (
                    <BiSolidChevronRight
                      className="
                shrink-0 text-gray-300
                transition-all duration-300
                group-hover/chapter:translate-x-0.5
                group-hover/chapter:text-gray-500
                dark:text-white/10
                dark:group-hover/chapter:text-white/30
              "
                    />
                  )}
                </button>

                {/* Chapters label */}
                <div className="flex items-center gap-3 px-2 pb-1 pt-3.5">
                  <p
                    className="
              shrink-0 text-[7px] font-bold uppercase
              tracking-[0.14em]
              text-gray-400 dark:text-white/20
            "
                  >
                    Chapters
                  </p>

                  <div
                    className="
              h-px flex-1
              bg-gradient-to-r
              from-gray-200/80 to-transparent
              dark:from-white/[0.05]
            "
                  />
                </div>

                {/* Chapter list */}
                {chapters.length > 0 ? (
                  chapters.map((chapter, index) => {
                    const isActive = activeView === "chapter" && currentIndex === index;

                    const subheadings = Array.isArray(chapter?.subheadings) ? chapter.subheadings : [];

                    const hasSubheadings = subheadings.length > 0;

                    const isExpanded = hasSubheadings && expandedChapterIndex === index;

                    const isChapterLessonCompleted = !hasSubheadings && completedLessonKeys.has(getProgressLessonKey("chapter", chapter?._id));

                    return (
                      <div key={chapter?._id || index} className="relative">
                        <button
                          type="button"
                          onClick={() => handleChapterClick(index)}
                          aria-current={isActive && !activeSubheadingSlug ? "page" : undefined}
                          className={`
                    group/chapter relative flex w-full items-center
                    gap-3 overflow-hidden rounded-[16px]
                    border px-3 py-3 text-left
                    transition-all duration-300
                    ${
                      isActive
                        ? `
                          border-cyan-400/25
                          bg-cyan-500/[0.075]
                          shadow-[0_9px_22px_rgba(6,182,212,0.07)]
                          dark:border-cyan-300/[0.11]
                          dark:bg-cyan-300/[0.045]
                        `
                        : `
                          border-transparent
                          hover:border-gray-200/80
                          hover:bg-white/65
                          dark:hover:border-white/[0.05]
                          dark:hover:bg-white/[0.025]
                        `
                    }
                  `}
                        >
                          {isActive && (
                            <span
                              className="
                        absolute bottom-3 left-0 top-3
                        w-[2px] rounded-r-full
                        bg-cyan-500
                        dark:bg-cyan-300/55
                      "
                            />
                          )}

                          <span
                            className={`
                      flex size-8 shrink-0 items-center justify-center
                      rounded-xl border
                      text-[9px] font-bold tabular-nums
                      transition-all duration-300
                      ${
                        isActive
                          ? `
                            border-cyan-400/25
                            bg-cyan-500/[0.11]
                            text-cyan-700
                            dark:border-cyan-300/[0.10]
                            dark:bg-cyan-300/[0.06]
                            dark:text-cyan-200/75
                          `
                          : `
                            border-gray-200/75
                            bg-white/65
                            text-gray-400
                            group-hover/chapter:border-gray-300
                            group-hover/chapter:text-gray-600
                            dark:border-white/[0.05]
                            dark:bg-white/[0.018]
                            dark:text-white/25
                            dark:group-hover/chapter:border-white/[0.08]
                            dark:group-hover/chapter:text-white/45
                          `
                      }
                    `}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span
                              className={`
                        line-clamp-2 text-[10px]
                        font-semibold leading-4
                        ${isActive ? "text-gray-900 dark:text-white/85" : "text-gray-600 dark:text-white/45"}
                      `}
                            >
                              {chapter?.title || chapter?.metaTitle || `Chapter ${index + 1}`}
                            </span>

                            <span
                              className="
                        mt-1 block text-[7px] font-medium
                        uppercase tracking-[0.09em]
                        text-gray-400 dark:text-white/20
                      "
                            >
                              Chapter {index + 1}
                            </span>
                          </span>

                          {isChapterLessonCompleted ? (
                            <IoCheckmarkCircle className="shrink-0 text-emerald-600 dark:text-emerald-200/70" />
                          ) : hasSubheadings ? (
                            <span
                              className={`
                        flex size-6 shrink-0 items-center justify-center
                        rounded-lg border
                        transition-all duration-300
                        ${
                          isExpanded
                            ? `
                              border-cyan-400/20
                              bg-cyan-500/[0.08]
                              text-cyan-600
                              dark:border-cyan-300/[0.08]
                              dark:bg-cyan-300/[0.04]
                              dark:text-cyan-200/65
                            `
                            : `
                              border-gray-200/70
                              bg-white/60 text-gray-400
                              group-hover/chapter:border-gray-300
                              group-hover/chapter:text-gray-600
                              dark:border-white/[0.05]
                              dark:bg-white/[0.018]
                              dark:text-white/25
                              dark:group-hover/chapter:border-white/[0.08]
                              dark:group-hover/chapter:text-white/40
                            `
                        }
                      `}
                            >
                              <BiSolidChevronRight
                                size={12}
                                className={`
                          transition-transform duration-300
                          ${isExpanded ? "rotate-90" : ""}
                        `}
                              />
                            </span>
                          ) : isActive ? (
                            <IoCheckmarkCircle className="shrink-0 text-cyan-600 dark:text-cyan-200/70" />
                          ) : (
                            <BiSolidChevronRight
                              className="
                        shrink-0 text-gray-300
                        transition-all duration-300
                        group-hover/chapter:translate-x-0.5
                        group-hover/chapter:text-gray-500
                        dark:text-white/10
                        dark:group-hover/chapter:text-white/30
                      "
                            />
                          )}
                        </button>

                        {/* Expanded dropdown */}
                        {isExpanded && (
                          <div
                            className="
                      relative mt-1.5 overflow-hidden
                      rounded-[15px]
                      border border-gray-200/75
                      bg-white/55 p-1.5
                      shadow-[0_8px_20px_rgba(15,23,42,0.035)]
                      dark:border-white/[0.05]
                      dark:bg-white/[0.014]
                      dark:shadow-[0_10px_22px_rgba(0,0,0,0.12)]

                      [&_button]:w-full
                      [&_button]:rounded-xl
                      [&_button]:border-transparent
                      [&_button]:px-3
                      [&_button]:py-2.5
                      [&_button]:transition-all
                      [&_button]:duration-200

                      [&_button:hover]:bg-gray-100/80
                      dark:[&_button:hover]:bg-white/[0.03]
                    "
                          >
                            {renderSubheadingNavigator(subheadings, index)}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div
                    className="
              flex min-h-32 flex-col items-center justify-center
              rounded-2xl border border-dashed
              border-gray-300/80
              bg-white/40 px-4 text-center
              dark:border-white/[0.07]
              dark:bg-white/[0.012]
            "
                  >
                    <HiOutlineBookOpen size={23} className="text-gray-400 dark:text-white/25" />

                    <p
                      className="
                mt-3 text-[10px] font-semibold
                text-gray-600 dark:text-white/45
              "
                    >
                      No chapters available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          {activeView === "overview" && (
            <section className="    ">
              {/* Header area */}
              <div
                className="
    relative overflow-hidden rounded-[23px]
    border border-gray-200/75
    bg-gray-50/55
    px-5 py-5
    text-gray-700
    shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]
    dark:border-white/[0.05]
    dark:bg-white/[0.015]
    dark:text-white/65
    dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.015)]
    sm:px-6 sm:py-6
  "
              >
                <div
                  className="
          pointer-events-none absolute -left-16 -top-20 size-52
          rounded-full bg-cyan-400/[0.07] blur-[75px]
          dark:bg-cyan-300/[0.025]
        "
                />

                <div
                  className="
      relative flex flex-col gap-5
      xl:flex-row xl:items-start xl:justify-between
    "
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="
            inline-flex items-center gap-2 rounded-full
            border border-cyan-400/20
            bg-cyan-500/[0.07]
            px-3 py-1.5
            text-[8px] font-semibold uppercase tracking-[0.14em]
            text-cyan-700
            shadow-[inset_0_1px_0_rgba(255,255,255,0.60)]
            dark:border-cyan-300/[0.08]
            dark:bg-cyan-300/[0.035]
            dark:text-cyan-200/65
            dark:shadow-none
          "
                      >
                        <span
                          className="
              size-1.5 rounded-full
              bg-cyan-500
              shadow-[0_0_8px_rgba(6,182,212,0.70)]
              dark:bg-cyan-300/70
            "
                        />
                        Course Overview
                      </span>

                      <span
                        className="
            text-[8px] font-bold uppercase tracking-[0.13em]
            text-gray-400 dark:text-white/20
          "
                      >
                        Introduction
                      </span>
                    </div>

                    <h1
                      className="
          mt-4 max-w-5xl
          text-2xl font-semibold  capitalize leading-[1.1]
          tracking-[-0.045em]
          text-gray-950 dark:text-white
          sm:text-[32px]
        "
                    >
                      {subject?.name || "Course overview"}
                    </h1>
                  </div>

                  {/* Course actions */}
                  <div
                    className="
        flex flex-wrap items-center gap-2
        xl:max-w-[52%] xl:justify-end
      "
                  >
                    <span
                      className="
          inline-flex h-9 items-center
          rounded-xl border border-indigo-400/20
          bg-indigo-500/[0.065]
          px-3.5 text-[8px] font-semibold
          text-indigo-700
          shadow-[inset_0_1px_0_rgba(255,255,255,0.50)]
          dark:border-indigo-300/[0.08]
          dark:bg-indigo-300/[0.035]
          dark:text-indigo-200/65
          dark:shadow-none
        "
                    >
                      {totalChapters} {totalChapters === 1 ? "Chapter" : "Chapters"}
                    </span>

                    {isPaidCourse && !canAccessCourse && (
                      <button
                        type="button"
                        onClick={needsLoginForPaidCourse ? () => navigate("/login") : handleAddToCart}
                        className="
            inline-flex h-9 items-center gap-2
            rounded-xl border border-amber-400/20
            bg-gradient-to-b from-amber-500 to-amber-600
            px-3.5
            text-[8px] font-semibold text-white
            shadow-[inset_0_1px_0_rgba(255,255,255,0.30),0_9px_22px_rgba(217,119,6,0.18)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:from-amber-400 hover:to-amber-500
            hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_13px_28px_rgba(217,119,6,0.25)]
            active:translate-y-0 active:scale-[0.98]
            dark:border-amber-200/[0.10]
          "
                      >
                        {needsLoginForPaidCourse ? <FaLock size={10} /> : <FaShoppingCart size={11} />}

                        {needsLoginForPaidCourse ? "Login to buy" : `Add cart Rs. ${coursePrice}`}
                      </button>
                    )}

                    {isPaidCourse && canAccessCourse && (
                      <>
                        <span
                          className="
              inline-flex h-9 items-center gap-2
              rounded-xl border border-emerald-400/20
              bg-emerald-500/[0.075]
              px-3.5
              text-[8px] font-semibold text-emerald-700
              shadow-[inset_0_1px_0_rgba(255,255,255,0.50)]
              dark:border-emerald-300/[0.08]
              dark:bg-emerald-300/[0.035]
              dark:text-emerald-100/70
              dark:shadow-none
            "
                        >
                          <IoCheckmarkCircle size={12} />
                          You own this
                        </span>

                        <a
                          href={secureCourseDownloadUrl}
                          className="
              inline-flex h-9 items-center gap-2
              rounded-xl border border-cyan-400/20
              bg-cyan-500/[0.07]
              px-3.5
              text-[8px] font-semibold text-cyan-700
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-cyan-400/30
              hover:bg-cyan-500/[0.11]
              dark:border-cyan-300/[0.08]
              dark:bg-cyan-300/[0.035]
              dark:text-cyan-100/70
              dark:hover:border-cyan-300/[0.13]
              dark:hover:bg-cyan-300/[0.055]
            "
                        >
                          Secure resources
                        </a>

                        {Number(learningProgress.percent || 0) >= 100 && (
                          <a
                            href={certificateDownloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="
                inline-flex h-9 items-center gap-2
                rounded-xl border border-amber-400/25
                bg-amber-500/[0.09]
                px-3.5
                text-[8px] font-semibold text-amber-700
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-amber-400/35
                hover:bg-amber-500/[0.13]
                dark:border-amber-300/[0.12]
                dark:bg-amber-300/[0.045]
                dark:text-amber-100/78
                dark:hover:border-amber-300/[0.18]
                dark:hover:bg-amber-300/[0.07]
              "
                          >
                            <FaAward size={12} />
                            Download certificate
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Engagement statistics */}
                <div
                  className="
      relative mt-6 flex flex-wrap items-center gap-2
      border-t border-gray-200/70 pt-4
      dark:border-white/[0.05]
    "
                >
                  <span
                    className="
        inline-flex h-10 items-center gap-2.5
        rounded-[13px] border border-blue-400/20
        bg-blue-500/[0.06]
        px-3.5 text-[9px] font-bold text-blue-700
        shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]
        dark:border-blue-300/[0.08]
        dark:bg-blue-300/[0.03]
        dark:text-blue-200/65
        dark:shadow-none
      "
                  >
                    <IoEye size={14} />
                    {viewCount} total views
                  </span>

                  <button
                    type="button"
                    onClick={handleToggleLike}
                    className={`
        inline-flex h-10 items-center gap-2.5
        rounded-[13px] border px-3.5
        text-[9px] font-bold
        shadow-[inset_0_1px_0_rgba(255,255,255,0.50)]
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_9px_20px_rgba(244,63,94,0.10)]
        active:translate-y-0 active:scale-[0.98]
        dark:shadow-none
        ${
          isActiveLiked
            ? `
              border-rose-400/30 bg-rose-500/[0.11]
              text-rose-700
              dark:border-rose-300/[0.13]
              dark:bg-rose-300/[0.06]
              dark:text-rose-200/80
            `
            : `
              border-rose-400/20 bg-rose-500/[0.06]
              text-rose-700
              dark:border-rose-300/[0.08]
              dark:bg-rose-300/[0.03]
              dark:text-rose-200/65
            `
        }
      `}
                  >
                    <AiFillLike size={14} />
                    {likeCount} total likes
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleBookmark}
                    className={`
        inline-flex h-10 items-center gap-2.5
        rounded-[13px] border px-3.5
        text-[9px] font-bold
        shadow-[inset_0_1px_0_rgba(255,255,255,0.50)]
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_9px_20px_rgba(139,92,246,0.10)]
        active:translate-y-0 active:scale-[0.98]
        dark:shadow-none
        ${
          isActiveBookmarked
            ? `
              border-violet-400/30 bg-violet-500/[0.11]
              text-violet-700
              dark:border-violet-300/[0.13]
              dark:bg-violet-300/[0.06]
              dark:text-violet-200/80
            `
            : `
              border-violet-400/20 bg-violet-500/[0.06]
              text-violet-700
              dark:border-violet-300/[0.08]
              dark:bg-violet-300/[0.03]
              dark:text-violet-200/65
            `
        }
      `}
                  >
                    <FaBookmark size={12} />
                    {bookmarkCount} bookmarks
                  </button>
                </div>
              </div>

              {/* Course description */}
              <div
                className="
    relative mt-2.5 overflow-hidden rounded-[23px]
    border border-gray-200/75
    bg-gray-50/55
    px-5 py-5
    text-gray-700
    shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]
    dark:border-white/[0.05]
    dark:bg-white/[0.015]
    dark:text-white/65
    dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.015)]
    sm:px-6 sm:py-6
  "
              >
                <div
                  className="
      pointer-events-none absolute bottom-5 left-0 top-5
      w-[2px] rounded-r-full
    "
                />

                <div className="relative">
                  <RichTextRenderer content={subject?.description || subject?.metaDescription || "No course overview available."} />
                </div>
              </div>
            </section>
          )}

          {activeView === "overview" && isPaidCourse && !canAccessCourse && (
            <section
              className="
      relative mt-4 overflow-hidden rounded-[26px]
      border border-gray-200/80
      bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.08),transparent_42%),linear-gradient(180deg,rgba(255,255,255,1),rgba(249,250,251,0.96))]
      px-6 py-8 text-center
      shadow-[0_22px_65px_rgba(15,23,42,0.08)]
      before:pointer-events-none before:absolute before:inset-x-16 before:top-0
      before:h-px before:bg-gradient-to-r before:from-transparent
      before:via-amber-400/70 before:to-transparent
      after:pointer-events-none after:absolute after:left-1/2 after:top-0
      after:h-20 after:w-52 after:-translate-x-1/2
      after:bg-amber-400/[0.06] after:blur-[45px]
      dark:border-white/[0.065]
      dark:bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.055),transparent_38%),linear-gradient(180deg,#171a1f_0%,#15181d_100%)]
      dark:shadow-[0_28px_80px_rgba(0,0,0,0.26)]
      dark:before:via-amber-300/30
      dark:after:bg-amber-300/[0.035]
      sm:px-10 sm:py-9
    "
            >
              <div
                className="
        relative z-10 mx-auto flex size-[58px] items-center justify-center
        rounded-[18px] border border-amber-400/25
        bg-gradient-to-br from-amber-300/20 via-amber-400/10 to-orange-500/[0.06]
        text-amber-700
        shadow-[inset_0_1px_0_rgba(255,255,255,0.60),0_12px_30px_rgba(245,158,11,0.13)]
        dark:border-amber-300/[0.11]
        dark:from-amber-300/[0.10]
        dark:via-amber-300/[0.045]
        dark:to-orange-400/[0.025]
        dark:text-amber-200/75
        dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_14px_32px_rgba(0,0,0,0.20)]
      "
              >
                {needsLoginForPaidCourse ? <FaLock size={19} /> : <FaShoppingCart size={19} />}
              </div>

              <h2
                className="
        relative z-10 mt-5
        text-xl font-semibold tracking-[-0.035em]
        text-gray-950 dark:text-white/90
        sm:text-[22px]
      "
              >
                {needsLoginForPaidCourse ? "Login required for this paid course" : "This is a pro course"}
              </h2>

              <p
                className="
        relative z-10 mx-auto mt-2.5 max-w-[540px]
        text-[11px] font-medium leading-[1.8]
        text-gray-500 dark:text-white/35
      "
              >
                {needsLoginForPaidCourse
                  ? "You can read the overview now. Login first, then purchase this course to unlock every chapter and subheading."
                  : "You can read the overview now. Buy the course to unlock every chapter, subheading, progress tracking, and certificate."}
              </p>

              <button
                type="button"
                onClick={needsLoginForPaidCourse ? () => navigate("/login") : handleAddToCart}
                className="
        relative z-10 mt-6 min-w-[148px]
        overflow-hidden rounded-xl
        border border-amber-300/20
        bg-gradient-to-b from-amber-500 to-amber-600
        px-6 py-3.5
        text-[10px] font-semibold tracking-[-0.01em] text-white
        shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_12px_26px_rgba(217,119,6,0.22)]
        transition-all duration-300
        before:pointer-events-none before:absolute before:inset-x-4 before:top-0
        before:h-px before:bg-gradient-to-r before:from-transparent
        before:via-white/70 before:to-transparent
        hover:-translate-y-0.5
        hover:from-amber-400 hover:to-amber-500
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_16px_34px_rgba(217,119,6,0.30)]
        active:translate-y-0 active:scale-[0.98]
        focus:outline-none focus:ring-2
        focus:ring-amber-500/35 focus:ring-offset-2
        dark:border-amber-200/[0.12]
        dark:focus:ring-offset-[#15181d]
      "
              >
                {needsLoginForPaidCourse ? "Login to buy" : `Add to cart Rs. ${coursePrice}`}
              </button>
            </section>
          )}
          {activeView === "chapter" && currentChapter && !canAccessCourse && (
            <section
              className={`flex min-h-[520px] flex-col items-center justify-center rounded-[26px] border px-6 text-center shadow-[0_16px_38px_rgba(15,23,42,0.05)] ${
                isPaidCourse
                  ? "border-amber-300/25 bg-amber-500/[0.045] dark:border-amber-300/[0.10] dark:bg-amber-300/[0.025]"
                  : "border-gray-200/70 bg-gray-50/50 dark:border-white/[0.055] dark:bg-white/[0.018]"
              }`}
            >
              <div
                className={`flex size-16 items-center justify-center rounded-2xl border text-2xl ${
                  isPaidCourse
                    ? "border-amber-300/25 bg-amber-500/[0.08] text-amber-700 dark:border-amber-300/[0.10] dark:text-amber-100/75"
                    : "border-amber-300/20 bg-amber-500/[0.08] text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70"
                }`}
              >
                {needsPurchaseForPaidCourse ? <FaShoppingCart size={22} /> : <FaLock />}
              </div>

              <p className="mt-5 text-[8px] font-semibold uppercase tracking-[0.14em] text-amber-600 dark:text-amber-200/55">{needsPurchaseForPaidCourse ? "Purchase required" : "Login required"}</p>

              <h2 className="mt-2 max-w-xl text-2xl font-semibold capitalize leading-[1.12] tracking-[-0.035em] text-gray-950 dark:text-white/90 sm:text-3xl">
                {needsPurchaseForPaidCourse ? "Purchase To Unlock This Course" : "Login To View This Chapter"}
              </h2>

              <p className="mt-3 max-w-md text-[11px] leading-6 text-gray-500 dark:text-white/35">
                {needsPurchaseForPaidCourse
                  ? "The course overview is available to everyone. Buy this course to unlock chapters, subheadings, progress tracking, and certificate access."
                  : isPaidCourse
                    ? "The course overview is available to everyone. Please login first, then purchase this course to unlock chapters and subheadings."
                    : "The course overview is available to everyone. Please login to open chapters, continue lessons, and save your progress."}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {needsPurchaseForPaidCourse ? (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-300/25 bg-amber-500/[0.10] px-4 text-[10px] font-semibold text-amber-700 transition-all hover:-translate-y-0.5 hover:bg-amber-500/[0.14] dark:border-amber-300/[0.09] dark:bg-amber-300/[0.05] dark:text-amber-200/75 dark:hover:bg-amber-300/[0.08]"
                  >
                    <FaShoppingCart size={11} />
                    Add to cart Rs. {coursePrice}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-300/25 bg-amber-500/[0.10] px-4 text-[10px] font-semibold text-amber-700 transition-all hover:-translate-y-0.5 hover:bg-amber-500/[0.14] dark:border-amber-300/[0.09] dark:bg-amber-300/[0.05] dark:text-amber-200/75 dark:hover:bg-amber-300/[0.08]"
                  >
                    <FaLock size={11} />
                    Login to view
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveView("overview")}
                  className="inline-flex h-10 items-center rounded-xl border border-gray-200/80 bg-white/65 px-4 text-[10px] font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-cyan-300/35 hover:text-cyan-700 dark:border-white/[0.06] dark:bg-white/[0.022] dark:text-white/45 dark:hover:border-cyan-300/[0.12] dark:hover:text-cyan-200/70"
                >
                  Back to overview
                </button>
              </div>
            </section>
          )}

          {activeView === "chapter" &&
            canAccessCourse &&
            (currentChapter ? (
              <div className="space-y-3">
                <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/50 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-6">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
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

                      <h1 className="mt-3 max-w-5xl text-2xl font-semibold capitalize leading-[1.12] tracking-[-0.035em] text-gray-950 dark:text-white/90 sm:text-3xl">
                        {activeLesson?.metaTitle || activeLesson?.title || `Chapter ${currentIndex + 1}`}
                      </h1>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleChapterComplete}
                        className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-[9px] font-semibold transition-all hover:-translate-y-0.5 ${
                          isCurrentLessonCompleted
                            ? "border-emerald-300/30 bg-emerald-500/[0.10] text-emerald-700 dark:border-emerald-300/[0.10] dark:text-emerald-200/75"
                            : "border-gray-200/80 bg-white/65 text-gray-600 hover:border-emerald-300/35 hover:text-emerald-700 dark:border-white/[0.06] dark:bg-white/[0.022] dark:text-white/45 dark:hover:text-emerald-200/70"
                        }`}
                      >
                        <IoCheckmarkCircle size={14} />
                        {isCurrentLessonCompleted ? "Read" : "Mark as read"}
                      </button>

                      <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={activeSequenceIndex <= 0}
                        aria-label="Previous lesson"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200/80 bg-white/65 px-3.5 text-[9px] font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-cyan-300/35 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 dark:border-white/[0.06] dark:bg-white/[0.022] dark:text-white/45 dark:hover:border-cyan-300/[0.12] dark:hover:text-cyan-200/70"
                      >
                        <HiOutlineArrowLeft size={14} />
                        Previous
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={activeSequenceIndex < 0 || activeSequenceIndex >= lessonSequence.length - 1}
                        aria-label="Next lesson"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-500/[0.07] px-3.5 text-[9px] font-semibold text-cyan-700 transition-all hover:-translate-y-0.5 hover:bg-cyan-500/[0.11] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70 dark:hover:bg-cyan-300/[0.07]"
                      >
                        Next
                        <HiOutlineArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                        {learningProgress.percent || 0}% complete
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

                      <button
                        type="button"
                        onClick={handleToggleLike}
                        className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-[9px] font-medium transition-all hover:-translate-y-0.5 ${
                          isActiveLiked
                            ? "border-rose-300/30 bg-rose-500/[0.10] text-rose-700 dark:border-rose-300/[0.10] dark:text-rose-200/75"
                            : "border-gray-200/75 bg-white/55 text-gray-500 hover:border-rose-300/35 hover:text-rose-700 dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/35 dark:hover:text-rose-200/70"
                        }`}
                      >
                        <AiFillLike size={14} />
                        <span className="tabular-nums">{likeCount}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleBookmark}
                        className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-[9px] font-medium transition-all hover:-translate-y-0.5 ${
                          isActiveBookmarked
                            ? "border-violet-300/30 bg-violet-500/[0.10] text-violet-700 dark:border-violet-300/[0.10] dark:text-violet-200/75"
                            : "border-gray-200/75 bg-white/55 text-gray-500 hover:border-violet-300/35 hover:text-violet-700 dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/35 dark:hover:text-violet-200/70"
                        }`}
                      >
                        <FaBookmark size={12} />
                        <span className="tabular-nums">{bookmarkCount}</span>
                      </button>
                    </div>
                  </div>
                </section>

                <section className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-50/45 shadow-[0_16px_38px_rgba(15,23,42,0.045)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:shadow-[0_18px_42px_rgba(0,0,0,0.16)]">
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

          {commentResourceId && (activeView !== "chapter" || canAccessCourse) && (
            <section className="mt-3">
              <Comments resourceId={commentResourceId} resourceType={commentResourceType} enableRating={commentResourceType === "Courses"} />
            </section>
          )}

          {subject?._id && (
            <section className="mt-3">
              <ProductQuestions productType="course" productId={subject._id} isLoggedIn={isLoggedIn} />
            </section>
          )}

          {subject?._id && (
            <section className="mt-3">
              <ProductReviews productType="course" productId={subject._id} canReview={canAccessCourse && isLoggedIn} />
            </section>
          )}
        </main>
      </div>
    </section>
  );
};
