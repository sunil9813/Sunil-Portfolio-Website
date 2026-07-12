import { useCallback, useEffect, useMemo, useRef, useState, useId } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Command, PanelLeftClose, PanelLeftOpen, Search, ShieldCheck, X } from "lucide-react";

import { menu } from "@/assets/Data";
import { SidebarItem } from "./SidebarItem";

/* ==========================================================================
   HELPERS
   ========================================================================== */

const getChildren = (item) => {
  if (Array.isArray(item?.childrens)) {
    return item.childrens;
  }

  if (Array.isArray(item?.children)) {
    return item.children;
  }

  return [];
};

const getChildrenKey = (item) => {
  if (Array.isArray(item?.childrens)) {
    return "childrens";
  }

  return "children";
};

/* ==========================================================================
   SIDEBAR
   ========================================================================== */

export const Sidebar = ({ isMobileOpen = false, onClose = () => {}, isCollapsed = false, onCollapsedChange = () => {} }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollbar, setShowScrollbar] = useState(false);

  const contentRef = useRef(null);
  const searchInputRef = useRef(null);

  const navigate = useNavigate();

  /* --------------------------------------------------------------------------
     FILTERED NAVIGATION
     -------------------------------------------------------------------------- */

  const visibleMenu = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return menu
      .map((item, originalIndex) => {
        if (!normalizedQuery) {
          return {
            item,
            originalIndex,
          };
        }

        const parentTitle = String(item?.title || "").toLowerCase();

        const children = getChildren(item);

        const parentMatches = parentTitle.includes(normalizedQuery);

        const matchingChildren = parentMatches
          ? children
          : children.filter((child) =>
              String(child?.title || "")
                .toLowerCase()
                .includes(normalizedQuery),
            );

        if (!parentMatches && matchingChildren.length === 0) {
          return null;
        }

        const childrenKey = getChildrenKey(item);

        return {
          originalIndex,

          item:
            children.length > 0
              ? {
                  ...item,
                  [childrenKey]: matchingChildren,
                }
              : item,
        };
      })
      .filter(Boolean);
  }, [searchQuery]);

  /* --------------------------------------------------------------------------
     HANDLERS
     -------------------------------------------------------------------------- */

  const goHome = () => {
    navigate("/");
    onClose();
  };

  const handleSubMenuToggle = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  const expandAndFocusSearch = useCallback(() => {
    if (isCollapsed) {
      onCollapsedChange(false);
    }

    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 180);
  }, [isCollapsed, onCollapsedChange]);

  /* --------------------------------------------------------------------------
     KEYBOARD SEARCH
     -------------------------------------------------------------------------- */

  useEffect(() => {
    const handleKeyboardShortcut = (event) => {
      const isSearchShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (!isSearchShortcut) {
        return;
      }

      event.preventDefault();
      expandAndFocusSearch();
    };

    window.addEventListener("keydown", handleKeyboardShortcut);

    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [expandAndFocusSearch]);

  /* --------------------------------------------------------------------------
     COLLAPSED MODE
     -------------------------------------------------------------------------- */

  useEffect(() => {
    if (isCollapsed) {
      setOpenIndex(null);
    }
  }, [isCollapsed]);

  /* --------------------------------------------------------------------------
     SCROLLBAR DETECTION
     -------------------------------------------------------------------------- */

  useEffect(() => {
    const navigation = contentRef.current;

    if (!navigation) {
      return undefined;
    }

    const checkOverflow = () => {
      setShowScrollbar(navigation.scrollHeight > navigation.clientHeight);
    };

    checkOverflow();

    let resizeObserver;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(checkOverflow);

      resizeObserver.observe(navigation);
    }

    window.addEventListener("resize", checkOverflow);

    const timeoutId = window.setTimeout(checkOverflow, 250);

    return () => {
      resizeObserver?.disconnect();

      window.removeEventListener("resize", checkOverflow);

      window.clearTimeout(timeoutId);
    };
  }, [openIndex, searchQuery, isCollapsed, visibleMenu.length]);

  return (
    <aside
      id="admin-sidebar"
      className={`
        sidebars
        ${isCollapsed ? "sidebars--collapsed" : ""}
        ${isMobileOpen ? "sidebars--mobile-open" : ""}
      `}
      aria-label="Administration sidebar"
    >
      <span className="sidebar-ambient sidebar-ambient--top" aria-hidden="true" />

      <span className="sidebar-ambient sidebar-ambient--bottom" aria-hidden="true" />

      {/* ================================================================
          HEADER
          ================================================================ */}

      <header className="sidebar-header">
        <button type="button" className="sidebar-mobile-close" onClick={onClose} aria-label="Close navigation">
          <X size={16} strokeWidth={2} />
        </button>

        <button type="button" onClick={goHome} className="sidebar-brand" aria-label="Go to dashboard home" title={isCollapsed ? "Admin dashboard" : undefined}>
          <span className="sidebar-brand__logo">
            <SidebarLogo size={42} title="Admin Panel" />
          </span>

          <span className="sidebar-brand__copy">
            <span className="sidebar-brand__name">Admin Panel</span>

            <span className="sidebar-brand__description">Management workspace</span>
          </span>
        </button>

        <button
          type="button"
          className="sidebar-collapse-button"
          onClick={() => onCollapsedChange(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen size={15} strokeWidth={1.9} /> : <PanelLeftClose size={15} strokeWidth={1.9} />}
        </button>
      </header>

      {/* ================================================================
          SEARCH
          ================================================================ */}

      <div className="sidebar-search">
        {isCollapsed ? (
          <button type="button" className="sidebar-search__collapsed-button" onClick={expandAndFocusSearch} aria-label="Search navigation" title="Search navigation">
            <Search size={17} strokeWidth={1.9} />
          </button>
        ) : (
          <div className="sidebar-search__field">
            <Search className="sidebar-search__icon" size={15} strokeWidth={1.9} />

            <input ref={searchInputRef} type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search navigation..." aria-label="Search navigation" />

            {searchQuery ? (
              <button
                type="button"
                className="sidebar-search__clear"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <X size={13} strokeWidth={2} />
              </button>
            ) : (
              <span className="sidebar-search__shortcut">
                <Command size={9} />
                <span>K</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ================================================================
          NAVIGATION
          ================================================================ */}

      <nav
        ref={contentRef}
        className={`
          sidebar-navigation
          ${showScrollbar ? "sidebar-navigation--scrollable" : ""}
        `}
        aria-label="Admin navigation"
      >
        <div className="sidebar-navigation__heading">
          <span>Navigation</span>

          <span>{searchQuery ? visibleMenu.length : menu.length}</span>
        </div>

        <div className="sidebar-navigation__items">
          {visibleMenu.map(({ item, originalIndex }) => (
            <SidebarItem
              key={item?._id || item?.path || item?.title || originalIndex}
              item={item}
              isCollapsed={isCollapsed}
              forceOpen={Boolean(searchQuery.trim())}
              isOpenState={openIndex === originalIndex}
              onSubMenuToggle={() => handleSubMenuToggle(originalIndex)}
              onRequestExpand={() => onCollapsedChange(false)}
              onNavigate={onClose}
            />
          ))}

          {visibleMenu.length === 0 && (
            <div className="sidebar-empty-state">
              <span className="sidebar-empty-state__icon">
                <Search size={18} />
              </span>

              <strong>No menu found</strong>

              <p>Try another navigation keyword.</p>

              <button type="button" onClick={() => setSearchQuery("")}>
                Clear search
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ================================================================
          FOOTER
          ================================================================ */}

      <footer className="sidebar-footer">
        <div className="sidebar-profile" title={isCollapsed ? "User Name — Administrator" : undefined}>
          <div className="sidebar-profile__avatar">
            <span>U</span>

            <span className="sidebar-profile__online" />
          </div>

          <div className="sidebar-profile__information">
            <p>User Name</p>

            <span>Administrator</span>
          </div>

          <div className="sidebar-profile__role" title="Administrator account">
            <ShieldCheck size={15} strokeWidth={1.9} />
          </div>
        </div>

        <div className="sidebar-footer__meta">
          <span>
            <ShieldCheck size={11} strokeWidth={1.9} />
            Secure session
          </span>

          <span>v2.4.0</span>
        </div>
      </footer>
    </aside>
  );
};

Sidebar.propTypes = {
  isMobileOpen: PropTypes.bool,
  onClose: PropTypes.func,
  isCollapsed: PropTypes.bool,
  onCollapsedChange: PropTypes.func,
};

const SidebarLogo = ({ size = 42, className = "", title = "Admin Panel" }) => {
  const generatedId = useId().replace(/:/g, "");

  const titleId = `sidebar-logo-title-${generatedId}`;
  const backgroundId = `sidebar-logo-background-${generatedId}`;
  const borderId = `sidebar-logo-border-${generatedId}`;
  const frameId = `sidebar-logo-frame-${generatedId}`;
  const symbolId = `sidebar-logo-symbol-${generatedId}`;
  const glowId = `sidebar-logo-glow-${generatedId}`;
  const ambientId = `sidebar-logo-ambient-${generatedId}`;

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby={titleId} focusable="false">
      <title id={titleId}>{title}</title>

      <defs>
        <linearGradient id={backgroundId} x1="6" y1="4" x2="42" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#343840" />
          <stop offset="0.42" stopColor="#202329" />
          <stop offset="1" stopColor="#101216" />
        </linearGradient>

        <linearGradient id={borderId} x1="7" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.32" />
          <stop offset="0.48" stopColor="white" stopOpacity="0.09" />
          <stop offset="1" stopColor="white" stopOpacity="0.03" />
        </linearGradient>

        <linearGradient id={frameId} x1="13" y1="12" x2="36" y2="37" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.94" />
          <stop offset="0.5" stopColor="#D7DAE0" stopOpacity="0.72" />
          <stop offset="1" stopColor="#8E949E" stopOpacity="0.46" />
        </linearGradient>

        <linearGradient id={symbolId} x1="19" y1="18" x2="30" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#E4E6EA" />
          <stop offset="1" stopColor="#AEB3BB" />
        </linearGradient>

        <radialGradient id={ambientId} cx="0" cy="0" r="1" gradientTransform="translate(14 10) rotate(48) scale(28)" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.16" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>

        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="0" stdDeviation="1.6" floodColor="white" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Main background */}

      <rect x="1.5" y="1.5" width="45" height="45" rx="14.5" fill={`url(#${backgroundId})`} />

      {/* Subtle ambient lighting */}

      <rect x="2" y="2" width="44" height="44" rx="14" fill={`url(#${ambientId})`} />

      {/* Premium border */}

      <rect x="2" y="2" width="44" height="44" rx="14" stroke={`url(#${borderId})`} strokeWidth="1" />

      {/* Inner inset border */}

      <rect x="5.5" y="5.5" width="37" height="37" rx="11.5" stroke="white" strokeOpacity="0.045" />

      {/* Four command-frame corners */}

      <g stroke={`url(#${frameId})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${glowId})`}>
        <path d="M14 21V17.5C14 15.57 15.57 14 17.5 14H21" />
        <path d="M27 14H30.5C32.43 14 34 15.57 34 17.5V21" />
        <path d="M34 27V30.5C34 32.43 32.43 34 30.5 34H27" />
        <path d="M21 34H17.5C15.57 34 14 32.43 14 30.5V27" />
      </g>

      {/* Central diamond */}

      <path d="M24 17.8L30.2 24L24 30.2L17.8 24L24 17.8Z" fill="#101216" stroke="white" strokeOpacity="0.16" strokeWidth="1" />

      {/* Stylised A monogram */}

      <g stroke={`url(#${symbolId})`} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${glowId})`}>
        <path d="M20.7 27.2L24 20.7L27.3 27.2" />
        <path d="M22.05 24.8H25.95" />
      </g>

      {/* Small system nodes */}

      <circle cx="11.4" cy="24" r="1.15" fill="white" fillOpacity="0.46" />

      <circle cx="36.6" cy="24" r="1.15" fill="white" fillOpacity="0.46" />

      <circle cx="24" cy="11.4" r="1.05" fill="white" fillOpacity="0.34" />

      {/* Highlight */}

      <path d="M8.5 15C10.6 9.7 15.7 6.2 21.4 5.8" stroke="white" strokeOpacity="0.08" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};

SidebarLogo.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  title: PropTypes.string,
};

export default Sidebar;
