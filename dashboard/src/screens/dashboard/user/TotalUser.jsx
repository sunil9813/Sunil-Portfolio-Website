import { FilterDropdownbyDays } from "@/components/common/dropdown/CustomeDropDown";
import { DecreaseWrapper, HeadingOne, HeadingTwo, IconCircle, IncreaseWrapper, InputLabel, Wrapper } from "@/utils/Router";
import { FaChartLine, FaUsers } from "react-icons/fa";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

// Static increasing data for Total Customers - Always shows upward trend
const increasingData = [
  { value: 2500 },
  { value: 3600 },
  { value: 2550 },
  { value: 5700 },
  { value: 2650 },
  { value: 800 },
  { value: 2750 },
  { value: 2900 },
  { value: 4850 },
  { value: 3000 },
  { value: 2950 },
  { value: 7200 },
];

// Static decreasing data for New Customers - Always shows downward trend
const decreasingData = [
  { value: 220 },
  { value: 210 },
  { value: 315 },
  { value: 200 },
  { value: 205 },
  { value: 90 },
  { value: 195 },
  { value: 80 },
  { value: 5 },
  { value: 170 },
  { value: 75 },
  { value: 60 },
];

const yearlyData = [
  { month: "Jan", total: 400, new: 400 },
  { month: "Feb", total: 600, new: 480 },
  { month: "Mar", total: 100, new: 520 },
  { month: "Apr", total: 200, new: 490 },
  { month: "May", total: 450, new: 210 },
  { month: "Jun", total: 200, new: 495 },
  { month: "Jul", total: 100, new: 185 },
  { month: "Aug", total: 350, new: 170 },
  { month: "Sep", total: 300, new: 360 },
  { month: "Oct", total: 100, new: 455 },
  { month: "Nov", total: 300, new: 450 },
  { month: "Dec", total: 500, new: 440 },
];

export const OverviewUser = () => {
  return (
    <>
      <Wrapper className="p-6">
        <div className="flex justify-between items-center">
          <HeadingTwo>Overview</HeadingTwo>
          <FilterDropdownbyDays name="visibility" />
        </div>

        <div className="content mt-5">
          <div className="grid grid-cols-2 gap-5">
            {/* Total Customers - Always Increasing */}
            <div className="box flex justify-between items-center gap-2">
              <div className="">
                <IconCircle>
                  <FaUsers size={20} />
                </IconCircle>
                <InputLabel className="mt-3">Total customers</InputLabel>
                <HeadingOne>320k</HeadingOne>
                <div className="flex items-center gap-1 text-xs">
                  <IncreaseWrapper value="36.8%" />
                  <span>vs last year</span>
                </div>
              </div>
              {/* Always shows increasing trend */}
              <LineChart width={300} height={200} data={increasingData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} activeDot={false} dot={false} isAnimationActive={true} />
              </LineChart>
            </div>

            {/* New Customers - Always Decreasing */}
            <div className="box flex justify-between items-center gap-2">
              <div className="">
                <IconCircle>
                  <FaUsers size={20} />
                </IconCircle>
                <InputLabel className="mt-3">New customers</InputLabel>
                <HeadingOne>45k </HeadingOne>
                <div className="flex items-center gap-1 text-xs w-40">
                  <DecreaseWrapper value="12.5%" />
                  <p>vs last year</p>
                </div>
              </div>
              {/* Always shows decreasing trend */}
              <LineChart width={300} height={200} data={decreasingData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} activeDot={false} dot={false} isAnimationActive={true} />
              </LineChart>
            </div>
          </div>
        </div>
      </Wrapper>

      <YearlyUserTrends />
    </>
  );
};

export const YearlyUserTrends = () => {
  return (
    <Wrapper className="p-6 relative overflow-hidden group mt-3">
      {/* Floating glow backgrounds – purple and cyan */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="size-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
          <FaChartLine size={18} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Yearly User Trends</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Monthly performance with projections</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={yearlyData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6} />
                <stop offset="70%" stopColor="#8B5CF6" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.6} />
                <stop offset="70%" stopColor="#06B6D4" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 10 }} className="dark:text-gray-400" dy={5} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 9 }}
              className="dark:text-gray-400"
              tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
              width={30}
              dx={-3}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                fontSize: "0.75rem",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
                padding: "0.75rem",
              }}
              labelStyle={{ fontSize: "0.75rem", fontWeight: "600", color: "#111827", marginBottom: "0.25rem" }}
              itemStyle={{ fontSize: "0.75rem", padding: "0.125rem 0" }}
              formatter={(value, name) => [value.toLocaleString(), name === "total" ? "Total Users" : "New Users"]}
              labelFormatter={(label) => `📊 ${label}`}
              cursor={false}
            />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              fill="url(#totalGradient)"
              activeDot={{ r: 5, fill: "#8B5CF6", stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={true}
            />
            <Area
              type="monotone"
              dataKey="new"
              stroke="#06B6D4"
              strokeWidth={2.5}
              fill="url(#newGradient)"
              activeDot={{ r: 5, fill: "#06B6D4", stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer with stats */}
      <div className="mt-4 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
          <span>Total: 3.8M</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-500" />
          <span>New: 4.2K avg/month</span>
        </div>
      </div>
    </Wrapper>
  );
};
