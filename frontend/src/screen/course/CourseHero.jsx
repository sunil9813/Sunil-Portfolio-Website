import { BsArrowUpRight, BsBook, BsClock, BsCodeSlash, BsDatabase, BsShieldLock, BsWifi } from "react-icons/bs";
import { FaCloud } from "react-icons/fa6";
import { HiCheckBadge } from "react-icons/hi2";
import networkingImage from "@/assets/course-hero/networking.jpg";
import databaseImage from "@/assets/course-hero/databases.jpg";
import cyberSecurityImage from "@/assets/course-hero/cyber-security.jpg";
import softwareDevelopmentImage from "@/assets/course-hero/software-development.jpg";
import cloudComputingImage from "@/assets/course-hero/cloud-computing.jpg";

const heroCards = [
  {
    title: "Computer Networks",
    topic: "Networking",
    description: "Master routing, protocols, network design and secure communication.",
    modules: "10",
    duration: "6h",
    Icon: BsWifi,
    image: networkingImage,
    variant: "orb",
    position: "far-left",
  },
  {
    title: "Database Systems",
    topic: "Databases",
    description: "Design schemas, write efficient queries and understand modern storage.",
    modules: "12",
    duration: "8h",
    Icon: BsDatabase,
    image: databaseImage,
    variant: "wave",
    primaryAction: true,
    position: "left",
  },
  {
    title: "Cyber Security",
    topic: "Cyber Security",
    description: "Learn threat analysis, ethical security and defensive engineering.",
    modules: "14",
    duration: "10h",
    Icon: BsShieldLock,
    image: cyberSecurityImage,
    variant: "helmet",
    featured: true,
    position: "center",
  },
  {
    title: "Software Development",
    topic: "Development",
    description: "Build maintainable applications with clean code and modern workflows.",
    modules: "16",
    duration: "12h",
    Icon: BsCodeSlash,
    image: softwareDevelopmentImage,
    variant: "portrait",
    position: "right",
  },
  {
    title: "Cloud Computing",
    topic: "Cloud & DevOps",
    description: "Deploy scalable services and automate cloud infrastructure workflows.",
    modules: "11",
    duration: "9h",
    Icon: FaCloud,
    image: cloudComputingImage,
    variant: "skull",
    position: "far-right",
  },
];

export const CourseHero = ({ courseCount = 0 }) => {
  return (
    <section aria-labelledby="course-showcase-title" className="course-hero-showcase">
      <div className="course-hero-showcase__aurora pointer-events-none absolute inset-0" />
      <div className="course-hero-showcase__beams pointer-events-none absolute inset-0" />
      <div className="course-hero-showcase__grid pointer-events-none absolute inset-0" />
      <div className="course-hero-showcase__spotlight pointer-events-none absolute left-1/2 top-[255px] h-[420px] w-[760px] -translate-x-1/2" />

      <div className="relative z-20 mx-auto h-[700px] max-w-[1500px] px-4 sm:h-[700px] sm:px-6 lg:px-8">
        <div className="course-hero-showcase__content relative z-30 mx-auto max-w-[820px] pt-10 text-center sm:pt-12">
          <span className="course-hero-showcase__kicker">Career-focused IT learning</span>
          <h1 id="course-showcase-title" className="course-hero-showcase__title mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[44px] lg:text-[52px]">
            Build skills for the <span className="text-[#a8ff6a]">digital future</span>
          </h1>
          <p className="course-hero-showcase__description mx-auto mt-3 max-w-[650px] text-[12px] leading-5 text-white/52 sm:text-[14px] sm:leading-6">
            Practical IT courses designed to strengthen your technical foundations and help you create, secure, and scale modern technology.
          </p>

          <div className="course-hero-showcase__signals" aria-label="Course highlights">
            <span><BsBook />{courseCount > 0 ? `${courseCount} curated courses` : "Curated courses"}</span>
            <span><BsCodeSlash />Practical curriculum</span>
            <span><BsClock />Learn at your pace</span>
          </div>
        </div>

        <div className="course-hero-card-deck absolute inset-x-0 top-[172px] hidden h-[560px] lg:block">
          {heroCards.map((card) => (
            <HeroCourseCard key={card.title} card={card} />
          ))}
        </div>

        <div className="course-hero-card-deck course-hero-card-deck--mobile absolute inset-x-0 top-[220px] mx-auto h-[520px] max-w-[680px] lg:hidden">
          {heroCards.map((card) => (
            <HeroCourseCard key={card.title} card={card} mobile />
          ))}
        </div>
      </div>
    </section>
  );
};

