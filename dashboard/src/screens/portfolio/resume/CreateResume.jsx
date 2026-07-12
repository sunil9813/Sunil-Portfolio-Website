import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";

import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { restrictToFirstScrollableAncestor, restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import { FaAward, FaBriefcase, FaChalkboardTeacher, FaCode, FaGraduationCap, FaTrophy, FaUser, FaUserFriends } from "react-icons/fa";
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineCheck, HiOutlineDocumentText, HiOutlineSparkles } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { RiDragDropFill } from "react-icons/ri";

import { CommentEditor } from "@/components/comment/CommentEditor";
import { createResume } from "@/redux/slices/portfolio/resumeSlice";
import { GhostButton, HeadingTwo, InputForResume, InputLabel, InputTitle, StickyHeader, TertiaryButton, Wrapper } from "@/routes";

import "react-datepicker/dist/react-datepicker.css";

const DATE_INPUT_CLASS =
  "h-11 w-full rounded-xl border border-gray-200/80 bg-gray-50/55 px-3 text-[10px] text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-500/[0.04] dark:border-white/[0.06] dark:bg-white/[0.018] dark:text-white/65 dark:placeholder:text-white/20 dark:focus:border-indigo-300/[0.14] 3xl:h-12";

const SECTION_CONFIG = {
  education: {
    title: "Qualification History",
    description: "Add your schools, degrees, universities and study periods.",
    addLabel: "Add Education",
    icon: FaGraduationCap,
    gridClass: "grid grid-cols-1 gap-4 2xl:grid-cols-2",
    accent: "border-sky-300/20 bg-sky-500/[0.07] text-sky-700 dark:border-sky-300/[0.09] dark:bg-sky-300/[0.04] dark:text-sky-200/70",
  },
  experience: {
    title: "Work Experience",
    description: "Describe your professional positions, organisations and responsibilities.",
    addLabel: "Add Experience",
    icon: FaBriefcase,
    gridClass: "grid grid-cols-1 gap-4 2xl:grid-cols-2",
    accent: "border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70",
  },
  skills: {
    title: "Skills & Proficiencies",
    description: "List your strongest technical and professional capabilities.",
    addLabel: "Add Skill",
    icon: FaCode,
    gridClass: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4",
    accent: "border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70",
  },
  achievements: {
    title: "Achievements",
    description: "Highlight important accomplishments and professional milestones.",
    addLabel: "Add Achievement",
    icon: FaTrophy,
    gridClass: "grid grid-cols-1 gap-4 xl:grid-cols-2 3xl:grid-cols-3",
    accent: "border-violet-300/20 bg-violet-500/[0.07] text-violet-700 dark:border-violet-300/[0.09] dark:bg-violet-300/[0.04] dark:text-violet-200/70",
  },
  training: {
    title: "Training History",
    description: "Record workshops, professional training and development programmes.",
    addLabel: "Add Training",
    icon: FaChalkboardTeacher,
    gridClass: "grid grid-cols-1 gap-4 2xl:grid-cols-2",
    accent: "border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.09] dark:bg-emerald-300/[0.04] dark:text-emerald-200/70",
  },
  award: {
    title: "Awards & Honours",
    description: "Add awards, recognition and honours received during your career.",
    addLabel: "Add Award",
    icon: FaAward,
    gridClass: "grid grid-cols-1 gap-4 2xl:grid-cols-2",
    accent: "border-amber-300/20 bg-amber-500/[0.07] text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70",
  },
  reference: {
    title: "Professional References",
    description: "Add trusted professional contacts who can verify your experience.",
    addLabel: "Add Reference",
    icon: FaUserFriends,
    gridClass: "grid grid-cols-1 gap-4 2xl:grid-cols-2",
    accent: "border-rose-300/20 bg-rose-500/[0.07] text-rose-700 dark:border-rose-300/[0.09] dark:bg-rose-300/[0.04] dark:text-rose-200/70",
  },
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

const readEditorValue = (valueOrEvent) => {
  if (typeof valueOrEvent === "string") {
    return valueOrEvent;
  }

  return valueOrEvent?.target?.value || "";
};

const getErrorMessage = (error) => {
  if (typeof error === "string") {
    return error;
  }

  return error?.response?.data?.error || error?.data?.error || error?.message || error?.error || "Failed to create resume.";
};

const createStableColor = (section, id) => {
  const value = `${section}-${id}`;

  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;

  return {
    bg: `hsla(${hue}, 76%, 55%, 0.045)`,
    border: `hsla(${hue}, 76%, 62%, 0.18)`,
    text: `hsl(${hue}, 72%, 60%)`,
    h: hue,
  };
};

/*
 * Preserved export for compatibility with any existing imports.
 * Colours are deterministic, so they no longer change during re-renders.
 */
export const UseColorManager = () => {
  const getColorForId = (section, id) => createStableColor(section, id);

  return { getColorForId };
};

const ResumeTextField = ({ label, type = "text", value, placeholder, required = false, min, max, onChange }) => {
  return (
    <div>
      <InputLabel className="mb-2">{label}</InputLabel>

      <InputForResume
        type={type}
        value={value || ""}
        handleChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="!rounded-xl dark:!border-white/[0.06] dark:!bg-white/[0.018]"
      />
    </div>
  );
};

ResumeTextField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};

