const asyncHandler = require("express-async-handler");
const BlogModel = require("../models/BlogModel");
const ProjectModel = require("../models/project/ProjectModel");
const SubjectModel = require("../models/educationModel/SubjectModel");

const getFrontendBaseUrl = (req) => {
  const configuredUrl = process.env.FRONTEND_PUBLIC_URL || process.env.FRONTEND_URL || process.env.CLIENT_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const host = req.get("host") || "localhost:5173";
  const hostname = host.split(":")[0] || "localhost";
  return process.env.NODE_ENV === "production" ? `${req.protocol}://${host}` : `http://${hostname}:5173`;
};

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const normalizeDate = (date) => (date ? new Date(date).toISOString() : new Date().toISOString());

const buildUrlNode = ({ loc, lastmod, priority = "0.7", changefreq = "weekly" }) => `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${normalizeDate(lastmod)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const getRobotsTxt = asyncHandler(async (req, res) => {
  const baseUrl = getFrontendBaseUrl(req);

  res.type("text/plain").send(`User-agent: *
Allow: /
Disallow: /account
Disallow: /cart
Disallow: /payment
Disallow: /login
Disallow: /signup

Sitemap: ${baseUrl}/sitemap.xml
`);
});

const getSitemapXml = asyncHandler(async (req, res) => {
  const baseUrl = getFrontendBaseUrl(req);

  const [blogs, projects, subjects] = await Promise.all([
    BlogModel.find({ visibility: "public" }).select("slug updatedAt createdAt").lean(),
    ProjectModel.find({ visibility: "public" }).select("slug updatedAt createdAt").lean(),
    SubjectModel.find({ visibility: "public" }).select("slug resourceFiles resourceFile updatedAt createdAt").lean(),
  ]);

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${baseUrl}/about`, priority: "0.7" },
    { loc: `${baseUrl}/courses`, priority: "0.9", changefreq: "daily" },
    { loc: `${baseUrl}/notes`, priority: "0.9", changefreq: "daily" },
    { loc: `${baseUrl}/blogs`, priority: "0.9", changefreq: "daily" },
    { loc: `${baseUrl}/project`, priority: "0.9", changefreq: "daily" },
    { loc: `${baseUrl}/customer-feedback`, priority: "0.6" },
    { loc: `${baseUrl}/contact`, priority: "0.6" },
    { loc: `${baseUrl}/privacy-policy`, priority: "0.4", changefreq: "monthly" },
    { loc: `${baseUrl}/term-condition`, priority: "0.4", changefreq: "monthly" },
  ];

  const subjectUrls = subjects.map((subject) => {
    const hasResource = (Array.isArray(subject.resourceFiles) && subject.resourceFiles.length > 0) || Boolean(subject.resourceFile?.filePath || subject.resourceFile?.url);
    return {
      loc: `${baseUrl}/${hasResource ? "note" : "course"}/${subject.slug}`,
      lastmod: subject.updatedAt || subject.createdAt,
      priority: hasResource ? "0.78" : "0.82",
    };
  });

  const dynamicUrls = [
    ...blogs.map((blog) => ({
      loc: `${baseUrl}/view-blog/${blog.slug}`,
      lastmod: blog.updatedAt || blog.createdAt,
      priority: "0.82",
    })),
    ...projects.map((project) => ({
      loc: `${baseUrl}/project-details/${project.slug}`,
      lastmod: project.updatedAt || project.createdAt,
      priority: "0.78",
    })),
    ...subjectUrls,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...dynamicUrls].map(buildUrlNode).join("")}
</urlset>`;

  res.type("application/xml").send(xml);
});

module.exports = {
  getRobotsTxt,
  getSitemapXml,
};
