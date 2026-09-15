import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

export const ProjectConversation = () => (
  <section className="project-conversation" aria-labelledby="project-conversation-title">
    <div className="container project-conversation__layout">
      <div className="project-conversation__copy">
        <h2 id="project-conversation-title">Let’s talk about your <span>next project.</span></h2>
        <p className="project-conversation__description">From the first idea to a working product. Let’s explore what we can build together.</p>
        <Link to="/contact" className="project-conversation__link">
          Start a conversation <span aria-hidden="true"><FiArrowUpRight /></span>
        </Link>
      </div>
      <figure className="project-conversation__visual">
      <div className="project-conversation__portraits" role="img" aria-label="Two AI-styled studio portraits of Sunil B.K, based on his profile photo">
        <div className="project-conversation__portrait">
          <img src="/image/home/contact/sunil-studio-diptych.png" alt="" width="1536" height="768" loading="lazy" decoding="async" />
        </div>
        <div className="project-conversation__portrait project-conversation__portrait--second">
          <img src="/image/home/contact/sunil-studio-diptych.png" alt="" width="1536" height="768" loading="lazy" decoding="async" />
        </div>
      </div>
      <figcaption className="project-conversation__caption">
        <span className="project-conversation__identity">Sunil B.K <span> / </span> GORKcoder</span>
        <span className="project-conversation__role">Full-stack developer</span>
      </figcaption>
      </figure>
    </div>
  </section>
);
