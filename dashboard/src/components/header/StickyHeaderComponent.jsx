import { StickyHeader } from "../customeUI/Wrapper";
import { HeadingTwo } from "../customeUI/Title";
import { GhostButton, TertiaryButton } from "../customeUI/Button";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export const StickyHeaderComponent = ({ title, path, handleFunction, btntext }) => {
  const navigate = useNavigate();
  return (
    <>
      <StickyHeader>
        <HeadingTwo>{title}</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton onClick={() => navigate(path)}>Cancel</GhostButton>
          <TertiaryButton onClick={handleFunction}>{btntext}</TertiaryButton>
        </div>
      </StickyHeader>
    </>
  );
};
StickyHeaderComponent.propTypes = {
  title: PropTypes.string,
  btntext: PropTypes.string,
  path: PropTypes.string,
  handleFunction: PropTypes.any,
};
