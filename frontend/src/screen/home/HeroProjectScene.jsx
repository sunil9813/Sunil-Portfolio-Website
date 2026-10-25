import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiBookOpen, FiCheck, FiChevronRight, FiCode, FiDatabase, FiFileText, FiFolder, FiLayers, FiTerminal } from "react-icons/fi";
import "./HeroProjectScene.scss";

const views = {
  projects: { title: "Selected interfaces", subtitle: "React on the surface. MERN underneath.", route: "/project/all", collection: "projects", fields: ["title", "stack", "link"], artifact: "ProjectCard.jsx" },
  courses: { title: "Learn by building", subtitle: "Small concepts. Useful things to make.", route: "/subject/courses", collection: "courses", fields: ["subject", "lesson", "content"], artifact: "Component.jsx" },
  notes: { title: "Keep the useful parts", subtitle: "Code, patterns, and things worth sharing.", route: "/subject/notes", collection: "notes", fields: ["subject", "title", "content"], artifact: "fetch-resource.js" },
};

function ProjectContent() {
  return (
    <div className="project-scene__projects">
      <div className="project-scene__interface-preview">
        <div className="project-scene__preview-nav"><span className="project-scene__preview-mark" /><span>Web interfaces</span><FiArrowUpRight /></div>
        <div className="project-scene__preview-layout">
          <div className="project-scene__preview-copy"><span>Made to<br />make sense.</span><i /><i /><div className="project-scene__preview-action">Explore <FiChevronRight /></div></div>
          <div className="project-scene__preview-object"><div className="project-scene__component-block project-scene__component-block--a" /><div className="project-scene__component-block project-scene__component-block--b" /><div className="project-scene__component-block project-scene__component-block--c" /><span>React</span></div>
        </div>
        <div className="project-scene__preview-foot"><span>Responsive layout</span><span>Reusable components</span></div>
      </div>
      <div className="project-scene__project-index">
        <span className="project-scene__index-heading">Built from</span>
        <div><FiLayers /><span>Components<small>One system</small></span></div>
        <div><FiCode /><span>Interfaces<small>Clear interactions</small></span></div>
        <div><FiDatabase /><span>Data<small>Connected by APIs</small></span></div>
      </div>
    </div>
  );
}

function CourseContent() {
  return (
    <div className="project-scene__course">
      <div className="project-scene__lesson-list">
        <span className="project-scene__index-heading">React fundamentals</span>
        <div className="is-current"><FiCode /><span>Components & props</span><FiChevronRight /></div>
        <div><FiLayers /><span>State & events</span></div>
        <div><FiTerminal /><span>Effects & APIs</span></div>
      </div>
      <div className="project-scene__lesson">
        <div className="project-scene__lesson-heading"><FiBookOpen /><span>A component is a function.</span></div>
        <pre><code><span className="syntax-keyword">function</span>{" Welcome({ name }) {\n  "}<span className="syntax-keyword">return</span>{" <h1>Hello, {name}</h1>;\n}"}</code></pre>
        <div className="project-scene__lesson-example"><span>Hello, developer</span><FiCheck /></div>
        <span className="project-scene__lesson-note">Pass data in. Render something useful.</span>
      </div>
    </div>
  );
}

function NoteContent() {
  return (
    <div className="project-scene__notes">
      <div className="project-scene__note-rail"><FiFileText /><span>JavaScript</span><i /><span>API patterns</span><i /><span>Error handling</span></div>
      <div className="project-scene__note-code">
        <span className="project-scene__code-title">Check the response before using it.</span>
        <pre><code><span className="syntax-keyword">const</span>{" response = "}<span className="syntax-keyword">await</span>{" fetch(url);\n"}<span className="syntax-keyword">if</span>{" (!response.ok) {\n  "}<span className="syntax-keyword">throw new</span>{" Error("}<span className="syntax-string">&quot;Request failed&quot;</span>{");\n}\n"}<span className="syntax-keyword">return</span>{" response.json();"}</code></pre>
      </div>
    </div>
  );
}

