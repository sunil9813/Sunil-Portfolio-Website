require("dotenv").config();

const mongoose = require("mongoose");
const slugify = require("slugify");

const User = require("../models/users/UserModel");
const Subject = require("../models/educationModel/SubjectModel");
const Chapter = require("../models/educationModel/ChapterModel");

const COURSE_SLUG = "modern-react-from-zero-to-deploy";

const hasResources = (subject) => {
  const hasNewResources = Array.isArray(subject.resourceFiles) && subject.resourceFiles.some((resource) => resource?.filePath || resource?.url);
  const hasLegacyFile = Boolean(subject.resourceFile?.file?.filePath);
  const hasLegacyUrl = Boolean(subject.resourceFile?.url);

  return hasNewResources || hasLegacyFile || hasLegacyUrl;
};

const getSeedUser = async () => {
  const user = await User.findOne({
    role: { $in: ["super admin", "admin", "author", "guest"] },
  }).sort({ createdAt: 1 });

  if (!user) {
    throw new Error("No user found. Please create one user first, then run this seed again.");
  }

  return user;
};

const seedCourse = async () => {
  if (!process.env.DATABASE_CLOUD) {
    throw new Error("Missing DATABASE_CLOUD in backend/.env");
  }

  await mongoose.connect(process.env.DATABASE_CLOUD);

  const user = await getSeedUser();

  const course = await Subject.findOneAndUpdate(
    { slug: COURSE_SLUG },
    {
      $set: {
        user: user._id,
        name: "Modern React: From Zero to Deploy",
        slug: COURSE_SLUG,
        description:
          "<p>Build a complete React application from fundamentals to production deployment. This course has lessons only and no resource files, so it appears on the Course page.</p>",
        metaDescription: "Build a complete React app from fundamentals to production deployment with practical lessons.",
        visibility: "public",
        accessType: "unpaid",
        featured: true,
        tags: [{ tag: "React" }, { tag: "Frontend" }, { tag: "JavaScript" }],
        highlights: [{ highlight: "React fundamentals" }, { highlight: "Reusable components" }, { highlight: "Production deployment" }],
        price: 0,
        discount: 0,
        discountDate: null,
        discountShow: false,
        resourceFiles: [],
        resourceFile: {},
        thumbnail: {
          fileName: "react-course.png",
          filePath: "https://cdn.iconscout.com/icon/free/png-256/free-react-3-1175109.png",
          fileType: "image/png",
          publicId: "demo/react-course",
        },
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  const lessons = [
    {
      title: "React foundations",
      metaDescription: "Learn components, props, JSX, and the structure of a clean React app.",
    },
    {
      title: "State and events",
      metaDescription: "Understand state, event handlers, forms, and practical UI interactions.",
    },
    {
      title: "Deploy your frontend",
      metaDescription: "Prepare the project for production and deploy it confidently.",
    },
  ];

  for (const lesson of lessons) {
    const slug = slugify(`${COURSE_SLUG}-${lesson.title}`, {
      lower: true,
      strict: true,
    });

    await Chapter.findOneAndUpdate(
      { slug },
      {
        $set: {
          user: user._id,
          subject: course._id,
          title: lesson.title,
          metaTitle: lesson.title,
          slug,
          description: `<p>${lesson.metaDescription}</p>`,
          metaDescription: lesson.metaDescription,
          tags: [{ tag: "React" }],
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  const subjects = await Subject.find({}, "name slug resourceFiles resourceFile").lean();
  const courseCount = subjects.filter((subject) => !hasResources(subject)).length;
  const noteCount = subjects.filter(hasResources).length;
  const chapterCount = await Chapter.countDocuments({ subject: course._id });

  console.log(
    JSON.stringify(
      {
        course: course.name,
        slug: course.slug,
        hasResources: hasResources(course),
        chapters: chapterCount,
        coursePageSubjects: courseCount,
        notePageSubjects: noteCount,
      },
      null,
      2,
    ),
  );
};

seedCourse()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
