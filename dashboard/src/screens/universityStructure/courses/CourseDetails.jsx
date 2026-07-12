import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaUniversity } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { MdSchool } from "react-icons/md";
import { VscVerifiedFilled } from "react-icons/vsc";

import { getCourse } from "@/redux/slices/universityStructure/courseSlice";
import { RichTextRenderer, Wrapper } from "@/routes";

export const CourseDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { course } = useSelector((state) => state.course);

  useEffect(() => {
    if (slug) {
      dispatch(getCourse(slug));
    }
  }, [dispatch, slug]);

  const courseInitial = course?.name?.trim()?.charAt(0)?.toUpperCase() || "C";

  const universityInitial = course?.university?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="group relative overflow-hidden ">
      {/* Wrapper background remains unchanged */}

      <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-indigo-500/[0.014] blur-[115px]" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-cyan-500/[0.012] blur-[115px]" />

      <div className="relative z-10 space-y-3">
        {/* Main course introduction */}
        <Wrapper>
          <div className="relative overflow-hidden rounded-[28px] border border-gray-200/70 bg-gray-50/45 shadow-[0_20px_50px_rgba(15,23,42,0.07)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:shadow-[0_22px_55px_rgba(0,0,0,0.22)]">
            <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-indigo-500/[0.022] blur-[90px]" />

            <div className="pointer-events-none absolute -bottom-24 right-0 size-64 rounded-full bg-cyan-500/[0.018] blur-[90px]" />

            <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
              {/* Course information */}
              <div className="flex min-h-[440px] flex-col justify-between p-5 sm:p-7 lg:p-9">
                <div>
                  {/* Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-500/[0.055] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.13em] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                      <HiOutlineBookOpen size={13} />
                      Academic course
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/[0.05] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/65">
                      <VscVerifiedFilled size={12} />
                      Verified
                    </div>
                  </div>

                  {/* Course title */}
                  <div className="mt-8 max-w-4xl">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-white/25">Course profile</p>

                    <div className="mt-3 flex items-start gap-3">
                      <h1 className="text-3xl font-black capitalize leading-[1.05] tracking-[-0.045em] text-gray-900 dark:text-white/90 sm:text-4xl lg:text-5xl">{course?.name || "Course name"}</h1>

                      <VscVerifiedFilled size={24} title="Verified course" className="mt-1 shrink-0 text-emerald-500 dark:text-emerald-300/80 sm:size-7" />
                    </div>

                    <p className="mt-5 max-w-2xl text-[10px] leading-6 text-gray-500 dark:text-white/35 sm:text-[11px]">
                      This academic course is offered by <span className="font-semibold text-gray-700 dark:text-white/60">{course?.university?.name || "the selected university"}</span>
                      {course?.faculty?.name ? ` through the ${course.faculty.name}.` : "."}
                    </p>
                  </div>
                </div>

                {/* University identity */}
                <div className="mt-10">
                  <div className="mb-4 h-px bg-gradient-to-r from-gray-200 via-gray-200/60 to-transparent dark:from-white/[0.07] dark:via-white/[0.03]" />

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="relative size-16 shrink-0">
                        <div className="pointer-events-none absolute -inset-1 rounded-[22px] bg-gradient-to-br from-indigo-500/25 to-cyan-500/25 blur-md" />

                        <div className="relative h-full w-full overflow-hidden rounded-[20px] border border-gray-200/80 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.12)] dark:border-white/[0.08] dark:bg-white/[0.035] dark:shadow-[0_14px_32px_rgba(0,0,0,0.30)]">
                          {course?.university?.logo?.filePath ? (
                            <img
                              src={course.university.logo.filePath}
                              alt={course?.university?.logo?.publicId || `${course?.university?.name || "University"} logo`}
                              className="h-full w-full object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-cyan-500 text-xl font-bold text-white">{universityInitial}</div>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-white/20">Affiliated university</p>

                        <h2 className="mt-1 truncate text-sm font-bold capitalize text-gray-900 dark:text-white/90">{course?.university?.name || "University"}</h2>

                        {course?.faculty?.name && <p className="mt-1 truncate text-[9px] capitalize text-gray-500 dark:text-white/35">{course.faculty.name}</p>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {course?.university?.name && (
                        <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.055] px-3 py-2 text-[9px] font-medium capitalize text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                          <FaUniversity className="shrink-0" />

                          <span className="truncate">{course.university.name}</span>
                        </div>
                      )}

                      {course?.faculty?.name && (
                        <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-500/[0.055] px-3 py-2 text-[9px] font-medium capitalize text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70">
                          <MdSchool className="shrink-0" />

                          <span className="truncate">{course.faculty.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Course visual */}
              <div className="relative min-h-[340px] border-t border-gray-200/70 p-3 dark:border-white/[0.05] xl:min-h-[440px] xl:border-l xl:border-t-0">
                <div className="group/image relative h-full min-h-[320px] overflow-hidden rounded-[24px] border border-gray-200/70 bg-gray-100 dark:border-white/[0.06] dark:bg-white/[0.018]">
                  {course?.thumbnail?.filePath ? (
                    <img
                      src={course.thumbnail.filePath}
                      alt={course?.thumbnail?.publicId || course?.name || "Course thumbnail"}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover/image:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.18),transparent_42%),linear-gradient(145deg,#172033,#0b1120)]">
                      <span className="text-8xl font-black text-white/[0.10]">{courseInitial}</span>
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/85" />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/85 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full border border-white/[0.14] bg-black/30 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur-xl">
                    Course preview
                  </div>

                  <div className="absolute inset-x-5 bottom-5">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-white/40">Featured course</p>

                    <h3 className="mt-1.5 line-clamp-2 text-lg font-bold capitalize leading-tight text-white/90">{course?.name || "Course name"}</h3>

                    {course?.university?.name && <p className="mt-2 truncate text-[9px] capitalize text-white/50">{course.university.name}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Wrapper>

        {/* Description */}
        <Wrapper>
          <div className="relative overflow-hidden rounded-[28px] border border-gray-200/70 bg-gray-50/45 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/[0.020] blur-[90px]" />

            <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-cyan-500/[0.016] blur-[90px]" />

            <div className="relative z-10">
              <header className="flex flex-col gap-5 border-b border-gray-200/70 px-5 py-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                    <HiOutlineBookOpen size={18} />
                  </div>

                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-200/55">Course overview</p>

                    <h2 className="mt-1 text-lg font-black tracking-[-0.025em] text-gray-900 dark:text-white/90">About this course</h2>
                  </div>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200/70 bg-white/60 px-3 py-1.5 text-[8px] font-medium text-gray-500 dark:border-white/[0.055] dark:bg-white/[0.022] dark:text-white/35">
                  <span className="size-1.5 rounded-full bg-indigo-500 dark:bg-indigo-300/70" />
                  Academic information
                </div>
              </header>

              {/* Clean description without left vertical line */}
              <div className="p-5 text-gray-700 dark:text-white/65 sm:p-7 lg:p-8">
                <RichTextRenderer content={course?.description || ""} />
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
};
