import { BsCodeSlash, BsDatabase, BsEye, BsHeart, BsShieldLock, BsStars, BsWifi } from "react-icons/bs";
import { FaCloud } from "react-icons/fa6";
import { FiCopy } from "react-icons/fi";
import { HiCheckBadge, HiSparkles } from "react-icons/hi2";

const heroCards = [
  {
    title: "Stephen Ramiz",
    topic: "Networks",
    description: "Routing, packets and secure communication systems.",
    views: "372",
    likes: "44",
    Icon: BsWifi,
    variant: "orb",
    className: "left-[8%] top-[170px] z-10 -rotate-[12deg] opacity-55 blur-[1.5px] scale-[0.96]",
  },
  {
    title: "Arman Meymandi",
    topic: "Data Systems",
    description: "Schema design, queries, indexing and storage engines.",
    views: "312",
    likes: "48",
    Icon: BsDatabase,
    variant: "wave",
    copyStyle: "green",
    className: "left-[24%] top-[128px] z-30 -rotate-[13deg]",
  },
  {
    title: "John Smith",
    topic: "Cyber Security",
    description: "Threat models, defensive systems and secure practice.",
    views: "312",
    likes: "48",
    Icon: BsShieldLock,
    variant: "helmet",
    featured: true,
    className: "left-1/2 top-[58px] z-50 -translate-x-1/2",
  },
  {
    title: "Alex Jackson",
    topic: "Programming",
    description: "Build practical software with clean frontend patterns.",
    views: "312",
    likes: "48",
    Icon: BsCodeSlash,
    variant: "portrait",
    className: "right-[24%] top-[128px] z-30 rotate-[13deg]",
  },
  {
    title: "Maria Gomez",
    topic: "Cloud",
    description: "Deploy apps, services and infrastructure workflows.",
    views: "372",
    likes: "44",
    Icon: FaCloud,
    variant: "skull",
    className: "right-[8%] top-[170px] z-10 rotate-[12deg] opacity-55 blur-[1.5px] scale-[0.96]",
  },
];

const stylePills = [
  { label: "Bokeh", accent: "from-lime-200 to-emerald-500" },
  { label: "Claymation", accent: "from-orange-300 to-lime-300" },
  { label: "Fantasy", accent: "from-green-200 to-cyan-400" },
  { label: "Disney Pixar", accent: "from-pink-300 to-lime-300" },
  { label: "Studio Ghibli", accent: "from-cyan-200 to-lime-500" },
  { label: "Collage", accent: "from-rose-300 to-emerald-300" },
  { label: "Pop Art", accent: "from-fuchsia-400 to-lime-300" },
  { label: "80s Retro", accent: "from-violet-400 to-green-300" },
  { label: "Cyberpunk", accent: "from-cyan-400 to-lime-400" },
  { label: "Pixel Art", accent: "from-amber-200 to-lime-500" },
  { label: "Retro Comics", accent: "from-slate-300 to-lime-300" },
  { label: "3D Models", accent: "from-blue-300 to-emerald-400" },
  { label: "GTA Cover Art", accent: "from-teal-300 to-green-500" },
  { label: "Porcelain", accent: "from-neutral-300 to-slate-500" },
  { label: "1990s anime", accent: "from-sky-300 to-lime-300" },
  { label: "Watercolor", accent: "from-orange-300 to-rose-400" },
  { label: "Oilpaint", accent: "from-zinc-300 to-lime-300" },
];

