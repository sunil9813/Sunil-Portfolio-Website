import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, Wrapper } from "@/utils/Router";
import { BiWorld } from "react-icons/bi";
import { IoCameraSharp, IoLanguageOutline } from "react-icons/io5";
import { MdClose, MdLocationPin } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BsTelephone } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { createIntro } from "@/redux/slices/portfolio/IntroSlice";
import { PiHandbagFill } from "react-icons/pi";
import { HiLink } from "react-icons/hi2";
import { LuNotepadTextDashed } from "react-icons/lu";

const initialState = {
  fullname: "",
  bio: "",
  description: "",
  position: "",
  country: "",
  address: "",
  emails: [], // Empty array to match backend default
  phones: [], // Empty array to match backend default
  languages: [], // Empty array to match backend default
  socialslinks: [], // Empty array to match backend default
};

export const CreateAbout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const cvInputRef = useRef(null);

  const [portfolioIntro, setPortfolioIntro] = useState(initialState);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [cv, setCv] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { bio, description, fullname, position, emails, phones, languages, country, address, socialslinks } = portfolioIntro;

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  // File validation (only checking file type and size, as backend handles other validations)
  const isImageValid = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return allowedFormats.includes(file.type);
  };

  const isCvValid = (file) => {
    const allowedFormats = ["application/pdf"];
    return allowedFormats.includes(file.type);
  };

  // Handle avatar file change
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

  // Handle CV file change
  const handleCvChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!isCvValid(selectedFile)) {
        toast.error("CV must be a PDF file.");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("CV file size exceeds 10MB limit.");
        return;
      }
      setCv(selectedFile);
    }
  };

  // Handle drag-and-drop for avatar
  const handleDropAvatar = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleAvatarChange({ target: { files: [file] } });
  }, []);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPortfolioIntro({ ...portfolioIntro, [name]: value });
  };

  // Handle array field changes (emails, phones, languages, socialslinks)
  const handleArrayChange = (index, field, key, value) => {
    const normalizedValue = field === "phones" ? value.trim().replace(/\s/g, "") : value.trim();
    const updatedArray = [...portfolioIntro[field]];
    updatedArray[index] = { ...updatedArray[index], [key]: normalizedValue };
    setPortfolioIntro({ ...portfolioIntro, [field]: updatedArray });
  };

  // Add new entry to array fields
  const addArrayField = (field, key) => {
    setPortfolioIntro({ ...portfolioIntro, [field]: [...portfolioIntro[field], { [key]: "" }] });
  };

  // Remove entry from array fields
  const removeArrayField = (field, index) => {
    const updatedArray = portfolioIntro[field].filter((_, i) => i !== index);
    setPortfolioIntro({ ...portfolioIntro, [field]: updatedArray });
  };

  // Handle form submission
  const handleCreate = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("fullname", fullname || "");
      formData.append("bio", bio || "");
      formData.append("description", description || "");
      formData.append("position", position || "");
      formData.append("country", country || "");
      formData.append("address", address || "");

      // Send emails, phones, languages, and social links as arrays
      emails
        .filter((emailObj) => emailObj.email)
        .forEach((emailObj, index) => {
          formData.append(`emails[${index}][email]`, emailObj.email);
        });
      phones
        .filter((phoneObj) => phoneObj.phone)
        .forEach((phoneObj, index) => {
          formData.append(`phones[${index}][phone]`, phoneObj.phone.trim().replace(/\s/g, ""));
        });
      languages
        .filter((langObj) => langObj.language)
        .forEach((langObj, index) => {
          formData.append(`languages[${index}][language]`, langObj.language);
        });
      socialslinks
        .filter((linkObj) => linkObj.link)
        .forEach((linkObj, index) => {
          formData.append(`socialslinks[${index}][link]`, linkObj.link);
        });

      formData.append("avatar", avatar);
      if (cv) formData.append("cv", cv);

      // Log FormData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const result = await dispatch(createIntro(formData)).unwrap();
      toast.success(result.message || "Introduction created successfully.");
      navigate("/intro");
    } catch (error) {
      const errorMessage = error.message || error.error || "Failed to create introduction.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StickyHeader>
        <HeadingTwo>Portfolio Introduction</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton onClick={() => navigate("/intro")}>Cancel</GhostButton>
          <TertiaryButton onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Introduction"}
          </TertiaryButton>
        </div>
      </StickyHeader>

      <section className="flex justify-between gap-3 pb-8">
        <div className="w-2/3">
          <div className="flex justify-between gap-3">
            <Wrapper className="p-5 w-1/2">
              <InputTitle className="mb-4">Introduction Details</InputTitle>

              <div className="input">
                <InputLabel className="my-2">Full Name</InputLabel>
                <div className="relative">
                  <Input type="text" name="fullname" className="pl-12" value={fullname} handleChange={handleInputChange} placeholder="John Doe" required />
                  <div className="icon h-9 w-9 bg-green-300 rounded-full flexC text-white absolute top-1 left-1">
                    <FaUser />
                  </div>
                </div>
              </div>

              <div className="input py-3">
                <InputLabel className="my-2">Designation</InputLabel>
                <div className="relative">
                  <Input type="text" name="position" className="pl-12" value={position} handleChange={handleInputChange} placeholder="Software Engineer" required />
                  <div className="icon h-9 w-9 bg-indigo-300 rounded-full flexC text-white absolute top-1 left-1">
                    <PiHandbagFill />
                  </div>
                </div>
              </div>
            </Wrapper>

            <Wrapper className="p-5 w-1/2">
              <InputTitle className="mb-4">Address Info</InputTitle>
              <div className="input">
                <InputLabel className="my-2">Country</InputLabel>
                <div className="relative">
                  <Input type="text" name="country" className="pl-12" value={country} handleChange={handleInputChange} placeholder="United States" />
                  <div className="icon h-9 w-9 bg-purple-300 rounded-full flexC text-white absolute top-1 left-1">
                    <BiWorld />
                  </div>
                </div>
              </div>

              <div className="input py-3">
                <InputLabel className="my-2">Address</InputLabel>
                <div className="relative">
                  <Input type="text" name="address" className="pl-12" value={address} handleChange={handleInputChange} placeholder="123 Main St, City" />
                  <div className="icon h-9 w-9 bg-red-300 rounded-full flexC text-white absolute top-1 left-1">
                    <MdLocationPin />
                  </div>
                </div>
              </div>
            </Wrapper>
          </div>

          <Wrapper className="p-5 mt-3">
            <InputTitle className="mb-4">Contact Info</InputTitle>
            {/* Emails */}
            <div className="input">
              <InputLabel className="my-2">Emails (Optional)</InputLabel>
              {emails.map((emailObj, index) => (
                <div key={index} className="relative flex items-center mb-1.5">
                  <Input type="email" value={emailObj.email} handleChange={(e) => handleArrayChange(index, "emails", "email", e.target.value)} placeholder="example@domain.com" className="pl-12" />
                  <div className="icon h-9 w-9 bg-brown-300 rounded-full flexC text-white absolute top-1 left-1">
                    <MdEmail />
                  </div>
                  <button onClick={() => removeArrayField("emails", index)} className="text-red-800 absolute top-1 right-1 size-9 rounded-full bg-red-200 flexC">
                    <MdClose />
                  </button>
                </div>
              ))}
              <button onClick={() => addArrayField("emails", "email")} className="text-blue-500 hover:text-blue-600 textSizeSm">
                + Add Email
              </button>
            </div>

            {/* Phones */}
            <div className="input py-3">
              <InputLabel className="my-2">Phone Numbers (Optional)</InputLabel>
              {phones.map((phoneObj, index) => (
                <div key={index} className="relative flex items-center mb-1.5">
                  <Input type="tel" value={phoneObj.phone} handleChange={(e) => handleArrayChange(index, "phones", "phone", e.target.value)} placeholder="+1234567890" className="pl-12" />
                  <div className="icon h-9 w-9 bg-teal-300 rounded-full flexC text-white absolute top-1 left-1">
                    <BsTelephone />
                  </div>
                  <button onClick={() => removeArrayField("phones", index)} className="text-red-800 absolute top-1 right-1 size-9 rounded-full bg-red-200 flexC">
                    <MdClose />
                  </button>
                </div>
              ))}
              <button onClick={() => addArrayField("phones", "phone")} className="text-blue-500 hover:text-blue-600 textSizeSm">
                + Add Phone
              </button>
            </div>
          </Wrapper>

          <Wrapper className="p-5 mt-3">
            <InputTitle className="mb-4">Describe Yourself</InputTitle>
            <div className="input">
              <InputLabel className="my-2">Bio (Optional)</InputLabel>
              <div className="relative">
                <Input type="text" name="bio" className="pl-12" value={bio} handleChange={handleInputChange} placeholder="A brief bio (5-250 characters)" />
                <div className="icon h-9 w-9 bg-green-300 rounded-full flexC text-white absolute top-1 left-1">
                  <LuNotepadTextDashed />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <InputLabel className="my-2">Description (Optional)</InputLabel>
              <textarea
                rows={5}
                className="w-full p-2 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-md placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50"
                name="description"
                value={description}
                onChange={handleInputChange}
                placeholder="Tell us more about yourself"
              />
            </div>
          </Wrapper>
        </div>

        <div className="w-1/3">
          <Wrapper className="p-5 w-full">
            <InputTitle className="mb-4">Avatar Image</InputTitle>
            <div
              onDrop={handleDropAvatar}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center w-full h-64 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
              onClick={() => avatarInputRef.current.click()}
            >
              {avatarPreview ? (
                <div className="relative w-full h-64 flex items-center justify-center">
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full rounded-3xl object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAvatar(null);
                      setAvatarPreview("");
                    }}
                    className="absolute top-3 right-3 shadow-xl bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove Avatar"
                    aria-label="Remove avatar image"
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
              <input ref={avatarInputRef} id="avatar" type="file" name="avatar" className="hidden" onChange={handleAvatarChange} accept="image/png,image/jpeg,image/jpg" />
            </div>
          </Wrapper>

          <Wrapper className="p-5 my-3">
            <InputTitle className="mb-4">CV (Optional)</InputTitle>
            <div
              className="flex flex-col items-center justify-center w-full h-32 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
              onClick={() => cvInputRef.current.click()}
            >
              {cv ? (
                <div className="relative w-full flex items-center justify-center">
                  <p className="text-sm">{cv.name}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCv(null);
                    }}
                    className="absolute top-3 right-3 shadow-xl bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove CV"
                    aria-label="Remove CV file"
                  >
                    <MdClose />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Drag and drop a PDF or
                    <span className="textColor font-medium cursor-pointer pl-1">click to browse</span>
                  </p>
                </div>
              )}
              <input ref={cvInputRef} id="cv" type="file" name="cv" className="hidden" onChange={handleCvChange} accept="application/pdf" />
            </div>
          </Wrapper>

          <Wrapper className="p-5">
            <InputTitle className="mb-2">Social Links (Optional)</InputTitle>
            {socialslinks.map((linkObj, index) => (
              <div key={index} className="relative flex items-center mb-1.5">
                <Input type="url" value={linkObj.link} handleChange={(e) => handleArrayChange(index, "socialslinks", "link", e.target.value)} placeholder="https://example.com" className="pl-12" />
                <div className="icon h-9 w-9 bg-blue-300 rounded-full flexC text-white absolute top-1 left-1">
                  <HiLink />
                </div>
                <button onClick={() => removeArrayField("socialslinks", index)} className="text-red-800 absolute top-1 right-1 size-9 rounded-full bg-red-200 flexC">
                  <MdClose />
                </button>
              </div>
            ))}
            <button onClick={() => addArrayField("socialslinks", "link")} className="text-blue-500 hover:text-blue-600 textSizeSm">
              + Add Social Link
            </button>
          </Wrapper>

          <Wrapper className="p-5 mt-3">
            <InputTitle className="mb-2">Languages (Optional)</InputTitle>
            {languages.map((langObj, index) => (
              <div key={index} className="relative flex items-center mb-2">
                <Input type="text" value={langObj.language} handleChange={(e) => handleArrayChange(index, "languages", "language", e.target.value)} placeholder="English" className="pl-12" />
                <div className="icon h-9 w-9 bg-deep-orange-300 rounded-full flexC text-white absolute top-1 left-1">
                  <IoLanguageOutline />
                </div>
                <button onClick={() => removeArrayField("languages", index)} className="text-red-800 absolute top-1 right-1 size-9 rounded-full bg-red-200 flexC">
                  <MdClose />
                </button>
              </div>
            ))}
            <button onClick={() => addArrayField("languages", "language")} className="text-blue-500 hover:text-blue-600 textSizeSm">
              + Add Language
            </button>
          </Wrapper>
        </div>
      </section>
    </>
  );
};
