import React from "react";
import { motion as Motion } from "motion/react";
import { FiArrowUpRight, FiCheck, FiCode, FiClock, FiLayers, FiPenTool, FiRefreshCw, FiZap } from "react-icons/fi";

const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
};

const supportItems = [
  "Unlimited requests",
  "Average 24–48h delivery",
  "Unlimited revisions",
  "Custom frontend design updates",
  "Backend enhancements and API integration",
  "Async communication and collaboration",
  "Fixed monthly rate—no surprises",
];

const CardTopline = ({ icon, index, label, status }) => (
  <div className="service-panel__topline">
    <span className="service-panel__icon">{icon}</span>
    <span className="service-panel__topline-copy"><strong>{label}</strong><em>{status}</em></span>
    <small><i />{index}</small>
  </div>
);

export const Service = () => {
  return (
    <section className="services-showcase services-showcase--next" aria-labelledby="services-title">
      <div className="container">
        <Motion.header className="services-showcase__header" {...reveal}>
          <div className="services-showcase__heading">
            <span className="services-showcase__eyebrow"><FiLayers /> What I can help you build</span>
            <h2 id="services-title">Services <span>I offer.</span></h2>
          </div>
          <div className="services-showcase__intro">
            <p>From concept to deployment, I provide end-to-end web development solutions tailored to your goals.</p>
            <div className="services-showcase__path" aria-label="Service process">
              <span>Think</span><i /><span>Design</span><i /><span>Build</span><i /><span>Launch</span>
            </div>
            <div className="services-showcase__summary" aria-label="Service highlights">
              <div><strong>05</strong><span>Core services</span></div>
              <div><strong>MERN</strong><span>Specialist stack</span></div>
              <div><strong>24–48h</strong><span>Support rhythm</span></div>
            </div>
            <div className="services-showcase__availability"><i /><span>Available for selected projects</span><small>Sydney · Remote</small></div>
          </div>
        </Motion.header>

        <ServiceCard />
      </div>
    </section>
  );
};

export const ServiceCard = () => {
  return (
    <div className="services-content">
      <div className="services-content__top">
        <Motion.article className="service-panel service-panel--primary" {...reveal}>
          <div className="service-panel__primary-grid">
            <div className="service-panel__primary-visual">
              <CardTopline icon={<FiCode />} index="01" label="Full-stack development" status="End-to-end product" />
              <h3>Full-Stack Website Design <span>MERN Development</span></h3>
              <div className="service-panel__image service-panel__image--primary">
                <img src="/image/service/service1.webp" alt="Abstract full-stack website blueprint" loading="lazy" />
                <div className="service-panel__visual-status"><i /><span>Application architecture</span></div>
                <span>MongoDB</span><span>Express</span><span>React</span><span>Node.js</span>
              </div>
            </div>
            <div className="service-panel__primary-copy">
              <span className="service-panel__statement">Built as one connected product—not a collection of disconnected screens.</span>
              <p>I build modern, scalable, and high-performance web applications using MongoDB, Express.js, React, and Node.js. With a strong focus on clean architecture, responsive design, and robust backend logic, every product is fast, secure, and built for growth.</p>
              <p>Let&apos;s craft a seamless, full-stack web experience tailored to your brand&apos;s needs.</p>
              <div className="service-panel__chips"><span>Responsive</span><span>Secure</span><span>Scalable</span></div>
              <div className="service-panel__assurance"><i /><span>Production-minded from day one</span></div>
            </div>
          </div>
        </Motion.article>

        <Motion.article className="service-panel service-panel--figma" {...reveal} transition={{ ...reveal.transition, delay: 0.06 }}>
          <CardTopline icon={<FiPenTool />} index="02" label="Design implementation" status="Pixel to product" />
          <h3>Figma to Full-Stack <span>MERN Implementation</span></h3>
          <p>From design to deployment—I convert your UI into high-performing full-stack MERN web apps.</p>
          <div className="service-panel__image service-panel__image--figma">
            <img src="/image/service/service4-v2.png" alt="Abstract interface design transforming into production code" loading="lazy" />
            <div className="service-panel__visual-status"><i /><span>Design handoff ready</span></div>
          </div>
          <div className="service-panel__flow" aria-hidden="true"><span>Design</span><FiArrowUpRight /><span>Code</span><FiArrowUpRight /><span>Ship</span></div>
        </Motion.article>
      </div>

      <div className="services-content__bottom">
        <Motion.article className="service-panel service-panel--landing" {...reveal}>
          <CardTopline icon={<FiZap />} index="03" label="Focused delivery" status="Fast-track launch" />
          <h3>2-day landing page.</h3>
          <p>Need a custom one-pager or campaign landing page? I&apos;ll turn a focused brief into a polished, responsive experience.</p>
          <div className="service-panel__delivery"><FiClock /><strong>48</strong><span>hour target</span></div>
          <div className="service-panel__image service-panel__image--landing"><img src="/image/service/service2.webp" alt="Dark landing page interface concept" loading="lazy" /><div className="service-panel__visual-status"><i /><span>Conversion-focused build</span></div></div>
        </Motion.article>

        <Motion.article className="service-panel service-panel--support" {...reveal} transition={{ ...reveal.transition, delay: 0.06 }}>
          <CardTopline icon={<FiRefreshCw />} index="04" label="Ongoing partnership" status="Monthly support" />
          <h3>Monthly development support.</h3>
          <p>Feature requests, design improvements, and bug fixes—delivered one at a time with care and precision.</p>
          <ul className="service-panel__support-list">
            {supportItems.map((item) => <li key={item}><FiCheck /><span>{item}</span></li>)}
          </ul>
        </Motion.article>

        <Motion.article className="service-panel service-panel--custom" {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
          <CardTopline icon={<FiLayers />} index="05" label="Built around your idea" status="Flexible scope" />
          <h3>Custom project.</h3>
          <p>I collaborate closely with designers and branding specialists to bring unique digital products to life. If your project needs something different, let&apos;s build it together.</p>
          <div className="service-panel__image service-panel__image--custom"><img src="/image/service/service3.webp" alt="Abstract custom project system blueprint" loading="lazy" /><div className="service-panel__visual-status"><i /><span>Tailored solution</span></div></div>
          <div className="service-panel__custom-note"><span>Unique by design</span><FiArrowUpRight /></div>
        </Motion.article>
      </div>

      <Motion.div className="services-content__closing" {...reveal}>
        <div><i /><span>One connected partnership</span><strong>From the first idea to a confident launch.</strong></div>
        <div><span>Strategy</span><i /><span>Interface</span><i /><span>Engineering</span><i /><span>Support</span></div>
      </Motion.div>
    </div>
  );
};
