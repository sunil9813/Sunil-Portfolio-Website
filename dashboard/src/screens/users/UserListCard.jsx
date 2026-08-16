import PropTypes from "prop-types";
import { Avatar, Tooltip } from "@material-tailwind/react";
import { BsInstagram, BsTiktok, BsTwitterX, BsFilePost, BsPeople, BsPersonPlus, BsCheckCircle, BsStarFill, BsThreeDots } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { generateItemColor } from "@/utils";
import { Wrapper } from "@/routes";

const mutedPalette = ["bg-slate-500", "bg-zinc-500", "bg-stone-500", "bg-gray-500", "bg-slate-600", "bg-zinc-600", "bg-stone-600", "bg-gray-600"];

const getMutedColor = (name) => {
  const hash = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return mutedPalette[hash % mutedPalette.length];
};

const fmt = (n) => {
  if (n === undefined || n === null) return "—";
  if (typeof n === "string") return n;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return n.toString();
};

export const UserListCard = ({ rowData }) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {rowData.map((user) => {
          const displayName = user?.name || "Unknown";
          const email = user?.email;
          const role = user?.role || "Member";
          const isDefault = !user?.avatar?.url || user?.avatar?.url.includes("flaticon");
          const mutedBg = getMutedColor(displayName);

          const isVerified = user?.verified ?? displayName.length % 2 === 0;
          const isPremium = user?.premium ?? (email && email.includes("premium"));
          const isOnline = user?.online ?? Math.random() > 0.3;

          return (
            <div
              key={user._id}
              className="group relative flex flex-col rounded-[24px] overflow-hidden
                         /* LIGHT */
                         bg-white border border-slate-200/60
                         /* DARK */
                         dark:bg-[#111114] dark:border-white/[0.06]
                         /* SHADOWS */
                         shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04)]
                         dark:shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_8px_32px_rgba(0,0,0,0.45)]
                         /* INNER HIGHLIGHT */
                         [&::before]:absolute [&::before]:inset-0 [&::before]:rounded-[24px] [&::before]:ring-1 [&::before]:ring-inset [&::before]:ring-white/[0.6] [&::before]:pointer-events-none dark:[&::before]:ring-white/[0.04]
                         /* HOVER SHINE EFFECT */
                         [&::after]:absolute [&::after]:inset-0 [&::after]:rounded-[24px] [&::after]:opacity-0 [&::after]:transition-opacity [&::after]:duration-500 [&::after]:pointer-events-none
                         [&::after]:bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.03)_45%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.03)_55%,transparent_60%)]
                         group-hover:[&::after]:opacity-100
                         /* TRANSITION */
                         transition-all duration-300 ease-out
                         hover:-translate-y-1.5
                         hover:shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.06),0_20px_40px_rgba(0,0,0,0.08)]
                         dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_16px_48px_rgba(0,0,0,0.55)]
                         dark:hover:border-white/[0.10]"
            >
              {/* ═══════ COVER HEADER ═══════ */}
              <div className="relative h-24 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-[#18181c] dark:to-[#111114]">
                {/* Subtle grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Top-right actions */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {isPremium && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/90 dark:bg-white/[0.08] backdrop-blur-md text-[10px] font-semibold text-slate-700 dark:text-white/80 uppercase tracking-wider border border-slate-200/60 dark:border-white/[0.06]">
                      <BsStarFill className="w-2.5 h-2.5" />
                      Pro
                    </span>
                  )}
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-white/30 dark:hover:text-white/80 hover:bg-white/80 dark:hover:bg-white/[0.06] transition-all duration-200">
                    <BsThreeDots className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ═══════ AVATAR (overlaps header) ═══════ */}
              <div className="flex justify-center -mt-10 mb-4 relative z-10">
                <div className="relative">
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-slate-400/15 dark:bg-white/10 blur-2xl scale-125" />

                  {isDefault ? (
                    <div
                      className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center text-white text-[22px] font-semibold shadow-2xl ring-[4px] ring-white dark:ring-[#111114] transition-transform duration-500 group-hover:scale-[1.05] ${mutedBg}`}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <Avatar
                      src={user.avatar.url}
                      alt={displayName}
                      className="relative w-[72px] h-[72px] rounded-full object-cover shadow-2xl ring-[4px] ring-white dark:ring-[#111114] transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  )}

                  {/* Online status */}
                  <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-500 border-[3px] border-white dark:border-[#111114] rounded-full z-10">
                    {isOnline && <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/50" />}
                  </span>

                  {/* Verified */}
                  {isVerified && (
                    <div className="absolute -top-0.5 -right-1 bg-white dark:bg-[#111114] rounded-full p-[2px] shadow-lg z-10">
                      <BsCheckCircle className="w-[18px] h-[18px] text-slate-900 dark:text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* ═══════ CONTENT ═══════ */}
              <div className="flex flex-col items-center px-6 text-center">
                {/* Name */}
                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{displayName}</h3>

                {/* Role */}
                <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-white/30">{role}</span>

                {/* Email */}
                {email && <p className="mt-1.5 text-[11px] text-slate-400 dark:text-white/25 truncate max-w-[200px]">{email}</p>}

                {/* ═══════ STATS ─ clean row with dots ═══════ */}
                <div className="flex items-center justify-center gap-3 mt-5">
                  <div className="flex flex-col items-center">
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white/90 tabular-nums">{fmt(user.posts)}</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30 mt-0.5">Posts</span>
                  </div>
                  <span className="text-slate-300 dark:text-white/10 text-[10px]">·</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white/90 tabular-nums">{fmt(user.followers)}</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30 mt-0.5">Followers</span>
                  </div>
                  <span className="text-slate-300 dark:text-white/10 text-[10px]">·</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white/90 tabular-nums">{fmt(user.following)}</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30 mt-0.5">Following</span>
                  </div>
                </div>

                {/* ═══════ ACTION BUTTONS ═══════ */}
                <div className="flex items-center gap-2 w-full mt-5">
                  <button
                    className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold
                                     bg-slate-900 text-white hover:bg-slate-800
                                     dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200
                                     transition-all duration-200 active:scale-[0.97] shadow-sm"
                  >
                    Follow
                  </button>
                  <button
                    className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold
                                     bg-slate-100 text-slate-700 hover:bg-slate-200
                                     dark:bg-white/[0.05] dark:text-white/70 dark:hover:bg-white/[0.10]
                                     transition-all duration-200 active:scale-[0.97]"
                  >
                    Message
                  </button>
                </div>

                {/* ═══════ SOCIAL LINKS ─ minimal ═══════ */}
                <div className="flex items-center justify-center gap-6 mt-5 mb-6">
                  {[
                    { icon: FaFacebookF, label: "Facebook" },
                    { icon: BsInstagram, label: "Instagram" },
                    { icon: BsTwitterX, label: "Twitter" },
                    { icon: BsTiktok, label: "TikTok" },
                  ].map(({ icon: Icon, label }) => (
                    <Tooltip key={label} content={label} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] px-2 py-1 rounded-md">
                      <button className="text-slate-350 hover:text-slate-700 dark:text-white/20 dark:hover:text-white/70 transition-colors duration-200" aria-label={label}>
                        <Icon size={13} />
                      </button>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

UserListCard.propTypes = {
  rowData: PropTypes.array,
};
