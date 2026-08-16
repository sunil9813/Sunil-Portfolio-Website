import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaRegEdit, FaReply, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import { addComment, deleteComment, getComments, toggleCommentLike, updateComment } from "@/redux/slices/common/commentSlice";
import { CommentEditor } from "./CommentEditor";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3940/3940417.png";

const stripHtml = (html = "") => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const getLoggedInUser = (state) => {
  return state?.auth?.user || state?.auth?.authUser || state?.auth?.currentUser || state?.user?.user || state?.user?.currentUser || state?.profile?.user || null;
};

const getUserId = (user) => {
  return user?._id || user?.id || user?.user?._id || user?.user?.id || user?.data?._id || user?.data?.id || "";
};

const normalizeComment = (node) => {
  const comment = node?.comment || node;

  return {
    id: comment?._id,
    ownerId: comment?.owner?._id || comment?.owner?.id || comment?.owner,
    name: comment?.owner?.name || comment?.owner?.fullname || comment?.owner?.username || "Unknown user",
    img: comment?.owner?.avatar?.filePath || comment?.owner?.avatar?.url || comment?.owner?.avatar || DEFAULT_AVATAR,
    createdAt: comment?.createdAt || "",
    desc: comment?.content || "",
    replies: Array.isArray(node?.replies) ? node.replies.map(normalizeComment) : [],
    likes: Array.isArray(comment?.likes) ? comment.likes.length : comment?.likesCount || 0,
    likedBy: Array.isArray(comment?.likes) ? comment.likes.map((userId) => userId?._id || userId?.id || userId) : [],
  };
};

const applyOptimisticLikes = (comments = [], optimisticLikes = {}) => {
  return comments.map((comment) => {
    const optimistic = optimisticLikes[comment.id];

    return {
      ...comment,
      likes: optimistic?.likes ?? comment.likes,
      likedBy: optimistic?.likedBy ?? comment.likedBy,
      replies: applyOptimisticLikes(comment.replies || [], optimisticLikes),
    };
  });
};

const flattenComments = (comment, depth = 0, result = []) => {
  if (!comment?.replies?.length) {
    return result;
  }

  comment.replies.forEach((reply) => {
    result.push({
      ...reply,
      depth,
    });

    flattenComments(reply, depth + 1, result);
  });

  return result;
};

const countAllReplies = (comment) => {
  return flattenComments(comment).length;
};

const getLimitedReplies = (replies, maxCount, currentCount = { value: 0 }) => {
  const result = [];

  for (const reply of replies || []) {
    if (currentCount.value >= maxCount) {
      break;
    }

    currentCount.value += 1;

    const limitedNested = reply?.replies?.length ? getLimitedReplies(reply.replies, maxCount, currentCount) : [];

    result.push({
      ...reply,
      replies: limitedNested,
    });
  }

  return result;
};

