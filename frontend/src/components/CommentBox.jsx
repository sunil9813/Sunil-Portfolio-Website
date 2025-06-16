import { AiTwotoneStar } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GoReply } from "react-icons/go";
import { Button } from "./customeUI/Button";
import { CommentEditor } from "./comment/CommentEditor";

export const CommentBoxComponents = () => {
  return (
    <>
      <CommentEditor />
      <div className="comment bg-dark-highlight/30 p-5 mb-12 rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium mb-5 heading-gardient">Comments</h2>
        </div>
        <CommentUser />
        <CommentUser />
        <CommentUser />
      </div>
    </>
  );
};
export const CommentUser = () => {
  return (
    <div className="list relative mb-8">
      <div className="line1"></div>
      <div className="line2"></div>
      <div className="box-users flex">
        <div className="profiel w-12">
          <h4 className="bg-red-500 flex items-center justify-center w-10 h-10 rounded-full text-white">C</h4>
        </div>
        <div className="details">
          <div className="flex items-center gap-4">
            <p className="text-md dark:text-white text-text_light ">Customer 3</p>
            <span className="px-4 py-1.5 bg-secondary text-white flex items-center rounded-full">
              3.5 <AiTwotoneStar />
            </span>
          </div>
          <p className="my-3">Decent application but support is letting it down. Way too slow.</p>
          <div className="flex items-center gap-3">
            <span>May 11, 2022</span>
            <button className="flex gap-2 items-center card_1 p-1.5 px-3 rounded-full text-sm">
              <GoReply /> Reply
            </button>
          </div>
        </div>
      </div>
      <div className="reply pt-5 ml-24">
        <div className="box-users flex gap-4">
          <div className="profiel w-12">
            <h4 className="bg-indigo-500 flex items-center justify-center w-10 h-10 rounded-full text-white">S</h4>
          </div>
          <div className="details">
            <div className="flex items-center gap-4">
              <p className="text-md text-white">Admin Name</p>
            </div>
            <p className="my-3">Decent application but support is letting it down. Way too slow.</p>
            <span>May 11, 2022</span>
          </div>
        </div>
      </div>
    </div>
  );
};
