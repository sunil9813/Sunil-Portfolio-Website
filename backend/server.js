require("dotenv").config();
const express = require("express");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const ConnectDB = require("./config/db/Database");
const { PORT } = require("./utils/variables");

const { NotFound, ErrorHanlder } = require("./middleware/ErrorHandler");
const userRoute = require("./routes/users/UserRoute");
const postsRoute = require("./routes/posts/PostsRoute");
const favoriteRoute = require("./routes/common/favoriteRoute");
const categoryRoute = require("./routes/common/categoryRoute");
const contactRoute = require("./routes/ContactRoute");
const academicComponentsRoute = require("./routes/notes/AcademicComponentsRoute");
const commentRoute = require("./routes/common/CommentRoute");

// Notes routes
const coursesRoute = require("./routes/notes/CoursesRoute");
//End Notes routes

// About routes
const introRoute = require("./routes/about/IntroductionRoute");
const serviceRoute = require("./routes/about/ServiceRoute");
const resumeRoute = require("./routes/about/ResumeRoute");
const testimonialRoute = require("./routes/about/TestimonialRoute");
// End About routes

// Setting routes
const settingRoute = require("./routes/settings/SettingRoute");
const AssetLimitConfigRoute = require("./routes/posts/AssetLimitConfigRoute");
const tagRoute = require("./routes/common/updateTags");
const blogRoute = require("./routes/BlogRoute");
const likeRoute = require("./routes/common/likeRoute");
// End Setting routes

const textEditorRoute = require("./routes/CloudinaryImgUploadRouterForEditor");

const orderRoute = require("./routes/order/OrderRoute");
const PriceLimitConfigRoute = require("./routes/order/PriceLimitConfigRoute");
const PaymentRoute = require("./routes/order/PaymentRoute");
const path = require("path");
const bodyParser = require("body-parser");
const { deleteEmptyFolders } = require("./config/cloud/cloudinary");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

// Route middle
app.use("/api/v1/images", textEditorRoute);
app.use("/api/v1/auth", userRoute);

app.use("/api/v1/posts", postsRoute);
app.use("/api/v1/favorite", favoriteRoute);
app.use("/api/v1/asset-limit", AssetLimitConfigRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/like", likeRoute);

// About routes
app.use("/api/v1/about/intro", introRoute);
app.use("/api/v1/about/service", serviceRoute);
app.use("/api/v1/about/resume", resumeRoute);
app.use("/api/v1/about/resume", resumeRoute);
app.use("/api/v1/about/testimonial", testimonialRoute);
//End About routes

//Setting routes
app.use("/api/v1/setting", settingRoute);
app.use("/api/v1/academic", academicComponentsRoute);
app.use("/api/v1/tag", tagRoute);

app.use("/api/v1/book", coursesRoute);
app.use("/api/v1/contact", contactRoute);

app.use("/api/v1/price-limit", PriceLimitConfigRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", PaymentRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the Photo Idol");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handler
app.use(NotFound);
app.use(ErrorHanlder);
// contect to DB
app.listen(PORT, console.log("Starting Photo viewer on port " + PORT));
ConnectDB();

const parentFolder = "Sunil Portfolio";
// setInterval(() => deleteEmptyFolders(parentFolder), 60 * 1000);
