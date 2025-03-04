const natural = require("natural");
const cosine = require("compute-cosine-similarity");
const expressAsyncHandler = require("express-async-handler");
const CoursesModel = require("../../models/notes/CoursesModel");

const getRecommendedCourses = expressAsyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const viewedCourse = await CoursesModel.findOne({ _id: courseId }); // Use _id here
  const courses = await CoursesModel.find();

  if (!viewedCourse) {
    return res.status(404).json({ error: "Course not found" });
  }

  // Calculate content similarity and sort courses by similarity score
  const recommendedCourses = calculateSimilarityAndRecommend(viewedCourse, courses);

  // Return the top recommended courses
  const topRecommendations = recommendedCourses.slice(0, 5); // Adjust the number as needed

  res.json(topRecommendations);
});

function calculateSimilarityAndRecommend(viewedCourse, courses) {
  // Add courses as a parameter
  // Tokenize and preprocess course descriptions
  const tokenizer = new natural.WordTokenizer();
  const viewedTokens = tokenizer.tokenize(viewedCourse.description.toLowerCase());

  // Calculate TF-IDF vectors for all courses
  const tfidf = new natural.TfIdf();
  courses.forEach((course) => {
    const courseTokens = tokenizer.tokenize(course.description.toLowerCase());
    tfidf.addDocument(courseTokens);
  });

  // Calculate the TF-IDF vector for the viewed course
  tfidf.tfidfs(viewedTokens, (i, measure) => {
    viewedCourse[`tfidf_${i}`] = measure;
  });

  // Calculate cosine similarity between the viewed course and all other courses
  const similarities = [];
  courses.forEach((course) => {
    const viewedCourseVector = Object.keys(viewedCourse)
      .filter((key) => key.startsWith("tfidf_"))
      .map((key) => viewedCourse[key]);

    const courseVector = Object.keys(course)
      .filter((key) => key.startsWith("tfidf_"))
      .map((key) => course[key]);

    // Check if the vectors have the same length
    if (viewedCourseVector.length !== courseVector.length) {
      // Handle vector length mismatch (e.g., by skipping this course)
      console.log(`Skipping course with ID ${course.id} due to vector length mismatch.`);
    } else {
      // Calculate cosine similarity only if vectors have the same length
      const similarity = cosine(viewedCourseVector, courseVector);
      similarities.push({ course, similarity });
    }
  });
  // Sort courses by similarity score in descending order
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Extract recommended courses (excluding the viewed course)
  const recommendedCourses = similarities.filter((similarity) => similarity.course.id !== viewedCourse.id).map((similarity) => similarity.course);

  return recommendedCourses;
}
module.exports = {
  getRecommendedCourses,
};
/*
function calculateSimilarityAndRecommend(viewedCourse, courses) {
  // Tokenize and preprocess course descriptions
  const tokenizer = new natural.WordTokenizer();
  const viewedTokens = tokenizer.tokenize(viewedCourse.description.toLowerCase());

  // Calculate TF-IDF vectors for all courses
  const tfidf = new natural.TfIdf();
  courses.forEach((course) => {
    const courseTokens = tokenizer.tokenize(course.description.toLowerCase());
    tfidf.addDocument(courseTokens);
  });

  // Calculate the TF-IDF vector for the viewed course
  tfidf.tfidfs(viewedTokens, (i, measure) => {
    viewedCourse[`tfidf_${i}`] = measure;
  });

  // Calculate cosine similarity between the viewed course and all other courses
  const similarities = [];
  courses.forEach((course) => {
    const similarity = cosine(
      Object.keys(viewedCourse)
        .filter((key) => key.startsWith("tfidf_"))
        .map((key) => viewedCourse[key]),
      Object.keys(course)
        .filter((key) => key.startsWith("tfidf_"))
        .map((key) => course[key])
    );
    similarities.push({ course, similarity });
  });

  // Sort courses by similarity score in descending order
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Extract recommended courses (excluding the viewed course)
  const recommendedCourses = similarities.filter((similarity) => similarity.course.id !== viewedCourse.id).map((similarity) => similarity.course);

  return recommendedCourses;
}
*/
