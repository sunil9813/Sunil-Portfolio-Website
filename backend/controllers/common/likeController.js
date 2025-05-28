const { default: mongoose } = require("mongoose");
const BlogModel = require("../../models/BlogModel");
const { ChapterModel } = require("../../models/educationModel/ChapterModel");
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

    if (resource.likes.includes(userId)) {
      await model.updateOne({ _id: id }, { $pull: { likes: userId } });
      return res.json({ status: "removed" });
    } else {
      await model.updateOne({ _id: id }, { $addToSet: { likes: userId } });
      return res.json({ status: "added" });
    }
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

module.exports = { likeBlog, likeCourse, likeProject, likeChapter };
