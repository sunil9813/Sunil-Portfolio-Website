import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  AddCategory,
  BlogDetails,
  BlogList,
  CategoryList,
  CreateBlog,
  CreateProject,
  CreateUser,
  ErrorPage,
  Favorite,
  FilterPage,
  ForgotPassword,
  Home,
  Layout,
  Login,
  LoginWithOTP,
  ProjectDetails,
  ProjectList,
  ResetPassword,
  Signup,
  UpdateBlog,
  UpdateCategory,
  UpdateProject,
  UserCreateProjectList,
  UserList,
  ViewCategory,
  ViewUser,
  AssetConfigure,
  LayoutWithOutHeader,
} from "./utils/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getLogInStatus, getUserProfile, selectIsLoggedIn, selectUser } from "./redux/slices/authSlice";
import { useEffect, useState } from "react";
import { selectTheme, toggleTheme } from "./redux/slices/themeSlice";

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);
  const [width, setWidth] = useState(window.innerWidth);
  console.log("====================================");
  console.log(width);
  console.log("====================================");

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
      path: "/projects",
      element: (
        <Layout>
          <Home />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <Signup />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/logi-with-otp/:email",
      element: <LoginWithOTP />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/reset-password/:resetToken",
      element: <ResetPassword />,
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
        <Layout>
          <CreateUser />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/view-user",
      element: (
        <Layout>
          <ViewUser />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },

    // Category Routes
    {
      path: "/all-category",
      element: (
        <Layout>
          <CategoryList />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/view-category/:id",
      element: (
        <Layout>
          <ViewCategory />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/create-category",
      element: (
        <Layout>
          <AddCategory />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/update-category/:id",
      element: (
        <Layout>
          <UpdateCategory />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },

    // Blog Routes
    {
      path: "/all-blog",
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
          <BlogDetails />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/create-blog",
      element: (
        <Layout>
          <CreateBlog />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/update-blog/:slug",
      element: (
        <Layout>
          <UpdateBlog />
        </Layout>
      ),
      errorElement: <ErrorPage />,
    },
    // Project Routes
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
      path: "/create-project",
      element: (
        <LayoutWithOutHeader>
          <CreateProject />
        </LayoutWithOutHeader>
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
      path: "/update-project/:slug",
      element: (
        <Layout>
          <UpdateProject />
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
      path: "/favorite",
      element: (
        <Layout>
          <Favorite />
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
}

export default App;
