import { createElement, useEffect, useRef, useState } from "react";
import { motion as Motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { FiCode, FiLayers, FiBookOpen, FiHeart, FiShield, FiArrowUpRight, FiPlus, FiMinus } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./ScrollStories.scss";
import "./PortfolioStoryRefinements.scss";
import { phaseColors } from './phaseColors';

const chapters = [
  { title: "Ideas become interfaces.", copy: "Thoughtful screens bring clarity to complex products.", images: [2, 1, 13, 5], badge: "Design with purpose", Icon: FiLayers },
  { title: "Every layer connects.", copy: "Frontend, APIs, and data work together as one experience.", images: [3, 4], badge: "Full-stack craft", Icon: FiCode },
  { title: "Build. Learn. Share.", copy: "Courses, notes, and resources turn knowledge into something useful.", images: [9, 8, 10], badge: "Keep creating", Icon: FiBookOpen },
  { title: "Small details. Real difference.", copy: "Readable content, thoughtful interactions, and responsive layouts make the experience feel complete.", images: [6, 11], badge: "Made for people", Icon: FiHeart },
  { title: "Built to be dependable.", copy: "Clear architecture and careful implementation support every screen you see.", images: [12], badge: "Beyond the interface", Icon: FiShield },
  { title: "Made for what’s next.", copy: "Clear systems leave room for a product to grow and improve.", images: [13, 14, 15, 16], badge: "GORKcoder", Icon: FiArrowUpRight },
];
// Frame boxes follow the reference's changing group sizes, not a repeated card grid.
// Each box is left / top / width / height / rotation, in percentages and degrees.
const arrangements = [
  { note: [43, 0, 43], seal: [60, 73], frames: [[3,18,27,60,-4],[30,28,39,39,8],[16,62,40,32,-5],[65,44,27,49,2]] },
  { note: [12,77,55], seal: [59,53], frames: [[9,14,34,58,-3],[39,8,48,45,11]] },
  { note: [48,2,44], seal: [70,74], frames: [[8,7,29,61,-7],[1,62,43,29,3],[39,39,33,53,12]] },
  { note: [4,4,44], seal: [62,13], frames: [[5,43,54,42,-8],[57,27,32,65,4]] },
  { note: [23,77,58], seal: [23,3], frames: [[14,19,70,52,-5]] },
  { note: [2,3,40], seal: [69,76], frames: [[44,8,36,36,4],[8,34,39,41,-8],[47,48,42,35,3],[20,65,35,30,4]] },
];
const boxStyle = ([left, top, width = 100, height = 100, rotation = 0]) => ({
  '--frame-left': `${left}%`, '--frame-top': `${top}%`, '--frame-width': `${width}%`,
  '--frame-height': `${height}%`, '--frame-rotation': `${rotation}deg`,
});
const storyArt = [
  { file: 'nocta-landing.webp', name: 'Nocta responsive developer-tool interfaces', label: 'Responsive interfaces', zoom: 1.36, width: 1520, height: 1148 },
  { file: 'nocta-dashboard.webp', name: 'Nocta desktop and mobile developer dashboard', label: 'Developer dashboard', zoom: 1.38, width: 1520, height: 1148 },
  { file: 'crm-4.webp', name: 'Salestra connected CRM dashboards', label: 'Connected screens', zoom: 1.24, height: 1057 },
  { file: 'creative-5.webp', name: 'Motif project brief workspace', label: 'Project workspace', zoom: 1.25, height: 1058 },
  { file: 'nocta-auth.webp', name: 'Nocta authentication and account interfaces', label: 'Account flows', zoom: 1.36, focus: '30% 100%', width: 1520, height: 1148 },
  { file: 'nocta-system.webp', name: 'Nocta typography and reusable component system', label: 'Reusable components', zoom: 1.36, width: 1520, height: 1148 },
  { file: 'creative-5.webp', name: 'Motif creative project workspace', label: 'Creative workspace', zoom: 1.25, height: 1058 },
  { file: 'learning-6.webp', name: 'Mindflow learning management screens', label: 'Learning experiences', zoom: 1, focus: '50% 50%', height: 1058 },
  { file: 'learning-4.webp', name: 'Mindflow course catalog', label: 'Course discovery', zoom: 1, focus: '45% 65%', height: 1058 },
  { file: 'learning-5.webp', name: 'Mindflow course lesson experience', label: 'Lesson experience', zoom: 1, focus: '50% 60%', height: 1058 },
  { file: 'creative-6.webp', name: 'Motif reusable brand system', label: 'Consistent visual language', zoom: 1.25, height: 1057 },
  { file: 'crm-5.webp', name: 'Salestra management dashboard', label: 'Information architecture', zoom: 1.26, height: 1057 },
  { file: 'nocta-app.webp', name: 'Nocta projects, analytics and team application screens', label: 'Application screens', zoom: 1.36, width: 1520, height: 1148 },
  { file: 'creative-2.webp', name: 'Motif campaign management workspace', label: 'Campaign workspace', zoom: 1.2, height: 1058 },
  { file: 'crm-3.webp', name: 'Salestra light and dark dashboard layouts', label: 'Adaptable systems', zoom: 1.2, height: 1057 },
  { file: 'creative-3.webp', name: 'Motif creative editor', label: 'Creative tools', zoom: 1.2, height: 1058 },
];
const valueArtwork = {
  search: 1,
  architecture: 5,
  interface: 2,
  design: 3,
  support: 4,
};
const values = [
  { title: "Solve real problems", copy: "I start with your goals and the people using your product, then turn the brief into practical features and clear user journeys.", art: "search" },
  { title: "Own every layer", copy: "From React interfaces to Node.js APIs and MongoDB, I connect the frontend, backend, and data into one complete web application.", art: "architecture" },
  { title: "Learn and share", copy: "I turn what I learn while building into IT courses, development notes, and resources that help others put ideas into practice.", art: "interface" },
  { title: "Build for people", copy: "I focus on responsive layouts, accessible interactions, and clear content so people can use your website comfortably across devices.", art: "design" },
  { title: "Work together", copy: "I keep you involved through working previews and clear communication, using your feedback to refine the product from first idea to launch.", art: "support" },
];

export const PortfolioStory = () => {
  const section = useRef(null);
  const windowRef = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const [travel, setTravel] = useState(0);
  const [active, setActive] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [compact, setCompact] = useState(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  // Brief holds at both ends let the spring settle before the sticky section releases.
  const targetX = useTransform(scrollYProgress, [0, 0.025, 0.975, 1], [0, 0, -travel, -travel]);
  const smoothX = useSpring(targetX, { stiffness: 280, damping: 38, mass: 0.4, restDelta: 0.1 });
  const progress = useTransform(smoothX, value => travel ? Math.min(1, Math.max(0, -value / travel)) : 0);
  useMotionValueEvent(progress, "change", value => {
    if (compact || reduced) return;
    const items = trackRef.current?.children;
    if (!items?.length) return;
    const position = value * travel;
    let nearest = 0;
    for (let i = 1; i < items.length; i += 1) {
      if (Math.abs(Math.min(travel, items[i].offsetLeft - items[0].offsetLeft) - position) <
          Math.abs(Math.min(travel, items[nearest].offsetLeft - items[0].offsetLeft) - position)) nearest = i;
    }
    setChapter(nearest);
  });

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    const measure = () => setTravel(Math.max(0, trackRef.current.scrollWidth - windowRef.current.clientWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(windowRef.current);
    observer.observe(trackRef.current);
    measure();
    return () => { observer.disconnect(); query.removeEventListener('change', update); };
  }, []);

  const goToChapter = (index) => {
    const item = trackRef.current.children[index];
    if (reduced || compact) {
      item.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'nearest', inline: 'center' });
      setChapter(index);
      return;
    }
    const fraction = 0.025 + (travel ? Math.min(1, (item.offsetLeft - trackRef.current.children[0].offsetLeft) / travel) : 0) * 0.95;
    window.scrollTo({ top: window.scrollY + section.current.getBoundingClientRect().top + fraction * (section.current.offsetHeight - window.innerHeight), behavior: 'smooth' });
  };

  return (
    <section id="portfolio-story" className={`portfolio-story portfolio-story--editorial portfolio-story--collage${reduced ? " portfolio-story--reduced" : ""}`} aria-label="My approach to building products">
      <header className="portfolio-story__heading container"><h2>Built with intent.<br /><span>Made for people.</span></h2><p>Six perspectives on the way I design, develop, and share. Scroll through the thinking behind the work.</p></header>
      <div className="portfolio-story__scroll" ref={section} style={{ "--story-travel": `${travel}px` }}>
        <div className="portfolio-story__sticky" ref={windowRef}>
          <Motion.div className="portfolio-story__track" ref={trackRef} style={{ x: reduced || compact ? 0 : smoothX }}>
            {chapters.map(({ title, copy, badge, Icon, images }, index) => (
              <article style={{ '--chapter-accent': phaseColors[index] }} className={`portfolio-story__chapter portfolio-story__chapter--${index}${chapter === index ? " is-current" : ""}`} key={title}>
                <div className="portfolio-story__note" style={boxStyle(arrangements[index].note)}><span className="portfolio-story__chapter-number">{String(index + 1).padStart(2, '0')} <span>/ 06</span></span><h3>{title}</h3><p>{copy}</p><span className="portfolio-story__topic">{createElement(Icon, { 'aria-hidden': true })}{badge}</span></div>
                <Motion.div className="portfolio-story__pictures"
                  initial={reduced ? false : { opacity: 0.8, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}>
                  {(index === 0 || index === 3) && <svg className="portfolio-story__ribbon" viewBox="0 0 560 340" fill="none" aria-hidden="true"><Motion.path d="M12 302C112 294 200 228 168 146C134 57 65 131 126 192C193 259 294 204 303 123C317 3 207 8 251 91C294 174 409 167 548 21" stroke="currentColor" strokeWidth="24" strokeLinecap="round" initial={reduced ? false : {pathLength: 0.15}} whileInView={{pathLength: 1}} viewport={{once: true}} transition={{duration: reduced ? 0 : 1, ease: [0.16,1,0.3,1]}} /></svg>}
                  {images.map((imageId, imageIndex) => {
                    const art = storyArt[imageId - 1];
                    const frame = arrangements[index].frames[imageIndex];
                    return (
                    <Motion.figure
                      initial={reduced ? false : { opacity: 0.85, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : imageIndex * 0.055, ease: [0.16, 1, 0.3, 1] }}
                      key={imageIndex} style={{ ...boxStyle(frame), rotate: frame[4], '--art-zoom': art.zoom, '--art-focus': art.focus || '50% 100%' }} className={`portfolio-story__picture portfolio-story__picture--${imageIndex}`}>
                      <div className="portfolio-story__image-window">
                        <img src={`/image/home/story-selected/${art.file}`} alt={`${art.name} — UI8 design reference, not a client project`} loading={index === 0 ? "eager" : "lazy"} decoding="async" width={art.width || 1400} height={art.height} />
                      </div>
                      <figcaption className="portfolio-story__study-label">{art.label}</figcaption>
                    </Motion.figure>
                    );
                  })}
                  <div className="story-collage-seal" style={boxStyle(arrangements[index].seal)} aria-hidden="true"><img src={`/image/home/values/value-${index % 5 + 1}.png`} alt="" width="180" height="150" /></div>
                </Motion.div>
              </article>
            ))}
          </Motion.div>
          <div className="portfolio-story__footer"><span><a href="https://ui8.net/category/ui-kits" target="_blank" rel="noreferrer">UI8 visual references</a> · not client projects</span><nav className="portfolio-story__chapter-nav" aria-label="Story chapters">{chapters.map(({title}, index) => <button key={title} type="button" aria-label={`Chapter ${index + 1}: ${title}`} aria-current={chapter === index ? 'step' : undefined} onClick={() => goToChapter(index)}>
            {chapter === index && <Motion.i className="portfolio-story__nav-indicator" layoutId="story-chapter-indicator" aria-hidden="true" transition={{duration: reduced ? 0 : 0.35, ease: [0.16,1,0.3,1]}} />}
            <span>{String(index + 1).padStart(2, '0')}</span>
          </button>)}</nav><span>{String(chapter + 1).padStart(2, "0")} / 06 <FiArrowUpRight aria-hidden="true" /></span></div>
        </div>
      </div>
      <p className="portfolio-story__mobile-credit">Visual studies · <a href="https://ui8.net/category/ui-kits" target="_blank" rel="noreferrer">UI8 design references</a>, not client projects.</p>
      <div className="portfolio-story__values container">
        <div className="portfolio-story__intro">
          <h2>How I turn your ideas<br /> into working products.</h2>
          <div className="portfolio-story__principle"><FiCode aria-hidden="true" /><p>From React interfaces<br />to full-stack applications.</p><Link to="/project">Explore my projects <FiArrowUpRight aria-hidden="true" /></Link></div>
        </div>
        <div className="portfolio-story__panels">
          {values.map(({ title, copy, art }, index) => (
            <article key={title} className={`portfolio-story__value${active === index ? " is-active" : ""}`}>
              <button type="button" aria-expanded={active === index} aria-controls={`story-value-${index}`} onClick={() => setActive(index)}>
                <span className="portfolio-story__value-title">{title}<span className="portfolio-story__value-toggle" aria-hidden="true">{active === index ? <FiMinus /> : <FiPlus />}</span></span>
                <img className="portfolio-story__value-art" src={`/image/home/values/value-${valueArtwork[art]}.png`} alt="" width="180" height="150" loading="lazy" decoding="async" />
              </button>
              <div id={`story-value-${index}`} className="portfolio-story__value-copy" aria-hidden={active !== index}><div><Motion.p initial={false} animate={{opacity: active === index ? 1 : 0.6, y: reduced || active === index ? 0 : 6}} transition={{duration: reduced ? 0 : 0.3}}>{copy}</Motion.p></div></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
