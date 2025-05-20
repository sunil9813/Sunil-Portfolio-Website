import { addAssetsLimit, getAssetsLimit } from "@/redux/slices/settings/AssestLimitSlice";
import { CommonClassForInput } from "@/utils";
import { BreadcrumbsComponent, Wrapper } from "@/utils/Router";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BsInfoCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AssetConfigure = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postLimitNo, setPostLimitNo] = useState("");
  const { assetLimit } = useSelector((state) => state.assetlimit);

  useEffect(() => {
    dispatch(getAssetsLimit());
  }, [dispatch]);

  const create = async (e) => {
    e.preventDefault();
    if (/^[0-9]+$/.test(postLimitNo)) {
      const requestData = { assetLimit: postLimitNo };
      const resultAction = await dispatch(addAssetsLimit(requestData));
      if (addAssetsLimit.fulfilled.match(resultAction)) {
        setPostLimitNo("");
        navigate("/assets-limit");
      }
      dispatch(getAssetsLimit());
    } else {
      toast.error("Please enter valid number.");
    }
  };

  return (
    <div className="flex justify-between gap-5">
      <Wrapper className="projects-list p-5 w-1/3">
        <BreadcrumbsComponent currentPage="Asset Limit" space={false} />

        <form onSubmit={create} className="relative py-8">
          <span className="textColor block text-xs 3xl:text-xs mb-2">Asset limit </span>
          <input type="text" name="assetLimit" className={`${CommonClassForInput}`} value={postLimitNo} onChange={(e) => setPostLimitNo(e.target.value)} />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>

        <div className="p-5 border border-gray-500/20 dark:border-gray-50/10 rounded-xl">
          <div className="flex items-center gap-2 ">
            <BsInfoCircle />
            <h3 className="font-medium textcolor text-sm">Asset limit guidelines:</h3>
          </div>
          <ul className="mt-2 ml-5 list-inside list-disc textcolor text-xs flex flex-col gap-2">
            <li>This number defines the maximum assets (e.g., images) allowed per project.</li>
            <li>Once the limit is reached, no more images can be uploaded for that project.</li>
            <li>Only images are counted toward this limit.</li>
          </ul>
        </div>
      </Wrapper>
      <Wrapper className="projects-list w-2/3 p-8">
        <h1 className="text-[250px] text-center rubik-wet-paint-regular">{assetLimit?.assetLimit}</h1>
      </Wrapper>
    </div>
  );
};
