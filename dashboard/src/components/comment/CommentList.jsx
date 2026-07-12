import PropTypes from "prop-types";
import { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaReply } from "react-icons/fa";

import { CommentEditor } from "./CommentEditor";

const commentsData = [
  {
    id: 1,
    name: "John Doe",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
    createdAt: "2023-10-01T12:34:56Z",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    likes: 10,
    replies: [
      {
        id: 2,
        name: "Jane Smith",
        img: "https://randomuser.me/api/portraits/women/2.jpg",
        createdAt: "2023-10-01T13:00:00Z",
        desc: "I agree with you, John!",
        likes: 5,
        replies: [
          {
            id: 3,
            name: "Alice Johnson",
            img: "https://randomuser.me/api/portraits/women/3.jpg",
            createdAt: "2023-10-01T13:30:00Z",
            desc: "Yes, it's a fantastic post!",
            likes: 3,
            replies: [
              {
                id: 2.3,
                name: "Jane Smith",
                img: "https://randomuser.me/api/portraits/women/2.jpg",
                createdAt: "2023-10-01T13:00:00Z",
                desc: "I agree with you, John!",
                likes: 5,
                replies: [
                  {
                    id: 4,
                    name: "Bob Brown",
                    img: "https://randomuser.me/api/portraits/men/4.jpg",
                    createdAt: "2023-10-01T14:00:00Z",
                    desc: "I have a different opinion, though.",
                    likes: 2,
                    replies: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 5,
        name: "Bob Brown",
        img: "https://randomuser.me/api/portraits/men/4.jpg",
        createdAt: "2023-10-01T14:00:00Z",
        desc: "I have a different opinion, though.",
        likes: 2,
        replies: [],
      },
    ],
  },
  {
    id: 6,
    name: "Emily Davis",
    img: "https://randomuser.me/api/portraits/women/5.jpg",
    createdAt: "2023-10-02T09:15:00Z",
    desc: "This post really made me think.",
    likes: 8,
    replies: [
      {
        id: 7,
        name: "Michael Wilson",
        img: "https://randomuser.me/api/portraits/men/6.jpg",
        createdAt: "2023-10-02T10:00:00Z",
        desc: "I feel the same way, Emily!",
        likes: 4,
        replies: [],
      },
    ],
  },
  {
    id: 8,
    name: "Chris Evans",
    img: "https://randomuser.me/api/portraits/men/7.jpg",
    createdAt: "2023-10-03T15:45:00Z",
    desc: "Great insights in this post.",
    likes: 12,
    replies: [],
  },
];

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

export const CommentList = () => {
  const [activeEditorId, setActiveEditorId] = useState(null);
  const [allComments, setAllComments] = useState(commentsData);

  const handleReplySubmit = (commentId, newReply) => {
    const updateReplies = (comments) => {
      return comments.map((currentComment) => {
        if (currentComment.id === commentId) {
          return {
            ...currentComment,
            replies: [...(currentComment.replies || []), newReply],
          };
        }

        if (currentComment?.replies?.length) {
          return {
            ...currentComment,
            replies: updateReplies(currentComment.replies),
          };
        }

        return currentComment;
      });
    };

    setAllComments((previousComments) => updateReplies(previousComments));

    setActiveEditorId(null);
  };

  return (
    <div className="space-y-3">
      {allComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} activeEditorId={activeEditorId} setActiveEditorId={setActiveEditorId} onReplySubmit={handleReplySubmit} depth={0} />
      ))}
    </div>
  );
};

export const CommentItem = ({ comment, activeEditorId, setActiveEditorId, onReplySubmit, depth = 0 }) => {
  const [showAllReplies, setShowAllReplies] = useState(false);

  const totalReplies = countAllReplies(comment);
  const hasMoreThanTwoReplies = totalReplies > 2;
  const isEditorActive = activeEditorId === comment.id;

  const displayedReplies = showAllReplies ? comment.replies || [] : getLimitedReplies(comment.replies, 2);

  const handleReplyClick = () => {
    setActiveEditorId(isEditorActive ? null : comment.id);
  };

  const handleReplySubmit = (newReply) => {
    onReplySubmit(comment.id, newReply);
  };

  return (
    <article className={`relative ${depth > 0 ? "ml-3 border-l border-gray-200 pl-3 dark:border-white/[0.055] sm:ml-6 sm:pl-5" : ""}`}>
      <div className="group/comment relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-50/45 p-4 transition-all duration-300 hover:border-indigo-300/25 hover:bg-white/75 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-white/[0.045] dark:bg-white/[0.016] dark:hover:border-indigo-300/[0.10] dark:hover:bg-white/[0.026] dark:hover:shadow-[0_14px_32px_rgba(0,0,0,0.20)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.015),transparent_45%,transparent)]" />

        {/* Comment header */}
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

        {/* Comment content */}
        <div className="relative z-10 mt-3 sm:pl-14">
          <p
            className="text-[11px] leading-6 text-gray-600 dark:text-white/45"
            dangerouslySetInnerHTML={{
              __html: comment?.desc,
            }}
          />

          {/* Actions */}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/70 bg-white/50 px-2.5 py-1.5 text-[9px] font-medium text-gray-600 transition-all hover:border-rose-300/25 hover:bg-rose-500/[0.05] hover:text-rose-700 dark:border-white/[0.045] dark:bg-white/[0.018] dark:text-white/35 dark:hover:border-rose-300/[0.10] dark:hover:text-rose-200/65"
            >
              <AiFillLike size={12} />

              <span className="tabular-nums">{comment?.likes}</span>
            </button>

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
          </div>
        </div>
      </div>

      {/* Reply editor */}
      {isEditorActive && (
        <div className="mt-3 rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.025] p-3 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.018]">
          <CommentEditor onSubmit={handleReplySubmit} onCancel={() => setActiveEditorId(null)} />
        </div>
      )}

      {/* Replies */}
      {totalReplies > 0 && (
        <div className="mt-3 space-y-3">
          {displayedReplies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} activeEditorId={activeEditorId} setActiveEditorId={setActiveEditorId} onReplySubmit={onReplySubmit} depth={depth + 1} />
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
  name: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  replies: PropTypes.array,
});

CommentItem.propTypes = {
  comment: commentShape.isRequired,
  activeEditorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setActiveEditorId: PropTypes.func.isRequired,
  onReplySubmit: PropTypes.func.isRequired,
  depth: PropTypes.number,
};
