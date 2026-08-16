const { default: mongoose } = require("mongoose");
const BlogModel = require("../../models/BlogModel");
const ChapterModel = require("../../models/educationModel/ChapterModel");
const SubjectModel = require("../../models/educationModel/SubjectModel");
const ProjectModel = require("../../models/project/ProjectModel");

const toggleLike = async (req, res, model) => {
  const userId = req.user.id;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(422).json({ error: "Resource ID is invalid!" });
  }

  try {
    const resource = await model.findById(id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found!" });
    }

    const likes = Array.isArray(resource.likes) ? resource.likes : [];
    const hasLiked = likes.some((likedUserId) => String(likedUserId) === String(userId));

    if (hasLiked) {
      const nextCount = Math.max(0, likes.length - 1);
      await model.updateOne({ _id: id }, { $pull: { likes: userId }, $set: { likesCount: nextCount } });
      return res.json({ status: "removed", likesCount: nextCount });
    }

    const nextCount = likes.length + 1;
    await model.updateOne({ _id: id }, { $addToSet: { likes: userId }, $set: { likesCount: nextCount } });
    return res.json({ status: "added", likesCount: nextCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
};

const likeBlog = async (req, res) => {
  return toggleLike(req, res, BlogModel);
};
const likeCourse = async (req, res) => {
  return toggleLike(req, res, SubjectModel);
};
const likeProject = async (req, res) => {
  return toggleLike(req, res, ProjectModel);
};
const likeChapter = async (req, res) => {
  return toggleLike(req, res, ChapterModel);
};

const getMyLikes = async (req, res) => {
  const userId = req.user.id;

  try {
    const [blogs, courses, projects, chapters] = await Promise.all([
      BlogModel.find({ likes: userId }).select("title slug cover category numOfViews likes createdAt").populate("category", "title").lean(),
      SubjectModel.find({ likes: userId }).select("name title slug logo thumbnail numOfViews likes createdAt").lean(),
      ProjectModel.find({ likes: userId }).select("title slug thumbnail category numOfViews likes createdAt").populate("category", "title").lean(),
      ChapterModel.find({ likes: userId }).select("title metaTitle slug thumbnail numOfViews likes createdAt").lean(),
    ]);

    return res.json({
      Blog: blogs,
      Courses: courses,
      Project: projects,
      Chapter: chapters,
      totalLikes: blogs.length + courses.length + projects.length + chapters.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
};

module.exports = { likeBlog, likeCourse, likeProject, likeChapter, getMyLikes };