const formatCommentDate = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const CommentList = ({ resourceId, resourceType = "Chapter", showRootEditor = true, canComment = false }) => {
  const dispatch = useDispatch();
  const { comments, isLoading, isPosting } = useSelector((state) => state.comment);
  const loggedInUser = useSelector(getLoggedInUser);

  const currentUserId = getUserId(loggedInUser);

  const [activeEditorId, setActiveEditorId] = useState(null);
  const [activeEditId, setActiveEditId] = useState(null);
  const [rootComment, setRootComment] = useState("");
  const [editValue, setEditValue] = useState("");
  const [postingParentId, setPostingParentId] = useState(null);
  const [optimisticLikes, setOptimisticLikes] = useState({});
  const [likingIds, setLikingIds] = useState({});

  const allComments = useMemo(() => {
    const normalizedComments = Array.isArray(comments) ? comments.map(normalizeComment) : [];
    return applyOptimisticLikes(normalizedComments, optimisticLikes);
  }, [comments, optimisticLikes]);

  useEffect(() => {
    if (resourceId) {
      dispatch(getComments(resourceId));
    }
  }, [dispatch, resourceId]);

  const handleCommentSubmit = async () => {
    if (!canComment || !resourceId || stripHtml(rootComment).trim().length === 0) {
      return;
    }

    setPostingParentId("root");

    const result = await dispatch(
      addComment({
        resourceId,
        resourceType,
        content: rootComment,
      }),
    );

    if (!result?.error) {
      setRootComment("");
      dispatch(getComments(resourceId));
    }

    setPostingParentId(null);
  };

  const handleReplySubmit = async (commentId, replyContent) => {
    if (!canComment || !resourceId || !commentId || stripHtml(replyContent).trim().length === 0) {
      return;
    }

    setPostingParentId(commentId);

    const result = await dispatch(
      addComment({
        resourceId,
        resourceType,
        content: replyContent,
        parentCommentId: commentId,
      }),
    );

    if (!result?.error) {
      setActiveEditorId(null);
      dispatch(getComments(resourceId));
    }

    setPostingParentId(null);
  };

  const handleUpdateSubmit = async (commentId) => {
    if (!canComment || !resourceId || !commentId || stripHtml(editValue).trim().length === 0) {
      return;
    }

    setPostingParentId(`edit-${commentId}`);

    const result = await dispatch(
      updateComment({
        commentId,
        content: editValue,
      }),
    );

    if (!result?.error) {
      setActiveEditId(null);
      setEditValue("");
      dispatch(getComments(resourceId));
    }

    setPostingParentId(null);
  };

  const handleDeleteSubmit = async (commentId) => {
    if (!canComment || !resourceId || !commentId) {
      return;
    }

    setPostingParentId(`delete-${commentId}`);

    const result = await dispatch(deleteComment(commentId));

    if (!result?.error) {
      dispatch(getComments(resourceId));
    }

    setPostingParentId(null);
  };

  const handleLikeSubmit = async (event, comment) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!canComment || !resourceId || !comment?.id || !currentUserId || likingIds[comment.id]) {
      return;
    }

    const isAlreadyLiked = Array.isArray(comment?.likedBy) && comment.likedBy.some((userId) => String(userId) === String(currentUserId));
    const nextLikedBy = isAlreadyLiked ? comment.likedBy.filter((userId) => String(userId) !== String(currentUserId)) : [...(comment.likedBy || []), currentUserId];
    const nextLikes = Math.max(0, Number(comment.likes || 0) + (isAlreadyLiked ? -1 : 1));

    setOptimisticLikes((currentValue) => ({
      ...currentValue,
      [comment.id]: {
        likes: nextLikes,
        likedBy: nextLikedBy,
      },
    }));

    setLikingIds((currentValue) => ({
      ...currentValue,
      [comment.id]: true,
    }));

    const result = await dispatch(toggleCommentLike(comment.id));

    if (result?.error) {
      setOptimisticLikes((currentValue) => {
        const nextValue = { ...currentValue };
        delete nextValue[comment.id];
        return nextValue;
      });
    }

    setLikingIds((currentValue) => {
      const nextValue = { ...currentValue };
      delete nextValue[comment.id];
      return nextValue;
    });
  };

  return (
    <div className="space-y-3">
      {showRootEditor && canComment && (
        <div className="rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.025] p-3 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.018]">
          <CommentEditor
            value={rootComment}
            onChange={setRootComment}
            onSubmit={handleCommentSubmit}
            submitLabel={isPosting && postingParentId === "root" ? "Posting..." : "Submit"}
            disabled={isPosting}
          />
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200/70 bg-gray-50/45 p-4 text-center text-[11px] text-gray-500 dark:border-white/[0.045] dark:bg-white/[0.016] dark:text-white/35">
          Loading comments...
        </div>
      ) : allComments.length > 0 ? (
        allComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            canComment={canComment}
            activeEditorId={activeEditorId}
            setActiveEditorId={setActiveEditorId}
            activeEditId={activeEditId}
            setActiveEditId={setActiveEditId}
            editValue={editValue}
            setEditValue={setEditValue}
            onReplySubmit={handleReplySubmit}
            onUpdateSubmit={handleUpdateSubmit}
            onDeleteSubmit={handleDeleteSubmit}
            onLikeSubmit={handleLikeSubmit}
            postingParentId={postingParentId}
            isPosting={isPosting}
            likingIds={likingIds}
            depth={0}
          />
        ))
      ) : (
        <div className="rounded-2xl border border-gray-200/70 bg-gray-50/45 p-4 text-center text-[11px] text-gray-500 dark:border-white/[0.045] dark:bg-white/[0.016] dark:text-white/35">
          No comments yet.
        </div>
      )}
    </div>
  );
};

