import { MakeContact } from "@/screen/contact/MakeContact";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { GoArrowDown } from "react-icons/go";
import { HiArrowUpRight } from "react-icons/hi2";

/* ========================================================== */
/* CAPABILITY DUMMY DATA                                      */
/* ========================================================== */

const capabilityData = [
  {
    id: 1,
    number: "01",
    title: "Strategy",
    tag: "Direction",
    text: "Turn early ideas into a clear product direction with the right priorities, architecture and execution roadmap.",
    mobileText: "Shape ideas into a focused roadmap and clear technical direction.",
    accent: "amber",
    visual: "strategy",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=90",
    desktopClass: "left-[-95px] top-[155px] h-[450px] w-[410px] rotate-[-4deg]",
    featured: false,
  },
  {
    id: 2,
    number: "02",
    title: "Engineering",
    tag: "Build",
    text: "Build reliable digital systems with scalable architecture, maintainable code, clean APIs and production-ready foundations.",
    mobileText: "Create scalable and maintainable systems with reliable foundations.",
    accent: "blue",
    visual: "engineering",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=90",
    desktopClass: "left-[14%] top-[180px] h-[465px] w-[420px] rotate-[2deg]",
    featured: false,
  },
  {
    id: 3,
    number: "03",
    title: "Product",
    tag: "Create",
    text: "Bring strategy, experience design and engineering together to create refined products that people enjoy using and businesses can grow with.",
    mobileText: "Combine strategy, design and engineering into polished products.",
    accent: "cyan",
    visual: "product",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=90",
    desktopClass: "left-1/2 top-[5px] z-30 h-[555px] w-[500px] -translate-x-1/2",
    featured: true,
  },
  {
    id: 4,
    number: "04",
    title: "Experience",
    tag: "Design",
    text: "Design clear, responsive and intuitive interactions that make complex digital products feel simple across every screen.",
    mobileText: "Design clear and intuitive experiences across devices.",
    accent: "violet",
    visual: "experience",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=90",
    desktopClass: "right-[14%] top-[180px] h-[465px] w-[420px] rotate-[-2deg]",
    featured: false,
  },
  {
    id: 5,
    number: "05",
    title: "Growth",
    tag: "Scale",
    text: "Create flexible technical foundations that support iteration, new features and long-term product expansion without slowing down.",
    mobileText: "Build foundations designed to evolve as your product grows.",
    accent: "emerald",
    visual: "growth",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=90",
    desktopClass: "right-[-95px] top-[155px] h-[450px] w-[410px] rotate-[4deg]",
    featured: false,
  },
];

/* ========================================================== */
/* CONTACT PAGE                                               */
/* ========================================================== */

export const Contact = () => {
  return (
    <>
      <div className=" bg-[#09131b] absolute top-0 left-0 w-full h-full"></div>
      <section>
        {/* GLOBAL BACKGROUND */}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(71,170,210,0.11),transparent_34%)]" />
        <div className="pointer-events-none absolute left-1/2 top-[80px] h-[720px] w-[1050px] -translate-x-1/2 rounded-full bg-cyan-300/[0.03] blur-[160px]" />
        <div className="pointer-events-none absolute -left-[200px] top-[500px] h-[420px] w-[420px] rounded-full bg-cyan-300/[0.018] blur-[150px]" />
        <div className="pointer-events-none absolute -right-[200px] top-[480px] h-[420px] w-[420px] rounded-full bg-blue-400/[0.018] blur-[150px]" />
        <ContactHero />
        <ContactFormSection />
      </section>
    </>
  );
};

/* ========================================================== */
/* CONTACT HERO                                               */
/* ========================================================== */

