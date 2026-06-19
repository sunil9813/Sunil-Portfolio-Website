import { HeadingThree, Wrapper } from "@/utils/Router";
import { FaChartLine, FaHourglassHalf } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";

// Gradient map for icon backgrounds
const gradientMap = {
  progress: "from-blue-500 to-purple-600",
  published: "from-emerald-500 to-green-600",
  draft: "from-purple-500 to-violet-600",
};

export const CategoryMonitor = () => {
  return (
    <div className="my-3 space-y-3">
      {/* Monthly Progress Card */}
      <Wrapper className="p-6 relative overflow-hidden group">
        {/* Floating glows – blue/purple */}
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`size-10 bg-gradient-to-br ${gradientMap.progress} rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30`}>
            <FaChartLine size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Monthly Progress</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Category goals</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          {/* Target progress */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">Target</span>
              <span className="font-medium text-purple-600 dark:text-purple-400">75%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: "75%" }} />
            </div>
          </div>

          {/* Published this month */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">Published this month</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">12</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" style={{ width: "60%" }} />
            </div>
          </div>
        </div>

        {/* Footer summary */}
        <div className="mt-4 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
          <span>Monthly goal: 20 categories</span>
          <span>+12% vs last month</span>
        </div>
      </Wrapper>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Published Card */}
        <Wrapper className="p-6 relative overflow-hidden group">
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-green-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

          <div className="flex items-center gap-2 mb-3">
            <div className={`size-10 bg-gradient-to-br ${gradientMap.published} rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30`}>
              <GiCheckMark size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Published</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Categories</p>
            </div>
          </div>

          <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">42</p>

          <div className="mt-4 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
            <span>+8% this week</span>
            <span>Active</span>
          </div>
        </Wrapper>

        {/* In Draft Card */}
        <Wrapper className="p-6 relative overflow-hidden group">
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-violet-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

          <div className="flex items-center gap-2 mb-3">
            <div className={`size-10 bg-gradient-to-br ${gradientMap.draft} rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30`}>
              <FaHourglassHalf size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">In Draft</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Categories</p>
            </div>
          </div>

          <p className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">15</p>

          <div className="mt-4 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
            <span>Needs review</span>
            <span>3 pending</span>
          </div>
        </Wrapper>
      </div>
    </div>
  );
};
