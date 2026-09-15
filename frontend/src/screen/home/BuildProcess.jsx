import { motion as Motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const phases = [
  {
    name: "Project discovery",
    tasks: ["Product goals", "Audience needs", "Scope priorities"],
    description: "I turn the initial idea into a clear product direction by identifying the real goal, the people it serves, and the smallest useful version worth building.",
    benefit: "A focused foundation before design or development begins.",
    insight: "Clear discovery keeps the build aligned.",
    metric: "Less rework",
    bars: [88, 56, 28],
    labels: ["Aligned", "Revised", "Unclear"],
  },
  {
    name: "Experience planning",
    tasks: ["User journey", "Page structure", "Feature map"],
    description: "The product is shaped into practical journeys, page relationships, and feature priorities so every screen has a purpose and a natural next step.",
    benefit: "Visitors understand where they are and what to do next.",
    insight: "Good structure reduces friction.",
    metric: "Clearer journeys",
    bars: [84, 61, 35],
    labels: ["Direct", "Guided", "Complex"],
  },
  {
    name: "Interface design",
    tasks: ["Wireframes", "Visual system", "Responsive states"],
    description: "I translate the plan into a distinctive interface system with responsive layouts, reusable patterns, and purposeful motion that fits the product—not a template.",
    benefit: "A consistent experience from mobile to desktop.",
    insight: "Consistency strengthens trust.",
    metric: "Unified interface",
    bars: [91, 68, 32],
    labels: ["Consistent", "Mixed", "Fragmented"],
  },
  {
    name: "Full-stack build",
    tasks: ["React frontend", "Node APIs", "Database model"],
    description: "The approved experience becomes a working MERN application with a responsive React interface, dependable APIs, and a data model designed for real product growth.",
    benefit: "One connected product from interface to database.",
    insight: "Shared architecture improves delivery.",
    metric: "Connected stack",
    bars: [94, 72, 41],
    labels: ["Integrated", "Partial", "Siloed"],
  },
  {
    name: "Quality testing",
    tasks: ["Device checks", "Performance", "Security review"],
    description: "Before release, I test the important journeys across devices, remove performance bottlenecks, and review the application for resilient behavior and safer defaults.",
    benefit: "A smoother, more dependable launch experience.",
    insight: "Testing protects the finished experience.",
    metric: "Release confidence",
    bars: [90, 64, 24],
    labels: ["Ready", "Review", "Risk"],
  },
  {
    name: "Launch & support",
    tasks: ["Production deploy", "Live monitoring", "Iteration"],
    description: "I take the product through deployment, verify the live environment, and continue improving it through measured updates, fixes, and new features as needs evolve.",
    benefit: "A reliable path from launch to continued growth.",
    insight: "Products improve through informed iteration.",
    metric: "Ongoing value",
    bars: [92, 70, 38],
    labels: ["Improving", "Stable", "Stalled"],
  },
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="m7.5 12.2 3 3 6-6.5" />
  </svg>
);

const InsightPanel = ({ phase }) => (
  <div className="build-process__insight">
    <div className="build-process__insight-copy">
      <strong>{phase.insight}</strong>
      <span>{phase.metric}</span>
    </div>
    <div className="build-process__chart" aria-label={`${phase.metric} illustrative comparison`}>
      {phase.bars.map((value, index) => (
        <div className="build-process__bar-column" key={phase.labels[index]}>
          <span className="build-process__bar-value">{value}%</span>
          <span className="build-process__bar" style={{ "--bar-scale": value / 100 }} />
          <small>{phase.labels[index]}</small>
        </div>
      ))}
    </div>
    <small className="build-process__illustrative">Illustrative delivery signal</small>
  </div>
);

export const BuildProcess = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const windowRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const travel = useMotionValue(0);
  const startX = useMotionValue(0);
  const touchProgress = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = manual ? touchProgress : scrollYProgress;
  const trackX = useTransform(() => startX.get() - scrollYProgress.get() * travel.get());
  const progressScale = useTransform(progress, [0, 1], [1 / phases.length, 1]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px), (prefers-reduced-motion: reduce)');
    const measure = () => {
      setManual(query.matches);
      const items = trackRef.current?.children;
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      startX.set(windowRef.current.clientWidth / 2 - first.offsetLeft - first.offsetWidth / 2);
      travel.set(last.offsetLeft + last.offsetWidth / 2 - first.offsetLeft - first.offsetWidth / 2);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(windowRef.current);
    query.addEventListener('change', measure);
    measure();
    return () => { observer.disconnect(); query.removeEventListener('change', measure); };
  }, [startX, travel]);

  useMotionValueEvent(progress, "change", (value) => {
    const nextIndex = Math.max(0, Math.min(phases.length - 1, Math.round(value * (phases.length - 1))));
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  const handleTrackScroll = (event) => {
    if (!manual) return;
    const { scrollLeft, scrollWidth, clientWidth } = event.currentTarget;
    const scrollRange = scrollWidth - clientWidth;
    if (scrollRange <= 0) return;

    touchProgress.set(Math.max(0, Math.min(1, scrollLeft / scrollRange)));
  };

  const activePhase = phases[activeIndex];

  return (
    <section className="build-process" ref={sectionRef} aria-label="How I build full-stack products">
      <div className="build-process__sticky">
        <div className="build-process__timeline" aria-hidden="true">
          <div className="build-process__track-window" ref={windowRef} onScroll={handleTrackScroll}>
            <Motion.div ref={trackRef} className="build-process__track" style={{ x: manual ? 0 : trackX }}>
              {phases.map((phase, index) => (
                <div className={`build-process__phase${index === activeIndex ? " is-active" : index < activeIndex ? " is-complete" : ""}`} style={{ '--phase-lane': [0, 1, 1, 2, 2, 2][index], '--phase-accent': ['#b3aef5', '#92d8df', '#b3aef5', '#eaa879', '#eaa879', '#eaa879'][index] }} key={phase.name}>
                  <div className="build-process__task-row">
                    <span>{phase.tasks[0]}</span>
                    <span>{phase.tasks[1]}</span>
                  </div>
                  <div className="build-process__task-row build-process__task-row--offset">
                    <span>{phase.tasks[2]}</span>
                  </div>
                </div>
              ))}
            </Motion.div>
          </div>
          <div className="build-process__marker">
            <span className="build-process__marker-dot" />
            <span className="build-process__marker-line" />
          </div>
          <div className="build-process__you">
            <svg viewBox="0 0 26 30" aria-hidden="true"><path d="M3 2 22 17l-9 2-4 8L3 2Z" /></svg>
            <span>You</span>
          </div>
        </div>

        <Motion.div
          className="build-process__details container"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <div className="build-process__explanation">
            <div className="build-process__phase-name"><span />{activePhase.name}</div>
            <p>{activePhase.description}</p>
            <div className="build-process__benefit"><CheckIcon /><span>{activePhase.benefit}</span></div>
          </div>
          <InsightPanel phase={activePhase} />
        </Motion.div>

        <div className="build-process__progress" aria-hidden="true">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <i><Motion.b style={{ scaleX: progressScale }} /></i>
          <span>{String(phases.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
};
