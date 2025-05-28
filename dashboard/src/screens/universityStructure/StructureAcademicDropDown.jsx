import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonClassForInput } from "@/utils";
import PropTypes from "prop-types";
import { getAllUniversity } from "@/redux/slices/universityStructure/universitySlice";
import { Loader } from "@/utils/Router";
import { getAllFaculty } from "@/redux/slices/universityStructure/facultySlice";
import { getAllProgram } from "@/redux/slices/universityStructure/programSlice";

const inputClassName =
  "w-full !h-11 3xl:h-12 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 !rounded-full placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50";

export const UniversityDropDown = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUniversity());
  }, [dispatch]);

  const { universitys, loading } = useSelector((state) => state.university);
  const universityList = universitys?.universityList || [];

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedUniversity = universityList.find((univ) => univ._id === selectedId);
    props.onChange(selectedUniversity); // Pass the whole university object
  };

  // Get the current value ID (handles both object and string cases)
  const currentValueId = typeof props.value === "object" ? props.value?._id : props.value;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <select
          name="university"
          value={currentValueId || ""}
          onChange={handleChange}
          className={`${CommonClassForInput + inputClassName} !bg-transparent !h-auto outline-none capitalize`}
          disabled={props.disabled}
        >
          <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="">
            {props.placeholder}
          </option>
          {universityList.map((university) => (
            <option key={university._id} className="textColor capitalize text-xs 3xl:text-sm dark:!bg-black dark:text-white" value={university._id}>
              {university.name}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

export const FacultyDropDown = ({ value, onChange, universityId, disabled, placeholder, className }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (universityId) {
      dispatch(getAllFaculty()); // Fetch all faculties (or consider adding a filtered endpoint)
    }
  }, [dispatch, universityId]);

  const { facultys, loading } = useSelector((state) => state.faculty);
  const facultyList = facultys?.facultyList || [];

  // Filter faculties based on selected universityId
  const filteredFacultyList = universityId ? facultyList.filter((faculty) => faculty?.university?._id === universityId) : [];

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedFaculty = filteredFacultyList.find((faculty) => faculty._id === selectedId);
    onChange(selectedFaculty);
  };

  const currentValueId = typeof value === "object" ? value?._id : value;

  return loading ? (
    <Loader />
  ) : (
    <select
      name="faculty"
      value={currentValueId || ""}
      onChange={handleChange}
      className={`${CommonClassForInput + inputClassName} ${className} !bg-transparent !h-auto outline-none capitalize`}
      disabled={disabled || !universityId}
    >
      <option className="textColor capitalize text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="">
        {placeholder}
      </option>
      {filteredFacultyList.map((faculty) => (
        <option className="textColor capitalize text-xs 3xl:text-sm dark:!bg-black dark:text-white" key={faculty._id} value={faculty._id}>
          {faculty.name}
        </option>
      ))}
    </select>
  );
};

export const ProgramDropDown = ({ value, onChange, facultyId, disabled, placeholder, className }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (facultyId) {
      dispatch(getAllProgram()); // Fetch all programs (or consider adding a filtered endpoint)
    }
  }, [dispatch, facultyId]);

  const { programs, loading } = useSelector((state) => state.program);
  const programList = programs?.programList || [];

  // Filter programs based on selected facultyId
  const filteredProgramList = facultyId ? programList.filter((program) => program?.faculty?._id === facultyId) : [];

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedProgram = filteredProgramList.find((program) => program._id === selectedId);
    onChange(selectedProgram);
  };

  const currentValueId = typeof value === "object" ? value?._id : value;

  return loading ? (
    <Loader />
  ) : (
    <select
      name="program"
      value={currentValueId || ""}
      onChange={handleChange}
      className={`${CommonClassForInput + inputClassName} ${className} !bg-transparent !h-auto outline-none capitalize`}
      disabled={disabled || !facultyId}
    >
      <option className="textColor capitalize text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="">
        {placeholder}
      </option>
      {filteredProgramList.map((program) => (
        <option className="textColor capitalize text-xs 3xl:text-sm dark:!bg-black dark:text-white" key={program._id} value={program._id}>
          {program.name}
        </option>
      ))}
    </select>
  );
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
