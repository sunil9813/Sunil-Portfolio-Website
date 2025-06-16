import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BlogList, ErrorPage, ForgotPassword, Home, Layout, Login, LoginWithOTP, ProjectDetails, ProjectList, Signup } from "./router";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme, toggleTheme } from "./redux/slices/themeSlice";
import { useEffect } from "react";

export const App = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

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
  ]);
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />

      <div className=" fixed bottom-0 left-0 m-5" onClick={() => dispatch(toggleTheme())}>
        {theme === "dark" ? <button className="bg-indigo-500 px-3 py-1.5 rounded-lg">Dark</button> : <button className="bg-indigo-500 px-3 py-1.5 rounded-lg">light</button>}
      </div>
    </>
  );
};
