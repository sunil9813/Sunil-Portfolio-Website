require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const crypto = require("crypto");
const mongoose = require("mongoose");
const slugify = require("slugify");

const User = require("../models/users/UserModel");
const University = require("../models/educationModel/UniversityModel");
const Faculty = require("../models/educationModel/FacultyModel");
const Program = require("../models/educationModel/ProgramModel");
const Subject = require("../models/educationModel/SubjectModel");
const Chapter = require("../models/educationModel/ChapterModel");

const COURSE_NAME = "Software Project Management";
const COURSE_SLUG = "software-project-management";
const DEFAULT_PDF_PATH = "C:\\Users\\sunil\\Downloads\\Software Project Management.pdf";

const courseToc = [
  {
    title: "Software project management concepts",
    page: 3,
    subheadings: [
      { title: "Introduction to software project management", page: 4 },
      { title: "An overview of project planning", page: 5 },
      { title: "Board Exam Questions", page: 7 },
    ],
  },
  {
    title: "Software evaluation and costing",
    page: 20,
    subheadings: [
      { title: "Cost Benefit Evaluation techniques", page: 22 },
      { title: "Risk Evaluation", page: 29 },
      { title: "Cost-Benefit Analysis", page: 30 },
      { title: "Risk profile analysis", page: 32 },
      { title: "Decision Trees", page: 33 },
      {
        title: "Selection of Appropriate Project Approach",
        page: 35,
        children: [
          { title: "Waterfall Process Model", page: 38 },
          { title: "V Process Model", page: 40 },
          { title: "Spiral Process Model", page: 43 },
          { title: "Software Prototyping Process Model", page: 46 },
          { title: "Incremental Delivery Process Model", page: 48 },
          { title: "Agile Method", page: 49 },
          { title: "Extreme Programming(XP)", page: 51 },
        ],
      },
      { title: "Board Exam Question", page: 56 },
    ],
  },
  {
    title: "Software estimation techniques",
    page: 65,
    subheadings: [
      { title: "Problems with over and under estimates", page: 66 },
      { title: "Basis of software estimation", page: 67 },
      {
        title: "Software Effort estimation Techniques",
        page: 68,
        children: [
          { title: "Expert judgment", page: 70 },
          { title: "Estimating by analogy", page: 71 },
        ],
      },
      {
        title: "Activity Planning",
        page: 72,
        children: [
          { title: "Project schedules", page: 73 },
          { title: "Project and activities", page: 74 },
          { title: "Sequencing and scheduling activities", page: 75 },
          { title: "Networks planning models", page: 76 },
          { title: "Formulating a network model", page: 78 },
        ],
      },
      {
        title: "Board Exam Questions",
        page: 79,
        children: [{ title: "Dummy activity", page: 83 }],
      },
    ],
  },
  {
    title: "Risk management",
    page: 89,
    subheadings: [
      { title: "Nature of risk management", page: 90 },
      { title: "Risk identification and analysis", page: 91 },
      { title: "Reducing the risk", page: 92 },
      { title: "Resource allocation", page: 92 },
      { title: "Scheduling resources", page: 93 },
      { title: "Critical paths", page: 94 },
      { title: "Cost scheduling", page: 99 },
      { title: "Monitoring and control", page: 100 },
      { title: "Creating framework", page: 101 },
      { title: "Cost monitoring", page: 102 },
      { title: "prioritizing monitoring", page: 103 },
      { title: "Board Exam Questions", page: 104 },
    ],
  },
  {
    title: "Software quality management",
    page: 113,
    subheadings: [
      { title: "TQM", page: 114 },
      { title: "Six sigma", page: 115 },
      { title: "Software quality: defining software quality", page: 119 },
      { title: "Iso9126", page: 120 },
      { title: "External standards", page: 121 },
      {
        title: "Comparison of project management software’s",
        page: 122,
        children: [
          { title: "Dot project", page: 123 },
          { title: "Launch pad", page: 123 },
          { title: "Openproj", page: 124 },
        ],
      },
      { title: "Case study", page: 125 },
      { title: "Prince2", page: 126 },
      { title: "Board Exam Question", page: 127 },
      { title: "Remaining Question", page: 133 },
    ],
  },
];

