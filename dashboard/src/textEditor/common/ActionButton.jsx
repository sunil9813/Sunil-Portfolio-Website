import PropTypes from "prop-types";
import { Button } from "@material-tailwind/react";

const ActionButton = ({ disabled, busy = false, title, onClick }) => {
  return (
    /*  <Button className="w-full" onClick={onClick} disabled={disabled}>
      <span>{title}</span>
      {busy && <BiLoader className="animate-spin" size={20} />}
    </Button> */
    <Button className="w-full text-center flex justify-center" onClick={onClick} disabled={disabled} loading={busy ? true : false}>
      <span>{title}</span>
    </Button>
  );
};
// PropTypes for type checking
ActionButton.propTypes = {
  disabled: PropTypes.bool,
  busy: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

// Default props
ActionButton.defaultProps = {
  disabled: false,
  busy: false,
};

export default ActionButton;
