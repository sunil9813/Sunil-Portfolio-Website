const { default: mongoose } = require("mongoose");
const { RatingModel, CommentModel } = require("../../models/common/CommentsModel");

const addRatingOrComment = async (req, res) => {
  const { resourceId, resourceType, content, rating, parentCommentId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(resourceId)) {
    return res.status(422).json({ error: "Resource id is invalid!" });
  }

  // Check if the resource type is valid
  if (!["Project", "Courses", "Posts", "Chapter"].includes(resourceType)) {
    return res.status(422).json({ error: "Invalid resource type!" });
  }

  try {
    if (rating !== undefined) {
      if (["Project", "Courses"].includes(resourceType)) {
        const ratingModel = new RatingModel({
          owner: req.user.id,
          rating,
          resourceType,
          resourceId,
        });
        await ratingModel.save();
        return res.json({ status: "Rating added." });
      } else {
        return res.status(422).json({ error: "Ratings are not allowed for this resource type." });
      }
    } else if (content !== undefined) {
      // Check if it's a reply
      if (parentCommentId) {
        const parentComment = await CommentModel.findById(parentCommentId);
        if (!parentComment) {
          return res.status(404).json({ error: "Parent comment not found!" });
        }

        const commentModel = new CommentModel({
          owner: req.user.id,
          content,
          resourceType,
          resourceId,
          parentComment: parentCommentId,
        });
        await commentModel.save();

        parentComment.replies.push(commentModel);
        await parentComment.save();

        return res.json({ status: "Reply added." });
      } else {
        const commentModel = new CommentModel({
          owner: req.user.id,
          content,
          resourceType,
          resourceId,
        });
        await commentModel.save();

        return res.json({ status: "Comment added." });
      }
    } else {
      return res.status(422).json({ error: "Invalid request." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
};

async function getCommentsWithReplies(commentId) {
  const comments = await CommentModel.find({ parentComment: commentId }).populate({
    path: "owner",
    select: "name avatar",
  });

  const commentData = [];

  for (const comment of comments) {
    const replies = await getCommentsWithReplies(comment._id);
    commentData.push({
      comment,
      replies,
    });
  }

  return commentData;
}

const getComments = async (req, res) => {
  try {
    const resourceId = req.params.id;
    const comments = await CommentModel.find({ resourceId, parentComment: null }).populate({
      path: "owner",
      select: "name avatar",
    });
    const commentsWithReplies = [];

    for (const comment of comments) {
      const replies = await getCommentsWithReplies(comment._id);
      commentsWithReplies.push({
        comment,
        replies,
      });
    }

    // Fetch rating data for Courses and Project
    if (req.user && ["Courses", "Project"].includes(req.user.resourceType)) {
      const ratingData = await RatingModel.findOne({
        owner: req.user.id,
        resourceType: req.user.resourceType,
        resourceId: req.params.id,
      });

      // Attach rating data to the response
      if (ratingData) {
        commentsWithReplies.rating = ratingData.rating;
      }
    }

    return res.json(commentsWithReplies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
};

const getCommentsandRatings = async (req, res) => {
  try {
    const resourceType = req.params.resourceType;
    const resourceId = req.params.resourceId;

    const ratings = await RatingModel.find({ resourceType, resourceId }).populate({
      path: "owner",
      select: "name avatar",
    });

    let averageRating = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
      averageRating = sum / ratings.length;
    }

    res.status(200).json({ ratings, averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addRatingOrComment, getComments, getCommentsandRatings };
