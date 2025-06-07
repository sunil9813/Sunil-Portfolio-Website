import { GhostButton, HeadingTwo, StickyHeader, TertiaryButton, Wrapper } from "@/utils/Router";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { FaAward, FaBriefcase, FaChalkboardTeacher, FaCode, FaGraduationCap, FaTrophy, FaUserFriends } from "react-icons/fa";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { getResume, updateResume } from "@/redux/slices/portfolio/resumeSlice";
import { AchievementsStep, AwardStep, EducationStep, ExperienceStep, ReferenceStep, SkillsStep, TrainingStep, UseColorManager } from "./CreateResume";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Item Component
export const SortableItem = ({ id, children, section }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const { getColorForId } = UseColorManager();
  const colors = getColorForId(section, id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: colors.bg,
    borderColor: colors.border,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative border p-4 rounded-xl ${isDragging ? "shadow-lg" : ""}`} {...attributes}>
      {children({ dragHandleProps: listeners })}
    </div>
  );
};

// Main UpdateResume Component
export const UpdateResume = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { resume, loading, error } = useSelector((state) => state.resume);

  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { name: "Education", icon: <FaGraduationCap />, show: true, component: EducationStep },
    { name: "Experience", icon: <FaBriefcase />, show: true, component: ExperienceStep },
    { name: "Skills", icon: <FaCode />, show: true, component: SkillsStep },
    { name: "Achievements", icon: <FaTrophy />, show: true, component: AchievementsStep },
    { name: "Training", icon: <FaChalkboardTeacher />, show: true, component: TrainingStep },
    { name: "Award", icon: <FaAward />, show: true, component: AwardStep },
    { name: "Reference", icon: <FaUserFriends />, show: true, component: ReferenceStep },
  ].filter((step) => step.show);

  const [formData, setFormData] = useState({
    education: [],
    experience: [],
    skills: [],
    achievements: [],
    training: [],
    award: [],
    reference: [],
  });

  const [deletedIds, setDeletedIds] = useState({
    education: [],
    experience: [],
    skills: [],
    achievements: [],
    training: [],
    award: [],
    reference: [],
  });

  // Fetch resume data on mount
  useEffect(() => {
    if (id) {
      dispatch(getResume(id));
    }
  }, [dispatch, id]);

  // Populate form with fetched resume data
  useEffect(() => {
    if (resume && resume._id === id) {
      setFormData({
        education: resume.education?.map((item) => ({ ...item, id: uuidv4() })) || [],
        experience: resume.experience?.map((item) => ({ ...item, id: uuidv4() })) || [],
        skills: resume.skills?.map((item) => ({ ...item, id: uuidv4() })) || [],
        achievements: resume.achievements?.map((item) => ({ ...item, id: uuidv4() })) || [],
        training: resume.training?.map((item) => ({ ...item, id: uuidv4() })) || [],
        award: resume.award?.map((item) => ({ ...item, id: uuidv4(), receivedYear: item.recievedYear })) || [],
        reference: resume.reference?.map((item) => ({ ...item, id: uuidv4() })) || [],
      });
      // Reset deletedIds when fetching new resume data
      setDeletedIds({
        education: [],
        experience: [],
        skills: [],
        achievements: [],
        training: [],
        award: [],
        reference: [],
      });
    }
  }, [resume, id]);

  // Initialize one entry for each field if empty
  useEffect(() => {
    const defaults = {
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
      skills: { id: uuidv4(), name: "", progress: "" },
      achievements: { id: uuidv4(), title: "", description: "" },
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

    setFormData((prev) => ({
      ...prev,
      education: prev.education.length === 0 ? [defaults.education] : prev.education,
      experience: prev.experience.length === 0 ? [defaults.experience] : prev.experience,
      skills: prev.skills.length === 0 ? [defaults.skills] : prev.skills,
      achievements: prev.achievements.length === 0 ? [defaults.achievements] : prev.achievements,
      training: prev.training.length === 0 ? [defaults.training] : prev.training,
      award: prev.award.length === 0 ? [defaults.award] : prev.award,
      reference: prev.reference.length === 0 ? [defaults.reference] : prev.reference,
    }));
  }, []);

  // Handle input changes for array fields
  const handleInputChange = (fieldName, indexOrItems, field, value) => {
    if (Array.isArray(indexOrItems)) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: indexOrItems,
      }));
    } else {
      const updatedArray = [...formData[fieldName]];
      updatedArray[indexOrItems] = {
        ...updatedArray[indexOrItems],
        [field]: value,
      };
      setFormData({
        ...formData,
        [fieldName]: updatedArray,
      });
    }
  };

  // Add new entry to a field
  const addEntry = (fieldName) => {
    const defaults = {
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
      skills: { id: uuidv4(), name: "", progress: "" },
      achievements: { id: uuidv4(), title: "", description: "" },
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

    setFormData({
      ...formData,
      [fieldName]: [...formData[fieldName], defaults[fieldName]],
    });
  };

  // Remove entry and track deleted _id
  const removeEntry = (fieldName, index) => {
    const entry = formData[fieldName][index];
    if (entry._id) {
      setDeletedIds((prev) => ({
        ...prev,
        [fieldName]: [...prev[fieldName], entry._id],
      }));
    }
    const updatedArray = formData[fieldName].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [fieldName]: updatedArray,
    });
  };

  // Form submission
  const onSubmit = async () => {
    try {
      const payload = { ...formData, deletedIds };

      // Preserve _id for existing entries, remove temporary id
      Object.keys(payload).forEach((key) => {
        if (Array.isArray(payload[key]) && key !== "deletedIds") {
          payload[key] = payload[key]
            .filter((item) => Object.values(item).some((val) => val && val.toString().trim()))
            .map(({ ...rest }) => ({
              ...rest,
              ...(rest._id ? { _id: rest._id } : {}),
              ...(key === "award" && rest.receivedYear ? { recievedYear: rest.receivedYear } : {}),
              ...(key === "award" ? { receivedYear: undefined } : {}),
            }));
        }
      });

      await dispatch(updateResume({ id, data: payload })).unwrap();
      navigate("/resume");
    } catch (error) {
      const errorMessage = error.message || "Failed to update resume";
      toast.error(errorMessage);
    }
  };

  // Navigation between steps
  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Navigate to specific step on icon click
  const goToStep = (index) => {
    setCurrentStep(index);
  };

  // Render form fields for each step
  const renderStep = () => {
    const StepComponent = steps[currentStep].component;
    const fieldName = steps[currentStep].name.toLowerCase().replace(/\s+/g, "");
    return <StepComponent fields={formData[fieldName]} handleInputChange={handleInputChange} addEntry={addEntry} removeEntry={removeEntry} />;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <StickyHeader>
        <HeadingTwo>Update Resume</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton onClick={() => navigate("/resume")}>Cancel</GhostButton>
          <TertiaryButton onClick={onSubmit}>Update Resume</TertiaryButton>
        </div>
      </StickyHeader>
      <Wrapper className="w-full rounded-none !rounded-t-md py-2 mb-3">
        <div className="stepper">
          {steps.map((step, index) => (
            <div
              key={step.name}
              className={`stepper__step ${index <= currentStep ? "stepper__step--completed" : ""} ${index === currentStep ? "stepper__step--current" : ""}`}
              style={{ width: `${100 / steps.length}%`, cursor: "pointer" }}
              onClick={() => goToStep(index)}
              title={step.name}
            >
              <div className="stepper__step-content">
                <div className="stepper__step-icon">
                  <span className="stepper__step-icon-inner">
                    {index < currentStep ? (
                      <svg viewBox="0 0 24 24" className="stepper__checkmark">
                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </span>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="stepper__connector">
                  <div className="stepper__connector-progress" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Wrapper>
      <Wrapper className="rounded-md mb-5">
        {renderStep()}
        <div className="absolute top-0 right-0 m-2.5 flex items-center gap-3">
          <button type="button" onClick={prevStep} disabled={currentStep === 0} className="button">
            Previous
          </button>
          <button type="button" onClick={nextStep} className="button" disabled={currentStep === steps.length - 1}>
            Next
          </button>
        </div>
      </Wrapper>
    </>
  );
};

// PropTypes
SortableItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  gridCols: PropTypes.number,
};
