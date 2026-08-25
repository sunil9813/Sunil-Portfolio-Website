import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router";
import { useDispatch } from "react-redux";
import { HandbookCard } from "./card/CourseCard";
import { BsArrowRight } from "react-icons/bs";
import { FaBookmark, FaCommentDots, FaEye, FaFileAlt, FaHeart, FaRegBookmark, FaShoppingCart, FaThumbsUp } from "react-icons/fa";
import { getRandomGradient, truncateText } from "@/utils";
import { TertiaryButton } from "@/components/customeUI/Button";
import { addCartItem } from "@/utils/cart";
import { toast } from "react-toastify";
import { REACT_APP_BACKEND_URL } from "@/utils/api";
import { getUserFavorite } from "@/redux/slices/common/favoriteSlice";
import { CourseHero } from "./CourseHero";

const COURSE_GRADIENT_SEQUENCE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 2, 3, 4, 8, 2, 3, 0];

const getCourseGradientIndex = (index = 0) => {
  let selectedIndex = COURSE_GRADIENT_SEQUENCE[0];

  for (let currentIndex = 1; currentIndex <= index; currentIndex += 1) {
    const nextIndex = COURSE_GRADIENT_SEQUENCE[currentIndex % COURSE_GRADIENT_SEQUENCE.length];

    selectedIndex = nextIndex === selectedIndex ? (nextIndex + 1) % 9 : nextIndex;
  }

  return selectedIndex;
};

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getCount = (value) => {
  if (Array.isArray(value)) return value.length;

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const formatCount = (value) => {
  const count = getCount(value);

  if (count >= 1000000) return `${(count / 1000000).toFixed(count >= 10000000 ? 0 : 1)}m`;
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;

  return count;
};

const getSortedCourseItems = (items = []) => {
  return [...items].sort((firstItem, secondItem) => Number(firstItem?.order || 0) - Number(secondItem?.order || 0));
};

const getCourseTopicPreviewItems = (course) => {
  const chapters = getSortedCourseItems(Array.isArray(course?.chapters) ? course.chapters : []);
  const topics = [];

  chapters.forEach((chapter, chapterIndex) => {
    const subheadings = getSortedCourseItems(Array.isArray(chapter?.subheadings) ? chapter.subheadings : []);

    subheadings.forEach((subheading, subheadingIndex) => {
      topics.push({
        id: subheading?._id || `${chapter?._id || chapterIndex}-${subheading?.slug || subheadingIndex}`,
        title: subheading?.title || subheading?.metaTitle || `Topic ${subheadingIndex + 1}`,
        description: subheading?.metaDescription || stripHtml(subheading?.description) || chapter?.metaDescription,
        parentTitle: chapter?.title,
        level: "Topic",
      });

      const children = getSortedCourseItems(Array.isArray(subheading?.children) ? subheading.children : []);

      children.forEach((childSubheading, childIndex) => {
        topics.push({
          id: childSubheading?._id || `${chapter?._id || chapterIndex}-${subheading?._id || subheadingIndex}-${childSubheading?.slug || childIndex}`,
          title: childSubheading?.title || childSubheading?.metaTitle || `Lesson ${childIndex + 1}`,
          description: childSubheading?.metaDescription || stripHtml(childSubheading?.description) || subheading?.metaDescription,
          parentTitle: subheading?.title,
          level: "Lesson",
        });
      });
    });
  });

  if (topics.length > 0) {
    return topics;
  }

  return chapters.map((chapter, chapterIndex) => ({
    id: chapter?._id || chapter?.slug || chapterIndex,
    title: chapter?.title || chapter?.metaTitle || `Chapter ${chapterIndex + 1}`,
    description: chapter?.metaDescription || stripHtml(chapter?.description),
    parentTitle: course?.name,
    level: "Chapter",
  }));
};

export const CourseList = () => {
  const [courseItems, setCourseItems] = useState([]);

  const loadCourses = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/subject/courses`);

      const data = Array.isArray(response.data?.data) ? response.data.data : [];

      setCourseItems(data);
    } catch (error) {
      setCourseItems([]);

      toast.error(error.response?.data?.message || error.response?.data?.error || "Courses could not be loaded.");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <>
      <CourseHero courseCount={courseItems.length} />

      <section id="courses" className="course-list relative min-h-screen overflow-hidden bg-[#0B1117] pb-24 pt-12">
        <div className="pointer-events-none absolute inset-0 -z-30 bg-[linear-gradient(180deg,#0B1117_0%,#101820_60%,#0C1319_100%)]"></div>

        <div className="pointer-events-none absolute -left-[220px] top-[150px] -z-20 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(168,255,92,0.04)_0%,transparent_72%)] blur-[150px]"></div>

        <div className="pointer-events-none absolute -right-[260px] top-[700px] -z-20 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.04)_0%,transparent_72%)] blur-[170px]"></div>

        <div className="container relative z-20">
          {courseItems.length === 0 && <CourseListEmpty title="No courses found" description="There are no courses available right now." />}

          <div className="space-y-10 sm:space-y-12">
            {courseItems.map((course, index) => (
              <CourseCardList course={course} index={index} key={course?._id || course?.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const CourseListEmpty = ({ title, description, actionText, onAction }) => {
  return (
    <div className="mx-auto mb-20 max-w-2xl py-10 text-center">
      <h3 className="text-2xl font-semibold text-white">{title}</h3>

      <p className="textColor mx-auto mt-2 max-w-lg text-sm">{description}</p>

      {actionText && (
        <TertiaryButton onClick={onAction} className="mx-auto mt-6">
          {actionText}
        </TertiaryButton>
      )}
    </div>
  );
};

export const CourseCardList = ({ course, index = 0 }) => {
  const isPaid = course?.accessType === "paid" || course?.accessType === "pro";
  const chapters = Array.isArray(course?.chapters) ? course.chapters : [];
  const previewItems = getCourseTopicPreviewItems(course);
  const gradientIndex = getCourseGradientIndex(index);

  const handleAddToCart = () => {
    addCartItem(course, "Course");

    toast.success(`${course?.name || "Course"} added to cart.`);
  };

  return (
    <div className="course-list_content relative z-50 mb-10 flex items-start">
      <div className="absolute left-1/3 top-20 h-full">
        <img src="https://framerusercontent.com/images/eVPQSYBoVqwchmpN78sjyYtovY.svg" alt="" className="flexC" />
      </div>

      <div className="left mr-2 w-[240px] shrink-0">
        <HandbookCard
          total={previewItems.length || chapters.length}
          logo={course?.thumbnail}
          title={course?.name}
          desc={course?.metaDescription}
          accessType={course?.accessType}
          price={course?.price}
          gradientIndex={gradientIndex}
          to={`/course/${course?.slug}`}
          free="98"
          show={true}
        />
      </div>

      <CourseChpaterLists course={course} gradientIndex={gradientIndex} previewItems={previewItems} isPaid={isPaid} onAddToCart={handleAddToCart} />
    </div>
  );
};

export const CourseChpaterLists = ({ course, gradientIndex = 0, previewItems = [], isPaid = false, onAddToCart }) => {
  const chapters = Array.isArray(course?.chapters) ? course.chapters : [];
  const lessons = previewItems.length > 0 ? previewItems : getCourseTopicPreviewItems(course);

  return (
    <div className="right ml-8 min-w-0 flex-1 self-start">
      <div className="course-list_content_list min-h-0 w-full">
        <ContentCardBg gradientIndex={gradientIndex + 1} />

        <div className="relative z-10 p-5 pb-3 sm:p-6 sm:pb-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <span className="block text-sm">{lessons.length} TUTORIALS</span>

              <p className="textColor mt-1 text-[10px]">Topics from course chapters</p>
            </div>

            <span className="hidden rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45 sm:inline-flex">
              {chapters.length} chapters
            </span>
          </div>

          <div className="items grid max-h-[23rem] auto-rows-[5.75rem] grid-cols-1 gap-2 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3">
            {lessons.length > 0 ? (
              lessons.map((lesson, index) => <ContentChapter lesson={lesson} key={lesson?.id || index} count={index + 1} slug={course?.slug} />)
            ) : (
              <div className="col-span-3 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg text-white">
                  <BsArrowRight />
                </span>

                <h4 className="mb-2 text-lg font-semibold text-white">Lessons are being prepared</h4>

                <p className="textColor max-w-md text-sm">This course is available, but chapters have not been published yet. You can still open the course overview.</p>
              </div>
            )}
          </div>

          <CourseListFooter course={course} isPaid={isPaid} onAddToCart={onAddToCart} />
        </div>
      </div>

      <NavLink to={`/course/${course?.slug}`} className="inline-flex">
        <TertiaryButton className="flexC mt-2 gap-2">
          <span>Read More</span>

          <BsArrowRight size={15} />
        </TertiaryButton>
      </NavLink>
    </div>
  );
};

const CourseListFooter = ({ course, isPaid = false, onAddToCart }) => {
  const dispatch = useDispatch();

  const [stats, setStats] = useState({
    likes: getCount(course?.likesCount ?? course?.likes),
    bookmarks: getCount(course?.bookmarksCount ?? course?.bookmarks),
    liked: false,
    bookmarked: false,
  });

  const totalReads = getCount(course?.numOfViews ?? course?.views ?? course?.totalRead);
  const commentsCount = getCount(course?.commentsCount ?? course?.commentCount ?? course?.comments);
  const courseType = isPaid ? "PREMIUM/COURSE" : "FREE/COURSE";

  useEffect(() => {
    setStats((currentStats) => ({
      ...currentStats,
      likes: getCount(course?.likesCount ?? course?.likes),
      bookmarks: getCount(course?.bookmarksCount ?? course?.bookmarks),
    }));
  }, [course?.likes, course?.likesCount, course?.bookmarks, course?.bookmarksCount]);

  const handleToggleLike = async () => {
    if (!course?._id) return;

    const nextLiked = !stats.liked;
    const previousStats = stats;

    setStats({
      ...stats,
      liked: nextLiked,
      likes: Math.max(0, stats.likes + (nextLiked ? 1 : -1)),
    });

    try {
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/like/course/${course._id}`, {}, { withCredentials: true });

      setStats((currentStats) => ({
        ...currentStats,
        liked: response.data?.status === "added",
        likes: getCount(response.data?.likesCount ?? currentStats.likes),
      }));
    } catch (error) {
      setStats(previousStats);

      toast.info(error.response?.data?.error || "Please login to like this course.");
    }
  };

  const handleToggleBookmark = async () => {
    if (!course?._id) return;

    const nextBookmarked = !stats.bookmarked;
    const previousStats = stats;

    setStats({
      ...stats,
      bookmarked: nextBookmarked,
      bookmarks: Math.max(0, stats.bookmarks + (nextBookmarked ? 1 : -1)),
    });

    try {
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/favorite/`, { resourceType: "Courses", resourceId: course._id }, { withCredentials: true });

      setStats((currentStats) => ({
        ...currentStats,
        bookmarked: response.data?.status === "added",
      }));

      dispatch(getUserFavorite());
    } catch (error) {
      setStats(previousStats);

      toast.info(error.response?.data?.error || "Please login to bookmark this course.");
    }
  };

  return (
    <div className="course-list_footer mt-3 flex flex-wrap items-center justify-between gap-2 lg:flex-nowrap">
      <div className="course-list_footer-row flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <CourseFooterChip variant="muted" icon={<FaFileAlt />} label={courseType} />

        <CourseFooterChip variant="views" icon={<FaEye />} label={`${formatCount(totalReads)} views`} />

        <CourseFooterChip as="button" variant="likes" icon={stats.liked ? <FaHeart /> : <FaThumbsUp />} label={`${formatCount(stats.likes)} likes`} active={stats.liked} onClick={handleToggleLike} />

        <CourseFooterChip variant="comments" icon={<FaCommentDots />} label={`${formatCount(commentsCount)} comments`} />

        <CourseFooterChip
          as="button"
          variant="bookmarks"
          icon={stats.bookmarked ? <FaBookmark /> : <FaRegBookmark />}
          label={`${formatCount(stats.bookmarks)} bookmarks`}
          active={stats.bookmarked}
          onClick={handleToggleBookmark}
        />
      </div>

      {isPaid && (
        <TertiaryButton onClick={onAddToCart} className="course-list_footer-cart flexC gap-2">
          <FaShoppingCart size={12} />

          <span>Add Cart</span>

          <span>Rs. {course?.price || 0}</span>
        </TertiaryButton>
      )}
    </div>
  );
};

const CourseFooterChip = ({ as = "span", variant = "stat", icon, label, active = false, onClick }) => {
  const Element = as;

  return (
    <Element
      type={as === "button" ? "button" : undefined}
      aria-pressed={as === "button" ? active : undefined}
      onClick={onClick}
      className={`course-list_footer-chip course-list_footer-chip--${variant} ${active ? "course-list_footer-chip--active" : ""}`}
    >
      <span className="course-list_footer-chip-icon">{icon}</span>

      <span>{label}</span>
    </Element>
  );
};

export const ContentChapter = ({ lesson, count, slug }) => {
  return (
    <div className="h-[5.75rem] rounded-2xl border border-transparent p-2.5 transition duration-300 ease-in-out hover:cursor-pointer hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.08)]">
      <div className="top grid h-full grid-cols-[3rem_minmax(0,1fr)] items-start gap-4">
        <div className="flex justify-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(68,66,178,0.1)] text-sm tabular-nums dark:bg-[rgba(0,0,0,0.2)]">{count}</span>
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h5 className="min-w-0 pr-2 font-semibold text-white">
              <NavLink to={`/course/${slug}`} className="line-clamp-1">
                {truncateText(lesson?.title, 28)}
              </NavLink>
            </h5>

            <span className="shrink-0 rounded-lg bg-[rgba(68,66,178,0.1)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] dark:bg-[rgba(0,0,0,0.2)]">{lesson?.level || "Topic"}</span>
          </div>

          <p className="line-clamp-2 text-sm leading-5">{truncateText(lesson?.description || lesson?.parentTitle, 70)}</p>
        </div>
      </div>
    </div>
  );
};

export const ContentCardBg = ({ gradientIndex = 0 }) => {
  const randomGradient1 = getRandomGradient(gradientIndex);
  const randomGradient2 = getRandomGradient(gradientIndex + 1);

  return (
    <div className="background pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="pointer-events-none absolute left-[250px] top-[-102px] z-50 h-[248px] w-[800px] rounded-full opacity-[0.11] blur-[100px]"
        style={{ background: randomGradient1 }}
        aria-hidden="true"
      ></div>

      <div className="pointer-events-none absolute right-[25%] top-[-52px] h-[248px] w-[490px] rounded-full opacity-[0.25] blur-[100px]" style={{ background: randomGradient2 }}></div>

      <div className="pointer-events-none absolute right-[25%] top-0 z-20 h-px w-[524px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#FFFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter"></div>

      <div className="pointer-events-none absolute right-[25%] top-0 z-20 h-px w-[524px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#FFFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter blur-[1px]"></div>

      <div className="pointer-events-none absolute right-[25%] top-0 z-20 h-px w-[524px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#BAFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter blur-[5px]"></div>

      <div className="pointer-events-none absolute right-[35%] top-[-11px] h-[23px] w-[400px] rounded-[50%] bg-[#E6FCFF] opacity-20 mix-blend-plus-lighter blur-[25px]"></div>

      <div className="pointer-events-none absolute right-[35%] top-[-16px] h-[32px] w-[448px] rounded-[50%] bg-[#67DBFF] opacity-25 mix-blend-plus-lighter blur-[50px]"></div>
    </div>
  );
};
