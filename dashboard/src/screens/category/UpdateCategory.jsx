import { getallCategory, getCategory, updateCategory } from "@/redux/slices/resources/categorySlice";
import { Input, InputLabel, InputTitle, Loader, StickyHeaderComponent, Wrapper } from "@/utils/Router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { TypeDropdown } from "@/components/common/dropdown/CustomeDropDown";

export const UpdateCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: categoryId } = useParams();
  const { category, isLoading } = useSelector((state) => state.category);

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");

  // Fetch category on mount
  useEffect(() => {
    dispatch(getCategory(categoryId));
  }, [dispatch, categoryId]);

  // Set form data when category is available
  useEffect(() => {
    if (category) {
      setTitle(category.title);
      setType(category.type || "");
      setPreviewImage(category.cover?.filePath || null);
    }
  }, [category]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    if (title.toLowerCase().includes("modal")) {
      toast.error("Modal can't be your category name. Please choose another name.");
    } else {
      setTitle(title);
    }
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const isImageValid = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return allowedFormats.includes(file.type);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!isImageValid(selectedFile)) {
        toast.error("Cover must be a PNG, JPEG, or JPG image.");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Cover file size exceeds 10MB limit.");
        return;
      }
      setImage(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !type) {
      return toast.error("Please fill all input fields.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    if (image) {
      formData.append("cover", image);
    }

    // Dispatch the updateCategory action and wait for the result
    const resultAction = await dispatch(updateCategory({ formData, id: categoryId }));

    // Check if the update was successful
    if (updateCategory.fulfilled.match(resultAction)) {
      toast.success("Category updated successfully!");
      await dispatch(getallCategory());
      navigate("/all-category");
    } else {
      toast.error(resultAction.payload || "Failed to update category. Please try again.");
    }
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <>
      <StickyHeaderComponent title="Update Category" path="/all-category" btntext="Update Category" handleFunction={handleSubmit} />

      {isLoading && <Loader />}

      <section className="flex justify-between gap-3">
        <div className="w-2/3">
          <Wrapper className="category-list p-5 h-full">
            <InputTitle className="mb-4">Category details</InputTitle>

            <div className="input">
              <InputLabel className="my-2">Category Name</InputLabel>
              <div className="relative">
                <Input type="text" name="title" value={title} handleChange={handleTitleChange} placeholder="Enter category name" />
              </div>
            </div>
            <div className="input py-3">
              <InputLabel className="my-2">Category Type</InputLabel>
              <TypeDropdown value={type} onChange={handleTypeChange} name="type" />
            </div>
          </Wrapper>
        </div>

        <div className="w-1/3">
          <Wrapper className="p-5 w-full">
            <InputTitle className="mb-4">Cover Image</InputTitle>
            <div className="flex flex-col items-center justify-center w-full h-64 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800">
              {previewImage ? (
                <div className="relative w-full h-64 flex items-center justify-center">
                  <img src={previewImage} alt="Cover Preview" className="w-full h-full rounded-3xl object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      // Only clear preview if it's a blob URL, otherwise keep the existing image
                      if (previewImage.startsWith("blob:")) {
                        URL.revokeObjectURL(previewImage);
                        setPreviewImage(null);
                      } else {
                        // If it's an existing image from the server, we need to clear it differently
                        setPreviewImage(null);
                        // You might want to add a flag to indicate the image should be removed
                      }
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category?.cover?.filePath ? "No new image selected" : "No image selected for this category"}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="textColor font-medium cursor-pointer" onClick={() => document.getElementById("cover-input")?.click()}>
                      Click to browse
                    </span>
                  </p>
                </div>
              )}
              <input id="cover-input" type="file" name="cover" className="hidden" onChange={handleImageChange} accept="image/png,image/jpeg,image/jpg" />
            </div>
            {category?.cover?.filePath && !previewImage && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Existing image will be kept. Click the remove button above to delete it.</p>}
          </Wrapper>
        </div>
      </section>
    </>
  );
};
