import { getAllFaculty } from "@/redux/slices/universityStructure/facultySlice";
import { createProgram, getAllProgram } from "@/redux/slices/universityStructure/programSlice";
import { getAllUniversity } from "@/redux/slices/universityStructure/universitySlice";
import Editor from "@/textEditor/Editor";
import { FacultyDropDown, GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, UniversityDropDown, Wrapper } from "@/utils/Router";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  name: "",
  description: "",
  groupId: "",
};

export const CreateProgram = () => {
  const thumbnailInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [program, setUniversity] = useState(initialState);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [groupId] = useState(uuidv4());
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const { name, university, faculty } = program;
  // const { isLoading } = useSelector((state) => state.program);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUniversity({ ...program, [name]: value });
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  // Get universities from Redux store
  const { universitys } = useSelector((state) => state.university);
  const { facultys } = useSelector((state) => state.faculty);
  const { facultyList } = facultys;
  const { universityList } = universitys;

  useEffect(() => {
    // Load both faculties and universities
    dispatch(getAllFaculty());
    dispatch(getAllUniversity());
  }, [dispatch]);

  const isImageValid = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return allowedFormats.includes(file.type);
  };

  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!isImageValid(selectedFile)) {
        toast.error("Thumbnail must be a PNG, JPEG, or JPG image.");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Thumbnail file size exceeds 10MB limit.");
        return;
      }
      setThumbnail(selectedFile);
      setThumbnailPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDropThumbnail = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleThumbnailChange({ target: { files: [file] } });
  }, []);

  const handleCreate = async () => {
    if (name.trim().length > 0 && thumbnail) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("groupId", groupId);
      formData.append("university", university);
      formData.append("faculty", faculty);
      formData.append("thumbnail", thumbnail);

      const resultAction = await dispatch(createProgram(formData));
      await dispatch(getAllProgram());
      if (createProgram.fulfilled.match(resultAction)) {
        setThumbnailPreview(null);
        setThumbnail(null);
        navigate("/all-program");
      }
    } else {
      toast.error("Please fill all input fields.");
    }
  };
  const handleUniversityChange = (selectedUniversity) => {
    setSelectedUniversity(selectedUniversity);
    setSelectedFaculty(null); // Reset faculty when university changes
    setUniversity((prev) => ({
      ...prev,
      university: selectedUniversity?._id || "",
      faculty: "", // Clear faculty when university changes
    }));
  };

  const handleFacultyChange = (selectedFaculty) => {
    setSelectedFaculty(selectedFaculty);
    setUniversity((prev) => ({
      ...prev,
      faculty: selectedFaculty?._id || "",
    }));
  };
  return (
    <>
      <StickyHeader>
        <HeadingTwo>Create Department</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton onClick={() => navigate("/all-University")}>Cancel</GhostButton>
          <TertiaryButton onClick={handleCreate}>Publish now</TertiaryButton>
        </div>
      </StickyHeader>

      <section className="flex justify-between gap-3">
        <div className="w-2/3">
          <Wrapper className="p-5 h-full">
            <InputTitle className="mb-4">Program details</InputTitle>

            <div className="input">
              <InputLabel className="my-2">University</InputLabel>
              <div className="relative">
                <UniversityDropDown value={selectedUniversity} onChange={handleUniversityChange} options={universityList} placeholder="Select University" />
              </div>
            </div>
            <div className="input py-3">
              <InputLabel className="my-2">Faculty</InputLabel>
              <div className="relative">
                <FacultyDropDown value={selectedFaculty} onChange={handleFacultyChange} options={facultyList} universityId={selectedUniversity?._id} placeholder="Select Faculty" />
              </div>
            </div>
            <div className="input">
              <div className="flex items-center gap-1">
                <InputLabel className="my-2">Name</InputLabel>
              </div>
              <div className="relative">
                <Input type="text" name="name" value={name} handleChange={handleInputChange} placeholder="BBA, BCA, BIT" />
              </div>
            </div>
          </Wrapper>
        </div>
        <div className="w-1/3">
          <Wrapper className="p-5 w-full">
            <InputTitle className="mb-4">Thumbnail Image</InputTitle>
            <div
              onDrop={handleDropThumbnail}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center w-full h-64 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
            >
              {thumbnailPreview ? (
                <div className="relative w-full h-64 flex items-center justify-center">
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full rounded-3xl object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setThumbnail(null);
                      setThumbnailPreview(null);
                    }}
                    className="absolute top-3 right-3 shadow-xl bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove Thumbnail"
                    aria-label="Remove thumbnail image"
                  >
                    <MdClose />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <IoCameraSharp size={30} />
                  <p className="text-sm text-gray-500 dark:text-gray-400 textSizeSm">
                    Drag and drop an image or
                    <span className="textColor font-medium cursor-pointer pl-1" onClick={() => thumbnailInputRef.current.click()}>
                      click to browse
                    </span>
                  </p>
                </div>
              )}
              <input ref={thumbnailInputRef} id="thumbnail" type="file" name="thumbnail" className="hidden" onChange={handleThumbnailChange} accept="image/png,image/jpeg,image/jpg" />
            </div>
          </Wrapper>
        </div>
      </section>
      <Wrapper className="p-5 mt-3">
        <Editor customId={groupId} value={description} onChange={setDescription} folderName="project/description" folder="project" subfolder="description" />
      </Wrapper>
    </>
  );
};
