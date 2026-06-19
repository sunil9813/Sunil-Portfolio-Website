import {
  AchievementBadges,
  AdvancedAnalyticsEngine,
  AdvancedFiltering,
  AdvancedKPIMetrics,
  AIInsights,
  DataIntegrationHub,
  GeographicDistribution,
  GoalsProgress,
  PlatformInsights,
  PredictiveAnalytics,
  QuickStats,
  RealTimeActivity,
  RecentActivity,
  SecurityComplianceCenter,
  TopContent,
} from "@/screens/dashboard/home/Dash";
import { Overview } from "@/screens/dashboard/home/Overview";
import { AdvancedTrafficChannelAnalysis } from "@/screens/dashboard/user/TrafficChannel";
import { WelcomeUser } from "@/utils/Router";

export const Home = () => {
  return (
    <>
      <Overview />
    </>
  );
};
