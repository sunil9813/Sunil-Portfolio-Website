import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { FaAward, FaBriefcase, FaGraduationCap, FaTrophy, FaUserFriends } from "react-icons/fa";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineCheckBadge,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineSparkles,
  HiOutlineTrophy,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { PiCertificate } from "react-icons/pi";
import { RiDoubleQuotesL } from "react-icons/ri";

import { DateFormatter } from "@/components/common/DateFormatter";
import { getResume } from "@/redux/slices/portfolio/resumeSlice";
import { Loader, RichTextRenderer, Wrapper } from "@/routes";

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const resumePropTypes = {
  education: PropTypes.array,
  experience: PropTypes.array,
  skills: PropTypes.array,
  award: PropTypes.array,
  achievements: PropTypes.array,
  training: PropTypes.array,
  reference: PropTypes.array,
};

/*
 * Curated palette without pink or rose.
 * Every résumé item receives a consistent colour.
 */
const ACCENT_THEMES = [
  {
    primary: "#22d3ee",
    secondary: "#3b82f6",
    soft: "rgba(34, 211, 238, 0.09)",
    border: "rgba(34, 211, 238, 0.22)",
    glow: "rgba(34, 211, 238, 0.16)",
  },
  {
    primary: "#60a5fa",
    secondary: "#6366f1",
    soft: "rgba(96, 165, 250, 0.09)",
    border: "rgba(96, 165, 250, 0.22)",
    glow: "rgba(96, 165, 250, 0.16)",
  },
  {
    primary: "#818cf8",
    secondary: "#8b5cf6",
    soft: "rgba(129, 140, 248, 0.09)",
    border: "rgba(129, 140, 248, 0.22)",
    glow: "rgba(129, 140, 248, 0.16)",
  },
  {
    primary: "#2dd4bf",
    secondary: "#06b6d4",
    soft: "rgba(45, 212, 191, 0.09)",
    border: "rgba(45, 212, 191, 0.22)",
    glow: "rgba(45, 212, 191, 0.16)",
  },
  {
    primary: "#34d399",
    secondary: "#14b8a6",
    soft: "rgba(52, 211, 153, 0.09)",
    border: "rgba(52, 211, 153, 0.22)",
    glow: "rgba(52, 211, 153, 0.16)",
  },
  {
    primary: "#fbbf24",
    secondary: "#f59e0b",
    soft: "rgba(251, 191, 36, 0.09)",
    border: "rgba(251, 191, 36, 0.22)",
    glow: "rgba(251, 191, 36, 0.16)",
  },
  {
    primary: "#a78bfa",
    secondary: "#6366f1",
    soft: "rgba(167, 139, 250, 0.09)",
    border: "rgba(167, 139, 250, 0.22)",
    glow: "rgba(167, 139, 250, 0.16)",
  },
  {
    primary: "#fb923c",
    secondary: "#f59e0b",
    soft: "rgba(251, 146, 60, 0.09)",
    border: "rgba(251, 146, 60, 0.22)",
    glow: "rgba(251, 146, 60, 0.16)",
  },
];

const getArray = (value) => (Array.isArray(value) ? value : []);

const createHash = (value = "") => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
};

const getStableTheme = (value = "resume", index = 0) => {
  const paletteIndex = (createHash(value) + index) % ACCENT_THEMES.length;

  return ACCENT_THEMES[paletteIndex];
};

const safeUrl = (value) => {
  if (!value) {
    return null;
  }

  try {
    const formattedUrl = value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;

    const parsedUrl = new URL(formattedUrl);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return null;
    }

    return parsedUrl.href;
  } catch {
    return null;
  }
};

const getProficiencyDetails = (value) => {
  const progress = Math.min(Math.max(Number(value) || 0, 0), 100);

  if (progress >= 90) {
    return {
      label: "Expert",
      description: "Expert-level capability",
    };
  }

  if (progress >= 80) {
    return {
      label: "Advanced",
      description: "Advanced proficiency",
    };
  }

  if (progress >= 65) {
    return {
      label: "Proficient",
      description: "Strong working knowledge",
    };
  }

  if (progress >= 45) {
    return {
      label: "Intermediate",
      description: "Intermediate proficiency",
    };
  }

  return {
    label: "Developing",
    description: "Developing capability",
  };
};

