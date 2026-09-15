import { createElement, useEffect, useRef, useState } from "react";
import { motion as Motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { FiCode, FiLayers, FiBookOpen, FiHeart, FiShield, FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const chapters = [
  { title: "Ideas become interfaces.", copy: "Thoughtful screens bring clarity to complex products.", images: [1, 2, 3], badge: "Design with purpose", Icon: FiLayers },
  { title: "Every layer connects.", copy: "Frontend, APIs, and data work together as one experience.", images: [4, 5, 6], badge: "Full-stack craft", Icon: FiCode },
  { title: "Build. Learn. Share.", copy: "Courses, notes, and resources turn knowledge into something useful.", images: [7, 8, 2], badge: "Keep creating", Icon: FiBookOpen },
  { title: "Small details. Real difference.", copy: "Readable content, thoughtful interactions, and responsive layouts make the experience feel complete.", images: [3, 6, 8], badge: "Made for people", Icon: FiHeart },
  { title: "Built to be dependable.", copy: "Clear architecture and careful implementation support every screen you see.", images: [5, 2, 7], badge: "Beyond the interface", Icon: FiShield },
  { title: "Made for what’s next.", copy: "Clear systems leave room for a product to grow and improve.", images: [6, 1, 5], badge: "GORKcoder", Icon: FiArrowUpRight },
];
const values = [
  { title: "Solve real problems", copy: "I start with your goals and the people using your product, then turn the brief into practical features and clear user journeys.", sticker: 1 },
  { title: "Own every layer", copy: "From React interfaces to Node.js APIs and MongoDB, I connect the frontend, backend, and data into one complete web application.", sticker: 5 },
  { title: "Learn and share", copy: "I turn what I learn while building into IT courses, development notes, and resources that help others put ideas into practice.", sticker: 2 },
  { title: "Build for people", copy: "I focus on responsive layouts, accessible interactions, and clear content so people can use your website comfortably across devices.", sticker: 3 },
  { title: "Work together", copy: "I keep you involved through working previews and clear communication, using your feedback to refine the product from first idea to launch.", sticker: 4 },
];

export const PortfolioStory = () => {
  const section = useRef(null);
  const windowRef = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const [travel, setTravel] = useState(0);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  // Brief holds at both ends let the spring settle before the sticky section releases.
  const targetX = useTransform(scrollYProgress, [0, 0.025, 0.975, 1], [0, 0, -travel, -travel]);
  const smoothX = useSpring(targetX, { stiffness: 220, damping: 38, mass: 0.65, restDelta: 0.1 });
  const progress = useTransform(smoothX, value => travel ? Math.min(1, Math.max(0, -value / travel)) : 0);

  useEffect(() => {
    const measure = () => setTravel(Math.max(0, trackRef.current.scrollWidth - windowRef.current.clientWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(windowRef.current);
    observer.observe(trackRef.current);
    measure();
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`portfolio-story${reduced ? " portfolio-story--reduced" : ""}`} aria-label="My approach to building products">
      <div className="portfolio-story__scroll" ref={section} style={{ "--story-travel": `${travel}px` }}>
        <div className="portfolio-story__sticky" ref={windowRef}>
          <Motion.div className="portfolio-story__track" ref={trackRef} style={{ x: reduced ? 0 : smoothX }}>
            {chapters.map(({ title, copy, images, badge, Icon }, index) => (
              <article className={`portfolio-story__chapter portfolio-story__chapter--${index}`} key={title}>
                <div className="portfolio-story__note"><h2>{title}</h2><p>{copy}</p></div>
                <div className="portfolio-story__pictures">
                  {images.map((number, imageIndex) => (
                    <figure key={`${number}-${imageIndex}`} className={`portfolio-story__picture portfolio-story__picture--${imageIndex}`}>
                      <img src={`/image/home/project-collage/ui8-card-0${number}.avif`} alt={`Interface inspiration for ${title.toLowerCase()}`} loading={index < 2 ? "eager" : "lazy"} decoding="async" width="600" height="450" />
                    </figure>
                  ))}
                  <span className="portfolio-story__sticker">{createElement(Icon, { "aria-hidden": true })}{badge}</span>
                </div>
              </article>
            ))}
          </Motion.div>
          <div className="portfolio-story__footer"><span>Interface inspiration · My development approach</span><div className="portfolio-story__progress" aria-hidden="true"><Motion.div style={{ scaleX: progress }} /></div><span>Scroll to explore <FiArrowUpRight aria-hidden="true" /></span></div>
        </div>
      </div>
      <div className="portfolio-story__values container">
        <div className="portfolio-story__intro">
          <h2>How I turn your ideas<br /> into working products.</h2>
          <div className="portfolio-story__principle"><FiCode aria-hidden="true" /><p>From React interfaces<br />to full-stack applications.</p><Link to="/project">Explore my projects <FiArrowUpRight aria-hidden="true" /></Link></div>
        </div>
        <div className="portfolio-story__panels">
          {values.map(({ title, copy, sticker }, index) => (
            <article key={title} className={`portfolio-story__value${active === index ? " is-active" : ""}`}>
              <button type="button" aria-expanded={active === index} aria-controls={`story-value-${index}`} onClick={() => setActive(index)}>
                <span className="portfolio-story__value-title">{title}<span className="portfolio-story__value-toggle" aria-hidden="true">{active === index ? "−" : "+"}</span></span>
                <img className="portfolio-story__value-art" src={`/image/home/values/value-${sticker}.png`} alt="" width="180" height="150" loading="lazy" decoding="async" />
              </button>
              <div id={`story-value-${index}`} className="portfolio-story__value-copy" aria-hidden={active !== index}><div><p>{copy}</p></div></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
