import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  AddCategory,
  BlogDetails,
  BlogList,
  CategoryList,
  CreateBlog,
  CreateUser,
  FilterPage,
  ForgotPassword,
  Home,
  Layout,
  Login,
  LoginWithOTP,
  ResetPassword,
  Signup,
  UpdateBlog,
  UpdateCategory,
  UserList,
  ViewCategory,
  ViewUser,
} from "./utils/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getLogInStatus, getUserProfile, selectIsLoggedIn, selectUser } from "./redux/slices/authSlice";
import { useEffect } from "react";

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

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
    },
    {
      path: "/projects",
      element: (
        <Layout>
          <Home />
        </Layout>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/logi-with-otp/:email",
      element: <LoginWithOTP />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password/:resetToken",
      element: <ResetPassword />,
    },
    {
      path: "/all-user",
      element: (
        <Layout>
          <UserList />
        </Layout>
      ),
    },
    {
      path: "/create-user",
      element: (
        <Layout>
          <CreateUser />
        </Layout>
      ),
    },
    {
      path: "/view-user",
      element: (
        <Layout>
          <ViewUser />
        </Layout>
      ),
    },
    // categories related links
    {
      path: "/all-category",
      element: (
        <Layout>
          <CategoryList />
        </Layout>
      ),
    },
    {
      path: "/view-category/:id",
      element: (
        <Layout>
          <ViewCategory />
        </Layout>
      ),
    },
    {
      path: "/create-category",
      element: (
        <Layout>
          <AddCategory />
        </Layout>
      ),
    },
    {
      path: "/update-category/:id",
      element: (
        <Layout>
          <UpdateCategory />
        </Layout>
      ),
    },
    // categories related links
    {
      path: "/all-blog",
      element: (
        <Layout>
          <BlogList />
        </Layout>
      ),
    },
    {
      path: "/view-blog/:slug",
      element: (
        <Layout>
          <BlogDetails />
        </Layout>
      ),
    },
    {
      path: "/create-blog",
      element: (
        <Layout>
          <CreateBlog />
        </Layout>
      ),
    },
    {
      path: "/update-blog/:id",
      element: (
        <Layout>
          <UpdateBlog />
        </Layout>
      ),
    },
    {
      path: "/filter",
      element: (
        <Layout>
          <FilterPage />
        </Layout>
      ),
    },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
