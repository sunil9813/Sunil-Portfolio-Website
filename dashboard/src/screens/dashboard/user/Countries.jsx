import { useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Wrapper } from "@/routes";
import { FaGlobe } from "react-icons/fa";

/*
 * Original country data.
 */
const countriesData = [
  {
    name: "USA",
    users: 4200,
    flag: "🇺🇸",
  },
  {
    name: "India",
    users: 3800,
    flag: "🇮🇳",
  },
  {
    name: "Germany",
    users: 5200,
    flag: "🇩🇪",
  },
  {
    name: "Japan",
    users: 6800,
    flag: "🇯🇵",
  },
  {
    name: "Brazil",
    users: 3400,
    flag: "🇧🇷",
  },
];

/*
 * Muted colours that work better on a dark dashboard.
 */
const colors = ["#7569A7", "#3F7F8B", "#967246", "#925968", "#43806B"];

/*
 * Subtle dark tooltip.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const country = countriesData.find((item) => item.name === label);

  const index = countriesData.findIndex((item) => item.name === label);

  const barColor = colors[index] || colors[0];

  return (
    <div className="min-w-[160px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#12161d]/95 shadow-[0_18px_45px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${barColor},
            transparent
          )`,
        }}
      />

      <div className="p-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">{country?.flag}</span>

          <p className="text-xs font-semibold text-white/85">{label}</p>
        </div>

        <div className="flex items-center justify-between gap-5 border-t border-white/[0.06] pt-2">
          <span className="text-[10px] text-white/35">Users</span>

          <span className="text-xs font-semibold tabular-nums text-white/80">{payload[0].value.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export const Countries = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseOver = (_data, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  /*
   * Original summary calculations.
   */
  const totalUsers = countriesData.reduce((sum, country) => sum + country.users, 0);

  const topCountry = [...countriesData].sort((first, second) => second.users - first.users)[0];

  return (
    <Wrapper className="group relative my-3 overflow-hidden p-6">
      {/* Wrapper background remains unchanged */}

      {/* Subtle dark-theme glows */}
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-indigo-500/[0.025] opacity-60 blur-[80px] transition-all duration-700 group-hover:scale-110 group-hover:opacity-80" />

      <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-violet-500/[0.02] opacity-50 blur-[80px] transition-all duration-700 group-hover:scale-110 group-hover:opacity-70" />

      {/* Header */}
      <div className="relative z-10 mb-4 flex items-center gap-3">
        <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-indigo-300/[0.10] bg-gradient-to-br from-[#494271] to-[#29273f] text-indigo-100/80 shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] to-transparent" />

          <FaGlobe className="relative z-10" size={17} />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white/90">Top Countries</h4>

          <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/30">User distribution by country</p>
        </div>
      </div>

      {/* Original chart structure */}
      <div className="relative z-10 h-[275px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={countriesData}
            barSize={40}
            margin={{
              top: 12,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <XAxis hide />
            <YAxis hide />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "rgba(255,255,255,0.018)",
                radius: 8,
              }}
              wrapperStyle={{
                outline: "none",
              }}
            />

            <Bar dataKey="users" radius={[8, 8, 8, 8]} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} isAnimationActive animationDuration={700} animationEasing="ease-out">
              {countriesData.map((entry, index) => {
                const isActive = activeIndex === index;

                const isDimmed = activeIndex !== null && !isActive;

                return (
                  <Cell
                    key={entry.name}
                    fill={colors[index]}
                    opacity={isDimmed ? 0.4 : isActive ? 1 : 0.78}
                    style={{
                      filter: isActive ? `drop-shadow(0 8px 12px ${colors[index]}35)` : "none",

                      transition: "opacity 200ms ease, filter 200ms ease",
                    }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Original legend and footer */}
      <div className="relative z-10 mt-4 border-t border-gray-200 pt-3 dark:border-white/[0.06]">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] text-gray-500 dark:text-white/32">
          {countriesData.map((country, index) => {
            const percentage = totalUsers > 0 ? (country.users / totalUsers) * 100 : 0;

            return (
              <div key={country.name} className="flex items-center gap-1.5 whitespace-nowrap">
                <span
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor: colors[index],

                    boxShadow: `0 0 6px ${colors[index]}35`,
                  }}
                />

                <span>{country.name}</span>

                <span className="font-semibold tabular-nums text-gray-700 dark:text-white/55">{percentage.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-col gap-2 text-[10px] text-gray-500 dark:text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Total users: <strong className="font-semibold tabular-nums text-gray-700 dark:text-white/50">{totalUsers.toLocaleString()}</strong>
          </span>

          <span>
            Top:
            <strong className="font-semibold text-rose-700 dark:text-rose-200/65">
              {topCountry.name} ({((topCountry.users / totalUsers) * 100).toFixed(0)}
              %)
            </strong>
          </span>
        </div>
      </div>
    </Wrapper>
  );
};
