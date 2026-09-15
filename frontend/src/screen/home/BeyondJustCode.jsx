import { Link } from "react-router-dom";
import { FiArrowUpRight, FiBookOpen, FiCheck, FiCode, FiFileText, FiFolder, FiLayers } from "react-icons/fi";
import "./BeyondJustCode.scss";

const lessons = ["React fundamentals", "Components & state", "Working with APIs", "Building for production"];

function WindowBar({ title }) {
  return <div className="bc-bar"><span><i /><i /><i /></span>{title}<FiCode /></div>;
}
function CoursePreview() {
  return <div className="bc-window"><WindowBar title="Learning path" /><div className="bc-cover"><FiLayers /><strong>From fundamentals<br />to full-stack.</strong><small>IT & DEVELOPMENT</small></div><div className="bc-lessons">{lessons.map((lesson, i) => <div key={lesson}><span>0{i + 1}</span>{lesson}<FiBookOpen /></div>)}</div></div>;
}
function Editor() {
  return <div className="bc-window"><WindowBar title="portfolio / App.jsx" /><div className="bc-editor-body"><aside><small>EXPLORER</small>{["components", "pages", "server", "package.json"].map(file => <div key={file}><FiFolder />{file}</div>)}</aside><div className="bc-code"><div>App.jsx <span>React</span></div><pre><code><em>export default function</em> Portfolio() {"{"}{"\n"}{"  "}<em>return</em> ({"\n"}{"    "}<b>&lt;Experience&gt;</b>{"\n"}{"      "}&lt;Projects /&gt;{"\n"}{"      "}&lt;Courses /&gt;{"\n"}{"      "}&lt;Notes /&gt;{"\n"}{"    "}<b>&lt;/Experience&gt;</b>{"\n"}{"  "});{"\n"}{"}"}</code></pre><div className="bc-terminal"><FiCheck /> Ready to bring the next idea to life.</div></div></div></div>;
}

export const BeyondJustCode = () => (
  <section className="beyond-code" aria-labelledby="bc-title">
    <div className="container">
      <header className="bc-heading">
        <h2 id="bc-title">Beyond just code.<br /><span>Build. Learn. Share.</span></h2>
        <p>Explore what I build, what I learn, and what I share.<br className="bc-desktop-break" /> All connected by a passion for making things work better.</p>
      </header>

      <div className="bc-grid">
        <article className="bc-card bc-project">
          <div className="bc-project-art" aria-hidden="true">
            <div className="bc-file-stack">
              {["Interface", "Application", "API", "Database"].map((name, i) => (
                <div key={name} style={{ "--i": i }}><FiFolder /><span>{name}</span><small>{["React", "MERN", "Node.js", "MongoDB"][i]}</small></div>
              ))}
            </div>
          </div>
          <div className="bc-copy"><h3>Ideas, made real.</h3><p>Thoughtful interfaces. Connected systems.<br />Full-stack projects, built with purpose.</p><Link to="/project">Explore my projects <FiArrowUpRight /></Link></div>
        </article>

        <article className="bc-card bc-learning">
          <div className="bc-learning-preview" aria-hidden="true"><CoursePreview /></div>
          <div className="bc-copy"><h3>Your next chapter<br />starts here.</h3><p>Explore IT courses that break complex subjects into approachable, practical lessons.</p><Link to="/courses">Find a course <FiArrowUpRight /></Link></div>
        </article>

        <article className="bc-card bc-notes">
          <div className="bc-notes-preview" aria-hidden="true">
            <div className="bc-note-sheet bc-note-back"><FiFileText /><span>API design</span></div>
            <div className="bc-note-sheet"><div><FiFileText /> Developer notes</div><strong>Small details.<br />Better code.</strong><pre><span>const</span> learning =<br />  share(experience);</pre></div>
          </div>
          <div className="bc-copy"><h3>Keep the useful bits.</h3><p>Notes, patterns, and lessons from<br />the things I learn along the way.</p><Link to="/notes">Read my notes <FiArrowUpRight /></Link></div>
        </article>
      </div>

      <div className="bc-secondary-grid">
        <article className="bc-card bc-mini bc-stack-card">
          <div className="bc-stack-preview" aria-hidden="true"><span>React</span><i /><span>Node.js</span><i /><span>MongoDB</span></div>
          <div className="bc-copy"><h3>Every layer connected.</h3><p>Frontend, APIs, and data.</p></div>
        </article>
        <article className="bc-card bc-mini bc-editor-card">
          <div className="bc-mini-editor" aria-hidden="true"><Editor /></div>
          <div className="bc-copy"><h3>Care in the details.</h3><p>Thoughtful full-stack development.</p></div>
        </article>
        <article className="bc-card bc-mini bc-collaborate-card">
          <div className="bc-brief-preview" aria-hidden="true"><WindowBar title="Your next project" /><div><FiCheck /> Define the idea</div><div><FiCheck /> Build the experience</div><div><FiCheck /> Refine the details</div></div>
          <div className="bc-copy"><h3>Made with you.</h3><p>From the first idea to the final detail.</p></div>
        </article>
      </div>
      <div className="bc-footer"><Link to="/contact">Let’s build something together <FiArrowUpRight /></Link></div>
    </div>
  </section>
);
