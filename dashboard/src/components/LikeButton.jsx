import PropTypes from "prop-types";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { IconButton } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "@/redux/slices/common/likeSlice";
import { useState, useEffect } from "react";

export const LikeButton = ({ resourceType, contentId, initialLikes = [] }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

  // Local state to manage likes
  const [likes, setLikes] = useState(initialLikes);
  const isLiked = likes?.includes(userId); // Check if the current user has liked

  // Sync local likes with initialLikes prop when it changes
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const handleLikeToggle = () => {
    const newLikes = isLiked
      ? likes.filter((id) => id !== userId) // Remove like
      : [...likes, userId]; // Add like

    const originalLikes = [...likes]; // Store original state for revert
    setLikes(newLikes); // Optimistic update

    dispatch(toggleLike({ resourceType, id: contentId }))
      .unwrap()
      .catch(() => {
        setLikes(originalLikes); // Revert on failure
      });
  };

  return (
    <>
      <IconButton color="blue" onClick={handleLikeToggle}>
        {isLiked ? <AiFillLike size={22} /> : <AiOutlineLike size={22} />}
      </IconButton>
      <span className="ml-2">{likes.length}</span>
    </>
  );
};
LikeButton.propTypes = {
  resourceType: PropTypes.string.isRequired,
  contentId: PropTypes.string.isRequired,
  initialLikes: PropTypes.array,
};
