import { useState } from "react";
import PropTypes from "prop-types";
import { Menu } from "lucide-react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { Sidebar } from "../sidebar/Sidebar";
import { Header } from "../header/Header";
import { selectTheme } from "@/redux/slices/themeSlice";

const DashboardLayoutFrame = ({ children, title = "", showHeader = true }) => {
  const theme = useSelector(selectTheme);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <main className={`app-wrapper admin-layout ${theme === "dark" ? "dark" : "light"} ${isSidebarCollapsed ? "admin-layout--collapsed" : ""}`}>
      <button type="button" className="admin-layout__mobile-trigger" onClick={() => setIsMobileSidebarOpen(true)} aria-label="Open navigation">
        <Menu size={19} strokeWidth={1.9} />
        <span>Menu</span>
      </button>

      <Sidebar isMobileOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} isCollapsed={isSidebarCollapsed} onCollapsedChange={setIsSidebarCollapsed} />

      <button
        type="button"
        className={`admin-layout__sidebar-overlay ${isMobileSidebarOpen ? "admin-layout__sidebar-overlay--visible" : ""}`}
        onClick={() => setIsMobileSidebarOpen(false)}
        aria-label="Close navigation"
      />

      <section className="admin-layout__content">
        <span className="admin-layout__content-glow" aria-hidden="true" />

        <div className="admin-layout__content-inner">
          {showHeader && <Header title={title} />}
          <div className="admin-layout__page">{children || <Outlet />}</div>
        </div>
      </section>
    </main>
  );
};

export const Layout = ({ children, title = "" }) => (
  <DashboardLayoutFrame title={title} showHeader>
    {children || <Outlet />}
  </DashboardLayoutFrame>
);

export const DashboardLayoutWithOutHeader = ({ children, title = "" }) => (
  <DashboardLayoutFrame title={title} showHeader={false}>
    {children || <Outlet />}
  </DashboardLayoutFrame>
);

export const LayoutWithOutHeader = ({ children }) => {
  const theme = useSelector(selectTheme);

  return <main className={`app-wrapper min-h-screen bg-[#050505] text-white ${theme === "dark" ? "dark" : "light"}`}>{children || <Outlet />}</main>;
};

DashboardLayoutFrame.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  showHeader: PropTypes.bool,
};

Layout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

DashboardLayoutWithOutHeader.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

LayoutWithOutHeader.propTypes = {
  children: PropTypes.node,
};
