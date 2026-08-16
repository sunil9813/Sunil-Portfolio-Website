import {
  BarChart3,
  BookMarked,
  BookOpen,
  BookPlus,
  BriefcaseBusiness,
  Building2,
  CircleUserRound,
  FilePlus2,
  FileText,
  FileUser,
  FolderKanban,
  FolderOpen,
  FolderPlus,
  Gauge,
  GraduationCap,
  Heart,
  Info,
  KeyRound,
  ReceiptText,
  LayoutDashboard,
  LibraryBig,
  List,
  Mail,
  MessageSquareQuote,
  Newspaper,
  PenLine,
  PlusCircle,
  School,
  Settings,
  Tags,
  UserPlus,
  UserRound,
  Users,
  Wrench,
  BadgePercent,
  Flag,
} from "lucide-react";

/* ==========================================================================
   ICON SETTINGS
   ========================================================================== */

const parentIconProps = {
  size: 16,
  strokeWidth: 1.8,
};

const childIconProps = {
  size: 12,
  strokeWidth: 1.8,
};

/* ==========================================================================
   MAIN ADMIN MENU
   ========================================================================== */

export const menu = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard {...parentIconProps} />,
    path: "/",
  },

  {
    title: "Users",
    icon: <Users {...parentIconProps} />,
    childrens: [
      {
        title: "Overview",
        path: "/overview",
        icon: <Gauge {...childIconProps} />,
      },
      {
        title: "All Users",
        path: "/all-user",
        icon: <UserRound {...childIconProps} />,
      },
      {
        title: "Create User",
        path: "/create-user",
        icon: <UserPlus {...childIconProps} />,
      },
    ],
  },

  {
    title: "Categories",
    icon: <Tags {...parentIconProps} />,
    childrens: [
      {
        title: "Overview",
        path: "/category-overview",
        icon: <Gauge {...childIconProps} />,
      },
      {
        title: "All Categories",
        path: "/all-category",
        icon: <List {...childIconProps} />,
      },
      {
        title: "Create Category",
        path: "/create-category",
        icon: <FolderPlus {...childIconProps} />,
      },
    ],
  },

  {
    title: "Blogs",
    icon: <Newspaper {...parentIconProps} />,
    childrens: [
      {
        title: "Overview",
        path: "/blog-overview",
        icon: <Gauge {...childIconProps} />,
      },
      {
        title: "All Blogs",
        path: "/all-blog",
        icon: <FileText {...childIconProps} />,
      },
      {
        title: "Subscribers",
        path: "/blog-subscribers",
        icon: <Mail {...childIconProps} />,
      },
      {
        title: "Reports",
        path: "/blog-reports",
        icon: <Flag {...childIconProps} />,
      },
      {
        title: "Your Creations",
        path: "/loginuser-blog",
        icon: <PenLine {...childIconProps} />,
      },
      {
        title: "Create Blog",
        path: "/create-blog",
        icon: <FilePlus2 {...childIconProps} />,
      },
    ],
  },

  {
    title: "Projects",
    icon: <FolderKanban {...parentIconProps} />,
    childrens: [
      {
        title: "Overview",
        path: "/overview-project",
        icon: <Gauge {...childIconProps} />,
      },
      {
        title: "All Projects",
        path: "/all-project",
        icon: <FolderOpen {...childIconProps} />,
      },
      {
        title: "Your Creations",
        path: "/users-create-project",
        icon: <BriefcaseBusiness {...childIconProps} />,
      },
      {
        title: "Reports",
        path: "/project-reports",
        icon: <Flag {...childIconProps} />,
        badge: "Audit",
      },
      {
        title: "Create Project",
        path: "/create-project",
        icon: <FolderPlus {...childIconProps} />,
      },
    ],
  },

  {
    title: "Universities",
    icon: <Building2 {...parentIconProps} />,
    childrens: [
      {
        title: "Overview",
        path: "/all-university",
        icon: <Gauge {...childIconProps} />,
      },
      {
        title: "Create University",
        path: "/create-university",
        icon: <PlusCircle {...childIconProps} />,
      },
      {
        title: "Faculties",
        path: "/all-faculty",
        icon: <School {...childIconProps} />,
      },
    ],
  },

  {
    title: "Programs",
    icon: <BookOpen {...parentIconProps} />,
    childrens: [
      {
        title: "Overview",
        path: "/all-program",
        icon: <Gauge {...childIconProps} />,
      },
      {
        title: "Create Program",
        path: "/create-program",
        icon: <BookPlus {...childIconProps} />,
      },
    ],
  },

  {
    title: "Courses",
    icon: <LibraryBig {...parentIconProps} />,
    childrens: [
      {
        title: "Overview",
        path: "/all-courses",
        icon: <Gauge {...childIconProps} />,
      },
      {
        title: "Create Course",
        path: "/create-courses",
        icon: <GraduationCap {...childIconProps} />,
      },
    ],
  },

  {
    title: "Chapters",
    icon: <BookMarked {...parentIconProps} />,
    childrens: [
      {
        title: "Overview",
        path: "/all-chapter",
        icon: <Gauge {...childIconProps} />,
      },
      {
        title: "Create Chapter",
        path: "/create-chapter",
        icon: <FilePlus2 {...childIconProps} />,
      },
      {
        title: "Create Subheading",
        path: "/create-subheading",
        icon: <BookPlus {...childIconProps} />,
      },
    ],
  },

  {
    title: "Portfolio",
    icon: <BarChart3 {...parentIconProps} />,
    childrens: [
      {
        title: "About",
        path: "/intro",
        icon: <Info {...childIconProps} />,
      },
      {
        title: "Resume",
        path: "/resume",
        icon: <FileUser {...childIconProps} />,
      },
      {
        title: "Services",
        path: "/service",
        icon: <Wrench {...childIconProps} />,
      },
    ],
  },
  {
    title: "Contact Us",
    path: "/testimonial",
    icon: <MessageSquareQuote {...childIconProps} />,
  },
  {
    title: "Settings",
    icon: <Settings {...parentIconProps} />,
    childrens: [
      {
        title: "Orders",
        path: "/orders",
        icon: <ReceiptText {...childIconProps} />,
      },
      {
        title: "Coupons",
        path: "/coupons",
        icon: <BadgePercent {...childIconProps} />,
      },
      {
        title: "Business Overview",
        path: "/business-overview",
        icon: <BarChart3 {...childIconProps} />,
      },
      {
        title: "Reviews & Support",
        path: "/reviews-support",
        icon: <MessageSquareQuote {...childIconProps} />,
      },
      {
        title: "Plans & Bundles",
        path: "/plans-bundles",
        icon: <BriefcaseBusiness {...childIconProps} />,
      },
      {
        title: "Assets Limit",
        path: "/assets-limit",
        icon: <Gauge {...childIconProps} />,
      },
    ],
  },

  {
    title: "Profile",
    icon: <CircleUserRound {...parentIconProps} />,
    childrens: [
      {
        title: "My Profile",
        path: "/profile",
        icon: <UserRound {...childIconProps} />,
      },
      {
        title: "Favourites",
        path: "/favorite",
        icon: <Heart {...childIconProps} />,
      },
      {
        title: "Change Password",
        path: "/change-password",
        icon: <KeyRound {...childIconProps} />,
      },
    ],
  },
];

/* ==========================================================================
   SECONDARY MENU
   ========================================================================== */

export const menus = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard {...parentIconProps} />,
    path: "/",
  },

  {
    title: "Users",
    icon: <Users {...parentIconProps} />,
    path: "/users",
  },

  {
    title: "Projects",
    icon: <FolderKanban {...parentIconProps} />,
    childrens: [
      {
        title: "All Projects",
        path: "/projects",
        icon: <FolderOpen {...childIconProps} />,
      },
      {
        title: "Categories",
        path: "/category",
        icon: <Tags {...childIconProps} />,
      },
    ],
  },

  {
    title: "Settings",
    icon: <Settings {...parentIconProps} />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
        icon: <UserRound {...childIconProps} />,
      },
      {
        title: "Business Overview",
        path: "/business-overview",
        icon: <BarChart3 {...childIconProps} />,
      },
      {
        title: "Plans & Bundles",
        path: "/plans-bundles",
        icon: <BriefcaseBusiness {...childIconProps} />,
      },
      {
        title: "Assets Limit",
        path: "/assets-limit",
        icon: <Gauge {...childIconProps} />,
      },
    ],
  },
];