export const CommentItem = ({
  comment,
  currentUserId,
  canComment,
  activeEditorId,
  setActiveEditorId,
  activeEditId,
  setActiveEditId,
  editValue,
  setEditValue,
  onLikeSubmit,
  onReplySubmit,
  onUpdateSubmit,
  onDeleteSubmit,
  postingParentId,
  isPosting,
  likingIds,
  depth = 0,
}) => {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [replyValue, setReplyValue] = useState("");

  const totalReplies = countAllReplies(comment);
  const hasMoreThanTwoReplies = totalReplies > 2;
  const isEditorActive = activeEditorId === comment.id;
  const isEditActive = activeEditId === comment.id;
  const isCurrentReplyPosting = isPosting && postingParentId === comment.id;
  const isCurrentEditPosting = isPosting && postingParentId === `edit-${comment.id}`;
  const isCurrentDeletePosting = isPosting && postingParentId === `delete-${comment.id}`;
  const isCurrentLikePosting = Boolean(likingIds?.[comment.id]);
  const canManageComment = canComment && String(comment?.ownerId || "") === String(currentUserId || "");
  const isLiked = Array.isArray(comment?.likedBy) && comment.likedBy.some((userId) => String(userId) === String(currentUserId || ""));
  const displayedReplies = showAllReplies ? comment.replies || [] : getLimitedReplies(comment.replies, 2);

  const handleReplyClick = () => {
    if (!canComment) {
      return;
    }

    setActiveEditId(null);
    setEditValue("");
    setActiveEditorId(isEditorActive ? null : comment.id);
  };

  const handleEditClick = () => {
    setActiveEditorId(null);
    setReplyValue("");

    if (isEditActive) {
      setActiveEditId(null);
      setEditValue("");
      return;
    }

    setActiveEditId(comment.id);
    setEditValue(comment?.desc || "");
  };

  const handleReplySubmit = async () => {
    await onReplySubmit(comment.id, replyValue);
    setReplyValue("");
  };

  return (
    <article className={`relative ${depth > 0 ? "ml-3 border-l border-gray-200 pl-3 dark:border-white/[0.055] sm:ml-6 sm:pl-5" : ""}`}>
      <div className="group/comment relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-50/45 p-4 transition-all duration-300 hover:border-indigo-300/25 hover:bg-white/75 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-white/[0.045] dark:bg-white/[0.016] dark:hover:border-indigo-300/[0.10] dark:hover:bg-white/[0.026] dark:hover:shadow-[0_14px_32px_rgba(0,0,0,0.20)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.015),transparent_45%,transparent)]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="relative size-11 shrink-0">
            <img src={comment?.img} alt={comment?.name} className="h-full w-full rounded-full border border-gray-200 object-cover dark:border-white/[0.08]" />
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#11151d]" />
          </div>

          <div className="min-w-0">
            <strong className="block truncate text-[12px] font-semibold text-gray-900 dark:text-white/90">{comment?.name}</strong>
            <p className="mt-0.5 text-[9px] text-gray-500 dark:text-white/25">{formatCommentDate(comment?.createdAt)}</p>
          </div>
        </div>

        <div className="relative z-10 mt-3 sm:pl-14">
          {isEditActive ? (
            <div className="rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.025] p-3 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.018]">
              <CommentEditor value={editValue} onChange={setEditValue} onSubmit={() => onUpdateSubmit(comment.id)} submitLabel={isCurrentEditPosting ? "Updating..." : "Update"} disabled={isPosting} />
            </div>
          ) : (
            <div className="text-[11px] leading-6 text-gray-600 dark:text-white/45 [&_p]:my-0 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-semibold [&_em]:italic [&_s]:line-through [&_u]:underline">
              <div dangerouslySetInnerHTML={{ __html: comment?.desc || "" }} />
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={(event) => onLikeSubmit(event, comment)}
              disabled={!canComment || isCurrentLikePosting}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ${
                isLiked
                  ? "border-rose-300/25 bg-rose-500/[0.08] text-rose-700 dark:border-rose-300/[0.10] dark:bg-rose-300/[0.045] dark:text-rose-200/70"
                  : "border-gray-200/70 bg-white/50 text-gray-600 hover:border-rose-300/25 hover:bg-rose-500/[0.05] hover:text-rose-700 dark:border-white/[0.045] dark:bg-white/[0.018] dark:text-white/35 dark:hover:border-rose-300/[0.10] dark:hover:text-rose-200/65"
              }`}
            >
              <AiFillLike size={12} />
              <span className="tabular-nums">{comment?.likes}</span>
            </button>

            {canComment && (
              <button
                type="button"
                onClick={handleReplyClick}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-medium transition-all ${
                  isEditorActive
                    ? "border-indigo-300/25 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.10] dark:bg-indigo-300/[0.045] dark:text-indigo-200/70"
                    : "border-gray-200/70 bg-white/50 text-gray-600 hover:border-indigo-300/25 hover:bg-indigo-500/[0.05] hover:text-indigo-700 dark:border-white/[0.045] dark:bg-white/[0.018] dark:text-white/35 dark:hover:border-indigo-300/[0.10] dark:hover:text-indigo-200/65"
                }`}
              >
                <FaReply size={10} />
                <span>{isEditorActive ? "Cancel reply" : "Reply"}</span>
              </button>
            )}

            {canManageComment && (
              <>
                <button
                  type="button"
                  onClick={handleEditClick}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-medium transition-all ${
                    isEditActive
                      ? "border-indigo-300/25 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.10] dark:bg-indigo-300/[0.045] dark:text-indigo-200/70"
                      : "border-gray-200/70 bg-white/50 text-gray-600 hover:border-indigo-300/25 hover:bg-indigo-500/[0.05] hover:text-indigo-700 dark:border-white/[0.045] dark:bg-white/[0.018] dark:text-white/35 dark:hover:border-indigo-300/[0.10] dark:hover:text-indigo-200/65"
                  }`}
                >
                  <FaRegEdit size={10} />
                  <span>{isEditActive ? "Cancel edit" : "Edit"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteSubmit(comment.id)}
                  disabled={isPosting}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/70 bg-white/50 px-2.5 py-1.5 text-[9px] font-medium text-gray-600 transition-all hover:border-rose-300/25 hover:bg-rose-500/[0.05] hover:text-rose-700 disabled:pointer-events-none disabled:opacity-50 dark:border-white/[0.045] dark:bg-white/[0.018] dark:text-white/35 dark:hover:border-rose-300/[0.10] dark:hover:text-rose-200/65"
                >
                  <FaTrashAlt size={10} />
                  <span>{isCurrentDeletePosting ? "Deleting..." : "Delete"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isEditorActive && (
        <div className="mt-3 rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.025] p-3 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.018]">
          <CommentEditor value={replyValue} onChange={setReplyValue} onSubmit={handleReplySubmit} submitLabel={isCurrentReplyPosting ? "Posting..." : "Submit"} disabled={isPosting} />
        </div>
      )}

      {totalReplies > 0 && (
        <div className="mt-3 space-y-3">
          {displayedReplies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              canComment={canComment}
              activeEditorId={activeEditorId}
              setActiveEditorId={setActiveEditorId}
              activeEditId={activeEditId}
              setActiveEditId={setActiveEditId}
              editValue={editValue}
              setEditValue={setEditValue}
              onLikeSubmit={onLikeSubmit}
              onReplySubmit={onReplySubmit}
              onUpdateSubmit={onUpdateSubmit}
              onDeleteSubmit={onDeleteSubmit}
              postingParentId={postingParentId}
              isPosting={isPosting}
              likingIds={likingIds}
              depth={depth + 1}
            />
          ))}

          {hasMoreThanTwoReplies && (
            <button
              type="button"
              onClick={() => setShowAllReplies((currentValue) => !currentValue)}
              className="ml-3 rounded-full border border-indigo-300/20 bg-indigo-500/[0.04] px-3 py-1.5 text-[9px] font-semibold text-indigo-700 transition-all hover:bg-indigo-500/[0.09] dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65"
            >
              {showAllReplies ? "Show fewer replies" : `+${totalReplies - 2} more replies`}
            </button>
          )}
        </div>
      )}
    </article>
  );
};

const commentShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  ownerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  likedBy: PropTypes.array,
  replies: PropTypes.array,
});

CommentList.propTypes = {
  resourceId: PropTypes.string.isRequired,
  resourceType: PropTypes.oneOf(["Project", "Courses", "Posts", "Chapter"]),
  showRootEditor: PropTypes.bool,
  canComment: PropTypes.bool,
};

CommentItem.propTypes = {
  comment: commentShape.isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  canComment: PropTypes.bool,
  activeEditorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setActiveEditorId: PropTypes.func.isRequired,
  activeEditId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setActiveEditId: PropTypes.func.isRequired,
  editValue: PropTypes.string.isRequired,
  setEditValue: PropTypes.func.isRequired,
  onLikeSubmit: PropTypes.func.isRequired,
  onReplySubmit: PropTypes.func.isRequired,
  onUpdateSubmit: PropTypes.func.isRequired,
  onDeleteSubmit: PropTypes.func.isRequired,
  postingParentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isPosting: PropTypes.bool,
  likingIds: PropTypes.object,
  depth: PropTypes.number,
};