const ResumeDateField = ({ label, value, placeholder, onChange }) => {
  return (
    <div className="min-w-0">
      <InputLabel className="mb-2">{label}</InputLabel>

      <DatePicker
        className={DATE_INPUT_CLASS}
        selected={value ? new Date(value) : null}
        onChange={(date) => onChange(date ? date.toISOString() : "")}
        dateFormat="yyyy-MM-dd"
        placeholderText={placeholder}
      />
    </div>
  );
};

ResumeDateField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const ResumeEditorField = ({ label, value, placeholder, onChange }) => {
  return (
    <div>
      <InputLabel className="mb-2">{label}</InputLabel>

      <div className="overflow-hidden rounded-2xl border border-gray-200/75 bg-gray-50/40 p-1 dark:border-white/[0.055] dark:bg-white/[0.012]">
        <CommentEditor type="default" value={value || ""} placeholder={placeholder} handleChange={(valueOrEvent) => onChange(readEditorValue(valueOrEvent))} />
      </div>
    </div>
  );
};

ResumeEditorField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const CardActions = ({ dragHandleProps, onRemove }) => {
  return (
    <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5">
      <button
        type="button"
        {...dragHandleProps}
        title="Drag to reorder"
        aria-label="Drag to reorder"
        className="flex size-8 touch-none items-center justify-center rounded-xl border border-gray-200/75 bg-white/70 text-gray-400 shadow-sm backdrop-blur-md transition-all hover:border-indigo-300/35 hover:text-indigo-600 dark:border-white/[0.06] dark:bg-black/20 dark:text-white/30 dark:hover:border-indigo-300/[0.14] dark:hover:text-indigo-200/70"
      >
        <RiDragDropFill size={15} />
      </button>

      <button
        type="button"
        onClick={onRemove}
        title="Remove item"
        aria-label="Remove item"
        className="flex size-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/[0.07] text-rose-600 transition-all hover:bg-rose-500/[0.14] dark:border-rose-300/[0.08] dark:bg-rose-300/[0.035] dark:text-rose-200/65 dark:hover:bg-rose-300/[0.07]"
      >
        <IoCloseOutline size={19} />
      </button>
    </div>
  );
};

