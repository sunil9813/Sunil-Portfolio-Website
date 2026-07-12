import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaUniversity } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { VscVerifiedFilled } from "react-icons/vsc";

import { getProgram } from "@/redux/slices/universityStructure/programSlice";
import { RichTextRenderer, Wrapper } from "@/routes";

const ViewProgramSkeleton = () => {
  return (
    <Wrapper className="p-3 sm:p-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)]">
        <div className="h-[330px] animate-pulse rounded-3xl bg-gray-200 dark:bg-white/[0.04] sm:h-[380px]" />

        <div className="h-[330px] animate-pulse rounded-3xl bg-gray-200 dark:bg-white/[0.04] sm:h-[380px]" />
      </div>

      <div className="mt-3 rounded-3xl border border-gray-200/70 p-6 dark:border-white/[0.05]">
        <div className="mb-6 h-7 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-white/[0.04]" />

        <div className="space-y-3">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="h-4 animate-pulse rounded bg-gray-200 dark:bg-white/[0.04]" />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export const ViewProgram = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { program, isLoading } = useSelector((state) => state.program);

  useEffect(() => {
    if (slug) {
      dispatch(getProgram(slug));
    }
  }, [dispatch, slug]);

  const programInitial = program?.name?.trim()?.charAt(0)?.toUpperCase() || "P";

  const universityInitial = program?.university?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  if (isLoading || !program) {
    return <ViewProgramSkeleton />;
  }

  return (
    <Wrapper className="group relative overflow-hidden p-3 sm:p-4">
      {/* Wrapper background remains unchanged */}

      <div className="pointer-events-none absolute -right-32 top-10 size-80 rounded-full bg-cyan-500/[0.012] blur-[110px]" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-violet-500/[0.012] blur-[110px]" />

      <div className="relative z-10">
        {/* Program header */}
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)]">
          {/* Program image */}
          <div className="group/image relative h-[330px] overflow-hidden rounded-3xl border border-gray-200/70 bg-gray-100 shadow-[0_18px_45px_rgba(15,23,42,0.10)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_20px_50px_rgba(0,0,0,0.28)] sm:h-[380px]">
            {program?.thumbnail?.filePath ? (
              <img
                src={program.thumbnail.filePath}
                alt={program?.thumbnail?.publicId || program?.name || "Program thumbnail"}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover/image:scale-[1.025]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.16),transparent_42%),linear-gradient(145deg,#172033,#0b1120)]">
                <span className="text-7xl font-black text-white/[0.10]">{programInitial}</span>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/75" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-black/30 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur-xl">
              <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]" />
              Academic program
            </div>

            <div className="absolute inset-x-5 bottom-5">
              <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-white/40">Program preview</p>

              <p className="mt-1 line-clamp-2 text-sm font-semibold capitalize text-white/85">{program?.name || "Program name"}</p>
            </div>
          </div>

          {/* Program information */}
          <div className="relative min-h-[330px] overflow-hidden rounded-3xl border border-gray-200/70 bg-gray-50/55 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_20px_50px_rgba(0,0,0,0.22)] sm:min-h-[380px] sm:p-7">
            <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-cyan-500/[0.025] blur-[80px]" />

            <div className="pointer-events-none absolute -bottom-20 -left-20 size-56 rounded-full bg-violet-500/[0.018] blur-[80px]" />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.018),transparent_40%,transparent_72%,rgba(255,255,255,0.004))]" />

            <div className="relative z-10 flex h-full flex-col">
              {/* University identity */}
              <div className="flex items-center gap-4">
                <div className="relative size-20 shrink-0">
                  <div className="pointer-events-none absolute -inset-1 rounded-[24px] bg-gradient-to-br from-cyan-500/30 via-indigo-500/15 to-violet-500/30 blur-md" />

                  <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-gray-200/80 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)] dark:border-white/[0.08] dark:bg-white/[0.035] dark:shadow-[0_14px_34px_rgba(0,0,0,0.30)]">
                    {program?.university?.logo?.filePath ? (
                      <img
                        src={program.university.logo.filePath}
                        alt={program?.university?.logo?.publicId || `${program?.university?.name || "University"} logo`}
                        className="h-full w-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 via-indigo-500 to-violet-600 text-2xl font-bold text-white">
                        {universityInitial}
                      </div>
                    )}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-white/25">Affiliated institution</p>

                  <h2 className="mt-1 truncate text-sm font-bold capitalize text-gray-900 dark:text-white/90 sm:text-base">{program?.university?.name || "University"}</h2>

                  {program?.faculty?.name && <p className="mt-1 truncate text-[10px] capitalize text-gray-500 dark:text-white/35">{program.faculty.name}</p>}
                </div>
              </div>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/[0.07]" />

              {/* Program title */}
              <div className="flex-1">
                <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-200/55">Program details</p>

                <div className="mt-3 flex items-start gap-2.5">
                  <h1 className="text-2xl font-black capitalize leading-[1.08] tracking-[-0.04em] text-gray-900 dark:text-white/90 sm:text-3xl xl:text-4xl">{program?.name || "Program name"}</h1>

                  <VscVerifiedFilled size={23} title="Verified program" className="mt-1 shrink-0 text-emerald-500 dark:text-emerald-300/80" />
                </div>

                <p className="mt-4 max-w-xl text-[10px] leading-5 text-gray-500 dark:text-white/35">
                  An academic program offered by <span className="font-semibold text-gray-700 dark:text-white/60">{program?.university?.name || "the university"}</span>
                  {program?.faculty?.name ? ` through the ${program.faculty.name}.` : "."}
                </p>
              </div>

              {/* Information chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {program?.university?.name && (
                  <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-500/[0.055] px-3 py-2 text-[9px] font-medium capitalize text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70">
                    <FaUniversity className="shrink-0" />

                    <span className="truncate">{program.university.name}</span>
                  </div>
                )}

                {program?.faculty?.name && (
                  <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-500/[0.055] px-3 py-2 text-[9px] font-medium capitalize text-violet-700 dark:border-violet-300/[0.09] dark:bg-violet-300/[0.04] dark:text-violet-200/70">
                    <MdSchool className="shrink-0" />

                    <span className="truncate">{program.faculty.name}</span>
                  </div>
                )}

                <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-500/[0.05] px-3 py-2 text-[9px] font-medium text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/65">
                  <VscVerifiedFilled size={13} />
                  Verified
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program description */}
        <section className="relative mt-3 overflow-hidden rounded-3xl border border-gray-200/70 bg-gray-50/45 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-7">
          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-cyan-500/[0.022] blur-[90px]" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-violet-500/[0.016] blur-[90px]" />

          <div className="relative z-10">
            <header className="mb-6 flex flex-col gap-4 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-cyan-600 dark:text-cyan-200/55">Program overview</p>

                <h2 className="mt-1.5 text-lg font-black tracking-[-0.025em] text-gray-900 dark:text-white/90 sm:text-xl">About this program</h2>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200/70 bg-white/60 px-3 py-1.5 text-[9px] font-medium text-gray-500 dark:border-white/[0.055] dark:bg-white/[0.022] dark:text-white/35">
                <span className="size-1.5 rounded-full bg-cyan-500 dark:bg-cyan-300/70" />
                Academic information
              </div>
            </header>

            {/* No vertical line in this description */}
            <div className="text-gray-700 dark:text-white/65">
              <RichTextRenderer content={program?.description || ""} />
            </div>
          </div>
        </section>
      </div>
    </Wrapper>
  );
};