const toSlug = (value) =>
  slugify(value, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeWhitespace = (value = "") =>
  String(value)
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .trim();

const compactText = (value = "") =>
  normalizeWhitespace(value)
    .replace(/\[\[PDF_PAGE:\d+\]\]/g, " ")
    .replace(/^\d+\s*$/gm, "")
    .replace(/[ \t]*\n[ \t]*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncate = (value = "", maxLength = 160) => {
  const clean = compactText(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}…`;
};

const createHeadingRegex = (title) => {
  const escaped = escapeRegExp(title)
    .replace(/\s+/g, "\\s+")
    .replace(/'/g, "['’]")
    .replace(/’/g, "['’]");

  return new RegExp(escaped, "i");
};

const extractPdfText = (pdfPath) => {
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF file not found: ${pdfPath}`);
  }

  const pythonExecutable = process.env.PYTHON_EXECUTABLE || process.env.PYTHON || "python";
  const pythonCode = `
import json
import sys
from pypdf import PdfReader

pdf_path = sys.argv[1]
reader = PdfReader(pdf_path)
pages = []
for page in reader.pages:
    pages.append(page.extract_text() or "")

print(json.dumps({"pageCount": len(reader.pages), "pages": pages}, ensure_ascii=False))
`;

  const result = spawnSync(pythonExecutable, ["-c", pythonCode, pdfPath], {
    encoding: "utf8",
    maxBuffer: 80 * 1024 * 1024,
    env: {
      ...process.env,
      PYTHONIOENCODING: "utf-8",
    },
  });

  if (result.error || result.status !== 0) {
    throw new Error(
      `Could not extract PDF text. Set PYTHON_EXECUTABLE to a Python that has pypdf installed. ${result.error?.message || result.stderr || ""}`.trim(),
    );
  }

  return JSON.parse(result.stdout);
};

const flattenToc = (chapters) => {
  const entries = [];

  chapters.forEach((chapter, chapterIndex) => {
    entries.push({ ...chapter, type: "chapter", chapterIndex });

    chapter.subheadings.forEach((subheading, subheadingIndex) => {
      entries.push({ ...subheading, type: "subheading", chapterIndex, subheadingIndex });

      (subheading.children || []).forEach((child, childIndex) => {
        entries.push({ ...child, type: "child", chapterIndex, subheadingIndex, childIndex });
      });
    });
  });

  return entries;
};

const findHeadingMatch = (fullText, title, startAt) => {
  const safeStart = Math.max(0, startAt);
  const directIndex = fullText.toLowerCase().indexOf(title.toLowerCase(), safeStart);
  const directMatch =
    directIndex >= 0
      ? {
          start: directIndex,
          length: title.length,
        }
      : null;

  const slice = fullText.slice(safeStart);
  const regexMatch = createHeadingRegex(title).exec(slice);
  const flexibleMatch = regexMatch
    ? {
        start: safeStart + regexMatch.index,
        length: regexMatch[0].length,
      }
    : null;

  if (directMatch && flexibleMatch) {
    return directMatch.start <= flexibleMatch.start ? directMatch : flexibleMatch;
  }

  return directMatch || flexibleMatch;
};

const buildPdfSections = ({ pages, pageCount }) => {
  const pageOffsets = {};
  let fullText = "";

  pages.forEach((pageText, index) => {
    const pdfPageNumber = index + 1;
    pageOffsets[pdfPageNumber] = fullText.length;
    fullText += `\n\n[[PDF_PAGE:${pdfPageNumber}]]\n${pageText || ""}`;
  });

  const entries = flattenToc(courseToc);
  let lastPosition = pageOffsets[3] || 0;

  const positionedEntries = entries.map((entry) => {
    const preferredStart = Math.max(pageOffsets[entry.page] || 0, lastPosition);
    const headingMatch = findHeadingMatch(fullText, entry.title, Math.max(0, preferredStart - 100));
    const start = headingMatch?.start ?? preferredStart;
    const contentStart = headingMatch ? headingMatch.start + headingMatch.length : start;

    lastPosition = Math.max(start + 1, lastPosition + 1);

    return {
      ...entry,
      start,
      contentStart,
    };
  });

  positionedEntries.forEach((entry, index) => {
    const nextEntry = positionedEntries[index + 1];
    entry.end = nextEntry?.start || fullText.length;
    entry.rawContent = fullText.slice(entry.contentStart, entry.end);
  });

  return {
    pageCount,
    entries: positionedEntries,
  };
};

const textToHtml = (title, rawContent, headingTag = "h2") => {
  const cleanedLines = normalizeWhitespace(rawContent)
    .replace(/\[\[PDF_PAGE:\d+\]\]/g, "\n")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !/^\d+$/.test(line));

  const html = [`<${headingTag}>${escapeHtml(title)}</${headingTag}>`];
  let paragraph = "";
  let listItems = [];

  const flushParagraph = () => {
    const clean = compactText(paragraph);
    if (clean) {
      html.push(`<p>${escapeHtml(clean)}</p>`);
    }
    paragraph = "";
  };

  const flushList = () => {
    if (listItems.length > 0) {
      html.push(`<ul>${listItems.map((item) => `<li>${escapeHtml(compactText(item))}</li>`).join("")}</ul>`);
    }
    listItems = [];
  };

  cleanedLines.forEach((line) => {
    const bulletMatch = line.match(/^(?:[•\-]|o\s+|)\s*(.+)$/);

    if (bulletMatch) {
      flushParagraph();
      listItems.push(bulletMatch[1]);
      return;
    }

    flushList();
    paragraph = paragraph ? `${paragraph} ${line}` : line;

    if (/[.?!:]$/.test(line) || line.length < 45) {
      flushParagraph();
    }
  });

  flushParagraph();
  flushList();

  return html.join("\n");
};

