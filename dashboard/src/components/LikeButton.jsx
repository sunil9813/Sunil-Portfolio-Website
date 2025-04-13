import PropTypes from "prop-types";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setInitialLikes, toggleLike, updateLikeLocally } from "@/redux/slices/common/likeSlice";
import { useEffect, useCallback } from "react";
import { IconButton } from "@material-tailwind/react";

export const LikeButton = ({ resourceType, contentId, initialLikes = [] }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

  // Get current likes count and status from Redux
  const currentLikeCount = useSelector((state) => state.like.likeCounts[resourceType]?.[contentId]) ?? initialLikes.length;
  const isLiked = useSelector((state) => state.like.likedPosts[resourceType]?.[contentId]) ?? initialLikes.includes(userId);

  // Initialize Redux state with initialLikes only once
  useEffect(() => {
    dispatch(setInitialLikes({ resourceType, id: contentId, likes: initialLikes }));
  }, [dispatch, resourceType, contentId, initialLikes]);

  const handleLikeToggle = useCallback(() => {
    // Use current Redux state as base, not initialLikes
    const currentLikes = Array(currentLikeCount).fill("user"); // Dummy array for length; real IDs not needed here
    const newLikes = isLiked
      ? currentLikes.filter((_, i) => i !== currentLikes.length - 1) // Simulate removing last like
      : [...currentLikes, userId]; // Add userId

    // Update Redux optimistically
    dispatch(updateLikeLocally({ resourceType, id: contentId, likes: newLikes, userId, isLiked }));

    // Call API
    dispatch(toggleLike({ resourceType, id: contentId, newLikes }))
      .unwrap()
      .then(() => console.log("API Success:", { newLikes: newLikes.length }))
      .catch(() => {
        dispatch(updateLikeLocally({ resourceType, id: contentId, likes: currentLikes, userId, isLiked: !isLiked }));
      });
  }, [dispatch, resourceType, contentId, userId, isLiked, currentLikeCount]);

  return (
    <IconButton color="blue" onClick={handleLikeToggle}>
      {isLiked ? <AiFillLike size={22} /> : <AiOutlineLike size={22} />}
    </IconButton>
  );
};

LikeButton.propTypes = {
  resourceType: PropTypes.string.isRequired,
  contentId: PropTypes.string.isRequired,
  initialLikes: PropTypes.array,
};
