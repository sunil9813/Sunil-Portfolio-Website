import PropTypes from "prop-types";
import { Header } from "../../router";
import { Footer } from "./Footer";

export const Layout = ({ children }) => {
  return (
    <main style={{ height: "150vh" }}>
      <Header />
      <div>{children}</div>
      <Footer />
    </main>
  );
};

Layout.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string,
};
