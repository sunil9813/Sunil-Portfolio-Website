import { CommentEditor } from "@/components/comment/CommentEditor";
import { createService, getAllService } from "@/redux/slices/portfolio/portServiceService";
import { GhostButton, HeadingTwo, Input, InputTitle, StickyHeader, TertiaryButton, Wrapper } from "@/utils/Router";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  title: "",
  description: "",
};

export const PortfolioServiceCreate = () => {
  const coverInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [university, setUniversity] = useState(initialState);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [description, setDescription] = useState("");

  const { title } = university;
  // const { isLoading } = useSelector((state) => state.university);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUniversity({ ...university, [name]: value });
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  const isImageValid = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return allowedFormats.includes(file.type);
  };

  const handleCoverChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!isImageValid(selectedFile)) {
        toast.error("Cover must be a PNG, JPEG, or JPG image.");
        return;
      }
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("Cover file size exceeds 2MB limit.");
        return;
      }
      setCover(selectedFile);
      setCoverPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDropCover = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleCoverChange({ target: { files: [file] } });
  }, []);

  const handleCreate = async () => {
    if (title.trim().length > 0 && cover) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("cover", cover);

      const resultAction = await dispatch(createService(formData));
      await dispatch(getAllService());
      if (createService.fulfilled.match(resultAction)) {
        setCoverPreview(null);
        setCover(null);
        navigate("/service");
      }
    } else {
      toast.error("Please fill all input fields.");
    }
  };

  return (
    <>
      <StickyHeader>
        <HeadingTwo>New Service</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton onClick={() => navigate("/service")}>Cancel</GhostButton>
          <TertiaryButton onClick={handleCreate}>Create Service</TertiaryButton>
        </div>
      </StickyHeader>
      <section className="flex justify-between gap-3">
        <div className="w-2/3">
          <Wrapper className="p-5">
            <InputTitle className="mb-4">Service Title</InputTitle>
            <div className="input">
              <div className="relative">
                <Input type="text" name="title" value={title} handleChange={handleInputChange} placeholder="Mobile App Design" />
              </div>
            </div>
          </Wrapper>
          <Wrapper className="p-5 mt-3">
            <InputTitle className="mb-4">Description</InputTitle>
            <CommentEditor className="!bg-transparent border border-gray-900/10 dark:border-gray-50/10" type="default" value={description} onChange={setDescription} />
          </Wrapper>
        </div>
        <div className="w-1/3">
          <Wrapper className="p-5 w-full">
            <InputTitle className="mb-4">Cover Image</InputTitle>
            <div
              onDrop={handleDropCover}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center w-full h-72 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
            >
              {coverPreview ? (
                <div className="relative w-full h-72 flex items-center justify-center">
                  <img src={coverPreview} alt="Cover Preview" className="w-full h-full rounded-3xl object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCover(null);
                      setCoverPreview(null);
                    }}
                    className="absolute top-3 right-3 shadow-xl bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove Cover"
                    aria-label="Remove cover image"
                  >
                    <MdClose />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <IoCameraSharp size={30} />
                  <p className="text-sm text-gray-500 dark:text-gray-400 textSizeSm">
                    Drag and drop an image or
                    <span className="textColor font-medium cursor-pointer pl-1" onClick={() => coverInputRef.current.click()}>
                      click to browse
                    </span>
                  </p>
                </div>
              )}
              <input ref={coverInputRef} id="cover" type="file" name="cover" className="hidden" onChange={handleCoverChange} accept="image/png,image/jpeg,image/jpg" />
            </div>
          </Wrapper>
        </div>
      </section>
    </>
  );
};