CardActions.propTypes = {
  dragHandleProps: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export const SortableItem = ({ id, children, section }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const colors = useMemo(() => createStableColor(section, id), [section, id]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.48 : 1,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    boxShadow: isDragging ? "0 24px 60px rgba(0, 0, 0, 0.28)" : undefined,
  };

  const dragHandleProps = {
    ...attributes,
    ...listeners,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/card relative rounded-[24px] border p-4 pt-14 transition-shadow duration-300 sm:p-5 sm:pt-14 ${
        isDragging ? "shadow-2xl" : "shadow-[0_12px_30px_rgba(15,23,42,0.035)] hover:shadow-[0_18px_38px_rgba(15,23,42,0.065)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.12)]"
      }`}
    >
      <span
        className="pointer-events-none absolute left-4 top-4 flex h-7 items-center rounded-lg border px-2.5 text-[7px] font-semibold uppercase tracking-[0.1em]"
        style={{
          color: colors.text,
          borderColor: colors.border,
          backgroundColor: colors.bg,
        }}
      >
        Resume entry
      </span>

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

const StepHeading = ({ config, itemCount }) => {
  const Icon = config.icon;

  return (
    <div className="mb-5 flex flex-col gap-4 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border ${config.accent}`}>
          <Icon size={19} />
        </span>

        <div>
          <InputTitle className="mb-1">{config.title}</InputTitle>

          <p className="max-w-xl text-[9px] leading-4 text-gray-400 dark:text-white/25">{config.description}</p>
        </div>
      </div>

      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200/70 bg-gray-50/55 px-3 py-1.5 text-[8px] font-semibold text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/30">
        <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300/70" />
        {itemCount} {itemCount === 1 ? "entry" : "entries"}
      </span>
    </div>
  );
};

StepHeading.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    accent: PropTypes.string.isRequired,
  }).isRequired,
  itemCount: PropTypes.number.isRequired,
};

const SortableCollection = ({ section, fields, handleInputChange, addEntry, renderItem, getOverlayTitle, getOverlaySubtitle }) => {
  const [activeId, setActiveId] = useState(null);

  const config = SECTION_CONFIG[section];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeItem = fields.find((item) => item.id === activeId);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = fields.findIndex((item) => item.id === active.id);

    const newIndex = fields.findIndex((item) => item.id === over.id);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    handleInputChange(section, arrayMove(fields, oldIndex, newIndex));
  };

  return (
    <div className="relative">
      <StepHeading config={config} itemCount={fields.length} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement, restrictToFirstScrollableAncestor]}
      >
        <SortableContext items={fields.map((item) => item.id)} strategy={rectSortingStrategy}>
          {fields.length > 0 ? (
            <div className={config.gridClass}>
              {fields.map((item, index) => (
                <SortableItem key={item.id} id={item.id} section={section}>
                  {({ dragHandleProps }) =>
                    renderItem({
                      item,
                      index,
                      dragHandleProps,
                    })
                  }
                </SortableItem>
              ))}
            </div>
          ) : (
            <div className="flex min-h-44 flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-300/80 bg-gray-50/35 px-5 text-center dark:border-white/[0.07] dark:bg-white/[0.01]">
              <span className={`flex size-12 items-center justify-center rounded-2xl border ${config.accent}`}>
                <config.icon size={20} />
              </span>

              <p className="mt-3 text-[10px] font-semibold text-gray-600 dark:text-white/45">No entries added yet</p>

              <p className="mt-1 max-w-sm text-[9px] leading-4 text-gray-400 dark:text-white/25">
                Use the button below to add your first
                {` ${config.title.toLowerCase()} `}
                entry.
              </p>
            </div>
          )}
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <div className="w-[340px] max-w-[90vw] rounded-[22px] border border-indigo-300/25 bg-white/95 p-4 shadow-[0_28px_70px_rgba(15,23,42,0.24)] backdrop-blur-xl dark:border-indigo-300/[0.12] dark:bg-[#151925]/95">
              <div className="flex items-center gap-3">
                <span className={`flex size-10 items-center justify-center rounded-xl border ${config.accent}`}>
                  <RiDragDropFill size={16} />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-gray-800 dark:text-white/75">{getOverlayTitle(activeItem)}</p>

                  <p className="mt-1 truncate text-[9px] text-gray-400 dark:text-white/30">{getOverlaySubtitle(activeItem)}</p>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <button
        type="button"
        onClick={() => addEntry(section)}
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300/80 bg-gray-50/35 px-4 text-[9px] font-semibold text-gray-500 transition-all hover:border-indigo-300/40 hover:bg-indigo-500/[0.035] hover:text-indigo-700 dark:border-white/[0.08] dark:bg-white/[0.012] dark:text-white/35 dark:hover:border-indigo-300/[0.14] dark:hover:bg-indigo-300/[0.03] dark:hover:text-indigo-200/70"
      >
        <GoPlus size={17} />
        {config.addLabel}
      </button>
    </div>
  );
};

