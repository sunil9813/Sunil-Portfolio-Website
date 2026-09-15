import React from "react";
import Typewriter from "typewriter-effect";
import { motion as Motion } from "motion/react";
import { FaFacebookF, FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";
import { FiCheckCircle, FiMapPin } from "react-icons/fi";
import { SiExpress, SiMongodb, SiNodedotjs, SiReact } from "react-icons/si";

export const socialLinks = [
  { id: 1, name: "Facebook", url: "", iconColor: "bg-[#3b5998]", icon: <FaFacebookF size={20} />, designation: "835 Followers", image: "../image/social/facebook.png" },
  { id: 2, name: "GitHub", url: "https://www.github.com", iconColor: "bg-[#000]", icon: <FaGithub size={20} />, designation: "2.3k Followers", image: "../image/social/github.png" },
  {
    id: 3,
    name: "Instagram",
    url: "https://www.instagram.com/gorkcoder/",
    iconColor: "bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743]",
    icon: <FaInstagram size={20} />,
    designation: "1k Followers",
    image: "../image/social/instagram.png",
  },
  {
    id: 4,
    name: "YouTube",
    url: "https://www.youtube.com/channel/UCEaZ92FpOJX4aSYLN9Evj5g",
    iconColor: "bg-[#dc2641]",
    icon: <FaYoutube size={20} />,
    designation: "21.3k Subscribers",
    image: "../image/social/youtube.png",
  },
];

const stack = [
  { name: "React", icon: <SiReact /> },
  { name: "Node.js", icon: <SiNodedotjs /> },
  { name: "MongoDB", icon: <SiMongodb /> },
  { name: "Express", icon: <SiExpress /> },
];

const activityLevels = [1, 2, 0, 3, 2, 4, 1, 0, 2, 3, 1, 4, 2, 1, 3, 0, 2, 4, 3, 1, 2, 4, 2, 0, 3, 1, 4, 2];

export const ProfileInfo = () => {
  return (
    <Motion.section className="developer-profile relative z-20" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
      <div className="container">
        <div className="developer-profile__window">
          <div className="developer-profile__layout">
            <aside className="developer-profile__identity">
              <Motion.div className="developer-profile__portrait-wrap" whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <img src="/image/profilepic-v3.png" alt="Sunil B.K, Full Stack Developer" className="developer-profile__portrait" />
                <div className="developer-profile__portrait-meta">
                  <span>Full Stack Developer</span>
                  <small>MERN • Modern web</small>
                </div>
                <div className="developer-profile__verified" title="Available for collaboration"><FiCheckCircle /></div>
              </Motion.div>
              <h2>Sunil B.K</h2>
              <p className="developer-profile__handle">@gorkcoder</p>
              <div className="developer-profile__availability"><span /> Available for collaboration</div>
              <div className="developer-profile__location"><FiMapPin /> Sydney, Australia</div>
              <div className="developer-profile__socials" aria-label="Social profiles">
                {socialLinks.map((item) => (
                  <a key={item.id} href={item.url || "#"} target={item.url ? "_blank" : undefined} rel={item.url ? "noreferrer" : undefined} aria-label={`${item.name} — ${item.designation}`}>
                    {item.icon}
                  </a>
                ))}
              </div>
            </aside>

            <main className="developer-profile__readme">
              <div className="developer-profile__file-label"><span>Developer profile</span><small>Designing • Building • Sharing</small></div>
              <p className="developer-profile__eyebrow">Hello, I create for the web.</p>
              <h1>Turning complex ideas into <span>useful digital products.</span></h1>
              <div className="developer-profile__typed-role">
                <span className="developer-profile__prompt">$</span>
                <Typewriter options={{ strings: ["I'm Sunil B.K", "Full Stack Developer", "MERN Stack Specialist"], autoStart: true, loop: true }} />
              </div>
              <p className="developer-profile__description">
                I&apos;m a Full Stack Developer with a strong focus on the MERN stack (MongoDB, Express, React, Node.js). I build fast, responsive, and scalable web applications—from backend APIs to polished
                user interfaces. Passionate about clean code, performance, and turning ideas into real-world solutions.
              </p>

              <div className="developer-profile__stack" aria-label="Core technology stack">
                {stack.map((item) => <div key={item.name}>{item.icon}<span>{item.name}</span></div>)}
              </div>

              <div className="developer-profile__activity">
                <div className="developer-profile__activity-copy"><strong>Creative momentum</strong><span>Learning, shipping, and sharing since 2021.</span></div>
                <div className="developer-profile__activity-grid" aria-hidden="true">
                  {activityLevels.map((level, index) => <span key={index} data-level={level} />)}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Motion.section>
  );
};
