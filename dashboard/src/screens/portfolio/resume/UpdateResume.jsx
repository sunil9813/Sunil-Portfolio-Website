import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { FaAward, FaBriefcase, FaChalkboardTeacher, FaCode, FaGraduationCap, FaTrophy, FaUserFriends } from "react-icons/fa";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineCheck,
  HiOutlineCheckBadge,
  HiOutlineDocumentCheck,
  HiOutlineExclamationTriangle,
  HiOutlinePencilSquare,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { RiDragDropFill } from "react-icons/ri";

import { getResume, updateResume } from "@/redux/slices/portfolio/resumeSlice";
import { GhostButton, HeadingTwo, StickyHeader, TertiaryButton, Wrapper } from "@/routes";

import { AchievementsStep, AwardStep, EducationStep, ExperienceStep, ReferenceStep, SkillsStep, TrainingStep, UseColorManager } from "./CreateResume";

const SECTION_KEYS = ["education", "experience", "skills", "achievements", "training", "award", "reference"];

const INITIAL_DELETED_IDS = {
  education: [],
  experience: [],
  skills: [],
  achievements: [],
  training: [],
  award: [],
  reference: [],
};

const createEmptyEntry = (fieldName) => {
  const entries = {
    education: {
      id: uuidv4(),
      school: "",
      degree: "",
      university: "",
      city: "",
      startDate: "",
      endDate: "",
      description: "",
    },

    experience: {
      id: uuidv4(),
      company: "",
      position: "",
      city: "",
      description: "",
      startDate: "",
      endDate: "",
    },

    skills: {
      id: uuidv4(),
      name: "",
      progress: "",
    },

    achievements: {
      id: uuidv4(),
      title: "",
      description: "",
    },

    training: {
      id: uuidv4(),
      title: "",
      company: "",
      city: "",
      description: "",
      startDate: "",
      endDate: "",
    },

    award: {
      id: uuidv4(),
      title: "",
      company: "",
      city: "",
      description: "",
      receivedYear: "",
    },

    reference: {
      id: uuidv4(),
      fullname: "",
      company: "",
      designation: "",
      phone: "",
      email: "",
      website: "",
    },
  };

  return entries[fieldName];
};

const createInitialFormData = () => ({
  education: [],
  experience: [],
  skills: [],
  achievements: [],
  training: [],
  award: [],
  reference: [],
});

const getArray = (value) => (Array.isArray(value) ? value : []);

const normaliseResumeEntry = (item, fieldName) => {
  const normalisedEntry = {
    ...item,
    id: uuidv4(),
  };

  if (fieldName === "award") {
    normalisedEntry.receivedYear = item?.receivedYear || item?.recievedYear || "";
  }

  return normalisedEntry;
};

const normaliseResumeSection = (items, fieldName) => {
  const normalisedItems = getArray(items).map((item) => normaliseResumeEntry(item, fieldName));

  return normalisedItems.length > 0 ? normalisedItems : [createEmptyEntry(fieldName)];
};

const hasMeaningfulValue = (entry) => {
  return Object.entries(entry).some(([key, value]) => {
    if (key === "id" || key === "_id") {
      return false;
    }

    if (value === null || value === undefined) {
      return false;
    }

    const stringValue = String(value)
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim();

    return stringValue !== "";
  });
};

const getErrorMessage = (error, fallback = "Failed to update resume.") => {
  if (typeof error === "string") {
    return error;
  }

  return error?.response?.data?.error || error?.response?.data?.message || error?.data?.error || error?.data?.message || error?.message || error?.error || fallback;
};

/*
 * Kept as an export so any existing imports remain compatible.
 * The enhanced CreateResume step components use their own sortable card.
 */
