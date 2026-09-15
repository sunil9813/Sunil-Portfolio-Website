import { TertiaryButton } from "@/components/customeUI/Button";
import { ServiceCard } from "../about/Service";
import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { FiArrowRight, FiBookOpen, FiCode, FiFileText, FiFolder, FiGrid, FiLayers, FiSearch, FiCheckCircle } from "react-icons/fi";
import "./HeroLaunch.scss";

const projectColumns = [
  { title: "Interface", tone: "cyan", tasks: [["Responsive layouts", "React · Tailwind"], ["Reusable components", "Design systems"], ["Accessible interactions", "Keyboard & focus"]] },
  { title: "Application", tone: "violet", tasks: [["Connected experiences", "MERN stack"], ["Content & learning", "Courses · Notes"], ["Clear user journeys", "Frontend development"]] },
  { title: "Foundation", tone: "peach", tasks: [["API architecture", "Node.js · Express"], ["Structured data", "MongoDB"], ["Ready for the next step", "Testing · Deployment"]] },
];

function PortfolioWorkspace() {
  return <div className="launch-workspace" aria-hidden="true">
    <aside className="launch-workspace__rail"><span className="launch-workspace__monogram">G</span><FiGrid /><FiFolder /><FiBookOpen /><FiFileText /><FiCode /></aside>
    <aside className="launch-workspace__sidebar"><strong>GORKcoder</strong><div className="launch-workspace__search"><FiSearch /> Search my work</div><span className="is-selected"><FiGrid /> Overview</span><span><FiFolder /> Projects</span><span><FiBookOpen /> Courses</span><span><FiFileText /> Notes</span><small>MY TOOLKIT</small><span>React</span><span>Node.js</span><span>MongoDB</span></aside>
    <div className="launch-workspace__board"><div className="launch-workspace__breadcrumb">Portfolio <span>/</span> Full-stack development</div><header><h3>Ideas into experiences.</h3><span className="launch-workspace__avatar">SBK</span></header><div className="launch-workspace__tabs"><span><FiGrid /> The build</span><span><FiLayers /> Every layer</span></div><div className="launch-workspace__columns">{projectColumns.map(column => <div className={`launch-workspace__column launch-workspace__column--${column.tone}`} key={column.title}><h4><i />{column.title}<span>···</span></h4>{column.tasks.map(([title, label], i) => <div className="launch-workspace__task" key={title}><p>{title}</p><small>{label}</small>{i === 1 && <div className="launch-workspace__lines"><i /><i /><i /></div>}<footer><FiCode /><span>GORKcoder</span><FiCheckCircle /></footer></div>)}</div>)}</div></div>
    <aside className="launch-workspace__activity"><strong>Build. Learn. Share.</strong><span className="launch-workspace__activity-tab">Inside my portfolio</span>{[["Projects","Ideas brought to life with full-stack development."],["Courses","IT subjects, made easier to explore."],["Notes","Practical lessons from the work along the way."]].map(([title, copy]) => <div key={title}><i /><p><b>{title}</b>{copy}</p></div>)}</aside>
  </div>;
}

export const Hero = () => {
  const section = useRef(null);
  const inView = useInView(section);
  const reduced = useReducedMotion();
  return <section ref={section} className={`hero-launch${inView && !reduced ? " is-animated" : ""}`} aria-labelledby="home-hero-title">
    <div className="hero-launch__atmosphere" aria-hidden="true"><div className="hero-launch__mist hero-launch__mist--one" /><div className="hero-launch__mist hero-launch__mist--two" /></div>
    <div className="container hero-launch__inner">
      <div className="hero-launch__opening">
        <div className="hero-launch__copy"><h1 id="home-hero-title">Bringing ideas<br />to full-stack life.</h1><p>Crafting scalable, secure, and modern web applications with thoughtful interfaces and dependable backend architecture.</p><a className="hero-launch__button" href="/project"><span>Explore my work</span><FiArrowRight /></a></div>
        <svg className="hero-launch__beam" viewBox="0 0 1240 720" preserveAspectRatio="none" aria-hidden="true">
          <defs><filter id="launch-bloom" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="24" /></filter><filter id="launch-soft" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6" /></filter><linearGradient id="launch-beam-color" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#777dff" /><stop offset=".7" stopColor="#b1b2ff" /><stop offset="1" stopColor="#ffffff" /></linearGradient></defs>
          <g className="hero-launch__beam-glow" fill="none" stroke="#738dff" strokeWidth="60" filter="url(#launch-bloom)"><path d="M760 -80 V460 Q760 714 555 714 H15" /><path d="M760 -80 V460 Q760 714 940 714 H1210" /></g>
          <g fill="none" stroke="url(#launch-beam-color)" strokeWidth="15" filter="url(#launch-soft)"><path d="M760 -80 V460 Q760 714 555 714 H15" /><path d="M760 -80 V460 Q760 714 940 714 H1210" /></g>
          <path d="M760 400 C760 670 700 714 555 714 H940 C810 714 760 665 760 400Z" fill="#f5f2ff" filter="url(#launch-soft)" opacity=".9" />
          <g fill="none" stroke="#f5f2ff" strokeWidth="3"><path d="M760 -80 V460 Q760 714 555 714 H15" /><path d="M760 -80 V460 Q760 714 940 714 H1210" /></g>
        </svg>
      </div>
      <div className="hero-launch__preview"><PortfolioWorkspace /></div>
      <div className="hero-launch__footnote"><span>Illustrated portfolio workflow</span><a href="/contact">Have a project in mind? Let’s talk <FiArrowRight /></a></div>
    </div>
  </section>;
};

export const WhyToSelect = () => {
  return (
    <section className="home-services relative z-10 overflow-hidden py-20 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-white/[0.055] blur-[110px]" />

      <div className="container">
        <div className="heading relative z-10 mx-auto mb-12 max-w-3xl text-center">
          <h2 className="blog-detail-title text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">Clean builds. Smooth performance. Real results.</h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 textColor opacity-70 sm:text-base">
            I combine hands-on experience with a problem-solving mindset to build fast, functional, and future-ready web solutions tailored to your goals.
          </p>
        </div>

        <ServiceCard />
      </div>
    </section>
  );
};

export const Welcome = () => {
  return (
    <section className="welcome-home relative z-10 overflow-hidden py-8 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.12),transparent_32%)]" />

      <div className="relative min-h-[58vh] sm:min-h-[68vh] lg:min-h-[82vh]">
        <div className="heading absolute left-1/2 top-1/2 z-20 w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="mb-4 text-sm font-medium textColor opacity-80 sm:text-base">We welcome you to join us.</p>

          <h2 className="mb-7 text-4xl font-semibold leading-none tracking-[-0.03em] text-white sm:text-6xl lg:text-8xl">Start your journey</h2>

          <TertiaryButton>Join Now</TertiaryButton>
        </div>

        <video autoPlay muted loop playsInline className="relative z-10 min-h-[58vh] w-full object-contain opacity-95 sm:min-h-[68vh] lg:min-h-[82vh]">
          <source src="/image/loading.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};
