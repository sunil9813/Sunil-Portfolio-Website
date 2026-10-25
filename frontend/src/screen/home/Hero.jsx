import { Link } from "react-router-dom";
import { ServiceCard } from "../about/Service";
import { useRef } from "react";
import { motion as Motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { FiArrowRight, FiArrowDown } from "react-icons/fi";
import { ProjectBloom } from "./ProjectBloom";
import { HeroGalleryBackdrop } from "./HeroGalleryBackdrop";
import { HeroBloomTimeline } from "./HeroBloomTimeline";
import { heroScrollState } from "./heroScrollState";
import "./HeroLaunch.scss";

export const Hero = () => {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 32, restDelta: .001 });
  const galleryOpacity = useTransform(progress, value => heroScrollState(value).galleryOpacity);
  const flowerOpacity = useTransform(progress, value => heroScrollState(value).flowerOpacity);
  const growth = useTransform(progress, value => heroScrollState(value).flowerProgress);
  const copyY = useTransform(progress, value => heroScrollState(value).copyY);
  const copyOpacity = useTransform(progress, value => heroScrollState(value).copyOpacity);
  const copyVisibility = useTransform(progress, value => value >= .44 ? "hidden" : "visible");
  const flowerScale = useTransform(progress, value => heroScrollState(value).flowerScale);
  const flowerOffset = useTransform(progress, [0, .44, .72, 1], ["60vh", "4vh", "0vh", "0vh"]);

  return (
    <section ref={sectionRef} className={"hero-bloom relative bg-[var(--home-canvas)] text-[#fafafa] [font-family:ui-sans-serif,system-ui,sans-serif] selection:bg-white selection:text-black " + (reducedMotion ? "" : "h-[210svh]")} aria-labelledby="home-hero-title">
      <div className={"hero-bloom__stage isolate overflow-hidden " + (reducedMotion ? "relative px-5 pb-10 pt-16" : "sticky top-16 h-[calc(100svh-64px)] min-h-[620px]")}>
        <HeroGalleryBackdrop progress={progress} opacity={galleryOpacity} reduced={reducedMotion} />
        <div className={"z-20 " + (reducedMotion ? "relative" : "absolute inset-x-0 top-[max(100px,calc(50svh-222px))] px-5 max-[699px]:top-[18%]")}>
        <Motion.div className="mx-auto w-full max-w-[1000px] text-center" style={{ y: reducedMotion ? 0 : copyY, opacity: reducedMotion ? 1 : copyOpacity, visibility: reducedMotion ? "visible" : copyVisibility }}>
        <h1 id="home-hero-title" className="relative z-10 mx-auto mb-0 mt-0 max-w-[840px] text-center text-[clamp(42px,5.84vw,84px)] font-medium leading-[1.02] tracking-[-.025em]">
          <Motion.span className="block" initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.16, 1, .3, 1] }}>Built with care.</Motion.span>
          <Motion.span className="block text-[#c4c4c4]" initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .1, ease: [.16, 1, .3, 1] }}>Made for people.</Motion.span>
        </h1>
            <p className="mx-auto mb-0 mt-6 max-w-[448px] text-[16px] font-normal leading-[26px] text-[#a1a1a1]">I’m Sunil B.K, a MERN stack developer building thoughtful interfaces and dependable web applications.</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link to="/project" className="group inline-flex h-11 items-center justify-center gap-3 rounded-full bg-[#fafafa] px-6 text-[13px] font-medium text-[#0a0a0a] transition-colors hover:bg-[#dedede] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Explore projects <FiArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" /></Link>
              <Link to="/contact" className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-transparent px-6 text-[13px] font-medium text-[#fafafa] transition-colors hover:border-white/40 hover:bg-white/[.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Let’s build together</Link>
            </div>
        </Motion.div>
        </div>
        <Motion.div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[72px] z-20 flex items-center justify-center gap-2 text-[12px] text-white/80 max-[699px]:bottom-[40px]" style={{ opacity: reducedMotion ? 0 : copyOpacity }}>
          <FiArrowDown className="size-3.5" /> Scroll to see ideas bloom
        </Motion.div>
        <Motion.div aria-hidden="true" className={"pointer-events-none z-10 origin-top mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_92%,transparent)] " + (reducedMotion ? "relative mx-auto mt-8 aspect-[16/9] w-full max-w-[1100px]" : "absolute inset-x-0 top-[14%] mx-auto h-[36%] min-[900px]:inset-x-[20%] min-[900px]:top-[25%] min-[900px]:h-[64%] max-w-[1400px]")} style={{ opacity: reducedMotion ? 1 : flowerOpacity, y: reducedMotion ? 0 : flowerOffset, scale: reducedMotion ? 1 : flowerScale }}>
          <div className="absolute inset-0 grayscale brightness-[1.45]">
            <ProjectBloom artOnly progress={growth} />
          </div>
        </Motion.div>
        <HeroBloomTimeline progress={progress} reduced={reducedMotion} />
      </div>
    </section>
  );
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

          <Link to="/contact" className="welcome-home__action">Let’s build together <FiArrowRight aria-hidden="true" /></Link>
        </div>

        <video autoPlay muted loop playsInline className="relative z-10 min-h-[58vh] w-full object-contain opacity-95 sm:min-h-[68vh] lg:min-h-[82vh]">
          <source src="/image/loading.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};