const HeroCourseCard = ({ card, mobile = false }) => {
  const Icon = card.Icon;
  const cardSize = card.featured ? "h-[398px] w-[292px]" : "h-[374px] w-[274px]";
  const actionButtonClass = card.primaryAction
    ? "border-[#d8ffb4]/60 bg-[#b7ff7c] text-[#13210b] shadow-[0_0_22px_rgba(174,255,111,0.34)]"
    : "border-white/70 bg-black/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";

  return (
    <article
      aria-label={`${card.topic} course card`}
      className={`course-hero-card course-hero-card--${card.position} ${mobile ? "course-hero-card--mobile" : `absolute ${cardSize}`} rounded-[34px] border p-[3px] ${
        card.featured
          ? "border-[#d2ffa8]/75 bg-[linear-gradient(145deg,rgba(226,255,196,0.62),rgba(135,255,84,0.20)_38%,rgba(255,255,255,0.07))] shadow-[0_0_0_1px_rgba(191,255,136,0.24),0_0_18px_rgba(203,255,160,0.52),0_0_48px_rgba(133,255,65,0.34),0_38px_120px_rgba(0,0,0,0.88)]"
          : "border-white/[0.20] bg-[linear-gradient(145deg,rgba(255,255,255,0.38),rgba(255,255,255,0.055)_44%,rgba(166,255,102,0.09))] shadow-[0_32px_95px_rgba(0,0,0,0.76)]"
      }`}
    >
      <div className="course-hero-card__inner relative h-full overflow-hidden rounded-[30px] border border-white/[0.16] bg-[#050806] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-78px_86px_rgba(0,0,0,0.94)]">
        <CourseCardArtwork image={card.image} title={card.title} variant={card.variant} featured={card.featured} />

        <div className="pointer-events-none absolute inset-0 bg-[#020704]/20" />
        <div className="pointer-events-none absolute inset-0 bg-[#15320f]/20 mix-blend-color" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07120a]/0 via-[#050906]/28 to-[#020302]/96" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_5%,rgba(2,5,3,0.44)_94%)]" />
        <div className="course-hero-card__reflection pointer-events-none absolute -left-[22%] -top-[8%] h-[74%] w-[48%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent blur-[2px]" />
        <div className="course-hero-card__scan pointer-events-none absolute inset-0 opacity-[0.12] [background-image:repeating-linear-gradient(180deg,transparent_0,transparent_3px,rgba(210,255,184,0.16)_4px)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-px w-[58%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-10 rounded-[30px] ring-1 ring-inset ring-white/[0.08]" />

        {!card.featured && (
          <div className="absolute left-5 top-5 z-20 rounded-full border border-white/[0.10] bg-black/25 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
            <span className="flex items-center gap-2 text-[7px] font-bold uppercase tracking-[0.14em] text-white/58">
              <Icon className="text-[#a8ff5c]" />
              {card.topic}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-20 p-5">
          <div className="flex items-center gap-2">
            <h3 className={`${card.featured ? "text-[21px]" : "text-[20px]"} line-clamp-1 font-medium text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]`}>{card.title}</h3>
            <HiCheckBadge size={19} className="shrink-0 text-[#17d848]" />
          </div>

          <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-white/66">{card.description}</p>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.10] pt-4">
            <div className="flex items-center gap-4 text-[12px] text-white/84">
              <span className="inline-flex items-center gap-1.5">
                <BsBook />
                {card.modules} modules
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BsClock />
                {card.duration}
              </span>
            </div>

            <button type="button" className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[12px] font-medium ${actionButtonClass}`}>
              Explore
              <BsArrowUpRight className="text-[14px]" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const CourseCardArtwork = ({ image, title, variant, featured = false }) => {
  if (image) {
    return <img src={image} alt={`${title} course artwork`} className="absolute inset-0 h-full w-full object-cover object-top" />;
  }

  if (variant === "wave") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#050807]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_44%,rgba(255,79,19,0.82),transparent_17%),radial-gradient(circle_at_62%_34%,rgba(255,176,38,0.5),transparent_16%),radial-gradient(circle_at_60%_52%,rgba(72,255,57,0.44),transparent_26%),linear-gradient(145deg,#061008_0%,#020302_84%)]" />
        <div className="absolute left-[14%] top-[19%] h-[172px] w-[188px] -rotate-[7deg] rounded-[36%] bg-black/42 blur-[2px]" />
        {Array.from({ length: 30 }).map((_, index) => (
          <span
            key={index}
            className="absolute top-[25%] h-[184px] w-[3px] rounded-full bg-gradient-to-b from-transparent via-[#aaff66] to-transparent opacity-80"
            style={{
              left: `${9 + index * 3.1}%`,
              transform: `scaleY(${0.18 + Math.abs(Math.sin(index * 0.82)) * 1.05})`,
              filter: "drop-shadow(0 0 11px rgba(168,255,92,.72))",
            }}
          />
        ))}
        <div className="absolute left-[14%] top-[60%] h-px w-[72%] bg-gradient-to-r from-white/0 via-white/22 to-white/0" />
        <div className="absolute left-[14%] top-[67%] text-[5px] font-semibold uppercase text-white/46">Relational data model</div>
        <div className="absolute right-[16%] top-[61%] text-[5px] font-semibold uppercase text-white/46">Query performance</div>
      </div>
    );
  }

  if (variant === "helmet") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_47%_17%,#e9fff5_0%,#9de8d0_18%,#153527_45%,#030503_88%)]">
        <div className="absolute inset-x-5 top-5 h-[172px] rounded-[34px] bg-[radial-gradient(circle_at_49%_25%,rgba(255,255,255,0.62),transparent_26%),linear-gradient(145deg,rgba(189,255,233,0.18),rgba(9,32,24,0.4))]" />
        <div className="absolute left-[29%] top-[18%] h-[184px] w-[122px] rounded-[45%] bg-[linear-gradient(97deg,#070b0a_0%,#26352f_29%,#a9d7c8_49%,#173028_62%,#050706_100%)] shadow-[inset_28px_0_32px_rgba(0,0,0,0.9),inset_-15px_0_24px_rgba(0,0,0,0.68),0_16px_32px_rgba(0,0,0,0.42)]" />
        <div className="absolute left-[33%] top-[17%] h-[180px] w-[130px] rounded-[48%] border-[12px] border-[#111817] shadow-[inset_0_0_28px_rgba(0,0,0,0.92),0_0_24px_rgba(0,0,0,0.56)]" />
        <div className="absolute left-[27%] top-[17%] h-[132px] w-[54px] rounded-full border-l-[14px] border-[#070c0c]" />
        <div className="absolute right-[25%] top-[18%] h-[128px] w-[60px] rounded-full border-r-[13px] border-[#0b1110]" />
        <div className="absolute left-[45%] top-[23%] h-[88px] w-[72px] rounded-[28px] border border-white/16 bg-[linear-gradient(145deg,rgba(255,255,255,0.17),rgba(0,0,0,0.22))]" />
        <div className="absolute right-[31%] top-[29%] h-[112px] w-[74px] rounded-[45%] bg-[#111c18]/90 blur-[1px]" />
        <div className="absolute left-[43%] top-[39%] h-[74px] w-[120px] rounded-full bg-[#17ff4a]/38 blur-[14px]" />
        <div className="absolute left-[42%] top-[42%] h-[3px] w-[92px] rounded-full bg-[#72ff73] shadow-[0_0_16px_rgba(114,255,115,0.78)]" />
        {Array.from({ length: 13 }).map((_, index) => (
          <span
            key={index}
            className="absolute rounded-full border border-[#90ff83]/60 bg-[#18ff4b]/42 shadow-[0_0_11px_rgba(39,255,65,0.66)]"
            style={{
              left: `${50 + (index % 4) * 4.8}%`,
              top: `${37 + Math.floor(index / 4) * 5.8}%`,
              width: `${5 + (index % 3) * 3}px`,
              height: `${5 + (index % 3) * 3}px`,
            }}
          />
        ))}
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={`rail-${index}`} className="absolute right-[24%] h-px rounded-full bg-white/22" style={{ top: `${21 + index * 3.8}%`, width: `${42 - index * 3}px` }} />
        ))}
        <div className="absolute right-[20%] top-[18%] h-12 w-16 rounded-[18px] border border-white/12 bg-black/26" />
        {featured && <div className="absolute inset-x-8 top-6 h-20 rounded-full bg-white/24 blur-[28px]" />}
      </div>
    );
  }

  if (variant === "portrait") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_70%_24%,rgba(48,255,136,0.24),transparent_27%),linear-gradient(145deg,#08130e_0%,#020403_82%)]">
        <div className="absolute inset-x-[9%] top-[12%] h-[205px] overflow-hidden rounded-[22px] border border-white/15 bg-[#050a07]/88 shadow-[0_18px_45px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex h-8 items-center gap-1.5 border-b border-white/10 px-3">
            <span className="size-1.5 rounded-full bg-[#ff6b6b]/70" />
            <span className="size-1.5 rounded-full bg-[#ffd66b]/70" />
            <span className="size-1.5 rounded-full bg-[#8dff72]/80" />
            <span className="ml-3 text-[5px] uppercase tracking-[0.14em] text-white/30">app.jsx</span>
          </div>
          <div className="space-y-3 p-4">
            {[74, 52, 84, 61, 46, 78, 56].map((width, index) => (
              <div key={width} className="flex items-center gap-2">
                <span className="w-3 text-[5px] text-white/22">{index + 1}</span>
                <span className={`h-1 rounded-full ${index % 3 === 0 ? "bg-[#80ff77]/70" : index % 3 === 1 ? "bg-[#5eead4]/55" : "bg-white/26"}`} style={{ width: `${width}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute left-[18%] top-[48%] h-20 w-[70%] rounded-full bg-[#59ff79]/12 blur-[28px]" />
      </div>
    );
  }

  if (variant === "skull") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_58%_25%,rgba(70,255,194,0.38),transparent_26%),linear-gradient(150deg,#071915_0%,#020504_78%)]">
        <div className="absolute left-1/2 top-[15%] -translate-x-1/2 text-[116px] text-[#9bffcb]/24 drop-shadow-[0_0_24px_rgba(95,255,185,0.32)]">
          <FaCloud />
        </div>
        <div className="absolute left-[17%] top-[46%] flex w-[66%] items-center justify-between">
          {[0, 1, 2].map((index) => (
            <div key={index} className="relative h-16 w-12 rounded-lg border border-[#8dffd0]/22 bg-black/45 shadow-[0_0_18px_rgba(61,255,181,0.10)]">
              {[0, 1, 2].map((line) => (
                <span key={line} className="absolute left-2 right-2 h-px bg-[#78ffc1]/42" style={{ top: `${14 + line * 13}px` }} />
              ))}
              <span className="absolute bottom-2 right-2 size-1 rounded-full bg-[#7dff9c] shadow-[0_0_7px_#7dff9c]" />
            </div>
          ))}
        </div>
        <div className="absolute left-1/2 top-[40%] h-16 w-px -translate-x-1/2 bg-gradient-to-b from-[#8dffd0]/65 to-transparent" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_47%_33%,#cefff6_0%,#75ddd1_22%,#081a17_58%,#020402_100%)]">
      {Array.from({ length: 22 }).map((_, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-[#001f1d]/88 shadow-[0_0_18px_rgba(125,255,218,0.18)]"
          style={{
            left: `${8 + ((index * 17) % 82)}%`,
            top: `${10 + ((index * 23) % 58)}%`,
            width: `${9 + (index % 4) * 9}px`,
            height: `${9 + (index % 4) * 9}px`,
          }}
        />
      ))}
    </div>
  );
};
