const asyncHandler = require("express-async-handler");

const UserModel = require("../../models/users/UserModel");
const BlogModel = require("../../models/BlogModel");
const ProjectModel = require("../../models/project/ProjectModel");
const CategoryModel = require("../../models/common/CategoryModel");
const ContactModel = require("../../models/ContactModel");
const UniversityModel = require("../../models/educationModel/UniversityModel");
const FacultyModel = require("../../models/educationModel/FacultyModel");
const ProgramModel = require("../../models/educationModel/ProgramModel");
const SubjectModel = require("../../models/educationModel/SubjectModel");
const ChapterModel = require("../../models/educationModel/ChapterModel");
const OrderModel = require("../../models/order/OrderModel");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getPercent = (current, previous) => {
  if (!previous && !current) return 0;
  if (!previous) return 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const sumField = async (Model, field) => {
  const result = await Model.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: { $ifNull: [`$${field}`, 0] } },
      },
    },
  ]);

  return result?.[0]?.total || 0;
};

const monthlyCounts = async (Model) => {
  const year = new Date().getFullYear();
  const startDate = new Date(year, 0, 1);

  const result = await Model.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        value: { $sum: 1 },
      },
    },
  ]);

  const map = result.reduce((acc, item) => {
    acc[item._id] = item.value;
    return acc;
  }, {});

  return months.map((name, index) => ({
    name,
    value: map[index + 1] || 0,
  }));
};

const buildTrafficData = ({ blogMonthly, projectMonthly, userMonthly, contactMonthly, totalVisits }) => {
  return months.map((month, index) => {
    const blogs = blogMonthly[index]?.value || 0;
    const projects = projectMonthly[index]?.value || 0;
    const users = userMonthly[index]?.value || 0;
    const contacts = contactMonthly[index]?.value || 0;
    const baseVisits = Math.max(100, Math.round(totalVisits / 12) + blogs * 80 + projects * 120);

    return {
      month,
      channels: {
        "Organic Search": { visits: baseVisits, conversion: 4.1, revenue: projects * 250, bounceRate: 35, engagement: 4.2 },
        Direct: { visits: Math.round(baseVisits * 0.72), conversion: 5.7, revenue: projects * 180, bounceRate: 42.5, engagement: 3.8 },
        "Social Media": { visits: Math.round(baseVisits * 0.62), conversion: 2.9, revenue: blogs * 160, bounceRate: 28.8, engagement: 4.8 },
        Email: { visits: Math.round(baseVisits * 0.42), conversion: 7.2, revenue: contacts * 220, bounceRate: 22.8, engagement: 5.2 },
        Referral: { visits: Math.round(baseVisits * 0.32), conversion: 4.6, revenue: users * 120, bounceRate: 39.2, engagement: 3.5 },
        "Paid Ads": { visits: Math.round(baseVisits * 0.26), conversion: 2.1, revenue: projects * 90, bounceRate: 52.1, engagement: 2.3 },
      },
    };
  });
};

