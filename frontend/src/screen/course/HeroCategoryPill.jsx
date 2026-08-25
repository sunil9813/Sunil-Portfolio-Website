export const HeroCategoryPill = ({ course }) => {
  const Icon = course.icon;

  return (
    <div className="group inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-[#090c08]/75 px-4 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a8ff5c]/20 hover:bg-[#10150d]">
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#a8ff5c]/10 bg-[#a8ff5c]/[0.055] text-[11px] text-[#b8ff79]/65">
        <Icon />
      </span>

      <span className="text-[8px] font-semibold uppercase tracking-[0.13em] text-white/30 transition-colors duration-300 group-hover:text-[#d6ffb6]/70">{course.title}</span>
    </div>
  );
};
