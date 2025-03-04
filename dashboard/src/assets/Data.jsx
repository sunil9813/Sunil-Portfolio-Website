import { FaUsers } from "react-icons/fa";
import { AiFillSetting, AiOutlineUser } from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import { BiCategoryAlt, BiImage } from "react-icons/bi";
import { BsImageAlt } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";

export const menu = [
  {
    title: "Dashboard",
    icon: <RiDashboardFill size={20} />,
    path: "/",
  },
  /*  {
    title: "Users",
    icon: <FaUsers size={20} />,
    path: "/users",
  }, */
  {
    title: "Users",
    icon: <FaUsers size={20} />,
    childrens: [
      {
        title: "all user",
        path: "/all-user",
      },
      {
        title: "create user",
        path: "/create-user",
      },
    ],
  },
  {
    title: "Category",
    icon: <MdOutlineCategory size={20} />,
    childrens: [
      {
        title: "all category",
        path: "/all-category",
      },
      {
        title: "create category",
        path: "/create-category",
      },
    ],
  },
  {
    title: "Blog",
    icon: <CiImageOn size={20} />,
    childrens: [
      {
        title: "all blog",
        path: "/all-blog",
      },
      {
        title: "create blog",
        path: "/create-blog",
      },
    ],
  },
  {
    title: "project",
    icon: <BsImageAlt size={20} />,
    childrens: [
      {
        title: "projects",
        path: "/projects",
      },
      {
        title: "category",
        path: "/category",
      },
    ],
  },

  {
    title: "Setting",
    icon: <AiFillSetting size={20} />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
      },
      {
        title: "Assets Limit",
        path: "/assets-limit",
      },
    ],
  },
];

export const menus = [
  {
    title: "Dashboard",
    icon: <RiDashboardFill size={20} />,
    path: "/",
  },
  {
    title: "Users",
    icon: <FaUsers size={20} />,
    path: "/users",
  },
  {
    title: "project",
    icon: <BsImageAlt size={20} />,
    childrens: [
      {
        title: "projects",
        path: "/projects",
        icon: <BiCategoryAlt size={20} />,
      },
      {
        title: "category",
        path: "/category",
        icon: <BiCategoryAlt size={20} />,
      },
    ],
  },

  {
    title: "Setting",
    icon: <AiFillSetting size={20} />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
        icon: <AiOutlineUser size={20} />,
      },
      {
        title: "Assets Limit",
        path: "/assets-limit",
        icon: <BiImage size={20} />,
      },
    ],
  },
];
