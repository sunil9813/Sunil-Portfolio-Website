import { AnimatePresence, LayoutGroup, motion as Motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiCheck, FiCode, FiCompass, FiLayers, FiMessageSquare, FiSend } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./NextSteps.scss";

const steps = [
  {
    title: "Share your project",
    text: "Tell me what you want to build, who it is for, and what a successful launch should achieve.",
    icon: FiMessageSquare,
  },
  {
    title: "Align on the scope",
    text: "We have a focused conversation about features, priorities, timing, and the technical approach.",
    icon: FiCompass,
  },
  {
    title: "Receive a clear plan",
    text: "I shape the work into practical milestones, define the stack, and provide a transparent estimate.",
    icon: FiLayers,
  },
  {
    title: "Build and review",
    text: "Your product moves through interface, frontend, backend, and testing with working milestones to review.",
    icon: FiCode,
  },
  {
    title: "Launch and improve",
    text: "Once everything is ready, I deploy the product and stay available for refinements, support, and new features.",
    icon: FiSend,
    details: ["Focused progress updates", "Reviewable working milestones", "A supported production launch"],
  },
];

const diagramLabels = ['Project brief', 'Interface structure', 'Milestone plan', 'Connected application', 'Production release'];
const diagramEase = [0.16, 1, 0.3, 1];

// An illustrative product blueprint, not a dashboard or a live project status.
const projectDiagram = (active, reduceMotion) => (
  <svg className="next-steps__blueprint" viewBox="0 0 420 218" fill="none" aria-hidden="true">
    <path className="next-steps__diagram-guide" d="M30 198H406M36 194V202M291 194V202" />
    <rect className="next-steps__diagram-frame" x="36" y="22" width="255" height="160" rx="12" />
    <path className="next-steps__diagram-line" d="M36 50H291" />
    {[49, 59, 69].map(x => <circle key={x} className="next-steps__diagram-dot" cx={x} cy="36" r="2" />)}
    <text className="next-steps__diagram-address" x="87" y="39">{diagramLabels[active]}</text>
    <AnimatePresence initial={false}>
      <Motion.g key={active} initial={{ opacity: 0, y: reduceMotion ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : .12 } }} transition={{ duration: reduceMotion ? 0 : .35, ease: diagramEase }}>
        {active === 0 && <>
          <rect className="next-steps__diagram-surface" x="113" y="62" width="101" height="106" rx="6" />
          <Motion.path className="next-steps__diagram-line" d="M129 96H195M129 108H190M129 120H176" initial={{ pathLength: reduceMotion ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduceMotion ? 0 : .65, ease: diagramEase }} />
          <path className="next-steps__diagram-accent" d="M129 80H158M131 141L135 145L142 138M151 142H192" />
          <rect className="next-steps__diagram-note" x="55" y="109" width="72" height="43" rx="7" />
          <path className="next-steps__diagram-accent" d="M69 123H112M69 133H99M82 152V159L91 152" />
          <Motion.path className="next-steps__diagram-accent" d="M230 81H256M243 68V94" initial={{ pathLength: reduceMotion ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduceMotion ? 0 : 0.45, ease: diagramEase }} />
        </>}
        {active === 1 && <>
          <rect className="next-steps__diagram-surface" x="51" y="65" width="44" height="102" rx="5" />
          <path className="next-steps__diagram-line" d="M61 80H85M61 93H80M61 106H85M61 119H76" />
          <rect className="next-steps__diagram-surface" x="106" y="65" width="170" height="43" rx="5" />
          <rect className="next-steps__diagram-surface" x="106" y="119" width="80" height="48" rx="5" />
          <rect className="next-steps__diagram-surface" x="196" y="119" width="80" height="48" rx="5" />
          <Motion.path className="next-steps__diagram-accent" d="M120 79H204M120 91H176M119 133H146M209 133H240" initial={{ pathLength: reduceMotion ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduceMotion ? 0 : 0.5, ease: diagramEase }} />
        </>}
        {active === 2 && <>
          <path className="next-steps__diagram-line" d="M68 78H260" />
          {[['Scope', 51], ['Build', 130], ['Review', 209]].map(([label, x], index) => (
            <g key={label}>
              <circle className="next-steps__diagram-node" cx={x + 33} cy="78" r="5" />
              <rect className="next-steps__diagram-surface" x={x} y="96" width="67" height="70" rx="5" />
              <text className="next-steps__diagram-label" x={x + 10} y="116">{label}</text>
              <Motion.path className="next-steps__diagram-accent" d={`M${x + 11} 130H${x + 48}M${x + 11} 141H${x + 36}`} initial={{ pathLength: reduceMotion ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : index * 0.07, ease: diagramEase }} />
            </g>
          ))}
        </>}
        {active >= 3 && <>
          <rect className="next-steps__diagram-surface" x="51" y="65" width="60" height="102" rx="5" />
          <path className="next-steps__diagram-line" d="M64 101H97M64 114H88M64 127H94M64 140H85" />
          <rect className="next-steps__diagram-fill" x="61" y="76" width="40" height="12" rx="3" />
          <path className="next-steps__diagram-accent" d="M126 72H211M126 84H178" />
          {[100, 123, 146].map((y, index) => <Motion.g key={y} initial={{ opacity: reduceMotion ? 1 : .3, x: reduceMotion ? 0 : -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : .4, delay: reduceMotion ? 0 : index * .09, ease: diagramEase }}>
            <rect className="next-steps__diagram-surface" x="126" y={y} width="150" height="17" rx="4" />
            <circle className="next-steps__diagram-dot" cx="136" cy={y + 8.5} r="2" />
            <path className="next-steps__diagram-line" d={`M145 ${y + 8.5}H${y === 123 ? 211 : 242}`} />
          </Motion.g>)}
        </>}
      </Motion.g>
    </AnimatePresence>
    <Motion.g initial={false} animate={{ opacity: active >= 3 ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.3 }}>
      <path className="next-steps__diagram-line" d="M291 110H310V89H334M310 110V143H334" />
      <Motion.path className="next-steps__diagram-accent" d="M291 110H310V89H334M310 110V143H334" initial={false} animate={{ pathLength: active >= 3 ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.65, ease: diagramEase }} />
      <rect className="next-steps__diagram-surface" x="334" y="72" width="68" height="34" rx="7" />
      <text className="next-steps__diagram-label" x="354" y="93">API</text>
      <path className="next-steps__diagram-surface" d="M334 134C334 123 402 123 402 134V152C402 164 334 164 334 152Z" />
      <path className="next-steps__diagram-line" d="M334 134C334 145 402 145 402 134" />
      <text className="next-steps__diagram-label" x="353" y="156">Data</text>
    </Motion.g>
    <Motion.g initial={false} animate={{ opacity: active === 4 ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }}>
      <Motion.path className="next-steps__diagram-accent" d="M291 60H310V38H337" animate={{ pathLength: active === 4 ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.55, ease: diagramEase }} />
      <rect className="next-steps__diagram-release" x="337" y="23" width="65" height="29" rx="14.5" />
      <path className="next-steps__diagram-accent" d="M349 38L353 42L359 35" />
      <text className="next-steps__diagram-label" x="365" y="42">Live</text>
    </Motion.g>
  </svg>
);

