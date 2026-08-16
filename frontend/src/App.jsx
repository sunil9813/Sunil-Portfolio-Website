import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Layout } from "./components/common/Layout";
import { Login } from "./pages/auth/Login";
import { LoginWithOTP } from "./pages/auth/LoginWithOTP";
import { Signup } from "./pages/auth/Signup";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "./redux/slices/themeSlice";
import { lazy, Suspense, useEffect } from "react";
import axios from "axios";
import { getLogInStatus, getUserProfile, selectIsLoggedIn, selectUser } from "./redux/slices/authSlice";
import { CourseList } from "./screen/course/CourseList";
import { CourseDetailsPage } from "./screen/course/coursedetails/CourseDetailsPage";

axios.defaults.withCredentials = true;

const lazyNamed = (loader, exportName) => lazy(() => loader().then((module) => ({ default: module[exportName] })));
const About = lazyNamed(() => import("./pages/About"), "About");
const BlogDetail = lazyNamed(() => import("./screen/blog/BlogDetail"), "BlogDetail");
const BlogList = lazyNamed(() => import("./screen/blog/BlogList"), "BlogList");
const Contact = lazyNamed(() => import("./pages/Contact"), "Contact");
const Home = lazyNamed(() => import("./pages/home/Home"), "Home");
const Privacy = lazyNamed(() => import("./pages/Privacy"), "Privacy");
const ProjectDetails = lazyNamed(() => import("./screen/project/ProjectDetails"), "ProjectDetails");
const ProjectList = lazyNamed(() => import("./screen/project/ProjectList"), "ProjectList");
const RoadMapList = lazyNamed(() => import("./screen/roadmap/RoadMapList"), "RoadMapList");
const Team = lazyNamed(() => import("./pages/Team"), "Team");
const Terms = lazyNamed(() => import("./pages/Terms"), "Terms");
const Testimonials = lazyNamed(() => import("./pages/Testimonials"), "Testimonials");
const NoteDetailsPage = lazyNamed(() => import("./screen/note/NoteDetailsPage"), "NoteDetailsPage");
const NoteList = lazyNamed(() => import("./screen/note/NoteList"), "NoteList");
const AccountDashboard = lazyNamed(() => import("./pages/AccountDashboard"), "AccountDashboard");
const Cart = lazyNamed(() => import("./pages/Cart"), "Cart");
const PaymentStatus = lazyNamed(() => import("./pages/PaymentStatus"), "PaymentStatus");
const CertificateVerify = lazyNamed(() => import("./pages/CertificateVerify"), "CertificateVerify");
const ProjectLicenseVerify = lazyNamed(() => import("./pages/ProjectLicenseVerify"), "ProjectLicenseVerify");

export const App = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    dispatch(getLogInStatus());
    if (isLoggedIn && user === null) {
      dispatch(getUserProfile());
    }
  }, [dispatch, isLoggedIn, user]);

  const router = createBrowserRouter([
    { path: "/login", element: <Login />, errorElement: <ErrorPage /> },
    { path: "/signup", element: <Signup />, errorElement: <ErrorPage /> },
    { path: "/forgot-password", element: <ForgotPassword />, errorElement: <ErrorPage /> },
    { path: "/logi-with-otp/:email", element: <LoginWithOTP />, errorElement: <ErrorPage /> },
    {
      path: "/",
      element: (
        <Layout>
          <Home />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/project",
      element: (
        <Layout>
          <ProjectList />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/project-details/:slug",
      element: (
        <Layout>
          <ProjectDetails />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/blogs",
      element: (
        <Layout>
          <BlogList />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/view-blog/:slug",
      element: (
        <Layout>
          <BlogDetail />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/courses",
      element: (
        <Layout>
          <CourseList />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/course/:slug",
      element: (
        <Layout>
          <CourseDetailsPage />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },

    {
      path: "/notes",
      element: (
        <Layout>
          <NoteList />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/note/:slug",
      element: (
        <Layout>
          <NoteDetailsPage />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/roadmap",
      element: (
        <Layout>
          <RoadMapList />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/contact",
      element: (
        <Layout>
          <Contact />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/about",
      element: (
        <Layout>
          <About />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/term-condition",
      element: (
        <Layout>
          <Terms />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/privacy-policy",
      element: (
        <Layout>
          <Privacy />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/customer-feedback",
      element: (
        <Layout>
          <Testimonials />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/team",
      element: (
        <Layout>
          <Team />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/account",
      element: (
        <Layout>
          <AccountDashboard />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/cart",
      element: (
        <Layout>
          <Cart />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/payment/:status",
      element: (
        <Layout>
          <PaymentStatus />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/certificate/verify/:certificateId",
      element: (
        <Layout>
          <CertificateVerify />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/project-license/verify/:licenseId",
      element: (
        <Layout>
          <ProjectLicenseVerify />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
  ]);
  return (
    <>
      <ToastContainer />

      <Suspense fallback={<div className="min-h-screen p-6 text-sm text-gray-500 dark:text-white/45">Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>

      {/* <div className=" fixed bottom-0 left-0 m-5" onClick={() => dispatch(toggleTheme())}>
        {theme === "dark" ? <button className="bg-indigo-500 px-3 py-1.5 rounded-lg">Dark</button> : <button className="bg-indigo-500 px-3 py-1.5 rounded-lg">light</button>}
      </div> */}
    </>
  );
};
