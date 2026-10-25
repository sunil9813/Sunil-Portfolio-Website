import { motion as Motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ProcessFlower } from "./ProcessFlower";
import { ProcessVisual } from "./ProcessVisual";
import { buildProcessColors } from "./phaseColors";
import "./BuildProcess.scss";

const phases = [
  {
    name: "Project discovery",
    tasks: ["Product goals", "Audience needs", "Scope priorities"],
    description: "I turn the initial idea into a clear product direction by identifying the real goal, the people it serves, and the smallest useful version worth building.",
    benefit: "A focused foundation before design or development begins.",
    insight: "Clear discovery keeps the build aligned.",
  },
  {
    name: "Experience planning",
    tasks: ["User journey", "Page structure", "Feature map"],
    description: "The product is shaped into practical journeys, page relationships, and feature priorities so every screen has a purpose and a natural next step.",
    benefit: "Visitors understand where they are and what to do next.",
    insight: "Good structure reduces friction.",
  },
  {
    name: "Interface design",
    tasks: ["Wireframes", "Visual system", "Responsive states"],
    description: "I translate the plan into a distinctive interface system with responsive layouts, reusable patterns, and purposeful motion that fits the product—not a template.",
    benefit: "A consistent experience from mobile to desktop.",
    insight: "Consistency strengthens trust.",
  },
  {
    name: "Full-stack build",
    tasks: ["React frontend", "Node APIs", "Database model"],
    description: "The approved experience becomes a working MERN application with a responsive React interface, dependable APIs, and a data model designed for real product growth.",
    benefit: "One connected product from interface to database.",
    insight: "Shared architecture improves delivery.",
  },
  {
    name: "Quality testing",
    tasks: ["Device checks", "Performance", "Security review"],
    description: "Before release, I test the important journeys across devices, remove performance bottlenecks, and review the application for resilient behavior and safer defaults.",
    benefit: "A smoother, more dependable launch experience.",
    insight: "Testing protects the finished experience.",
  },
  {
    name: "Launch & support",
    tasks: ["Production deploy", "Live monitoring", "Iteration"],
    description: "I take the product through deployment, verify the live environment, and continue improving it through measured updates, fixes, and new features as needs evolve.",
    benefit: "A reliable path from launch to continued growth.",
    insight: "Products improve through informed iteration.",
  },
];

const stageMotion = {
  enter: ({ direction, reduced }) => ({ opacity: reduced ? 1 : .45, y: reduced ? 0 : direction * 6 }),
  present: { opacity: 1, y: 0 },
};

const growthLabels = ["The seed", "Taking root", "Growing leaves", "Forming a bud", "Opening up", "In full bloom"];

function Chapter({ phase }) {
  return <div className="process-garden__chapter">
    <h3>{phase.name}</h3>
    <p>{phase.description}</p>
    <p className="process-garden__outcome">{phase.benefit}</p>
  </div>;
}

function TimelineTask({ task, trackX }) {
  const ref = useRef(null);
  const geometry = useMotionValue({ left: 0, width: 1, center: 0 });
  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      const track = el.closest('.process-score__track');
      geometry.set({ left: el.getBoundingClientRect().left - track.getBoundingClientRect().left, width: el.offsetWidth, center: track.children[0].offsetWidth / 2 });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(ref.current);
    measure();
    return () => observer.disconnect();
  }, [geometry]);
  const scaleX = useTransform([trackX, geometry], ([x, box]) => Math.max(0, Math.min(1, (box.center - x - box.left) / box.width)));
  return <span ref={ref} className="process-score__task"><Motion.i aria-hidden="true" style={{ scaleX }} /><span>{task}</span></span>;
}

