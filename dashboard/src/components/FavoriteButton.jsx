import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import { getUserFavorite, toggleFavorite } from "@/redux/slices/common/favoriteSlice";

export const FavoriteButton = ({ resourceType, resourceId, initialFavorited = false }) => {
  const dispatch = useDispatch();

  const { isFavoriteLoading } = useSelector((state) => state.favorite);

  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited]);

  const handleFavoriteToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isFavoriteLoading || !resourceId) {
      return;
    }

    const previousFavoriteState = isFavorited;

    // Optimistic update
    setIsFavorited((currentState) => !currentState);

    try {
      await dispatch(
        toggleFavorite({
          resourceType,
          resourceId,
        }),
      ).unwrap();

      await dispatch(getUserFavorite()).unwrap();
    } catch (error) {
      // Restore the previous value when the request fails
      setIsFavorited(previousFavoriteState);

      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleFavoriteToggle}
      disabled={isFavoriteLoading || !resourceId}
      aria-label={isFavorited ? "Remove from bookmarks" : "Add to bookmarks"}
      aria-pressed={isFavorited}
      className={`group relative inline-flex min-h-9 items-center justify-center gap-2 overflow-hidden rounded-xl border px-4 py-2 text-[11px] font-semibold shadow-[0_8px_22px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${
        isFavorited
          ? "border-amber-300/25 bg-amber-500/20 text-amber-50 hover:border-amber-300/35 hover:bg-amber-500/25 dark:border-amber-300/[0.16] dark:bg-amber-300/[0.10] dark:text-amber-100/90"
          : "border-white/15 bg-slate-900/60 text-white/90 hover:border-white/25 hover:bg-slate-800/75 dark:border-white/[0.10] dark:bg-black/45 dark:hover:border-white/[0.16] dark:hover:bg-black/60"
      }`}
    >
      <span
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] via-transparent to-transparent transition-opacity duration-300 ${
          isFavorited ? "opacity-100" : "opacity-60 group-hover:opacity-100"
        }`}
      />

      <span
        className={`relative z-10 flex size-5 items-center justify-center rounded-md transition-all duration-300 group-hover:scale-110 ${
          isFavorited ? "bg-amber-300/15 text-amber-200" : "bg-white/[0.07] text-white/75"
        }`}
      >
        {isFavoriteLoading ? <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" /> : isFavorited ? <FaBookmark size={11} /> : <FaRegBookmark size={11} />}
      </span>

      <span className="relative z-10">{isFavorited ? "Bookmarked" : "Bookmark"}</span>

      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.10] to-transparent transition-transform duration-700 group-hover:translate-x-[400%]" />
    </button>
  );
};

FavoriteButton.propTypes = {
  resourceType: PropTypes.string.isRequired,
  resourceId: PropTypes.string.isRequired,
  initialFavorited: PropTypes.bool,
};
