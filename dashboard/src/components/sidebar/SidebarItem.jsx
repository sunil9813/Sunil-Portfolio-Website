import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ChevronRight, Dot } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

/* ==========================================================================
   TREE DIMENSIONS

   These values are shared by the SVG calculations
   and the SidebarTree.scss file.
   ========================================================================== */

const CHILD_ROW_HEIGHT = 34;
const TREE_WIDTH = 44;
const TRUNK_X = 10;
const BRANCH_END_X = 34;
const BRANCH_START_OFFSET = 10;

/* ==========================================================================
   ROUTE HELPERS
   ========================================================================== */

const isRouteActive = (currentPath, targetPath) => {
  if (!targetPath || targetPath === "#") {
    return false;
  }

  if (targetPath === "/") {
    return currentPath === "/";
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
};

const hasBadge = (value) => value !== undefined && value !== null && value !== "";

/* ==========================================================================
   PARENT MENU ICON
   ========================================================================== */

const SidebarMenuIcon = ({ icon, active }) => {
  return (
    <span
      className={`
        sidebar-menu-icon
        ${active ? "sidebar-menu-icon--active" : ""}
      `}
    >
      <span className="sidebar-menu-icon__ambient" />

      <span className="sidebar-menu-icon__content">{icon || <Dot size={22} />}</span>
    </span>
  );
};

SidebarMenuIcon.propTypes = {
  icon: PropTypes.node,
  active: PropTypes.bool,
};

/* ==========================================================================
   PRECISE SVG TREE CONNECTOR
   ========================================================================== */

const SidebarTreeConnector = ({ childCount, activeIndex }) => {
  const treeHeight = childCount * CHILD_ROW_HEIGHT;

  /*
   * The trunk stops where the final branch begins.
   * It does not continue below the final curve.
   */
  const lastChildCenter = (childCount - 1) * CHILD_ROW_HEIGHT + CHILD_ROW_HEIGHT / 2;

  const trunkEnd = lastChildCenter - BRANCH_START_OFFSET;

  const activeChildCenter = activeIndex >= 0 ? activeIndex * CHILD_ROW_HEIGHT + CHILD_ROW_HEIGHT / 2 : 0;

  const activeTrunkEnd = activeIndex >= 0 ? activeChildCenter - BRANCH_START_OFFSET : 0;

  /*
   * Creates one smooth vertical-to-horizontal
   * curved branch for each child.
   */
  const createBranchPath = (childIndex) => {
    const centerY = childIndex * CHILD_ROW_HEIGHT + CHILD_ROW_HEIGHT / 2;

    const branchStartY = centerY - BRANCH_START_OFFSET;

    const curveStartY = centerY - 7;

    const curveEndX = TRUNK_X + 8;

    return `
      M ${TRUNK_X} ${branchStartY}
      V ${curveStartY}
      C ${TRUNK_X} ${centerY - 3.2},
        ${TRUNK_X + 3.2} ${centerY},
        ${curveEndX} ${centerY}
      H ${BRANCH_END_X}
    `;
  };

  const createArrowPath = (childIndex) => {
    const centerY = childIndex * CHILD_ROW_HEIGHT + CHILD_ROW_HEIGHT / 2;

    return `
      M ${BRANCH_END_X - 5} ${centerY - 4.5}
      L ${BRANCH_END_X} ${centerY}
      L ${BRANCH_END_X - 5} ${centerY + 4.5}
    `;
  };

  if (childCount <= 0) {
    return null;
  }

  return (
    <svg
      className="sidebar-submenu__tree"
      width={TREE_WIDTH}
      height={treeHeight}
      viewBox={`0 0 ${TREE_WIDTH} ${treeHeight}`}
      fill="none"
      preserveAspectRatio="xMinYMin meet"
      aria-hidden="true"
      focusable="false"
    >
      {/* Background vertical trunk */}

      <path
        className="sidebar-tree-trunk"
        d={`
          M ${TRUNK_X} 0
          V ${trunkEnd}
        `}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
      />

      {/* Active vertical trunk */}

      {activeIndex >= 0 && (
        <path
          className="sidebar-tree-trunk sidebar-tree-trunk--active"
          d={`
            M ${TRUNK_X} 0
            V ${activeTrunkEnd}
          `}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
      )}

      {/* Child branches and arrows */}

      {Array.from({
        length: childCount,
      }).map((_, childIndex) => {
        const isActive = childIndex === activeIndex;

        return (
          <g
            key={childIndex}
            className={`
              sidebar-tree-item
              ${isActive ? "sidebar-tree-item--active" : ""}
            `}
          >
            <path className="sidebar-tree-branch" d={createBranchPath(childIndex)} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />

            <path className="sidebar-tree-arrow" d={createArrowPath(childIndex)} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
};

SidebarTreeConnector.propTypes = {
  childCount: PropTypes.number.isRequired,

  activeIndex: PropTypes.number.isRequired,
};

/* ==========================================================================
   CHILD MENU ITEM
   ========================================================================== */

const SidebarChildItem = ({ child, currentPath, index, onNavigate }) => {
  const active = isRouteActive(currentPath, child?.path);

  return (
    <NavLink
      to={child?.path || "#"}
      className={`
        sidebar-child-link
        ${active ? "sidebar-child-link--active" : ""}
      `}
      onClick={onNavigate}
      style={{
        "--child-delay": `${index * 34}ms`,
      }}
    >
      <span
        className={`
          sidebar-child-row
          ${active ? "sidebar-child-row--active" : ""}
        `}
      >
        {child?.icon && <span className="sidebar-child-row__icon">{child.icon}</span>}

        <span className="sidebar-child-row__title">{child?.title || "Untitled"}</span>

        {hasBadge(child?.badge) && <span className="sidebar-child-row__badge">{child.badge}</span>}

        {active && <span className="sidebar-child-row__active-dot" aria-hidden="true" />}
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

    badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,

  currentPath: PropTypes.string.isRequired,

  index: PropTypes.number.isRequired,

  onNavigate: PropTypes.func,
};

/* ==========================================================================
   SIDEBAR ITEM
   ========================================================================== */

export const SidebarItem = ({ item, isOpenState = false, forceOpen = false, isCollapsed = false, onSubMenuToggle = () => {}, onRequestExpand = () => {}, onNavigate = () => {} }) => {
  const location = useLocation();

  const submenuRef = useRef(null);

  const [submenuHeight, setSubmenuHeight] = useState(0);

  const children = useMemo(() => {
    if (Array.isArray(item?.childrens)) {
      return item.childrens;
    }

    if (Array.isArray(item?.children)) {
      return item.children;
    }

    return [];
  }, [item?.childrens, item?.children]);

  const hasChildren = children.length > 0;

  const activeChildIndex = children.findIndex((child) => isRouteActive(location.pathname, child?.path));

  const childActive = activeChildIndex >= 0;

  const directActive = isRouteActive(location.pathname, item?.path);

  const itemActive = directActive || childActive;

  const expanded = hasChildren && !isCollapsed && (forceOpen || isOpenState || childActive);

  /* ==========================================================================
     MEASURE SUBMENU HEIGHT
     ========================================================================== */

  useEffect(() => {
    const submenu = submenuRef.current;

    if (!submenu) {
      return undefined;
    }

    const calculateHeight = () => {
      setSubmenuHeight(submenu.scrollHeight);
    };

    calculateHeight();

    let resizeObserver;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(calculateHeight);

      resizeObserver.observe(submenu);
    }

    window.addEventListener("resize", calculateHeight);

    return () => {
      resizeObserver?.disconnect();

      window.removeEventListener("resize", calculateHeight);
    };
  }, [children]);

  const handleParentClick = () => {
    if (isCollapsed) {
      onRequestExpand();
    }

    onSubMenuToggle();
  };

  /* ==========================================================================
     PARENT MENU
     ========================================================================== */

  if (hasChildren) {
    return (
      <div
        className={`
          sidebar-item
          sidebar-parent
          ${expanded ? "sidebar-parent--open" : ""}
          ${itemActive ? "sidebar-parent--active" : ""}
        `}
      >
        <button
          type="button"
          onClick={handleParentClick}
          className={`
            sidebar-main-row
            ${expanded || itemActive ? "sidebar-main-row--active" : ""}
          `}
          aria-expanded={expanded}
          title={isCollapsed ? item?.title || "Untitled" : undefined}
        >
          <span className="sidebar-main-row__content">
            <SidebarMenuIcon icon={item?.icon} active={expanded || itemActive} />

            <span className="sidebar-main-row__title">{item?.title || "Untitled"}</span>
          </span>

          <span className="sidebar-main-row__actions">
            {hasBadge(item?.badge) && <span className="sidebar-main-row__badge">{item.badge}</span>}

            <span
              className={`
                sidebar-parent-arrow
                ${expanded ? "sidebar-parent-arrow--open" : ""}
              `}
              aria-hidden="true"
            >
              <ChevronRight size={14} strokeWidth={2} />
            </span>
          </span>
        </button>

        <div
          className="sidebar-submenu"
          style={{
            maxHeight: expanded ? `${submenuHeight}px` : "0px",

            opacity: expanded ? 1 : 0,
          }}
        >
          <div ref={submenuRef} className="sidebar-submenu__content">
            <SidebarTreeConnector childCount={children.length} activeIndex={activeChildIndex} />

            <div className="sidebar-submenu__links">
              {children.map((child, childIndex) => (
                <SidebarChildItem key={child?._id || child?.path || `${child?.title}-${childIndex}`} child={child} currentPath={location.pathname} index={childIndex} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     SINGLE MENU LINK
     ========================================================================== */

  return (
    <NavLink to={item?.path || "#"} end={item?.path === "/"} className="sidebar-single-link" onClick={onNavigate} title={isCollapsed ? item?.title || "Untitled" : undefined}>
      {({ isActive }) => {
        const active = isActive || directActive;

        return (
          <span
            className={`
              sidebar-main-row
              sidebar-main-row--single
              ${active ? "sidebar-main-row--active" : ""}
            `}
          >
            <span className="sidebar-main-row__content">
              <SidebarMenuIcon icon={item?.icon} active={active} />

              <span className="sidebar-main-row__title">{item?.title || "Untitled"}</span>
            </span>

            <span className="sidebar-main-row__actions">
              {hasBadge(item?.badge) && <span className="sidebar-main-row__badge">{item.badge}</span>}

              {active && <span className="sidebar-single-active-dot" aria-hidden="true" />}
            </span>
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

    badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    childrens: PropTypes.arrayOf(PropTypes.object),

    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,

  isOpenState: PropTypes.bool,

  forceOpen: PropTypes.bool,

  isCollapsed: PropTypes.bool,

  onSubMenuToggle: PropTypes.func,

  onRequestExpand: PropTypes.func,

  onNavigate: PropTypes.func,
};

export default SidebarItem;
