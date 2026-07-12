import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BiSolidChevronRight } from "react-icons/bi";
import { FaComments } from "react-icons/fa";
import { HiOutlineBookOpen, HiOutlineDocumentText, HiOutlineTag, HiOutlineVideoCamera } from "react-icons/hi2";
import { IoEyeOutline, IoPersonOutline } from "react-icons/io5";
import { MdOutlineSchool } from "react-icons/md";
import { VscVerifiedFilled } from "react-icons/vsc";

import { getChapter } from "@/redux/slices/universityStructure/chapterSlice";
import { generateItemColor } from "@/utils";
import { LikeButton, RichTextRenderer, Wrapper } from "@/routes";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3940/3940417.png";

const getCount = (value) => {
  if (Array.isArray(value)) {
    return value.length;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const ChapterDetailsSkeleton = () => {
  return (
    <Wrapper className="relative p-3 sm:p-4">
      <div className="overflow-hidden rounded-[30px] border border-gray-200/70 dark:border-white/[0.05]">
        <div className="grid grid-cols-1 gap-0 xl:grid-cols-[380px_minmax(0,1fr)]">
          <div className="h-[340px] animate-pulse bg-gray-200 dark:bg-white/[0.035]" />

          <div className="space-y-5 p-6 sm:p-8">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-white/[0.035]" />

            <div className="h-12 w-4/5 animate-pulse rounded-xl bg-gray-200 dark:bg-white/[0.04]" />

            <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-white/[0.035]" />

            <div className="grid grid-cols-3 gap-3 pt-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-2xl bg-gray-200 dark:bg-white/[0.035]" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-[30px] border border-gray-200/70 p-6 dark:border-white/[0.05]">
        <div className="mb-7 h-7 w-52 animate-pulse rounded-lg bg-gray-200 dark:bg-white/[0.04]" />

        <div className="space-y-3">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-4 animate-pulse rounded bg-gray-200 dark:bg-white/[0.035]" />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export const ChapterDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { chapter } = useSelector((state) => state.chapter);

  useEffect(() => {
    if (slug) {
      dispatch(getChapter(slug));
    }
  }, [dispatch, slug]);

  const authorName = chapter?.user?.name || chapter?.name || "Unknown author";

  const rawUserAvatar = chapter?.user?.avatar;

  const authorAvatar = typeof rawUserAvatar === "string" ? rawUserAvatar : rawUserAvatar?.url || chapter?.avatar?.url || "";

  const avatarPublicId = typeof rawUserAvatar === "object" ? rawUserAvatar?.publicId : chapter?.avatar?.publicId || authorName;

  const showGeneratedAvatar = !authorAvatar || authorAvatar === DEFAULT_AVATAR;

  const viewCount = getCount(chapter?.numOfViews);

  const commentCount = chapter?.comments?.length ?? chapter?.commentCount ?? 200;

  const likeCount = chapter?.likeCount ?? chapter?.likes?.length ?? 0;

  const chapterInitial = chapter?.title?.trim()?.charAt(0)?.toUpperCase() || chapter?.metaTitle?.trim()?.charAt(0)?.toUpperCase() || "C";

  const avatarBackground = useMemo(() => {
    try {
      return generateItemColor(authorName) || "linear-gradient(135deg, #6366f1, #06b6d4)";
    } catch {
      return "linear-gradient(135deg, #6366f1, #06b6d4)";
    }
  }, [authorName]);

  if (!chapter || Object.keys(chapter).length === 0) {
    return <ChapterDetailsSkeleton />;
  }

  return (
    <Wrapper className="group relative overflow-hidden p-3 sm:p-4">
      {/* Wrapper background remains unchanged */}

      <div className="pointer-events-none absolute -right-36 -top-36 size-96 rounded-full bg-indigo-500/[0.01] blur-[130px]" />

      <div className="pointer-events-none absolute -bottom-36 -left-36 size-96 rounded-full bg-cyan-500/[0.009] blur-[130px]" />

      <div className="relative z-10 space-y-3">
        {/* Chapter masthead */}
        <section className="relative overflow-hidden rounded-[30px] border border-gray-200/70 bg-gray-50/45 shadow-[0_18px_48px_rgba(15,23,42,0.055)] dark:border-white/[0.055] dark:bg-white/[0.014] dark:shadow-[0_22px_55px_rgba(0,0,0,0.18)]">
          <div className="h-[3px] bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 dark:from-indigo-300/60 dark:via-cyan-300/60 dark:to-emerald-300/60" />

          <div className="grid grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)]">
            {/* Chapter cover */}
            <div className="border-b border-gray-200/70 p-3 dark:border-white/[0.05] xl:border-b-0 xl:border-r">
              <div className="relative h-[320px] overflow-hidden rounded-[24px] border border-gray-200/70 bg-gray-100 dark:border-white/[0.055] dark:bg-white/[0.018] xl:h-full xl:min-h-[410px]">
                {chapter?.thumbnail?.filePath ? (
                  <img
                    src={chapter.thumbnail.filePath}
                    alt={chapter?.thumbnail?.publicId || chapter?.title || "Chapter thumbnail"}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_82%_14%,rgba(99,102,241,0.22),transparent_34%),radial-gradient(circle_at_12%_88%,rgba(6,182,212,0.16),transparent_40%),linear-gradient(145deg,#172033,#090e18)]">
                    <span className="text-8xl font-black text-white/[0.09]">{chapterInitial}</span>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/75" />

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-xl border border-white/[0.14] bg-black/30 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.13em] text-white/80 backdrop-blur-xl">
                  <HiOutlineBookOpen size={13} />
                  Chapter cover
                </div>

                <div className="absolute inset-x-5 bottom-5">
                  <p className="text-[7px] font-semibold uppercase tracking-[0.13em] text-white/40">Learning material</p>

                  <h2 className="mt-1.5 line-clamp-2 text-lg font-bold capitalize leading-6 text-white/90">{chapter?.title || chapter?.metaTitle || "Chapter details"}</h2>

                  {chapter?.subject?.name && (
                    <div className="mt-3 flex items-center gap-2 text-[9px] font-medium capitalize text-white/50">
                      <MdOutlineSchool className="shrink-0" />

                      <span className="truncate">{chapter.subject.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chapter information */}
            <div className="relative overflow-hidden p-5 sm:p-7 lg:p-8">
              <div className="pointer-events-none -right-24 -top-24 absolute size-64 rounded-full bg-indigo-500/[0.018] blur-[90px]" />

              <div className="pointer-events-none -bottom-24 -left-20 absolute size-64 rounded-full bg-cyan-500/[0.013] blur-[90px]" />

              <div className="relative z-10 flex h-full min-h-[370px] flex-col">
                {/* Chapter breadcrumb */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.055] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.13em] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65">
                    <HiOutlineDocumentText size={14} />
                    Chapter lesson
                  </div>

                  {chapter?.subject?.name && (
                    <>
                      <BiSolidChevronRight className="text-gray-300 dark:text-white/15" />

                      <div className="flex min-w-0 items-center gap-2 text-[9px] font-medium capitalize text-gray-500 dark:text-white/35">
                        <MdOutlineSchool className="shrink-0 text-cyan-600 dark:text-cyan-200/60" />

                        <span className="max-w-72 truncate">{chapter.subject.name}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Title */}
                <div className="my-auto py-8">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.17em] text-gray-400 dark:text-white/20">Chapter title</p>

                  <div className="mt-3 flex max-w-5xl items-start gap-3">
                    <h1 className="text-3xl font-black capitalize leading-[1.07] tracking-[-0.045em] text-gray-950 dark:text-white/90 sm:text-4xl lg:text-5xl">
                      {chapter?.metaTitle || chapter?.title || "Chapter details"}
                    </h1>

                    <VscVerifiedFilled size={23} title="Published chapter" className="mt-1 shrink-0 text-emerald-500 dark:text-emerald-300/75" />
                  </div>

                  {chapter?.title && chapter?.metaTitle && chapter.title !== chapter.metaTitle && (
                    <p className="mt-5 max-w-3xl text-[11px] font-medium capitalize leading-6 text-gray-500 dark:text-white/35">{chapter.title}</p>
                  )}
                </div>

                {/* Author and status */}
                <div className="flex flex-col gap-4 border-t border-gray-200/70 pt-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    {showGeneratedAvatar ? (
                      <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold uppercase text-white shadow-[0_10px_25px_rgba(15,23,42,0.15)]"
                        style={{
                          background: avatarBackground,
                        }}
                      >
                        {authorName.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <div className="size-11 shrink-0 overflow-hidden rounded-2xl border border-gray-200/75 bg-gray-100 shadow-[0_8px_20px_rgba(15,23,42,0.08)] dark:border-white/[0.07] dark:bg-white/[0.025]">
                        <img src={authorAvatar} alt={avatarPublicId} className="h-full w-full object-cover" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <IoPersonOutline className="text-gray-400 dark:text-white/25" />

                        <p className="text-[7px] font-semibold uppercase tracking-[0.11em] text-gray-400 dark:text-white/20">Chapter author</p>
                      </div>

                      <p className="mt-1 truncate text-[11px] font-semibold capitalize text-gray-800 dark:text-white/65">{authorName}</p>
                    </div>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-500/[0.045] px-3 py-2 text-[8px] font-semibold text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.028] dark:text-emerald-200/65">
                    <VscVerifiedFilled size={13} />
                    Published lesson
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Engagement dashboard */}
        <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-[22px] border border-gray-200/70 bg-gray-50/45 px-4 py-4 shadow-[0_10px_26px_rgba(15,23,42,0.035)] dark:border-white/[0.05] dark:bg-white/[0.014] dark:shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-500/[0.065] text-sky-700 dark:border-sky-300/[0.08] dark:bg-sky-300/[0.035] dark:text-sky-200/65">
              <IoEyeOutline size={17} />
            </span>

            <div>
              <p className="text-base font-black tabular-nums text-gray-900 dark:text-white/80">{viewCount}</p>

              <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Total views</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-[22px] border border-gray-200/70 bg-gray-50/45 px-4 py-4 shadow-[0_10px_26px_rgba(15,23,42,0.035)] dark:border-white/[0.05] dark:bg-white/[0.014] dark:shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/[0.065] text-violet-700 dark:border-violet-300/[0.08] dark:bg-violet-300/[0.035] dark:text-violet-200/65">
              <FaComments size={15} />
            </span>

            <div>
              <p className="text-base font-black tabular-nums text-gray-900 dark:text-white/80">{commentCount}</p>

              <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Comments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-[22px] border border-gray-200/70 bg-gray-50/45 px-4 py-4 shadow-[0_10px_26px_rgba(15,23,42,0.035)] dark:border-white/[0.05] dark:bg-white/[0.014] dark:shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.065] text-rose-700 dark:border-rose-300/[0.08] dark:bg-rose-300/[0.035] dark:text-rose-200/65">
              <LikeButton resourceType="chapter" contentId={chapter?._id} initialLikes={chapter?.likes || []} showtrue />
            </span>

            <div>
              <p className="text-base font-black tabular-nums text-gray-900 dark:text-white/80">{likeCount}</p>

              <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Likes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-[22px] border border-gray-200/70 bg-gray-50/45 px-4 py-4 shadow-[0_10px_26px_rgba(15,23,42,0.035)] dark:border-white/[0.05] dark:bg-white/[0.014] dark:shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/[0.065] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/65">
              <VscVerifiedFilled size={16} />
            </span>

            <div>
              <p className="text-[11px] font-bold text-gray-900 dark:text-white/75">Published</p>

              <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Content status</p>
            </div>
          </div>
        </section>

        {/* Tags */}
        {chapter?.tags?.length > 0 && (
          <section className="flex flex-col gap-4 rounded-[24px] border border-gray-200/70 bg-gray-50/40 px-4 py-4 dark:border-white/[0.05] dark:bg-white/[0.014] sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-500/[0.06] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65">
                <HiOutlineTag size={16} />
              </span>

              <div>
                <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-cyan-600 dark:text-cyan-200/50">Chapter topics</p>

                <p className="mt-0.5 text-[9px] text-gray-400 dark:text-white/25">Related learning tags</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {chapter.tags.map((tag) => (
                <button
                  key={tag?._id || tag?.tag}
                  type="button"
                  className="rounded-xl border border-cyan-300/20 bg-cyan-500/[0.045] px-3 py-2 text-[8px] font-medium text-cyan-700 transition-all hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-cyan-500/[0.08] dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.028] dark:text-cyan-200/65 dark:hover:bg-cyan-300/[0.055]"
                >
                  #{tag?.tag}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Reading document */}
        <section className="relative overflow-hidden rounded-[30px] border border-gray-200/70 bg-gray-50/45 shadow-[0_16px_40px_rgba(15,23,42,0.045)] dark:border-white/[0.05] dark:bg-white/[0.014] dark:shadow-[0_18px_45px_rgba(0,0,0,0.15)]">
          <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-indigo-500/[0.013] blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-cyan-500/[0.01] blur-[100px]" />

          <div className="relative z-10">
            <header className="flex flex-col gap-4 border-b border-gray-200/70 px-5 py-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.065] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65">
                  <HiOutlineDocumentText size={19} />
                </span>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-200/50">Lesson document</p>

                  <h2 className="mt-1 text-lg font-black tracking-[-0.025em] text-gray-950 dark:text-white/90">Chapter content</h2>
                </div>
              </div>

              {chapter?.subject?.name && (
                <div className="inline-flex w-fit max-w-72 items-center gap-2 rounded-xl border border-gray-200/70 bg-white/55 px-3 py-2 text-[8px] font-medium capitalize text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/35">
                  <MdOutlineSchool className="shrink-0 text-cyan-600 dark:text-cyan-200/60" />

                  <span className="truncate">{chapter.subject.name}</span>
                </div>
              )}
            </header>

            {/* Clean reading area without vertical line */}
            <article className="mx-auto max-w-6xl p-5 text-gray-700 dark:text-white/65 sm:p-7 lg:p-10">
              <RichTextRenderer content={chapter?.description || ""} />
            </article>
          </div>
        </section>

        {/* Video lesson */}
        {chapter?.video?.filePath && (
          <section className="relative overflow-hidden rounded-[30px] border border-gray-200/70 bg-gray-50/45 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.05)] dark:border-white/[0.05] dark:bg-white/[0.014] dark:shadow-[0_18px_45px_rgba(0,0,0,0.18)] sm:p-4">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-rose-500/[0.011] blur-[90px]" />

            <div className="relative z-10">
              <header className="mb-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.065] text-rose-600 dark:border-rose-300/[0.08] dark:bg-rose-300/[0.035] dark:text-rose-200/65">
                    <HiOutlineVideoCamera size={19} />
                  </span>

                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-rose-600 dark:text-rose-200/50">Learning media</p>

                    <h2 className="mt-1 text-[11px] font-semibold text-gray-800 dark:text-white/60">Chapter video lesson</h2>
                  </div>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200/70 bg-gray-50/60 px-3 py-2 text-[8px] font-medium text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
                  <span className="size-1.5 rounded-full bg-rose-500 dark:bg-rose-300/70" />
                  Video included
                </span>
              </header>

              <div className="mx-auto max-w-6xl overflow-hidden rounded-[24px] border border-gray-200/70 bg-black dark:border-white/[0.06]">
                <video src={chapter.video.filePath} controls preload="metadata" className="aspect-video w-full bg-black object-contain">
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </section>
        )}
      </div>
    </Wrapper>
  );
};
