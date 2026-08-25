import { BsEye, BsHeart, BsFiles } from "react-icons/bs";
import { HiCheckBadge } from "react-icons/hi2";

export const HeroTechCard = ({ course, featured = false, className = "" }) => {
  return (
    <article
      className={`group relative overflow-hidden rounded-[32px] border bg-[#070906] p-[6px] transition-all duration-500 ${
        featured
          ? "border-[#b7ff6a]/45 shadow-[0_28px_90px_rgba(0,0,0,0.7),0_0_0_1px_rgba(183,255,106,0.08),0_0_22px_rgba(168,255,92,0.26),0_0_65px_rgba(122,255,67,0.12)]"
          : "border-white/[0.08] shadow-[0_24px_70px_rgba(0,0,0,0.68)]"
      } ${className}`}
    >
      {/* neon outer glow */}

      <div className={`pointer-events-none absolute inset-0 rounded-[32px] ${featured ? "shadow-[inset_0_0_18px_rgba(168,255,92,0.11)]" : ""}`}></div>

      {/* inner card */}

      <div className="relative h-[390px] overflow-hidden rounded-[27px] bg-[#050705] sm:h-[410px] lg:h-[430px]">
        {/* image */}

        <img src={course.image} alt={course.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />

        {/* green image tint */}

        <div className="pointer-events-none absolute inset-0 bg-[#7dff3e]/[0.035] mix-blend-screen"></div>

        {/* top shade */}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-black/35 via-black/10 to-transparent"></div>

        {/* strong lower black gradient */}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#030503] via-[#030503]/90 via-45% to-transparent"></div>

        {/* secondary green lower glow */}

        <div className="pointer-events-none absolute -bottom-16 left-1/2 h-36 w-[80%] -translate-x-1/2 rounded-full bg-[#a8ff5c]/[0.085] blur-[42px]"></div>

        {/* upper border light */}

        <div className="pointer-events-none absolute left-[15%] right-[15%] top-0 h-px bg-gradient-to-r from-transparent via-[#d2ffaf]/55 to-transparent"></div>

        {/* category */}

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[#b7ff6a]/20 bg-black/50 px-3 py-1.5 backdrop-blur-xl">
          <span className="h-1.5 w-1.5 rounded-full bg-[#a8ff5c] shadow-[0_0_9px_rgba(168,255,92,0.9)]"></span>

          <span className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[#d9ffbd]/75">{course.category || "Technology"}</span>
        </div>

        {/* content */}

        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
          {/* mini label */}

          <div className="mb-2 flex items-center gap-2">
            <span className="text-[7px] font-medium uppercase tracking-[0.16em] text-white/25">Course</span>

            <span className="h-1 w-1 rounded-full bg-[#a8ff5c]/60"></span>

            <span className="text-[7px] font-medium uppercase tracking-[0.16em] text-[#baff80]/45">IT Learning</span>
          </div>

          {/* title */}

          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-semibold leading-[1.15] tracking-[-0.025em] text-white sm:text-[18px]">{course.title}</h3>

            <HiCheckBadge className="shrink-0 text-[#a8ff5c]" size={15} />
          </div>

          {/* subtitle */}

          <p className="mt-2 line-clamp-2 max-w-[95%] text-[9px] leading-[1.65] text-white/38">{course.subtitle}</p>

          {/* divider */}

          <div className="my-3 h-px w-full bg-gradient-to-r from-white/[0.04] via-white/[0.09] to-transparent"></div>

          {/* stats + button */}

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[8px] text-white/38">
                <BsEye size={10} />
                {course.views || "3.2K"}
              </span>

              <span className="inline-flex items-center gap-1.5 text-[8px] text-white/38">
                <BsHeart size={10} />
                {course.likes || "148"}
              </span>
            </div>

            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-[#d7ffb8]/30 bg-[#a8ff5c] px-4 text-[8px] font-semibold text-[#0a0d08] shadow-[0_0_20px_rgba(168,255,92,0.18),inset_0_1px_0_rgba(255,255,255,0.40)] transition-all duration-300 hover:bg-[#b8ff7a] hover:shadow-[0_0_28px_rgba(168,255,92,0.30)]"
            >
              <BsFiles size={11} />
              Explore
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
