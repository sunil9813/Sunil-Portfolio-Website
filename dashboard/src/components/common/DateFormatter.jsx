import dayjs from "dayjs";
import PropTypes from "prop-types";

export const DateFormatter = ({ date }) => {
  if (!date) {
    return <span>No valid date</span>;
  }

  return <span>{dayjs(date).format("D MMM YYYY")}</span>;
};

DateFormatter.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
};
