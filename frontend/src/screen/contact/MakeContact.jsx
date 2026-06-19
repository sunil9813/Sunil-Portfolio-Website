import { TertiaryButton } from "@/components/customeUI/Button";
import { Input } from "@/components/customeUI/Input";
import { InputLabel, InputTitle } from "@/components/customeUI/Title";
import { createTestimonial, getAllTestimonial } from "@/redux/slices/portfolio/testimonialSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiPhoneCall, BiWorld } from "react-icons/bi";
import { BsFillBuildingsFill, BsStars } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { FaFolder } from "react-icons/fa";
import { IoCameraSharp, IoMailUnread } from "react-icons/io5";
import { MdClose, MdLocationPin } from "react-icons/md";
import { PiHandbagFill } from "react-icons/pi";
import { TbCurrencyDollar } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const inputClassName =
  "w-full h-11 3xl:h-12 px-5 textColor textSizeSm border border-gray-100 dark:border-gray-50/10 focus:border-gray-200 dark:focus:border-gray-50/40 rounded-full placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50";

const initialState = {
  fullname: "",
  position: "",
  company: "",
  location: "",
  content: "",
  email: "",
  phone: "",
  rating: "",
  link: "",
  cost: "",
  type: "contact",
};

export const MakeContact = () => {
  const avatarInputRef = useRef(null);
  const resourceInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [testimonial, setTestimonial] = useState(initialState);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [resourceFile, setResourceFile] = useState(null);
  const [resourcePreview, setResourcePreview] = useState(null);
  const [resourceFileError, setResourceFileError] = useState("");

  const { fullname, position, company, location, content, email, phone, rating, link, cost, type } = testimonial;
  // const { isLoading } = useSelector((state) => state.testimonial);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestimonial({ ...testimonial, [name]: value });
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (resourcePreview) URL.revokeObjectURL(resourcePreview);
    };
  }, [avatarPreview, resourcePreview]);

  const isImageValid = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return allowedFormats.includes(file.type);
  };
  const isResourceFileValid = (file) => {
    return file.type === "application/pdf";
  };

  const handleAvatarChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!isImageValid(selectedFile)) {
        toast.error("Avatar must be a PNG, JPEG, or JPG image.");
        return;
      }
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("Avatar file size exceeds 2MB limit.");
        return;
      }
      setAvatar(selectedFile);
      setAvatarPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleResourceFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isResourceFileValid(file)) {
        toast.error("Resource file must be a PDF.");
        setResourceFileError("Resource file must be a PDF.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Resource file size exceeds 5MB limit.");
        setResourceFileError("Resource file size exceeds 5MB limit.");
        return;
      }
      setResourceFile(file);
      setResourcePreview(URL.createObjectURL(file));
      setResourceFileError("");
    }
  };

  const handleDropAvatar = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleAvatarChange({ target: { files: [file] } });
  }, []);

  const handleDropResource = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleResourceFileChange({ target: { files: [file] } });
  }, []);

  const handleCreate = async () => {
    // Validate based on type
    if (!type) {
      toast.error("Please select a purpose of message (type).");
      return;
    }

    // Common field validations
    const commonFields = { fullname, email, phone, location, content };
    for (const [key, value] of Object.entries(commonFields)) {
      if (!value.trim()) {
        toast.error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required.`);
        return;
      }
    }

    // Type-specific validations
    if (type === "feedback") {
      if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
        toast.error("Rating is required for feedback and must be between 1 and 5.");
        return;
      }
      if (!position.trim()) {
        toast.error("Designation is required for feedback.");
        return;
      }
      if (!company.trim()) {
        toast.error("Company name is required for feedback.");
        return;
      }
      if (!link.trim()) {
        toast.error("Website URL is required for feedback.");
        return;
      }
      if (cost.trim()) {
        toast.error("Cost is not allowed for feedback.");
        return;
      }
      if (resourceFile) {
        toast.error("Project document is not allowed for feedback.");
        return;
      }
    } else if (type === "inquiry") {
      if (!position.trim()) {
        toast.error("Designation is required for inquiry.");
        return;
      }
      if (!company.trim()) {
        toast.error("Company name is required for inquiry.");
        return;
      }
      if (!link.trim()) {
        toast.error("Website URL is required for inquiry.");
        return;
      }
      if (!cost.trim()) {
        toast.error("Budget is required for inquiry.");
        return;
      }
      if (!resourceFile) {
        toast.error("Project document is required for inquiry.");
        return;
      }
      if (rating.trim()) {
        toast.error("Rating is not allowed for inquiry.");
        return;
      }
    } else if (type === "contact") {
      if (avatar) {
        toast.error("Avatar is not allowed for contact.");
        return;
      }
      if (resourceFile) {
        toast.error("Project document is not allowed for contact.");
        return;
      }
      if (rating.trim() || position.trim() || company.trim() || link.trim() || cost.trim()) {
        toast.error("Rating, designation, company, website URL, and budget are not allowed for contact.");
        return;
      }
    }

    try {
      const formData = new FormData();
      if (fullname.trim()) formData.append("fullname", fullname);
      if (position.trim()) formData.append("position", position);
      if (company.trim()) formData.append("company", company);
      if (content.trim()) formData.append("content", content);
      if (email.trim()) formData.append("email", email);
      if (location.trim()) formData.append("location", location);
      if (phone.trim()) formData.append("phone", phone);
      if (rating.trim()) formData.append("rating", rating);
      if (link.trim()) formData.append("link", link);
      if (cost.trim()) formData.append("cost", cost);
      if (type.trim()) formData.append("type", type);
      if (avatar) formData.append("avatar", avatar);
      if (resourceFile) formData.append("projectDoc", resourceFile);

      const resultAction = await dispatch(createTestimonial(formData));
      if (createTestimonial.fulfilled.match(resultAction)) {
        await dispatch(getAllTestimonial());
        setTestimonial(initialState);
        setAvatar(null);
        setAvatarPreview(null);
        setResourceFile(null);
        setResourcePreview(null);
        navigate("/contact");
      } else {
        toast.error(resultAction.payload?.error);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while submitting.");
    }
  };
  return (
    <>
      <div className="contact-form">
        <div className="p-5 mb-3 bg-[#1413133d] rounded-2xl">
          <div className="input">
            <InputTitle className="my-2 mb-4">Purpose of Message</InputTitle>
            <select name="type" className={`${inputClassName} !px-2 outline-none bg-transparent`} value={type} onChange={handleInputChange}>
              <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="contact">
                What can we help you with?
              </option>
              <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="contact">
                General Contact
              </option>
              <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="inquiry">
                Project Inquiry
              </option>
              <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="feedback">
                Share Feedback
              </option>
            </select>
          </div>
        </div>
        <section className="flex flex-col lg:flex-row justify-between gap-3">
          <div className="w-full lg:w-2/3">
            <div className="p-5 bg-[#1413133d] rounded-2xl">
              <InputTitle className="mb-1">Contact details</InputTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input">
                  <div className="flex items-center gap-1">
                    <InputLabel className="my-2">Full Name</InputLabel>
                  </div>
                  <div className="relative">
                    <Input type="text" name="fullname" className="pl-12" value={fullname} handleChange={handleInputChange} placeholder="John Doe" />
                    <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-green-500 rounded-full flexC text-white absolute top-1 left-1">
                      <CiUser size={18} />
                    </div>
                  </div>
                </div>
                <div className="input">
                  <div className="flex items-center gap-1">
                    <InputLabel className="my-2">Email</InputLabel>
                  </div>
                  <div className="relative">
                    <Input type="email" name="email" className="pl-12" value={email} handleChange={handleInputChange} placeholder="example@gmail.com" />
                    <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-teal-500 rounded-full flexC text-white absolute top-1 left-1">
                      <IoMailUnread size={18} />
                    </div>
                  </div>
                </div>
                <div className="input">
                  <div className="flex items-center gap-1">
                    <InputLabel className="my-2">Address</InputLabel>
                  </div>
                  <div className="relative">
                    <Input type="text" name="location" className="pl-12" value={location} handleChange={handleInputChange} placeholder="Searcy, AR, USA" />
                    <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-purple-500 rounded-full flexC text-white absolute top-1 left-1">
                      <MdLocationPin size={18} />
                    </div>
                  </div>
                </div>
                <div className="input">
                  <div className="flex items-center gap-1">
                    <InputLabel className="my-2">Phone</InputLabel>
                  </div>
                  <div className="relative">
                    <Input type="text" name="phone" className="pl-12" value={phone} handleChange={handleInputChange} placeholder="Searcy, AR, USA" />
                    <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-blue-500 rounded-full flexC text-white absolute top-1 left-1">
                      <BiPhoneCall size={18} />
                    </div>
                  </div>
                </div>
              </div>
              {(type === "feedback" || type === "inquiry") && (
                <>
                  <div className="input mt-5">
                    <div className="flex items-center gap-1">
                      <InputLabel className="my-2">Website URL</InputLabel>
                    </div>
                    <div className="relative">
                      <Input type="text" name="link" className="pl-12" value={link} handleChange={handleInputChange} placeholder="www.example.com" />
                      <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-slate-500 rounded-full flexC text-white absolute top-1 left-1">
                        <BiWorld size={18} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {(type === "feedback" || type === "inquiry") && (
              <div className="p-5 py-7 mt-3 bg-[#1413133d] rounded-2xl">
                <div className="input">
                  <div className="flex items-center gap-1">
                    <InputLabel className="my-2">Company Name</InputLabel>
                  </div>
                  <div className="relative">
                    <Input type="text" name="company" className="pl-12" value={company} handleChange={handleInputChange} placeholder="Google, Apple" />
                    <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-stone-500 rounded-full flexC text-white absolute top-1 left-1">
                      <BsFillBuildingsFill size={18} />
                    </div>
                  </div>
                </div>
                <div className="input pt-3">
                  <div className="flex items-center gap-1">
                    <InputLabel className="my-2">Designation</InputLabel>
                  </div>
                  <div className="relative">
                    <Input type="text" name="position" className="pl-12" value={position} handleChange={handleInputChange} placeholder="Manager" />
                    <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-red-500 rounded-full flexC text-white absolute top-1 left-1">
                      <PiHandbagFill size={18} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {type === "feedback" && (
              <div className="p-5 w-full my-5 bg-[#1413138b] rounded-2xl">
                <div className="input">
                  <div className="flex items-center gap-1">
                    <InputTitle className="my-2">Rating (1-5)</InputTitle>
                  </div>
                  <div className="relative">
                    <Input type="number" name="rating" className="pl-12" value={rating} handleChange={handleInputChange} placeholder="5" min="1" max="5" />
                    <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-amber-300 rounded-full flexC text-white absolute top-1 left-1">
                      <BsStars size={18} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {type === "inquiry" && (
              <>
                <div className="p-5 w-full my-3 bg-[#1413133d] rounded-2xl">
                  <div className="input">
                    <div className="flex items-center gap-1">
                      <InputTitle className="my-2">Budget of Project</InputTitle>
                    </div>
                    <div className="relative">
                      <Input type="string" name="cost" className="pl-12" value={cost} handleChange={handleInputChange} />
                      <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-amber-300 rounded-full flexC text-white absolute top-1 left-1">
                        <TbCurrencyDollar size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="w-full lg:w-1/3">
            <div className="p-5 w-full bg-[#1413133d] rounded-2xl">
              <InputTitle className="mb-4">Message</InputTitle>
              <textarea
                className="w-full p-5 textColor textSizeSm bg-gray-900/5 dark:bg-gray-500/5 border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-xl placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50"
                name="content"
                placeholder="Write your message here..."
                value={content}
                onChange={handleInputChange}
                rows={type === "contact" ? 6 : 12}
              ></textarea>
            </div>
            {(type === "feedback" || type === "inquiry") && (
              <div className="p-5 w-full my-3 bg-[#1413133d] rounded-2xl">
                <InputTitle className="mb-4">Avatar Image</InputTitle>
                <div
                  onDrop={handleDropAvatar}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center w-full h-72 transition cursor-pointer dark:bg-gray-500/5 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
                >
                  {avatarPreview ? (
                    <div className="relative w-full h-72 flex items-center justify-center">
                      <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full rounded-3xl object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAvatar(null);
                          setAvatarPreview(null);
                        }}
                        className="absolute top-3 right-3 shadow-xl bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        title="Remove Avatar"
                        aria-label="Remove avatar image"
                      >
                        <MdClose />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 p-5 text-center">
                      <IoCameraSharp size={30} />
                      <p className="text-sm text-gray-500 dark:text-gray-400 textSizeSm">
                        Drag and drop an image or
                        <span className="textColor font-medium cursor-pointer pl-1" onClick={() => avatarInputRef.current.click()}>
                          click to browse
                        </span>
                      </p>
                    </div>
                  )}
                  <input ref={avatarInputRef} id="avatar" type="file" name="avatar" className="hidden" onChange={handleAvatarChange} accept="image/png,image/jpeg,image/jpg" />
                </div>
              </div>
            )}
          </div>
        </section>

        {type === "inquiry" && (
          <>
            <div className="p-5 w-full mb-5 bg-[#1413133d] rounded-2xl">
              <InputTitle className="mb-4">Upload Files</InputTitle>
              <div className="input mt-4">
                <InputLabel className="my-2">Upload Resource File (Max 5MB - PDF)</InputLabel>
                <div
                  onDrop={handleDropResource}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center w-full h-56 transition cursor-pointer dark:bg-gray-500/5 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
                >
                  {resourcePreview ? (
                    <div className="relative w-full h-56 flex flex-col items-center justify-center p-4">
                      <div className="flex items-center gap-2">
                        <FaFolder size={30} />
                        <span className="text-sm font-medium text-ellipsis overflow-hidden max-w-[200px]">{resourceFile?.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">{(resourceFile?.size / (1024 * 1024)).toFixed(2)} MB</span>
                      <button
                        onClick={() => {
                          setResourceFile(null);
                          setResourcePreview(null);
                          setResourceFileError("");
                        }}
                        className="absolute top-3 right-3 shadow-xl bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        title="Remove Resource"
                      >
                        <MdClose />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 p-5 text-center">
                      <FaFolder size={30} />
                      <p className="text-sm text-gray-500 dark:text-gray-400 textSizeSm">
                        Drag and drop a PDF file or
                        <span className="textColor font-medium cursor-pointer pl-1" onClick={() => resourceInputRef.current.click()}>
                          click to browse
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">Max 5MB</p>
                    </div>
                  )}
                  <input ref={resourceInputRef} id="resourceFile" type="file" name="resourceFile" className="hidden" onChange={handleResourceFileChange} accept="application/pdf" />
                </div>
                {resourceFile && (
                  <p className="text-xs mt-2 text-gray-500">
                    File type: {resourceFile.type || "Unknown"} | Size: {(resourceFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}
                {resourceFileError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{resourceFileError}</p>}
              </div>
            </div>
          </>
        )}

        <TertiaryButton className="mt-8" onClick={handleCreate}>
          Submit
        </TertiaryButton>
      </div>
    </>
  );
};
