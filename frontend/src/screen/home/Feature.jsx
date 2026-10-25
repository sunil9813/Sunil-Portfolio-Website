import { motion as Motion, useInView, useReducedMotion } from "motion/react";
import { createElement, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBox,
  FiCode,
  FiDatabase,
  FiFileText,
  FiGitBranch,
  FiLayers,
  FiLock,
  FiMonitor,
  FiArrowUpRight,
  FiCheck,
  FiServer,
  FiRotateCw,
} from "react-icons/fi";
import "./Feature.scss";

const FeatureTag = ({ icon, children }) => (
  <span className="feature-pro__tag">{createElement(icon, { "aria-hidden": true })}{children}</span>
);

const FeaturePanel = ({ children, className, reducedMotion, pageVisible }) => {
  const panelRef = useRef(null);
  const inView = useInView(panelRef, { amount: 0.2 });
  return (
    <article
      ref={panelRef}
      className={className}
      data-active={inView && pageVisible && !reducedMotion}
    >{children}</article>
  );
};

const ProductSystemVisual = () => (
  <div className="feature-art feature-art--system" aria-hidden="true">
    <div className="feature-art__toolbar"><span><FiCode /> gorkcoder / product</span><small>Connected system</small></div>
    <div className="feature-system">
      <div className="feature-system__node"><FiMonitor /><strong>React UI</strong><span>Interface</span><div className="feature-system__screen"><i /><div><i /><i /><i /></div><b /></div></div>
      <div className="feature-system__connection"><span /><i /></div>
      <div className="feature-system__node"><FiServer /><strong>Node API</strong><span>Application</span><div className="feature-system__code"><b>GET</b><code>/api/projects</code><i /><i /></div></div>
      <div className="feature-system__connection"><span /><i /></div>
      <div className="feature-system__node"><FiDatabase /><strong>MongoDB</strong><span>Data</span><div className="feature-system__records"><i /><i /><i /></div></div>
    </div>
    <div className="feature-art__footnote"><FiLayers /> Three layers. One connected experience.</div>
  </div>
);

const ArchitectureVisual = () => (
  <div className="feature-art feature-art--architecture" aria-hidden="true">
    <div className="feature-architecture">
      <div className="feature-architecture__root"><FiLayers /><span>Application core</span><code>src/</code></div>
      <svg className="feature-architecture__lines" viewBox="0 0 360 56" preserveAspectRatio="none"><path pathLength="1" d="M180 0 V20 M60 56 V20 H300 V56 M180 20 V56" /></svg>
      <div className="feature-architecture__modules">
        <span><FiLock />Auth<small>Access</small></span><span><FiBox />Projects<small>Features</small></span><span><FiFileText />Content<small>Publishing</small></span>
      </div>
      <div className="feature-architecture__shared"><FiCode /> Shared components <span>Reusable by design</span></div>
    </div>
  </div>
);

const DeliveryVisual = () => (
  <div className="feature-art feature-art--delivery" aria-hidden="true">
    <div className="feature-delivery">
      <div className="feature-delivery__branch"><FiGitBranch /><code>feature / product</code><span>main</span></div>
      <svg className="feature-delivery__path" viewBox="0 0 400 68" fill="none">
        <path d="M20 20 H105 C140 20 140 48 176 48 H232 C268 48 268 20 304 20 H380" />
        <path className="feature-delivery__signal" d="M20 20 H105 C140 20 140 48 176 48 H232 C268 48 268 20 304 20 H380" />
        <circle cx="20" cy="20" r="5" /><circle cx="145" cy="38" r="5" /><circle cx="255" cy="38" r="5" /><circle cx="380" cy="20" r="5" />
      </svg>
      <div className="feature-delivery__steps"><span>Plan</span><span>Build</span><span>Test</span><span>Ship</span></div>
      <div className="feature-delivery__release"><FiCheck /><div><strong>Ready for the next milestone</strong><span>Review. Refine. Release.</span></div></div>
    </div>
  </div>
);

const InterfacePreview = () => <div className="feature-device__ui"><i /><div><b /><b /><b /></div><span /><span /></div>;
const ResponsiveVisual = () => (
  <div className="feature-art feature-art--responsive" aria-hidden="true">
    <div className="feature-devices">
      <div className="feature-device feature-device--desktop"><div className="feature-device__bar"><i /><i /><i /></div><InterfacePreview /></div>
      <div className="feature-device feature-device--tablet"><InterfacePreview /></div>
      <div className="feature-device feature-device--phone"><span className="feature-device__notch" /><InterfacePreview /></div>
    </div>
    <div className="feature-art__footnote">One interface. Every viewport.</div>
  </div>
);