export const BuildProcess = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const windowRef = useRef(null);
  const activeRef = useRef(0);
  const requestedRef = useRef(null);
  const buttonsRef = useRef([]);
  const touchRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [manual, setManual] = useState(false);
  const target = useMotionValue(0);
  const animatedProgress = useSpring(target, { stiffness: 100, damping: 24, mass: 1, restDelta: .0001 });
  const growthProgress = reduceMotion ? target : animatedProgress;
  const stepWidth = useMotionValue(0);
  const [trackInset, setTrackInset] = useState(0);
  const trackX = useTransform([growthProgress, stepWidth], ([value, width]) => -value * width);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px), (max-height: 650px), (prefers-reduced-motion: reduce)");
    const update = () => { setManual(query.matches); requestedRef.current = null; };
    const resume = () => { requestedRef.current = null; };
    const resumeKey = event => { if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "].includes(event.key)) resume(); };
    update();
    query.addEventListener("change", update);
    window.addEventListener("wheel", resume, { passive: true });
    window.addEventListener("touchstart", resume, { passive: true });
    window.addEventListener("keydown", resumeKey);
    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("wheel", resume);
      window.removeEventListener("touchstart", resume);
      window.removeEventListener("keydown", resumeKey);
    };
  }, []);

  useEffect(() => {
    const measure = () => {
      const first = trackRef.current?.children[0];
      const second = trackRef.current?.children[1];
      if (!first || !second || !windowRef.current) return;
      setTrackInset((windowRef.current.clientWidth - first.offsetWidth) / 2);
      stepWidth.set(second.offsetLeft - first.offsetLeft);
      windowRef.current.scrollLeft = 0;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(windowRef.current);
    measure();
    return () => observer.disconnect();
  }, [stepWidth]);

  const selectPhase = (index) => {
    if (index === activeRef.current) return;
    setDirection(index > activeRef.current ? 1 : -1);
    activeRef.current = index;
    setActiveIndex(index);
  };

  useMotionValueEvent(scrollYProgress, "change", value => {
    if (manual) return;
    const position = Math.max(0, Math.min(1, (value - .04) / .92)) * (phases.length - 1);
    if (requestedRef.current !== null) {
      if (Math.abs(position - requestedRef.current) < .025) requestedRef.current = null;
      return;
    }
    target.set(position);
  });

  // Follow the visible playhead, not the raw scroll position, so text and
  // diagrams change as the spring actually reaches the next chapter.
  useMotionValueEvent(growthProgress, "change", position => {
    if (manual || requestedRef.current !== null) return;
    if (Math.abs(position - activeRef.current) > .56) selectPhase(Math.max(0, Math.min(5, Math.round(position))));
  });

  const goToPhase = index => {
    selectPhase(index);
    target.set(index);
    if (manual) return;
    requestedRef.current = index;
    const section = sectionRef.current;
    window.scrollTo({
      top: window.scrollY + section.getBoundingClientRect().top + (.04 + index / 5 * .92) * (section.offsetHeight - window.innerHeight),
      behavior: "smooth",
    });
  };

  const handleStageKey = (event, index) => {
    const next = event.key === "ArrowRight" ? Math.min(5, index + 1)
      : event.key === "ArrowLeft" ? Math.max(0, index - 1)
      : event.key === "Home" ? 0 : event.key === "End" ? 5 : null;
    if (next === null) return;
    event.preventDefault();
    goToPhase(next);
    buttonsRef.current[next]?.focus({ preventScroll: true });
  };
  const handleSwipe = event => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!manual || !start || !event.changedTouches[0]) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) goToPhase(Math.max(0, Math.min(5, activeRef.current + (dx < 0 ? 1 : -1))));
  };
  const phase = phases[activeIndex];
  const motionContext = { direction, reduced: reduceMotion };

  return <Motion.section id="build-process" ref={sectionRef}
    className="build-process--final process-garden process-garden--growth"
    aria-labelledby="process-garden-heading"
    initial={false} animate={{ '--garden-accent': buildProcessColors[activeIndex] }}
    transition={{ duration: reduceMotion ? 0 : .3 }}>
    <div className="build-process__sticky">
      <ProcessFlower progress={growthProgress} reduced={reduceMotion} />
      <header className="process-garden__intro container mx-auto text-center">
        <h2 id="process-garden-heading" className="m-0 text-[32px] font-medium leading-[1.1] tracking-[-.03em] text-white md:text-[clamp(40px,4vw,58px)]">
          From possibility.<br /><span className="text-[#a8a8a8]">To a working product.</span>
        </h2>
        <p className="mx-auto mb-0 mt-4 max-w-[64ch] text-[14px] leading-[1.8] text-[#bdbdbd]">Every idea starts small. Follow the care that helps it grow.</p>
      </header>

      <nav className="process-score" aria-label="Project timeline">
        <div className="process-score__window" ref={windowRef}
          onTouchStart={event => { const touch = event.touches[0]; touchRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null; }}
          onTouchEnd={handleSwipe} onTouchCancel={() => { touchRef.current = null; }}>
          <Motion.ol className="process-score__track" ref={trackRef} style={{ x: trackX, marginLeft: trackInset }}>
            {phases.map((item, index) => <li key={item.name}
              className={`process-score__phase${index === activeIndex ? ' is-active' : ''}${index < activeIndex ? ' is-complete' : ''}`}
              style={{ '--step-accent': buildProcessColors[index] }}>
              <div className="process-score__ruler" aria-hidden="true">{Array.from({ length: 25 }, (_, tick) => <i key={tick} />)}</div>
              <button type="button" ref={element => { buttonsRef.current[index] = element; }}
                onClick={() => goToPhase(index)} onKeyDown={event => handleStageKey(event, index)}
                aria-current={index === activeIndex ? 'step' : undefined} aria-controls="build-process-detail">
                <small>{String(index + 1).padStart(2, '0')}</small><span>{item.name}</span>
                <span className="process-score__growth">{growthLabels[index]}</span>
              </button>
              <div className="process-score__tasks">
                {item.tasks.map(task => <TimelineTask key={task} task={task} trackX={trackX} />)}
              </div>
            </li>)}
          </Motion.ol>
        </div>
        <div className="process-score__playhead" aria-hidden="true"><svg viewBox="0 0 14 10"><path d="M1 1h12v3L7 9 1 4Z" /></svg><span /></div>
      </nav>

      <div className="process-garden__stage">
        <div className="process-garden__copy">
          <div id="build-process-detail" className="process-garden__copy-window">
            <div className="process-garden__measure" aria-hidden="true">{phases.map(item => <Chapter key={item.name} phase={item} />)}</div>
              <Motion.div key={phase.name} custom={motionContext} variants={stageMotion}
                initial="enter" animate="present"
                transition={{ duration: reduceMotion ? 0 : .32, ease: [.22, 1, .36, 1] }}>
                <Chapter phase={phase} />
              </Motion.div>
          </div>
          <div className="process-garden__controls">
            <span className="process-garden__counter" aria-live="polite" aria-atomic="true">
              <strong>{String(activeIndex + 1).padStart(2, "0")}</strong> / 06 <span className="process-garden__growth-status">{growthLabels[activeIndex]}</span>
              <span className="sr-only"> — {phase.name}</span>
            </span>
            <div className="flex items-center gap-2">
              <button type="button" disabled={activeIndex === 0} onClick={() => goToPhase(activeIndex - 1)} aria-label="Previous build stage" aria-controls="build-process-detail">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6M8 12h12" /></svg>
              </button>
              <button type="button" disabled={activeIndex === 5} onClick={() => goToPhase(activeIndex + 1)} aria-label="Next build stage" aria-controls="build-process-detail">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6M16 12H4" /></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="process-garden__diagram">
          <ProcessVisual index={activeIndex} reduced={reduceMotion} caption={phase.insight} direction={direction} accent="#e9e9e9" />
        </div>
      </div>
      <p className="process-garden__hint">{manual ? "Choose a stage to explore the process" : "Scroll to grow. Or choose a stage."}</p>
    </div>
  </Motion.section>;
};