const SectionHeader = ({ icon: Icon, eyebrow, title, description, count, accentClass }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-slate-200/75 pb-5 dark:border-white/[0.055] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm ${accentClass}`}>
          <Icon size={19} />
        </span>

        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-white/25">{eyebrow}</p>

          <h2 className="mt-1 text-lg font-black tracking-[-0.025em] text-slate-900 dark:text-white/90">{title}</h2>

          {description && <p className="mt-1 max-w-2xl text-[9px] leading-4 text-slate-400 dark:text-white/25">{description}</p>}
        </div>
      </div>

      {typeof count === "number" && (
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/75 bg-slate-50/65 px-3 py-1.5 text-[8px] font-semibold text-slate-500 shadow-sm dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/35">
          <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_9px_rgba(16,185,129,0.45)] dark:bg-emerald-300/75" />
          {count} {count === 1 ? "entry" : "entries"}
        </span>
      )}
    </div>
  );
};

SectionHeader.propTypes = {
  icon: PropTypes.elementType.isRequired,
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  count: PropTypes.number,
  accentClass: PropTypes.string.isRequired,
};

const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300/75 bg-slate-50/35 px-5 text-center dark:border-white/[0.075] dark:bg-white/[0.01]">
      <span className="flex size-12 items-center justify-center rounded-2xl border border-slate-200/75 bg-white/65 text-slate-400 shadow-sm dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/25">
        <Icon size={20} />
      </span>

      <h3 className="mt-3 text-[10px] font-semibold text-slate-600 dark:text-white/50">{title}</h3>

      <p className="mt-1 max-w-sm text-[9px] leading-4 text-slate-400 dark:text-white/25">{description}</p>
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const DateRange = ({ startDate, endDate, singleDate = false }) => {
  if (singleDate) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <HiOutlineCalendarDays size={13} />

        {startDate ? <DateFormatter date={startDate} /> : "Date not provided"}
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <HiOutlineCalendarDays size={13} />

      {startDate ? <DateFormatter date={startDate} /> : "Not provided"}

      <span className="text-slate-300 dark:text-white/15">—</span>

      {endDate ? <DateFormatter date={endDate} /> : "Present"}
    </span>
  );
};

DateRange.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  singleDate: PropTypes.bool,
};

const DescriptionBlock = ({ content, emptyText = "No description provided." }) => {
  if (!content) {
    return <p className="text-[9px] leading-5 text-slate-400 dark:text-white/25">{emptyText}</p>;
  }

  return (
    <div className="resume-rich-content text-[10px] leading-6 text-slate-600 dark:text-white/45">
      <RichTextRenderer content={content} />
    </div>
  );
};

DescriptionBlock.propTypes = {
  content: PropTypes.string,
  emptyText: PropTypes.string,
};

const OverviewStat = ({ icon: Icon, label, value, accentClass }) => {
  return (
    <div className="group/stat flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/75 bg-white/55 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:hover:border-white/[0.09]">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover/stat:scale-105 ${accentClass}`}>
        <Icon size={16} />
      </span>

      <div className="min-w-0">
        <p className="text-base font-black tabular-nums text-slate-900 dark:text-white/80">{value}</p>

        <p className="mt-0.5 truncate text-[7px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-white/20">{label}</p>
      </div>
    </div>
  );
};

OverviewStat.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  accentClass: PropTypes.string.isRequired,
};

const TimelineCard = ({ item, index, type, isLast }) => {
  const isEducation = type === "education";

  const colour = useMemo(() => getStableTheme(item?._id || item?.school || item?.company || `${type}-${index}`, index), [item?._id, item?.school, item?.company, type, index]);

  const Icon = isEducation ? FaGraduationCap : FaBriefcase;

  const title = isEducation ? item?.degree : item?.position;

  const organisation = isEducation ? item?.school : item?.company;

  const secondaryText = isEducation ? item?.university : null;

  return (
    <motion.article variants={itemVariants} className="relative pl-12">
      {!isLast && <div className="absolute bottom-[-18px] left-[17px] top-10 w-px bg-gradient-to-b from-slate-300/70 via-slate-200/50 to-transparent dark:from-white/[0.1] dark:via-white/[0.04]" />}

      <span
        className="absolute left-0 top-0 flex size-9 items-center justify-center rounded-xl border shadow-sm"
        style={{
          backgroundColor: colour.soft,
          borderColor: colour.border,
          color: colour.primary,
        }}
      >
        <Icon size={15} />
      </span>

      <div className="rounded-[22px] border border-slate-200/75 bg-white/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_32px_rgba(15,23,42,0.065)] dark:border-white/[0.055] dark:bg-white/[0.014] dark:hover:border-white/[0.09] dark:hover:bg-white/[0.022]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[7px] font-semibold uppercase tracking-[0.11em] text-slate-400 dark:text-white/20">{isEducation ? "Academic qualification" : "Professional role"}</p>

            <h4 className="mt-1 text-[12px] font-bold capitalize leading-5 text-slate-900 dark:text-white/75">{title || (isEducation ? "Qualification not provided" : "Position not provided")}</h4>

            <div className="mt-2 flex min-w-0 items-center gap-2 text-[9px] font-medium capitalize text-slate-500 dark:text-white/35">
              <HiOutlineBuildingOffice2 size={13} className="shrink-0" />

              <span className="truncate">{organisation || "Organisation not provided"}</span>
            </div>

            {secondaryText && secondaryText !== organisation && <p className="mt-1 text-[9px] capitalize text-slate-400 dark:text-white/25">{secondaryText}</p>}
          </div>

          <div className="shrink-0 rounded-xl border border-slate-200/75 bg-slate-50/60 px-3 py-2 text-[8px] font-medium text-slate-500 dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/35">
            <DateRange startDate={item?.startDate} endDate={item?.endDate} />
          </div>
        </div>

        {item?.city && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200/75 bg-white/45 px-2.5 py-1.5 text-[8px] capitalize text-slate-500 dark:border-white/[0.055] dark:bg-white/[0.014] dark:text-white/30">
            <HiOutlineMapPin size={12} />
            {item.city}
          </div>
        )}

        <div className="mt-4 border-t border-slate-200/75 pt-4 dark:border-white/[0.055]">
          <DescriptionBlock content={item?.description} />
        </div>
      </div>
    </motion.article>
  );
};

