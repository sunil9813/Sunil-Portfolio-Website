import { IoHomeOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
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

export const BreadcrumbsComponent = ({ text }) => {
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
      <div className="flex justify-between items-center">
        <Typography variant="h4" className="capitalize">
          {text}
        </Typography>
        <nav className="flex items-center space-x-1 text-sm capitalize">
          {/* Home Link */}
          <Link to="/" className="opacity-60 hover:opacity-100">
            <IoHomeOutline size={20} />
          </Link>

          {/* Previous Page */}
          {previousPage && previousPage !== location.pathname && (
            <div className="opacity-60 hover:opacity-100">
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
  text: PropTypes.string,
};
