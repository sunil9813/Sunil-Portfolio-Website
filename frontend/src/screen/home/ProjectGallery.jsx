import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { getAllProject } from "@/redux/slices/projectSlice";
import "./ProjectGallery.scss";

const referenceCover = "/image/home/story-ui8/workflow-preview.jpg";

function ProjectCover({ project }) {
  const source = project.thumbnail?.filePath || project.thumbnail?.url;
  const [failed, setFailed] = useState(false);
  const isReference = !source || failed;
  return (
    <div className="project-gallery__cover">
      <img src={isReference ? referenceCover : source} alt={isReference ? "UI8 Nodeflow interface reference, not a screenshot of this project" : `${project.title} preview`} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      {isReference && <span className="project-gallery__reference">UI8 reference · project preview coming soon</span>}
      <span className="project-gallery__open" aria-hidden="true"><FiArrowUpRight /></span>
    </div>
  );
}

export const ProjectGallery = () => {
  const dispatch = useDispatch();
  const { projects, isLoading, isError } = useSelector((state) => state.project);
  const [category, setCategory] = useState("All projects");
  const reducedMotion = useReducedMotion();
  const posts = Array.isArray(projects?.posts) ? projects.posts : [];
  const categories = ["All projects", ...new Set(posts.map((project) => project.category?.title).filter(Boolean))];
  const visible = category === "All projects" ? posts : posts.filter((project) => project.category?.title === category);

  useEffect(() => { dispatch(getAllProject()); }, [dispatch]);

  return (
    <section className="project-gallery container" aria-labelledby="project-gallery-title">
      <header className="project-gallery__header">
        <h2 id="project-gallery-title">Ideas, built.<br /><span>Explore my work.</span></h2>
        <p>Interfaces, applications, and the systems behind them. Explore my projects and take a closer look at how they work.</p>
      </header>
      {posts.length > 0 && <div className="project-gallery__toolbar">
        <div className="project-gallery__filters" aria-label="Filter projects by category">
          {categories.map((name) => <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}
        </div>
        <span className="project-gallery__count" aria-live="polite">{visible.length} {visible.length === 1 ? "project" : "projects"}</span>
      </div>}
      {isLoading && posts.length === 0 ? <div className="project-gallery__status" role="status">Loading projects…</div> : posts.length === 0 ? <div className="project-gallery__status" role="status">
        <h3>{isError ? "Projects couldn’t load." : "New work is on its way."}</h3>
        <p>{isError ? "Please try again to see my latest work." : "Published projects will appear here as they’re added."}</p>
        {isError && <button type="button" onClick={() => dispatch(getAllProject())}>Try again</button>}
      </div> : <div className="project-gallery__grid">
        {visible.map((project) => <Motion.article key={project._id || project.slug || project.title} initial={false} whileHover={reducedMotion ? undefined : { y: -5 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
          {project.slug ? <Link className="project-gallery__link" to={`/project-details/${project.slug}`} aria-label={`Explore ${project.title}`}><ProjectCover project={project} /><div className="project-gallery__caption"><h3>{project.title}</h3><span>{project.category?.title || "Web development"}</span></div></Link> : <><ProjectCover project={project} /><div className="project-gallery__caption"><h3>{project.title}</h3><span>{project.category?.title || "Web development"}</span></div></>}
          {project.metaDescription && <p className="project-gallery__description">{project.metaDescription}</p>}
        </Motion.article>)}
      </div>}
      <footer className="project-gallery__footer"><span>Want to build something together?</span><Link to="/contact">Let’s talk <FiArrowUpRight aria-hidden="true" /></Link></footer>
    </section>
  );
};
