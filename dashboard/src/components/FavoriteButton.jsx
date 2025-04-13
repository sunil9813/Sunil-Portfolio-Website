import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getUserFavorite, toggleFavorite } from "@/redux/slices/common/favoriteSlice";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export const FavoriteButton = ({ resourceType, resourceId, initialFavorited = false }) => {
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
    <button className="bg-blue-gray-600 px-5 py-1.5 rounded-md flex items-center justify-center gap-2 text-sm text-white" onClick={handleFavoriteToggle} disabled={isFavoriteLoading}>
      {isFavorited ? <FaBookmark /> : <FaRegBookmark />} Bookmark
    </button>
  );
};
FavoriteButton.propTypes = {
  resourceType: PropTypes.string.isRequired,
  resourceId: PropTypes.string.isRequired,
  initialFavorited: PropTypes.bool,
};
