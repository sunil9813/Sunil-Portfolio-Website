import { useEffect, useMemo, useRef, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

/*
 * Your original colour order and gradient
 * background classes are preserved.
 *
 * accent and rgb are added only for:
 * - child connector arrows
 * - active marks
 * - subtle shadows
 */
export const sidebarColors = [
  {
    name: "blue",
    accent: "#3b82f6",
    rgb: "59, 130, 246",

    text: "text-blue-600 dark:text-blue-500",

    bg: "bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent",

    border: "border-blue-200 dark:border-blue-800/40",

    hover: "hover:bg-blue-50 dark:hover:bg-blue-900/30",

    active: "bg-gradient-to-r from-blue-100 to-transparent dark:from-blue-900/40 dark:to-transparent",
  },
  {
    name: "purple",
    accent: "#a855f7",
    rgb: "168, 85, 247",

    text: "text-purple-600 dark:text-purple-500",

    bg: "bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent",

    border: "border-purple-200 dark:border-purple-800/40",

    hover: "hover:bg-purple-50 dark:hover:bg-purple-900/30",

    active: "bg-gradient-to-r from-purple-100 to-transparent dark:from-purple-900/40 dark:to-transparent",
  },
  {
    name: "green",
    accent: "#22c55e",
    rgb: "34, 197, 94",

    text: "text-green-600 dark:text-green-500",

    bg: "bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent",

    border: "border-green-200 dark:border-green-800/40",

    hover: "hover:bg-green-50 dark:hover:bg-green-900/30",

    active: "bg-gradient-to-r from-green-100 to-transparent dark:from-green-900/40 dark:to-transparent",
  },
  {
    name: "orange",
    accent: "#f97316",
    rgb: "249, 115, 22",

    text: "text-orange-600 dark:text-orange-500",

    bg: "bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-900/20 dark:to-transparent",

    border: "border-orange-200 dark:border-orange-800/40",

    hover: "hover:bg-orange-50 dark:hover:bg-orange-900/30",

    active: "bg-gradient-to-r from-orange-100 to-transparent dark:from-orange-900/40 dark:to-transparent",
  },
  {
    name: "red",
    accent: "#ef4444",
    rgb: "239, 68, 68",

    text: "text-red-600 dark:text-red-500",

    bg: "bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20 dark:to-transparent",

    border: "border-red-200 dark:border-red-800/40",

    hover: "hover:bg-red-50 dark:hover:bg-red-900/30",

    active: "bg-gradient-to-r from-red-100 to-transparent dark:from-red-900/40 dark:to-transparent",
  },
  {
    name: "indigo",
    accent: "#6366f1",
    rgb: "99, 102, 241",

    text: "text-indigo-600 dark:text-indigo-500",

    bg: "bg-gradient-to-r from-indigo-50 to-transparent dark:from-indigo-900/20 dark:to-transparent",

    border: "border-indigo-200 dark:border-indigo-800/40",

    hover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/30",

    active: "bg-gradient-to-r from-indigo-100 to-transparent dark:from-indigo-900/40 dark:to-transparent",
  },
  {
    name: "pink",
    accent: "#ec4899",
    rgb: "236, 72, 153",

    text: "text-pink-600 dark:text-pink-500",

    bg: "bg-gradient-to-r from-pink-50 to-transparent dark:from-pink-900/20 dark:to-transparent",

    border: "border-pink-200 dark:border-pink-800/40",

    hover: "hover:bg-pink-50 dark:hover:bg-pink-900/30",

    active: "bg-gradient-to-r from-pink-100 to-transparent dark:from-pink-900/40 dark:to-transparent",
  },
  {
    name: "sky",
    accent: "#0284c7",
    rgb: "2, 132, 199",

    text: "text-sky-600 dark:text-sky-500",

    bg: "bg-gradient-to-r from-sky-50 to-transparent dark:from-sky-900/20 dark:to-transparent",

    border: "border-sky-200 dark:border-sky-800/40",

    hover: "hover:bg-sky-50 dark:hover:bg-sky-900/30",

    active: "bg-gradient-to-r from-sky-100 to-transparent dark:from-sky-900/40 dark:to-transparent",
  },
  {
    name: "fuchsia",
    accent: "#d946ef",
    rgb: "217, 70, 239",

    text: "text-fuchsia-600 dark:text-fuchsia-500",

    bg: "bg-gradient-to-r from-fuchsia-50 to-transparent dark:from-fuchsia-900/20 dark:to-transparent",

    border: "border-fuchsia-200 dark:border-fuchsia-800/40",

    hover: "hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30",

    active: "bg-gradient-to-r from-fuchsia-100 to-transparent dark:from-fuchsia-900/40 dark:to-transparent",
  },
  {
    name: "lime",
    accent: "#84cc16",
    rgb: "132, 204, 22",

    text: "text-lime-600 dark:text-lime-500",

    bg: "bg-gradient-to-r from-lime-50 to-transparent dark:from-lime-900/20 dark:to-transparent",

    border: "border-lime-200 dark:border-lime-800/40",

    hover: "hover:bg-lime-50 dark:hover:bg-lime-900/30",

    active: "bg-gradient-to-r from-lime-100 to-transparent dark:from-lime-900/40 dark:to-transparent",
  },
  {
    name: "teal",
    accent: "#14b8a6",
    rgb: "20, 184, 166",

    text: "text-teal-600 dark:text-teal-500",

    bg: "bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-900/20 dark:to-transparent",

    border: "border-teal-200 dark:border-teal-800/40",

    hover: "hover:bg-teal-50 dark:hover:bg-teal-900/30",

    active: "bg-gradient-to-r from-teal-100 to-transparent dark:from-teal-900/40 dark:to-transparent",
  },
  {
    name: "rose",
    accent: "#f43f5e",
    rgb: "244, 63, 94",

    text: "text-rose-600 dark:text-rose-500",

    bg: "bg-gradient-to-r from-rose-50 to-transparent dark:from-rose-900/20 dark:to-transparent",

    border: "border-rose-200 dark:border-rose-800/40",

    hover: "hover:bg-rose-50 dark:hover:bg-rose-900/30",

    active: "bg-gradient-to-r from-rose-100 to-transparent dark:from-rose-900/40 dark:to-transparent",
  },
];

/* ==========================================================================
   ROUTE HELPERS
   ========================================================================== */

const isRouteActive = (currentPath, targetPath) => {
  if (!targetPath) {
    return false;
  }

  if (targetPath === "/") {
    return currentPath === "/";
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
};

const hasActiveChild = (children, currentPath) => {
  if (!Array.isArray(children)) {
    return false;
  }

  return children.some((child) => isRouteActive(currentPath, child?.path));
};

/* ==========================================================================
   ICON
   ========================================================================== */

const SidebarMenuIcon = ({ icon, active, color }) => {
  if (!icon) {
    return null;
  }

  return (
    <span
      className={`
        sidebar-menu-icon

        ${active ? color.bg : ""}

        ${active ? color.text : "text-gray-600 dark:text-gray-400"}
      `}
    >
      <span className="sidebar-menu-icon__glow" />

      <span className="sidebar-menu-icon__content">{icon}</span>
    </span>
  );
};

SidebarMenuIcon.propTypes = {
  icon: PropTypes.node,
  active: PropTypes.bool,
  color: PropTypes.object.isRequired,
};

/* ==========================================================================
   CHILD LINK
   ========================================================================== */

const SidebarChildItem = ({ child, currentPath, color, index, isLast }) => {
  const active = isRouteActive(currentPath, child?.path);

  return (
    <NavLink
      to={child?.path || "#"}
      className="s-child"
      style={{
        "--child-delay": `${index * 45}ms`,
      }}
    >
      <span
        className={`
          sidebar-child-row

          ${
            active
              ? `
                sidebar-child-row--active
                ${color.text}
              `
              : `
                text-gray-600
                dark:text-gray-400
              `
          }
        `}
      >
        {/* Child connector arrow */}

        <span
          className={`
            sidebar-child-connector

            ${isLast ? "sidebar-child-connector--last" : ""}
          `}
        >
          <span className="sidebar-child-connector__line" />

          <span className="sidebar-child-connector__curve" />

          <span className="sidebar-child-connector__arrow" />
        </span>

        {child?.icon && (
          <span
            className={`
              sidebar-child-row__icon

              ${active ? color.text : "text-gray-400 dark:text-gray-500"}
            `}
          >
            {child.icon}
          </span>
        )}

        <span className="sidebar-child-row__title">{child?.title || "Untitled"}</span>

        {active && <span className="sidebar-child-row__active-dot" />}
      </span>
    </NavLink>
  );
};

SidebarChildItem.propTypes = {
  child: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    path: PropTypes.string,
    icon: PropTypes.node,
  }).isRequired,

  currentPath: PropTypes.string.isRequired,
  color: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isLast: PropTypes.bool,
};

