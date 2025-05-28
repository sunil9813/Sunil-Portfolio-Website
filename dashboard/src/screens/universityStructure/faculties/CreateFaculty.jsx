import { Input, TertiaryButton, Wrapper } from "@/utils/Router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UniversityDropDown } from "../StructureAcademicDropDown";
import { toast } from "react-toastify";
import { createFaculty, getAllFaculty } from "@/redux/slices/universityStructure/facultySlice";
import { getAllUniversity } from "@/redux/slices/universityStructure/universitySlice";

export const CreateFaculty = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [selectedUniversityId, setSelectedUniversityId] = useState("");

  // Get universities from Redux store
  const { universitys } = useSelector((state) => state.university);
  const { universityList } = universitys;

  useEffect(() => {
    // Load both faculties and universities
    dispatch(getAllFaculty());
    dispatch(getAllUniversity());
  }, [dispatch]);

  const handleCreate = async () => {
    if (!name.trim()) {
      return toast.error("Please enter faculty name");
    }
    if (!selectedUniversityId) {
      return toast.error("Please select a university");
    }

    try {
      await dispatch(
        createFaculty({
          name,
          university: selectedUniversityId,
        })
      );

      toast.success("Faculty created successfully!");
      setName("");
      setSelectedUniversityId("");

      // Refresh faculties list
      dispatch(getAllFaculty());
    } catch (error) {
      toast.error("Failed to create faculty");
      console.error("Faculty creation error:", error);
    }
  };

  const handleUniversityChange = (selectedOption) => {
    setSelectedUniversityId(selectedOption._id);
  };

  return (
    <Wrapper className="p-5 flex justify-between items-center gap-5 rounded-lg">
      <div className="flex justify-between items-center w-full gap-5">
        <div className="input w-full">
          <UniversityDropDown value={selectedUniversityId} onChange={handleUniversityChange} options={universityList} placeholder="Select University" />
        </div>
        <div className="input w-full">
          <Input type="text" name="name" value={name} handleChange={(e) => setName(e.target.value)} placeholder="Faculty Name (e.g., Bachelor of Information Technology)" />
        </div>
      </div>
      <div className="input w-40">
        <TertiaryButton onClick={handleCreate}>Publish now</TertiaryButton>
      </div>
    </Wrapper>
  );
};
