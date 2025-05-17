import PropTypes from "prop-types";
import { Sidebar } from "../sidebar/Sidebar";
import { Header } from "../header/Header";
import { useSelector } from "react-redux";
import { selectTheme } from "@/redux/slices/themeSlice";

export const Layout = ({ children, title }) => {
  const theme = useSelector(selectTheme);

  return (
    <main className={`app-wrapper ${theme === "dark" ? "dark" : "light"}`}>
      <section className="flex bg-light-surface1 dark:bg-dark-surface1">
        <div className="w-[15%]">
          <Sidebar />
        </div>
        <div className="w-[85%] px-6">
          <Header title={title} />
          <div style={{ minHeight: "92vh" }} className="w-full text-black dark:text-textcolor">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
};
export const LayoutWithOutHeader = ({ children }) => {
  const theme = useSelector(selectTheme);

  return (
    <main className={`app-wrapper ${theme === "dark" ? "dark" : "light"}`}>
      <section className="flex bg-light-surface1 dark:bg-dark-surface1">
        <div className="w-[15%]">
          <Sidebar />
        </div>
        <div className="w-[85%] px-6">
          <div style={{ minHeight: "92vh" }} className="w-full text-black dark:text-textcolor">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
};

Layout.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string,
};
LayoutWithOutHeader.propTypes = {
  children: PropTypes.any,
};
