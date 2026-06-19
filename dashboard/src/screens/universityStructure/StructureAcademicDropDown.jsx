import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getAllUniversity } from "@/redux/slices/universityStructure/universitySlice";
import { Loader } from "@/utils/Router";
import { getAllFaculty } from "@/redux/slices/universityStructure/facultySlice";
import { getAllProgram } from "@/redux/slices/universityStructure/programSlice";
import { getUserCourses } from "@/redux/slices/universityStructure/courseSlice";

export const UniversityDropDown = (props) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(getAllUniversity());
  }, [dispatch]);

  const { universitys, loading } = useSelector((state) => state.university);
  const universityList = universitys?.universityList || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (university) => {
    setIsOpen(false);
    props.onChange(university); // Send the entire selected university object
  };

  // Get the selected value - handle both object and string cases
  const getSelectedValue = () => {
    if (!props.value) return null;
    if (typeof props.value === "object") {
      return props.value;
    }
    // If value is a string (ID), find the matching university
    return universityList.find((univ) => univ._id === props.value) || null;
  };

  const selectedUniversity = getSelectedValue();

  if (loading) {
    return (
      <div className="w-full h-11 3xl:h-12 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown trigger/button */}
      <button
        type="button"
        className={`
          w-full h-11 3xl:h-12 px-5
          text-left
          ${selectedUniversity ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}
          text-xs 3xl:text-sm
          border border-gray-100 dark:border-gray-800/50
          hover:border-gray-200 dark:hover:border-gray-700
          focus:border-gray-200 dark:focus:border-gray-800
          focus:outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700
          rounded-full
          appearance-none
          cursor-pointer
          transition-all duration-200
          flex items-center justify-between
          ${isOpen ? "border-gray-200 dark:border-gray-700 ring-1 ring-gray-200 dark:ring-gray-700" : ""}
          ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onClick={() => !props.disabled && setIsOpen(!isOpen)}
        disabled={props.disabled}
      >
        <span className="truncate">{selectedUniversity ? selectedUniversity.name : props.placeholder}</span>
        <svg className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && !props.disabled && (
        <div
          className="
            absolute top-full left-0 right-0 z-50 mt-1
            bg-white dark:bg-gray-900
            border border-gray-100 dark:border-gray-800/50
            rounded-3xl
            shadow-lg dark:shadow-gray-900/50
            overflow-hidden
          "
        >
          <div
            className="
              max-h-60 overflow-y-auto 
              scrollbar scrollbar-thin scrollbar-thumb-gray-300/50 
              scrollbar-track-transparent hover:scrollbar-thumb-gray-400/70
              dark:scrollbar-thumb-gray-600/50 dark:hover:scrollbar-thumb-gray-500/70
            "
          >
            <button
              type="button"
              className={`
                w-full text-left
                px-4 py-3
                text-xs 3xl:text-sm
                capitalize
                ${!selectedUniversity ? "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}
                transition-colors duration-150
                border-b border-gray-100 dark:border-gray-800/50
                rounded-t-3xl
              `}
              onClick={() => handleSelect(null)}
            >
              {props.placeholder}
            </button>

            {universityList.map((university, index) => (
              <button
                key={university._id}
                type="button"
                className={`
                  w-full text-left
                  px-4 py-3
                  text-xs 3xl:text-sm
                  capitalize
                  ${
                    selectedUniversity?._id === university._id
                      ? "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                  transition-colors duration-150
                  border-b border-gray-100 dark:border-gray-800/50 last:border-b-0
                  ${index === universityList.length - 1 ? "rounded-b-3xl" : ""}
                `}
                onClick={() => handleSelect(university)}
              >
                {university.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const FacultyDropDown = ({ value, onChange, universityId, disabled, placeholder, className }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (universityId) {
      dispatch(getAllFaculty());
    }
  }, [dispatch, universityId]);

  const { facultys, loading } = useSelector((state) => state.faculty);
  const facultyList = facultys?.facultyList || [];
  const filteredFacultyList = universityId ? facultyList.filter((faculty) => faculty?.university?._id === universityId) : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (faculty) => {
    setIsOpen(false);
    onChange(faculty);
  };

  // Get the selected value
  const getSelectedValue = () => {
    if (!value) return null;
    if (typeof value === "object") {
      return value;
    }
    return filteredFacultyList.find((faculty) => faculty._id === value) || null;
  };

  const selectedFaculty = getSelectedValue();

  if (loading) {
    return (
      <div className="w-full h-11 3xl:h-12 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`
          w-full h-11 3xl:h-12 px-5
          text-left
          ${selectedFaculty ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}
          text-xs 3xl:text-sm
          border border-gray-100 dark:border-gray-800/50
          hover:border-gray-200 dark:hover:border-gray-700
          focus:border-gray-200 dark:focus:border-gray-800
          focus:outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700
          rounded-full
          appearance-none
          cursor-pointer
          transition-all duration-200
          flex items-center justify-between
          ${isOpen ? "border-gray-200 dark:border-gray-700 ring-1 ring-gray-200 dark:ring-gray-700" : ""}
          ${disabled || !universityId ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
        onClick={() => !disabled && universityId && setIsOpen(!isOpen)}
        disabled={disabled || !universityId}
      >
        <span className="truncate">{selectedFaculty ? selectedFaculty.name : placeholder}</span>
        <svg className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !disabled && universityId && (
        <div
          className="
            absolute top-full left-0 right-0 z-50 mt-1
            bg-white dark:bg-gray-900
            border border-gray-100 dark:border-gray-800/50
            rounded-3xl
            shadow-lg dark:shadow-gray-900/50
            overflow-hidden
          "
        >
          <div
            className="
              max-h-60 overflow-y-auto 
              scrollbar scrollbar-thin scrollbar-thumb-gray-300/50 
              scrollbar-track-transparent hover:scrollbar-thumb-gray-400/70
              dark:scrollbar-thumb-gray-600/50 dark:hover:scrollbar-thumb-gray-500/70
            "
          >
            <button
              type="button"
              className={`
                w-full text-left
                px-4 py-3
                text-xs 3xl:text-sm
                capitalize
                ${!selectedFaculty ? "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}
                transition-colors duration-150
                border-b border-gray-100 dark:border-gray-800/50
                rounded-t-3xl
              `}
              onClick={() => handleSelect(null)}
            >
              {placeholder}
            </button>

            {filteredFacultyList.map((faculty, index) => (
              <button
                key={faculty._id}
                type="button"
                className={`
                  w-full text-left
                  px-4 py-3
                  text-xs 3xl:text-sm
                  capitalize
                  ${selectedFaculty?._id === faculty._id ? "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}
                  transition-colors duration-150
                  border-b border-gray-100 dark:border-gray-800/50 last:border-b-0
                  ${index === filteredFacultyList.length - 1 ? "rounded-b-3xl" : ""}
                `}
                onClick={() => handleSelect(faculty)}
              >
                {faculty.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ProgramDropDown = ({ value, onChange, facultyId, disabled, placeholder, className }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (facultyId) {
      dispatch(getAllProgram());
    }
  }, [dispatch, facultyId]);

  const { programs, loading } = useSelector((state) => state.program);
  const programList = programs?.programList || [];
  const filteredProgramList = facultyId ? programList.filter((program) => program?.faculty?._id === facultyId) : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (program) => {
    setIsOpen(false);
    onChange(program);
  };

  // Get the selected value
  const getSelectedValue = () => {
    if (!value) return null;
    if (typeof value === "object") {
      return value;
    }
    return filteredProgramList.find((program) => program._id === value) || null;
  };

  const selectedProgram = getSelectedValue();

  if (loading) {
    return (
      <div className="w-full h-11 3xl:h-12 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`
          w-full h-11 3xl:h-12 px-5
          text-left
          ${selectedProgram ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}
          text-xs 3xl:text-sm
          border border-gray-100 dark:border-gray-800/50
          hover:border-gray-200 dark:hover:border-gray-700
          focus:border-gray-200 dark:focus:border-gray-800
          focus:outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700
          rounded-full
          appearance-none
          cursor-pointer
          transition-all duration-200
          flex items-center justify-between
          ${isOpen ? "border-gray-200 dark:border-gray-700 ring-1 ring-gray-200 dark:ring-gray-700" : ""}
          ${disabled || !facultyId ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
        onClick={() => !disabled && facultyId && setIsOpen(!isOpen)}
        disabled={disabled || !facultyId}
      >
        <span className="truncate">{selectedProgram ? selectedProgram.name : placeholder}</span>
        <svg className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !disabled && facultyId && (
        <div
          className="
            absolute top-full left-0 right-0 z-50 mt-1
            bg-white dark:bg-gray-900
            border border-gray-100 dark:border-gray-800/50
            rounded-3xl
            shadow-lg dark:shadow-gray-900/50
            overflow-hidden
          "
        >
          <div
            className="
              max-h-60 overflow-y-auto 
              scrollbar scrollbar-thin scrollbar-thumb-gray-300/50 
              scrollbar-track-transparent hover:scrollbar-thumb-gray-400/70
              dark:scrollbar-thumb-gray-600/50 dark:hover:scrollbar-thumb-gray-500/70
            "
          >
            <button
              type="button"
              className={`
                w-full text-left
                px-4 py-3
                text-xs 3xl:text-sm
                capitalize
                ${!selectedProgram ? "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}
                transition-colors duration-150
                border-b border-gray-100 dark:border-gray-800/50
                rounded-t-3xl
              `}
              onClick={() => handleSelect(null)}
            >
              {placeholder}
            </button>

            {filteredProgramList.map((program, index) => (
              <button
                key={program._id}
                type="button"
                className={`
                  w-full text-left
                  px-4 py-3
                  text-xs 3xl:text-sm
                  capitalize
                  ${selectedProgram?._id === program._id ? "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}
                  transition-colors duration-150
                  border-b border-gray-100 dark:border-gray-800/50 last:border-b-0
                  ${index === filteredProgramList.length - 1 ? "rounded-b-3xl" : ""}
                `}
                onClick={() => handleSelect(program)}
              >
                {program.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const CourseDropDown = ({ value, onChange, disabled, placeholder, className }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { courses, isLoading } = useSelector((state) => state.course);
  const { subjects } = courses;

  useEffect(() => {
    dispatch(getUserCourses());
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (course) => {
    setIsOpen(false);
    onChange(course);
  };

  // Get the selected value
  const getSelectedValue = () => {
    if (!value) return null;
    if (typeof value === "object") {
      return value;
    }
    const filteredCourses = subjects?.filter((course) => !course.resourceFile);
    return filteredCourses?.find((course) => course._id === value) || null;
  };

  const selectedCourse = getSelectedValue();
  const filteredCourses = subjects?.filter((course) => !course.resourceFile);

  if (isLoading) {
    return (
      <div className="w-full h-11 3xl:h-12 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`
          w-full h-11 3xl:h-12 px-5
          text-left
          ${selectedCourse ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}
          text-xs 3xl:text-sm
          border border-gray-100 dark:border-gray-800/50
          hover:border-gray-200 dark:hover:border-gray-700
          focus:border-gray-200 dark:focus:border-gray-800
          focus:outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700
          rounded-full
          appearance-none
          cursor-pointer
          transition-all duration-200
          flex items-center justify-between
          ${isOpen ? "border-gray-200 dark:border-gray-700 ring-1 ring-gray-200 dark:ring-gray-700" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="truncate">{selectedCourse ? selectedCourse.name : placeholder}</span>
        <svg className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div
          className="
            absolute top-full left-0 right-0 z-50 mt-1
            bg-white dark:bg-gray-900
            border border-gray-100 dark:border-gray-800/50
            rounded-3xl
            shadow-lg dark:shadow-gray-900/50
            overflow-hidden
          "
        >
          <div
            className="
              max-h-60 overflow-y-auto 
              scrollbar scrollbar-thin scrollbar-thumb-gray-300/50 
              scrollbar-track-transparent hover:scrollbar-thumb-gray-400/70
              dark:scrollbar-thumb-gray-600/50 dark:hover:scrollbar-thumb-gray-500/70
            "
          >
            <button
              type="button"
              className={`
                w-full text-left
                px-4 py-3
                text-xs 3xl:text-sm
                capitalize
                ${!selectedCourse ? "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}
                transition-colors duration-150
                border-b border-gray-100 dark:border-gray-800/50
                rounded-t-3xl
              `}
              onClick={() => handleSelect(null)}
            >
              {placeholder}
            </button>

            {filteredCourses?.map((course, index) => (
              <button
                key={course._id}
                type="button"
                className={`
                  w-full text-left
                  px-4 py-3
                  text-xs 3xl:text-sm
                  capitalize
                  ${selectedCourse?._id === course._id ? "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}
                  transition-colors duration-150
                  border-b border-gray-100 dark:border-gray-800/50 last:border-b-0
                  ${index === filteredCourses.length - 1 ? "rounded-b-3xl" : ""}
                `}
                onClick={() => handleSelect(course)}
              >
                {course.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes remain the same
CourseDropDown.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    PropTypes.string,
  ]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

FacultyDropDown.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    PropTypes.string,
  ]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  universityId: PropTypes.string,
};

ProgramDropDown.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    PropTypes.string,
  ]),
  facultyId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  universityId: PropTypes.string,
};

UniversityDropDown.propTypes = {
  value: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

// Default props
UniversityDropDown.defaultProps = {
  disabled: false,
  placeholder: "Select University",
  value: null,
  className: "",
};

FacultyDropDown.defaultProps = {
  disabled: false,
  placeholder: "Select Faculty",
  value: null,
  className: "",
  universityId: "",
};

ProgramDropDown.defaultProps = {
  disabled: false,
  placeholder: "Select Program",
  value: null,
  className: "",
  facultyId: "",
};

CourseDropDown.defaultProps = {
  disabled: false,
  placeholder: "Select Course",
  value: null,
  className: "",
};
