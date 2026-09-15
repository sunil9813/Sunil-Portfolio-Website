import { motion as Motion, useReducedMotion } from "motion/react";
import { FiArrowUpRight, FiCheck, FiMousePointer, FiPenTool, FiVideo } from "react-icons/fi";
import { HiOutlinePresentationChartLine, HiOutlineRocketLaunch } from "react-icons/hi2";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Share your project",
    text: "Tell me what you want to build, who it is for, and what a successful launch should achieve.",
    icon: FiPenTool,
    accent: "#a9a1ea",
    iconInk: "#2f286e",
    label: "#c7c2ff",
    action: true,
  },
  {
    title: "Align on the scope",
    text: "We have a focused conversation about features, priorities, timing, and the technical approach.",
    icon: FiVideo,
    accent: "#ffd63b",
    iconInk: "#302867",
    label: "#f6d66b",
  },
  {
    title: "Receive a clear plan",
    text: "I shape the work into practical milestones, define the stack, and provide a transparent estimate.",
    icon: HiOutlinePresentationChartLine,
    accent: "#82d7d1",
    iconInk: "#2d286a",
    label: "#9ce4df",
  },
  {
    title: "Build and review",
    text: "Your product moves through interface, frontend, backend, and testing with working milestones to review.",
    icon: HiOutlineRocketLaunch,
    accent: "#c5d4ed",
    iconInk: "#302a6e",
    label: "#c5d4ed",
  },
  {
    title: "Launch and improve",
    text: "Once everything is ready, I deploy the product and stay available for refinements, support, and new features.",
    icon: FiMousePointer,
    accent: "#342a78",
    iconInk: "#f3f2ef",
    label: "#b3aef5",
    details: ["Focused progress updates", "Reviewable working milestones", "A supported production launch"],
  },
];

export const NextSteps = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="next-steps" aria-labelledby="next-steps-title">
      <div className="next-steps__layout container">
        <div className="next-steps__intro">
          <Motion.svg
            className="next-steps__route"
            viewBox="0 0 560 250"
            fill="none"
            aria-hidden="true"
          >
            <Motion.path
              d="M-20 132C68 127 90 28 42 24C-17 18 10 167 126 177C221 186 201 74 157 78C105 83 157 205 298 196C400 190 424 132 386 121C346 109 349 191 504 184"
              initial={reduceMotion ? false : { pathLength: 0.12, opacity: 0.45 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </Motion.svg>

          <div className="next-steps__heading">
            <h2 id="next-steps-title">What happens next?</h2>
            <p>A clear path from the first message to a full-stack product ready for real users.</p>
          </div>
        </div>

        <ol className="next-steps__list">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Motion.li
                className={`next-steps__step${step.details ? " next-steps__step--expanded" : ""}`}
                style={{
                  "--step-accent": step.accent,
                  "--step-icon-ink": step.iconInk,
                  "--step-label": step.label,
                }}
                key={step.title}
                initial={reduceMotion ? false : { opacity: 0.72, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="next-steps__icon" aria-hidden="true"><Icon /></span>
                <div className="next-steps__content">
                  <span className="next-steps__number">Step {String(index + 1).padStart(2, "0")}</span>
                  <p><strong>{step.title}</strong><span> — {step.text}</span></p>

                  {step.action && (
                    <Link className="next-steps__action" to="/contact">
                      Start your project <FiArrowUpRight aria-hidden="true" />
                    </Link>
                  )}

                  {step.details && (
                    <ul className="next-steps__details">
                      {step.details.map((detail) => (
                        <li key={detail}><FiCheck aria-hidden="true" /><span>{detail}</span></li>
                      ))}
                    </ul>
                  )}
                </div>
              </Motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
