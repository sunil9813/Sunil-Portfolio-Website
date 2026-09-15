import { motion as Motion, useReducedMotion } from "motion/react";
import { FiArrowUpRight, FiCode, FiLayers, FiMonitor } from "react-icons/fi";
import { Link } from "react-router-dom";

const projectFrames = [
  { image: "/image/home/project-collage/ui8-card-01.avif", title: "Portfolio Dashboard", className: "project-collage__photo--one" },
  { image: "/image/home/project-collage/ui8-card-02.avif", title: "IT Course Platform", className: "project-collage__photo--two" },
  { image: "/image/home/project-collage/ui8-card-03.avif", title: "Resource Marketplace", className: "project-collage__photo--three" },
  { image: "/image/home/project-collage/ui8-card-04.avif", title: "Authentication Dashboard", className: "project-collage__photo--four" },
  { image: "/image/home/project-collage/ui8-card-05.avif", title: "Content Management", className: "project-collage__photo--five" },
  { image: "/image/home/project-collage/ui8-card-06.avif", title: "Responsive Interfaces", className: "project-collage__photo--six" },
  { image: "/image/home/project-collage/ui8-card-07.avif", title: "Project Experience", className: "project-collage__photo--seven" },
  { image: "/image/home/project-collage/ui8-card-08.avif", title: "GORKcoder System", className: "project-collage__photo--eight" },
];

const frameMotion = {
  hidden: { opacity: 0, y: 34, scale: 0.94 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, delay: 0.08 + index * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const ProjectCollage = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="project-collage" aria-labelledby="project-collage-title">
      <div className="project-collage__board container">
        <div className="project-collage__copy">
          <h2 id="project-collage-title">Products shaped with purpose.</h2>
          <p>
            From IT learning platforms to authenticated dashboards, every build connects thoughtful interface design with practical full-stack engineering.
          </p>
          <Link to="/project">
            Explore my projects <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>

        <p className="project-collage__note project-collage__note--left">
          Clear product thinking keeps every screen useful, focused, and ready for real users.
        </p>
        <p className="project-collage__note project-collage__note--right">
          Design, frontend, backend, and launch—built as one connected experience.
        </p>

        <div className="project-collage__photos" aria-label="Selected project concepts">
          {projectFrames.map((project, index) => (
            <Motion.figure
              className={`project-collage__photo ${project.className}`}
              variants={reduceMotion ? undefined : frameMotion}
              initial={reduceMotion ? false : "hidden"}
              whileInView={reduceMotion ? undefined : "visible"}
              viewport={{ once: true, amount: 0.12 }}
              custom={index}
              key={project.title}
            >
              <img src={project.image} alt={`${project.title} interface concept`} />
              <figcaption>{project.title}</figcaption>
            </Motion.figure>
          ))}
        </div>

        <div className="project-collage__badge project-collage__badge--brand">GORKcoder</div>
        <div className="project-collage__badge project-collage__badge--stack"><FiCode aria-hidden="true" /> MERN products</div>
        <div className="project-collage__badge project-collage__badge--craft"><FiLayers aria-hidden="true" /> Design · Develop · Deliver</div>
        <div className="project-collage__badge project-collage__badge--screen"><FiMonitor aria-hidden="true" /> Ideas into products</div>

        <svg className="project-collage__ribbon" viewBox="0 0 1440 760" aria-hidden="true">
          <path d="M-120 618C28 505 141 676 282 570C400 481 367 347 520 330C689 311 704 472 858 431C1004 392 1017 202 1194 176C1314 158 1387 205 1510 108" />
        </svg>
      </div>
    </section>
  );
};
