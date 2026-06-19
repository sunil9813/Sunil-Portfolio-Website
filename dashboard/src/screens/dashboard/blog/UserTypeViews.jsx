import { Wrapper } from "@/utils/Router";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FaUsers, FaUser, FaUserSecret, FaUserFriends, FaEye } from "react-icons/fa";

export const UserTypeViews = () => {
  const data = [
    { name: "Logged-in Users", value: 33.1, count: "284.5K", icon: <FaUser size={12} />, color: "#3B82F6" },
    { name: "Guest Users", value: 22.1, count: "198.2K", icon: <FaUserSecret size={12} />, color: "#F97316" },
    { name: "Followers", value: 44.8, count: "156.8K", icon: <FaUserFriends size={12} />, color: "#8B5CF6" },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    return (
      <text x={x} y={y} fill="#6B7280" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={14}>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <Wrapper className="p-6 relative overflow-hidden group">
      {/* Floating Glow Backgrounds */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-[#09637E]/20 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-[#F075AE]/20 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="size-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
          <FaUsers size={18} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Audience Distribution</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Viewer segmentation by type</p>
        </div>
      </div>

      {/* Pie Chart + Legend */}
      <div className="flexC flex-col">
        {/* Chart container */}
        <div className="w-96 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={120} fill="#8884d8" paddingAngle={2} dataKey="value" labelLine={false} label={renderCustomizedLabel}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{payload[0].name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{payload[0].value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Stats list (like top posts list) */}
        <div className="flex-1 space-y-2 w-full">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-xl transition-all duration-300 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-white/10"
            >
              {/* Colored dot with icon inside */}
              <div className="size-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
                {item.icon}
              </div>

              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">{item.count} views</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{item.value}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer with total */}
      <div className="mt-4 pt-2 text-sm flex justify-between">
        <span>Total audience</span>
        <span className="font-medium text-gray-900 dark:text-white">639.5K views</span>
      </div>
    </Wrapper>
  );
};
