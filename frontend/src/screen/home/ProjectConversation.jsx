import { motion as Motion, useReducedMotion, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const portrait = "/image/home/contact/sunil-studio-diptych.png";
const ease = [.16, 1, .3, 1];

export const ProjectConversation = ({ sectionRef }) => {
  const reduced = useReducedMotion();
  const tiltX = useSpring(0, { stiffness: 180, damping: 28 });
  const tiltY = useSpring(0, { stiffness: 180, damping: 28 });

  const settlePortraits = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const followPointer = (event) => {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = Math.max(-.5, Math.min(.5, (event.clientX - bounds.left) / bounds.width - .5));
    const vertical = Math.max(-.5, Math.min(.5, (event.clientY - bounds.top) / bounds.height - .5));
    tiltX.set(-vertical * 4);
    tiltY.set(horizontal * 5);
  };

  return (
    <section ref={sectionRef} id="project-conversation" className="project-conversation relative z-10 scroll-mt-24 overflow-hidden py-[clamp(56px,6vw,88px)] text-[var(--home-ink)] [--conversation-accent:#c9b9ee] selection:bg-[var(--conversation-accent)] selection:text-[var(--home-canvas)]" aria-labelledby="project-conversation-title">
      <div className="container grid items-center gap-10 min-[900px]:grid-cols-[minmax(0,.9fr)_minmax(0,1.35fr)] min-[900px]:gap-12">
        <div className="min-w-0 max-w-[600px]">
          <h2 id="project-conversation-title" className="m-0 tracking-[-0.035em]">
            <span className="block text-[clamp(27px,2.7vw,38px)] font-medium leading-[1.25]">Let’s talk about your</span>{" "}
            <span className="mt-1 block text-[clamp(43px,4.6vw,64px)] font-semibold leading-[1.12] text-[var(--conversation-accent)]">next project.</span>
          </h2>
          <p className="mb-0 mt-6 max-w-[38ch] text-[14px] leading-[1.85] text-[var(--home-muted)] min-[1280px]:text-[15px]">
            From the first idea to a working product. Let’s explore what we can build together.
          </p>
          <Link to="/contact" className="group/conversation relative mt-7 inline-flex h-10 items-center justify-center gap-5 overflow-hidden rounded-full bg-[var(--conversation-accent)] py-0 pl-5 pr-[6px] text-[12px] font-semibold text-[var(--home-canvas)] shadow-[inset_0_1px_1px_rgba(255,255,255,.7),inset_0_-3px_8px_rgba(19,22,28,.12)] transition-[background-color,transform] duration-200 hover:bg-[#ddd1f6] active:scale-[.98] focus-visible:!outline-[var(--conversation-accent)] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-translate-x-[160%] before:-skew-x-12 before:bg-white/20 before:transition-transform before:duration-700 before:ease-[cubic-bezier(.16,1,.3,1)] hover:before:translate-x-[400%] focus-visible:before:translate-x-[400%] motion-reduce:transform-none motion-reduce:before:hidden">
            <span className="relative">Start a conversation</span>
            <span className="relative grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--home-canvas)] text-[var(--conversation-accent)] transition-colors duration-200 group-hover/conversation:text-[#ddd1f6]" aria-hidden="true">
              <FiArrowUpRight className="size-[15px] transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover/conversation:-translate-y-7 group-hover/conversation:translate-x-7 group-focus-visible/conversation:-translate-y-7 group-focus-visible/conversation:translate-x-7 motion-reduce:!transform-none" />
              <FiArrowUpRight className="absolute size-[15px] -translate-x-7 translate-y-7 transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover/conversation:translate-x-0 group-hover/conversation:translate-y-0 group-focus-visible/conversation:translate-x-0 group-focus-visible/conversation:translate-y-0 motion-reduce:hidden" />
            </span>
          </Link>
        </div>

        <Motion.figure className="m-0 w-full min-w-0 max-w-[720px]" initial={false} whileInView="assembled" viewport={{ once: true, amount: .3 }}>
          <Motion.div className="group/portraits relative rounded-full bg-[#24232e] p-2"
            style={{ rotateX: reduced ? 0 : tiltX, rotateY: reduced ? 0 : tiltY, transformPerspective: 1000 }}
            onPointerMove={followPointer} onPointerLeave={settlePortraits} onPointerCancel={settlePortraits}
            role="img" aria-label="Two AI-styled studio portraits of Sunil B.K, based on his profile photo">
            <svg className="pointer-events-none absolute inset-0 size-full overflow-visible text-[var(--conversation-accent)]" viewBox="0 0 720 360" preserveAspectRatio="none" aria-hidden="true">
              <Motion.rect x=".75" y=".75" width="718.5" height="358.5" rx="179.25" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity=".3"
                variants={{ assembled: reduced ? { pathLength: 1, opacity: .3, transition: { duration: 0 } } : {
                  pathLength: [0, 1], opacity: [.15, .65, .3], transition: { duration: 1.1, ease },
                } }} />
            </svg>
            <div className="grid grid-cols-2 gap-[clamp(7px,1vw,12px)] overflow-hidden rounded-full">
            {[false, true].map((second) => (
              <Motion.div key={String(second)} data-portrait-panel={second ? "second" : "first"} className="relative aspect-square min-w-0 overflow-hidden rounded-full"
                variants={{ assembled: {
                  x: reduced ? 0 : [second ? 12 : -12, 0],
                  transition: { duration: reduced ? 0 : .7, ease, delay: reduced || !second ? 0 : .08 },
                } }}>
                <Motion.div className="absolute inset-0" variants={{ assembled: { scale: reduced ? 1 : [1.05, 1], transition: { duration: reduced ? 0 : .85, ease, delay: reduced || !second ? 0 : .08 } } }}>
                  <img src={portrait} alt="" width="1536" height="768" loading="lazy" decoding="async" draggable="false"
                    className={"absolute left-1/2 top-0 h-full w-auto max-w-none transition-[scale] duration-500 ease-[cubic-bezier(.16,1,.3,1)] [@media(hover:hover)]:group-hover/portraits:scale-[1.025] motion-reduce:transition-none motion-reduce:!scale-100 " + (second ? "-translate-x-[75%]" : "-translate-x-[25%]")} />
                </Motion.div>
              </Motion.div>
            ))}
            </div>
          </Motion.div>
        </Motion.figure>
      </div>
    </section>
  );
};