const ContactHero = () => {
  return (
    <section className="relative z-10 min-h-[1010px] overflow-hidden border-b border-white/[0.04]">
      {/* ====================================================== */}
      {/* BACKGROUND                                             */}
      {/* ====================================================== */}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,20,28,0.10),rgba(4,10,15,0.32))]" />

      <div className="pointer-events-none absolute left-1/2 top-[130px] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-300/[0.035] blur-[160px]" />

      <div className="pointer-events-none absolute left-1/2 top-[250px] h-[280px] w-[600px] -translate-x-1/2 rounded-full bg-[#6ed8ff]/[0.025] blur-[90px]" />

      {/* soft vertical light */}

      <div className="pointer-events-none absolute left-1/2 top-[90px] h-[520px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-200/[0.08] to-transparent" />

      {/* ====================================================== */}
      {/* HERO CONTENT                                           */}
      {/* ====================================================== */}

      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center pt-24 text-center sm:pt-28 md:pt-32">
          {/* ================================================== */}
          {/* EYEBROW                                            */}
          {/* ================================================== */}

          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-200/25" />

            <div className="inline-flex items-center gap-2.5">
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute h-5 w-5 rounded-full border border-cyan-300/[0.08]" />
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/75 shadow-[0_0_12px_rgba(103,232,249,0.45)]" />
              </span>

              <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-white/35">Available for selected projects</span>
            </div>

            <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-200/25" />
          </div>

          {/* ================================================== */}
          {/* MAIN TYPOGRAPHY                                    */}
          {/* ================================================== */}

          <div className="relative">
            {/* giant faint decorative text */}

            <span className="pointer-events-none absolute left-1/2 top-[-42px] -z-10 -translate-x-1/2 whitespace-nowrap text-[88px] font-semibold tracking-[-0.07em] text-white/[0.012] sm:text-[120px] md:text-[150px]">
              CREATE
            </span>

            {/* line 1 */}

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5">
              <h1 className="text-[44px] font-normal leading-[0.95] tracking-[-0.06em] text-white sm:text-[56px] md:text-[72px] lg:text-[84px]">Turn ideas</h1>

              <span className="relative inline-flex items-center">
                <span className="absolute inset-x-0 bottom-[3px] h-[38%] rounded-full bg-cyan-300/[0.08] blur-[12px]" />

                <span className="relative bg-gradient-to-r from-[#8bdcf8] via-[#b6e9fb] to-[#72cde9] bg-clip-text text-[44px] font-normal leading-[0.95] tracking-[-0.06em] text-transparent sm:text-[56px] md:text-[72px] lg:text-[84px]">
                  into motion.
                </span>
              </span>
            </div>

            {/* line 2 */}

            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 sm:mt-3 sm:gap-x-6">
              <span className="text-[44px] font-normal leading-[0.95] tracking-[-0.06em] text-white/38 sm:text-[56px] md:text-[72px] lg:text-[84px]">Build</span>

              <span className="relative inline-flex items-center">
                <span className="absolute -left-3 top-1/2 hidden h-px w-7 -translate-x-full bg-gradient-to-r from-transparent to-cyan-200/30 md:block" />

                <span className="text-[44px] font-normal leading-[0.95] tracking-[-0.06em] text-white sm:text-[56px] md:text-[72px] lg:text-[84px]">what&apos;s next.</span>
              </span>
            </div>
          </div>

          {/* ================================================== */}
          {/* SUPPORTING COPY                                    */}
          {/* ================================================== */}

          <div className="mt-9 flex max-w-[760px] items-start gap-4 text-left sm:mt-10">
            <span className="mt-[9px] hidden h-px w-10 shrink-0 bg-gradient-to-r from-cyan-200/40 to-transparent sm:block" />

            <p className="text-center text-[12px] leading-6 text-white/40 sm:text-left sm:text-[13px] md:text-[14px] md:leading-7">
              From strategy and product design to scalable development, I help transform early ideas into focused digital products that feel considered, perform reliably and are ready to grow.
            </p>
          </div>

          {/* ================================================== */}
          {/* ACTIONS                                            */}
          {/* ================================================== */}

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
            {/* primary */}

            <a
              href="#contact-form"
              className="group relative inline-flex h-[50px] items-center justify-center overflow-hidden rounded-full bg-white px-2 pl-6 text-[11px] font-semibold text-[#08151c] shadow-[0_14px_35px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_18px_45px_rgba(0,0,0,0.32)]"
            >
              <span className="relative z-10">Start a project</span>

              <span className="relative z-10 ml-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#09131b] text-white">
                <GoArrowDown size={13} className="transition-transform duration-300 group-hover:translate-y-[2px]" />
              </span>

              <span className="pointer-events-none absolute inset-y-0 left-[-40%] w-[35%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 group-hover:left-[120%]" />
            </a>

            {/* email */}

            <a
              href="mailto:sunilbk962@gmail.com"
              className="group inline-flex h-[50px] items-center gap-3 rounded-full border border-white/[0.07] px-5 text-[11px] font-medium text-white/50 transition-all duration-300 hover:border-cyan-200/[0.14] hover:bg-cyan-300/[0.025] hover:text-white/85"
            >
              Email directly
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.06] transition-all duration-300 group-hover:border-cyan-200/[0.15] group-hover:bg-cyan-300/[0.04]">
                <HiArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-[1px] group-hover:translate-x-[1px]" />
              </span>
            </a>
          </div>

          {/* ================================================== */}
          {/* MICRO DETAILS                                      */}
          {/* ================================================== */}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <HeroMetaItem number="01" text="Strategy" />

            <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:block" />

            <HeroMetaItem number="02" text="Experience" />

            <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:block" />

            <HeroMetaItem number="03" text="Engineering" />

            <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:block" />

            <HeroMetaItem number="04" text="Growth" />
          </div>

          {/* ================================================== */}
          {/* SCROLL CUE                                         */}
          {/* ================================================== */}

          <div className="mt-8 flex flex-col items-center">
            <span className="text-[7px] font-medium uppercase tracking-[0.22em] text-white/15">Explore capabilities</span>

            <span className="mt-3 h-8 w-px bg-gradient-to-b from-cyan-200/25 to-transparent" />
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* EXISTING CARDS                                         */}
      {/* ====================================================== */}

      <CapabilityShowcase />
    </section>
  );
};