TimelineCard.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["education", "experience"]).isRequired,
  isLast: PropTypes.bool.isRequired,
};

const TimelineColumn = ({ title, description, icon: Icon, items, type, accentClass }) => {
  return (
    <div className="min-w-0 rounded-[26px] border border-slate-200/75 bg-slate-50/30 p-4 dark:border-white/[0.05] dark:bg-white/[0.008] sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex size-10 items-center justify-center rounded-2xl border ${accentClass}`}>
            <Icon size={17} />
          </span>

          <div>
            <h3 className="text-[12px] font-bold text-slate-900 dark:text-white/75">{title}</h3>

            <p className="mt-1 text-[8px] text-slate-400 dark:text-white/25">{description}</p>
          </div>
        </div>

        <span className="rounded-full border border-slate-200/75 bg-white/55 px-2.5 py-1 text-[8px] font-semibold tabular-nums text-slate-500 dark:border-white/[0.055] dark:bg-white/[0.015] dark:text-white/30">
          {items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <motion.div variants={containerVariants} className="space-y-[18px]">
          {items.map((item, index) => (
            <TimelineCard key={item?._id || `${type}-${index}`} item={item} index={index} type={type} isLast={index === items.length - 1} />
          ))}
        </motion.div>
      ) : (
        <EmptyState icon={Icon} title={`No ${title.toLowerCase()} added`} description="This résumé does not contain any entries in this section." />
      )}
    </div>
  );
};

TimelineColumn.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.oneOf(["education", "experience"]).isRequired,
  accentClass: PropTypes.string.isRequired,
};