SortableCollection.propTypes = {
  section: PropTypes.oneOf(Object.keys(SECTION_CONFIG)).isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addEntry: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  getOverlayTitle: PropTypes.func.isRequired,
  getOverlaySubtitle: PropTypes.func.isRequired,
};

export const UserIdStep = ({ userId, setFormData }) => {
  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
            <FaUser size={17} />
          </span>

          <div>
            <InputTitle className="mb-1">Assign Resume Owner</InputTitle>

            <p className="text-[9px] leading-4 text-gray-400 dark:text-white/25">Enter the user ID that this resume belongs to.</p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/20 bg-amber-500/[0.05] px-3 py-1.5 text-[8px] font-semibold text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.03] dark:text-amber-200/65">
          Administrator only
        </span>
      </div>

      <div className="mx-auto max-w-3xl rounded-[24px] border border-gray-200/70 bg-gray-50/40 p-5 dark:border-white/[0.05] dark:bg-white/[0.014] sm:p-6">
        <ResumeTextField
          label="User ID"
          value={userId}
          placeholder="Enter the portfolio owner user ID"
          onChange={(event) =>
            setFormData((previousData) => ({
              ...previousData,
              userId: event.target.value,
            }))
          }
        />
      </div>
    </div>
  );
};

UserIdStep.propTypes = {
  userId: PropTypes.string.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export const EducationStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  return (
    <SortableCollection
      section="education"
      fields={fields}
      handleInputChange={handleInputChange}
      addEntry={addEntry}
      getOverlayTitle={(item) => item.school || "New qualification"}
      getOverlaySubtitle={(item) => item.degree || item.university || "Education entry"}
      renderItem={({ item, index, dragHandleProps }) => (
        <>
          <CardActions dragHandleProps={dragHandleProps} onRemove={() => removeEntry("education", index)} />

          <div className="space-y-4">
            <ResumeTextField
              label="School or College"
              value={item.school}
              placeholder="Name of school or college"
              required
              onChange={(event) => handleInputChange("education", index, "school", event.target.value)}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResumeTextField label="Degree" value={item.degree} placeholder="BIT, BCA, BBA" required onChange={(event) => handleInputChange("education", index, "degree", event.target.value)} />

              <ResumeTextField
                label="University"
                value={item.university}
                placeholder="University name"
                required
                onChange={(event) => handleInputChange("education", index, "university", event.target.value)}
              />
            </div>

            <ResumeTextField label="City" value={item.city} placeholder="Sydney, Australia" required onChange={(event) => handleInputChange("education", index, "city", event.target.value)} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResumeDateField label="Start Date" value={item.startDate} placeholder="Select start date" onChange={(value) => handleInputChange("education", index, "startDate", value)} />

              <ResumeDateField label="End Date" value={item.endDate} placeholder="Select end date" onChange={(value) => handleInputChange("education", index, "endDate", value)} />
            </div>

            <ResumeEditorField
              label="Description"
              value={item.description}
              placeholder="Describe your qualification and major learning outcomes."
              onChange={(value) => handleInputChange("education", index, "description", value)}
            />
          </div>
        </>
      )}
    />
  );
};

export const ExperienceStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  return (
    <SortableCollection
      section="experience"
      fields={fields}
      handleInputChange={handleInputChange}
      addEntry={addEntry}
      getOverlayTitle={(item) => item.company || "New experience"}
      getOverlaySubtitle={(item) => item.position || "Work experience entry"}
      renderItem={({ item, index, dragHandleProps }) => (
        <>
          <CardActions dragHandleProps={dragHandleProps} onRemove={() => removeEntry("experience", index)} />

          <div className="space-y-4">
            <ResumeTextField
              label="Company Name"
              value={item.company}
              placeholder="Organisation or company"
              required
              onChange={(event) => handleInputChange("experience", index, "company", event.target.value)}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResumeTextField
                label="Designation"
                value={item.position}
                placeholder="Job title"
                required
                onChange={(event) => handleInputChange("experience", index, "position", event.target.value)}
              />

              <ResumeTextField label="City" value={item.city} placeholder="Sydney, Australia" required onChange={(event) => handleInputChange("experience", index, "city", event.target.value)} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResumeDateField label="Start Date" value={item.startDate} placeholder="Select start date" onChange={(value) => handleInputChange("experience", index, "startDate", value)} />

              <ResumeDateField label="End Date" value={item.endDate} placeholder="Select end date" onChange={(value) => handleInputChange("experience", index, "endDate", value)} />
            </div>

            <ResumeEditorField
              label="Description"
              value={item.description}
              placeholder="Describe your responsibilities, projects and achievements."
              onChange={(value) => handleInputChange("experience", index, "description", value)}
            />
          </div>
        </>
      )}
    />
  );
};

