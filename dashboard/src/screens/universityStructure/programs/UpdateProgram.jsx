import { getAllFaculty } from "@/redux/slices/universityStructure/facultySlice";
import { getAllProgram, getProgram, updateProgram } from "@/redux/slices/universityStructure/programSlice";
import { getAllUniversity } from "@/redux/slices/universityStructure/universitySlice";
import Editor from "@/textEditor/Editor";
import { FacultyDropDown, GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, UniversityDropDown, Wrapper } from "@/utils/Router";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  name: "",
  description: "",
  university: "",
  faculty: "",
};

export const UpdateProgram = () => {
  const thumbnailInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [program, setProgram] = useState(initialState);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { name, university, faculty } = program;

  // Get data from Redux store
  const { program: currentProgram } = useSelector((state) => state.program);
  const { universitys } = useSelector((state) => state.university);
  const { universityList } = universitys || {};

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await dispatch(getProgram(slug));
        await dispatch(getAllFaculty());
        await dispatch(getAllUniversity());
      } catch (error) {
        toast.error(error || "Failed to load program data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dispatch, slug]);

  // Set initial values when currentProgram is available
  useEffect(() => {
    if (currentProgram) {
      setProgram({
        name: currentProgram.name || "",
        description: currentProgram.description || "",
        university: currentProgram.university?._id || "",
        faculty: currentProgram.faculty?._id || "",
      });
      setDescription(currentProgram.description || "");
      setThumbnailPreview(currentProgram.thumbnail?.filePath || "");

      if (currentProgram.university) {
        setSelectedUniversity({
          _id: currentProgram.university._id,
          name: currentProgram.university.name,
        });
      }
      if (currentProgram.faculty) {
        setSelectedFaculty({
          _id: currentProgram.faculty._id,
          name: currentProgram.faculty.name,
        });
      }
    }
  }, [currentProgram]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProgram({ ...program, [name]: value });
  };

  const handleUniversityChange = (selectedUniversity) => {
    setSelectedUniversity(selectedUniversity);
    setSelectedFaculty(null); // Reset faculty when university changes
    setProgram((prev) => ({
      ...prev,
      university: selectedUniversity?._id || "",
      faculty: "", // Clear faculty when university changes
    }));
  };

  const handleFacultyChange = (selectedFaculty) => {
    setSelectedFaculty(selectedFaculty);
    setProgram((prev) => ({
      ...prev,
      faculty: selectedFaculty?._id || "",
    }));
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Program name is required");
      return;
    }

    if (!university) {
      toast.error("University is required");
      return;
    }

    if (!faculty) {
      toast.error("Faculty is required");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("university", university);
      formData.append("faculty", faculty);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      await dispatch(updateProgram({ slug, formData })).unwrap();
      await dispatch(getAllProgram());
      navigate("/all-program");
    } catch (error) {
      toast.error(error.message || "Failed to update program");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !currentProgram) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <StickyHeader>
        <HeadingTwo>Update Program</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton onClick={() => navigate("/all-program")}>Cancle</GhostButton>
          <TertiaryButton onClick={handleUpdate}>Update Program</TertiaryButton>
        </div>
      </StickyHeader>

      <section className="flex justify-between gap-3">
        <div className="w-2/3">
          <Wrapper className="p-5 h-full">
            <InputTitle className="mb-4">Program details</InputTitle>

            <div className="input">
              <InputLabel className="my-2">University</InputLabel>
              <div className="relative">
                <UniversityDropDown value={selectedUniversity} onChange={handleUniversityChange} options={universityList || []} placeholder="Select University" />
              </div>
            </div>

            <div className="input py-3">
              <InputLabel className="my-2">Faculty</InputLabel>
              <div className="relative">
                <FacultyDropDown
                  value={selectedFaculty}
                  onChange={handleFacultyChange}
                  universityId={selectedUniversity?._id} // Pass the selected university ID
                  placeholder="Select Faculty"
                  disabled={!selectedUniversity} // Disable if no university is selected
                />
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
              onClick={() => thumbnailInputRef.current.click()}
            >
              {thumbnailPreview ? (
                <div className="relative w-full h-64 flex items-center justify-center">
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full rounded-3xl object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setThumbnail(null);
                      setThumbnailPreview(currentProgram.thumbnail?.filePath || "");
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Drag and drop an image or
                    <span className="textColor font-medium cursor-pointer pl-1">click to browse</span>
                  </p>
                </div>
              )}
              <input ref={thumbnailInputRef} id="thumbnail" type="file" name="thumbnail" className="hidden" onChange={handleThumbnailChange} accept="image/png,image/jpeg,image/jpg" />
            </div>
          </Wrapper>
        </div>
      </section>

      <Wrapper className="p-5 mt-3">
        <InputTitle className="mb-4">Description</InputTitle>
        <Editor customId={currentProgram.groupId} value={description} onChange={setDescription} folderName="program/description" folder="program" subfolder="description" />
      </Wrapper>
    </>
  );
};
