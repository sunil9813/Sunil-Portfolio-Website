import { createBrowserRouter, Navigate } from "react-router-dom";

import {
  ProtectedRoute,
  PublicRoute,
  Login,
  Signup,
  LoginWithOTP,
  ForgotPassword,
  ResetPassword,
  Home,
  Layout,
  LayoutWithOutHeader,
  DashboardLayoutWithOutHeader,
  MyProfile,
  ChangePassword,
  Overview,
  ProjectOverview,
  BlogOverview,
  CategoryOverview,
  UserList,
  CreateUser,
  ViewUser,
  UpdateUserRole,
  AddCategory,
  CategoryList,
  ViewCategory,
  UpdateCategory,
  BlogList,
  BlogDetails,
  CreateBlog,
  UpdateBlog,
  CreateProject,
  ProjectList,
  ProjectDetails,
  UpdateProject,
  UserCreateProjectList,
  CreateUniversity,
  OverviewUniversity,
  UniversityDetails,
  UpdateUniversity,
  CreateFaculty,
  FacultyOverview,
  ViewFaculty,
  CreateProgram,
  OverviewProgram,
  ViewProgram,
  UpdateProgram,
  CreateCourse,
  CourseList,
  CourseDetails,
  UpdateCourse,
  CoursesWiseAllChapter,
  CreateChapterr,
  ChapterOverview,
  ChapterDetails,
  UpdateChapter,
  CreateAbout,
  AboutList,
  ViewAbout,
  UpdateAbout,
  ResumeDeatils,
  CreateResume,
  UpdateResume,
  ViewAllResume,
  AllPortfolioService,
  PortfolioServiceCreate,
  PortfolioServiceDetails,
  PortfolioServiceUpdate,
  AllTestimonial,
  CreateTestimonial,
  Favorite,
  FilterPage,
  AssetConfigure,
  ErrorPage,
} from "./index";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <LayoutWithOutHeader />,
        errorElement: <ErrorPage />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/signup", element: <Signup /> },
          { path: "/login-with-otp/:email", element: <LoginWithOTP /> },
          { path: "/logi-with-otp/:email", element: <LoginWithOTP /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/reset-password/:resetToken", element: <ResetPassword /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: (
          <Layout title="Welcome To Dashboard">
            <Home />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/dashboard",
        element: (
          <Layout title="Welcome To Dashboard">
            <Home />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/overview",
        element: (
          <Layout title="User Analytics Dashboard">
            <Overview />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/all-user",
        element: (
          <Layout>
            <UserList />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-user",
        element: (
          <DashboardLayoutWithOutHeader>
            <CreateUser />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/view-user/:id",
        element: (
          <Layout>
            <ViewUser />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/update-user-role/:id",
        element: (
          <Layout>
            <UpdateUserRole />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/category-overview",
        element: (
          <Layout title="Analytics Overview">
            <CategoryOverview />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/all-category",
        element: (
          <Layout title="Categories Overview">
            <CategoryList />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-category",
        element: (
          <DashboardLayoutWithOutHeader>
            <AddCategory />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/view-category/:id",
        element: (
          <Layout title="Category Details">
            <ViewCategory />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/update-category/:id",
        element: (
          <DashboardLayoutWithOutHeader>
            <UpdateCategory />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/blog-overview",
        element: (
          <Layout title="Analytics Overview">
            <BlogOverview />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/all-blog",
        element: (
          <Layout title="Explore Blogs">
            <BlogList />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-blog",
        element: (
          <DashboardLayoutWithOutHeader>
            <CreateBlog />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/view-blog/:slug",
        element: (
          <Layout title="Blog Details">
            <BlogDetails />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/update-blog/:slug",
        element: (
          <DashboardLayoutWithOutHeader>
            <UpdateBlog />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/overview-project",
        element: (
          <Layout title="Manage Projects">
            <ProjectOverview />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/all-project",
        element: (
          <Layout title="Manage Projects">
            <ProjectList />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/view-project/:slug",
        element: (
          <Layout>
            <ProjectDetails />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/update-project/:slug",
        element: (
          <Layout>
            <UpdateProject />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/users-create-project",
        element: (
          <Layout>
            <UserCreateProjectList />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-project",
        element: (
          <DashboardLayoutWithOutHeader>
            <CreateProject />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/all-university",
        element: (
          <Layout title="Manage University">
            <OverviewUniversity />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/view-university/:slug",
        element: (
          <Layout title="details information">
            <UniversityDetails />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-university",
        element: (
          <DashboardLayoutWithOutHeader>
            <CreateUniversity />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/update-university/:slug",
        element: (
          <DashboardLayoutWithOutHeader>
            <UpdateUniversity />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/all-faculty",
        element: (
          <Layout title="Overview">
            <FacultyOverview />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-faculty",
        element: (
          <Layout>
            <CreateFaculty />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/view-faculty/:id",
        element: (
          <Layout>
            <ViewFaculty />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/all-program",
        element: (
          <Layout title="Overview">
            <OverviewProgram />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/view-program/:slug",
        element: (
          <Layout title="details information">
            <ViewProgram />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-program",
        element: (
          <DashboardLayoutWithOutHeader>
            <CreateProgram />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/update-program/:slug",
        element: (
          <DashboardLayoutWithOutHeader>
            <UpdateProgram />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/all-courses",
        element: (
          <Layout title="Overview">
            <CourseList />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/view-course/:slug",
        element: (
          <Layout title="Course Details">
            <CourseDetails />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/course/allchapter/:slug",
        element: (
          <Layout title="Course Details">
            <CoursesWiseAllChapter />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/courses-wise-chapter/:slug",
        element: (
          <Layout title="Course Details">
            <CoursesWiseAllChapter />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/courses/:id/chapters",
        element: (
          <Layout title="Course Details">
            <CoursesWiseAllChapter />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-courses",
        element: (
          <DashboardLayoutWithOutHeader>
            <CreateCourse />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/update-course/:slug",
        element: (
          <DashboardLayoutWithOutHeader>
            <UpdateCourse />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/all-chapter",
        element: (
          <Layout title="Overview">
            <ChapterOverview />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/view-chapter/:slug",
        element: (
          <Layout title="Chapter Details">
            <ChapterDetails />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-chapter",
        element: (
          <DashboardLayoutWithOutHeader>
            <CreateChapterr />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/update-chapter/:slug",
        element: (
          <DashboardLayoutWithOutHeader>
            <UpdateChapter />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/intro",
        element: (
          <Layout title="overivew">
            <AboutList />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/view-intro/:id",
        element: (
          <Layout>
            <ViewAbout />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-intro",
        element: (
          <DashboardLayoutWithOutHeader>
            <CreateAbout />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/update-intro/:id",
        element: (
          <DashboardLayoutWithOutHeader>
            <UpdateAbout />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/resume",
        element: (
          <Layout title="overivew">
            <ViewAllResume />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/view-resume/:id",
        element: (
          <Layout title="Details">
            <ResumeDeatils />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-resume",
        element: (
          <DashboardLayoutWithOutHeader>
            <CreateResume />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/update-resume/:id",
        element: (
          <DashboardLayoutWithOutHeader>
            <UpdateResume />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/service",
        element: (
          <Layout title="overivew">
            <AllPortfolioService />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/view-service/:slug",
        element: (
          <Layout title="Overview">
            <PortfolioServiceDetails />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-service",
        element: (
          <DashboardLayoutWithOutHeader>
            <PortfolioServiceCreate />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/update-service/:slug",
        element: (
          <DashboardLayoutWithOutHeader>
            <PortfolioServiceUpdate />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/testimonial",
        element: (
          <Layout title="Overview">
            <AllTestimonial />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-testimonial",
        element: (
          <DashboardLayoutWithOutHeader>
            <CreateTestimonial />
          </DashboardLayoutWithOutHeader>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: "/profile",
        element: (
          <Layout>
            <MyProfile />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/favorite",
        element: (
          <Layout>
            <Favorite />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/change-password",
        element: (
          <Layout>
            <ChangePassword />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/filter",
        element: (
          <Layout>
            <FilterPage />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/assets-limit",
        element: (
          <Layout>
            <AssetConfigure />
          </Layout>
        ),
        errorElement: <ErrorPage />,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