export const SkillsStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  return (
    <SortableCollection
      section="skills"
      fields={fields}
      handleInputChange={handleInputChange}
      addEntry={addEntry}
      getOverlayTitle={(item) => item.name || "New skill"}
      getOverlaySubtitle={(item) => `${Number(item.progress) || 0}% proficiency`}
      renderItem={({ item, index, dragHandleProps }) => {
        const progress = Math.min(Math.max(Number(item.progress) || 0, 0), 100);

        return (
          <>
            <CardActions dragHandleProps={dragHandleProps} onRemove={() => removeEntry("skills", index)} />

            <div className="space-y-4">
              <ResumeTextField
                label="Skill Name"
                value={item.name}
                placeholder="React, Java, Project Management"
                required
                onChange={(event) => handleInputChange("skills", index, "name", event.target.value)}
              />

              <ResumeTextField
                label="Proficiency (0–100)"
                type="number"
                value={item.progress}
                placeholder="85"
                min="0"
                max="100"
                required
                onChange={(event) => handleInputChange("skills", index, "progress", event.target.value)}
              />

              <div className="rounded-2xl border border-gray-200/70 bg-white/40 p-3 dark:border-white/[0.05] dark:bg-black/10">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/25">Skill level</span>

                  <span className="text-[9px] font-bold tabular-nums text-cyan-700 dark:text-cyan-200/70">{progress}%</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-[width] duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        );
      }}
    />
  );
};

export const AchievementsStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  return (
    <SortableCollection
      section="achievements"
      fields={fields}
      handleInputChange={handleInputChange}
      addEntry={addEntry}
      getOverlayTitle={(item) => item.title || "New achievement"}
      getOverlaySubtitle={() => "Achievement entry"}
      renderItem={({ item, index, dragHandleProps }) => (
        <>
          <CardActions dragHandleProps={dragHandleProps} onRemove={() => removeEntry("achievements", index)} />

          <div className="space-y-4">
            <ResumeTextField
              label="Achievement Title"
              value={item.title}
              placeholder="Employee of the Month"
              required
              onChange={(event) => handleInputChange("achievements", index, "title", event.target.value)}
            />

            <ResumeEditorField
              label="Description"
              value={item.description}
              placeholder="Explain the achievement and why it was important."
              onChange={(value) => handleInputChange("achievements", index, "description", value)}
            />
          </div>
        </>
      )}
    />
  );
};

export const TrainingStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  return (
    <SortableCollection
      section="training"
      fields={fields}
      handleInputChange={handleInputChange}
      addEntry={addEntry}
      getOverlayTitle={(item) => item.title || "New training"}
      getOverlaySubtitle={(item) => item.company || "Training entry"}
      renderItem={({ item, index, dragHandleProps }) => (
        <>
          <CardActions dragHandleProps={dragHandleProps} onRemove={() => removeEntry("training", index)} />

          <div className="space-y-4">
            <ResumeTextField
              label="Training Title"
              value={item.title}
              placeholder="Advanced React Workshop"
              required
              onChange={(event) => handleInputChange("training", index, "title", event.target.value)}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResumeTextField
                label="Training Provider"
                value={item.company}
                placeholder="Provider or company"
                required
                onChange={(event) => handleInputChange("training", index, "company", event.target.value)}
              />

              <ResumeTextField label="City" value={item.city} placeholder="Training location" required onChange={(event) => handleInputChange("training", index, "city", event.target.value)} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResumeDateField label="Start Date" value={item.startDate} placeholder="Select start date" onChange={(value) => handleInputChange("training", index, "startDate", value)} />

              <ResumeDateField label="End Date" value={item.endDate} placeholder="Select end date" onChange={(value) => handleInputChange("training", index, "endDate", value)} />
            </div>

            <ResumeEditorField
              label="Description"
              value={item.description}
              placeholder="Describe what you learned and the skills gained."
              onChange={(value) => handleInputChange("training", index, "description", value)}
            />
          </div>
        </>
      )}
    />
  );
};

