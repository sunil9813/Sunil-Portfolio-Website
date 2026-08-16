import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiArrowUpDownFill } from "react-icons/ri";

import { Wrapper } from "@/routes";
import { CommentEditor } from "./CommentEditor";
import { CommentList } from "./CommentList";
import { addComment, getComments, getCommentsandRatings } from "@/redux/slices/common/commentSlice";

const canRateResource = (resourceType) => ["Project", "Courses"].includes(resourceType);

const hasEditorValue = (value = "") => {
  const cleanText = String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  return cleanText.length > 0 || /<(img|video|iframe|figure)\b/i.test(String(value));
};

const countComments = (items = []) => {
  return items.reduce((total, item) => {
    return total + 1 + countComments(item?.replies || []);
  }, 0);
};

export const Comments = ({ resourceId, resourceType = "Chapter", enableRating = false }) => {
  const dispatch = useDispatch();

  const { comments, averageRating, totalRatings, isPosting } = useSelector((state) => state.comment);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const showRating = enableRating && canRateResource(resourceType);

  const commentCount = useMemo(() => countComments(comments || []), [comments]);

  useEffect(() => {
    if (!resourceId) return;

    dispatch(getComments(resourceId));

    if (showRating) {
      dispatch(getCommentsandRatings({ resourceType, resourceId }));
    }
  }, [dispatch, resourceId, resourceType, showRating]);

  const handleSubmit = async () => {
    const hasComment = hasEditorValue(comment);
    const hasRating = showRating && rating > 0;

    if (!resourceId || (!hasComment && !hasRating)) return;

    const response = await dispatch(
      addComment({
        resourceId,
        resourceType,
        content: hasComment ? comment : undefined,
        rating: hasRating ? rating : undefined,
      }),
    );

    if (!response?.error) {
      setComment("");
      setRating(0);
      dispatch(getComments(resourceId));

      if (showRating) {
        dispatch(getCommentsandRatings({ resourceType, resourceId }));
      }
    }
  };

  return (
    <Wrapper className="group relative my-5 overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-indigo-500/[0.014] blur-[85px] transition-all duration-700 group-hover:bg-indigo-500/[0.022]" />

      <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-cyan-500/[0.012] blur-[85px] transition-all duration-700 group-hover:bg-cyan-500/[0.020]" />

      <div className="relative z-10 flex flex-col gap-3 border-b border-gray-200/70 pb-4 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-gray-900 dark:text-white/90">Comments</h3>

              <span className="inline-flex min-w-8 items-center justify-center rounded-full border border-teal-300/20 bg-teal-500/[0.07] px-2.5 py-1 text-[9px] font-bold tabular-nums text-teal-700 dark:border-teal-300/[0.10] dark:bg-teal-300/[0.045] dark:text-teal-200/70">
                {commentCount}
              </span>
            </div>

            <p className="mt-1 text-[10px] text-gray-500 dark:text-white/30">Join the discussion and share your thoughts</p>
          </div>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-full border border-gray-200/70 bg-gray-50/50 px-3 py-2 text-[10px] font-medium text-gray-600 transition-all hover:border-indigo-300/25 hover:bg-indigo-500/[0.04] hover:text-indigo-700 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/40 dark:hover:border-indigo-300/[0.10] dark:hover:text-indigo-200/65"
        >
          <RiArrowUpDownFill size={11} />

          <span>Most Viewed</span>

          <MdOutlineKeyboardArrowDown size={16} />
        </button>
      </div>

      <div className="relative z-10 mt-5 rounded-2xl border border-gray-200/70 bg-gray-50/40 p-3 dark:border-white/[0.045] dark:bg-white/[0.014]">
        {showRating && (
          <div className="mb-3 flex flex-wrap items-center gap-3 border-b border-gray-200/70 pb-3 dark:border-white/[0.05]">
            <span className="text-[10px] font-medium text-gray-500 dark:text-white/35">Your rating</span>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`text-lg leading-none transition-all ${value <= rating ? "text-amber-400" : "text-gray-400 hover:text-amber-300 dark:text-white/20"}`}
                  aria-label={`${value} star rating`}
                >
                  ★
                </button>
              ))}
            </div>

            {averageRating > 0 && (
              <span className="text-[10px] text-gray-500 dark:text-white/30">
                Average {Number(averageRating).toFixed(1)} / 5{totalRatings ? ` (${totalRatings})` : ""}
              </span>
            )}
          </div>
        )}

        <CommentEditor value={comment} onChange={setComment} onSubmit={handleSubmit} submitLabel={isPosting ? "Submitting..." : "Submit"} disabled={isPosting} />
      </div>

      <div className="relative z-10 mt-8 w-full">
        <CommentList resourceId={resourceId} resourceType={resourceType} showRootEditor={false} />
      </div>
    </Wrapper>
  );
};

Comments.propTypes = {
  resourceId: PropTypes.string,
  resourceType: PropTypes.oneOf(["Project", "Courses", "Posts", "Chapter"]),
  enableRating: PropTypes.bool,
};
