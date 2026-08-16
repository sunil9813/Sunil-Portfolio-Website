const { default: mongoose } = require("mongoose");
const { RatingModel, CommentModel } = require("../../models/common/CommentsModel");
const BlogModel = require("../../models/BlogModel");
const ChapterModel = require("../../models/educationModel/ChapterModel");
const SubjectModel = require("../../models/educationModel/SubjectModel");
const ProjectModel = require("../../models/project/ProjectModel");

const allowedCommentTypes = ["Project", "Courses", "Posts", "Chapter"];
const allowedRatingTypes = ["Project", "Courses"];

const hasCommentContent = (content = "") => {
  const value = String(content);
  const text = value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return text.length > 0 || /<(img|video|iframe|figure)\b/i.test(value);
};

const canManageComment = (comment, user) => {
  return String(comment.owner) === String(user.id) || user.role === "admin" || user.isAdmin;
};

const getCommentResourceModel = (resourceType) => {
  if (resourceType === "Posts") return BlogModel;
  if (resourceType === "Project") return ProjectModel;
  if (resourceType === "Courses") return SubjectModel;
  if (resourceType === "Chapter") return ChapterModel;
  return null;
};

const getResourceSnapshot = async (resourceType, resourceId) => {
  const model = getCommentResourceModel(resourceType);

  if (!model) return null;

  return model.findById(resourceId).select("title name metaTitle slug cover thumbnail logo").lean();
};

const addRatingOrComment = async (req, res) => {
  const { resourceId, resourceType, content, rating, parentCommentId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(resourceId)) {
    return res.status(422).json({ error: "Resource id is invalid!" });
  }

  if (!allowedCommentTypes.includes(resourceType)) {
    return res.status(422).json({ error: "Invalid resource type!" });
  }

  const hasRating = rating !== undefined && rating !== null && rating !== "";
  const hasContent = content !== undefined && hasCommentContent(content);

  if (!hasRating && !hasContent) {
    return res.status(422).json({ error: "Comment or rating is required." });
  }

  try {
    let savedRating = null;
    let savedComment = null;

    if (hasRating) {
      if (!allowedRatingTypes.includes(resourceType)) {
        return res.status(422).json({ error: "Ratings are not allowed for this resource type." });
      }

      const numericRating = Number(rating);

      if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(422).json({ error: "Rating must be between 1 and 5." });
      }

      savedRating = await RatingModel.findOneAndUpdate(
        { owner: req.user.id, resourceType, resourceId },
        { owner: req.user.id, rating: numericRating, resourceType, resourceId },
        { new: true, upsert: true, runValidators: true },
      );
    }

    if (hasContent) {
      if (parentCommentId) {
        if (!mongoose.Types.ObjectId.isValid(parentCommentId)) {
          return res.status(422).json({ error: "Parent comment id is invalid!" });
        }

        const parentComment = await CommentModel.findOne({ _id: parentCommentId, resourceId, resourceType });

        if (!parentComment) {
          return res.status(404).json({ error: "Parent comment not found!" });
        }

        savedComment = await CommentModel.create({
          owner: req.user.id,
          content,
          resourceType,
          resourceId,
          parentComment: parentCommentId,
        });

        parentComment.replies.push(savedComment._id);
        await parentComment.save();
      } else {
        savedComment = await CommentModel.create({
          owner: req.user.id,
          content,
          resourceType,
          resourceId,
          parentComment: null,
        });
      }

      await savedComment.populate({ path: "owner", select: "name avatar" });
    }

    return res.status(201).json({
      status: "Saved successfully.",
      comment: savedComment,
      rating: savedRating,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
};

async function getCommentsWithReplies(commentId) {
  const comments = await CommentModel.find({ parentComment: commentId }).populate({ path: "owner", select: "name avatar" }).sort({ createdAt: 1 });

  const commentData = [];

  for (const comment of comments) {
    const replies = await getCommentsWithReplies(comment._id);
    commentData.push({ comment, replies });
  }

  return commentData;
}

const getComments = async (req, res) => {
  try {
    const resourceId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(422).json({ error: "Resource id is invalid!" });
    }

    const comments = await CommentModel.find({ resourceId, parentComment: null }).populate({ path: "owner", select: "name avatar" }).sort({ createdAt: -1 });

    const commentsWithReplies = [];

    for (const comment of comments) {
      const replies = await getCommentsWithReplies(comment._id);
      commentsWithReplies.push({ comment, replies });
    }

    return res.json(commentsWithReplies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
};

const getMyComments = async (req, res) => {
  try {
    const comments = await CommentModel.find({ owner: req.user.id }).sort("-createdAt").lean();

    const commentsWithResource = await Promise.all(
      comments.map(async (comment) => ({
        ...comment,
        resource: await getResourceSnapshot(comment.resourceType, comment.resourceId),
      })),
    );

    return res.json({
      totalComments: commentsWithResource.length,
      comments: commentsWithResource,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(422).json({ error: "Comment id is invalid!" });
    }

    if (!hasCommentContent(content)) {
      return res.status(422).json({ error: "Comment content is required." });
    }

    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found!" });
    }

    if (!canManageComment(comment, req.user)) {
      return res.status(403).json({ error: "You are not allowed to edit this comment." });
    }

    comment.content = content;
    await comment.save();

    await comment.populate({ path: "owner", select: "name avatar" });

    return res.json({
      status: "Comment updated.",
      comment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
};

const deleteCommentTree = async (commentId) => {
  const replies = await CommentModel.find({ parentComment: commentId });

  for (const reply of replies) {
    await deleteCommentTree(reply._id);
  }

  await CommentModel.deleteOne({ _id: commentId });
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(422).json({ error: "Comment id is invalid!" });
    }

    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found!" });
    }

    if (!canManageComment(comment, req.user)) {
      return res.status(403).json({ error: "You are not allowed to delete this comment." });
    }

    if (comment.parentComment) {
      await CommentModel.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id },
      });
    }

    await deleteCommentTree(comment._id);

    return res.json({ status: "Comment deleted." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
};

const getCommentsandRatings = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;

    if (!allowedRatingTypes.includes(resourceType)) {
      return res.status(422).json({ error: "Invalid rating resource type." });
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(422).json({ error: "Resource id is invalid!" });
    }

    const ratings = await RatingModel.find({ resourceType, resourceId }).populate({
      path: "owner",
      select: "name avatar",
    });

    const averageRating = ratings.length > 0 ? ratings.reduce((total, item) => total + item.rating, 0) / ratings.length : 0;

    res.status(200).json({
      ratings,
      averageRating,
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(422).json({ error: "Comment id is invalid!" });
    }

    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found!" });
    }

    const alreadyLiked = comment.likes.some((userId) => String(userId) === String(req.user.id));

    if (alreadyLiked) {
      comment.likes = comment.likes.filter((userId) => String(userId) !== String(req.user.id));
    } else {
      comment.likes.push(req.user.id);
    }

    await comment.save();

    return res.json({
      status: alreadyLiked ? "Like removed." : "Comment liked.",
      liked: !alreadyLiked,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
};
module.exports = {
  addRatingOrComment,
  getMyComments,
  getComments,
  updateComment,
  deleteComment,
  getCommentsandRatings,
  toggleCommentLike,
};
