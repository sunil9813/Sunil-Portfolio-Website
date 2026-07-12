import { Wrapper } from "@/routes";
import { FaClock } from "react-icons/fa";

// Sample activity data (0-100 scale)
const generateActivityData = () => {
  const times = ["12am", "4am", "8am", "12pm", "4pm", "8pm"];
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const data = [];
  for (let t = 0; t < times.length; t++) {
    for (let d = 0; d < days.length; d++) {
      let base = 30;
      if (times[t].includes("pm") && !times[t].includes("12pm")) base = 60;
      if (days[d] === "Sa" || days[d] === "Su") base += 20;
      const random = Math.floor(Math.random() * 40) - 10;
      const value = Math.min(100, Math.max(0, base + random));
      data.push({
        time: times[t],
        day: days[d],
        value,
      });
    }
  }
  return { times, days, data };
};

export const ActiveReadingTimes = () => {
  const { times, days, data } = generateActivityData();

  // Muted emerald shades designed for a dark dashboard
  const getCellColor = (value) => {
    if (value < 20) {
      return "border-emerald-300/[0.035] bg-emerald-400/[0.035] hover:bg-emerald-400/[0.07]";
    }

    if (value < 40) {
      return "border-emerald-300/[0.055] bg-emerald-400/[0.075] hover:bg-emerald-400/[0.11]";
    }

    if (value < 60) {
      return "border-emerald-300/[0.08] bg-emerald-400/[0.13] hover:bg-emerald-400/[0.17]";
    }

    if (value < 80) {
      return "border-emerald-300/[0.11] bg-emerald-400/[0.20] hover:bg-emerald-400/[0.25]";
    }

    return "border-emerald-300/[0.15] bg-emerald-400/[0.30] shadow-[0_0_14px_rgba(52,211,153,0.07)] hover:bg-emerald-400/[0.36]";
  };
  return (
    <Wrapper className="p-6 relative overflow-hidden group">
      {/* Floating Glow Backgrounds - subtle green tones */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-green-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="size-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30">
          <FaClock size={18} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Active Reading Times</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">When users engage most</p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="mb-4">
        <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-1">
          {/* Empty top-left cell */}
          <div className="text-[9px] text-gray-500 dark:text-gray-400 font-medium h-6 flex items-end justify-center"></div>

          {/* Day labels */}
          {days.map((day) => (
            <div key={day} className="text-[9px] text-gray-500 dark:text-gray-400 font-medium h-6 flex items-end justify-center">
              {day}
            </div>
          ))}

          {/* Time rows with cells */}
          {times.map((time) => (
            <>
              <div key={time} className="text-[9px] text-gray-500 dark:text-gray-400 font-medium flex items-center justify-end pr-1 h-8">
                {time}
              </div>
              {days.map((day) => {
                const cell = data.find((d) => d.time === time && d.day === day);
                const value = cell ? cell.value : 0;
                return (
                  <div
                    key={`${time}-${day}`}
                    className={`h-8 rounded-md ${getCellColor(value)} transition-colors hover:ring-1 hover:ring-green-400 cursor-default`}
                    title={`${day} ${time}: ${value}% activity`}
                  />
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Engagement Legend */}
      <div className="flex items-center justify-between text-[9px] text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span>Least engaged</span>
          <div className="w-6 h-3 rounded-sm bg-green-50 dark:bg-green-950/30" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-3 rounded-sm bg-green-400 dark:bg-green-600/80" />
          <span>Most engaged</span>
        </div>
      </div>

      {/* Footer with summary */}
      <div className="mt-4 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
        <span>Peak time: 8pm (Fri, Sat)</span>
        <span>Lowest: 4am (Mon)</span>
      </div>
    </Wrapper>
  );
};