const buildChapterDescription = (chapter, chapterEntry) => {
  const subheadingList = chapter.subheadings.map((subheading) => `<li>${escapeHtml(subheading.title)}</li>`).join("");

  return [
    textToHtml(`Chapter ${chapter.order}: ${chapter.title}`, chapterEntry.rawContent, "h2"),
    "<h3>Chapter Topics</h3>",
    `<ul>${subheadingList}</ul>`,
  ].join("\n");
};

const buildCourseDescription = (chapters) => `
  <h2>${COURSE_NAME}</h2>
  <p>This course was created from the uploaded Software Project Management PDF and follows the PDF chapter and subheading structure.</p>
  <h2>Course Contents</h2>
  <ul>
    ${chapters.map((chapter) => `<li>Chapter ${chapter.order}: ${escapeHtml(chapter.title)}</li>`).join("")}
  </ul>
  <h2>Learning Goal</h2>
  <p>Study software project planning, costing, estimation, activity scheduling, risk management, monitoring, control, and software quality management using the complete PDF content.</p>
`;

const getSeedUser = async () => {
  const user = await User.findOne({ role: { $in: ["admin", "super admin", "author"] } }).sort({ createdAt: 1 });

  if (!user) {
    throw new Error("No admin, super admin, or author user found. Please create one user first.");
  }

  return user;
};

const getAcademicStructure = async () => {
  const university = await University.findOne({ slug: "purbanchal-university" }).sort({ createdAt: 1 });
  const faculty = university
    ? await Faculty.findOne({ university: university._id, slug: "science-and-technology" }).sort({ createdAt: 1 })
    : await Faculty.findOne({ slug: "science-and-technology" }).sort({ createdAt: 1 });
  const program = faculty
    ? await Program.findOne({ faculty: faculty._id, slug: "bachelor-of-information-technology" }).sort({ createdAt: 1 })
    : await Program.findOne({ slug: "bachelor-of-information-technology" }).sort({ createdAt: 1 });

  return { university, faculty, program };
};

const makeTags = (...tags) => tags.filter(Boolean).map((tag) => ({ tag }));

const buildCourseFromPdf = (pdfSections) => {
  const chapters = courseToc.map((chapter, chapterIndex) => {
    const chapterEntry = pdfSections.entries.find((entry) => entry.type === "chapter" && entry.chapterIndex === chapterIndex);

    const subheadings = chapter.subheadings.map((subheading, subheadingIndex) => {
      const subheadingEntry = pdfSections.entries.find((entry) => entry.type === "subheading" && entry.chapterIndex === chapterIndex && entry.subheadingIndex === subheadingIndex);

      const children = (subheading.children || []).map((child, childIndex) => {
        const childEntry = pdfSections.entries.find(
          (entry) => entry.type === "child" && entry.chapterIndex === chapterIndex && entry.subheadingIndex === subheadingIndex && entry.childIndex === childIndex,
        );

        return {
          title: child.title,
          metaTitle: child.title,
          metaDescription: truncate(childEntry?.rawContent || child.title),
          description: textToHtml(child.title, childEntry?.rawContent || "", "h3"),
          slug: toSlug(child.title),
          order: childIndex + 1,
          tags: makeTags(COURSE_NAME, chapter.title, subheading.title, child.title),
          thumbnail: {},
          video: {},
        };
      });

      return {
        title: subheading.title,
        metaTitle: subheading.title,
        metaDescription: truncate(subheadingEntry?.rawContent || subheading.title),
        description: textToHtml(subheading.title, subheadingEntry?.rawContent || "", "h3"),
        slug: toSlug(subheading.title),
        order: subheadingIndex + 1,
        tags: makeTags(COURSE_NAME, chapter.title, subheading.title),
        thumbnail: {},
        video: {},
        children,
      };
    });

    return {
      title: chapter.title.replace(/\b\w/g, (letter) => letter.toUpperCase()),
      originalTitle: chapter.title,
      order: chapterIndex + 1,
      metaDescription: truncate(chapterEntry?.rawContent || chapter.title),
      description: buildChapterDescription({ ...chapter, order: chapterIndex + 1 }, chapterEntry || { rawContent: "" }),
      tags: makeTags(COURSE_NAME, chapter.title),
      subheadings,
    };
  });

  return {
    chapters,
    courseDescription: buildCourseDescription(chapters),
  };
};

