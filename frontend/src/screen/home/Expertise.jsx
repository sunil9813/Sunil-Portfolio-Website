import { createElement, useRef, useState } from "react";
import { motion as Motion, useInView, useReducedMotion } from "motion/react";
import { FiArrowUpRight, FiCode, FiDatabase, FiGlobe, FiServer } from "react-icons/fi";
import "./Expertise.scss";

const skills = [
  { name: "HTML", icon: "html5/html5-original.svg", group: "frontend" },
  { name: "CSS3", icon: "css3/css3-original.svg", group: "frontend" },
  { name: "Sass", icon: "sass/sass-original.svg", group: "frontend" },
  { name: "Tailwind CSS", icon: "tailwindcss/tailwindcss-original.svg", group: "frontend" },
  { name: "Bootstrap", icon: "bootstrap/bootstrap-original.svg", group: "frontend" },
  { name: "Material UI", icon: "materialui/materialui-original.svg", group: "frontend" },
  { name: "JavaScript", icon: "javascript/javascript-original.svg", group: "frontend" },
  { name: "React", icon: "react/react-original.svg", group: "frontend" },
  { name: "Next.js", icon: "nextjs/nextjs-original.svg", group: "frontend", invert: true },
  { name: "React Router", icon: "reactrouter/reactrouter-original.svg", group: "frontend" },
  { name: "Redux Toolkit", icon: "redux/redux-original.svg", group: "frontend" },
  { name: "Axios", icon: "axios/axios-plain.svg", group: "frontend" },
  { name: "Node.js", icon: "nodejs/nodejs-original.svg", group: "backend" },
  { name: "Express.js", icon: "express/express-original.svg", group: "backend", invert: true },
  { name: "MongoDB", icon: "mongodb/mongodb-original.svg", group: "database" },
  { name: "MySQL", icon: "mysql/mysql-original.svg", group: "database" },
  { name: "Firebase", icon: "firebase/firebase-original.svg", group: "database" },
  { name: "AWS", icon: "amazonwebservices/amazonwebservices-original-wordmark.svg", group: "hosting" },
  { name: "Netlify", icon: "netlify/netlify-original.svg", group: "hosting" },
  { name: "Vercel", icon: "vercel/vercel-original.svg", group: "hosting", invert: true },
  { name: "NPM", icon: "npm/npm-original-wordmark.svg", group: "tools" },
  { name: "PNPM", icon: "pnpm/pnpm-original.svg", group: "tools" },
  { name: "VS Code", icon: "vscode/vscode-original.svg", group: "tools" },
  { name: "Linux", icon: "linux/linux-original.svg", group: "tools" },
  { name: "Windows", icon: "windows11/windows11-original.svg", group: "tools" },
  { name: "Git", icon: "git/git-original.svg", group: "tools" },
  { name: "GitHub", icon: "github/github-original.svg", group: "tools", invert: true },
];

const disciplines = [
  { id: "interface", title: "Interface", label: "Frontend engineering", description: "Responsive interfaces with clear systems, accessible interactions, and purposeful motion.", groups: ["frontend"], icon: FiCode, tone: "#f5f5f5", node: "React UI", artifact: "Components & interaction" },
  { id: "systems", title: "Systems", label: "Backend development", description: "Dependable application logic and APIs designed to remain clear as products grow.", groups: ["backend"], icon: FiServer, tone: "#f5f5f5", node: "Node.js API", artifact: "APIs & application logic" },
  { id: "data", title: "Data", label: "Database architecture", description: "Flexible data foundations that keep information structured, available, and secure.", groups: ["database"], icon: FiDatabase, tone: "#f5f5f5", node: "MongoDB", artifact: "Documents & collections" },
  { id: "delivery", title: "Delivery", label: "Cloud & developer tools", description: "A reliable path from local development through testing, deployment, and production.", groups: ["hosting", "tools"], icon: FiGlobe, tone: "#f5f5f5", node: "Release", artifact: "Build, deploy, iterate" },
];

