import { useState } from "react";
import { Pie, PieChart, Sector, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { HeadingTwo, Wrapper } from "@/utils/Router";
import { FaChartPie } from "react-icons/fa";

// Sample data for device usage – using a fresh color palette
const deviceData = [
  { name: "Mobile", value: 400, color: "#8B5CF6" }, // violet
  { name: "Tablet", value: 300, color: "#10B981" }, // emerald
  { name: "Desktop", value: 300, color: "#F59E0B" }, // amber
];

// Calculate total for percentage calculations
const totalUsers = deviceData.reduce((sum, item) => sum + item.value, 0);

// Active shape renderer – modernised
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="none"
        style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
      />
      <text x={cx} y={cy} dy={-5} textAnchor="middle" fill="#374151" className="dark:fill-white text-2xl font-bold">
        {value}
      </text>
      <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#6B7280" className="dark:fill-gray-400 text-xs">
        users
      </text>
    </g>
  );
};

// Custom tooltip – glassmorphism style
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const percentage = ((payload[0].value / totalUsers) * 100).toFixed(1);
    return (
      <div className="p-3 rounded-lg shadow-lg backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">{payload[0].name}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-gray-600 dark:text-gray-400">Users:</span>
          <span className="text-xs font-semibold text-gray-900 dark:text-white">{payload[0].value.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-gray-600 dark:text-gray-400">Share:</span>
          <span className="text-xs font-semibold text-gray-900 dark:text-white">{percentage}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export const Device = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <Wrapper className="p-6 relative overflow-hidden group">
      {/* Floating glows – violet and emerald */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-violet-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="size-10 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
          <FaChartPie size={18} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Device Breakdown</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">User distribution by device</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={deviceData}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="70%"
              dataKey="value"
              onMouseEnter={onPieEnter}
              stroke="none"
            >
              {deviceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend and footer combined */}
      <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700/50">
        <div className="flex justify-center flex-wrap gap-4 text-[10px] text-gray-500 dark:text-gray-400">
          {deviceData.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{((item.value / totalUsers) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-[10px] text-gray-500 dark:text-gray-400">
          <span>Total users: {totalUsers.toLocaleString()}</span>
          <span>Most used: Mobile (40%)</span>
        </div>
      </div>
    </Wrapper>
  );
};
