import { DotBackground } from "@/components/customeUI/DotBackground";
import { ProjectCard } from "./ProjectCard";

export const ProjectList = () => {
  return (
    <>
      <DotBackground />

      <section className="project-list relative isolate overflow-hidden bg-[#10151C] pb-20">
        {/* ==================================================== */}
        {/* ORIGINAL BACKGROUND IMAGE                            */}
        {/* ==================================================== */}

        <div className="pointer-events-none absolute -top-[70%] z-10 opacity-55 lg:-right-[30%]">
          <img src="../image/bg/projectbg.avif" alt="project background" className="opacity-70 saturate-[0.9]" />
        </div>

        {/* ==================================================== */}
        {/* ORIGINAL ATMOSPHERIC BACKGROUND                      */}
        {/* FIXED: EXTENDED + SMOOTHLY FADED                     */}
        {/* ==================================================== */}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[78rem] bg-[radial-gradient(circle_at_18%_28%,rgba(45,212,191,0.16),transparent_36%),radial-gradient(circle_at_70%_18%,rgba(168,85,247,0.11),transparent_34%),linear-gradient(180deg,rgba(16,21,28,0.48)_0%,rgba(16,21,28,0.18)_48%,rgba(16,21,28,0.82)_100%)] [mask-image:linear-gradient(to_bottom,black_0%,black_56%,rgba(0,0,0,0.85)_68%,rgba(0,0,0,0.45)_82%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_56%,rgba(0,0,0,0.85)_68%,rgba(0,0,0,0.45)_82%,transparent_100%)]"></div>

        {/* ==================================================== */}
        {/* ORIGINAL TOP FADE                                    */}
        {/* ==================================================== */}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-48 bg-gradient-to-b from-[#10151C]/95 via-[#10151C]/70 to-transparent"></div>

        {/* ==================================================== */}
        {/* ORIGINAL CENTER GLOW                                 */}
        {/* ==================================================== */}

        <div className="pointer-events-none absolute left-1/2 top-44 z-10 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.13)_0%,rgba(196,181,253,0.07)_42%,transparent_72%)] blur-[90px]"></div>

        {/* ==================================================== */}
        {/* ORIGINAL PARTICLES                                   */}
        {/* ==================================================== */}

        <div className="pointer-events-none absolute left-[10%] top-24 z-10 h-2 w-2 rounded-full bg-teal-200/70 shadow-[0_0_28px_rgba(94,234,212,0.8)]"></div>

        <div className="pointer-events-none absolute right-[18%] top-64 z-10 h-1.5 w-1.5 rounded-full bg-orange-200/70 shadow-[0_0_24px_rgba(251,191,36,0.65)]"></div>

        <div className="pointer-events-none absolute left-[31%] top-72 z-10 h-1 w-1 rounded-full bg-violet-200/70 shadow-[0_0_18px_rgba(196,181,253,0.75)]"></div>

        {/* ==================================================== */}
        {/* ORIGINAL PROJECT BLOBS                               */}
        {/* ==================================================== */}

        <div className="project-bg pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0">
            <span className="absolute -left-[10%] top-1/2 block aspect-[1.5489] w-[87.5%] -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] rounded-[100%] bg-[#2B2B44] opacity-30 blur-3xl"></span>

            <span className="absolute -bottom-[10%] -left-[30%] block aspect-[1.3555] w-[69%] -rotate-45 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,#268D8C_0%,rgba(38,141,140,0)_100%)] opacity-40 blur-3xl"></span>
          </div>

          <div className="absolute inset-0 overflow-hidden">
            <span className="absolute -right-[10%] bottom-1/2 block aspect-[1.5489] w-[87.5%] -rotate-[30deg] rounded-[100%] bg-[#2B2B44] opacity-30 blur-3xl"></span>

            <span className="absolute -bottom-[30%] right-[10%] block aspect-[1.3555] w-[69%] -rotate-45 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,#268D8C_0%,rgba(38,141,140,0)_100%)] opacity-40 blur-3xl"></span>
          </div>
        </div>

        {/* ==================================================== */}
        {/* LOWER ATMOSPHERIC CONTINUATION                       */}
        {/* SAME COLORS - VERY SUBTLE                            */}
        {/* ==================================================== */}

        <div className="pointer-events-none absolute inset-x-0 top-[54rem] z-[1] h-[115rem] overflow-hidden">
          {/* teal left */}

          <span className="absolute -left-[38%] top-[8rem] h-[70rem] w-[70rem] rounded-full bg-[radial-gradient(circle,rgba(38,141,140,0.10)_0%,rgba(38,141,140,0.035)_40%,transparent_72%)] blur-[150px]"></span>

          {/* soft center */}

          <span className="absolute left-1/2 top-[-4rem] h-[48rem] w-[75rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,0.035)_0%,rgba(196,181,253,0.018)_42%,transparent_72%)] blur-[130px]"></span>

          {/* violet right */}

          <span className="absolute -right-[40%] top-[22rem] h-[72rem] w-[72rem] rounded-full bg-[radial-gradient(circle,rgba(43,43,68,0.16)_0%,rgba(43,43,68,0.045)_44%,transparent_72%)] blur-[155px]"></span>

          {/* second teal atmosphere */}

          <span className="absolute -left-[42%] top-[68rem] h-[70rem] w-[70rem] rounded-full bg-[radial-gradient(circle,rgba(38,141,140,0.075)_0%,rgba(38,141,140,0.022)_44%,transparent_72%)] blur-[160px]"></span>
        </div>

        {/* ==================================================== */}
        {/* CONTENT                                              */}
        {/* ==================================================== */}

        <div className="container relative z-50">
          {/* ================================================== */}
          {/* PROJECT HERO                                       */}
          {/* ================================================== */}

          <div className="mx-auto mb-20 w-full max-w-[1320px]">
            {/* TOP META */}

            <div className="mb-9 ml-12 flex flex-wrap items-center justify-between gap-5">
              <div className="inline-flex items-center gap-3">
                <span className="relative flex h-8 w-8 items-center justify-center">
                  <span className="absolute inset-0 rounded-full border border-teal-200/[0.12]"></span>

                  <span className="absolute inset-[6px] rounded-full border border-teal-200/[0.08]"></span>

                  <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_14px_rgba(94,234,212,0.65)]"></span>
                </span>
              </div>
            </div>

            {/* ================================================= */}
            {/* HERO GRID                                         */}
            {/* ================================================= */}

            <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
              {/* LEFT */}

              <div className="relative">
                <h1 className="max-w-[920px] text-[46px] font-medium leading-[0.9] tracking-[-0.068em] text-white sm:text-[60px] md:text-[76px] lg:text-[88px] xl:text-[96px]">
                  Ideas that move
                  <span className="block text-white/30">
                    beyond{" "}
                    <span className="relative inline-flex text-white">
                      <span className="pointer-events-none absolute -inset-x-3 bottom-[5px] h-[32%] rounded-full bg-teal-300/[0.07] blur-[14px]"></span>

                      <span className="relative bg-gradient-to-r from-[#C9FFF8] via-[#D8C8FF] to-[#FFC29F] bg-clip-text text-transparent">the prototype.</span>
                    </span>
                  </span>
                </h1>

                <div className="mt-8 flex max-w-[760px] items-start gap-4">
                  <p className="text-[13px] leading-7 text-white/45 sm:text-[14px] md:text-[15px] md:leading-8">
                    A collection of digital products built around real workflows, thoughtful interfaces, scalable architecture and the kind of details that turn working software into a finished
                    product.
                  </p>
                </div>
              </div>

              {/* RIGHT */}

              <div className="lg:pb-2">
                <div className="border-l border-white/[0.07] pl-6">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/20">The work</span>

                  <p className="mt-4 max-w-[400px] text-[11px] leading-6 text-white/34 sm:text-[12px]">
                    From frontend experiences and admin dashboards to backend APIs, authentication, payments and complete MERN systems.
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-300/70 shadow-[0_0_10px_rgba(94,234,212,0.35)]"></span>

                    <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/25">Built for real use</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* FINAL INTRO                                       */}
            {/* ================================================= */}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span className="absolute inset-0 rounded-full border border-white/[0.07]"></span>

                  <span className="h-1 w-1 rounded-full bg-teal-300/60"></span>
                </span>

                <span className="text-[8px] font-medium uppercase tracking-[0.20em] text-white/24">Scroll through selected work</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[7px] font-medium uppercase tracking-[0.16em] text-white/14">Frontend · Backend · Product systems</span>

                <span className="h-px w-10 bg-gradient-to-r from-white/[0.08] to-transparent"></span>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* PROJECT CARDS                                      */}
          {/* ================================================== */}

          <ProjectCard />
        </div>
      </section>
    </>
  );
};
