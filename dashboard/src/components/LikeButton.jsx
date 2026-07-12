import { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@material-tailwind/react";

import { setInitialLikes, toggleLike, updateLikeLocally } from "@/redux/slices/common/likeSlice";

export const LikeButton = ({ resourceType, contentId, initialLikes = [], showtrue = false }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const userId = user?._id;

  const currentLikeCount = useSelector((state) => state.like.likeCounts[resourceType]?.[contentId]) ?? initialLikes.length;

  const isLiked = useSelector((state) => state.like.likedPosts[resourceType]?.[contentId]) ?? initialLikes.includes(userId);

  useEffect(() => {
    if (!contentId) {
      return;
    }

    dispatch(
      setInitialLikes({
        resourceType,
        id: contentId,
        likes: initialLikes,
      }),
    );
  }, [dispatch, resourceType, contentId, initialLikes]);

  const handleLikeToggle = useCallback(
    (event) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (!contentId || !userId) {
        return;
      }

      const currentLikes = Array(currentLikeCount).fill("user");

      const newLikes = isLiked ? currentLikes.slice(0, -1) : [...currentLikes, userId];

      dispatch(
        updateLikeLocally({
          resourceType,
          id: contentId,
          likes: newLikes,
          userId,
          isLiked,
        }),
      );

      dispatch(
        toggleLike({
          resourceType,
          id: contentId,
          newLikes,
        }),
      )
        .unwrap()
        .catch(() => {
          dispatch(
            updateLikeLocally({
              resourceType,
              id: contentId,
              likes: currentLikes,
              userId,
              isLiked: !isLiked,
            }),
          );
        });
    },
    [dispatch, resourceType, contentId, userId, isLiked, currentLikeCount],
  );

  const label = isLiked ? "Remove like" : "Like this post";

  if (showtrue) {
    return (
      <button
        type="button"
        onClick={handleLikeToggle}
        disabled={!contentId || !userId}
        aria-label={label}
        aria-pressed={isLiked}
        className={`group/like relative inline-flex size-9 items-center justify-center overflow-hidden rounded-xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${
          isLiked
            ? "border-rose-300/25 bg-rose-500/[0.10] text-rose-600 shadow-[0_8px_20px_rgba(190,70,90,0.12)] hover:bg-rose-500/[0.15] dark:border-rose-300/[0.13] dark:bg-rose-300/[0.08] dark:text-rose-200/85"
            : "border-gray-200/80 bg-white/60 text-gray-600 shadow-[0_8px_20px_rgba(15,23,42,0.08)] hover:border-rose-300/30 hover:bg-rose-500/[0.06] hover:text-rose-600 dark:border-white/[0.09] dark:bg-black/35 dark:text-white/60 dark:hover:border-rose-300/[0.13] dark:hover:bg-rose-300/[0.055] dark:hover:text-rose-200/80"
        }`}
      >
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] via-transparent to-transparent" />

        <span className="relative z-10 transition-transform duration-300 group-hover/like:scale-110">{isLiked ? <AiFillLike size={18} /> : <AiOutlineLike size={18} />}</span>

        <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.10] to-transparent transition-transform duration-700 group-hover/like:translate-x-[400%]" />
      </button>
    );
  }

  return (
    <IconButton
      type="button"
      variant="text"
      onClick={handleLikeToggle}
      disabled={!contentId || !userId}
      aria-label={label}
      aria-pressed={isLiked}
      className={`group/like relative size-10 overflow-hidden rounded-xl border shadow-[0_8px_22px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
        isLiked
          ? "border-rose-300/25 bg-rose-500/20 text-rose-100 hover:bg-rose-500/25 dark:border-rose-300/[0.15] dark:bg-rose-300/[0.10] dark:text-rose-100/90"
          : "border-white/15 bg-slate-900/60 text-white/90 hover:border-white/25 hover:bg-slate-800/75 dark:border-white/[0.10] dark:bg-black/45 dark:hover:border-white/[0.16] dark:hover:bg-black/60"
      }`}
    >
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] via-transparent to-transparent" />

      <span className="relative z-10 inline-flex transition-transform duration-300 group-hover/like:scale-110">{isLiked ? <AiFillLike size={21} /> : <AiOutlineLike size={21} />}</span>

      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.10] to-transparent transition-transform duration-700 group-hover/like:translate-x-[400%]" />
    </IconButton>
  );
};

LikeButton.propTypes = {
  resourceType: PropTypes.string.isRequired,
  contentId: PropTypes.string.isRequired,
  initialLikes: PropTypes.array,
  showtrue: PropTypes.bool,
};