const deletePreviousCourse = async () => {
  const existingSubjects = await Subject.find({
    $or: [{ slug: COURSE_SLUG }, { name: new RegExp(`^${COURSE_NAME}$`, "i") }],
  }).select("_id");

  const subjectIds = existingSubjects.map((subject) => subject._id);
  const chapterDeleteQuery = subjectIds.length
    ? {
        $or: [{ subject: { $in: subjectIds } }, { slug: new RegExp(`^${COURSE_SLUG}-`, "i") }],
      }
    : { slug: new RegExp(`^${COURSE_SLUG}-`, "i") };

  const deletedChapters = await Chapter.deleteMany(chapterDeleteQuery);
  const deletedSubjects = subjectIds.length ? await Subject.deleteMany({ _id: { $in: subjectIds } }) : { deletedCount: 0 };

  return {
    subjects: deletedSubjects.deletedCount || 0,
    chapters: deletedChapters.deletedCount || 0,
  };
};

const seedCourse = async () => {
  const databaseUrl = process.env.DATABASE_CLOUD || process.env.DATABASE_LOCAL || process.env.MONGO_URI;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_CLOUD, DATABASE_LOCAL, or MONGO_URI in backend/.env.");
  }

  const pdfPath = process.env.SPM_PDF_PATH || DEFAULT_PDF_PATH;
  const pdfText = extractPdfText(pdfPath);
  const pdfSections = buildPdfSections(pdfText);

  if (process.env.SPM_DEBUG_SECTIONS === "true") {
    console.log(
      JSON.stringify(
        pdfSections.entries.map((entry) => ({
          type: entry.type,
          title: entry.title,
          page: entry.page,
          start: entry.start,
          contentStart: entry.contentStart,
          end: entry.end,
          rawLength: entry.rawContent.length,
          preview: compactText(entry.rawContent).slice(0, 120),
        })),
        null,
        2,
      ),
    );
    return;
  }

  const courseData = buildCourseFromPdf(pdfSections);

  await mongoose.connect(databaseUrl);

  const user = await getSeedUser();
  const { university, faculty, program } = await getAcademicStructure();
  const deleted = await deletePreviousCourse();

  const course = await Subject.create({
    user: user._id,
    university: university?._id,
    faculty: faculty?._id,
    program: program?._id,
    name: COURSE_NAME,
    slug: COURSE_SLUG,
    groupId: crypto.randomUUID(),
    description: courseData.courseDescription.trim(),
    metaDescription: "Complete Software Project Management course created from the uploaded PDF.",
    totalpage: pdfText.pageCount,
    visibility: "public",
    accessType: "unpaid",
    featured: true,
    tags: makeTags("Software Project Management", "SPM", "BIT", "Project Planning", "Risk Management", "Quality Management"),
    highlights: [
      { highlight: "Complete chapter-wise content from the Software Project Management PDF" },
      { highlight: "Dynamic subheadings and nested subheadings for course navigation" },
      { highlight: "Covers evaluation, costing, estimation, risk, monitoring, and quality management" },
    ],
    price: 0,
    discount: 0,
    discountDate: null,
    discountShow: false,
    thumbnail: {},
    resourceFiles: [],
    resourceFile: {},
  });

  for (const chapter of courseData.chapters) {
    await Chapter.create({
      user: user._id,
      subject: course._id,
      title: chapter.title,
      metaTitle: chapter.title,
      slug: `${COURSE_SLUG}-${toSlug(chapter.title)}`,
      order: chapter.order,
      description: chapter.description,
      metaDescription: chapter.metaDescription || "Software Project Management chapter.",
      tags: chapter.tags,
      subheadings: chapter.subheadings,
      thumbnail: {},
      video: {},
    });
  }

  const chapters = await Chapter.find({ subject: course._id }).sort({ order: 1 }).lean();
  const subheadingCount = chapters.reduce((total, chapter) => total + (chapter.subheadings?.length || 0), 0);
  const nestedSubheadingCount = chapters.reduce(
    (total, chapter) => total + (chapter.subheadings || []).reduce((innerTotal, subheading) => innerTotal + (subheading.children?.length || 0), 0),
    0,
  );

  console.log(
    JSON.stringify(
      {
        message: "Software Project Management course recreated from PDF successfully.",
        pdfPath,
        deleted,
        course: {
          id: course._id,
          name: course.name,
          slug: course.slug,
          visibility: course.visibility,
          accessType: course.accessType,
          resourceFiles: course.resourceFiles.length,
        },
        inserted: {
          chapters: chapters.length,
          subheadings: subheadingCount,
          nestedSubheadings: nestedSubheadingCount,
          pdfPages: pdfText.pageCount,
        },
      },
      null,
      2,
    ),
  );
};

seedCourse()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
