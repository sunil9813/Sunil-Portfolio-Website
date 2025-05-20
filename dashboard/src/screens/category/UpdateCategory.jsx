import { getallCategory, getCategory, updateCategory } from "@/redux/slices/resources/categorySlice";
import { isImageValid } from "@/utils";
import { BreadcrumbsComponent, Loader, Wrapper } from "@/utils/Router";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const UpdateCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: categoryId } = useParams();
  const { category, isLoading } = useSelector((state) => state.category);

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState({ title: "", type: "" });

  // Fetch category on mount
  useEffect(() => {
    dispatch(getCategory(categoryId));
  }, [dispatch, categoryId]);

  // Set form data when category is available
  useEffect(() => {
    if (category) {
      setUpdatedCategory({ title: category.title, type: category.type || "" });
      setPreviewImage(category.cover?.filePath || null);
    }
  }, [category]);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isImageValid(selectedFile)) {
      setImage(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    } else {
      toast.error("Please select a valid PNG, JPEG, or JPG image.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!updatedCategory.title || !updatedCategory.type) {
      return toast.error("Please fill all fields.");
    }

    const formData = new FormData();
    formData.append("title", updatedCategory.title);
    formData.append("type", updatedCategory.type);
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

  return (
    <div>
      {isLoading && <Loader />}
      <section className="content">
        <BreadcrumbsComponent text="Update Category" />

        <form onSubmit={handleSubmit}>
          <Wrapper className="flex justify-between gap-5">
            <div className="p-5 flex flex-col gap-5 py-10 w-1/2">
              <div>
                <span className="text-gray-400 block text-sm mb-2">Title</span>
                <input type="text" name="title" value={updatedCategory.title} onChange={handleChange} className="w-full p-2.5 border border-white/20 rounded-lg bg-primarybg" />
              </div>

              <div>
                <span className="text-gray-400 block text-sm mb-2">Category Type</span>
                <select
                  name="type"
                  value={updatedCategory.type}
                  onChange={handleChange}
                  className="px-4 py-2.5 bg-primarybg border-[1px] border-white/20 outline-none rounded-lg text-moonstone text-sm w-full"
                >
                  <option value="">Select Type</option>
                  <option value="blog">Blog</option>
                  <option value="project">Project</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <span className="text-gray-400 block text-sm mb-2">Cover</span>
                <input
                  type="file"
                  name="cover"
                  onChange={handleImageChange}
                  className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded-lg bg-primarybg border border-white/20 text-primary bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-textcolor transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" color="indigo" size="md">
                  Update
                </Button>
              </div>
            </div>
            <div className="w-1/2 p-5">
              {/* Image Preview */}
              {previewImage ? (
                <div className="h-[60vh]">
                  <img src={previewImage} alt="Preview" className="rounded-lg w-full h-full object-cover" />
                </div>
              ) : (
                <p className="mt-3 text-gray-400">No image selected for this category</p>
              )}
            </div>
          </Wrapper>
        </form>
      </section>
    </div>
  );
};
