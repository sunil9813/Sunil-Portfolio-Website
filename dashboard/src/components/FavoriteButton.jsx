import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IconButton } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "@/redux/slices/common/favoriteSlice";
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

  const handleFavoriteToggle = (event) => {
    event.stopPropagation(); // Stop event propagation
    const originalIsFavorited = isFavorited; // Store original state for revert
    setIsFavorited(!isFavorited); // Optimistic update

    dispatch(toggleFavorite({ resourceType, resourceId }))
      .unwrap()
      .catch(() => {
        setIsFavorited(originalIsFavorited); // Revert on failure
      });
  };

  return (
    <IconButton color="teal" onClick={handleFavoriteToggle} disabled={isFavoriteLoading}>
      {isFavorited ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
    </IconButton>
  );
};
FavoriteButton.propTypes = {
  resourceType: PropTypes.string.isRequired,
  resourceId: PropTypes.string.isRequired,
  initialFavorited: PropTypes.bool,
};