export const AwardStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  return (
    <SortableCollection
      section="award"
      fields={fields}
      handleInputChange={handleInputChange}
      addEntry={addEntry}
      getOverlayTitle={(item) => item.title || "New award"}
      getOverlaySubtitle={(item) => item.company || "Award entry"}
      renderItem={({ item, index, dragHandleProps }) => (
        <>
          <CardActions dragHandleProps={dragHandleProps} onRemove={() => removeEntry("award", index)} />

          <div className="space-y-4">
            <ResumeTextField label="Award Title" value={item.title} placeholder="Employee of the Year" required onChange={(event) => handleInputChange("award", index, "title", event.target.value)} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResumeTextField
                label="Organisation"
                value={item.company}
                placeholder="Awarding organisation"
                required
                onChange={(event) => handleInputChange("award", index, "company", event.target.value)}
              />

              <ResumeTextField label="City" value={item.city} placeholder="Location received" required onChange={(event) => handleInputChange("award", index, "city", event.target.value)} />
            </div>

            <ResumeDateField label="Received Date" value={item.receivedYear} placeholder="Select received date" onChange={(value) => handleInputChange("award", index, "receivedYear", value)} />

            <ResumeEditorField
              label="Description"
              value={item.description}
              placeholder="Describe the award and its professional significance."
              onChange={(value) => handleInputChange("award", index, "description", value)}
            />
          </div>
        </>
      )}
    />
  );
};

export const ReferenceStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  return (
    <SortableCollection
      section="reference"
      fields={fields}
      handleInputChange={handleInputChange}
      addEntry={addEntry}
      getOverlayTitle={(item) => item.fullname || "New reference"}
      getOverlaySubtitle={(item) => item.designation || item.company || "Professional reference"}
      renderItem={({ item, index, dragHandleProps }) => (
        <>
          <CardActions dragHandleProps={dragHandleProps} onRemove={() => removeEntry("reference", index)} />

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResumeTextField
                label="Full Name"
                value={item.fullname}
                placeholder="Reference's full name"
                required
                onChange={(event) => handleInputChange("reference", index, "fullname", event.target.value)}
              />

              <ResumeTextField label="Company" value={item.company} placeholder="Current company" required onChange={(event) => handleInputChange("reference", index, "company", event.target.value)} />
            </div>

            <ResumeTextField
              label="Designation"
              value={item.designation}
              placeholder="Job title or position"
              required
              onChange={(event) => handleInputChange("reference", index, "designation", event.target.value)}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResumeTextField
                label="Phone"
                type="tel"
                value={item.phone}
                placeholder="+61412345678"
                required
                onChange={(event) => handleInputChange("reference", index, "phone", event.target.value)}
              />

              <ResumeTextField
                label="Email"
                type="email"
                value={item.email}
                placeholder="reference@example.com"
                required
                onChange={(event) => handleInputChange("reference", index, "email", event.target.value)}
              />
            </div>

            <ResumeTextField
              label="Website"
              type="url"
              value={item.website}
              placeholder="https://company.com"
              onChange={(event) => handleInputChange("reference", index, "website", event.target.value)}
            />
          </div>
        </>
      )}
    />
  );
};

const stepPropTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addEntry: PropTypes.func.isRequired,
  removeEntry: PropTypes.func.isRequired,
};

EducationStep.propTypes = stepPropTypes;
ExperienceStep.propTypes = stepPropTypes;
SkillsStep.propTypes = stepPropTypes;
AchievementsStep.propTypes = stepPropTypes;
TrainingStep.propTypes = stepPropTypes;
AwardStep.propTypes = stepPropTypes;
ReferenceStep.propTypes = stepPropTypes;

