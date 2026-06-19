import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarItem } from "./SidebarItem";
import { menu } from "@/assets/Data";
import { Logo } from "../common/Logo";

export const Sidebar = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const [showScrollbar, setShowScrollbar] = useState(false);

  const contentRef = useRef(null);
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  /*
   * Keeps one parent menu open at a time.
   */
  const handleSubMenuToggle = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  /*
   * Checks whether the navigation area
   * needs vertical scrolling.
   */
  useEffect(() => {
    const navigation = contentRef.current;

    if (!navigation) {
      return undefined;
    }

    const checkOverflow = () => {
      setShowScrollbar(navigation.scrollHeight > navigation.clientHeight);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);

    resizeObserver.observe(navigation);

    window.addEventListener("resize", checkOverflow);

    const timeoutId = window.setTimeout(checkOverflow, 200);

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener("resize", checkOverflow);

      window.clearTimeout(timeoutId);
    };
  }, [openIndex]);

  return (
    <aside className="sidebars">
      {/* ===============================================================
          HEADER
          =============================================================== */}

      <header className="sidebar-header">
        <button type="button" onClick={goHome} className="sidebar-brand" aria-label="Go to home page">
          <span className="sidebar-brand__logo">
            <Logo size="small" />
          </span>

          <span className="sidebar-brand__information">
            <strong>Admin Panel</strong>

            <small>Management dashboard</small>
          </span>

          <span className="sidebar-brand__status" title="System online">
            <span />
          </span>
        </button>
      </header>

      {/* ===============================================================
          NAVIGATION
          =============================================================== */}

      <nav
        ref={contentRef}
        className={`
          sidebar-navigation

          ${showScrollbar ? "sidebar-navigation--scrollable" : ""}
        `}
        aria-label="Admin navigation"
      >
        <div className="sidebar-navigation__heading">
          <span>Main menu</span>

          <span>{menu.length}</span>
        </div>

        <div className="sidebar-navigation__items">
          {menu.map((item, index) => (
            <SidebarItem key={item?._id || item?.path || item?.title || index} item={item} index={index} isOpenState={openIndex === index} onSubMenuToggle={() => handleSubMenuToggle(index)} />
          ))}
        </div>
      </nav>

      {/* ===============================================================
          FOOTER
          =============================================================== */}

      <footer className="sidebar-footer">
        <div className="sidebar-profile">
          <div className="sidebar-profile__avatar">
            U
            <span className="sidebar-profile__online" />
          </div>

          <div className="sidebar-profile__information">
            <p>User Name</p>
            <span>Administrator</span>
          </div>

          <div className="sidebar-profile__role" title="Admin account">
            A
          </div>
        </div>
      </footer>
    </aside>
  );
};

export default Sidebar;