/** A decorative, code-native illustration; its controls live in the parent hero. */
export function HeroProjectScene({ view = "projects", paused = false, reducedMotion = false }) {
  const sceneRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [entered, setEntered] = useState(false);
  const selectedView = Object.hasOwn(views, view) ? view : "projects";
  const content = views[selectedView];
  const running = inView && documentVisible && !paused && !reducedMotion;

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      setEntered(true);
      return () => document.removeEventListener("visibilitychange", updateVisibility);
    }
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setEntered(true);
    }, { threshold: 0.06 });
    observer.observe(scene);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !running) return;
    let frame = 0;
    const tilt = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const animateTilt = () => {
      tilt.x += (tilt.targetX - tilt.x) * 0.12;
      tilt.y += (tilt.targetY - tilt.y) * 0.12;
      scene.style.setProperty("--scene-tilt-x", `${tilt.x.toFixed(3)}deg`);
      scene.style.setProperty("--scene-tilt-y", `${tilt.y.toFixed(3)}deg`);
      if (Math.abs(tilt.targetX - tilt.x) > 0.01 || Math.abs(tilt.targetY - tilt.y) > 0.01) frame = requestAnimationFrame(animateTilt);
      else frame = 0;
    };
    const startTilt = () => { if (!frame) frame = requestAnimationFrame(animateTilt); };
    const move = event => {
      if (event.pointerType !== "mouse") return;
      const rect = scene.getBoundingClientRect();
      tilt.targetX = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
      tilt.targetY = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
      startTilt();
    };
    const leave = () => { tilt.targetX = 0; tilt.targetY = 0; startTilt(); };
    scene.addEventListener("pointermove", move, { passive: true });
    scene.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      scene.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerleave", leave);
      scene.style.setProperty("--scene-tilt-x", "0deg");
      scene.style.setProperty("--scene-tilt-y", "0deg");
    };
  }, [running]);

  return (
    <div ref={sceneRef} className="project-scene" aria-hidden="true" data-view={selectedView} data-running={running} data-entered={entered} data-reduced-motion={reducedMotion}>
      <div className="project-scene__perspective">
        <div className="project-scene__tilt">
          <div className="project-scene__float">
            <div className="project-scene__assembly">
              <div className="project-scene__browser project-scene__plane">
                <div className="project-scene__browser-chrome"><span className="project-scene__window-dots"><i /><i /><i /></span><span className="project-scene__address"><FiFolder /> sunil / portfolio</span><FiArrowUpRight /></div>
                <div className="project-scene__browser-nav"><span className="project-scene__brand">GORK<span>coder</span><i /></span><div className="project-scene__tabs"><span data-active={selectedView === "projects"}>Projects</span><span data-active={selectedView === "courses"}>Courses</span><span data-active={selectedView === "notes"}>Notes</span></div></div>
                <div className="project-scene__browser-body">
                  <div className="project-scene__browser-heading"><div><strong>{content.title}</strong><p>{content.subtitle}</p></div><span className="project-scene__react-mark"><FiCode /></span></div>
                  {selectedView === "projects" ? <ProjectContent /> : selectedView === "courses" ? <CourseContent /> : <NoteContent />}
                  <div className="project-scene__browser-footer"><span>Sunil B.K <i /> MERN developer</span><span>An illustrated view</span></div>
                </div>
              </div>
              <div className="project-scene__api project-scene__plane">
                <div className="project-scene__layer-label"><FiTerminal /><strong>Node.js <span>+ Express</span></strong><span className="project-scene__layer-type">API</span></div>
                <div className="project-scene__route"><span>GET</span><code>{content.route}</code><FiChevronRight /><span className="project-scene__json-label">JSON</span></div>
                <div className="project-scene__plate-socket"><i /><i /><i /></div>
              </div>
              <div className="project-scene__data project-scene__plane">
                <div className="project-scene__layer-label"><FiDatabase /><strong>MongoDB</strong><code>{content.collection}</code></div>
                <div className="project-scene__schema"><span>{"{"}</span>{content.fields.map(field => <code key={field}>{field}</code>)}<span>{"}"}</span></div>
              </div>
              <div className="project-scene__artifact project-scene__plane"><div><FiCode /><span>{content.artifact}</span></div><code><span>export</span> {selectedView === "notes" ? "async function" : "function"}<br /><b>{selectedView === "projects" ? "ProjectCard" : selectedView === "courses" ? "Component" : "getResource"}</b>{"() { … }"}</code></div>
              <span className="project-scene__connector project-scene__connector--a" /><span className="project-scene__connector project-scene__connector--b" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
