import { Wrapper } from "@/routes";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { FaUser, FaUserFriends, FaUsers, FaUserSecret } from "react-icons/fa";

const audienceData = [
  {
    name: "Logged-in Users",
    value: 33.1,
    count: "284.5K",
    Icon: FaUser,
    color: "#5F82A8",
    background: "bg-blue-50/80 dark:bg-blue-400/[0.055]",
    border: "border-blue-200/80 dark:border-blue-300/[0.09]",
    text: "text-blue-700 dark:text-blue-200/75",
  },
  {
    name: "Guest Users",
    value: 22.1,
    count: "198.2K",
    Icon: FaUserSecret,
    color: "#A6784B",
    background: "bg-amber-50/80 dark:bg-amber-400/[0.055]",
    border: "border-amber-200/80 dark:border-amber-300/[0.09]",
    text: "text-amber-700 dark:text-amber-200/75",
  },
  {
    name: "Followers",
    value: 44.8,
    count: "156.8K",
    Icon: FaUserFriends,
    color: "#796BA5",
    background: "bg-violet-50/80 dark:bg-violet-400/[0.055]",
    border: "border-violet-200/80 dark:border-violet-300/[0.09]",
    text: "text-violet-700 dark:text-violet-200/75",
  },
];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.18;

  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));

  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text x={x} y={y} fill="#8A93A0" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11} fontWeight={600}>
      {(percent * 100).toFixed(1)}%
    </text>
  );
};

const AudienceTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  if (!item) {
    return null;
  }

  return (
    <div className="min-w-[190px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/[0.075] dark:bg-[#11151d]/95 dark:shadow-[0_22px_55px_rgba(0,0,0,0.45)]">
      <div
        className="h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
        }}
      />

      <div className="p-3">
        <div className="flex items-center gap-2.5">
          <span
            className="size-2.5 rounded-full"
            style={{
              backgroundColor: item.color,
              boxShadow: `0 0 8px ${item.color}55`,
            }}
          />

          <p className="text-[12px] font-semibold text-gray-900 dark:text-white/90">{item.name}</p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-gray-200/70 bg-gray-50/75 p-2.5 dark:border-white/[0.045] dark:bg-white/[0.025]">
            <p className="text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:text-white/25">Audience</p>

            <p className="mt-1 text-[12px] font-bold text-gray-900 dark:text-white/75">{item.value}%</p>
          </div>

          <div className="rounded-xl border border-gray-200/70 bg-gray-50/75 p-2.5 dark:border-white/[0.045] dark:bg-white/[0.025]">
            <p className="text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:text-white/25">Views</p>

            <p className="mt-1 text-[12px] font-bold text-gray-900 dark:text-white/75">{item.count}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserTypeViews = () => {
  return (
    <Wrapper className="group relative overflow-hidden p-6">
      {/* Existing coloured glow backgrounds retained */}
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[#09637E]/10 blur-3xl opacity-70 transition-all duration-700 group-hover:scale-125 group-hover:opacity-90 dark:bg-cyan-500/[0.04]" />

      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#F075AE]/10 blur-3xl opacity-70 transition-all duration-700 group-hover:scale-125 group-hover:opacity-90 dark:bg-violet-500/[0.035]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.015),transparent_34%,transparent_75%,rgba(255,255,255,0.003))]" />

      {/* Header */}
      <div className="relative z-10 mb-5 flex items-center gap-3">
        <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-300/[0.12] bg-gradient-to-br from-[#67538F] to-[#8E567A] text-white shadow-[0_8px_22px_rgba(83,61,118,0.24)]">
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-black/[0.08]" />

          <FaUsers className="relative z-10" size={17} />
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Audience Distribution</h4>

          <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/30">Viewer segmentation by type</p>
        </div>
      </div>

      {/* Pie Chart and legend */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Chart background retained and enhanced */}
        <div className="relative h-72 w-full max-w-[390px] overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-50/55 dark:border-white/[0.05] dark:bg-white/[0.018]">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/25 to-pink-300/20" />

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={audienceData}
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={108}
                paddingAngle={3}
                cornerRadius={6}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
                animationDuration={750}
              >
                {audienceData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    style={{
                      filter: `drop-shadow(0 6px 8px ${entry.color}28)`,
                    }}
                  />
                ))}
              </Pie>

              <Tooltip
                content={<AudienceTooltip />}
                wrapperStyle={{
                  outline: "none",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend cards */}
        <div className="mt-3 w-full space-y-2">
          {audienceData.map((item) => {
            const Icon = item.Icon;

            return (
              <div
                key={item.name}
                className={`group/item flex items-center gap-3 rounded-xl border p-2.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:hover:bg-white/[0.075] ${item.background} ${item.border}`}
              >
                {/* Existing coloured icon background retained */}
                <div
                  className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-white shadow-[0_7px_18px_rgba(0,0,0,0.16)]"
                  style={{
                    backgroundColor: item.color,
                  }}
                >
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.16] via-transparent to-black/[0.10]" />

                  <Icon className="relative z-10" size={12} />
                </div>

                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-gray-900 dark:text-white/90">{item.name}</p>

                    <p className="mt-1 text-[9px] text-gray-500 dark:text-white/30">{item.count} views</p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className={`text-[13px] font-bold tabular-nums ${item.text}`}>{item.value}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t border-gray-200/70 pt-3 text-[10px] text-gray-500 dark:border-white/[0.05] dark:text-white/30">
        <span>Total audience</span>

        <span className="font-semibold text-gray-900 dark:text-white/90">639.5K views</span>
      </div>
    </Wrapper>
  );
};
