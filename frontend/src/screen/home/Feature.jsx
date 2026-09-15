import { motion as Motion, useReducedMotion } from "motion/react";
import { createElement } from "react";
import {
  FiBox,
  FiCloud,
  FiCode,
  FiDatabase,
  FiFileText,
  FiGitBranch,
  FiLayers,
  FiLock,
  FiMonitor,
  FiSearch,
  FiServer,
} from "react-icons/fi";

const reveal = {
  hidden: { opacity: 0, y: 34, filter: "blur(7px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const FeatureTag = ({ icon, children }) => (
  <span className="feature-pro__tag">{createElement(icon, { "aria-hidden": true })}{children}</span>
);

const ProductSystemVisual = () => (
  <div className="feature-pro__system" aria-hidden="true">
    <span className="feature-pro__beam feature-pro__beam--one" />
    <span className="feature-pro__beam feature-pro__beam--two" />
    <span className="feature-pro__beam feature-pro__beam--three" />
    <div className="feature-pro__window">
      <div className="feature-pro__window-bar">
        <span /><span /><span />
        <small>gorkcoder / product</small>
        <b>Live preview</b>
      </div>
      <div className="feature-pro__layers">
        <div><FiMonitor /><small>INTERFACE</small><strong>React UI</strong><i>Responsive screens</i></div>
        <span className="feature-pro__flow"><i /><i /><i /></span>
        <div><FiServer /><small>APPLICATION</small><strong>Node API</strong><i>Protected services</i></div>
        <span className="feature-pro__flow"><i /><i /><i /></span>
        <div><FiDatabase /><small>DATA</small><strong>MongoDB</strong><i>Structured content</i></div>
      </div>
    </div>
  </div>
);

const ArchitectureVisual = () => (
  <div className="feature-pro__architecture" aria-hidden="true">
    <div className="feature-pro__arch-root"><FiLayers /> MERN CORE</div>
    <span className="feature-pro__arch-line feature-pro__arch-line--left" />
    <span className="feature-pro__arch-line feature-pro__arch-line--right" />
    <div className="feature-pro__arch-node feature-pro__arch-node--left">
      <FiMonitor />
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <i key={item} />)}
    </div>
    <div className="feature-pro__arch-node feature-pro__arch-node--right">
      <FiServer />
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <i key={item} />)}
    </div>
  </div>
);

const DeliveryVisual = () => (
  <div className="feature-pro__delivery" aria-hidden="true">
    <div className="feature-pro__months"><span>PLAN</span><span>BUILD</span><span>TEST</span><span>SHIP</span></div>
    <div className="feature-pro__heatmap">
      {Array.from({ length: 96 }, (_, index) => (
        <i className={`feature-pro__heat-${(index * 7 + Math.floor(index / 12)) % 5}`} key={index} />
      ))}
    </div>
    <div className="feature-pro__delivery-status"><FiGitBranch /> Continuous delivery</div>
  </div>
);

const ResponsiveVisual = () => (
  <div className="feature-pro__responsive" aria-hidden="true">
    <div className="feature-pro__device feature-pro__device--desktop"><span /><span /><span /></div>
    <div className="feature-pro__device feature-pro__device--tablet"><span /><span /><span /></div>
    <div className="feature-pro__device feature-pro__device--phone"><span /><span /><span /></div>
    <div className="feature-pro__responsive-dots">
      {Array.from({ length: 35 }, (_, index) => <i key={index} />)}
    </div>
  </div>
);

const ContentVisual = () => (
  <div className="feature-pro__content-visual" aria-hidden="true">
    {["ROUTE /courses", "QUERY lessons", "RENDER content", "READY 200"].map((label, index) => (
      <div className={`feature-pro__code-sheet feature-pro__code-sheet--${index + 1}`} key={label}>
        <small>{label}</small>
        <span /><span /><span />
      </div>
    ))}
  </div>
);