export const NextSteps = () => {
  const reduceMotion = useReducedMotion();
  const journey = useRef(null);
  const items = useRef([]);
  const requestedStep = useRef(null);
  const navigationTimer = useRef(null);
  const [active, setActive] = useState(0);
  const railHeight = useMotionValue(0);
  const railPosition = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: journey, offset: ["start 42%", "end 42%"] });
  const journeyProgress = useSpring(railPosition, { stiffness: 180, damping: 32, mass: 0.4 });

  // Reading position, not a claim that any project milestone has been completed.
  const syncPosition = useCallback(() => {
    const markers = items.current.map(item => item?.querySelector('.next-steps__milestone'));
    if (markers.length !== steps.length || markers.some(marker => !marker)) return;
    const positions = markers.map(marker => {
      const rect = marker.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
    const readingLine = window.innerHeight * 0.42;
    const distance = positions.at(-1) - positions[0];
    railPosition.set(distance > 0 ? Math.min(1, Math.max(0, (readingLine - positions[0]) / distance)) : 0);
    const nearest = positions.reduce((best, position, index) =>
      Math.abs(position - readingLine) < Math.abs(positions[best] - readingLine) ? index : best, 0);
    // Keep direct selection steady while native smooth scrolling passes other steps.
    if (requestedStep.current !== null && nearest !== requestedStep.current) return;
    requestedStep.current = null;
    setActive(current => current === nearest ? current : nearest);
  }, [railPosition]);

  useMotionValueEvent(scrollYProgress, 'change', syncPosition);

  useEffect(() => {
    const measure = () => {
      const markers = items.current.map(item => item?.querySelector('.next-steps__milestone'));
      if (markers.length !== steps.length || markers.some(marker => !marker)) return;
      railHeight.set(Math.max(0, markers.at(-1).getBoundingClientRect().top - markers[0].getBoundingClientRect().top));
      syncPosition();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(journey.current);
    window.addEventListener('resize', measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [railHeight, syncPosition]);

  useEffect(() => {
    const releaseSelection = () => { requestedStep.current = null; syncPosition(); };
    // A previous scroll can finish just after a new step is selected. Keep the
    // selection lock until the requested marker is actually reached.
    const handleScrollEnd = () => syncPosition();
    const handleScrollKey = event => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) releaseSelection();
    };
    window.addEventListener('scrollend', handleScrollEnd);
    window.addEventListener('wheel', releaseSelection, { passive: true });
    window.addEventListener('touchstart', releaseSelection, { passive: true });
    window.addEventListener('keydown', handleScrollKey);
    return () => {
      window.clearTimeout(navigationTimer.current);
      window.removeEventListener('scrollend', handleScrollEnd);
      window.removeEventListener('wheel', releaseSelection);
      window.removeEventListener('touchstart', releaseSelection);
      window.removeEventListener('keydown', handleScrollKey);
    };
  }, [syncPosition]);

  const goToStep = (index) => {
    const marker = items.current[index]?.querySelector('.next-steps__milestone');
    if (!marker) return;
    const bounds = marker.getBoundingClientRect();
    requestedStep.current = index;
    window.clearTimeout(navigationTimer.current);
    window.scrollTo({
      top: Math.max(0, window.scrollY + bounds.top + bounds.height / 2 - window.innerHeight * 0.42),
      behavior: reduceMotion ? 'instant' : 'smooth',
    });
    setActive(index);
    // Fallback for browsers without scrollend, or navigation interrupted externally.
    navigationTimer.current = window.setTimeout(() => { requestedStep.current = null; syncPosition(); }, 1200);
  };

  return (
    <section id="next-steps" className="next-steps next-steps--refined" aria-labelledby="next-steps-title">
      <div className="next-steps__layout container">
        <div className="next-steps__intro">
          <div className="next-steps__heading">
            <h2 id="next-steps-title">What happens <span>next?</span></h2>
            <p>A clear path from the first message to a full-stack product ready for real users.</p>
          </div>
          <Link className="tertiary-button next-steps__action" to="/contact">
            Start your project
          </Link>
          <div className="next-steps__map">
            <div className="next-steps__diagram">{projectDiagram(active, reduceMotion)}</div>
            <nav className="next-steps__navigator" aria-label="Explore the project journey">
              <div className="next-steps__map-track" aria-hidden="true">
                <Motion.i initial={false} animate={{ scaleX: active / (steps.length - 1) }} transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }} />
              </div>
              {steps.map(({ title }, index) => (
                <button type="button" key={title} onClick={() => goToStep(index)} aria-label={`Read step ${index + 1}: ${title}`} aria-controls={`next-step-${index + 1}`} aria-current={active === index ? 'step' : undefined}>
                  {active === index && <Motion.span className="next-steps__node-selection" layoutId="next-steps-node" aria-hidden="true" transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }} />}
                  <span className="next-steps__node-number">{String(index + 1).padStart(2, '0')}</span>
                </button>
              ))}
            </nav>
            <div className="next-steps__map-labels" aria-hidden="true"><span>Your idea</span><span>Working product</span></div>
            <div className="next-steps__reading" aria-hidden="true">
              <span>{String(active + 1).padStart(2, '0')} / 05</span>
              <Motion.span key={active} initial={reduceMotion ? false : { clipPath: 'inset(0 0 100% 0)', opacity: 0.6 }} animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}>{steps[active].title}</Motion.span>
            </div>
          </div>
        </div>

        <div className="next-steps__journey" ref={journey}>
          <Motion.div className="next-steps__rail" style={{ height: railHeight }} aria-hidden="true"><Motion.i style={{ scaleY: reduceMotion ? 1 : journeyProgress }} /></Motion.div>
          <LayoutGroup id="next-steps-reading"><ol className="next-steps__list">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                id={`next-step-${index + 1}`}
                ref={element => { items.current[index] = element; }}
                className={`next-steps__step${step.details ? " next-steps__step--expanded" : ""}${active === index ? ' is-current' : ''}`}
                key={step.title}
              >
                {active === index && <Motion.div className="next-steps__active-surface" layoutId="reading-step" aria-hidden="true" transition={{ duration: reduceMotion ? 0 : .4, ease: diagramEase }} />}
                <span className="next-steps__milestone" aria-hidden="true" />
                <span className="next-steps__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div className="next-steps__content">
                  <div className="next-steps__step-heading"><h3>{step.title}</h3><span className="next-steps__icon" aria-hidden="true"><Icon /></span></div>
                  <p>{step.text}</p>

                  {step.details && (
                    <ul className="next-steps__details">
                      {step.details.map((detail) => (
                        <li key={detail}><FiCheck aria-hidden="true" /><span>{detail}</span></li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
          </ol></LayoutGroup>
        </div>
      </div>
    </section>
  );
};
