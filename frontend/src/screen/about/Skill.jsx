import { mernSkillsData } from "@/assets/dummyData";
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "motion/react";
import { FiActivity, FiBox, FiCode, FiDatabase, FiLayers, FiTool, FiZap } from "react-icons/fi";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
};

const skillGroups = [
  {
    id: "interface",
    number: "01",
    title: "Interface",
    heading: "Interface engineering",
    description: "Responsive interfaces, reusable UI systems, and predictable application state.",
    icon: <FiCode />,
    accent: "179, 174, 245",
    label: "UI · State · Language",
    categories: ["Frontend", "Language", "State Management"],
  },
  {
    id: "systems",
    number: "02",
    title: "Systems & data",
    heading: "Application systems",
    description: "Backend services, structured APIs, and dependable data layers made to scale.",
    icon: <FiDatabase />,
    accent: "146, 216, 223",
    label: "API · Server · Data",
    categories: ["Backend", "Database"],
  },
  {
    id: "delivery",
    number: "03",
    title: "Delivery",
    heading: "Product delivery",
    description: "Design, testing, version control, and cloud tools that move work into production.",
    icon: <FiTool />,
    accent: "234, 168, 121",
    label: "Design · Test · Cloud",
    categories: ["Design", "Testing", "Version Control", "Cloud"],
  },
];

const coreSkillNames = ["React JS", "Node.js", "MongoDB", "Express.js"];
const proficiencyScore = { Expert: 96, Advanced: 82, Intermediate: 66 };

export const Skill = () => {
  const [activeGroupId, setActiveGroupId] = useState("interface");

  const groups = useMemo(
    () => skillGroups.map((group) => ({
      ...group,
      skills: mernSkillsData.filter((skill) => group.categories.includes(skill.category)),
    })),
    [],
  );

  const coreSkills = useMemo(
    () => coreSkillNames.map((name) => mernSkillsData.find((skill) => skill.name === name)).filter(Boolean),
    [],
  );

  const activeGroup = groups.find((group) => group.id === activeGroupId) || groups[0];
  const categoryCount = new Set(mernSkillsData.map((skill) => skill.category)).size;

  return (
    <section className="skills-showcase skills-ecosystem skills-ecosystem--next" aria-labelledby="skills-title">
      <div className="container">
        <Motion.header className="skills-showcase__header" {...reveal}>
          <span className="skills-showcase__eyebrow"><FiLayers /> Technical ecosystem</span>
          <h2 id="skills-title">A connected stack.<br /><span>Built to ship.</span></h2>
          <p>Every tool has a purpose. Together, they form a practical system for designing, developing, testing, and deploying complete digital products.</p>
        </Motion.header>

        <Motion.div
          className="skill-system"
          style={{ "--skill-accent": activeGroup.accent }}
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.06 }}
        >
          <aside className="skill-system__sidebar">
            <div className="skill-system__sidebar-head">
              <span><FiActivity /> Stack navigator</span>
              <small><i /> Live</small>
            </div>

            <div className="skill-system__tabs" role="tablist" aria-label="Skill categories">
              {groups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  role="tab"
                  aria-selected={activeGroupId === group.id}
                  className={activeGroupId === group.id ? "is-active" : ""}
                  onClick={() => setActiveGroupId(group.id)}
                >
                  <span>{group.icon}</span>
                  <span className="skill-system__tab-copy"><strong>{group.title}</strong><em>{group.label}</em></span>
                  <small>{String(group.skills.length).padStart(2, "0")}</small>
                </button>
              ))}
            </div>

            <div className="skill-system__summary">
              <div><strong>{String(mernSkillsData.length).padStart(2, "0")}</strong><span>Technologies</span></div>
              <div><strong>{String(categoryCount).padStart(2, "0")}</strong><span>Disciplines</span></div>
              <div><strong>04+</strong><span>Years building</span></div>
            </div>

            <p className="skill-system__note"><i /> Select a capability to explore the tools behind it.</p>
          </aside>

          <div className="skill-system__stage">
            <div className="skill-system__stage-head">
              <div>
                <span>{activeGroup.number} / Capability</span>
                <h3>{activeGroup.heading}</h3>
                <p>{activeGroup.description}</p>
                <div className="skill-system__categories">
                  {activeGroup.categories.map((category) => <small key={category}>{category}</small>)}
                </div>
              </div>
              <div className="skill-system__signal"><i /><span>System online</span></div>
            </div>

            <div className="skill-system__body">
              <div className="skill-orbit" aria-label="Core MERN stack">
                <div className="skill-orbit__grid" />
                <div className="skill-orbit__aura" />
                <svg className="skill-orbit__links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M50 50 L50 15" />
                  <path d="M50 50 L86 50" />
                  <path d="M50 50 L50 85" />
                  <path d="M50 50 L14 50" />
                </svg>
                <div className="skill-orbit__ring skill-orbit__ring--outer" />
                <div className="skill-orbit__ring skill-orbit__ring--inner" />
                <div className="skill-orbit__core"><span className="skill-orbit__core-icon"><FiBox /></span><strong>MERN</strong><span>Core stack</span><small>04 connected</small></div>
                {coreSkills.map((skill, index) => (
                  <Motion.div
                    key={skill.name}
                    className={`skill-orbit__node skill-orbit__node--${index + 1}`}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.16 + index * 0.08, type: "spring", stiffness: 180, damping: 16 }}
                    whileHover={{ scale: 1.08, y: -3 }}
                    title={`${skill.name} — ${skill.proficiency}`}
                  >
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <img src={skill.icon} alt="" loading="lazy" />
                    <span>{skill.name}</span>
                  </Motion.div>
                ))}
                <div className="skill-orbit__caption"><FiZap /><span>Production-ready foundation</span></div>
              </div>

              <div className="skill-system__capability" role="tabpanel">
                <header className="skill-system__capability-head">
                  <div><span>Selected toolchain</span><strong>{String(activeGroup.skills.length).padStart(2, "0")} technologies</strong></div>
                  <small><i /> Proficiency</small>
                </header>
                <AnimatePresence mode="wait">
                  <Motion.div
                    key={activeGroup.id}
                    className="skill-system__skill-grid"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -14 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {activeGroup.skills.map((skill, index) => (
                      <Motion.div
                        className="ecosystem-skill"
                        key={skill.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.025 }}
                        whileHover={{ y: -2 }}
                        data-proficiency={skill.proficiency?.toLowerCase()}
                      >
                        <span className="ecosystem-skill__icon"><img src={skill.icon} alt="" loading="lazy" /></span>
                        <div className="ecosystem-skill__copy">
                          <div><strong>{skill.name}</strong><small>{skill.category}</small></div>
                          <span className="ecosystem-skill__meter"><i style={{ width: `${proficiencyScore[skill.proficiency] || 60}%` }} /></span>
                        </div>
                        <em>{skill.proficiency}</em>
                      </Motion.div>
                    ))}
                  </Motion.div>
                </AnimatePresence>
                <footer className="skill-system__capability-foot"><i /><span>Tools selected for maintainable, scalable product development.</span></footer>
              </div>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};
