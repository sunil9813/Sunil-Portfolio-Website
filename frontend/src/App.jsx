import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  About,
  BlogDetail,
  BlogList,
  Contact,
  CourseList,
  ErrorPage,
  ForgotPassword,
  Home,
  Layout,
  Login,
  LoginWithOTP,
  Privacy,
  ProjectDetails,
  ProjectList,
  RoadMapList,
  Signup,
  Team,
  Terms,
  Testimonials,
  CourseDetailsPage,
} from "./router";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme, toggleTheme } from "./redux/slices/themeSlice";
import { useEffect } from "react";
import { NoteList } from "./screen/note/NoteList";
import axios from "axios";
import { getLogInStatus, getUserProfile, selectIsLoggedIn, selectUser } from "./redux/slices/authSlice";

axios.defaults.withCredentials = true;

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
      path: "/course/:slug",
      element: (
        <Layout>
          <CourseDetailsPage />
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
      path: "/notes",
      element: (
        <Layout>
          <NoteList />
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
  ]);
  return (
    <>
      <ToastContainer />

      <RouterProvider router={router} />

      {/* <div className=" fixed bottom-0 left-0 m-5" onClick={() => dispatch(toggleTheme())}>
        {theme === "dark" ? <button className="bg-indigo-500 px-3 py-1.5 rounded-lg">Dark</button> : <button className="bg-indigo-500 px-3 py-1.5 rounded-lg">light</button>}
      </div> */}
    </>
  );
};