export const ResumeDeatils = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { resume, isLoading } = useSelector((state) => state.resume);

  useEffect(() => {
    if (id) {
      dispatch(getResume(id));
    }
  }, [dispatch, id]);

  const education = getArray(resume?.education);

  const experience = getArray(resume?.experience);

  const skills = getArray(resume?.skills);

  const awards = getArray(resume?.award);

  const achievements = getArray(resume?.achievements);

  const training = getArray(resume?.training);

  const references = getArray(resume?.reference);

  const recognitionCount = awards.length + achievements.length;

  const totalEntries = education.length + experience.length + skills.length + recognitionCount + training.length + references.length;

  if (isLoading && (!resume || Object.keys(resume).length === 0)) {
    return <Loader />;
  }

  if (!isLoading && (!resume || Object.keys(resume).length === 0)) {
    return (
      <Wrapper className="p-5">
        <EmptyState icon={HiOutlineSparkles} title="Resume unavailable" description="The requested résumé could not be found or does not contain any information." />
      </Wrapper>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-3 pb-8">
      {/* Résumé overview */}
      <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-indigo-500/[0.025] blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-cyan-500/[0.018] blur-[100px]" />

        <div className="relative z-10">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-[20px] border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 shadow-[0_12px_30px_rgba(79,70,229,0.08)] dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                <HiOutlineSparkles size={24} />
              </span>

              <div className="min-w-0">
                <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-200/50">Professional profile</p>

                <h1 className="mt-1 text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-white/90 sm:text-3xl">Resume Details</h1>

                <p className="mt-2 max-w-2xl text-[10px] leading-5 text-slate-500 dark:text-white/35">
                  A complete overview of academic qualifications, professional experience, technical capabilities, achievements, training and references.
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-500/[0.05] px-3 py-2 text-[8px] font-semibold text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.03] dark:text-emerald-200/65">
                  <HiOutlineCheckBadge size={14} />
                  {totalEntries} résumé records
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:min-w-[650px] xl:grid-cols-6">
              <OverviewStat
                icon={HiOutlineAcademicCap}
                label="Education"
                value={education.length}
                accentClass="border-sky-300/20 bg-sky-500/[0.07] text-sky-700 dark:border-sky-300/[0.08] dark:bg-sky-300/[0.035] dark:text-sky-200/65"
              />

              <OverviewStat
                icon={HiOutlineBriefcase}
                label="Experience"
                value={experience.length}
                accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65"
              />

              <OverviewStat
                icon={HiOutlineChartBar}
                label="Skills"
                value={skills.length}
                accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65"
              />

              <OverviewStat
                icon={HiOutlineTrophy}
                label="Recognition"
                value={recognitionCount}
                accentClass="border-amber-300/20 bg-amber-500/[0.07] text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.035] dark:text-amber-200/65"
              />

              <OverviewStat
                icon={PiCertificate}
                label="Training"
                value={training.length}
                accentClass="border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/65"
              />

              <OverviewStat
                icon={HiOutlineUserGroup}
                label="References"
                value={references.length}
                accentClass="border-blue-300/20 bg-blue-500/[0.07] text-blue-700 dark:border-blue-300/[0.08] dark:bg-blue-300/[0.035] dark:text-blue-200/65"
              />
            </div>
          </div>
        </div>
      </Wrapper>

      {/* Education and experience */}
      <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-sky-500/[0.014] blur-[90px]" />

        <div className="relative z-10">
          <SectionHeader
            icon={HiOutlineAcademicCap}
            eyebrow="Career foundation"
            title="Education and Career Highlights"
            description="Academic qualifications and professional roles presented as a structured career journey."
            count={education.length + experience.length}
            accentClass="border-sky-300/20 bg-sky-500/[0.07] text-sky-700 dark:border-sky-300/[0.09] dark:bg-sky-300/[0.04] dark:text-sky-200/70"
          />

          <EducationAndExperience resume={resume} />
        </div>
      </Wrapper>

      {/* Enhanced Skills */}
      <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-cyan-500/[0.025] blur-[95px]" />

        <div className="pointer-events-none absolute -bottom-28 right-1/4 size-72 rounded-full bg-indigo-500/[0.018] blur-[110px]" />

        <div className="relative z-10">
          <SectionHeader
            icon={HiOutlineChartBar}
            eyebrow="Professional capabilities"
            title="Skills and Proficiencies"
            description="Technical and professional competencies presented with clear proficiency levels."
            count={skills.length}
            accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70"
          />

          <Skills resume={resume} />
        </div>
      </Wrapper>

      {/* Awards and achievements */}
      <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-24 -bottom-24 size-64 rounded-full bg-violet-500/[0.016] blur-[90px]" />

        <div className="relative z-10">
          <SectionHeader
            icon={HiOutlineTrophy}
            eyebrow="Recognition and impact"
            title="Awards and Accomplishments"
            description="Professional awards, personal achievements and important milestones."
            count={recognitionCount}
            accentClass="border-violet-300/20 bg-violet-500/[0.07] text-violet-700 dark:border-violet-300/[0.09] dark:bg-violet-300/[0.04] dark:text-violet-200/70"
          />

          <AchievementAndAward resume={resume} />
        </div>
      </Wrapper>

      {/* Training */}
      <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-emerald-500/[0.014] blur-[90px]" />

        <div className="relative z-10">
          <SectionHeader
            icon={PiCertificate}
            eyebrow="Continuous development"
            title="Workshops and Training"
            description="Professional development, courses, workshops and training programmes."
            count={training.length}
            accentClass="border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.09] dark:bg-emerald-300/[0.04] dark:text-emerald-200/70"
          />

          <Training resume={resume} />
        </div>
      </Wrapper>

      {/* References */}
      <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-blue-500/[0.014] blur-[90px]" />

        <div className="relative z-10">
          <SectionHeader
            icon={HiOutlineUserGroup}
            eyebrow="Professional network"
            title="Professional References"
            description="Trusted contacts who can validate professional experience and capabilities."
            count={references.length}
            accentClass="border-blue-300/20 bg-blue-500/[0.07] text-blue-700 dark:border-blue-300/[0.09] dark:bg-blue-300/[0.04] dark:text-blue-200/70"
          />

          <Reference resume={resume} />
        </div>
      </Wrapper>
    </motion.div>
  );
};

export const EducationAndExperience = ({ resume }) => {
  const education = getArray(resume?.education);

  const experience = getArray(resume?.experience);

  return (
    <motion.div variants={containerVariants} className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <TimelineColumn
        title="Educational Qualifications"
        description="Formal education and academic credentials."
        icon={FaGraduationCap}
        items={education}
        type="education"
        accentClass="border-sky-300/20 bg-sky-500/[0.07] text-sky-700 dark:border-sky-300/[0.08] dark:bg-sky-300/[0.035] dark:text-sky-200/65"
      />

      <TimelineColumn
        title="Career Journey"
        description="Professional roles and employment history."
        icon={FaBriefcase}
        items={experience}
        type="experience"
        accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65"
      />
    </motion.div>
  );
};

