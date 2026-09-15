import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as Motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { FiCheckCircle, FiCode, FiCopy, FiGitBranch, FiLayers, FiShield, FiZap } from "react-icons/fi";

const processStages = [
  {
    id: "planning",
    number: "01",
    title: "Planning",
    description: "Turn an idea into a clear product blueprint before development begins.",
    bullets: ["Requirement analysis", "Database and API design", "User-flow planning", "Project architecture"],
  },
  {
    id: "setup",
    number: "02",
    title: "Development setup",
    description: "Prepare a clean workspace where frontend and backend work can move confidently.",
    bullets: ["Repository initialization", "Frontend environment", "Backend environment", "Configuration checks"],
  },
  {
    id: "backend",
    number: "03",
    title: "Backend development",
    description: "Build secure services, business logic, and dependable access to application data.",
    bullets: ["API implementation", "Authentication flow", "Database integration", "Server validation"],
  },
  {
    id: "frontend",
    number: "04",
    title: "Frontend development",
    description: "Translate the blueprint into a responsive, intuitive, and polished user experience.",
    bullets: ["Reusable components", "Responsive layouts", "State management", "API integration"],
  },
  {
    id: "testing",
    number: "05",
    title: "Testing",
    description: "Validate the complete product across its most important user and system paths.",
    bullets: ["Frontend testing", "Backend testing", "Integration checks", "End-to-end verification"],
  },
  {
    id: "deployment",
    number: "06",
    title: "Deployment",
    description: "Release a stable production build with the right environment and delivery checks.",
    bullets: ["Production build", "Cloud deployment", "Environment validation", "Release checks"],
  },
  {
    id: "maintenance",
    number: "07",
    title: "Maintenance",
    description: "Keep the product healthy, secure, and valuable as its requirements continue to evolve.",
    bullets: ["Performance monitoring", "Bug fixes", "Dependency updates", "Feature improvements"],
  },
];

const workflowPaths = [
  "M 7 52 H 96",
  "M 23 52 C 29 52 27 26 34 26 H 52",
  "M 44 52 C 50 52 48 78 55 78 H 74",
  "M 70 52 C 77 52 76 26 83 26 H 96",
];

const featureIcons = [FiCopy, FiShield, FiZap];

