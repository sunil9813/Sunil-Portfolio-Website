import { FaRegUser, FaUniversity, FaUsers } from "react-icons/fa";
import { AiFillSetting, AiOutlineUser } from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import { BiCategoryAlt, BiImage } from "react-icons/bi";
import { BsImageAlt } from "react-icons/bs";
import { MdAutoGraph, MdOutlineCategory } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { PiBooksLight } from "react-icons/pi";
import { GiBookshelf } from "react-icons/gi";
import { GrChapterAdd } from "react-icons/gr";

export const menu = [
  {
    title: "Dashboard",
    icon: <RiDashboardFill size={17} />,
    path: "/",
  },
  /*  {
    title: "Users",
    icon: <FaUsers size={17} />,
    path: "/users",
  }, */
  {
    title: "Users",
    icon: <FaUsers size={17} />,
    childrens: [
      {
        title: "overview",
        path: "/overview",
      },
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
    icon: <MdOutlineCategory size={17} />,
    childrens: [
      {
        title: "overview",
        path: "/category-overview",
      },
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
    icon: <CiImageOn size={17} />,
    childrens: [
      {
        title: "overview",
        path: "/blog-overview",
      },
      {
        title: "all blog",
        path: "/all-blog",
      },
      {
        title: "Your Creation",
        path: "/loginuser-blog",
      },
      {
        title: "create blog",
        path: "/create-blog",
      },
    ],
  },
  {
    title: "project",
    icon: <BsImageAlt size={17} />,
    childrens: [
      {
        title: "Overview",
        path: "/overview-project",
      },
      {
        title: "projects",
        path: "/all-project",
      },
      {
        title: "Your Creation",
        path: "/users-create-project",
      },
      {
        title: "create project",
        path: "/create-project",
      },
    ],
  },

  {
    title: "University",
    icon: <FaUniversity size={17} />,
    childrens: [
      {
        title: "Overview",
        path: "/all-university",
      },
      {
        title: "Create",
        path: "/create-university",
      },
      {
        title: "Faculty",
        path: "/all-faculty",
      },
    ],
  },

  {
    title: "Program",
    icon: <PiBooksLight size={17} />,
    childrens: [
      {
        title: "Overview",
        path: "/all-program",
      },
      {
        title: "Create program",
        path: "/create-program",
      },
    ],
  },
  {
    title: "courses",
    icon: <GiBookshelf size={17} />,
    childrens: [
      {
        title: "Overview",
        path: "/all-courses",
      },
      {
        title: "Create courses",
        path: "/create-courses",
      },
    ],
  },
  {
    title: "chapter",
    icon: <GrChapterAdd size={17} />,
    childrens: [
      {
        title: "Overview",
        path: "/all-chapter",
      },
      {
        title: "Create chapter",
        path: "/create-chapter",
      },
    ],
  },
  // Portfolio
  {
    title: "Portfolio",
    icon: <MdAutoGraph size={17} />,
    childrens: [
      {
        title: "About Us",
        path: "/intro",
      },
      {
        title: "resume",
        path: "/resume",
      },
      {
        title: "service",
        path: "/service",
      },
      {
        title: "testimonial",
        path: "/testimonial",
      },
    ],
  },

  {
    title: "Setting",
    icon: <AiFillSetting size={17} />,
    childrens: [
      {
        title: "Assets Limit",
        path: "/assets-limit",
      },
    ],
  },
  {
    title: "Profile",
    icon: <FaRegUser size={17} />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
      },
      {
        title: "Favorite",
        path: "/favorite",
      },
      {
        title: "Change Password",
        path: "/change-password",
      },
    ],
  },
];

export const menus = [
  {
    title: "Dashboard",
    icon: <RiDashboardFill size={17} />,
    path: "/",
  },
  {
    title: "Users",
    icon: <FaUsers size={17} />,
    path: "/users",
  },
  {
    title: "project",
    icon: <BsImageAlt size={17} />,
    childrens: [
      {
        title: "projects",
        path: "/projects",
        icon: <BiCategoryAlt size={17} />,
      },
      {
        title: "category",
        path: "/category",
        icon: <BiCategoryAlt size={17} />,
      },
    ],
  },

  {
    title: "Setting",
    icon: <AiFillSetting size={17} />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
        icon: <AiOutlineUser size={17} />,
      },
      {
        title: "Assets Limit",
        path: "/assets-limit",
        icon: <BiImage size={17} />,
      },
    ],
  },
];
