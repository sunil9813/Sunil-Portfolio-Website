import PropTypes from "prop-types";
import { BsCheck } from "react-icons/bs";

const CheckMark = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="bg-indigo-500 p-2 text-white rounded-full bg-opacity-70 backdrop-blur-lg">
      <BsCheck />
    </div>
  );
};

// PropTypes for type checking
CheckMark.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default CheckMark;