export const SortableItem = ({ id, children, section }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const { getColorForId } = UseColorManager();

  const colors = getColorForId(section, id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.45 : 1,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    boxShadow: isDragging ? "0 24px 65px rgba(0, 0, 0, 0.28)" : undefined,
  };

  const dragHandleProps = {
    ...attributes,
    ...listeners,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-[24px] border p-4 pt-14 transition-all duration-300 sm:p-5 sm:pt-14 ${
        isDragging ? "shadow-2xl" : "shadow-[0_12px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_40px_rgba(15,23,42,0.07)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.14)]"
      }`}
    >
      <div className="pointer-events-none absolute left-4 top-4 inline-flex h-7 items-center gap-2 rounded-lg border border-gray-200/70 bg-white/55 px-2.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-gray-500 dark:border-white/[0.06] dark:bg-black/15 dark:text-white/30">
        <RiDragDropFill size={12} />
        Resume entry
      </div>

      {children({
        dragHandleProps,
        colors,
      })}
    </div>
  );
};

SortableItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
};

const LoadingState = () => {
  return (
    <div className="space-y-3 pb-8">
      <Wrapper className="p-5 sm:p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-[20px] bg-gray-200 dark:bg-white/[0.04]" />

            <div className="flex-1">
              <div className="h-3 w-32 rounded bg-gray-200 dark:bg-white/[0.035]" />

              <div className="mt-3 h-7 w-56 rounded-lg bg-gray-200 dark:bg-white/[0.04]" />

              <div className="mt-3 h-3 max-w-xl rounded bg-gray-200 dark:bg-white/[0.035]" />
            </div>
          </div>
        </div>
      </Wrapper>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[260px_minmax(0,1fr)]">
        <Wrapper className="p-4">
          <div className="space-y-2 animate-pulse">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="h-14 rounded-2xl bg-gray-200 dark:bg-white/[0.035]" />
            ))}
          </div>
        </Wrapper>

        <Wrapper className="p-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-14 w-72 rounded-2xl bg-gray-200 dark:bg-white/[0.04]" />

            <div className="mt-6 grid grid-cols-1 gap-4 2xl:grid-cols-2">
              <div className="h-96 rounded-[24px] bg-gray-200 dark:bg-white/[0.035]" />

              <div className="h-96 rounded-[24px] bg-gray-200 dark:bg-white/[0.035]" />
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
};

const ErrorState = ({ message, onRetry, onCancel }) => {
  return (
    <Wrapper className="relative flex min-h-[430px] items-center justify-center overflow-hidden p-6 text-center">
      <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-amber-500/[0.025] blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-indigo-500/[0.018] blur-[100px]" />

      <div className="relative z-10 max-w-lg">
        <span className="mx-auto flex size-16 items-center justify-center rounded-[22px] border border-amber-300/20 bg-amber-500/[0.07] text-amber-600 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70">
          <HiOutlineExclamationTriangle size={28} />
        </span>

        <h2 className="mt-5 text-lg font-black tracking-[-0.02em] text-gray-900 dark:text-white/90">Unable to load resume</h2>

        <p className="mt-2 text-[10px] leading-5 text-gray-500 dark:text-white/35">{message}</p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200/80 bg-white/55 px-4 text-[9px] font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-300 dark:border-white/[0.06] dark:bg-white/[0.018] dark:text-white/45 dark:hover:border-white/[0.1]"
          >
            <HiOutlineArrowLeft size={14} />
            Back to resumes
          </button>

          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-indigo-300/25 bg-indigo-500/[0.08] px-4 text-[9px] font-semibold text-indigo-700 transition-all hover:-translate-y-0.5 hover:bg-indigo-500/[0.14] dark:border-indigo-300/[0.1] dark:bg-indigo-300/[0.045] dark:text-indigo-200/70 dark:hover:bg-indigo-300/[0.08]"
          >
            Try again
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

ErrorState.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const NavigationStep = ({ step, index, currentStep, entryCount, onSelect }) => {
  const StepIcon = step.icon;

  const isCurrent = index === currentStep;

  const isCompleted = index < currentStep;

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-current={isCurrent ? "step" : undefined}
      className={`group/step relative flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-300 ${
        isCurrent
          ? "border-indigo-300/30 bg-indigo-500/[0.07] shadow-[0_12px_26px_rgba(79,70,229,0.08)] dark:border-indigo-300/[0.12] dark:bg-indigo-300/[0.045]"
          : isCompleted
            ? "border-emerald-300/20 bg-emerald-500/[0.04] dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.025]"
            : "border-gray-200/70 bg-gray-50/40 hover:border-indigo-300/30 hover:bg-indigo-500/[0.025] dark:border-white/[0.05] dark:bg-white/[0.012] dark:hover:border-indigo-300/[0.1] dark:hover:bg-indigo-300/[0.02]"
      }`}
    >
      {isCurrent && <span className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-indigo-500 dark:bg-indigo-300/70" />}

      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
          isCurrent
            ? "border-indigo-300/25 bg-indigo-500/[0.1] text-indigo-700 dark:border-indigo-300/[0.1] dark:bg-indigo-300/[0.06] dark:text-indigo-200/75"
            : isCompleted
              ? "border-emerald-300/25 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-300/[0.1] dark:bg-emerald-300/[0.05] dark:text-emerald-200/70"
              : "border-gray-200/70 bg-white/55 text-gray-400 group-hover/step:text-indigo-600 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/25 dark:group-hover/step:text-indigo-200/65"
        }`}
      >
        {isCompleted ? <HiOutlineCheck size={16} /> : <StepIcon size={15} />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate text-[10px] font-semibold ${
              isCurrent ? "text-gray-900 dark:text-white/80" : isCompleted ? "text-emerald-700 dark:text-emerald-200/65" : "text-gray-600 dark:text-white/40"
            }`}
          >
            {step.name}
          </p>

          <span className="shrink-0 rounded-full border border-gray-200/70 bg-white/55 px-2 py-0.5 text-[7px] font-semibold tabular-nums text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/25">
            {entryCount}
          </span>
        </div>

        <p className="mt-1 text-[7px] font-medium uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">Section {index + 1}</p>
      </div>
    </button>
  );
};

NavigationStep.propTypes = {
  step: PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  currentStep: PropTypes.number.isRequired,
  entryCount: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export const UpdateResume = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { resume, loading, isLoading, error } = useSelector((state) => state.resume);

  const fetchLoading = Boolean(loading || isLoading);

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState(createInitialFormData);

  const [deletedIds, setDeletedIds] = useState(INITIAL_DELETED_IDS);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hasLoaded, setHasLoaded] = useState(false);

  const [localError, setLocalError] = useState("");

  const steps = useMemo(
    () => [
      {
        key: "education",
        name: "Education",
        icon: FaGraduationCap,
        component: EducationStep,
        description: "Academic qualifications and institutions.",
      },
      {
        key: "experience",
        name: "Experience",
        icon: FaBriefcase,
        component: ExperienceStep,
        description: "Professional roles and employment history.",
      },
      {
        key: "skills",
        name: "Skills",
        icon: FaCode,
        component: SkillsStep,
        description: "Technical and professional capabilities.",
      },
      {
        key: "achievements",
        name: "Achievements",
        icon: FaTrophy,
        component: AchievementsStep,
        description: "Important personal and career milestones.",
      },
      {
        key: "training",
        name: "Training",
        icon: FaChalkboardTeacher,
        component: TrainingStep,
        description: "Courses, workshops and development.",
      },
      {
        key: "award",
        name: "Awards",
        icon: FaAward,
        component: AwardStep,
        description: "Awards, honours and recognition.",
      },
      {
        key: "reference",
        name: "References",
        icon: FaUserFriends,
        component: ReferenceStep,
        description: "Trusted professional contacts.",
      },
    ],
    [],
  );

  const currentStepData = steps[currentStep];

  const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100);

  const isFirstStep = currentStep === 0;

  const isLastStep = currentStep === steps.length - 1;

  const totalEntries = useMemo(() => SECTION_KEYS.reduce((total, key) => total + getArray(formData[key]).length, 0), [formData]);

  const totalDeleted = useMemo(() => SECTION_KEYS.reduce((total, key) => total + getArray(deletedIds[key]).length, 0), [deletedIds]);

  const loadResume = async () => {
    if (!id) {
      setLocalError("Resume ID is missing.");
      setHasLoaded(true);
      return;
    }

    try {
      setHasLoaded(false);
      setLocalError("");

      const request = dispatch(getResume(id));

      if (typeof request?.unwrap === "function") {
        await request.unwrap();
      } else {
        await request;
      }
    } catch (requestError) {
      setLocalError(getErrorMessage(requestError, "Unable to load the resume."));
    } finally {
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    loadResume();
  }, [dispatch, id]);

  useEffect(() => {
    if (!resume || Object.keys(resume).length === 0) {
      return;
    }

    if (resume?._id && id && String(resume._id) !== String(id)) {
      return;
    }

    setFormData({
      education: normaliseResumeSection(resume?.education, "education"),

      experience: normaliseResumeSection(resume?.experience, "experience"),

      skills: normaliseResumeSection(resume?.skills, "skills"),

      achievements: normaliseResumeSection(resume?.achievements, "achievements"),

      training: normaliseResumeSection(resume?.training, "training"),

      award: normaliseResumeSection(resume?.award, "award"),

      reference: normaliseResumeSection(resume?.reference, "reference"),
    });

    setDeletedIds(INITIAL_DELETED_IDS);
  }, [resume, id]);

  const handleInputChange = (fieldName, indexOrItems, field, value) => {
    setFormData((previousData) => {
      if (Array.isArray(indexOrItems)) {
        return {
          ...previousData,
          [fieldName]: indexOrItems,
        };
      }

      const updatedEntries = [...previousData[fieldName]];

      updatedEntries[indexOrItems] = {
        ...updatedEntries[indexOrItems],
        [field]: value,
      };

      return {
        ...previousData,
        [fieldName]: updatedEntries,
      };
    });
  };

  const addEntry = (fieldName) => {
    const newEntry = createEmptyEntry(fieldName);

    if (!newEntry) {
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: [...previousData[fieldName], newEntry],
    }));
  };

  const removeEntry = (fieldName, index) => {
    setFormData((previousData) => {
      const entry = previousData[fieldName][index];

      if (entry?._id) {
        setDeletedIds((previousDeletedIds) => ({
          ...previousDeletedIds,
          [fieldName]: Array.from(new Set([...previousDeletedIds[fieldName], entry._id])),
        }));
      }

      return {
        ...previousData,
        [fieldName]: previousData[fieldName].filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  const createPayload = () => {
    const payload = {
      deletedIds: {
        ...deletedIds,
      },
    };

    SECTION_KEYS.forEach((fieldName) => {
      payload[fieldName] = getArray(formData[fieldName])
        .filter(hasMeaningfulValue)
        .map((entry) => {
          const { id: _clientId, receivedYear, ...rest } = entry;

          if (fieldName === "award") {
            const { recievedYear: existingReceivedYear, ...awardData } = rest;

            return {
              ...awardData,
              ...(rest?._id ? { _id: rest._id } : {}),
              recievedYear: receivedYear || existingReceivedYear || "",
            };
          }

          return {
            ...rest,
            ...(rest?._id ? { _id: rest._id } : {}),
          };
        });
    });

    return payload;
  };

  const handleSubmit = async () => {
    if (isSubmitting || !id) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = createPayload();

      await dispatch(
        updateResume({
          id,
          data: payload,
        }),
      ).unwrap();

      toast.success("Resume updated successfully.");

      navigate("/resume");
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((previousStep) => Math.min(previousStep + 1, steps.length - 1));
  };

  const previousStep = () => {
    setCurrentStep((previousStep) => Math.max(previousStep - 1, 0));
  };

  const goToStep = (index) => {
    setCurrentStep(index);
  };

  const renderCurrentStep = () => {
    if (!currentStepData) {
      return null;
    }

    const StepComponent = currentStepData.component;

    return <StepComponent fields={formData[currentStepData.key] || []} handleInputChange={handleInputChange} addEntry={addEntry} removeEntry={removeEntry} />;
  };

  const displayedError = localError || (typeof error === "string" ? error : error?.message || "");

  if (!hasLoaded || fetchLoading) {
    return <LoadingState />;
  }

  if (displayedError) {
    return <ErrorState message={displayedError} onRetry={loadResume} onCancel={() => navigate("/resume")} />;
  }

  return (
    <>
      <StickyHeader>
        <div>
          <HeadingTwo>Update Resume</HeadingTwo>

          <p className="mt-1 hidden text-[9px] text-gray-400 dark:text-white/25 sm:block">Review and refine each section of your professional resume.</p>
        </div>

        <div className="flex items-center gap-2">
          <GhostButton type="button" disabled={isSubmitting} onClick={() => navigate("/resume")}>
            Cancel
          </GhostButton>

          <TertiaryButton type="button" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Updating..." : "Update Resume"}
          </TertiaryButton>
        </div>
      </StickyHeader>

      <section className="space-y-3 pb-8">
        {/* Editing overview */}
        <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-indigo-500/[0.022] blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-cyan-500/[0.016] blur-[100px]" />

          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-[20px] border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 shadow-[0_12px_30px_rgba(79,70,229,0.08)] dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                <HiOutlinePencilSquare size={24} />
              </span>

              <div className="min-w-0">
                <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-200/50">Resume editing studio</p>

                <h1 className="mt-1 text-2xl font-black tracking-[-0.035em] text-gray-950 dark:text-white/90 sm:text-3xl">Refine Your Career Profile</h1>

                <p className="mt-2 max-w-2xl text-[10px] leading-5 text-gray-500 dark:text-white/35">
                  Update qualifications, experience, skills, achievements, training, awards and professional references.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="flex min-w-[145px] items-center gap-3 rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.05] p-3.5 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.03]">
                <span className="flex size-10 items-center justify-center rounded-xl border border-indigo-300/20 bg-indigo-500/[0.08] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.045] dark:text-indigo-200/70">
                  <HiOutlineDocumentCheck size={17} />
                </span>

                <div>
                  <p className="text-base font-black tabular-nums text-gray-900 dark:text-white/80">{totalEntries}</p>

                  <p className="text-[7px] font-semibold uppercase tracking-[0.09em] text-gray-400 dark:text-white/20">Current entries</p>
                </div>
              </div>

              <div className="flex min-w-[145px] items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-500/[0.045] p-3.5 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.028]">
                <span className="flex size-10 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.04] dark:text-emerald-200/70">
                  <HiOutlineCheckBadge size={17} />
                </span>

                <div>
                  <p className="text-base font-black tabular-nums text-gray-900 dark:text-white/80">{progressPercentage}%</p>

                  <p className="text-[7px] font-semibold uppercase tracking-[0.09em] text-gray-400 dark:text-white/20">Editing progress</p>
                </div>
              </div>

              <div className="col-span-2 flex min-w-[145px] items-center gap-3 rounded-2xl border border-amber-300/20 bg-amber-500/[0.045] p-3.5 sm:col-span-1 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.028]">
                <span className="flex size-10 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-500/[0.07] text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.04] dark:text-amber-200/70">
                  <HiOutlineSparkles size={17} />
                </span>

                <div>
                  <p className="text-base font-black tabular-nums text-gray-900 dark:text-white/80">{totalDeleted}</p>

                  <p className="text-[7px] font-semibold uppercase tracking-[0.09em] text-gray-400 dark:text-white/20">Pending removals</p>
                </div>
              </div>
            </div>
          </div>
        </Wrapper>

        {/* Editing workspace */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[265px_minmax(0,1fr)]">
          {/* Section navigator */}
          <Wrapper className="relative overflow-hidden p-3 xl:sticky xl:top-24 xl:self-start">
            <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-indigo-500/[0.016] blur-[85px]" />

            <div className="relative z-10">
              <div className="border-b border-gray-200/70 px-2 pb-4 pt-1 dark:border-white/[0.05]">
                <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-200/50">Resume sections</p>

                <h2 className="mt-1 text-sm font-black tracking-[-0.02em] text-gray-900 dark:text-white/85">Editing Workflow</h2>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/[0.055]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 transition-[width] duration-500"
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-[8px] font-medium text-gray-400 dark:text-white/25">
                    Step {currentStep + 1} of {steps.length}
                  </span>

                  <span className="text-[8px] font-bold tabular-nums text-indigo-600 dark:text-indigo-200/65">{progressPercentage}%</span>
                </div>
              </div>

              <nav aria-label="Resume editing sections" className="mt-3 space-y-2">
                {steps.map((step, index) => (
                  <NavigationStep key={step.key} step={step} index={index} currentStep={currentStep} entryCount={formData[step.key]?.length || 0} onSelect={goToStep} />
                ))}
              </nav>

              <div className="mt-3 rounded-2xl border border-gray-200/70 bg-gray-50/40 p-3 dark:border-white/[0.05] dark:bg-white/[0.012]">
                <div className="flex items-start gap-2.5">
                  <HiOutlineSparkles className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-200/60" />

                  <p className="text-[8px] leading-4 text-gray-400 dark:text-white/25">Select any section to edit it. Drag entries to change their display order.</p>
                </div>
              </div>
            </div>
          </Wrapper>

          {/* Active editor */}
          <Wrapper className="relative min-w-0 overflow-hidden p-4 sm:p-6">
            <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-indigo-500/[0.014] blur-[100px]" />

            <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-cyan-500/[0.01] blur-[100px]" />

            <div className="relative z-10">
              <header className="mb-6 flex flex-col gap-4 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-200/50">Active section</p>

                  <h2 className="mt-1 text-xl font-black tracking-[-0.03em] text-gray-950 dark:text-white/90">{currentStepData?.name}</h2>

                  <p className="mt-1 text-[9px] text-gray-400 dark:text-white/25">{currentStepData?.description}</p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200/70 bg-gray-50/55 px-3 py-1.5 text-[8px] font-semibold text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/30">
                  <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300/70" />
                  {formData[currentStepData?.key]?.length || 0} {(formData[currentStepData?.key]?.length || 0) === 1 ? "entry" : "entries"}
                </div>
              </header>

              {renderCurrentStep()}

              <footer className="mt-7 flex flex-col gap-4 border-t border-gray-200/70 pt-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-gray-200/70 bg-gray-50/50 text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.016] dark:text-white/25">
                    <HiOutlineDocumentCheck size={17} />
                  </span>

                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Editing section</p>

                    <p className="mt-0.5 text-[10px] font-semibold text-gray-700 dark:text-white/55">{currentStepData?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={previousStep}
                    disabled={isFirstStep}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200/80 bg-white/55 px-4 text-[9px] font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-indigo-300/35 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 dark:border-white/[0.06] dark:bg-white/[0.018] dark:text-white/45 dark:hover:border-indigo-300/[0.12] dark:hover:text-indigo-200/70"
                  >
                    <HiOutlineArrowLeft size={14} />
                    Previous
                  </button>

                  {isLastStep ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-500/[0.08] px-4 text-[9px] font-semibold text-emerald-700 transition-all hover:-translate-y-0.5 hover:bg-emerald-500/[0.14] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 dark:border-emerald-300/[0.1] dark:bg-emerald-300/[0.045] dark:text-emerald-200/70 dark:hover:bg-emerald-300/[0.08]"
                    >
                      <HiOutlineCheckBadge size={14} />

                      {isSubmitting ? "Updating..." : "Save Resume"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-indigo-300/25 bg-indigo-500/[0.08] px-4 text-[9px] font-semibold text-indigo-700 transition-all hover:-translate-y-0.5 hover:bg-indigo-500/[0.14] dark:border-indigo-300/[0.1] dark:bg-indigo-300/[0.045] dark:text-indigo-200/70 dark:hover:bg-indigo-300/[0.08]"
                    >
                      Next section
                      <HiOutlineArrowRight size={14} />
                    </button>
                  )}
                </div>
              </footer>
            </div>
          </Wrapper>
        </div>
      </section>
    </>
  );
};
