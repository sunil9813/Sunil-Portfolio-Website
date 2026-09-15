import { useRef } from "react";
import { motion as Motion, useInView, useReducedMotion } from "motion/react";
import { FiCode, FiDatabase, FiGlobe, FiServer } from "react-icons/fi";

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
  { number: "01", title: "Interface", label: "Frontend engineering", description: "Responsive interfaces with clear systems, accessible interactions, and purposeful motion.", groups: ["frontend"], icon: FiCode, tone: "cyan" },
  { number: "02", title: "Systems", label: "Backend development", description: "Dependable application logic and APIs designed to remain clear as products grow.", groups: ["backend"], icon: FiServer, tone: "violet" },
  { number: "03", title: "Data", label: "Database architecture", description: "Flexible data foundations that keep information structured, available, and secure.", groups: ["database"], icon: FiDatabase, tone: "peach" },
  { number: "04", title: "Delivery", label: "Cloud & developer tools", description: "A reliable path from local development through testing, deployment, and production.", groups: ["hosting", "tools"], icon: FiGlobe, tone: "cyan" },
];

const iconUrl = (icon) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${icon}`;

export const Expertise = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  return (
    <section className="expertise-index" aria-labelledby="expertise-title" ref={sectionRef}>
      <div className="container">
        <header className="expertise-index__heading">
          <div>
            <span className="expertise-index__eyebrow"><i />My expertise <strong>27 connected technologies</strong></span>
            <h2 id="expertise-title">Every layer, <em>end to end.</em></h2>
          </div>
          <div className="expertise-index__intro">
            <span>Four disciplines, one pipeline</span>
            <p>From the interface a user touches to the systems, data, and delivery pipeline behind it—each layer gets the same care.</p>
          </div>
        </header>

        <div className="expertise-index__ledger">
          {disciplines.map((discipline, index) => {
            const Icon = discipline.icon;
            const items = skills.filter((skill) => discipline.groups.includes(skill.group));
            const rowDelay = reduce ? 0 : index * 0.12;

            return (
              <Motion.div
                className={`expertise-index__row expertise-index__row--${discipline.tone}`}
                key={discipline.title}
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: rowDelay }}
              >
                <span className="expertise-index__ghost-number" aria-hidden="true">{discipline.number}</span>

                <div className="expertise-index__marker">
                  <span>{discipline.number}</span>
                  <i aria-hidden="true" />
                </div>

                <div className="expertise-index__meta">
                  <div className="expertise-index__meta-icon"><Icon aria-hidden="true" /></div>
                  <h3>{discipline.title}</h3>
                  <p className="expertise-index__label">{discipline.label}</p>
                  <p>{discipline.description}</p>
                </div>

                <ul className="expertise-index__chips">
                  {items.map((skill, itemIndex) => (
                    <Motion.li
                      key={skill.name}
                      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: rowDelay + 0.15 + itemIndex * 0.03 }}
                    >
                      <img className={skill.invert ? "is-inverted" : ""} src={iconUrl(skill.icon)} alt="" loading="lazy" />
                      <span>{skill.name}</span>
                    </Motion.li>
                  ))}
                </ul>
              </Motion.div>
            );
          })}
          <div className="expertise-index__terminal" aria-hidden="true"><i /></div>
        </div>

        <div className="expertise-index__footer">
          <span>{skills.length} technologies</span>
          <span>{disciplines.length} disciplines</span>
          <strong>Rooted in production-ready engineering</strong>
        </div>
      </div>
    </section>
  );
};
