require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const ConnectDB = require("./config/db/Database");
const PORT = process.env.PORT || 5001;

const { NotFound, ErrorHanlder } = require("./middleware/ErrorHandler");
const userRoute = require("./routes/users/UserRoute");
const projectRoute = require("./routes/Project/ProjectRoute");
const favoriteRoute = require("./routes/common/favoriteRoute");
const categoryRoute = require("./routes/common/categoryRoute");
const contactRoute = require("./routes/ContactRoute");
const commentRoute = require("./routes/common/CommentRoute");

/*  -------  AcademicComponentsRoute ----------- */
const UniversityRoute = require("./routes/educationRoute/universityRoute");
const FacultyRoute = require("./routes/educationRoute/FacultyRoute");
const ProgramRoute = require("./routes/educationRoute/ProgramRoute");
const SubjectRoute = require("./routes/educationRoute/SubjectRoute");
const ChapterRoute = require("./routes/educationRoute/ChapterRoute");
/*  -------  End AcademicComponentsRoute ----------- */

/*  -------   Portfolio routes ----------- */
const introRoute = require("./routes/portfolio/IntroductionRoute");
const serviceRoute = require("./routes/portfolio/ServiceRoute");
const resumeRoute = require("./routes/portfolio/ResumeRoute");
const testimonialRoute = require("./routes/portfolio/TestimonialRoute");
/*  -------  End Portfolio routes ----------- */

// Setting routes
const settingRoute = require("./routes/settings/SettingRoute");
const AssetLimitConfigRoute = require("./routes/Project/AssetLimitConfigRoute");
const blogRoute = require("./routes/BlogRoute");
const likeRoute = require("./routes/common/likeRoute");
// End Setting routes

// Dashbaord routes
const dashboardRoute = require("./routes/dashboard/DashboardRoute");
// End Dashbaord routes

const textEditorRoute = require("./routes/CloudinaryImgUploadRouterForEditor");

const orderRoute = require("./routes/order/OrderRoute");
const PriceLimitConfigRoute = require("./routes/order/PriceLimitConfigRoute");
const PaymentRoute = require("./routes/order/PaymentRoute");
const CouponRoute = require("./routes/order/CouponRoute");
const BusinessRoute = require("./routes/product/BusinessRoute");
const SeoRoute = require("./routes/SeoRoute");
const { handleStripeWebhook } = require("./controllers/order/PaymentController");
const { createRateLimiter, securityHeaders } = require("./middleware/securityMiddleware");
const path = require("path");
const bodyParser = require("body-parser");
const { deleteEmptyFolders } = require("./config/cloud/cloudinary");
const app = express();

// Middleware
app.post("/api/v1/payment/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
app.use(securityHeaders);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false, limit: "2mb" }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "2mb" }));

const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: "Too many auth requests. Please wait a few minutes and try again.",
});
const checkoutRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 180,
  message: "Too many checkout requests. Please wait a few minutes and try again.",
});
const businessRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 240,
});
const contentRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 240,
});
const contactRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many messages from this device. Please wait a few minutes and try again.",
});

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:5172",
      "http://localhost:5173",
      "http://192.168.1.4:5172",
      "http://192.168.1.4:5173",
      "https://bksuniladmin.netlify.app",
      "https://bksunil.netlify.app",
    ],
    credentials: true,
  }),
);

// Route middle
app.use("/", SeoRoute);
app.use("/api/v1/images", textEditorRoute);
app.use("/api/v1/auth", authRateLimiter, userRoute);

app.use("/api/v1/project", projectRoute);
app.use("/api/v1/favorite", contentRateLimiter, favoriteRoute);
app.use("/api/v1/asset-limit", AssetLimitConfigRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/blog", contentRateLimiter, blogRoute);
app.use("/api/v1/comment", contentRateLimiter, commentRoute);
app.use("/api/v1/like", contentRateLimiter, likeRoute);

// About routes
app.use("/api/v1/portfolio/intro", introRoute);
app.use("/api/v1/portfolio/service", serviceRoute);
app.use("/api/v1/portfolio/resume", resumeRoute);
app.use("/api/v1/portfolio/testimonial", testimonialRoute);
//End About routes

//Setting routes
app.use("/api/v1/setting", settingRoute);

app.use("/api/v1/contact", contactRateLimiter, contactRoute);

app.use("/api/v1/price-limit", PriceLimitConfigRoute);
app.use("/api/v1/order", checkoutRateLimiter, orderRoute);
app.use("/api/v1/payment", checkoutRateLimiter, PaymentRoute);
app.use("/api/v1/coupon", checkoutRateLimiter, CouponRoute);
app.use("/api/v1/business", businessRateLimiter, BusinessRoute);

/*  -------  AcademicComponentsRoute ----------- */
app.use("/api/v1/university", UniversityRoute);
app.use("/api/v1/faculty", FacultyRoute);
app.use("/api/v1/program", ProgramRoute);
app.use("/api/v1/subject", SubjectRoute);
app.use("/api/v1/chapter", ChapterRoute);
/*  -------  End AcademicComponentsRoute ----------- */

app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/seo", SeoRoute);

app.get("/", (req, res) => {
  res.send("Welcome to Sunil Portfolio.");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handler
app.use(NotFound);
app.use(ErrorHanlder);

// contect to DB
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
ConnectDB();

const parentFolder = "Sunil Portfolio";
// setInterval(() => deleteEmptyFolders(parentFolder), 60 * 1000);
