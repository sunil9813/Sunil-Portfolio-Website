import PropTypes from "prop-types";
import { motion as Motion, useScroll, useTransform } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { FiCalendar, FiCheckCircle, FiLayers } from "react-icons/fi";

export const Timeline = ({ data }) => {
  const timelineRef = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!timelineRef.current) return undefined;
    const updateHeight = () => setHeight(timelineRef.current?.getBoundingClientRect().height || 0);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(timelineRef.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 75%", "end 45%"] });
  const progressHeight = useTransform(scrollYProgress, [0, 1], [0, height]);
  const progressOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);

  return (
    <div className="gh-activity relative" ref={containerRef}>
      <div ref={timelineRef} className="gh-activity__feed">
        {data.map((item, index) => {
          const year = item.title.match(/\d{4}/)?.[0] || index;
          const isCurrent = item.title.includes("Present");

          return (
            <Motion.article
              id={`experience-${year}-${index}`}
              key={`${item.title}-${item.subtitle}`}
              className="gh-activity__entry"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.18), ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="gh-activity__node" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
              <div className="gh-activity__event-label"><FiCalendar /><span>Career chapter</span><time>{item.title}</time></div>
              <div className="gh-activity__commit-card">
                <header>
                  <div className="gh-activity__chapter"><span>Chapter</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
                  <span className="gh-activity__visibility">Professional experience</span>
                </header>
                <div className="gh-activity__commit-main">
                  <div>
                    <h3>{item.subtitle}</h3>
                    <p className="gh-activity__role">{item.role}</p>
                  </div>
                  <div className={`gh-activity__verified ${isCurrent ? "is-current" : ""}`}><FiCheckCircle /> {isCurrent ? "Current" : "Completed"}</div>
                </div>
                <div className="gh-activity__details">{item.content}</div>
                <footer>
                  <span><FiLayers /> Product development</span>
                  <span>{item.icon} Hands-on experience</span>
                </footer>
              </div>
            </Motion.article>
          );
        })}

        <div className="gh-activity__rail" style={{ height: `${height}px` }} aria-hidden="true">
          <Motion.div className="gh-activity__rail-progress" style={{ height: progressHeight, opacity: progressOpacity }} />
        </div>
      </div>
    </div>
  );
};

Timeline.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({ icon: PropTypes.node, title: PropTypes.string, subtitle: PropTypes.string, role: PropTypes.string, content: PropTypes.node }),
  ).isRequired,
};
