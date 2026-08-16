import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getUserFavorite, toggleFavorite } from "@/redux/slices/common/favoriteSlice";
import { TertiaryButton } from "./customeUI/Button";

export const FavoriteButton = ({ resourceType, resourceId, initialFavorited = false, className = "", showLabel = false }) => {
  const dispatch = useDispatch();
  const { isFavoriteLoading } = useSelector((state) => state.favorite);

  // Local state to manage favorite status
  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  // Sync local favorite status with initialFavorited prop when it changes
  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited]);

  const handleFavoriteToggle = async (event) => {
    event.stopPropagation(); // Stop event propagation
    const originalIsFavorited = isFavorited; // Store original state for revert
    setIsFavorited(!isFavorited); // Optimistic update

    try {
      // Dispatch toggleFavorite action
      await dispatch(toggleFavorite({ resourceType, resourceId })).unwrap();
      // After successfully toggling favorite, fetch the updated favorite list
      await dispatch(getUserFavorite()).unwrap();
    } catch (error) {
      setIsFavorited(originalIsFavorited); // Revert on failure
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <TertiaryButton onClick={handleFavoriteToggle} disabled={isFavoriteLoading} className={className}>
      <span className="inline-flex items-center justify-center gap-1.5">
        <span className="blog-action-icon">{isFavorited ? <FaBookmark size={15} /> : <FaRegBookmark size={15} />}</span>
        {showLabel && <span>{isFavorited ? "Saved" : "Save"}</span>}
      </span>
    </TertiaryButton>
  );
};
FavoriteButton.propTypes = {
  resourceType: PropTypes.string.isRequired,
  resourceId: PropTypes.string.isRequired,
  initialFavorited: PropTypes.bool,
  className: PropTypes.string,
  showLabel: PropTypes.bool,
};
