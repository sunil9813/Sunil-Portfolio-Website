import PropTypes from "prop-types";
import { Sidebar } from "../sidebar/Sidebar";
import { Header } from "../header/Header";
export const Layout = ({ children }) => {
  return (
    <>
      <>
        <div className="flex">
          <div className="w-[15%]">
            <Sidebar />
          </div>
          <div className="w-[85%] bg-primarybg">
            <Header />
            <main style={{ minHeight: "92vh" }} className="px-8 py-5 w-full">
              {children}
            </main>
          </div>
        </div>
      </>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.any,
};