const iconUrl = icon => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${icon}`;
const connections = [
  { desktop: "M 22 67 V 70 Q 22 82 40 82 H 206 Q 236 82 236 112 V 132 Q 236 148 254 148 H 284", mobile: "M 74 23 H 170 Q 206 23 206 60 V 125 Q 206 148 230 148 H 246" },
  { desktop: "M 698 67 V 70 Q 698 82 680 82 H 514 Q 484 82 484 112 V 132 Q 484 148 466 148 H 436", mobile: "M 646 23 H 550 Q 514 23 514 60 V 125 Q 514 148 490 148 H 474" },
  { desktop: "M 22 253 V 250 Q 22 238 40 238 H 206 Q 236 238 236 208 V 188 Q 236 172 254 172 H 284", mobile: "M 74 251 H 170 Q 206 251 206 215 V 195 Q 206 172 230 172 H 246" },
  { desktop: "M 698 253 V 250 Q 698 238 680 238 H 514 Q 484 238 484 208 V 188 Q 484 172 466 172 H 436", mobile: "M 646 251 H 550 Q 514 251 514 215 V 195 Q 514 172 490 172 H 474" },
];

export const Expertise = () => {
  const sectionRef = useRef(null);
  const buttonRefs = useRef([]);
  const [active, setActive] = useState(0);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const selected = disciplines[active];
  const items = skills.filter(skill => selected.groups.includes(skill.group));
  const selectWithKeyboard = (event, index) => {
    const next = event.key === "Home" ? 0 : event.key === "End" ? disciplines.length - 1 :
      ["ArrowRight", "ArrowDown"].includes(event.key) ? (index + 1) % disciplines.length :
      ["ArrowLeft", "ArrowUp"].includes(event.key) ? (index + disciplines.length - 1) % disciplines.length : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    buttonRefs.current[next]?.focus();
  };

  return (
    <section className="expertise-studio scroll-mt-24" id="expertise" aria-labelledby="expertise-title" ref={sectionRef} data-visible={isInView} style={{ "--expertise-tone": selected.tone }}>
      <div className="container">
        <header className="mx-auto mb-9 max-w-3xl text-center">
          <h2 id="expertise-title" className="m-0 text-[32px] font-medium leading-[1.1] tracking-[-.03em] text-white md:text-[clamp(40px,4vw,58px)]">Every layer.<br /><span className="text-[#a8a8a8]">One connected stack.</span></h2>
          <p className="mx-auto mb-0 mt-4 max-w-[53ch] text-[14px] leading-[1.8] text-[#bdbdbd]">From the interface people use to the APIs, data, and tools behind it. Explore the technologies I bring to each part of a product.</p>
        </header>

        <div className="expertise-studio__workspace">
          <div className="expertise-studio__selector" role="group" aria-label="Choose an expertise discipline">
            {disciplines.map((discipline, index) => (
              <button key={discipline.id} ref={element => { buttonRefs.current[index] = element; }} type="button" id={`expertise-${discipline.id}-control`} aria-pressed={active === index} aria-controls="expertise-detail" onClick={() => setActive(index)} onKeyDown={event => selectWithKeyboard(event, index)} style={{ "--discipline-tone": discipline.tone }}>
                {active === index && <Motion.span className="expertise-studio__selection" layoutId="expertise-selected-discipline" aria-hidden="true" initial={false} transition={{ duration: reduce ? 0 : .38, ease: [.16, 1, .3, 1] }} />}
                <span className="expertise-studio__selector-icon" aria-hidden="true">{createElement(discipline.icon)}</span>
                <span className="expertise-studio__selector-copy"><span>{discipline.title}</span><small>{discipline.label}</small></span>
                <FiArrowUpRight className="expertise-studio__selector-arrow" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="expertise-studio__detail" id="expertise-detail" role="region" aria-labelledby={`expertise-${selected.id}-control`}>
            <div className="expertise-studio__network" aria-hidden="true">
              <svg className="expertise-studio__connections" viewBox="0 0 720 320" preserveAspectRatio="none" fill="none">
                {disciplines.flatMap((discipline, index) => ["desktop", "mobile"].map(size => (
                  <g key={`${discipline.id}-${size}`} className={`expertise-studio__wires--${size}`}>
                    <path d={connections[index][size]} className="expertise-studio__connection-base" />
                    <Motion.path d={connections[index][size]} stroke={discipline.tone} strokeWidth="1.5" initial={reduce ? false : { pathLength: .12, opacity: .3 }} animate={{ pathLength: isInView ? 1 : .12, opacity: active === index ? 1 : .2 }} transition={{ pathLength: { duration: reduce ? 0 : .8, delay: reduce ? 0 : index * .08, ease: [.16, 1, .3, 1] }, opacity: { duration: reduce ? 0 : .25 } }} />
                  </g>
                )))}
              </svg>
              <div className="expertise-studio__application">
                <div className="expertise-studio__application-chrome"><i /><i /><i /><span /></div>
                <div className="expertise-studio__application-body">
                  <FiCode />
                  <span>Web application</span>
                  <small>One connected product</small>
                </div>
              </div>
              {disciplines.map((discipline, index) => (
                <Motion.div className={`expertise-studio__node expertise-studio__node--${discipline.id} ${active === index ? "is-active" : ""}`} key={discipline.id} style={{ "--node-tone": discipline.tone }} initial={reduce ? false : { opacity: .65, y: 8 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: reduce ? 0 : .5, delay: reduce ? 0 : index * .06, ease: [.16, 1, .3, 1] }}>
                  <span className="expertise-studio__node-icon">{createElement(discipline.icon)}</span>
                  <span className="expertise-studio__node-label">{discipline.node}<small>{discipline.title}</small></span>
                </Motion.div>
              ))}
            </div>
            <p className="expertise-studio__flow-caption">A view of how the stack comes together.</p>

            <Motion.div key={selected.id} className="expertise-studio__content" initial={reduce ? false : { opacity: .65, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : .3, ease: [.16, 1, .3, 1] }}>
              <div className="expertise-studio__summary"><h3>{selected.label}</h3><p>{selected.description}</p></div>
              <div className="expertise-studio__tools-heading"><h4>Tools in this layer</h4><span>{items.length} technologies</span></div>
              <ul className="expertise-studio__tools">
                {items.map((skill, index) => <Motion.li key={skill.name} initial={reduce ? false : { opacity: .65, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : .28, delay: reduce ? 0 : Math.min(index * .025, .15), ease: [.16, 1, .3, 1] }}><span className="expertise-studio__tool-icon"><img className={skill.invert ? "is-inverted" : ""} src={iconUrl(skill.icon)} alt="" width="24" height="24" loading="lazy" onError={event => { event.currentTarget.style.visibility = "hidden"; }} /></span><span>{skill.name}</span></Motion.li>)}
              </ul>
            </Motion.div>
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{selected.title}: {items.length} technologies.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