const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const last30Days = new Date(now);
  last30Days.setDate(last30Days.getDate() - 30);

  const previous30Days = new Date(now);
  previous30Days.setDate(previous30Days.getDate() - 60);

  const [
    users,
    activeUsers,
    universities,
    publicUniversities,
    privateUniversities,
    faculties,
    programs,
    subjects,
    paidSubjects,
    chapters,
    projects,
    featuredProjects,
    blogs,
    publicBlogs,
    featuredBlogs,
    categories,
    contacts,
    pendingContacts,
    repliedContacts,
    paidOrders,
    totalBlogViews,
    totalProjectViews,
    totalSubjectViews,
    totalChapterViews,
    projectDownloads,
    currentBlogs,
    previousBlogs,
    currentProjects,
    previousProjects,
    currentUsers,
    previousUsers,
    currentContacts,
    previousContacts,
    latestUniversity,
    latestProgram,
    blogMonthly,
    projectMonthly,
    userMonthly,
    contactMonthly,
    universityMonthly,
    facultyMonthly,
    programMonthly,
    subjectMonthly,
    chapterMonthly,
  ] = await Promise.all([
    UserModel.countDocuments(),
    UserModel.countDocuments({ isVerified: true }),

    UniversityModel.countDocuments(),
    UniversityModel.countDocuments({ type: "Public" }),
    UniversityModel.countDocuments({ type: "Private" }),

    FacultyModel.countDocuments(),
    ProgramModel.countDocuments(),
    SubjectModel.countDocuments(),
    SubjectModel.countDocuments({ accessType: "paid" }),
    ChapterModel.countDocuments(),
    ProjectModel.countDocuments(),
    ProjectModel.countDocuments({ featured: true }),
    BlogModel.countDocuments(),
    BlogModel.countDocuments({ visibility: "public" }),
    BlogModel.countDocuments({ featured: true }),
    CategoryModel.countDocuments(),
    ContactModel.countDocuments(),
    ContactModel.countDocuments({ replied: false }),
    ContactModel.countDocuments({ replied: true }),
    OrderModel.countDocuments({ status: "paid" }),

    sumField(BlogModel, "numOfViews"),
    sumField(ProjectModel, "numOfViews"),
    sumField(SubjectModel, "numOfViews"),
    sumField(ChapterModel, "numOfViews"),
    sumField(ProjectModel, "downloadCount"),

    BlogModel.countDocuments({ createdAt: { $gte: last30Days } }),
    BlogModel.countDocuments({ createdAt: { $gte: previous30Days, $lt: last30Days } }),
    ProjectModel.countDocuments({ createdAt: { $gte: last30Days } }),
    ProjectModel.countDocuments({ createdAt: { $gte: previous30Days, $lt: last30Days } }),
    UserModel.countDocuments({ createdAt: { $gte: last30Days } }),
    UserModel.countDocuments({ createdAt: { $gte: previous30Days, $lt: last30Days } }),
    ContactModel.countDocuments({ createdAt: { $gte: last30Days } }),
    ContactModel.countDocuments({ createdAt: { $gte: previous30Days, $lt: last30Days } }),

    UniversityModel.findOne().sort({ createdAt: -1 }).select("name").lean(),
    ProgramModel.findOne().sort({ createdAt: -1 }).select("name").lean(),

    monthlyCounts(BlogModel),
    monthlyCounts(ProjectModel),
    monthlyCounts(UserModel),
    monthlyCounts(ContactModel),
    monthlyCounts(UniversityModel),
    monthlyCounts(FacultyModel),
    monthlyCounts(ProgramModel),
    monthlyCounts(SubjectModel),
    monthlyCounts(ChapterModel),
  ]);

  const totalVisits = totalBlogViews + totalProjectViews + totalSubjectViews + totalChapterViews;
  const conversion = totalVisits > 0 ? Number(((paidOrders / totalVisits) * 100).toFixed(1)) : 0;
  const engagement = totalVisits > 0 ? Number((((publicBlogs + projects + contacts) / totalVisits) * 10).toFixed(1)) : 0;

  const usedAssets = blogs + projects + subjects + chapters + categories;
  const totalAssets = Math.max(1000, usedAssets + 250);

  res.status(200).json({
    success: true,
    data: {
      welcome: {
        name: req.user?.name || req.user?.fullname || "Admin",
        pendingProjects: Math.max(projects - featuredProjects, 0),
        completedPercentage: projects > 0 ? Math.round((featuredProjects / projects) * 100) : 0,
      },

      summary: {
        updatedAt: now,
        metrics: {
          totalVisits,
          previousVisits: Math.max(totalVisits - currentBlogs * 150, 0),
          revenue: paidOrders,
          previousRevenue: Math.max(paidOrders - 1, 0),
          conversion,
          engagement,
          previousEngagement: Math.max(engagement - 0.4, 0),

          universities: {
            count: universities,
            previousCount: Math.max(universities - 3, 0),
            types: { public: publicUniversities, private: privateUniversities },
            latest: latestUniversity?.name || "No university",
            growth: getPercent(universities, Math.max(universities - 3, 0)),
          },

          faculties: {
            count: faculties,
            previousCount: Math.max(faculties - 5, 0),
            avgPerUni: universities > 0 ? Number((faculties / universities).toFixed(1)) : 0,
            topUni: latestUniversity?.name || "N/A",
          },

          programs: {
            count: programs,
            previousCount: Math.max(programs - 8, 0),
            featured: Math.min(programs, 15),
            latest: latestProgram?.name || "No program",
          },

          subjects: {
            count: subjects,
            previousCount: Math.max(subjects - 20, 0),
            totalViews: totalSubjectViews,
            avgPages: subjects > 0 ? Number((chapters / subjects).toFixed(1)) : 0,
            paid: paidSubjects,
            free: Math.max(subjects - paidSubjects, 0),
          },

          chapters: {
            count: chapters,
            previousCount: Math.max(chapters - 50, 0),
            avgRating: 4.2,
            reviews: 150,
            withVideo: chapters,
          },

          projects: {
            count: projects,
            previousCount: Math.max(projects - previousProjects, 0),
            downloads: projectDownloads,
            featured: featuredProjects,
            premium: 0,
          },

          users: {
            count: users,
            previousCount: Math.max(users - previousUsers, 0),
            admins: 0,
            authors: 0,
            verified: activeUsers,
            paid: 0,
            active: activeUsers || users,
          },

          blogs: {
            count: blogs,
            previousCount: Math.max(blogs - previousBlogs, 0),
            views: totalBlogViews,
            public: publicBlogs,
            featured: featuredBlogs,
            comments: contacts,
          },

          contactForms: {
            count: contacts,
            previousCount: Math.max(contacts - previousContacts, 0),
            responseRate: contacts > 0 ? Math.round((repliedContacts / contacts) * 100) : 0,
            pending: pendingContacts,
            replied: repliedContacts,
          },

          assetLimits: {
            used: usedAssets,
            total: totalAssets,
            percentage: totalAssets > 0 ? Math.round((usedAssets / totalAssets) * 100) : 0,
          },
        },

        chartData: {
          visits: blogMonthly.map((item, index) => ({ name: item.name, value: item.value * 150 + projectMonthly[index].value * 220 })),
          revenue: projectMonthly.map((item) => ({ name: item.name, value: item.value * 250 })),
          conversion: projectMonthly,
          engagement: blogMonthly,
          universities: universityMonthly,
          faculties: facultyMonthly,
          programs: programMonthly,
          subjects: subjectMonthly,
          chapters: chapterMonthly,
          projects: projectMonthly,
          users: userMonthly,
          blogs: blogMonthly,
          messages: contactMonthly,
          storage: months.map((month, index) => ({ name: month, value: Math.round((usedAssets / 12) * (index + 1)) })),
        },
      },

      advancedTraffic: {
        monthlyTrafficData: buildTrafficData({
          blogMonthly,
          projectMonthly,
          userMonthly,
          contactMonthly,
          totalVisits,
        }),
      },
    },
  });
});

module.exports = {
  getDashboardStats,
};
