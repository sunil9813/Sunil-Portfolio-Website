import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiArrowUpDownFill } from "react-icons/ri";
import { CommentEditor } from "./CommentEditor";
import { CommentList } from "./CommentList";

export const Comments = () => {
  return (
    <>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-semibold">Comment</h3>
          <span className="rounded-full bg-teal-500 p-2 text-xs px-4">20</span>
        </div>
        <button className="flex items-center gap-2">
          <RiArrowUpDownFill />
          <span>Most Viewed</span>
          <MdOutlineKeyboardArrowDown size={20} />
        </button>
      </div>
      <div className="mt-5">
        <CommentEditor />
      </div>
      <div className="w-1/2 mt-8">
        <CommentList />
      </div>
    </>
  );
};
