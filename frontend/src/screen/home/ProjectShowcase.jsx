import { getAllProject } from "@/redux/slices/projectSlice";
import { motion as Motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { FiArrowUpRight, FiCode } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const fallbackProjects = [
  {
    _id: "portfolio-dashboard",
    title: "Portfolio Dashboard",
    slug: "portfolio-dashboard",
    metaDescription: "A polished admin experience for managing courses, blogs, notes, projects, users, and authenticated account activity.",
    category: { title: "Dashboard" },
    thumbnail: { filePath: "/image/bg/projectbg.avif" },
    formats: [{ format: "React" }, { format: "Nodejs" }, { format: "MongoDB" }],
  },
  {
    _id: "course-platform",
    title: "IT Course Platform",
    slug: "it-course-platform",
    metaDescription: "A learning surface for IT subjects with course chapters, notes, files, previews, cart flow, and clean content navigation.",
    category: { title: "Education" },
    thumbnail: { filePath: "/image/home/b1.webp" },
    formats: [{ format: "React" }, { format: "API" }, { format: "Payment" }],
  },
  {
    _id: "project-marketplace",
    title: "Project Resource Store",
    slug: "project-resource-store",
    metaDescription: "A project listing and license flow for selling reusable code resources, previews, downloads, and supporting files.",
    category: { title: "Marketplace" },
    thumbnail: { filePath: "/image/home/b2.webp" },
    formats: [{ format: "React" }, { format: "Redux" }, { format: "Nodejs" }],
  },
  {
    _id: "portfolio-system",
    title: "Gorkcoder Portfolio System",
    slug: "gorkcoder-portfolio-system",
    metaDescription: "A dark portfolio experience with animated sections, services, skills, project stories, and a refined contact journey.",
    category: { title: "Portfolio" },
    thumbnail: { filePath: "/image/hero/image.webp" },
    formats: [{ format: "Motion" }, { format: "Sass" }, { format: "React" }],
  },
];

const getCoverImage = (project) => (
  project?.thumbnail?.filePath ||
  project?.thumbnail?.url ||
  project?.thumbnail ||
  "/image/home/b1.webp"
);

const getStackLabels = (project) => {
  const labels = project?.formats?.map((item) => item?.format).filter(Boolean) || [];
  return labels.length ? labels.slice(0, 3) : ["React", "Node", "MongoDB"];
};

const getProjectPath = (project) => (
  project?.slug ? `/project-details/${project.slug}` : "/project"
);

export const ProjectShowcase = () => {
  const dispatch = useDispatch();
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const { projects, isLoading } = useSelector((state) => state.project);
  const posts = useMemo(() => (Array.isArray(projects?.posts) ? projects.posts : []), [projects?.posts]);

  useEffect(() => {
    if (!posts.length) dispatch(getAllProject());
  }, [dispatch, posts.length]);

  const showcaseProjects = useMemo(() => {
    const source = posts.length ? posts : fallbackProjects;
    return source.filter(Boolean);
  }, [posts]);

  useEffect(() => {
    if (activeIndex >= showcaseProjects.length) setActiveIndex(0);
  }, [activeIndex, showcaseProjects.length]);

  const activeProject = showcaseProjects[activeIndex] || showcaseProjects[0] || fallbackProjects[0];
  const collageProjects = showcaseProjects.slice(0, 6);
  const activeStack = getStackLabels(activeProject);

  return (
    <section className="project-gallery" aria-labelledby="project-gallery-title">
      <div className="project-gallery__intro container">
        <h2 id="project-gallery-title">Selected work, built from idea to launch.</h2>
        <div className="project-gallery__intro-copy">
          <p>
            A visual collection of products I have designed and developed—course experiences, authenticated dashboards, resource platforms, and portfolio systems.
          </p>
          <div className="project-gallery__actions">
            <Link to="/project" className="project-gallery__primary">
              Explore every project <FiArrowUpRight aria-hidden="true" />
            </Link>
            <span>{showcaseProjects.length} project{showcaseProjects.length === 1 ? "" : "s"} in the collection</span>
          </div>
        </div>
      </div>

      <Motion.div
        className="project-gallery__scene container"
        initial={reduceMotion ? false : { opacity: 0.82, clipPath: "inset(8% 0 8% 0)" }}
        whileInView={{ opacity: 1, clipPath: "inset(0% 0 0% 0)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg className="project-gallery__route" viewBox="0 0 1200 680" aria-hidden="true">
          <path d="M-70 545C86 430 177 565 318 492C445 427 383 264 551 236C706 210 744 346 882 294C1020 242 1016 92 1288 72" />
        </svg>

        <p className="project-gallery__note project-gallery__note--one">
          Product thinking, interface craft, and dependable engineering in one connected build.
        </p>
        <p className="project-gallery__note project-gallery__note--two">
          Each project is shaped around a real user journey—not just a polished screen.
        </p>

        <div className="project-gallery__collage" aria-label="Project preview collage">
          {collageProjects.map((project, index) => (
            <Motion.button
              type="button"
              className={`project-gallery__frame project-gallery__frame--${index + 1}${index === activeIndex ? " is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
              initial={reduceMotion ? false : { opacity: 0, y: 26, rotate: index % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: 0.72, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              key={project?._id || project?.slug || `${project?.title}-${index}`}
              aria-label={`Show ${project?.title || "project"}`}
            >
              <img src={getCoverImage(project)} alt={project?.title || "Project preview"} />
              <span>{project?.category?.title || "Project"}</span>
            </Motion.button>
          ))}
        </div>

        <div className="project-gallery__sticker project-gallery__sticker--stack">
          <FiCode aria-hidden="true" />
          <span>{activeStack.join(" · ")}</span>
        </div>
        <div className="project-gallery__sticker project-gallery__sticker--brand">GORKcoder</div>

        <Motion.article
          className="project-gallery__spotlight"
          key={activeProject?._id || activeProject?.slug || activeProject?.title}
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>{activeProject?.category?.title || "Featured project"}</span>
          <h3>{activeProject?.title || "Featured portfolio project"}</h3>
          <p>{activeProject?.metaDescription || "Explore the product story, implementation, and final experience."}</p>
          <Link to={getProjectPath(activeProject)}>
            View project <FiArrowUpRight aria-hidden="true" />
          </Link>
        </Motion.article>

        <div className="project-gallery__picker" aria-label="Choose a featured project">
          {showcaseProjects.map((project, index) => (
            <button
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => setActiveIndex(index)}
              key={project?._id || project?.slug || `${project?.title}-picker-${index}`}
              aria-label={`Show ${project?.title || `project ${index + 1}`}`}
              aria-pressed={index === activeIndex}
            >
              <img src={getCoverImage(project)} alt="" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      </Motion.div>

      {isLoading && <span className="project-gallery__loading">Loading live projects…</span>}
    </section>
  );
};
