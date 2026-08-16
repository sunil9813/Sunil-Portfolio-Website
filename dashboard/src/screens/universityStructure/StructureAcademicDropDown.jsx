import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import { getAllUniversity } from "@/redux/slices/universityStructure/universitySlice";
import { getAllFaculty } from "@/redux/slices/universityStructure/facultySlice";
import { getAllProgram } from "@/redux/slices/universityStructure/programSlice";
import { getUserCourses } from "@/redux/slices/universityStructure/courseSlice";
import { Loader } from "@/routes";
import { CommonClassForInput, inputClassName } from "@/utils";

const dropdownThemes = {
  university: {
    icon: "text-emerald-200/70",
    dot: "bg-emerald-300/75",
  },
  faculty: {
    icon: "text-violet-200/70",
    dot: "bg-violet-300/75",
  },
  program: {
    icon: "text-sky-200/70",
    dot: "bg-sky-300/75",
  },
  course: {
    icon: "text-amber-200/70",
    dot: "bg-amber-300/75",
  },
};

const getEntityId = (value) => {
  if (!value) return "";
  if (typeof value === "object") return value?._id || "";
  return value;
};

const resolveSelectedItem = (value, items) => {
  if (!value) return null;
  if (typeof value === "object") return value;
  return items.find((item) => item?._id === value) || null;
};

const ChevronIcon = ({ isOpen }) => (
  <svg aria-hidden="true" className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="m5 12 4 4L19 6" />
  </svg>
);

const DropdownLoader = ({ className = "" }) => (
  <div className={`flex h-11 w-full items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.018] 3xl:h-12 ${className}`}>
    <span className="size-4 animate-spin rounded-full border-2 border-white/[0.12] border-t-white/65" />
    <span className="ml-2 text-[10px] font-medium text-white/25">Loading options</span>
  </div>
);

