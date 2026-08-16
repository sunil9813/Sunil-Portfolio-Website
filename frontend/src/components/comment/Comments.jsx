import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiArrowUpDownFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Wrapper } from "../customeUI/Wrapper";
import { addComment, getComments, getCommentsandRatings } from "@/redux/slices/common/commentSlice";
import { CommentEditor } from "./CommentEditor";
import { CommentList } from "./CommentList";

const canRateResource = (resourceType) => ["Project", "Courses"].includes(resourceType);

const hasEditorValue = (value = "") => {
  const cleanText = String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  return cleanText.length > 0 || /<(img|video|iframe|figure)\b/i.test(String(value));
};

const countComments = (items = []) => {
  return items.reduce((total, item) => total + 1 + countComments(item?.replies || []), 0);
};

export const Comments = ({ resourceId, resourceType = "Chapter", enableRating = false }) => {
  const dispatch = useDispatch();

  const { comments, averageRating, totalRatings, isPosting } = useSelector((state) => state.comment);

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const canComment = Boolean(isLoggedIn && user);
  const showRating = enableRating && canRateResource(resourceType);

  const commentCount = useMemo(() => countComments(comments || []), [comments]);

  useEffect(() => {
    if (!resourceId) {
      return;
    }

    dispatch(getComments(resourceId));

    if (showRating) {
      dispatch(getCommentsandRatings({ resourceType, resourceId }));
    }
  }, [dispatch, resourceId, resourceType, showRating]);

  const handleSubmit = async () => {
    const hasComment = hasEditorValue(comment);
    const hasRating = showRating && rating > 0;

    if (!canComment || !resourceId || (!hasComment && !hasRating)) {
      return;
    }

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
    <Wrapper
      className="
        group relative my-5 overflow-hidden
        rounded-[26px] border border-gray-200/80
        bg-white p-0
        dark:border-white/[0.065]
        dark:bg-[#171a1f]
      "
    >
      {/* Background decoration */}
      <div
        className="
          pointer-events-none absolute -right-24 -top-28
          size-72 rounded-full bg-teal-400/[0.07]
          blur-[95px] transition-all duration-700
          group-hover:bg-teal-400/[0.10]
          dark:bg-teal-300/[0.028]
          dark:group-hover:bg-teal-300/[0.04]
        "
      />

      <div
        className="
          pointer-events-none absolute -bottom-28 -left-24
          size-72 rounded-full bg-indigo-500/[0.045]
          blur-[100px] transition-all duration-700
          group-hover:bg-indigo-500/[0.065]
          dark:bg-indigo-400/[0.018]
          dark:group-hover:bg-indigo-400/[0.028]
        "
      />

      <div
        className="
          pointer-events-none absolute inset-x-12 top-0 h-px
          bg-gradient-to-r from-transparent
          via-teal-400/60 to-transparent
          dark:via-teal-300/20
        "
      />

      {/* Header */}
      <div
        className="
          relative z-10 flex flex-col gap-4
          border-b border-gray-200/70
          bg-gradient-to-r from-teal-50/50 via-white/80 to-transparent
          px-5 py-5
          dark:border-white/[0.055]
          dark:bg-[linear-gradient(110deg,rgba(20,184,166,0.04),rgba(255,255,255,0.01)_45%,transparent)]
          sm:flex-row sm:items-center sm:justify-between
          sm:px-6 sm:py-6
        "
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h3
              className="
                text-xl font-semibold tracking-[-0.035em]
                text-gray-950 dark:text-white/90
              "
            >
              Comments
            </h3>

            <span
              className="
                inline-flex min-w-8 items-center justify-center
                rounded-full border border-teal-400/20
                bg-teal-500/[0.075]
                px-2.5 py-1
                text-[9px] font-semibold tabular-nums
                text-teal-700
                shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]
                dark:border-teal-300/[0.09]
                dark:bg-teal-300/[0.04]
                dark:text-teal-200/65
                dark:shadow-none
              "
            >
              {commentCount}
            </span>
          </div>

          <p
            className="
              mt-1.5 text-[10px] font-medium
              text-gray-500 dark:text-white/30
            "
          >
            Join the discussion and share your thoughts
          </p>
        </div>

        <button
          type="button"
          className="
            flex w-fit items-center gap-2
            rounded-xl border border-gray-200/80
            bg-white/75 px-3.5 py-2.5
            text-[9px] font-bold text-gray-600
            shadow-[0_7px_18px_rgba(15,23,42,0.04)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:border-teal-500/20
            hover:bg-white hover:text-teal-700
            hover:shadow-[0_10px_24px_rgba(15,23,42,0.07)]
            active:translate-y-0
            dark:border-white/[0.055]
            dark:bg-white/[0.025]
            dark:text-white/38
            dark:shadow-none
            dark:hover:border-teal-300/[0.10]
            dark:hover:bg-white/[0.04]
            dark:hover:text-teal-200/70
          "
        >
          <RiArrowUpDownFill size={11} />

          <span>Most Viewed</span>

          <MdOutlineKeyboardArrowDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
        </button>
      </div>

      {/* Editor section */}
      <div className="relative z-10 px-5 pt-5 sm:px-6 sm:pt-6">
        <div
          className="
            overflow-hidden rounded-[20px]
            border border-gray-200/80
            bg-gray-50/70
            p-2
            shadow-[inset_0_1px_0_rgba(255,255,255,0.80)]
            transition-all duration-300
            focus-within:border-teal-500/25
            focus-within:bg-white
            focus-within:shadow-[0_12px_30px_rgba(15,23,42,0.055)]
            dark:border-white/[0.055]
            dark:bg-white/[0.018]
            dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]
            dark:focus-within:border-teal-300/[0.10]
            dark:focus-within:bg-white/[0.027]
            dark:focus-within:shadow-[0_14px_34px_rgba(0,0,0,0.16)]
          "
        >
          {canComment ? (
            <>
              {showRating && (
                <div
                  className="
                    flex flex-wrap items-center gap-x-4 gap-y-2
                    border-b border-gray-200/70
                    px-3 pb-3 pt-2
                    dark:border-white/[0.05]
                  "
                >
                  <span
                    className="
                      text-[9px] font-bold uppercase tracking-[0.12em]
                      text-gray-500 dark:text-white/32
                    "
                  >
                    Your rating
                  </span>

                  <div
                    className="
                      flex items-center gap-0.5
                      rounded-xl border border-gray-200/70
                      bg-white/75 px-2.5 py-1.5
                      dark:border-white/[0.05]
                      dark:bg-black/[0.08]
                    "
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={`
                          text-lg leading-none
                          transition-all duration-200
                          hover:-translate-y-0.5 hover:scale-110
                          ${value <= rating ? "text-amber-400 drop-shadow-[0_3px_6px_rgba(245,158,11,0.24)]" : "text-gray-300 hover:text-amber-300 dark:text-white/15"}
                        `}
                        aria-label={`${value} star rating`}
                      >
                        &#9733;
                      </button>
                    ))}
                  </div>

                  {averageRating > 0 && (
                    <span
                      className="
                        text-[9px] font-medium
                        text-gray-500 dark:text-white/28
                      "
                    >
                      Average {Number(averageRating).toFixed(1)} / 5{totalRatings ? ` (${totalRatings})` : ""}
                    </span>
                  )}
                </div>
              )}

              <div className="overflow-hidden rounded-[15px]">
                <CommentEditor value={comment} onChange={setComment} onSubmit={handleSubmit} submitLabel={isPosting ? "Submitting..." : "Submit"} disabled={isPosting} />
              </div>
            </>
          ) : (
            <div
              className="
                rounded-[15px]
                border border-teal-400/15
                bg-gradient-to-r from-teal-500/[0.055] to-transparent
                px-4 py-4
                text-[11px] font-medium leading-5
                text-gray-600
                dark:border-teal-300/[0.07]
                dark:from-teal-300/[0.025]
                dark:text-white/42
              "
            >
              Please{" "}
              <Link
                to="/login"
                className="
                  font-semibold text-teal-700
                  underline decoration-teal-500/25
                  underline-offset-4
                  transition-colors
                  hover:text-teal-600
                  dark:text-teal-200/70
                  dark:hover:text-teal-200
                "
              >
                login
              </Link>{" "}
              to write a comment.
            </div>
          )}
        </div>
      </div>

      {/* Comment list */}
      <div
        className="
          relative z-10 mt-6 w-full
          border-t border-gray-200/60
          px-5 pb-6 pt-6
          dark:border-white/[0.045]
          sm:px-6
        "
      >
        <CommentList resourceId={resourceId} resourceType={resourceType} showRootEditor={false} canComment={canComment} />
      </div>
    </Wrapper>
  );
};

Comments.propTypes = {
  resourceId: PropTypes.string,
  resourceType: PropTypes.oneOf(["Project", "Courses", "Posts", "Chapter"]),
  enableRating: PropTypes.bool,
};
