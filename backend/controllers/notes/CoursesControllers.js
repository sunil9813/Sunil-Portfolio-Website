const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const slugify = require("slugify");
const CoursesModel = require("../../models/notes/CoursesModel");
const UserModel = require("../../models/users/UserModel");
const Filter = require("bad-words");
const { ChapterModel } = require("../../models/notes/AcademicComponentsModel");

const createCourses = asyncHandler(async (req, res) => {
  const { title, premium, description, tagsToAdd, university, faculty, program, semester, subject, totalpage } = req.body;
  const userId = req.user.id;
  const isPaidUser = req.user.paid;

  const originalSlug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });

  let slug = originalSlug;
  let suffix = 1;

  while (await CoursesModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  const folderName = `Sunil Portfolio/Book/${userId.trim()}`;
  let fileData = {};

  // Check if the user is paid
  if (isPaidUser) {
    // User is paid, allow both image uploads (jpg, png, jpeg) and PDF uploads
    if (req.file) {
      if (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/png" || req.file.mimetype === "image/jpg" || req.file.mimetype === "application/pdf") {
        try {
          const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
            folder: folderName,
            resource_type: "image",
          });

          fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            publicId: uploadedFile.public_id,
          };
        } catch (error) {
          console.log(error);
          res.status(500);
          throw new Error("File could not be uploaded");
        }
      } else {
        res.status(400);
        throw new Error("Invalid file type. Only jpg, jpeg, png images, and PDF files are allowed for paid users.");
      }
    } else {
      res.status(400);
      throw new Error("No file uploaded. Please upload a valid file.");
    }
  } else {
    // User is not paid, enforce required fields for non-paid users
    if (!tagsToAdd || !university || !faculty || !program || !semester || !subject || !totalpage) {
      res.status(400);
      throw new Error("All fields (tags, university, faculty, program, semester, subject, total pages) are required for non-paid users.");
    }
    // Check the length of each tag
    if (tagsToAdd && Array.isArray(tagsToAdd)) {
      const uniqueTags = new Set(tagsToAdd);
      for (const newTag of uniqueTags) {
        if (newTag.length > 250) {
          return res.status(400).json({
            error: "Tag length should not exceed 250 characters.",
          });
        }
      }
    }

    // Non-paid users can only upload PDF files
    if (req.file && req.file.mimetype === "application/pdf") {
      try {
        const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
          folder: folderName,
          resource_type: "auto",
        });

        fileData = {
          fileName: req.file.originalname,
          filePath: uploadedFile.secure_url,
          fileType: req.file.mimetype,
          publicId: uploadedFile.public_id,
        };
      } catch (error) {
        res.status(500);
        throw new Error("File could not be uploaded");
      }
    } else {
      res.status(400);
      throw new Error("Invalid file type. Only PDF files are allowed for non-paid users.");
    }
  }

  let tags = []; // Initialize an empty array to store tags

  // Check if tagsToAdd is provided and is an array
  if (tagsToAdd && Array.isArray(tagsToAdd)) {
    // Remove duplicates and ensure each tag does not exceed 250 characters
    const uniqueTags = [...new Set(tagsToAdd.map((tag) => tag.trim()))];
    for (const newTag of uniqueTags) {
      if (newTag.length > 250) {
        res.status(400);
        throw new Error("Tag length should not exceed 250 characters.");
      }
    }
    tags = uniqueTags.map((tag) => ({ tag })); // Convert tags to an array of objects
  }

  // Create the note with the appropriate file data
  const data = await CoursesModel.create({
    user: userId,
    title,
    slug: slug,
    description,
    premium,
    university,
    faculty,
    program,
    semester,
    subject,
    cover: fileData,
    totalpage: totalpage,
    tags: tags,
  });

  // Function to check if a tag already exists in the course's tags
  const isTagExists = async (tagName) => {
    const existingCourse = await CoursesModel.findOne({ "tags.tag": tagName });
    return !!existingCourse;
  };

  // Push the tags into the newly created course's tags array if they don't already exist
  if (tagsToAdd && Array.isArray(tagsToAdd)) {
    for (const tag of tagsToAdd) {
      const tagExists = await isTagExists(tag);
      if (!tagExists) {
        data.tags.push({ tag });
      }
    }
    await data.save();
  }

  res.status(201).json({ message: "Note Book Upload successfully", data });
});

const getAlNoteofUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await UserModel.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const notes = await CoursesModel.find({ user: userId }).sort("createdAt");

  res.status(200).json({
    totalBook: notes?.length,
    notes,
  });
});

const getNote = asyncHandler(async (req, res) => {
  const note = await CoursesModel.findOne({ slug: req.params.slug });
  if (!note) {
    res.status(404);
    throw new Error("Note Book not found");
  }
  res.status(200).json(note);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  try {
    // Find the course by ID
    const course = await CoursesModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    if (course.cover && course.cover.publicId) {
      await cloudinary.uploader.destroy(course.cover.publicId);
    }

    // Find all chapters associated with the course
    const chapters = await ChapterModel.find({ book: courseId });

    // If there are chapters, proceed with deletion
    if (chapters.length > 0) {
      // Loop through chapters and delete their media and cover images from Cloudinary
      for (const chapter of chapters) {
        if (chapter.cover && chapter.cover.publicId) {
          await cloudinary.uploader.destroy(chapter.cover.publicId);
        }

        if (chapter.media) {
          if (chapter.media.fileType.startsWith("image/")) {
            // Delete the media file only if it's an image
            if (chapter.media.publicId) {
              await cloudinary.uploader.destroy(chapter.media.publicId);
            }
          } else if (chapter.media.fileType.startsWith("video/")) {
            // Delete the media file only if it's a video
            if (chapter.media.publicId) {
              await cloudinary.uploader.destroy(chapter.media.publicId, { resource_type: "video" });
            }
          }
        }
      }
      // Delete the chapters
      await ChapterModel.deleteMany({ book: courseId });
    }

    // Delete the course
    await CoursesModel.findByIdAndDelete(courseId);

    return res.status(200).json({ message: "Course and associated files deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

const updateNoteCtr = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const { title, premium, description, tagsToAdd, university, faculty, program, semester, subject, totalpage } = req.body;
  const userId = req.user.id;

  try {
    // Find the course by ID
    const course = await CoursesModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if the user is authorized to update the course (you can add your own authorization logic here)
    if (course.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this course" });
    }

    // Update course properties
    course.title = title || course.title;
    course.premium = premium || course.premium;
    course.description = description || course.description;
    course.university = university || course.university;
    course.faculty = faculty || course.faculty;
    course.program = program || course.program;
    course.semester = semester || course.semester;
    course.subject = subject || course.subject;
    course.totalpage = totalpage || course.totalpage;

    // Update slug based on the new title
    if (title && title !== course.title) {
      let newSlug = slugify(title, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
        strict: true,
      });

      let suffix = 1;
      while (await CoursesModel.findOne({ slug: newSlug, _id: { $ne: course._id } })) {
        newSlug = `${suffix}-${newSlug}`;
        suffix++;
      }
      course.slug = newSlug;
    }

    // Update tags
    if (tagsToAdd && Array.isArray(tagsToAdd)) {
      // Check tag length
      for (const newTag of tagsToAdd) {
        if (newTag.length > 250) {
          return res.status(400).json({
            error: "Tag length should not exceed 250 characters.",
          });
        }
      }
      course.tags = tagsToAdd.map((tag) => ({ tag }));
    }

    // Handle cover image update (if provided)
    const folderName = `Sunil Portfolio/Book/${userId.trim()}`;
    if (req.file) {
      if (course.cover.fileName.endsWith(".pdf") && !req.file.originalname.endsWith(".pdf")) {
        return res.status(400).json({ error: "Only PDF files are allowed for the cover image." });
      } else if ((course.cover.fileName.endsWith(".jpeg") || course.cover.fileName.endsWith(".jpg")) && !(req.file.mimetype.startsWith("image/jpeg") || req.file.mimetype === "image/png")) {
        return res.status(400).json({ error: "Only JPEG, JPG, and PNG images are allowed for the cover image." });
      }

      // Delete previous cover image from Cloudinary (if it exists)
      if (course.cover.publicId) {
        await cloudinary.uploader.destroy(course.cover.publicId);
      }

      // Upload the new cover image to Cloudinary
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: folderName,
        resource_type: "image",
      });

      course.cover = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        publicId: uploadedFile.public_id,
      };
    }

    // Save the updated course
    await course.save();

    return res.status(200).json({ message: "Course updated successfully", data: course });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Public API
const getAlNote = asyncHandler(async (req, res) => {
  const note = await CoursesModel.find().sort("createdAt");
  res.status(200).json({
    totalBook: note?.length,
    note,
  });
});

/* ----------------------------- Chapters --------------------------------- */
const createChapter = asyncHandler(async (req, res) => {
  try {
    const { title, description, tagsToAdd, courseId } = req.body;
    const userId = req.user.id;

    const user = await UserModel.findById(userId);
    if (!user || !user.paid) {
      res.status(403);
      throw new Error("Only paid users can create chapters.");
    }

    // Check if the course (book) exists
    const course = await CoursesModel.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error("Course not found.");
    }

    const filter = new Filter();
    const fieldsToCheck = [title, description, tagsToAdd];
    for (const field of fieldsToCheck) {
      if (filter.isProfane(field)) {
        return res.status(400).json({
          error: "Creation failed because the content contains profane words, and your content cannot be posted due to content guidelines.",
        });
      }
    }

    let mediaData = {};
    let coverData = {};

    // Check if media field exists
    const folderName = `Sunil Portfolio/Book/${userId.trim()}/Chapter/Media`;
    const folderName1 = `Sunil Portfolio/Book/${userId.trim()}/Chapter/Cover`;
    if (req.files && req.files.media) {
      // Handle file upload for media field
      const mediaFile = req.files.media[0];

      // Validate media file type (update with accepted media types)
      const acceptedMediaTypes = ["video/mp4"];
      if (!acceptedMediaTypes.includes(mediaFile.mimetype)) {
        return res.status(400).json({
          error: "Media must be in video format",
        });
      }

      // Handle cloudinary upload for media file (similar to your original code)
      try {
        const uploadedMedia = await cloudinary.uploader.upload(mediaFile.path, {
          folder: folderName,
          resource_type: "video",
        });

        mediaData = {
          fileName: mediaFile.originalname,
          filePath: uploadedMedia.secure_url,
          fileType: mediaFile.mimetype,
          publicId: uploadedMedia.public_id,
        };
      } catch (error) {
        console.error("Error uploading media file:", error);
        return res.status(500).json({ error: "Media file could not be uploaded" });
      }
    }

    // Check if cover field exists
    if (req.files && req.files.cover) {
      // Handle file upload for cover field
      const coverFile = req.files.cover[0];

      // Validate cover file type (update with accepted cover types)
      const acceptedCoverTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!acceptedCoverTypes.includes(coverFile.mimetype)) {
        return res.status(400).json({
          error: "Cover image must be in PNG, JPEG, or JPG format",
        });
      }

      // Handle cloudinary upload for cover file (similar to your original code)
      try {
        const uploadedCover = await cloudinary.uploader.upload(coverFile.path, {
          folder: folderName1,
        });

        coverData = {
          fileName: coverFile.originalname,
          filePath: uploadedCover.secure_url,
          fileType: coverFile.mimetype,
          publicId: uploadedCover.public_id,
        };
      } catch (error) {
        console.error("Error uploading cover image:", error);
        return res.status(500).json({ error: "Cover image could not be uploaded" });
      }
    }
    // Generate a unique slug for the chapter
    const originalSlug = slugify(title, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
      strict: true,
    });

    let slug = originalSlug;
    let suffix = 1;

    while (await ChapterModel.findOne({ slug, book: courseId })) {
      slug = `${suffix}-${originalSlug}`;
      suffix++;
    }

    const newChapter = new ChapterModel({
      user: userId,
      book: courseId,
      title,
      slug,
      description,
      media: mediaData,
      cover: coverData,
    });

    // Validate and add new tags
    if (tagsToAdd && Array.isArray(tagsToAdd)) {
      const uniqueTags = new Set(tagsToAdd);
      for (const newTag of uniqueTags) {
        if (newTag.length > 250) {
          return res.status(400).json({
            error: "Tag length should not exceed 250 characters.",
          });
        }
        newChapter.tags.push({ tag: newTag });
      }
    }

    await newChapter.save();
    await CoursesModel.findByIdAndUpdate(courseId, {
      $inc: { totalpage: 1 },
    });

    res.status(201).json({ message: "Chapter created successfully", chapter: newChapter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// sabai book get garxa with chapter
const getAllChapterByCourses = asyncHandler(async (req, res) => {
  try {
    const chapters = await ChapterModel.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "book",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      {
        $unwind: "$courseInfo",
      },
      {
        $group: {
          _id: "$courseInfo.title",
          courseDetails: { $first: "$courseInfo" },
          chapters: {
            $push: {
              _id: "$_id",
              title: "$title",
              description: "$description",
              slug: "$slug",
              tags: "$tags",
              likes: "$likes",
              numOfViews: "$numOfViews",
              cover: "$cover",
              media: "$media",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
              __v: "$__v",
            },
          },
        },
      },
    ]);

    // Organize the result into an object with course names as keys
    const chaptersByCourses = {};
    chapters.forEach((courseChapter) => {
      chaptersByCourses[courseChapter._id] = {
        courseDetails: courseChapter.courseDetails,
        chapters: courseChapter.chapters,
      };
    });

    res.status(200).json(chaptersByCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// single book get garxa with chapter
// show all chapters of book used in table
const getCoursesWithAllChapters = asyncHandler(async (req, res) => {
  try {
    const courseSlug = req.params.slug;

    // Find the course by its slug
    const course = await CoursesModel.findOne({ slug: courseSlug });

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Now that we have the course, find its chapters
    const chapters = await ChapterModel.find({ book: course._id });

    // Create the response object with course details and chapters
    const response = {
      [course.title]: {
        courseDetails: course,
        chapters: chapters,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getBookWithCoursesAndChapters = asyncHandler(async (req, res) => {
  try {
    const courseSlug = req.params.slug;
    const currentPage = parseInt(req.query.page) || 1; // Get the current page from query parameter
    const perPage = 1; // Number of chapters to display per page

    // Find the course by its slug
    const course = await CoursesModel.findOne({ slug: courseSlug });

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Now that we have the course, find its chapters with pagination
    const totalChapters = await ChapterModel.countDocuments({ book: course._id });
    const totalPages = Math.ceil(totalChapters / perPage);

    if (currentPage < 1 || currentPage > totalPages) {
      return res.status(400).json({ message: "Invalid page number." });
    }

    const chapters = await ChapterModel.find({ book: course._id })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    // Update the totalViews for the course when a user visits
    course.totalViews += 1;
    await course.save();

    // Update the numOfViews for each chapter in the current page
    for (const chapter of chapters) {
      chapter.numOfViews += 1;
      await chapter.save();
    }

    // Create the response object with course details, chapters, and pagination info
    const response = {
      [course.title]: {
        courseDetails: course,
        chapters: chapters,
        pagination: {
          currentPage: currentPage,
          totalPages: totalPages,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// single book ko course ko single chapter get garxa
const getChapterBySlug = asyncHandler(async (req, res) => {
  try {
    const chapterSlug = req.params.slug;
    // Find the chapter by its slug
    const chapter = await ChapterModel.findOne({ slug: chapterSlug });
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found." });
    }

    // Increment the view count by 1
    chapter.numOfViews += 1;
    await chapter.save(); // Save the updated view count

    // Find the corresponding course and update its totalViews field
    const course = await CoursesModel.findById(chapter.book);
    if (course) {
      course.totalViews += 1;
      await course.save(); // Save the updated totalViews count for the course
    }

    res.status(200).json(chapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getChapterById = asyncHandler(async (req, res) => {
  try {
    const chapterId = req.params.id;
    // Find the chapter by its slug
    const chapter = await ChapterModel.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found." });
    }

    // Increment the view count by 1
    chapter.numOfViews += 1;
    await chapter.save(); // Save the updated view count

    // Find the corresponding course and update its totalViews field
    const course = await CoursesModel.findById(chapter.book);
    if (course) {
      course.totalViews += 1;
      await course.save(); // Save the updated totalViews count for the course
    }

    res.status(200).json(chapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Single Chapter
const deleteChapter = asyncHandler(async (req, res) => {
  try {
    const chapterId = req.params.id;
    const userId = req.user.id;

    // Find the chapter by its ID
    const chapter = await ChapterModel.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found." });
    }

    // Check if the user is an admin or the creator of the chapter
    if (chapter.user.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete this chapter." });
    }

    // Delete the chapter from Cloudinary if it has media and cover
    if (chapter.media && chapter.media.publicId) {
      await cloudinary.uploader.destroy(chapter.media.publicId);
    }
    if (chapter.cover && chapter.cover.publicId) {
      await cloudinary.uploader.destroy(chapter.cover.publicId);
    }

    // Delete the chapter from the database
    await ChapterModel.findByIdAndDelete(chapterId);

    // Update the course data (decrement totalpage, likes, and totalViews)
    await CoursesModel.findByIdAndUpdate(chapter.book, {
      $inc: {
        totalpage: -1,
        totalLikes: -chapter.likes.length,
        totalViews: -chapter.numOfViews,
      },
    });

    res.status(200).json({ message: "Chapter deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const updateChapter = asyncHandler(async (req, res) => {
  try {
    const chapterId = req.params.id;
    const userId = req.user.id;

    // Find the chapter by its ID
    const chapter = await ChapterModel.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found." });
    }

    // Find the course associated with the chapter
    const course = await CoursesModel.findById(chapter.book);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Check if the user is an admin or the creator of the chapter
    if (chapter.user.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to update this chapter." });
    }

    const folderName = `Sunil Portfolio/Book/${userId.trim()}/Chapter/Media`;
    const folderName1 = `Sunil Portfolio/Book/${userId.trim()}/Chapter/Cover`;

    if (req.files) {
      // Handle cover media file update
      if (req.files.media && req.files.media.length > 0) {
        const mediaFile = req.files.media[0];
        const acceptedMediaTypes = ["video/mp4"];
        if (!acceptedMediaTypes.includes(mediaFile.mimetype)) {
          return res.status(400).json({
            error: "Media must be in video format",
          });
        }

        // Delete the existing media file from Cloudinary
        if (chapter.media && chapter.media.publicId) {
          try {
            await cloudinary.uploader.destroy(chapter.media.publicId, { resource_type: "video" });
          } catch (error) {
            console.error("Error deleting previous media file:", error);
            return res.status(500).json({ error: "Previous media file could not be deleted" });
          }
        }
        // Upload the new media file to Cloudinary
        try {
          const uploadedMedia = await cloudinary.uploader.upload(mediaFile.path, {
            folder: folderName,
            resource_type: "auto",
          });
          const mediaPublicId = uploadedMedia.public_id;

          chapter.media = {
            fileName: mediaFile.originalname,
            filePath: uploadedMedia.secure_url,
            fileType: mediaFile.mimetype,
            publicId: mediaPublicId,
          };
        } catch (error) {
          console.error("Error uploading media file:", error);
          return res.status(500).json({ error: "Media file could not be uploaded" });
        }
      }
      // Handle cover image file update
      if (req.files.cover && req.files.cover.length > 0) {
        const coverFile = req.files.cover[0];
        // Delete the existing cover image from Cloudinary
        if (chapter.cover && chapter.cover.publicId) {
          try {
            console.log("Deleting existing cover image with public ID:", chapter.cover.publicId);
            await cloudinary.uploader.destroy(chapter.cover.publicId);
          } catch (error) {
            console.error("Error deleting previous cover image:", error);
            return res.status(500).json({ error: "Previous cover image could not be deleted" });
          }
        }

        // Upload the new cover image to Cloudinary
        try {
          const uploadedCover = await cloudinary.uploader.upload(coverFile.path, {
            folder: folderName1,
            resource_type: "auto",
          });

          chapter.cover = {
            fileName: coverFile.originalname,
            filePath: uploadedCover.secure_url,
            fileType: coverFile.mimetype,
            publicId: uploadedCover.public_id,
          };
        } catch (error) {
          console.error("Error uploading cover image:", error);
          return res.status(500).json({ error: "Cover image could not be uploaded" });
        }
      }
    }

    // Update chapter data based on user input
    if (req.body.title) {
      chapter.title = req.body.title;
      // Generate a new slug based on the updated title
      const newSlug = slugify(req.body.title, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
        strict: true,
      });
      chapter.slug = newSlug;
    }
    if (req.body.description) {
      chapter.description = req.body.description;
    }
    // Save the updated chapter
    await chapter.save();

    res.status(200).json({ message: "Chapter updated successfully", chapter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ----------------------------- Chapters --------------------------------- */
module.exports = {
  createCourses,
  getAlNoteofUser,
  getAlNote,
  deleteCourse,
  getNote,
  updateNoteCtr,
  createChapter,
  getAllChapterByCourses,
  getBookWithCoursesAndChapters,
  getCoursesWithAllChapters,
  getChapterBySlug,
  getChapterById,
  deleteChapter,
  updateChapter,
};