const StructureDropdown = ({
  items,
  value,
  onChange,
  loading = false,
  disabled = false,
  placeholder = "Select option",
  emptyMessage = "No options available",
  className = "",
  themeKey = "university",
  idPrefix,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const theme = dropdownThemes[themeKey] || dropdownThemes.university;

  const selectedItem = useMemo(() => resolveSelectedItem(value, items), [value, items]);

  const menuId = `${idPrefix}-dropdown-menu`;

  const updateDropdownPosition = () => {
    if (!triggerRef.current || !menuRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = menuRef.current.getBoundingClientRect();

    const gap = 8;
    const padding = 12;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = triggerRect.bottom + gap;
    let left = triggerRect.left;

    if (left + dropdownRect.width > viewportWidth - padding) {
      left = Math.max(padding, triggerRect.right - dropdownRect.width);
    }

    if (left < padding) {
      left = padding;
    }

    if (top + dropdownRect.height > viewportHeight - padding) {
      top = triggerRect.top - dropdownRect.height - gap;
    }

    if (top < padding) {
      top = padding;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedTrigger = triggerRef.current?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);

      if (!clickedTrigger && !clickedMenu) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      requestAnimationFrame(updateDropdownPosition);

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("resize", updateDropdownPosition);
      window.addEventListener("scroll", updateDropdownPosition, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  const handleSelect = (item) => {
    onChange(item);
    setIsOpen(false);
  };

  if (loading) {
    return <DropdownLoader className={className} />;
  }

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && !disabled && (
        <motion.div
          ref={menuRef}
          id={menuId}
          role="listbox"
          aria-label={placeholder}
          className="
            fixed z-[2147483647]
            rounded-xl border border-gray-800/30
            bg-dark-surface2
            p-2
            shadow-dropDownDark
          "
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: triggerRef.current?.offsetWidth || 240,
            minWidth: "200px",
            originX: position.left > window.innerWidth / 2 ? 1 : 0,
          }}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="max-h-60 space-y-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/[0.12] hover:scrollbar-thumb-white/[0.18]">
            <button
              type="button"
              role="option"
              aria-selected={!selectedItem}
              onClick={() => handleSelect(null)}
              className={`
                flex h-10 w-full items-center justify-between gap-3 rounded-xl border px-3
                text-left text-xs font-semibold capitalize transition-all duration-300 3xl:text-sm
                ${!selectedItem ? "border-white/[0.05] bg-white/[0.018] text-white/75" : "border-transparent text-white/35 hover:border-white/[0.05] hover:bg-white/[0.018] hover:text-white/65"}
              `}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.018] ${theme.icon}`}>
                  <span className={`size-1.5 rounded-full ${theme.dot}`} />
                </span>

                <span className="min-w-0 truncate">{placeholder}</span>
              </span>

              {!selectedItem && <CheckIcon />}
            </button>

            {items.length > 0 ? (
              items.map((item) => {
                const isSelected = selectedItem?._id === item?._id;

                return (
                  <button
                    key={item?._id || item?.name}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item)}
                    className={`
                      flex h-10 w-full items-center justify-between gap-3 rounded-xl border px-3
                      text-left text-xs font-semibold capitalize transition-all duration-300 3xl:text-sm
                      ${isSelected ? "border-white/[0.05] bg-white/[0.018] text-white/75" : "border-transparent text-white/35 hover:border-white/[0.05] hover:bg-white/[0.018] hover:text-white/65"}
                    `}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.018] text-[10px] font-bold text-white/35">
                        {item?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>

                      <span className="min-w-0 truncate">{item?.name || "Untitled"}</span>
                    </span>

                    {isSelected && <CheckIcon />}
                  </button>
                );
              })
            ) : (
              <div className="flex min-h-24 flex-col items-center justify-center px-4 py-5 text-center">
                <p className="text-[10px] font-medium text-white/25">{emptyMessage}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="relative w-full">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-label={placeholder}
          onClick={() => {
            if (!disabled) setIsOpen((currentValue) => !currentValue);
          }}
          className={`
            group/dropdown flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-2
            text-left text-xs transition-all duration-300 3xl:h-12 3xl:text-sm
            border-white/[0.06] bg-white/[0.018]
            ${selectedItem ? "text-white/75" : "text-white/35"}
            hover:border-white/[0.1] hover:bg-white/[0.03] hover:text-white/75
            focus:outline-none
            ${isOpen ? "border-white/[0.14] bg-white/[0.035] text-white/80" : ""}
            ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"}
            ${className}
          `}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.018] ${theme.icon}`}>
              <span className={`size-1.5 rounded-full ${theme.dot}`} />
            </span>

            <span className="truncate font-semibold capitalize">{selectedItem?.name || placeholder}</span>
          </span>

          <span className="shrink-0 text-white/35 transition-colors group-hover/dropdown:text-white/60">
            <ChevronIcon isOpen={isOpen} />
          </span>
        </button>
      </div>

      {typeof document !== "undefined" ? createPortal(dropdownContent, document.body) : dropdownContent}
    </>
  );
};

export const UniversityDropDown = ({ value = null, onChange, disabled = false, placeholder = "Select University", className = "" }) => {
  const dispatch = useDispatch();
  const { universitys, loading } = useSelector((state) => state.university);
  const universityList = universitys?.universityList || [];

  useEffect(() => {
    dispatch(getAllUniversity());
  }, [dispatch]);

  return (
    <StructureDropdown
      items={universityList}
      value={value}
      onChange={onChange}
      loading={loading}
      disabled={disabled}
      placeholder={placeholder}
      emptyMessage="No universities available"
      className={className}
      themeKey="university"
      idPrefix="university"
    />
  );
};

export const FacultyDropDown = ({ value = null, onChange, universityId = "", disabled = false, placeholder = "Select Faculty", className = "" }) => {
  const dispatch = useDispatch();
  const { facultys, loading } = useSelector((state) => state.faculty);
  const facultyList = facultys?.facultyList || [];
  const normalizedUniversityId = getEntityId(universityId);

  useEffect(() => {
    if (normalizedUniversityId) dispatch(getAllFaculty());
  }, [dispatch, normalizedUniversityId]);

  const filteredFacultyList = useMemo(() => {
    if (!normalizedUniversityId) return [];

    return facultyList.filter((faculty) => getEntityId(faculty?.university) === normalizedUniversityId);
  }, [facultyList, normalizedUniversityId]);

  return (
    <StructureDropdown
      items={filteredFacultyList}
      value={value}
      onChange={onChange}
      loading={loading && Boolean(normalizedUniversityId)}
      disabled={disabled || !normalizedUniversityId}
      placeholder={placeholder}
      emptyMessage="No faculties found for this university"
      className={className}
      themeKey="faculty"
      idPrefix="faculty"
    />
  );
};

