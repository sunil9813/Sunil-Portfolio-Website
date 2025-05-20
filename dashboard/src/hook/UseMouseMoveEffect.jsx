import { useEffect } from "react";

export const UseMouseMoveEffect = (containerId) => {
  useEffect(() => {
    const container = document.getElementById(containerId);
    const handleMouseMove = (e) => {
      const cardElements = document.getElementsByClassName("inputcard");

      for (const card of cardElements) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    // Add mousemove event listener for the container
    if (container) {
      container.onmousemove = handleMouseMove;
    }

    // Cleanup on unmount
    return () => {
      if (container) {
        container.onmousemove = null;
      }
    };
  }, [containerId]);
};