export const WorkingProcess = () => {
  const sectionRef = useRef(null);
  const [activeStageId, setActiveStageId] = useState("planning");
  const [isCompactView, setIsCompactView] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches);
  const activeStage = processStages.find((stage) => stage.id === activeStageId) || processStages[0];
  const reduceMotion = useReducedMotion();
  const lineProgress = useMotionValue(reduceMotion ? 1 : 0);
  const smoothLineProgress = useSpring(lineProgress, {
    stiffness: 135,
    damping: 30,
    mass: 0.22,
    restDelta: 0.001,
  });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const lineRevealWidth = useTransform(smoothLineProgress, [0, 1], [0, 100]);
  const previewOpacity = useTransform(smoothLineProgress, [0.24, 0.38], [0, 1]);
  const testOpacity = useTransform(smoothLineProgress, [0.48, 0.62], [0, 1]);
  const releaseOpacity = useTransform(smoothLineProgress, [0.72, 0.86], [0, 1]);
  const mainCheckOpacity = useTransform(smoothLineProgress, [0.3, 0.42], [0, 1]);
  const reviewOpacity = useTransform(smoothLineProgress, [0.43, 0.56], [0, 1]);
  const validationOpacity = useTransform(smoothLineProgress, [0.64, 0.78], [0, 1]);
  const readyOpacity = useTransform(smoothLineProgress, [0.84, 0.98], [0, 1]);

  useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 760px)");
    const syncCompactView = () => {
      setIsCompactView(compactQuery.matches);
      if (compactQuery.matches) lineProgress.set(1);
    };

    syncCompactView();
    compactQuery.addEventListener("change", syncCompactView);
    return () => compactQuery.removeEventListener("change", syncCompactView);
  }, [lineProgress]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isCompactView) {
      lineProgress.set(1);
      return;
    }

    const scaledProgress = latest * processStages.length;
    const stageIndex = Math.min(processStages.length - 1, Math.floor(scaledProgress));
    const rawLocalProgress = latest >= 0.999 ? 1 : Math.max(0, Math.min(1, scaledProgress - stageIndex));
    // Finish each drawing before its stage changes, leaving a short reading pause.
    const localProgress = Math.min(1, rawLocalProgress / 0.82);
    const nextStageId = processStages[stageIndex].id;

    setActiveStageId((current) => current === nextStageId ? current : nextStageId);
    lineProgress.set(reduceMotion ? 1 : localProgress);
  });

  const selectStage = (stageIndex) => {
    const section = sectionRef.current;
    setActiveStageId(processStages[stageIndex].id);

    if (!section || typeof window === "undefined" || isCompactView || section.offsetHeight <= window.innerHeight * 1.2) {
      lineProgress.set(1);
      return;
    }

    const scrollableDistance = section.offsetHeight - window.innerHeight;
    const stageProgress = (stageIndex + 0.16) / processStages.length;
    window.scrollTo({ top: section.offsetTop + scrollableDistance * stageProgress, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="process-showcase process-neon"
      aria-labelledby="process-title"
      style={{ "--process-scroll-height": `${processStages.length * 82}vh` }}
    >
      <div className="process-neon__sticky">
        <div className="container">
        <div className="process-neon__kicker"><FiGitBranch /><span>Working process</span><small>01 — 07</small></div>

        <div className="process-neon__layout">
          <aside className="process-neon__sidebar">
            <span>Development flow</span>
            <div className="process-neon__nav" role="tablist" aria-label="Development stages">
              {processStages.map((stage, stageIndex) => (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={activeStageId === stage.id}
                  className={activeStageId === stage.id ? "is-active" : ""}
                  onClick={() => selectStage(stageIndex)}
                >
                  <i />
                  <strong>{stage.title}</strong>
                  <small>{stage.number}</small>
                </button>
              ))}
            </div>
          </aside>

          <div className="process-neon__main">
            <AnimatePresence initial={false} mode="popLayout">
              <Motion.header
                key={activeStage.id}
                className="process-neon__headline"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 id="process-title"><strong>{activeStage.title}.</strong> {activeStage.description}</h2>
              </Motion.header>
            </AnimatePresence>

            <div className="process-neon__map-scroll">
              <AnimatePresence initial={false} mode="popLayout">
                <Motion.div
                  key={activeStage.id}
                  className="process-neon__map"
                  initial={{ opacity: 0.45 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="process-neon__grid" />
                  <svg className="process-neon__paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    {workflowPaths.map((path) => <path key={`base-${path}`} d={path} className="process-neon__path-base" vectorEffect="non-scaling-stroke" />)}
                    <defs>
                      <clipPath id={`process-line-reveal-${activeStage.id}`}>
                        <Motion.rect x="0" y="0" height="100" initial={false} style={{ width: lineRevealWidth }} />
                      </clipPath>
                    </defs>
                    <g clipPath={`url(#process-line-reveal-${activeStage.id})`}>
                      {workflowPaths.map((path) => (
                        <path key={path} d={path} className="process-neon__path-active" vectorEffect="non-scaling-stroke" />
                      ))}
                    </g>
                  </svg>

                  <div className="planning-pill planning-pill--root"><FiGitBranch /><strong>project/main</strong></div>
                  <Motion.div className="planning-pill planning-pill--preview" style={{ opacity: previewOpacity }}><FiLayers /><strong>{activeStage.bullets[0]}</strong></Motion.div>
                  <Motion.div className="planning-pill planning-pill--test" style={{ opacity: testOpacity }}><FiShield /><strong>{activeStage.bullets[1]}</strong></Motion.div>
                  <Motion.div className="planning-pill planning-pill--release" style={{ opacity: releaseOpacity }}><FiCode /><strong>{activeStage.bullets[2]}</strong></Motion.div>

                  <Motion.div className="planning-check planning-check--one" style={{ opacity: reviewOpacity }}><FiCheckCircle /><span>reviewed</span></Motion.div>
                  <Motion.div className="planning-check planning-check--two" style={{ opacity: validationOpacity }}><FiCheckCircle /><span>validated</span></Motion.div>
                  <Motion.div className="planning-check planning-check--three" style={{ opacity: readyOpacity }}><FiCheckCircle /><span>ready</span></Motion.div>
                  <Motion.div className="planning-check planning-check--four" style={{ opacity: mainCheckOpacity }}><i /><span>{activeStage.bullets[3]}</span></Motion.div>
                </Motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence initial={false} mode="popLayout">
              <Motion.div
                key={`features-${activeStage.id}`}
                className="process-neon__features"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.34, delay: 0.16 }}
              >
                {activeStage.bullets.slice(0, 3).map((bullet, index) => {
                  const FeatureIcon = featureIcons[index];
                  return (
                    <article key={bullet}>
                      <div><FeatureIcon /><h3>{bullet}</h3></div>
                      <p>{index === 0 ? "Define the product direction clearly before implementation starts." : index === 1 ? "Reduce uncertainty by validating the technical foundation early." : "Create a practical path that the next development stage can follow."}</p>
                    </article>
                  );
                })}
              </Motion.div>
            </AnimatePresence>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