export const ProgramDropDown = ({ value = null, onChange, facultyId = "", disabled = false, placeholder = "Select Program", className = "" }) => {
  const dispatch = useDispatch();
  const { programs, loading } = useSelector((state) => state.program);
  const programList = programs?.programList || [];
  const normalizedFacultyId = getEntityId(facultyId);

  useEffect(() => {
    if (normalizedFacultyId) dispatch(getAllProgram());
  }, [dispatch, normalizedFacultyId]);

  const filteredProgramList = useMemo(() => {
    if (!normalizedFacultyId) return [];

    return programList.filter((program) => getEntityId(program?.faculty) === normalizedFacultyId);
  }, [programList, normalizedFacultyId]);

  return (
    <StructureDropdown
      items={filteredProgramList}
      value={value}
      onChange={onChange}
      loading={loading && Boolean(normalizedFacultyId)}
      disabled={disabled || !normalizedFacultyId}
      placeholder={placeholder}
      emptyMessage="No programs found for this faculty"
      className={className}
      themeKey="program"
      idPrefix="program"
    />
  );
};

export const CourseDropDown = ({ value, onChange, disabled, placeholder, className }) => {
  const dispatch = useDispatch();
  const { courses, isLoading } = useSelector((state) => state.course);
  const subjects = courses?.subjects || [];

  useEffect(() => {
    dispatch(getUserCourses());
  }, [dispatch]);

  const hasCoursePdf = (course) => {
    const hasResourceFiles = Array.isArray(course?.resourceFiles) && course.resourceFiles.some((resourceFile) => resourceFile?.filePath || resourceFile?.url);
    const hasLegacyResource = Boolean(course?.resourceFile?.file?.filePath || course?.resourceFile?.url);

    return hasResourceFiles || hasLegacyResource;
  };

  const filteredCourses = subjects.filter((course) => !hasCoursePdf(course));

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedCourse = filteredCourses.find((course) => course._id === selectedId);
    onChange(selectedCourse || null);
  };

  const currentValueId = typeof value === "object" ? value?._id : value;

  return isLoading ? (
    <Loader />
  ) : (
    <select
      name="course"
      value={currentValueId || ""}
      onChange={handleChange}
      className={`${CommonClassForInput + inputClassName} ${className} !bg-transparent !h-auto outline-none capitalize`}
      disabled={disabled}
    >
      <option className="textColor capitalize text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="">
        {placeholder || "Select Course"}
      </option>

      {filteredCourses.map((course) => (
        <option className="textColor capitalize text-xs 3xl:text-sm dark:!bg-black dark:text-white" key={course._id} value={course._id}>
          {course.name}
        </option>
      ))}
    </select>
  );
};

ChevronIcon.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

DropdownLoader.propTypes = {
  className: PropTypes.string,
};

StructureDropdown.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  value: PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    PropTypes.string,
  ]),
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  emptyMessage: PropTypes.string,
  className: PropTypes.string,
  themeKey: PropTypes.oneOf(["university", "faculty", "program", "course"]),
  idPrefix: PropTypes.string.isRequired,
};

const dropdownValuePropType = PropTypes.oneOfType([
  PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
  PropTypes.string,
]);

UniversityDropDown.propTypes = {
  value: dropdownValuePropType,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

FacultyDropDown.propTypes = {
  value: dropdownValuePropType,
  onChange: PropTypes.func.isRequired,
  universityId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      _id: PropTypes.string,
    }),
  ]),
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

ProgramDropDown.propTypes = {
  value: dropdownValuePropType,
  onChange: PropTypes.func.isRequired,
  facultyId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      _id: PropTypes.string,
    }),
  ]),
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

CourseDropDown.propTypes = {
  value: dropdownValuePropType,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};