export const CourseHero = () => {
  return (
    <section className="relative isolate min-h-[980px] overflow-hidden bg-[#020402] pt-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_9%_0%,rgba(181,255,124,0.28),transparent_18%),radial-gradient(circle_at_91%_0%,rgba(181,255,124,0.26),transparent_18%),linear-gradient(180deg,#172610_0%,#050805_34%,#010201_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.19] [background-image:radial-gradient(rgba(216,255,181,0.75)_0.75px,transparent_0.75px)] [background-size:7px_7px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[780px] -translate-x-1/2 opacity-[0.16] [background-image:linear-gradient(rgba(185,255,118,0.48)_1px,transparent_1px),linear-gradient(90deg,rgba(185,255,118,0.48)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_72%)]" />

      <div className="pointer-events-none absolute left-1/2 top-[100px] h-[680px] w-[1120px] -translate-x-1/2 rounded-[50%] border border-[#b7ff74]/20 bg-[radial-gradient(ellipse_at_top,rgba(171,255,111,0.15)_0%,rgba(107,170,62,0.055)_32%,transparent_62%)] shadow-[0_-2px_7px_rgba(216,255,185,0.9),0_-17px_44px_rgba(151,255,83,0.38),0_-80px_150px_rgba(151,255,83,0.18)] sm:w-[1380px] xl:w-[1570px]" />
      <div className="pointer-events-none absolute left-1/2 top-[86px] h-[98px] w-[850px] -translate-x-1/2 rounded-full bg-[#a9ff65]/[0.17] blur-[48px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[355px] bg-gradient-to-b from-transparent via-black/82 to-[#0B1117]" />

      <div className="relative z-50 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto text-center">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#b7ff74]/55 bg-black/42 px-4 py-1.5 shadow-[0_0_22px_rgba(181,255,124,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <HiSparkles size={14} className="text-[#c6ff9a]" />
            <span className="text-[11px] text-[#ecffe1]">New: Our AI integration just landed</span>
          </div>

          <h1 className="mx-auto mt-4 max-w-[1180px] text-[42px] font-semibold leading-[1.02] text-white sm:text-[58px] lg:text-[66px] xl:text-[76px]">
            Think better with <span className="font-mono text-[#a8ff5c] drop-shadow-[0_0_22px_rgba(168,255,92,0.28)]">Course-Boom</span>
          </h1>
        </div>

        <div className="relative mx-auto mt-0 h-[760px] max-w-[1420px] overflow-visible">
          <div className="pointer-events-none absolute left-1/2 top-[90px] h-px w-[62%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d3ffb8]/55 to-transparent" />

          <div className="absolute inset-x-0 top-0 hidden h-[560px] lg:block">
            {heroCards.map((card) => (
              <HeroCourseCard key={card.title} card={card} />
            ))}
          </div>

          <div className="mx-auto grid max-w-[920px] grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:hidden">
            {heroCards.slice(1, 5).map((card) => (
              <HeroCourseCard key={card.title} card={{ ...card, className: "", featured: card.featured }} mobile />
            ))}
          </div>

          <div className="absolute left-1/2 top-[520px] z-30 hidden w-full max-w-[1240px] -translate-x-1/2 px-4 lg:block">
            <div className="grid grid-cols-6 gap-x-5 gap-y-5 opacity-70">
              {stylePills.map((pill, index) => (
                <div
                  key={pill.label}
                  className={`${index > 11 ? "translate-x-28" : ""} flex h-[58px] items-center gap-4 rounded-full border border-white/[0.07] bg-black/43 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.045),0_18px_50px_rgba(0,0,0,0.42)] backdrop-blur-xl`}
                >
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${pill.accent} p-[2px] shadow-[0_0_18px_rgba(168,255,92,0.20)]`}>
                    <span className="flex size-full items-center justify-center rounded-full bg-[#080c07] text-[10px] text-[#d9ffc7]">
                      <BsStars />
                    </span>
                  </span>

                  <span className="truncate text-[13px] text-white/48">{pill.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroCourseCard = ({ card, mobile = false }) => {
  const Icon = card.Icon;
  const cardSize = card.featured ? "h-[390px] w-[288px]" : "h-[365px] w-[268px]";
  const copyButtonClass =
    card.copyStyle === "green"
      ? "border-[#d8ffb4]/60 bg-[#b7ff7c] text-[#13210b] shadow-[0_0_22px_rgba(174,255,111,0.34)]"
      : "border-white/70 bg-black/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";

  return (
    <article
      className={`${mobile ? "relative h-[382px] w-full" : `absolute ${cardSize} ${card.className}`} overflow-hidden rounded-[34px] border p-[3px] transition-transform duration-300 ${
        card.featured
          ? "border-[#c7ff93]/70 bg-[linear-gradient(145deg,rgba(207,255,156,0.58),rgba(134,255,90,0.18)_36%,rgba(255,255,255,0.07))] shadow-[0_0_0_1px_rgba(191,255,136,0.22),0_0_32px_rgba(161,255,83,0.52),0_35px_120px_rgba(0,0,0,0.82)]"
          : "border-white/[0.18] bg-[linear-gradient(145deg,rgba(255,255,255,0.34),rgba(255,255,255,0.06)_42%,rgba(166,255,102,0.08))] shadow-[0_35px_120px_rgba(0,0,0,0.66)]"
      }`}
    >
      <div className="relative h-full overflow-hidden rounded-[30px] border border-white/[0.16] bg-[#050806] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-78px_86px_rgba(0,0,0,0.94)]">
        <CourseCardArtwork variant={card.variant} featured={card.featured} />

        <div className="pointer-events-none absolute inset-0 bg-[#020704]/20" />
        <div className="pointer-events-none absolute inset-0 bg-[#15320f]/20 mix-blend-color" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07120a]/0 via-[#050906]/28 to-[#020302]/96" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_5%,rgba(2,5,3,0.44)_94%)]" />
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
                <BsEye />
                {card.views}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BsHeart />
                {card.likes}
              </span>
            </div>

            <button type="button" className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[12px] font-medium ${copyButtonClass}`}>
              <FiCopy className="text-[16px]" />
              Copy
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const CourseCardArtwork = ({ variant, featured = false }) => {
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
        <div className="absolute left-[14%] top-[67%] text-[5px] font-semibold uppercase text-white/46">A new subset of recovery</div>
        <div className="absolute right-[16%] top-[61%] text-[5px] font-semibold uppercase text-white/46">Homepage icon design</div>
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
          <span
            key={`rail-${index}`}
            className="absolute right-[24%] h-px rounded-full bg-white/22"
            style={{ top: `${21 + index * 3.8}%`, width: `${42 - index * 3}px` }}
          />
        ))}
        <div className="absolute right-[20%] top-[18%] h-12 w-16 rounded-[18px] border border-white/12 bg-black/26" />
        {featured && <div className="absolute inset-x-8 top-6 h-20 rounded-full bg-white/24 blur-[28px]" />}
      </div>
    );
  }

  if (variant === "portrait") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_58%_31%,#6e756c_0%,#172018_37%,#040604_82%)]">
        <div className="absolute left-[34%] top-[17%] h-[220px] w-[138px] rounded-[47%] bg-[linear-gradient(103deg,#101513_0%,#6f8176_41%,#2d3d34_55%,#080b0a_92%)] shadow-[inset_33px_0_36px_rgba(0,0,0,0.72)]" />
        <div className="absolute left-[23%] top-[20%] h-[135px] w-[92px] rounded-full bg-black/76 blur-[3px]" />
        <div className="absolute left-[37%] top-[31%] h-[46px] w-[104px] rounded-full bg-[#111816]/82" />
        {Array.from({ length: 11 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-px rounded-full bg-[#a8ff5c] shadow-[0_0_10px_rgba(168,255,92,0.86)]"
            style={{
              left: `${43 + index * 1.4}%`,
              top: `${39 + index * 1.45}%`,
              width: `${50 - index * 2}px`,
              opacity: 0.9 - index * 0.045,
            }}
          />
        ))}
        <div className="absolute left-[28%] top-[44%] h-px w-[216px] bg-[#a8ff5c]/82 shadow-[0_0_16px_#a8ff5c]" />
        <div className="absolute left-[42%] top-[43%] h-20 w-36 rounded-full bg-[#3aff5c]/30 blur-[18px]" />
      </div>
    );
  }

  if (variant === "skull") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_61%_28%,#46ff76_0%,#0d4025_31%,#030503_76%)]">
        <div className="absolute right-[15%] top-[14%] h-[190px] w-[150px] rounded-[47%] border border-[#8dff72]/25 bg-[#bfff9f]/18 shadow-[inset_0_-40px_40px_rgba(0,0,0,0.68)]" />
        <div className="absolute right-[26%] top-[32%] size-9 rounded-full bg-black/76" />
        <div className="absolute right-[12%] top-[33%] size-8 rounded-full bg-black/70" />
        <div className="absolute right-[22%] top-[48%] h-6 w-12 rounded-full bg-black/62" />
        <div className="absolute right-[8%] top-[12%] h-[208px] w-[110px] rounded-full border-r-[9px] border-[#79ff70]/46 blur-[1px]" />
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
