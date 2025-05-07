import { IoHomeOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const pathNames = {
  "": "Dashboard",
  "all-user": "User List",
  "create-user": "Create User",
  "all-category": "Category List",
  "create-category": "create Category",
  "update-category": "Update Category",
  contact: "Contact Us",
  products: "Our Products",
  dashboard: "User Dashboard",
  settings: "Account Settings",
};

export const BreadcrumbsComponent = ({ currentPage, space }) => {
  const location = useLocation();
  const [previousPage, setPreviousPage] = useState(null);

  useEffect(() => {
    const prevPage = sessionStorage.getItem("previousPage");
    setPreviousPage(prevPage);

    // Update previous page in sessionStorage when location changes
    sessionStorage.setItem("previousPage", location.pathname);
  }, [location.pathname]);

  const paths = location.pathname.split("/").filter((path) => path !== "");

  return (
    <>
      <div className="flexbC relative">
        <h2 className="capitalize text-xl 3xl:text-2xl font-semibold textColor">{currentPage}</h2>
        <nav className={`flex items-center space-x-1 text-xs 3xl:text-sm capitalize ${space ? "pr-44" : ""}`}>
          {/* Home Link */}
          <Link to="/" className="opacity-60 dark:opacity-80 hover:opacity-100">
            <IoHomeOutline size={15} />
          </Link>

          {/* Previous Page */}
          {previousPage && previousPage !== location.pathname && (
            <div className="opacity-60  dark:opacity-80 hover:opacity-100">
              <span className="px-2"> / </span>
              <Link to={previousPage}>{pathNames[previousPage.replace("/", "")] || decodeURIComponent(previousPage)}</Link>
            </div>
          )}

          {/* Current Page */}
          {paths.length > 0 && (
            <>
              <span className="px-2"> / </span>
              <span className="opacity-100">{pathNames[paths[paths.length - 1]] || decodeURIComponent(paths[paths.length - 1])}</span>
            </>
          )}
        </nav>
      </div>
    </>
  );
};
BreadcrumbsComponent.propTypes = {
  currentPage: PropTypes.string,
  space: PropTypes.bool,
};
