import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import PropTypes from "prop-types";

const MathFormulaParser = ({ formula, display }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && formula) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode: display,
          throwOnError: false,
        });
      } catch {
        containerRef.current.textContent = formula;
      }
    }
  }, [formula, display]);

  return <span ref={containerRef} />;
};

MathFormulaParser.propTypes = {
  formula: PropTypes.string.isRequired,
  display: PropTypes.bool,
};

MathFormulaParser.defaultProps = {
  display: false,
};

export default MathFormulaParser;