EducationAndExperience.propTypes = {
  resume: PropTypes.shape(resumePropTypes),
};

const SkillSummaryCard = ({ label, value, description, icon: Icon, accentClass }) => {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/75 bg-slate-50/45 p-3.5 dark:border-white/[0.055] dark:bg-white/[0.012]">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${accentClass}`}>
        <Icon size={16} />
      </span>

      <div className="min-w-0">
        <p className="truncate text-[7px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-white/20">{label}</p>

        <p className="mt-0.5 truncate text-[12px] font-black text-slate-900 dark:text-white/75">{value}</p>

        <p className="mt-0.5 truncate text-[8px] text-slate-400 dark:text-white/25">{description}</p>
      </div>
    </div>
  );
};

SkillSummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  accentClass: PropTypes.string.isRequired,
};

export const Skills = ({ resume }) => {
  const skills = getArray(resume?.skills);

  const skillSummary = useMemo(() => {
    if (skills.length === 0) {
      return {
        average: 0,
        advanced: 0,
        strongest: "Not available",
      };
    }

    const skillValues = skills.map((skill) => Math.min(Math.max(Number(skill?.progress) || 0, 0), 100));

    const total = skillValues.reduce((sum, value) => sum + value, 0);

    const strongestIndex = skillValues.indexOf(Math.max(...skillValues));

    return {
      average: Math.round(total / skillValues.length),
      advanced: skillValues.filter((value) => value >= 80).length,
      strongest: skills[strongestIndex]?.name || "Unnamed skill",
    };
  }, [skills]);

  if (skills.length === 0) {
    return <EmptyState icon={HiOutlineChartBar} title="No skills added" description="No technical or professional skills are available for this résumé." />;
  }

  return (
    <div>
      {/* Skills summary */}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <SkillSummaryCard
          label="Average level"
          value={`${skillSummary.average}%`}
          description="Across all listed skills"
          icon={HiOutlineChartBar}
          accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65"
        />

        <SkillSummaryCard
          label="Advanced skills"
          value={skillSummary.advanced}
          description="Skills rated 80% or higher"
          icon={HiOutlineCheckBadge}
          accentClass="border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/65"
        />

        <SkillSummaryCard
          label="Strongest capability"
          value={skillSummary.strongest}
          description="Highest proficiency score"
          icon={HiOutlineSparkles}
          accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65"
        />
      </div>

      {/* Skills cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {skills.map((skill, index) => {
          const theme = getStableTheme(skill?._id || skill?.name || `skill-${index}`, index);

          return (
            <motion.div key={skill?._id || `${skill?.name}-${index}`} variants={itemVariants}>
              <CircleProgressBar
                value={skill?.progress}
                name={skill?.name || "Unnamed skill"}
                pathColor={theme.primary}
                secondaryColor={theme.secondary}
                softColor={theme.soft}
                borderColor={theme.border}
                glowColor={theme.glow}
                index={index}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

Skills.propTypes = {
  resume: PropTypes.shape(resumePropTypes),
};

export const CircleProgressBar = ({ value, name, pathColor, secondaryColor, softColor, borderColor, glowColor, index = 0 }) => {
  const progress = Math.min(Math.max(Number(value) || 0, 0), 100);

  const proficiency = getProficiencyDetails(progress);

  const skillInitial = name?.trim()?.charAt(0)?.toUpperCase() || "S";

  return (
    <motion.article
      whileHover={{
        y: -5,
      }}
      className="group/skill relative h-full overflow-hidden rounded-[26px] border bg-white/55 p-4 transition-all duration-300 hover:shadow-[0_20px_44px_rgba(15,23,42,0.09)] dark:bg-white/[0.016] dark:hover:bg-white/[0.024]"
      style={{
        borderColor,
        backgroundImage: `linear-gradient(145deg, ${softColor}, transparent 45%)`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full blur-[65px] transition-opacity duration-500 group-hover/skill:opacity-100"
        style={{
          backgroundColor: glowColor,
        }}
      />

      <div
        className="absolute inset-x-6 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${pathColor}, transparent)`,
        }}
      />

      <div className="relative z-10">
        {/* Card top */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-xl border text-[11px] font-black"
              style={{
                color: pathColor,
                borderColor,
                backgroundColor: softColor,
              }}
            >
              {skillInitial}
            </span>

            <div className="min-w-0">
              <p className="text-[7px] font-semibold uppercase tracking-[0.11em] text-slate-400 dark:text-white/20">Skill {String(index + 1).padStart(2, "0")}</p>

              <h3 className="mt-0.5 truncate text-[10px] font-bold capitalize text-slate-800 dark:text-white/65">{name}</h3>
            </div>
          </div>

          <span
            className="shrink-0 rounded-full border px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.08em]"
            style={{
              color: pathColor,
              borderColor,
              backgroundColor: softColor,
            }}
          >
            {proficiency.label}
          </span>
        </div>

        {/* Gradient proficiency ring */}
        <div className="my-6 flex justify-center">
          <div
            className="relative flex size-32 items-center justify-center rounded-full p-[9px] shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.24)]"
            style={{
              background: `conic-gradient(
                from -90deg,
                ${pathColor} 0%,
                ${secondaryColor} ${progress}%,
                rgba(148, 163, 184, 0.13) ${progress}%,
                rgba(148, 163, 184, 0.13) 100%
              )`,
            }}
          >
            <div className="flex size-full flex-col items-center justify-center rounded-full border border-slate-200/70 bg-white shadow-inner dark:border-white/[0.06] dark:bg-[#171a20]">
              <p
                className="text-2xl font-black tabular-nums tracking-[-0.04em]"
                style={{
                  color: pathColor,
                }}
              >
                {progress}%
              </p>

              <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-white/20">Proficiency</p>
            </div>

            <span
              className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 rounded-full border-2 border-white shadow-md dark:border-[#171a20]"
              style={{
                backgroundColor: pathColor,
              }}
            />
          </div>
        </div>

        {/* Progress information */}
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/55 p-3.5 dark:border-white/[0.05] dark:bg-black/10">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <span className="text-[8px] font-semibold text-slate-500 dark:text-white/35">{proficiency.description}</span>

            <span
              className="text-[9px] font-black tabular-nums"
              style={{
                color: pathColor,
              }}
            >
              {progress}/100
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/[0.06]">
            <div
              className="h-full rounded-full transition-[width] duration-700"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(
                  90deg,
                  ${pathColor},
                  ${secondaryColor}
                )`,
              }}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

CircleProgressBar.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string.isRequired,
  pathColor: PropTypes.string,
  secondaryColor: PropTypes.string,
  softColor: PropTypes.string,
  borderColor: PropTypes.string,
  glowColor: PropTypes.string,
  index: PropTypes.number,
};

CircleProgressBar.defaultProps = {
  pathColor: "#22d3ee",
  secondaryColor: "#3b82f6",
  softColor: "rgba(34, 211, 238, 0.09)",
  borderColor: "rgba(34, 211, 238, 0.22)",
  glowColor: "rgba(34, 211, 238, 0.16)",
};

const RecognitionCard = ({ item, index, type }) => {
  const isAward = type === "award";

  const colour = useMemo(() => getStableTheme(item?._id || item?.title || `${type}-${index}`, index), [item?._id, item?.title, type, index]);

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{
        y: -3,
      }}
      className="rounded-[22px] border border-slate-200/75 bg-white/50 p-4 transition-all hover:border-slate-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.06)] dark:border-white/[0.055] dark:bg-white/[0.014] dark:hover:border-white/[0.09]"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border"
          style={{
            backgroundColor: colour.soft,
            borderColor: colour.border,
            color: colour.primary,
          }}
        >
          {isAward ? <FaAward size={16} /> : <FaTrophy size={15} />}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[7px] font-semibold uppercase tracking-[0.11em] text-slate-400 dark:text-white/20">{isAward ? "Professional award" : "Personal achievement"}</p>

          <h4 className="mt-1 text-[11px] font-bold capitalize leading-5 text-slate-800 dark:text-white/70">{item?.title || (isAward ? "Untitled award" : "Untitled achievement")}</h4>
        </div>
      </div>

      {isAward && (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200/75 bg-slate-50/55 p-3 dark:border-white/[0.055] dark:bg-white/[0.014]">
            <p className="text-[7px] font-semibold uppercase tracking-[0.09em] text-slate-400 dark:text-white/20">Organisation</p>

            <p className="mt-1 truncate text-[9px] font-semibold capitalize text-slate-600 dark:text-white/45">{item?.company || "Not provided"}</p>
          </div>

          <div className="rounded-xl border border-slate-200/75 bg-slate-50/55 p-3 dark:border-white/[0.055] dark:bg-white/[0.014]">
            <p className="text-[7px] font-semibold uppercase tracking-[0.09em] text-slate-400 dark:text-white/20">Received</p>

            <p className="mt-1 text-[9px] font-semibold text-slate-600 dark:text-white/45">
              <DateRange startDate={item?.receivedYear} singleDate />
            </p>
          </div>
        </div>
      )}

      {isAward && item?.city && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200/75 bg-slate-50/55 px-2.5 py-1.5 text-[8px] capitalize text-slate-500 dark:border-white/[0.055] dark:bg-white/[0.014] dark:text-white/30">
          <HiOutlineMapPin size={12} />
          {item.city}
        </div>
      )}

      <div className="mt-4 border-t border-slate-200/75 pt-4 dark:border-white/[0.055]">
        <DescriptionBlock content={item?.description} />
      </div>
    </motion.article>
  );
};

RecognitionCard.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["award", "achievement"]).isRequired,
};

const RecognitionColumn = ({ title, description, icon: Icon, items, type, accentClass }) => {
  return (
    <div className="rounded-[26px] border border-slate-200/75 bg-slate-50/30 p-4 dark:border-white/[0.05] dark:bg-white/[0.008] sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex size-10 items-center justify-center rounded-2xl border ${accentClass}`}>
            <Icon size={17} />
          </span>

          <div>
            <h3 className="text-[12px] font-bold text-slate-900 dark:text-white/75">{title}</h3>

            <p className="mt-1 text-[8px] text-slate-400 dark:text-white/25">{description}</p>
          </div>
        </div>

        <span className="rounded-full border border-slate-200/75 bg-white/55 px-2.5 py-1 text-[8px] font-semibold tabular-nums text-slate-500 dark:border-white/[0.055] dark:bg-white/[0.015] dark:text-white/30">
          {items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <motion.div variants={containerVariants} className="space-y-3">
          {items.map((item, index) => (
            <RecognitionCard key={item?._id || `${type}-${index}`} item={item} index={index} type={type} />
          ))}
        </motion.div>
      ) : (
        <EmptyState icon={Icon} title={`No ${title.toLowerCase()} added`} description="This résumé does not contain any entries in this section." />
      )}
    </div>
  );
};

