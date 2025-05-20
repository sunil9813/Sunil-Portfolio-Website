import { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaReply } from "react-icons/fa";
import PropTypes from "prop-types";
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

// Function to flatten all comments into a list with depth
const flattenComments = (comment, depth = 0, result = []) => {
  if (comment.replies) {
    comment.replies.forEach((reply) => {
      result.push({ ...reply, depth });
      flattenComments(reply, depth + 1, result);
    });
  }
  return result;
};

// Function to count all nested replies
const countAllReplies = (comment) => {
  return flattenComments(comment).length;
};

// Function to get limited replies (up to maxCount) while preserving structure
const getLimitedReplies = (replies, maxCount, currentCount = { value: 0 }) => {
  let result = [];
  for (let reply of replies || []) {
    if (currentCount.value >= maxCount) break;
    currentCount.value++;
    let limitedNested = [];
    if (reply.replies) {
      limitedNested = getLimitedReplies(reply.replies, maxCount, currentCount);
    }
    result.push({ ...reply, replies: limitedNested });
  }
  return result;
};

export const CommentList = () => {
  const [activeEditorId, setActiveEditorId] = useState(null); // Track the active editor
  const [allComments, setAllComments] = useState(commentsData); // Manage all comments state

  const handleReplySubmit = (commentId, newReply) => {
    const updateReplies = (comments) => {
      return comments.map((c) => {
        if (c.id === commentId) {
          return { ...c, replies: [...(c.replies || []), newReply] };
        }
        if (c.replies) {
          return { ...c, replies: updateReplies(c.replies) };
        }
        return c;
      });
    };

    setAllComments((prev) => updateReplies(prev));
    setActiveEditorId(null); // Hide editor after submission
  };

  return (
    <div className="comment-section">
      {allComments.map((comment) => (
        <Comments key={comment.id} comment={comment} activeEditorId={activeEditorId} setActiveEditorId={setActiveEditorId} onReplySubmit={handleReplySubmit} />
      ))}
    </div>
  );
};

export const Comments = ({ comment, activeEditorId, setActiveEditorId, onReplySubmit }) => {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const totalReplies = countAllReplies(comment);
  const hasMoreThanTwoReplies = totalReplies > 2;
  const isEditorActive = activeEditorId === comment.id;

  const displayedReplies = showAllReplies ? comment.replies || [] : getLimitedReplies(comment.replies, 2);

  const handleReplyClick = () => {
    setActiveEditorId(isEditorActive ? null : comment.id); // Toggle editor for this comment
  };

  const handleReplySubmit = (newReply) => {
    onReplySubmit(comment.id, newReply); // Pass new reply up to CommentList
  };

  return (
    <>
      <div className="comment pl-4 my-4">
        <div className="comment-header flex items-center gap-3">
          <img src={comment?.img} alt={comment?.name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <strong>{comment?.name}</strong>
            <h2 className="text-sm text-gray-500">{new Date(comment?.createdAt).toLocaleString()}</h2>
          </div>
        </div>
        <div className="pl-14">
          <p className="py-2 text-gray-600" dangerouslySetInnerHTML={{ __html: comment?.desc }} />
          <div className="comment-footer flex items-center gap-5">
            <button className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
              <AiFillLike size={18} />
              <span className="text-sm">{comment?.likes}</span>
            </button>
            <button onClick={handleReplyClick} className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
              <FaReply size={18} />
              <span className="text-sm">Reply</span>
            </button>
          </div>
        </div>
        {isEditorActive && <CommentEditor onSubmit={handleReplySubmit} onCancel={() => setActiveEditorId(null)} />}
        {totalReplies > 0 && (
          <div className="replies ml-8 pl-4">
            {displayedReplies.map((reply) => (
              <Comments key={reply.id} comment={reply} activeEditorId={activeEditorId} setActiveEditorId={setActiveEditorId} onReplySubmit={onReplySubmit} />
            ))}

            {hasMoreThanTwoReplies && (
              <button onClick={() => setShowAllReplies(!showAllReplies)} className="mt-2 text-blue-500 hover:text-blue-700 text-sm">
                {showAllReplies ? "Show less" : `+${totalReplies - 2} more replies`}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const commentShape = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  replies: PropTypes.arrayOf(PropTypes.shape({})),
};
commentShape.replies = PropTypes.arrayOf(PropTypes.shape(commentShape));

CommentList.propTypes = {};

Comments.propTypes = {
  comment: PropTypes.shape(commentShape).isRequired,
  activeEditorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setActiveEditorId: PropTypes.func.isRequired,
  onReplySubmit: PropTypes.func.isRequired,
};
