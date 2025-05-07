import { useEffect, useState, useRef } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import PropType from "prop-types";

const activeLink = ({ isActive }) => (isActive ? "active" : "link");
const activeSublink = ({ isActive }) => (isActive ? "active" : "link");

export const SidebarItem = ({ item, isOpenState, onSubMenuToggle }) => {
  const [expandMenu, setExpandMenu] = useState(isOpenState);
  const [lineHeight, setLineHeight] = useState(0);
  const menuContentRef = useRef(null);
  const location = useLocation();

  // Check if any child path matches the current location
  const isAnyChildActive = item.childrens?.some((child) => location.pathname === child.path);

  useEffect(() => {
    if (expandMenu && menuContentRef.current) {
      setLineHeight(menuContentRef.current.scrollHeight); // Dynamically set submenu height
    }
  }, [expandMenu]);

  useEffect(() => {
    setExpandMenu(isOpenState || isAnyChildActive); // Open submenu if child is active
  }, [isOpenState, isAnyChildActive]);

  if (item.childrens) {
    return (
      <div className={`sidebar-item capitalize s-parent ${expandMenu ? "open" : ""}`}>
        <div className="sidebar-title" onClick={onSubMenuToggle}>
          <span className="cursor-pointer">
            {item.icon && <div className="icon">{item.icon}</div>}
            {/* this nav list parent */}
            <div className="title xl:text-xs">{item.title}</div>
          </span>
          <MdKeyboardArrowRight size={20} className={`arrow-icon ${expandMenu ? "rotate" : ""}`} />
        </div>
        <div
          ref={menuContentRef}
          className="sidebar-content"
          style={{
            maxHeight: expandMenu ? `${lineHeight}px` : "0",
            opacity: expandMenu ? 1 : 0,
          }}
        >
          {item.childrens.map((child, index) => {
            return (
              // this is dropdown nav
              <div key={index} className="s-child">
                <NavLink to={child.path} className={activeSublink}>
                  <div className="sidebar-item">
                    <div className="sidebar-title">
                      <span>{<div className="title xl:text-xs">{child.title}</div>}</span>
                    </div>
                  </div>
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <NavLink to={item.path} className={activeLink}>
        <div className="sidebar-item">
          <div className="sidebar-title">
            <span>
              {item.icon && <div className="icon">{item.icon}</div>}
              <div className="title  xl:text-sm">{item.title}</div>
            </span>
          </div>
        </div>
      </NavLink>
    );
  }
};

SidebarItem.propTypes = {
  item: PropType.any,
  isOpenState: PropType.bool,
  onSubMenuToggle: PropType.func,
};
