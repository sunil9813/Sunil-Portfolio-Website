import { createCategory, getallCategory } from "@/redux/slices/resources/categorySlice";
import { Input, InputLabel, InputTitle, Loader, StickyHeaderComponent, UseMouseMoveEffect, Wrapper } from "@/utils/Router";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoCameraSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { List, ListItem, ListItemPrefix, Avatar, Typography, Chip, ListItemSuffix } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { TypeDropdown } from "@/components/common/dropdown/CustomeDropDown";

export const AddCategory = () => {
  UseMouseMoveEffect("inputcards");
  const coverInputRef = useRef(null);
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [parent, setParent] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const { isLoading } = useSelector((state) => state?.category);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleCreate = async () => {
    if (!title.trim() || !cover || !type) {
      return toast.error("Please fill all input fields.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("cover", cover);
    formData.append("type", type);
    if (parent) formData.append("parent", parent._id);

    const resultAction = await dispatch(createCategory(formData));

    if (createCategory.fulfilled.match(resultAction)) {
      toast.success("Category created successfully!");
      setCoverPreview(null);
      setCover(null);
      setType("");
      setParent(null);
      navigate("/all-category");
    } else {
      toast.error(resultAction.payload || "Failed to create category. Please try again.");
    }
  };

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
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Cover file size exceeds 10MB limit.");
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

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  return (
    <>
      <StickyHeaderComponent title="New Category" path="/all-category" btntext="Add Category" handleFunction={handleCreate} />

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
            <div
              onDrop={handleDropCover}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center w-full h-64 transition cursor-pointer bg-light-surface1/50 dark:bg-dark-surface1/50 rounded-3xl border border-transparent hover:border hover:border-gray-200 dark:hover:border-gray-800"
            >
              {coverPreview ? (
                <div className="relative w-full h-64 flex items-center justify-center">
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
      <Wrapper className=" p-5 my-5">
        <InputTitle className="mb-4">Category Lists</InputTitle>
        <div className="h-[60vh] overflow-x-hidden scroll-bar-none">
          <ListItemCategory />
        </div>
      </Wrapper>
    </>
  );
};

// Rest of your AddCategory code (ListItemCategory remains the same)
export const ListItemCategory = () => {
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category);
  const { categoryList } = categorys;

  useEffect(() => {
    dispatch(getallCategory());
  }, [dispatch]);

  return (
    <List className="grid grid-cols-4 gap-3">
      {categoryList?.map((category) => (
        <ListItem key={category?._id} className="flex items-center justify-between bg-gray-100 dark:bg-black/10 p-3 rounded-xl">
          <ListItemPrefix>
            <Avatar variant="circular" alt={category?.title} src={category?.cover?.filePath} className="w-12 h-12 rounded-full object-cover" />
          </ListItemPrefix>

          <div className="flex-1 ml-3">
            <h4 className="text-gray-900 dark:text-gray-400 capitalize text-sm">{category?.title}</h4>
            <Typography variant="small" color="gray" className="font-normal capitalize text-gray-500 dark:text-gray-600 text-xs">
              {category?.user?.name}
            </Typography>
          </div>

          <ListItemSuffix>
            <Chip value="40" variant="ghost" size="sm" className="bg-gray-300 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-xs font-medium" />
          </ListItemSuffix>
        </ListItem>
      ))}
    </List>
  );
};

Option.propTypes = {
  value: PropTypes.any,
  children: PropTypes.any,
  isLast: PropTypes.any,
  props: PropTypes.any,
};
