import PropTypes from "prop-types";
import { useState } from "react";
import Button from "../TollBar/Button";
import { BsLink45Deg } from "react-icons/bs";
import LinkForm from "./LinkForm";

const InsertLink = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);

  const handleSubmit = (link) => {
    if (!link.url.trim()) return hideForm();

    onSubmit(link);
    hideForm();
  };

  const hideForm = () => setVisible(false);
  const showForm = () => setVisible(true);
  return (
    <>
      <div
        onKeyDown={({ key }) => {
          if (key === "Escape") hideForm();
        }}
        className=" relative"
      >
        <Button onClick={visible ? hideForm : showForm}>
          <BsLink45Deg />
        </Button>

        <div className="absolute top-full right-0 mt-4 z-50">
          <LinkForm visible={visible} onSubmit={handleSubmit} />
        </div>
      </div>
    </>
  );
};
InsertLink.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
export default InsertLink;