const ContentVisual = () => (
  <div className="feature-art feature-art--content" aria-hidden="true">
    <div className="feature-content">
      <div className="feature-content__tabs"><span><FiFileText /> courses.tsx</span><span>Preview</span></div>
      <div className="feature-content__body">
        <div className="feature-content__code"><code><em>const</em> lessons = [<br />&nbsp; <b>&apos;Learn&apos;</b>,<br />&nbsp; <b>&apos;Build&apos;</b>,<br />&nbsp; <b>&apos;Share&apos;</b><br />];<span className="feature-content__cursor" /></code></div>
        <div className="feature-content__preview"><FiFileText /><strong>Keep learning.</strong><span>Courses & resources</span><i /><i /><b>Explore lessons <FiArrowUpRight /></b></div>
      </div>
      <div className="feature-content__footer"><FiCheck /> From structured content to useful experiences.</div>
    </div>
  </div>
);

const ProjectLibraryVisual = () => (
  <div className="feature-studies" aria-hidden="true">
    {[
      ["/image/home/project-collage/ui8-card-01.avif", "Dashboard"],
      ["/image/home/project-collage/ui8-card-03.avif", "Learning"],
      ["/image/home/project-collage/ui8-card-05.avif", "Commerce"],
      ["/image/home/project-collage/ui8-card-07.avif", "Portfolio"],
    ].map(([image, title]) => (
      <div className="feature-studies__item" key={title}>
        <img src={image} alt="" loading="lazy" decoding="async" width="360" height="240" />
        <span>{title}</span>
      </div>
    ))}
    <small>Interface inspiration · UI8</small>
  </div>
);

export const Feature = () => {
  const reduceMotion = useReducedMotion();
  const [pageVisible, setPageVisible] = useState(true);
  const [animationRun, setAnimationRun] = useState(0);
  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);
  const panelProps = { reducedMotion: reduceMotion, pageVisible };

  return (
    <section id="features" className="feature-pro" aria-labelledby="feature-pro-title">
      <div className="feature-pro__inner container">
        <header className="feature-pro__heading">
          <h2 id="feature-pro-title">Built for the full <span>product journey.</span></h2>
          <div className="feature-pro__intro"><p>From the first interface decision to the final deployment, every layer is shaped to work together as one dependable product.</p>
            <button className="feature-pro__replay" type="button" disabled={!!reduceMotion} onClick={() => setAnimationRun(value => value + 1)}>
              <Motion.span animate={{ rotate: reduceMotion ? 0 : animationRun * 360 }} transition={{ duration: .5, ease: [.16, 1, .3, 1] }}><FiRotateCw aria-hidden="true" /></Motion.span>
              {reduceMotion ? "Reduced motion enabled" : "Replay diagrams"}
            </button>
          </div>
        </header>

        <FeaturePanel key={"system-" + animationRun} className="feature-pro__wide feature-pro__wide--system" {...panelProps}>
          <div className="feature-pro__copy feature-pro__copy--wide">
            <h3>One product, end to end.</h3>
            <p>I connect interface, backend, and data into one dependable experience.</p>
            <FeatureTag icon={FiCode}>Full-stack systems</FeatureTag>
          </div>
          <ProductSystemVisual />
        </FeaturePanel>

        <div className="feature-pro__grid">
          <FeaturePanel key={"architecture-" + animationRun} className="feature-pro__card" {...panelProps}>
            <div className="feature-pro__copy">
              <h3>Stay maintainable.</h3>
              <p>Reusable architecture keeps features clear as your product grows.</p>
              <FeatureTag icon={FiBox}>Modular architecture</FeatureTag>
            </div>
            <ArchitectureVisual />
          </FeaturePanel>

          <FeaturePanel key={"delivery-" + animationRun} className="feature-pro__card" {...panelProps}>
            <div className="feature-pro__copy">
              <h3>Ship with confidence.</h3>
              <p>Focused milestones turn complex work into visible progress.</p>
              <FeatureTag icon={FiGitBranch}>Product delivery</FeatureTag>
            </div>
            <DeliveryVisual />
          </FeaturePanel>

          <FeaturePanel key={"responsive-" + animationRun} className="feature-pro__card" {...panelProps}>
            <div className="feature-pro__copy">
              <h3>Fit every screen.</h3>
              <p>Responsive interfaces stay clear, accessible, and useful everywhere.</p>
              <FeatureTag icon={FiMonitor}>Responsive UI</FeatureTag>
            </div>
            <ResponsiveVisual />
          </FeaturePanel>

          <FeaturePanel key={"content-" + animationRun} className="feature-pro__card" {...panelProps}>
            <div className="feature-pro__copy">
              <h3>Content without friction.</h3>
              <p>Courses, notes, and resources move through a clean publishing flow.</p>
              <FeatureTag icon={FiFileText}>Content platform</FeatureTag>
            </div>
            <ContentVisual />
          </FeaturePanel>
        </div>

        <FeaturePanel key={"library-" + animationRun} className="feature-pro__wide feature-pro__wide--library" {...panelProps}>
          <div className="feature-pro__copy feature-pro__copy--wide">
            <h3>Built around your idea.</h3>
            <p>I shape the interface and technical system to match the product—not a template.</p>
            <FeatureTag icon={FiLock}>Purpose-built projects</FeatureTag>
            <Link className="feature-pro__link" to="/project">Explore my projects <FiArrowUpRight aria-hidden="true" /></Link>
          </div>
          <ProjectLibraryVisual />
        </FeaturePanel>
      </div>
    </section>
  );
};
