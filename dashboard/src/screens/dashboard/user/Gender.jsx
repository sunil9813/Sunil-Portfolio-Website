import { useMemo } from "react";
import { Users } from "lucide-react";
import { Wrapper } from "@/utils/Router";

// Gender data
const genderData = [
  { month: "Jan", male: 62000, female: 48000, other: 8000 },
  { month: "Feb", male: 63500, female: 49500, other: 8200 },
  { month: "Mar", male: 65000, female: 51000, other: 8500 },
  { month: "Apr", male: 66800, female: 52500, other: 8700 },
  { month: "May", male: 68500, female: 54000, other: 9000 },
  { month: "Jun", male: 70200, female: 55500, other: 9300 },
];

// Fresh color palette: amber, teal, violet
const genderConfig = {
  male: {
    primary: "#F59E0B",
    gradient: "from-amber-500 to-orange-500",
    glow: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    lightBg: "bg-amber-50 dark:bg-amber-950/30",
  },
  female: {
    primary: "#14B8A6",
    gradient: "from-teal-500 to-cyan-500",
    glow: "bg-teal-500/10",
    text: "text-teal-600 dark:text-teal-400",
    lightBg: "bg-teal-50 dark:bg-teal-950/30",
  },
  other: {
    primary: "#8B5CF6",
    gradient: "from-violet-500 to-purple-500",
    glow: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    lightBg: "bg-violet-50 dark:bg-violet-950/30",
  },
};

const GenderCard = ({ gender, value, percentage, change, icon: Icon, color }) => {
  const config = genderConfig[color];
  const isPositive = parseFloat(change) >= 0;

  return (
    <Wrapper className="p-6 relative overflow-hidden group">
      {/* Floating glows */}
      <div className={`absolute -bottom-20 -right-20 w-56 h-56 ${config.glow} rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700`} />
      <div className={`absolute -top-20 -left-20 w-56 h-56 ${config.glow} rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700`} />

      {/* Subtle background pattern (optional) */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`grid-${color}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" className="text-gray-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${color})`} />
        </svg>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`size-10 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
            <Icon size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{gender}</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Users</p>
          </div>
        </div>
        <div className={`text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"} bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full`}>
          {isPositive ? "↑" : "↓"} {change}
        </div>
      </div>

      {/* Value */}
      <div className="mb-4 relative z-10">
        <span className={`text-4xl font-bold ${config.text}`}>{value}</span>
      </div>

      {/* Progress bar with percentage label */}
      <div className="mb-3 relative z-10">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-gray-500 dark:text-gray-400">Market share</span>
          <span className={`text-xs font-semibold ${config.text}`}>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${config.primary}, ${config.primary}dd)`,
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 relative z-10">
        <span>Since Jan</span>
        <span className={isPositive ? "text-green-500" : "text-red-500"}>
          {isPositive ? "+" : ""}
          {change}
        </span>
      </div>
    </Wrapper>
  );
};

export const GenderAnalytics = () => {
  // Calculate metrics
  const metrics = useMemo(() => {
    const latestMonth = genderData[genderData.length - 1];
    const firstMonth = genderData[0];

    const total = latestMonth.male + latestMonth.female + latestMonth.other;
    const malePercentage = ((latestMonth.male / total) * 100).toFixed(1);
    const femalePercentage = ((latestMonth.female / total) * 100).toFixed(1);
    const otherPercentage = ((latestMonth.other / total) * 100).toFixed(1);

    const maleGrowth = (((latestMonth.male - firstMonth.male) / firstMonth.male) * 100).toFixed(1);
    const femaleGrowth = (((latestMonth.female - firstMonth.female) / firstMonth.female) * 100).toFixed(1);
    const otherGrowth = (((latestMonth.other - firstMonth.other) / firstMonth.other) * 100).toFixed(1);

    return {
      male: latestMonth.male,
      female: latestMonth.female,
      other: latestMonth.other,
      malePercentage,
      femalePercentage,
      otherPercentage,
      maleGrowth,
      femaleGrowth,
      otherGrowth,
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
      <GenderCard gender="Male" value={`${(metrics.male / 1000).toFixed(1)}K`} percentage={metrics.malePercentage} change={`${metrics.maleGrowth}%`} icon={Users} color="male" />
      <GenderCard gender="Female" value={`${(metrics.female / 1000).toFixed(1)}K`} percentage={metrics.femalePercentage} change={`${metrics.femaleGrowth}%`} icon={Users} color="female" />
      <GenderCard gender="Other" value={`${(metrics.other / 1000).toFixed(1)}K`} percentage={metrics.otherPercentage} change={`${metrics.otherGrowth}%`} icon={Users} color="other" />
    </div>
  );
};
