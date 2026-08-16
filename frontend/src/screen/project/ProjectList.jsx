import { DotBackground } from "@/components/customeUI/DotBackground";
import { ProjectCard } from "./ProjectCard";

export const ProjectList = () => {
  return (
    <>
      <DotBackground />
      <section className="project-list overflow-hidden bg-[#10151C] pb-20">
        <div className="pointer-events-none absolute -top-[70%] z-10 opacity-55 lg:-right-[30%]">
          <img src="../image/bg/projectbg.avif" alt="project background" className="opacity-70 saturate-[0.9]" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[48rem] bg-[radial-gradient(circle_at_18%_28%,rgba(45,212,191,0.16),transparent_36%),radial-gradient(circle_at_70%_18%,rgba(168,85,247,0.11),transparent_34%),linear-gradient(180deg,rgba(16,21,28,0.48)_0%,rgba(16,21,28,0.18)_48%,rgba(16,21,28,0.82)_100%)]"></div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-48 bg-gradient-to-b from-[#10151C]/95 via-[#10151C]/70 to-transparent"></div>

        <div className="pointer-events-none absolute left-1/2 top-44 z-10 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.13)_0%,rgba(196,181,253,0.07)_42%,transparent_72%)] blur-[90px]"></div>

        <div className="pointer-events-none absolute left-[10%] top-24 z-10 h-2 w-2 rounded-full bg-teal-200/70 shadow-[0_0_28px_rgba(94,234,212,0.8)]"></div>
        <div className="pointer-events-none absolute right-[18%] top-64 z-10 h-1.5 w-1.5 rounded-full bg-orange-200/70 shadow-[0_0_24px_rgba(251,191,36,0.65)]"></div>
        <div className="pointer-events-none absolute left-[31%] top-72 z-10 h-1 w-1 rounded-full bg-violet-200/70 shadow-[0_0_18px_rgba(196,181,253,0.75)]"></div>

        <div className="project-bg">
          <div className="absolute inset-0">
            <span className="absolute -left-[10%] top-1/2 block aspect-[1.5489] w-[87.5%] -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] rounded-[100%] bg-[#2B2B44] opacity-30 blur-3xl"></span>
            <span className="absolute -bottom-[10%] -left-[30%] block aspect-[1.3555] w-[69%] -rotate-45 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,#268D8C_0%,rgba(38,141,140,0)_100%)] opacity-40 blur-3xl"></span>
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <span className="absolute -right-[10%] bottom-1/2 block aspect-[1.5489] w-[87.5%] -rotate-[30deg] rounded-[100%] bg-[#2B2B44] opacity-30 blur-3xl"></span>
            <span className="absolute -bottom-[30%] right-[10%] block aspect-[1.3555] w-[69%] -rotate-45 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,#268D8C_0%,rgba(38,141,140,0)_100%)] opacity-40 blur-3xl"></span>
          </div>
        </div>
        <div className="absolute -bottom-14 h-24 w-full bg-[#13161C] blur-xl"></div>

        <div className="container relative z-50">
          <div className="heading mx-auto mb-16 mt-32 flex w-full max-w-7xl flex-col text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-white/[0.055] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-teal-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_18px_rgba(94,234,212,0.9)]"></span>
              Selected project systems
            </div>
            <h1 className="mx-auto max-w-5xl bg-gradient-to-r from-[#C9FFF8] via-[#D8C8FF] to-[#FFC29F] bg-clip-text text-4xl font-semibold leading-[0.96] tracking-[-0.065em] text-transparent md:text-6xl lg:text-7xl">
              Practical builds, polished like products.
            </h1>
            <h2 className="mx-auto mt-5 max-w-3xl text-sm font-normal leading-7 text-white/62 md:text-lg lg:text-2xl">
              A focused collection of MERN apps, dashboards, payment flows, and portfolio systems built with clean interfaces and real product thinking.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-white/44 md:text-sm">
              Browse by stack, layout, category, and access type. Every project keeps preview, details, reviews, and secure access in one place.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {["Frontend", "Backend", "Dashboard", "Full Stack"].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#141C24]/78 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/58 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <ProjectCard />
        </div>
      </section>
    </>
  );
};