export const CreateResume = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === "admin";

  const [currentStep, setCurrentStep] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    education: [],
    experience: [],
    skills: [],
    achievements: [],
    training: [],
    award: [],
    reference: [],
  });

  const steps = useMemo(
    () =>
      [
        {
          key: "userId",
          name: "User ID",
          icon: FaUser,
          show: isAdmin,
          component: UserIdStep,
        },
        {
          key: "education",
          name: "Education",
          icon: FaGraduationCap,
          show: true,
          component: EducationStep,
        },
        {
          key: "experience",
          name: "Experience",
          icon: FaBriefcase,
          show: true,
          component: ExperienceStep,
        },
        {
          key: "skills",
          name: "Skills",
          icon: FaCode,
          show: true,
          component: SkillsStep,
        },
        {
          key: "achievements",
          name: "Achievements",
          icon: FaTrophy,
          show: true,
          component: AchievementsStep,
        },
        {
          key: "training",
          name: "Training",
          icon: FaChalkboardTeacher,
          show: true,
          component: TrainingStep,
        },
        {
          key: "award",
          name: "Awards",
          icon: FaAward,
          show: true,
          component: AwardStep,
        },
        {
          key: "reference",
          name: "References",
          icon: FaUserFriends,
          show: true,
          component: ReferenceStep,
        },
      ].filter((step) => step.show),
    [isAdmin],
  );

  const progressPercentage = steps.length > 0 ? Math.round(((currentStep + 1) / steps.length) * 100) : 0;

  const isLastStep = currentStep === steps.length - 1;

  const currentStepData = steps[currentStep];

  useEffect(() => {
    setFormData((previousData) => ({
      ...previousData,
      education: previousData.education.length > 0 ? previousData.education : [createEmptyEntry("education")],
      experience: previousData.experience.length > 0 ? previousData.experience : [createEmptyEntry("experience")],
      skills: previousData.skills.length > 0 ? previousData.skills : [createEmptyEntry("skills")],
      achievements: previousData.achievements.length > 0 ? previousData.achievements : [createEmptyEntry("achievements")],
      training: previousData.training.length > 0 ? previousData.training : [createEmptyEntry("training")],
      award: previousData.award.length > 0 ? previousData.award : [createEmptyEntry("award")],
      reference: previousData.reference.length > 0 ? previousData.reference : [createEmptyEntry("reference")],
    }));
  }, []);

  useEffect(() => {
    if (currentStep >= steps.length && steps.length > 0) {
      setCurrentStep(steps.length - 1);
    }
  }, [currentStep, steps.length]);

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
    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: previousData[fieldName].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const createPayload = () => {
    const payload = {
      ...formData,
    };

    if (!isAdmin) {
      delete payload.userId;
    }

    Object.keys(payload).forEach((key) => {
      if (!Array.isArray(payload[key])) {
        return;
      }

      payload[key] = payload[key]
        .map((item) => {
          const { id: _clientId, ...entry } = item;

          return entry;
        })
        .filter((entry) => Object.values(entry).some((entryValue) => entryValue !== null && entryValue !== undefined && String(entryValue).trim() !== ""));
    });

    return payload;
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = createPayload();

      await dispatch(createResume(payload)).unwrap();

      toast.success("Resume created successfully.");

      navigate("/resume");
    } catch (error) {
      toast.error(getErrorMessage(error));
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

  const renderCurrentStep = () => {
    if (!currentStepData) {
      return null;
    }

    const StepComponent = currentStepData.component;

    if (currentStepData.key === "userId") {
      return <StepComponent userId={formData.userId} setFormData={setFormData} />;
    }

    return <StepComponent fields={formData[currentStepData.key] || []} handleInputChange={handleInputChange} addEntry={addEntry} removeEntry={removeEntry} />;
  };

  return (
    <>
      <StickyHeader>
        <div>
          <HeadingTwo>Create Resume</HeadingTwo>

          <p className="mt-1 hidden text-[9px] text-gray-400 dark:text-white/25 sm:block">Build a complete professional resume section by section.</p>
        </div>

        <div className="flex items-center gap-2">
          <GhostButton type="button" disabled={isSubmitting} onClick={() => navigate("/resume")}>
            Cancel
          </GhostButton>

          {isLastStep ? (
            <TertiaryButton type="button" disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? "Submitting..." : "Submit Resume"}
            </TertiaryButton>
          ) : (
            <div className="hidden items-center gap-3 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.055] px-3 py-2 sm:flex dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.03]">
              <div>
                <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-indigo-600 dark:text-indigo-200/45">Builder progress</p>

                <p className="mt-0.5 text-[9px] font-semibold text-indigo-800 dark:text-indigo-100/70">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>

              <span className="rounded-full bg-indigo-500 px-2 py-1 text-[8px] font-bold text-white dark:bg-indigo-400/80">{progressPercentage}%</span>
            </div>
          )}
        </div>
      </StickyHeader>

      {/* Premium step navigator */}
      <Wrapper className="relative mb-3 overflow-hidden p-3 sm:p-4">
        <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-indigo-500/[0.014] blur-[80px]" />

        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-200/50">Resume builder</p>

              <h2 className="mt-1 text-sm font-black tracking-[-0.02em] text-gray-900 dark:text-white/90">{currentStepData?.name}</h2>
            </div>

            <span className="text-[9px] font-semibold tabular-nums text-gray-400 dark:text-white/25">{progressPercentage}% complete</span>
          </div>

          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/[0.055]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 transition-[width] duration-500"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>

          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div
                    key={step.key}
                    className={`flex min-w-[135px] items-center gap-3 rounded-2xl border px-3 py-3 transition-all ${
                      isCurrent
                        ? "border-indigo-300/30 bg-indigo-500/[0.07] shadow-[0_10px_24px_rgba(79,70,229,0.08)] dark:border-indigo-300/[0.12] dark:bg-indigo-300/[0.045]"
                        : isCompleted
                          ? "border-emerald-300/20 bg-emerald-500/[0.045] dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.028]"
                          : "border-gray-200/70 bg-gray-50/40 dark:border-white/[0.045] dark:bg-white/[0.012]"
                    }`}
                  >
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${
                        isCurrent
                          ? "border-indigo-300/25 bg-indigo-500/[0.1] text-indigo-700 dark:border-indigo-300/[0.1] dark:bg-indigo-300/[0.06] dark:text-indigo-200/75"
                          : isCompleted
                            ? "border-emerald-300/25 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-300/[0.1] dark:bg-emerald-300/[0.05] dark:text-emerald-200/70"
                            : "border-gray-200/70 bg-white/50 text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/25"
                      }`}
                    >
                      {isCompleted ? <HiOutlineCheck size={16} /> : <StepIcon size={15} />}
                    </span>

                    <div>
                      <p
                        className={`text-[9px] font-semibold ${
                          isCurrent ? "text-gray-900 dark:text-white/80" : isCompleted ? "text-emerald-700 dark:text-emerald-200/65" : "text-gray-500 dark:text-white/35"
                        }`}
                      >
                        {step.name}
                      </p>

                      <p className="mt-0.5 text-[7px] uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">Step {index + 1}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Wrapper>

      {/* Active step */}
      <Wrapper className="relative mb-5 overflow-hidden p-4 sm:p-6">
        <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-indigo-500/[0.012] blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-cyan-500/[0.01] blur-[100px]" />

        <div className="relative z-10">
          {renderCurrentStep()}

          <footer className="mt-6 flex flex-col gap-3 border-t border-gray-200/70 pt-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl border border-gray-200/70 bg-gray-50/50 text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.016] dark:text-white/25">
                <HiOutlineDocumentText size={17} />
              </span>

              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.11em] text-gray-400 dark:text-white/20">Current section</p>

                <p className="mt-0.5 text-[10px] font-semibold text-gray-700 dark:text-white/55">{currentStepData?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previousStep}
                disabled={currentStep === 0}
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
                  <HiOutlineSparkles size={14} />

                  {isSubmitting ? "Submitting..." : "Submit Resume"}
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
    </>
  );
};
