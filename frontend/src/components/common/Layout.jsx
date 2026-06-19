import PropTypes from "prop-types";
import { Header } from "../../router";
import { Footer } from "./Footer";
import { ScrollRestoration } from "react-router";

export const Layout = ({ children }) => {
  return (
    <>
      <ScrollRestoration />
      <main>
        <Header />
        <div>{children}</div>
        <Footer />
      </main>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.any,
};
