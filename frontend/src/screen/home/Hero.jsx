import { useId } from "react";
import { GlowingButton, TertiaryButton } from "@/components/customeUI/Button";
import { ServiceCard } from "../about/Service";

export const Hero = () => {
  const id = useId().replace(/:/g, "");

  return (
    <>
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
        <ChromaticBackground />
      </div>

      <style>
        {`
          @keyframes heroAuraFlow-${id} {
            0%, 100% {
              transform: translate3d(-18px, 10px, 0) scale(0.96);
              opacity: 0.42;
            }
            50% {
              transform: translate3d(22px, -18px, 0) scale(1.08);
              opacity: 0.82;
            }
          }

          @keyframes heroVisualFloat-${id} {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-16px) scale(1.015);
            }
          }

          @keyframes heroOrbit-${id} {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes heroShine-${id} {
            0% {
              transform: translateX(-70%);
              opacity: 0;
            }
            35% {
              opacity: 0.6;
            }
            100% {
              transform: translateX(70%);
              opacity: 0;
            }
          }

          .hero-aura-flow-${id} {
            animation: heroAuraFlow-${id} 8s ease-in-out infinite;
          }

          .hero-visual-float-${id} {
            animation: heroVisualFloat-${id} 6.5s ease-in-out infinite;
          }

          .hero-orbit-${id} {
            animation: heroOrbit-${id} 22s linear infinite;
          }

          .hero-shine-${id} {
            animation: heroShine-${id} 5.5s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .hero-aura-flow-${id},
            .hero-visual-float-${id},
            .hero-orbit-${id},
            .hero-shine-${id} {
              animation: none;
            }
          }
        `}
      </style>

      <section className="hero relative z-10 min-h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-sky-300/10 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-[360px] w-[360px] rounded-full bg-amber-300/10 blur-[130px]" />

        <div className="container relative z-20 grid min-h-[100svh] items-center gap-12 pb-16 pt-28 sm:pt-32 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:pb-10 lg:pt-20">
          <div className="heading mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
            <div className="mb-6 inline-flex">
              <GlowingButton className="!text-[11px] sm:!text-xs md:!text-sm">Let's build something powerful together.</GlowingButton>
            </div>

            <h1 className="text-[40px] font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl xl:text-[82px]">
              Bringing ideas
              <span className="block bg-gradient-to-r from-white via-sky-100 to-white/40 bg-clip-text text-transparent">to full stack life.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 textColor opacity-75 sm:text-base md:text-lg lg:mx-0">
              Crafting scalable, secure, and modern web applications using MongoDB, Express, React, and Node.js.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <TertiaryButton>Start a Project</TertiaryButton>

              <a href="#projects" className="group inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-white/70 transition duration-300 hover:text-white">
                View Work
                <span className="ml-3 h-px w-8 bg-gradient-to-r from-white/20 to-white/70 transition-all duration-300 group-hover:w-12" />
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 text-center lg:max-w-md lg:text-left">
              {["Scalable", "Secure", "Modern"].map((item) => (
                <div key={item} className="border-t border-white/10 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[660px] items-center justify-center lg:max-w-none">
            <div className={`hero-aura-flow-${id} pointer-events-none absolute h-[78%] w-[78%] rounded-full bg-sky-300/12 blur-[95px]`} />
            <div className="pointer-events-none absolute h-[92%] w-[92%] rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.14),transparent_58%)] blur-2xl" />

            <div className="relative aspect-square w-[86%] max-w-[600px]">
              <div className={`hero-orbit-${id} absolute inset-0 rounded-full border border-dashed border-white/[0.08]`} />
              <div className="absolute inset-[9%] rounded-full border border-white/[0.06]" />
              <div className="absolute inset-[18%] rounded-full border border-white/[0.04]" />

              <div className="absolute left-0 top-1/2 h-px w-full overflow-hidden">
                <div className={`hero-shine-${id} h-full w-2/3 bg-gradient-to-r from-transparent via-white/45 to-transparent`} />
              </div>

              <img
                src="/image/hero/image.webp"
                alt="Full stack developer visual"
                className={`hero-visual-float-${id} relative z-10 h-full w-full object-contain drop-shadow-[0_42px_120px_rgba(0,0,0,0.58)]`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const ChromaticBackground = () => {
  return (
    <div className="framer-15o9q9d relative h-full w-full" data-framer-name="Background Chromatic">
      <div className="framer-1l2isai absolute inset-0" data-framer-name="Backdrop Blur" />

      <div className="ssr-variant hidden-19ecmci">
        <div className="framer-zjg9f7" data-framer-name="Chromatic">
          <div>
            <img
              decoding="async"
              sizes="calc(100vw + 673px)"
              srcSet="https://framerusercontent.com/images/XlDDCnoxKwc5TnuyQk6NW4BHuI.png?scale-down-to=512 512w,https://framerusercontent.com/images/XlDDCnoxKwc5TnuyQk6NW4BHuI.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/XlDDCnoxKwc5TnuyQk6NW4BHuI.png?scale-down-to=2048 2048w,https://framerusercontent.com/images/XlDDCnoxKwc5TnuyQk6NW4BHuI.png 2200w"
              src="https://framerusercontent.com/images/XlDDCnoxKwc5TnuyQk6NW4BHuI.png"
              alt="Chromatic"
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.08),transparent_34%),linear-gradient(to_bottom,transparent,rgba(0,0,0,0.24))]" />
    </div>
  );
};

export const WhyToSelect = () => {
  return (
    <section className="relative z-10 overflow-hidden py-20 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-white/[0.055] blur-[110px]" />

      <div className="container">
        <div className="heading relative z-10 mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/45">Why choose me</p>

          <h1 className="blog-detail-title text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">Clean builds. Smooth performance. Real results.</h1>

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
    <section className="relative z-10 overflow-hidden py-8 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.12),transparent_32%)]" />

      <div className="relative min-h-[58vh] sm:min-h-[68vh] lg:min-h-[82vh]">
        <div className="heading absolute left-1/2 top-1/2 z-20 w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="mb-4 text-sm font-medium textColor opacity-80 sm:text-base">We welcome you to join us.</p>

          <h1 className="mb-7 text-4xl font-semibold leading-none tracking-[-0.03em] text-white sm:text-6xl lg:text-8xl">Start your journey</h1>

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