/* ==========================================================================
   SIDEBAR ITEM
   ========================================================================== */

export const SidebarItem = ({ item, isOpenState = false, onSubMenuToggle, index = 0 }) => {
  const location = useLocation();

  const submenuRef = useRef(null);

  const children = useMemo(() => item?.childrens || item?.children || [], [item?.childrens, item?.children]);

  const hasChildren = children.length > 0;

  const color = sidebarColors[index % sidebarColors.length];

  const childActive = hasActiveChild(children, location.pathname);

  const directActive = isRouteActive(location.pathname, item?.path);

  const itemActive = directActive || childActive;

  const [expanded, setExpanded] = useState(isOpenState || childActive);

  const [submenuHeight, setSubmenuHeight] = useState(0);

  /*
   * Synchronises submenu with Sidebar state
   * and automatically opens active children.
   */
  useEffect(() => {
    setExpanded(isOpenState || childActive);
  }, [isOpenState, childActive]);

  /*
   * Measures the actual submenu height.
   */
  useEffect(() => {
    const submenu = submenuRef.current;

    if (!submenu) {
      return undefined;
    }

    const calculateHeight = () => {
      setSubmenuHeight(submenu.scrollHeight);
    };

    calculateHeight();

    const resizeObserver = new ResizeObserver(calculateHeight);

    resizeObserver.observe(submenu);

    return () => {
      resizeObserver.disconnect();
    };
  }, [children]);

  const sharedStyle = {
    "--sidebar-accent": color.accent,

    "--sidebar-accent-rgb": color.rgb,
  };

  /* ==========================================================================
     PARENT ITEM
     ========================================================================== */

  if (hasChildren) {
    return (
      <div
        className={`
          sidebar-item
          sidebar-parent
          capitalize

          ${expanded ? "sidebar-parent--open" : ""}

          ${itemActive ? "sidebar-parent--active" : ""}
        `}
        style={sharedStyle}
      >
        <button
          type="button"
          onClick={onSubMenuToggle}
          className={`
            sidebar-main-row
            ${color.hover}

            ${
              expanded || itemActive
                ? `
                  ${color.active}
                  ${color.border}
                  sidebar-main-row--active
                `
                : `
                  border-transparent
                `
            }
          `}
          aria-expanded={expanded}
        >
          <span className="sidebar-main-row__content">
            <SidebarMenuIcon icon={item?.icon} active={expanded || itemActive} color={color} />

            <span
              className={`
                sidebar-main-row__title

                ${expanded || itemActive ? color.text : "text-gray-800 dark:text-gray-200"}
              `}
            >
              {item?.title || "Untitled"}
            </span>
          </span>

          <span
            className={`
              sidebar-parent-arrow

              ${expanded || itemActive ? color.text : "text-gray-400 dark:text-gray-500"}

              ${expanded ? "sidebar-parent-arrow--open" : ""}
            `}
          >
            <MdKeyboardArrowRight size={19} />
          </span>
        </button>

        {/* Submenu */}

        <div
          className="sidebar-submenu"
          style={{
            maxHeight: expanded ? `${submenuHeight}px` : "0px",

            opacity: expanded ? 1 : 0,
          }}
        >
          <div ref={submenuRef} className="sidebar-submenu__content">
            {children.map((child, childIndex) => (
              <SidebarChildItem
                key={child?._id || child?.path || `${child?.title}-${childIndex}`}
                child={child}
                currentPath={location.pathname}
                color={color}
                index={childIndex}
                isLast={childIndex === children.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     SINGLE LINK
     ========================================================================== */

  return (
    <NavLink to={item?.path || "#"} end={item?.path === "/"} className="sidebar-single-link" style={sharedStyle}>
      {({ isActive }) => {
        const active = isActive || directActive;

        return (
          <span
            className={`
              sidebar-main-row
              sidebar-main-row--single
              ${color.hover}

              ${
                active
                  ? `
                    ${color.active}
                    ${color.border}
                    sidebar-main-row--active
                  `
                  : `
                    border-transparent
                  `
              }
            `}
          >
            <span className="sidebar-main-row__content">
              <SidebarMenuIcon icon={item?.icon} active={active} color={color} />

              <span
                className={`
                  sidebar-main-row__title

                  ${active ? color.text : "text-gray-800 dark:text-gray-200"}
                `}
              >
                {item?.title || "Untitled"}
              </span>
            </span>

            {active && <span className="sidebar-single-active-dot" />}
          </span>
        );
      }}
    </NavLink>
  );
};

/* ==========================================================================
   PROP TYPES
   ========================================================================== */

SidebarItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    path: PropTypes.string,
    icon: PropTypes.node,

    childrens: PropTypes.arrayOf(PropTypes.object),

    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,

  isOpenState: PropTypes.bool,
  onSubMenuToggle: PropTypes.func,
  index: PropTypes.number,
};

export default SidebarItem;