const ProjectLibraryVisual = () => {
  const projects = [
    ["/image/home/project-collage/ui8-card-01.avif", "Dashboard"],
    ["/image/home/project-collage/ui8-card-03.avif", "Learning"],
    ["/image/home/project-collage/ui8-card-05.avif", "Commerce"],
    ["/image/home/project-collage/ui8-card-07.avif", "Portfolio"],
  ];

  return (
    <div className="feature-pro__library" aria-hidden="true">
      <div className="feature-pro__search"><FiSearch /> Search project systems...</div>
      <small>SELECTED PRODUCT WORK</small>
      <div className="feature-pro__project-row">
        {projects.map(([image, title]) => (
          <div className="feature-pro__project" key={title}>
            <img src={image} alt="" />
            <strong>{title}</strong>
            <span>Full-stack build</span>
          </div>
        ))}
      </div>
      <div className="feature-pro__controls">
        <label>Accent<span><i /></span></label>
        <label>Depth<span><i /></span></label>
        <small>#92d8df</small>
      </div>
    </div>
  );
};

export const Feature = () => {
  const reduceMotion = useReducedMotion();
  const motionProps = (delay = 0) => reduceMotion
    ? { initial: false }
    : { variants: reveal, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.14 }, custom: delay };

  return (
    <section className="feature-pro" aria-labelledby="feature-pro-title">
      <div className="feature-pro__inner container">
        <Motion.header className="feature-pro__heading" {...motionProps(0)}>
          <h2 id="feature-pro-title">Built for the full product journey.</h2>
          <p>From the first interface decision to the final deployment, every layer is shaped to work together as one dependable product.</p>
        </Motion.header>

        <Motion.article className="feature-pro__wide feature-pro__wide--system" {...motionProps(0.06)}>
          <ProductSystemVisual />
          <div className="feature-pro__copy feature-pro__copy--wide">
            <h3>One product, end to end. <span>I connect interface, backend, and data into one dependable experience.</span></h3>
            <FeatureTag icon={FiCode}>Full-stack systems</FeatureTag>
          </div>
        </Motion.article>

        <div className="feature-pro__grid">
          <Motion.article className="feature-pro__card" {...motionProps(0.04)}>
            <ArchitectureVisual />
            <div className="feature-pro__copy">
              <h3>Stay maintainable. <span>Reusable architecture keeps features clear as your product grows.</span></h3>
              <FeatureTag icon={FiBox}>Modular architecture</FeatureTag>
            </div>
          </Motion.article>

          <Motion.article className="feature-pro__card" {...motionProps(0.1)}>
            <DeliveryVisual />
            <div className="feature-pro__copy">
              <h3>Ship with confidence. <span>Focused milestones turn complex work into visible progress.</span></h3>
              <FeatureTag icon={FiGitBranch}>Product delivery</FeatureTag>
            </div>
          </Motion.article>

          <Motion.article className="feature-pro__card" {...motionProps(0.04)}>
            <ResponsiveVisual />
            <div className="feature-pro__copy">
              <h3>Fit every screen. <span>Responsive interfaces stay clear, accessible, and useful everywhere.</span></h3>
              <FeatureTag icon={FiMonitor}>Responsive UI</FeatureTag>
            </div>
          </Motion.article>

          <Motion.article className="feature-pro__card" {...motionProps(0.1)}>
            <ContentVisual />
            <div className="feature-pro__copy">
              <h3>Content without friction. <span>Courses, notes, and resources move through a clean publishing flow.</span></h3>
              <FeatureTag icon={FiFileText}>Content platform</FeatureTag>
            </div>
          </Motion.article>
        </div>

        <Motion.article className="feature-pro__wide feature-pro__wide--library" {...motionProps(0.06)}>
          <div className="feature-pro__copy feature-pro__copy--wide">
            <h3>Built around your idea. <span>I shape the interface and technical system to match the product—not a template.</span></h3>
            <FeatureTag icon={FiLock}>Purpose-built projects</FeatureTag>
          </div>
          <ProjectLibraryVisual />
        </Motion.article>
      </div>
    </section>
  );
};
