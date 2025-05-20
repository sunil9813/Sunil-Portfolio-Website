import PropTypes from "prop-types";
import { useEffect } from "react";

export const GradientWrapper = ({ children, className = "" }) => {
  return (
    <>
      <div className={`center-box custom-border ${className}`}>
        <div className="animated-border-box-glow"></div>
        <div className="animated-border-box">{children}</div>
      </div>
    </>
  );
};
export const InputCard = ({ children, className }) => {
  return (
    <div className="inputcard">
      <div className="inputcard__background">
        <div className="inputcard__background-glow"></div>
      </div>
      <div className="inputcard__glow"></div>
      <div className={`${className} inputcard__content`}>{children}</div>
    </div>
  );
};

export const GlitterCards = ({ children }) => {
  useEffect(() => {
    // Set initial body size
    document.body.style.setProperty("--dw", `${document.body.clientWidth}px`);
    document.body.style.setProperty("--dh", `${document.body.clientHeight}px`);

    // Handle pointer movement on the body
    const handlePointerMove = (e) => {
      const cards = document.getElementsByClassName("glitter-card");

      Array.from(cards).forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update mouse position
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

        const BOX = card.getBoundingClientRect();
        const POINT = { x, y };
        const RATIO = { x: POINT.x / BOX.width, y: POINT.y / BOX.height };

        // Update ratio for CSS variables
        card.style.setProperty("--ratio-x", RATIO.x);
        card.style.setProperty("--ratio-y", RATIO.y);
      });
    };

    const glitterCardsContainer = document.getElementById("glitter-cards");

    // Check if the element exists before adding the event listener
    if (glitterCardsContainer) {
      glitterCardsContainer.addEventListener("pointermove", handlePointerMove);
    }

    // Clean up the event listener
    return () => {
      if (glitterCardsContainer) {
        glitterCardsContainer.removeEventListener("pointermove", handlePointerMove);
      }
    };
  }, []);

  return (
    <>
      <div id="glitter-cards" className="glitter-cards grid grid-cols-4 gap-3 p-4">
        {children}
      </div>
    </>
  );
};

export const Card = () => {
  // Mouse move event handler
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="cards" onMouseMove={handleMouseMove}>
      <div className="card">
        <div className="card__background">
          <div className="card__background-glow"></div>
        </div>

        <div className="card__contents">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde accusantium voluptas libero dolores officia maxime at necessitatibus quaerat ullam repellendus sequi vitae odit alias hic,
            doloribus id error nihil provident.
          </p>
        </div>
      </div>
    </div>
  );
};
GlitterCards.propTypes = {
  children: PropTypes.any,
};
InputCard.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
};
GradientWrapper.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
};
