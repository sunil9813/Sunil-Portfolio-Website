import { FaExclamationTriangle } from "react-icons/fa";
import { CategoryActivityFeed } from "./CategoryActivityFeed";
import { CategoryMonitor } from "./CategoryMonitor";
import { CategoryStatsCards } from "./CategoryStatsCards";
import { CategoryTrendsChart } from "./CategoryTrendsChart";
import { PopularCategories } from "./PopularCategories";
import { Wrapper } from "@/utils/Router";
import { CategoryInsightsPanel } from "./CategoryInsightsPanel";

export const CategoryOverview = () => {
  // Sample data for demonstration
  const totalCategories = 300;
  const publishedCategories = 60;
  const draftCategories = 135;
  const archivedCategories = 20;
  const publishedGrowth = 8.2;

  return (
    <>
      <CategoryStatsCards
        totalCategories={totalCategories}
        draftCategories={draftCategories}
        archivedCategories={archivedCategories}
        publishedCategories={publishedCategories}
        publishedGrowth={publishedGrowth}
      />

      <section className="flex justify-between gap-3">
        <div className="w-[70%]">
          <CategoryTrendsChart />
          <PopularCategories />
        </div>
        <div className="w-[30%]">
          {/* <Compoenets goes here /> */}

          <Wrapper className="p-6 relative overflow-hidden group !bg-transparent border border-yellow-500/20">
            {/* Floating glow backgrounds – yellow/orange tones */}
            <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-yellow-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
            <div className="absolute -top-20 -left-20 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

            {/* Header with icon */}
            <div className="flex items-center gap-2 mb-3">
              <div className="size-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-500/30">
                <FaExclamationTriangle size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-yellow-500 dark:text-yellow-300">Needs Attention</h4>
              </div>
            </div>

            {/* Message */}
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">3 draft categories pending review</p>

            {/* Action button – pill style with gradient hover */}
            <button className="w-full px-4 py-2.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg">
              Review Now
            </button>
          </Wrapper>

          <CategoryActivityFeed />
          <CategoryMonitor />
        </div>
      </section>
      <CategoryInsightsPanel />
    </>
  );
};
