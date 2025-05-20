import { createCategory, getallCategory } from "@/redux/slices/resources/categorySlice";
import { BreadcrumbsComponent, Loader, UseMouseMoveEffect, Wrapper } from "@/utils/Router";
import { Button, Chip, ListItemSuffix } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { List, ListItem, ListItemPrefix, Avatar, Typography } from "@material-tailwind/react";

export const AddCategory = () => {
  UseMouseMoveEffect("inputcards");
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const { isLoading } = useSelector((state) => state?.category);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTitleChange = (title) => {
    if (title.toLowerCase().includes("modal")) {
      toast.error("Modal can't be your category name. Please choose another name.");
    } else {
      setTitle(title);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !image || !type) {
      return toast.error("Please fill all input fields.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("cover", image);
    formData.append("type", type);

    const resultAction = await dispatch(createCategory(formData));

    if (createCategory.fulfilled.match(resultAction)) {
      toast.success("Category created successfully!");
      setPreviewImage(null);
      setImage(null);
      setType("");
      navigate("/all-category");
    } else {
      toast.error(resultAction.payload || "Failed to create category. Please try again.");
    }
  };

  const isImageValid = (file) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return allowedFormats.includes(file.type);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isImageValid(selectedFile)) {
      setImage(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    } else {
      toast.error("Please select a valid PNG, JPEG, or JPG image.");
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Wrapper className="category-list">
        <div className="px-5 pt-5">
          <BreadcrumbsComponent currentPage="Create Category" space={false} />
        </div>
        <div className="flex justify-between gap-5">
          <form className="w-2/5">
            <Wrapper>
              <div className="p-5 flex flex-col gap-5 py-10">
                <div>
                  <span className="text-gray-400 block text-sm mb-2">Title</span>
                  <input type="text" name="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full h-full p-2.5 border border-white/20 rounded-lg bg-primarybg" />
                </div>
                <div>
                  <span className="text-gray-400 block text-sm mb-2">Category Type</span>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)} // Update type state
                    className="px-4 py-2.5 bg-primarybg border-[1px] border-white/20 outline-none rounded-lg text-moonstone text-sm w-full"
                  >
                    <option className="text-dark-blue" value="">
                      Select Type
                    </option>
                    <option className="text-dark-blue" value="blog">
                      Blog
                    </option>
                    <option className="text-dark-blue" value="project">
                      Project
                    </option>
                  </select>
                </div>
                <div>
                  <span className="text-gray-400 block text-sm mb-2">Cover</span>
                  <input
                    className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded-lg bg-primarybg border border-white/20 text-primary bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-textcolor transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                    id="formFileLg"
                    type="file"
                    name="cover"
                    onChange={handleImageChange}
                  />
                </div>
                {previewImage !== null ? (
                  <div className="w-48 h-48 rounded-xl mt-5">
                    <img src={previewImage} alt="imagePreview" className="rounded-lg w-full h-full object-cover" />
                  </div>
                ) : (
                  <p className="mt-3 text-gray-400">No Image selected for this category</p>
                )}
                <div className="flex justify-end">
                  <Button onClick={handleCreate} type="button" color="indigo" size="md">
                    Submit
                  </Button>
                </div>
              </div>
            </Wrapper>
          </form>
          <Wrapper className="w-3/5 h-[48vh] overflow-x-hidden scroll-bar-none">
            <ListItemCategory />
          </Wrapper>
        </div>
      </Wrapper>
    </>
  );
};

export const ListItemCategory = () => {
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category);
  const { categoryList } = categorys;

  useEffect(() => {
    dispatch(getallCategory());
  }, [dispatch]);

  return (
    <List className="grid grid-cols-4 gap-2">
      {categoryList?.map((category) => (
        <ListItem key={category?._id} className=" bg-primarybg">
          <ListItemPrefix>
            <Avatar variant="circular" alt="candice" src={category?.cover?.filePath} />
          </ListItemPrefix>
          <div>
            <h4 className="text-textcolor font-semibold uppercase">{category?.title}</h4>
            <Typography variant="small" color="gray" className="font-normal capitalize">
              {category?.user?.name}
            </Typography>
          </div>
          <ListItemSuffix>
            <Chip value="40" variant="ghost" size="sm" className="rounded-full" />
          </ListItemSuffix>
        </ListItem>
      ))}
      {categoryList?.map((category) => (
        <ListItem key={category?._id} className=" bg-primarybg">
          <ListItemPrefix>
            <Avatar variant="circular" alt="candice" src={category?.cover?.filePath} />
          </ListItemPrefix>
          <div>
            <h4 className="text-textcolor font-semibold uppercase">{category?.title}</h4>
            <Typography variant="small" color="gray" className="font-normal">
              {category?.user?.name}
            </Typography>
          </div>
          <ListItemSuffix>
            <Chip value="40" variant="ghost" size="sm" className="rounded-full" />
          </ListItemSuffix>
        </ListItem>
      ))}
      {categoryList?.map((category) => (
        <ListItem key={category?._id} className=" bg-primarybg">
          <ListItemPrefix>
            <Avatar variant="circular" alt="candice" src={category?.cover?.filePath} />
          </ListItemPrefix>
          <div>
            <h4 className="text-textcolor font-semibold uppercase">{category?.title}</h4>
            <Typography variant="small" color="gray" className="font-normal">
              {category?.user?.name}
            </Typography>
          </div>
          <ListItemSuffix>
            <Chip value="40" variant="ghost" size="sm" className="rounded-full" />
          </ListItemSuffix>
        </ListItem>
      ))}
      {categoryList?.map((category) => (
        <ListItem key={category?._id} className=" bg-primarybg">
          <ListItemPrefix>
            <Avatar variant="circular" alt="candice" src={category?.cover?.filePath} />
          </ListItemPrefix>
          <div>
            <h4 className="text-textcolor font-semibold uppercase">{category?.title}</h4>
            <Typography variant="small" color="gray" className="font-normal">
              {category?.user?.name}
            </Typography>
          </div>
          <ListItemSuffix>
            <Chip value="40" variant="ghost" size="sm" className="rounded-full" />
          </ListItemSuffix>
        </ListItem>
      ))}
      {categoryList?.map((category) => (
        <ListItem key={category?._id} className=" bg-primarybg">
          <ListItemPrefix>
            <Avatar variant="circular" alt="candice" src={category?.cover?.filePath} />
          </ListItemPrefix>
          <div>
            <h4 className="text-textcolor font-semibold uppercase">{category?.title}</h4>
            <Typography variant="small" color="gray" className="font-normal">
              {category?.user?.name}
            </Typography>
          </div>
          <ListItemSuffix>
            <Chip value="40" variant="ghost" size="sm" className="rounded-full" />
          </ListItemSuffix>
        </ListItem>
      ))}
    </List>
  );
};
