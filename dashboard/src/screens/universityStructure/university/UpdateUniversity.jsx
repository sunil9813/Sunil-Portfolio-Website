import { updateUniversity, getAllUniversity, getUniversity } from "@/redux/slices/universityStructure/universitySlice";
import Editor from "@/textEditor/Editor";
import { inputClassName } from "@/utils";
import { GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, Wrapper } from "@/utils/Router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiWorld } from "react-icons/bi";
import { CiCalendar } from "react-icons/ci";
import { FaUniversity } from "react-icons/fa";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose, MdLocationPin } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  name: "",
  description: "",
  edate: "",
  location: "",
  website: "",
  type: "",
};

export const UpdateUniversity = () => {
  const logoInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [university, setUniversity] = useState(initialState);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { name, edate, location, website, type } = university;

  // Get data from Redux store
  const { university: currentUniversity } = useSelector((state) => state.university);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await dispatch(getUniversity(slug));
        await dispatch(getAllUniversity());
      } catch (error) {
        toast.error(error || "Failed to load university data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dispatch, slug]);

  // Set initial values when currentUniversity is available
  useEffect(() => {
    if (currentUniversity) {
      setUniversity({
        name: currentUniversity.name || "",
        description: currentUniversity.description || "",
        edate: currentUniversity.edate || "",
        location: currentUniversity.location || "",
        website: currentUniversity.website || "",
        type: currentUniversity.type || "",
        groupId: currentUniversity.groupId || "",
      });
      setDescription(currentUniversity.description || "");
      setLogoPreview(currentUniversity.logo?.filePath || "");
    }
  }, [currentUniversity]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const isImageValid = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return allowedFormats.includes(file.type);
  };

  const handleLogoChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!isImageValid(selectedFile)) {
        toast.error("Logo must be a PNG, JPEG, or JPG image.");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Logo file size exceeds 10MB limit.");
        return;
      }
      setLogo(selectedFile);
      setLogoPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDropLogo = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleLogoChange({ target: { files: [file] } });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUniversity({ ...university, [name]: value });
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("University name is required");
      return;
    }

    if (!type) {
      toast.error("University type is required");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("edate", edate);
      formData.append("location", location);
      formData.append("website", website);
      formData.append("type", type);

      if (logo) {
        formData.append("logo", logo);
      }

      await dispatch(updateUniversity({ slug, formData })).unwrap();
      await dispatch(getAllUniversity());
      navigate("/all-university");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !currentUniversity) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <StickyHeader>
        <HeadingTwo>Update University</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton onClick={() => navigate("/all-university")}>Cancel</GhostButton>
          <TertiaryButton onClick={handleUpdate}>Update University</TertiaryButton>
        </div>
      </StickyHeader>

      <section className="flex justify-between gap-3">
        <div className="w-2/3">
          <Wrapper className="p-5 h-full">
            <InputTitle className="mb-4">University details</InputTitle>

            <div className="input">
              <InputLabel className="my-2">Name</InputLabel>
              <div className="relative">
                <Input type="text" name="name" className="pl-12" value={name} handleChange={handleInputChange} placeholder="University name" />
                <div className="icon h-9 w-9 bg-green-300 rounded-full flexC text-white absolute top-1 left-1">
                  <FaUniversity size={18} />
                </div>
              </div>
            </div>

            <div className="input py-3">
              <InputLabel className="my-2">Address</InputLabel>
              <div className="relative">
                <Input type="text" name="location" className="pl-12" value={location} handleChange={handleInputChange} placeholder="Searcy, AR, USA" />
                <div className="icon h-9 w-9 bg-purple-300 rounded-full flexC text-white absolute top-1 left-1">
                  <MdLocationPin size={18} />
                </div>
              </div>
            </div>

            <div className="input">
              <InputLabel className="my-2">Website URL</InputLabel>
              <div className="relative">
                <Input type="text" name="website" className="pl-12" value={website} handleChange={handleInputChange} placeholder="www.example.com" />
                <div className="icon h-9 w-9 bg-blue-300 rounded-full flexC text-white absolute top-1 left-1">
                  <BiWorld size={18} />
                </div>
              </div>
            </div>

            <div className="input py-3">
              <InputLabel className="my-2">Type</InputLabel>
              <select name="type" className={`${inputClassName} !px-2 outline-none bg-transparent`} value={type} onChange={handleInputChange} required>
                <option value="">Select Type</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Autonomous">Autonomous</option>
              </select>
            </div>
          </Wrapper>
        </div>

        <div className="w-1/3">
          <Wrapper className="p-5 w-full">
            <InputTitle className="mb-4">Logo Image</InputTitle>
            <div
              onDrop={handleDropLogo}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center w-full h-64 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
              onClick={() => logoInputRef.current.click()}
            >
              {logoPreview ? (
                <div className="relative w-full h-64 flex items-center justify-center">
                  <img src={logoPreview} alt="Logo Preview" className="w-full h-full rounded-3xl object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogo(null);
                      setLogoPreview(currentUniversity.logo?.filePath || "");
                    }}
                    className="absolute top-3 right-3 shadow-xl bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove Logo"
                    aria-label="Remove logo image"
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
              <input ref={logoInputRef} id="logo" type="file" name="logo" className="hidden" onChange={handleLogoChange} accept="image/png,image/jpeg,image/jpg" />
            </div>
          </Wrapper>

          <Wrapper className="p-5 w-full mt-3">
            <div className="input">
              <InputLabel className="my-2">Founded</InputLabel>
              <div className="relative">
                <Input type="text" name="edate" className="pl-12" value={edate} handleChange={handleInputChange} placeholder="1999 August 24" />
                <div className="icon h-9 w-9 bg-teal-300 rounded-full flexC text-white absolute top-1 left-1">
                  <CiCalendar size={18} />
                </div>
              </div>
            </div>
          </Wrapper>
        </div>
      </section>

      <Wrapper className="p-5 mt-3">
        <InputTitle className="mb-4">Description</InputTitle>
        <Editor customId={currentUniversity.groupId} value={description} onChange={setDescription} folderName="university/description" folder="university" subfolder="description" />
      </Wrapper>
    </>
  );
};
