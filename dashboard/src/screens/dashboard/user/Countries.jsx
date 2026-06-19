import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { HeadingTwo, Wrapper } from "@/utils/Router";
import { FaGlobe } from "react-icons/fa";

// Sample data for top 5 countries
const countriesData = [
  { name: "USA", users: 4200, flag: "🇺🇸" },
  { name: "India", users: 3800, flag: "🇮🇳" },
  { name: "Germany", users: 5200, flag: "🇩🇪" },
  { name: "Japan", users: 6800, flag: "🇯🇵" },
  { name: "Brazil", users: 3400, flag: "🇧🇷" },
];

// Define colors for bars
const colors = ["#8b5cf6", "#22d3ee", "#fbbf24", "#f87171", "#4ade80"];

// Custom tooltip component with bar background color
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const country = countriesData.find((c) => c.name === label);
    const index = countriesData.findIndex((c) => c.name === label);
    const barColor = colors[index];

    return (
      <div
        className="p-3 rounded-lg shadow-lg backdrop-blur-md"
        style={{
          backgroundColor: barColor, // Same as bar color
          color: "white", // White text for contrast
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{country?.flag}</span>
          <p className="text-xs font-medium">{label}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs opacity-90">Users:</span>
          <span className="text-xs font-semibold">{payload[0].value.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const Countries = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseOver = (data, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Calculate summary stats
  const totalUsers = countriesData.reduce((sum, country) => sum + country.users, 0);
  const topCountry = [...countriesData].sort((a, b) => b.users - a.users)[0];

  return (
    <Wrapper className="p-6 relative overflow-hidden group my-3">
      {/* Floating glows – indigo and purple */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="size-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <FaGlobe size={18} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Top Countries</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">User distribution by country</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[275px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={countriesData} barSize={40} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <XAxis hide={true} />
            <YAxis hide={true} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="users" radius={[8, 8, 8, 8]} onMouseOver={(data, index) => handleMouseOver(data, index)} onMouseLeave={handleMouseLeave} isAnimationActive={true}>
              {countriesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} opacity={activeIndex === index ? 1 : 0.8} className="transition-opacity duration-200 hover:opacity-100" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Footer */}
      <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700/50">
        <div className="flex justify-center flex-wrap gap-3 text-[10px] text-gray-500 dark:text-gray-400">
          {countriesData.map((country, index) => (
            <div key={country.name} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[index] }} />
              <span>{country.name}</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{((country.users / totalUsers) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-[10px] text-gray-500 dark:text-gray-400">
          <span>Total users: {totalUsers.toLocaleString()}</span>
          <span>
            Top: {topCountry.name} ({((topCountry.users / totalUsers) * 100).toFixed(0)}%)
          </span>
        </div>
      </div>
    </Wrapper>
  );
};