/* ========================================================== */
/* HERO META ITEM                                             */
/* ========================================================== */

const HeroMetaItem = ({ number, text }) => {
  return (
    <div className="group flex items-center gap-2">
      <span className="text-[7px] font-semibold tracking-[0.14em] text-cyan-200/30">{number}</span>

      <span className="text-[8px] font-medium uppercase tracking-[0.16em] text-white/25 transition-colors duration-300 group-hover:text-white/45">{text}</span>
    </div>
  );
};
/* ========================================================== */
/* CAPABILITY SHOWCASE                                        */
/* ========================================================== */

const CapabilityShowcase = () => {
  return (
    <>
      {/* Desktop Cards */}

      <div className="pointer-events-none absolute inset-x-0 bottom-[-205px] hidden h-[610px] lg:block">
        {capabilityData.map((item) => (
          <VisualCard key={item.id} item={item} />
        ))}
      </div>

      {/* Mobile Cards */}

      <div className="mx-auto mt-16 grid max-w-[740px] grid-cols-1 gap-3 px-4 pb-12 sm:grid-cols-2 lg:hidden">
        {capabilityData.map((item) => (
          <MobileCapabilityCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

/* ========================================================== */
/* DESKTOP VISUAL CARD                                        */
/* ========================================================== */

const VisualCard = ({ item }) => {
  const { number, title, tag, text, accent, visual, image, desktopClass, featured } = item;

  const accentStyles = {
    cyan: "bg-cyan-300/[0.07]",
    blue: "bg-blue-400/[0.07]",
    violet: "bg-violet-400/[0.06]",
    emerald: "bg-emerald-400/[0.06]",
    amber: "bg-amber-400/[0.055]",
  };

  return (
    <article className={`absolute overflow-hidden rounded-[34px] border border-white  bg-white p-[6px] shadow-[0_35px_120px_rgba(0,0,0,0.45)] ${desktopClass}`}>
      <div className={`relative h-full overflow-hidden rounded-[28px] border border-white  ${featured ? "bg-[#173e50]" : "bg-[#0b1b24]"}`}>
        {/* ================================================== */}
        {/* IMAGE                                              */}
        {/* ================================================== */}

        {image && (
          <div className="absolute inset-0 z-0">
            <img
              src={image}
              alt={`${title} capability`}
              loading={featured ? "eager" : "lazy"}
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                console.log("Image failed:", image);
                e.currentTarget.style.display = "none";
              }}
            />

            {/* dark overlay */}
            <div className="absolute inset-0 bg-[#06121a]/30" />

            {/* cyan tint */}
            <div className="absolute inset-0 bg-cyan-950/15 mix-blend-color" />

            {/* strong bottom fade so text is readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#07151d]/5 via-[#07151d]/25 to-[#07151d]/95" />

            {/* vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_5%,rgba(3,10,15,0.38)_95%)]" />
          </div>
        )}

        {/* ================================================== */}
        {/* FALLBACK BACKGROUND                                */}
        {/* ================================================== */}

        {!image && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(103,232,249,0.08),transparent_30%)]" />

            <div className={`pointer-events-none absolute -right-20 -top-20 h-[260px] w-[260px] rounded-full blur-[95px] ${accentStyles[accent]}`} />

            <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:46px_46px]" />
          </>
        )}

        {/* ================================================== */}
        {/* TOP HIGHLIGHT                                      */}
        {/* ================================================== */}

        <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-px w-[58%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {/* ================================================== */}
        {/* CONTENT                                            */}
        {/* ================================================== */}

        <div className="relative z-20 flex h-full flex-col p-7">
          {/* header */}

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.20em] text-white/55">{number}</span>

            <div className="flex items-center gap-2 rounded-full border border-white/[0.10] bg-black/20 px-2.5 py-1.5 backdrop-blur-md">
              <span className="text-[7px] font-semibold uppercase tracking-[0.17em] text-white/55">{tag}</span>

              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/80 shadow-[0_0_9px_rgba(103,232,249,0.45)]" />
            </div>
          </div>

          {/* center indicator */}

          <div className="absolute left-1/2 top-[40%] flex -translate-x-1/2 -translate-y-1/2 items-center">
            <span className="h-2 w-2 rounded-full bg-cyan-200/70 shadow-[0_0_10px_rgba(165,243,252,0.35)]" />

            <span className="mx-3 h-px w-14 bg-gradient-to-r from-cyan-200/30 via-white/25 to-cyan-200/30" />

            <span className="h-2 w-2 rounded-full border border-cyan-200/50" />
          </div>

          {/* bottom text */}

          <div className="mt-auto">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-7 bg-cyan-200/35" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.20em] text-cyan-100/55">Capability</span>
            </div>

            <h3 className={`${featured ? "text-[34px]" : "text-[28px]"} font-medium leading-none tracking-[-0.045em] text-white`}>{title}</h3>

            <p className={`${featured ? "max-w-[400px] text-[12px]" : "max-w-[320px] text-[11px]"} mt-4 leading-[1.75] text-white/65`}>{text}</p>

            <div className="mt-5 flex items-center justify-between border-t border-white/[0.10] pt-4">
              <div className="flex items-center gap-2">
                <span className="h-[5px] w-[5px] rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.40)]" />

                <span className="text-[8px] font-medium uppercase tracking-[0.13em] text-white/35">Ready to scale</span>
              </div>

              <HiArrowUpRight size={14} className="text-white/35" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ========================================================== */
/* MOBILE CAPABILITY CARD                                     */
/* ========================================================== */

const MobileCapabilityCard = ({ item }) => {
  const { number, title, tag, mobileText, image, featured } = item;

  return (
    <article className={`relative min-h-[310px] overflow-hidden rounded-[22px] border border-white/[0.08] ${featured ? "bg-[#173b4b]" : "bg-[#0c1c25]"}`}>
      {/* IMAGE */}

      {image && (
        <div className="absolute inset-0 z-0">
          <img src={image} alt={`${title} capability`} className="h-full w-full object-cover object-center" />

          <div className="absolute inset-0 bg-[#06121a]/25" />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07151d]/30 to-[#07151d]/95" />
        </div>
      )}

      {/* CONTENT */}

      <div className="relative z-10 flex min-h-[310px] flex-col p-5">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-semibold tracking-[0.16em] text-white/55">{number}</span>

          <span className="rounded-full border border-white/[0.08] bg-black/15 px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.15em] text-white/50 backdrop-blur-md">{tag}</span>
        </div>

        <div className="mt-auto">
          <span className="mb-2 block text-[7px] font-semibold uppercase tracking-[0.17em] text-cyan-200/45">Capability</span>

          <h3 className="text-[23px] font-medium tracking-[-0.035em] text-white">{title}</h3>

          <p className="mt-3 max-w-[300px] text-[10px] leading-5 text-white/60">{mobileText}</p>
        </div>
      </div>
    </article>
  );
};
/* ========================================================== */
/* CONTACT FORM SECTION                                       */
/* ========================================================== */

const ContactFormSection = () => {
  return (
    <section id="contact-form" className="relative z-20 py-12">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 flex  flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[700px]">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/70 shadow-[0_0_8px_rgba(103,232,249,0.25)]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-200/45">Start your project</span>
            </div>

            <h2 className="max-w-[650px] text-[30px] font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-[36px] lg:text-[42px]">Tell me what you&apos;re building.</h2>

            <p className="mt-4 max-w-[620px] text-[12px] leading-6 text-white/32 sm:text-[13px]">
              Share the idea, challenge or product you&apos;re working on. Whether it&apos;s an early concept, a new build or an existing platform that needs improvement, provide the context and we
              can shape the right next step together.
            </p>
          </div>

          <div className="inline-flex self-start items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.02] px-3 py-2 backdrop-blur-xl md:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.45)]" />

            <span className="text-[8px] font-medium uppercase tracking-[0.14em] text-white/25">Available for collaboration</span>
          </div>
        </div>

        {/* FORM */}

        <div className="relative overflow-hidden rounded-[30px] border border-white/[0.05] bg-[#0d1821]/55 backdrop-blur-2xl sm:p-3">
          <MakeContact />
        </div>

        {/* EMAIL CTA */}
      </div>
    </section>
  );
};
