import { createElement, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { FiArrowRight, FiArrowUpRight, FiBookOpen, FiCode, FiFileText, FiPause, FiPlay } from "react-icons/fi";
import { SiReact, SiNodedotjs, SiMongodb } from "react-icons/si";
import "./BeyondJustCode.scss";

const scenes = [
  { id: "build", label: "Build", subject: "Full-stack projects", heading: ["Ideas into", "experiences."], description: "Thoughtful interfaces and connected systems. Ideas brought to life, one layer at a time.", action: "Explore my projects", to: "/project", tone: "#92d8df", icon: FiCode, tags: [{ text: "React", icon: SiReact }, { text: "Node.js", icon: SiNodedotjs }, { text: "MongoDB", icon: SiMongodb }], caption: "The full-stack assembly" },
  { id: "learn", label: "Learn", subject: "Build your knowledge", heading: ["Make room", "to grow."], description: "Explore IT courses that turn complex subjects into approachable, practical lessons.", action: "Explore courses", to: "/courses", tone: "#dfb28a", icon: FiBookOpen, tags: [{ text: "Courses" }, { text: "Practical lessons" }, { text: "Development" }], caption: "Knowledge, opened up" },
  { id: "share", label: "Share", subject: "Developer notes", heading: ["Useful ideas,", "shared openly."], description: "Keep the useful bits. Practical patterns and lessons from the things I learn along the way.", action: "Read developer notes", to: "/notes", tone: "#b3aef5", icon: FiFileText, tags: [{ text: "Notes" }, { text: "Patterns" }, { text: "Lessons learned" }], caption: "Ideas worth keeping" },
];
const ease = [.16, 1, .3, 1];
const reveal = { enter: { opacity: .7, y: 12 }, shown: { opacity: 1, y: 0 } };

export const BeyondJustCode = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  const [failedArtwork, setFailedArtwork] = useState({});
  const figureRef = useRef(null);
  const controlRefs = useRef([]);
  const inView = useInView(figureRef, { margin: "-8% 0px" });
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 110, damping: 22 });
  const springY = useSpring(pointerY, { stiffness: 110, damping: 22 });
  const scene = scenes[active];
  const floating = inView && pageVisible && !paused && !reduced;
  const selectScene = index => {
    if (index === active) return;
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (paused || reduced) { pointerX.set(0); pointerY.set(0); }
  }, [paused, reduced, pointerX, pointerY]);
  const selectWithKeyboard = (event, index) => {
    const next = event.key === "Home" ? 0 : event.key === "End" ? scenes.length - 1 :
      ["ArrowRight", "ArrowDown"].includes(event.key) ? (index + 1) % scenes.length :
      ["ArrowLeft", "ArrowUp"].includes(event.key) ? (index + scenes.length - 1) % scenes.length : null;
    if (next === null) return;
    event.preventDefault();
    selectScene(next);
    controlRefs.current[next]?.focus();
  };
  const moveArtwork = event => {
    if (reduced || paused || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left - bounds.width / 2) / bounds.width * 14);
    pointerY.set((event.clientY - bounds.top - bounds.height / 2) / bounds.height * 10);
  };
  const resetArtwork = () => { pointerX.set(0); pointerY.set(0); };

  return <section className="beyond-reel" id="beyond-code" aria-labelledby="br-title" style={{ "--reel-tone": scene.tone }}>
    <div className="container">
      <header className="beyond-reel__heading"><h2 id="br-title">Beyond just code<span>.</span></h2><p>Explore what I build, learn, and share.<br />Every detail, connected.</p></header>
      <div className="beyond-reel__toolbar">
        <div className="beyond-reel__scenes" role="tablist" aria-label="Explore build, learn, and share">
          {scenes.map((item, index) => <button type="button" role="tab" key={item.id} id={"br-" + item.id + "-control"} ref={element => { controlRefs.current[index] = element; }} aria-selected={active === index} aria-controls="beyond-stage" tabIndex={active === index ? 0 : -1} onClick={() => selectScene(index)} onKeyDown={event => selectWithKeyboard(event, index)}>
            {active === index && <Motion.span className="beyond-reel__scene-indicator" layoutId="beyond-reel-selected-scene" initial={false} transition={{ duration: reduced ? 0 : .35, ease }} aria-hidden="true" />}
            <span className="beyond-reel__scene-icon" aria-hidden="true">{createElement(item.icon)}</span><span>{item.label}</span>
          </button>)}
        </div>
        <span className="beyond-reel__subject">{scene.subject}</span>
      </div>
      <div className="beyond-reel__stage" id="beyond-stage" role="tabpanel" aria-labelledby={"br-" + scene.id + "-control"}>
        <Motion.div key={scene.id} className="beyond-reel__copy" initial={reduced ? false : "enter"} animate="shown" transition={{ staggerChildren: reduced ? 0 : .06 }}>
          <Motion.h3 variants={reveal} transition={{ duration: reduced ? 0 : .45, ease }}>{scene.heading[0]}<span>{scene.heading[1]}</span></Motion.h3>
          <Motion.p variants={reveal} transition={{ duration: reduced ? 0 : .4, ease }}>{scene.description}</Motion.p>
          <Motion.div className="beyond-reel__action-wrap" variants={reveal} transition={{ duration: reduced ? 0 : .4, ease }}><Link className="beyond-reel__action" to={scene.to}>{scene.action}<span aria-hidden="true"><FiArrowUpRight /></span></Link></Motion.div>
          <Motion.ul className="beyond-reel__tags" aria-label={scene.subject} variants={reveal} transition={{ duration: reduced ? 0 : .4, ease }}>{scene.tags.map(tag => <li key={tag.text}>{tag.icon && createElement(tag.icon, { "aria-hidden": true })}{tag.text}</li>)}</Motion.ul>
        </Motion.div>
        <figure className="beyond-reel__figure" ref={figureRef} onPointerMove={moveArtwork} onPointerLeave={resetArtwork}>
          <Motion.div className="beyond-reel__parallax" style={{ x: springX, y: springY }}>
            <div className="beyond-reel__float" style={{ animationPlayState: floating ? "running" : "paused" }}>
              {scenes.map((item, index) => <Motion.div key={item.id} className="beyond-reel__frame" aria-hidden="true" initial={false} animate={{ opacity: active === index ? 1 : 0, x: reduced || active === index ? 0 : direction * (index < active ? -48 : 48), rotateY: reduced || active === index ? 0 : direction * -12, scale: reduced || active === index ? 1 : .9 }} transition={{ duration: reduced ? 0 : active === index ? .6 : .22, ease }}>
                {failedArtwork[item.id] ? createElement(item.icon, { className: "beyond-reel__artwork-fallback" }) : <img src={"/image/home/beyond-reel-v2/" + item.id + ".webp"} alt="" width="1254" height="1254" loading="lazy" decoding="async" onError={() => setFailedArtwork(previous => ({ ...previous, [item.id]: true }))} />}
              </Motion.div>)}
            </div>
          </Motion.div>
          <figcaption><span>{scene.caption}<small>AI-created illustration</small></span>{!reduced && <button type="button" aria-label={paused ? "Resume floating artwork" : "Pause floating artwork"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}</button>}</figcaption>
        </figure>
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{scene.label}: {scene.subject}.</p>
      <div className="beyond-reel__related">
        <Link to="/project"><h3>Every layer connected <FiArrowUpRight aria-hidden="true" /></h3><p>From the first component to APIs and data. Explore the work behind each experience.</p></Link>
        <Link to="/about"><h3>Care in the details <FiArrowUpRight aria-hidden="true" /></h3><p>Responsive layouts, reusable components, and thoughtful interactions that feel right.</p></Link>
      </div>
      <footer className="beyond-reel__footer"><p>Made with you.<span>From the first idea to the final detail.</span></p><Link to="/contact">Let’s build something <FiArrowRight aria-hidden="true" /></Link></footer>
    </div>
  </section>;
};