RecognitionColumn.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.oneOf(["award", "achievement"]).isRequired,
  accentClass: PropTypes.string.isRequired,
};

export const AchievementAndAward = ({ resume }) => {
  const awards = getArray(resume?.award);

  const achievements = getArray(resume?.achievements);

  return (
    <motion.div variants={containerVariants} className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <RecognitionColumn
        title="Awards and Honours"
        description="Recognition received from organisations."
        icon={FaAward}
        items={awards}
        type="award"
        accentClass="border-amber-300/20 bg-amber-500/[0.07] text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.035] dark:text-amber-200/65"
      />

      <RecognitionColumn
        title="Achievements"
        description="Important personal and professional milestones."
        icon={FaTrophy}
        items={achievements}
        type="achievement"
        accentClass="border-violet-300/20 bg-violet-500/[0.07] text-violet-700 dark:border-violet-300/[0.08] dark:bg-violet-300/[0.035] dark:text-violet-200/65"
      />
    </motion.div>
  );
};

AchievementAndAward.propTypes = {
  resume: PropTypes.shape(resumePropTypes),
};

export const Training = ({ resume }) => {
  const training = getArray(resume?.training);

  if (training.length === 0) {
    return <EmptyState icon={PiCertificate} title="No training added" description="No workshops, courses or professional training programmes are available." />;
  }

  return (
    <motion.div variants={containerVariants} className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
      {training.map((item, index) => {
        const colour = getStableTheme(item?._id || item?.title || `training-${index}`, index);

        return (
          <motion.article
            key={item?._id || `training-${index}`}
            variants={itemVariants}
            whileHover={{
              y: -4,
            }}
            className="group/training relative overflow-hidden rounded-[24px] border border-slate-200/75 bg-white/50 p-5 transition-all hover:border-slate-300 hover:shadow-[0_16px_34px_rgba(15,23,42,0.07)] dark:border-white/[0.055] dark:bg-white/[0.014] dark:hover:border-white/[0.09]"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full blur-[60px]"
              style={{
                backgroundColor: colour.glow,
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-2xl border"
                  style={{
                    backgroundColor: colour.soft,
                    borderColor: colour.border,
                    color: colour.primary,
                  }}
                >
                  <PiCertificate size={20} />
                </span>

                <span className="rounded-full border border-slate-200/75 bg-slate-50/55 px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:border-white/[0.055] dark:bg-white/[0.014] dark:text-white/25">
                  Training
                </span>
              </div>

              <h3 className="mt-4 text-[12px] font-bold capitalize leading-5 text-slate-900 dark:text-white/75">{item?.title || "Untitled training"}</h3>

              <div className="mt-2 flex min-w-0 items-center gap-2 text-[9px] font-medium capitalize text-slate-500 dark:text-white/35">
                <HiOutlineBuildingOffice2 size={13} className="shrink-0" />

                <span className="truncate">{item?.company || "Provider not provided"}</span>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200/75 bg-slate-50/55 p-3 text-[8px] text-slate-500 dark:border-white/[0.055] dark:bg-white/[0.014] dark:text-white/30">
                <DateRange startDate={item?.startDate} endDate={item?.endDate} />
              </div>

              {item?.city && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-[8px] capitalize text-slate-400 dark:text-white/25">
                  <HiOutlineMapPin size={12} />
                  {item.city}
                </div>
              )}

              <div className="mt-4 border-t border-slate-200/75 pt-4 dark:border-white/[0.055]">
                <DescriptionBlock content={item?.description} />
              </div>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
};

Training.propTypes = {
  resume: PropTypes.shape(resumePropTypes),
};

const ReferenceContact = ({ icon: Icon, label, value, href }) => {
  const content = (
    <>
      <Icon size={13} className="shrink-0 text-slate-400 dark:text-white/25" />

      <div className="min-w-0">
        <p className="text-[7px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-white/20">{label}</p>

        <p className="mt-0.5 truncate text-[9px] font-medium text-slate-600 dark:text-white/45">{value || "Not provided"}</p>
      </div>
    </>
  );

  if (href && value) {
    return (
      <a
        href={href}
        target={label === "Website" ? "_blank" : undefined}
        rel={label === "Website" ? "noopener noreferrer" : undefined}
        className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-200/75 bg-slate-50/55 p-3 transition-all hover:border-blue-300/35 hover:text-blue-700 dark:border-white/[0.055] dark:bg-white/[0.014] dark:hover:border-blue-300/[0.12]"
      >
        {content}
      </a>
    );
  }

  return <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-200/75 bg-slate-50/55 p-3 dark:border-white/[0.055] dark:bg-white/[0.014]">{content}</div>;
};

ReferenceContact.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  href: PropTypes.string,
};

export const Reference = ({ resume }) => {
  const references = getArray(resume?.reference);

  if (references.length === 0) {
    return <EmptyState icon={FaUserFriends} title="No references added" description="No professional references are currently available for this résumé." />;
  }

  return (
    <motion.div variants={containerVariants} className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
      {references.map((item, index) => {
        const colour = getStableTheme(item?._id || item?.fullname || `reference-${index}`, index);

        const websiteUrl = safeUrl(item?.website);

        return (
          <motion.article
            key={item?._id || `reference-${index}`}
            variants={itemVariants}
            whileHover={{
              y: -4,
            }}
            className="group/reference relative overflow-hidden rounded-[24px] border border-slate-200/75 bg-white/50 p-5 transition-all hover:border-slate-300 hover:shadow-[0_16px_34px_rgba(15,23,42,0.07)] dark:border-white/[0.055] dark:bg-white/[0.014] dark:hover:border-white/[0.09]"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full blur-[60px]"
              style={{
                backgroundColor: colour.glow,
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start gap-3">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl border text-sm font-black uppercase"
                  style={{
                    backgroundColor: colour.soft,
                    borderColor: colour.border,
                    color: colour.primary,
                  }}
                >
                  {item?.fullname?.trim()?.charAt(0)?.toUpperCase() || "R"}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[7px] font-semibold uppercase tracking-[0.11em] text-slate-400 dark:text-white/20">Professional reference</p>

                  <h3 className="mt-1 truncate text-[12px] font-bold capitalize text-slate-900 dark:text-white/75">{item?.fullname || "Unnamed reference"}</h3>

                  <p className="mt-1 truncate text-[9px] font-medium capitalize text-slate-500 dark:text-white/35">{item?.designation || "Designation not provided"}</p>
                </div>

                <RiDoubleQuotesL className="shrink-0 text-xl text-slate-200 dark:text-white/[0.07]" />
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200/75 bg-slate-50/55 p-3 dark:border-white/[0.055] dark:bg-white/[0.014]">
                <HiOutlineBuildingOffice2 className="shrink-0 text-slate-400 dark:text-white/25" />

                <p className="truncate text-[9px] font-semibold capitalize text-slate-600 dark:text-white/45">{item?.company || "Company not provided"}</p>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <ReferenceContact icon={HiOutlineEnvelope} label="Email" value={item?.email} href={item?.email ? `mailto:${item.email}` : undefined} />

                <ReferenceContact icon={HiOutlinePhone} label="Phone" value={item?.phone} href={item?.phone ? `tel:${item.phone}` : undefined} />
              </div>

              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-blue-300/20 bg-blue-500/[0.05] p-3 text-blue-700 transition-all hover:bg-blue-500/[0.1] dark:border-blue-300/[0.08] dark:bg-blue-300/[0.03] dark:text-blue-200/65 dark:hover:bg-blue-300/[0.06]"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <HiOutlineGlobeAlt size={14} className="shrink-0" />

                    <span className="truncate text-[9px] font-medium">{new URL(websiteUrl).hostname.replace(/^www\./, "")}</span>
                  </div>

                  <HiOutlineArrowTopRightOnSquare size={13} className="shrink-0" />
                </a>
              )}
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
};

Reference.propTypes = {
  resume: PropTypes.shape(resumePropTypes),
};
