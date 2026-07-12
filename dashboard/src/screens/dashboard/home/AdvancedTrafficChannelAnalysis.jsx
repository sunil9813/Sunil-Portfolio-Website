import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import { Activity, BarChart3, Check, DollarSign, Layers, LineChart as LineChartIcon, Maximize2, Minimize2, PieChartIcon, RefreshCw, Target, TrendingDown, TrendingUp, Users, X } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart as RePieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { Wrapper } from "@/routes";

const monthlyTrafficData = [
  {
    month: "Jan",
    channels: {
      "Organic Search": {
        visits: 4200,
        conversion: 4.1,
        revenue: 12500,
        bounceRate: 35.2,
        avgDuration: 3.4,
        engagement: 4.2,
        returning: 32,
        goalCompletions: 156,
        cpc: 0.42,
      },
      Direct: {
        visits: 3120,
        conversion: 5.7,
        revenue: 9200,
        bounceRate: 42.5,
        avgDuration: 2.7,
        engagement: 3.8,
        returning: 45,
        goalCompletions: 178,
        cpc: 0,
      },
      "Social Media": {
        visits: 2850,
        conversion: 2.9,
        revenue: 6500,
        bounceRate: 28.8,
        avgDuration: 4.1,
        engagement: 4.8,
        returning: 28,
        goalCompletions: 83,
        cpc: 0.85,
      },
      Email: {
        visits: 1980,
        conversion: 7.2,
        revenue: 10500,
        bounceRate: 22.8,
        avgDuration: 5,
        engagement: 5.2,
        returning: 62,
        goalCompletions: 143,
        cpc: 0.12,
      },
      Referral: {
        visits: 1570,
        conversion: 4.6,
        revenue: 5800,
        bounceRate: 39.2,
        avgDuration: 3.1,
        engagement: 3.5,
        returning: 38,
        goalCompletions: 72,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 1230,
        conversion: 2.1,
        revenue: 3800,
        bounceRate: 52.1,
        avgDuration: 1.7,
        engagement: 2.3,
        returning: 12,
        goalCompletions: 26,
        cpc: 1.45,
      },
    },
  },
  {
    month: "Feb",
    channels: {
      "Organic Search": {
        visits: 4520,
        conversion: 4.3,
        revenue: 13500,
        bounceRate: 34.5,
        avgDuration: 3.5,
        engagement: 4.3,
        returning: 35,
        goalCompletions: 195,
        cpc: 0.41,
      },
      Direct: {
        visits: 3280,
        conversion: 5.9,
        revenue: 10200,
        bounceRate: 41.8,
        avgDuration: 2.8,
        engagement: 3.9,
        returning: 48,
        goalCompletions: 194,
        cpc: 0,
      },
      "Social Media": {
        visits: 3010,
        conversion: 3.1,
        revenue: 7200,
        bounceRate: 28.2,
        avgDuration: 4.2,
        engagement: 4.9,
        returning: 31,
        goalCompletions: 93,
        cpc: 0.82,
      },
      Email: {
        visits: 2100,
        conversion: 7.5,
        revenue: 11500,
        bounceRate: 22.1,
        avgDuration: 5.1,
        engagement: 5.3,
        returning: 65,
        goalCompletions: 158,
        cpc: 0.11,
      },
      Referral: {
        visits: 1680,
        conversion: 4.8,
        revenue: 6200,
        bounceRate: 38.5,
        avgDuration: 3.2,
        engagement: 3.6,
        returning: 41,
        goalCompletions: 81,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 1350,
        conversion: 2.3,
        revenue: 4200,
        bounceRate: 51.3,
        avgDuration: 1.8,
        engagement: 2.4,
        returning: 15,
        goalCompletions: 31,
        cpc: 1.42,
      },
    },
  },
  {
    month: "Mar",
    channels: {
      "Organic Search": {
        visits: 4800,
        conversion: 4.2,
        revenue: 14200,
        bounceRate: 34,
        avgDuration: 3.6,
        engagement: 4.4,
        returning: 38,
        goalCompletions: 202,
        cpc: 0.39,
      },
      Direct: {
        visits: 3400,
        conversion: 5.8,
        revenue: 10800,
        bounceRate: 41.2,
        avgDuration: 2.9,
        engagement: 4,
        returning: 52,
        goalCompletions: 197,
        cpc: 0,
      },
      "Social Media": {
        visits: 3200,
        conversion: 3.2,
        revenue: 7800,
        bounceRate: 27.5,
        avgDuration: 4.3,
        engagement: 5,
        returning: 35,
        goalCompletions: 102,
        cpc: 0.79,
      },
      Email: {
        visits: 2250,
        conversion: 7.6,
        revenue: 12500,
        bounceRate: 21.8,
        avgDuration: 5.2,
        engagement: 5.4,
        returning: 68,
        goalCompletions: 171,
        cpc: 0.1,
      },
      Referral: {
        visits: 1750,
        conversion: 4.9,
        revenue: 6500,
        bounceRate: 38,
        avgDuration: 3.3,
        engagement: 3.7,
        returning: 44,
        goalCompletions: 86,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 1450,
        conversion: 2.4,
        revenue: 4500,
        bounceRate: 50.5,
        avgDuration: 1.9,
        engagement: 2.5,
        returning: 18,
        goalCompletions: 35,
        cpc: 1.38,
      },
    },
  },
  {
    month: "Apr",
    channels: {
      "Organic Search": {
        visits: 5100,
        conversion: 4.4,
        revenue: 15200,
        bounceRate: 33.5,
        avgDuration: 3.7,
        engagement: 4.5,
        returning: 42,
        goalCompletions: 224,
        cpc: 0.37,
      },
      Direct: {
        visits: 3550,
        conversion: 6,
        revenue: 11500,
        bounceRate: 40.5,
        avgDuration: 3,
        engagement: 4.1,
        returning: 55,
        goalCompletions: 213,
        cpc: 0,
      },
      "Social Media": {
        visits: 3450,
        conversion: 3.3,
        revenue: 8500,
        bounceRate: 26.8,
        avgDuration: 4.4,
        engagement: 5.1,
        returning: 39,
        goalCompletions: 114,
        cpc: 0.75,
      },
      Email: {
        visits: 2400,
        conversion: 7.8,
        revenue: 13500,
        bounceRate: 21.2,
        avgDuration: 5.3,
        engagement: 5.5,
        returning: 72,
        goalCompletions: 187,
        cpc: 0.09,
      },
      Referral: {
        visits: 1850,
        conversion: 5,
        revenue: 6900,
        bounceRate: 37.5,
        avgDuration: 3.4,
        engagement: 3.8,
        returning: 47,
        goalCompletions: 93,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 1600,
        conversion: 2.5,
        revenue: 5000,
        bounceRate: 49.8,
        avgDuration: 2,
        engagement: 2.6,
        returning: 21,
        goalCompletions: 40,
        cpc: 1.35,
      },
    },
  },
  {
    month: "May",
    channels: {
      "Organic Search": {
        visits: 5350,
        conversion: 4.5,
        revenue: 16000,
        bounceRate: 33,
        avgDuration: 3.8,
        engagement: 4.6,
        returning: 45,
        goalCompletions: 241,
        cpc: 0.35,
      },
      Direct: {
        visits: 3720,
        conversion: 6.2,
        revenue: 12200,
        bounceRate: 39.8,
        avgDuration: 3.1,
        engagement: 4.2,
        returning: 58,
        goalCompletions: 231,
        cpc: 0,
      },
      "Social Media": {
        visits: 3650,
        conversion: 3.4,
        revenue: 9200,
        bounceRate: 26,
        avgDuration: 4.5,
        engagement: 5.2,
        returning: 42,
        goalCompletions: 124,
        cpc: 0.72,
      },
      Email: {
        visits: 2550,
        conversion: 8,
        revenue: 14500,
        bounceRate: 20.5,
        avgDuration: 5.4,
        engagement: 5.6,
        returning: 75,
        goalCompletions: 204,
        cpc: 0.08,
      },
      Referral: {
        visits: 1950,
        conversion: 5.2,
        revenue: 7300,
        bounceRate: 37,
        avgDuration: 3.5,
        engagement: 3.9,
        returning: 50,
        goalCompletions: 101,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 1750,
        conversion: 2.6,
        revenue: 5500,
        bounceRate: 49,
        avgDuration: 2.1,
        engagement: 2.7,
        returning: 24,
        goalCompletions: 46,
        cpc: 1.32,
      },
    },
  },
  {
    month: "Jun",
    channels: {
      "Organic Search": {
        visits: 5800,
        conversion: 4.8,
        revenue: 17200,
        bounceRate: 32.5,
        avgDuration: 3.9,
        engagement: 4.7,
        returning: 48,
        goalCompletions: 278,
        cpc: 0.33,
      },
      Direct: {
        visits: 3950,
        conversion: 6.5,
        revenue: 13200,
        bounceRate: 39.2,
        avgDuration: 3.2,
        engagement: 4.3,
        returning: 62,
        goalCompletions: 257,
        cpc: 0,
      },
      "Social Media": {
        visits: 3980,
        conversion: 3.7,
        revenue: 10500,
        bounceRate: 25.2,
        avgDuration: 4.6,
        engagement: 5.3,
        returning: 46,
        goalCompletions: 147,
        cpc: 0.68,
      },
      Email: {
        visits: 2720,
        conversion: 8.3,
        revenue: 15800,
        bounceRate: 19.8,
        avgDuration: 5.5,
        engagement: 5.7,
        returning: 79,
        goalCompletions: 226,
        cpc: 0.07,
      },
      Referral: {
        visits: 2120,
        conversion: 5.5,
        revenue: 8100,
        bounceRate: 36.2,
        avgDuration: 3.6,
        engagement: 4,
        returning: 54,
        goalCompletions: 117,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 1950,
        conversion: 2.9,
        revenue: 6200,
        bounceRate: 48.2,
        avgDuration: 2.2,
        engagement: 2.8,
        returning: 28,
        goalCompletions: 57,
        cpc: 1.28,
      },
    },
  },
  {
    month: "Jul",
    channels: {
      "Organic Search": {
        visits: 6100,
        conversion: 5,
        revenue: 18500,
        bounceRate: 31.8,
        avgDuration: 4,
        engagement: 4.9,
        returning: 52,
        goalCompletions: 295,
        cpc: 0.31,
      },
      Direct: {
        visits: 4180,
        conversion: 6.8,
        revenue: 14100,
        bounceRate: 38.5,
        avgDuration: 3.3,
        engagement: 4.5,
        returning: 66,
        goalCompletions: 272,
        cpc: 0,
      },
      "Social Media": {
        visits: 4250,
        conversion: 3.9,
        revenue: 11300,
        bounceRate: 24.5,
        avgDuration: 4.7,
        engagement: 5.5,
        returning: 51,
        goalCompletions: 162,
        cpc: 0.64,
      },
      Email: {
        visits: 2890,
        conversion: 8.6,
        revenue: 17100,
        bounceRate: 19.1,
        avgDuration: 5.6,
        engagement: 5.9,
        returning: 84,
        goalCompletions: 245,
        cpc: 0.06,
      },
      Referral: {
        visits: 2280,
        conversion: 5.8,
        revenue: 8800,
        bounceRate: 35.4,
        avgDuration: 3.7,
        engagement: 4.2,
        returning: 59,
        goalCompletions: 128,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 2150,
        conversion: 3.1,
        revenue: 6900,
        bounceRate: 47.5,
        avgDuration: 2.3,
        engagement: 2.9,
        returning: 32,
        goalCompletions: 65,
        cpc: 1.25,
      },
    },
  },
  {
    month: "Aug",
    channels: {
      "Organic Search": {
        visits: 6400,
        conversion: 5.2,
        revenue: 19800,
        bounceRate: 31,
        avgDuration: 4.1,
        engagement: 5,
        returning: 55,
        goalCompletions: 312,
        cpc: 0.29,
      },
      Direct: {
        visits: 4400,
        conversion: 7,
        revenue: 15100,
        bounceRate: 37.8,
        avgDuration: 3.4,
        engagement: 4.6,
        returning: 70,
        goalCompletions: 288,
        cpc: 0,
      },
      "Social Media": {
        visits: 4500,
        conversion: 4.1,
        revenue: 12200,
        bounceRate: 23.8,
        avgDuration: 4.8,
        engagement: 5.6,
        returning: 55,
        goalCompletions: 178,
        cpc: 0.6,
      },
      Email: {
        visits: 3050,
        conversion: 8.9,
        revenue: 18400,
        bounceRate: 18.5,
        avgDuration: 5.7,
        engagement: 6,
        returning: 88,
        goalCompletions: 263,
        cpc: 0.05,
      },
      Referral: {
        visits: 2420,
        conversion: 6,
        revenue: 9400,
        bounceRate: 34.5,
        avgDuration: 3.8,
        engagement: 4.3,
        returning: 63,
        goalCompletions: 139,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 2320,
        conversion: 3.3,
        revenue: 7600,
        bounceRate: 46.5,
        avgDuration: 2.4,
        engagement: 3,
        returning: 35,
        goalCompletions: 72,
        cpc: 1.22,
      },
    },
  },
  {
    month: "Sep",
    channels: {
      "Organic Search": {
        visits: 6700,
        conversion: 5.4,
        revenue: 21100,
        bounceRate: 30.2,
        avgDuration: 4.2,
        engagement: 5.1,
        returning: 58,
        goalCompletions: 330,
        cpc: 0.27,
      },
      Direct: {
        visits: 4620,
        conversion: 7.2,
        revenue: 16100,
        bounceRate: 37.1,
        avgDuration: 3.5,
        engagement: 4.7,
        returning: 74,
        goalCompletions: 304,
        cpc: 0,
      },
      "Social Media": {
        visits: 4750,
        conversion: 4.3,
        revenue: 13100,
        bounceRate: 23.1,
        avgDuration: 4.9,
        engagement: 5.7,
        returning: 59,
        goalCompletions: 195,
        cpc: 0.56,
      },
      Email: {
        visits: 3210,
        conversion: 9.2,
        revenue: 19700,
        bounceRate: 17.9,
        avgDuration: 5.8,
        engagement: 6.1,
        returning: 92,
        goalCompletions: 281,
        cpc: 0.04,
      },
      Referral: {
        visits: 2560,
        conversion: 6.2,
        revenue: 10000,
        bounceRate: 33.6,
        avgDuration: 3.9,
        engagement: 4.4,
        returning: 67,
        goalCompletions: 150,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 2490,
        conversion: 3.5,
        revenue: 8300,
        bounceRate: 45.5,
        avgDuration: 2.5,
        engagement: 3.1,
        returning: 38,
        goalCompletions: 79,
        cpc: 1.19,
      },
    },
  },
  {
    month: "Oct",
    channels: {
      "Organic Search": {
        visits: 7000,
        conversion: 5.6,
        revenue: 22400,
        bounceRate: 29.5,
        avgDuration: 4.3,
        engagement: 5.2,
        returning: 61,
        goalCompletions: 348,
        cpc: 0.25,
      },
      Direct: {
        visits: 4840,
        conversion: 7.4,
        revenue: 17100,
        bounceRate: 36.4,
        avgDuration: 3.6,
        engagement: 4.8,
        returning: 78,
        goalCompletions: 320,
        cpc: 0,
      },
      "Social Media": {
        visits: 5000,
        conversion: 4.5,
        revenue: 14000,
        bounceRate: 22.4,
        avgDuration: 5,
        engagement: 5.8,
        returning: 63,
        goalCompletions: 212,
        cpc: 0.52,
      },
      Email: {
        visits: 3370,
        conversion: 9.5,
        revenue: 21000,
        bounceRate: 17.3,
        avgDuration: 5.9,
        engagement: 6.2,
        returning: 96,
        goalCompletions: 299,
        cpc: 0.03,
      },
      Referral: {
        visits: 2700,
        conversion: 6.4,
        revenue: 10600,
        bounceRate: 32.7,
        avgDuration: 4,
        engagement: 4.5,
        returning: 71,
        goalCompletions: 161,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 2660,
        conversion: 3.7,
        revenue: 9000,
        bounceRate: 44.5,
        avgDuration: 2.6,
        engagement: 3.2,
        returning: 41,
        goalCompletions: 86,
        cpc: 1.16,
      },
    },
  },
  {
    month: "Nov",
    channels: {
      "Organic Search": {
        visits: 7300,
        conversion: 5.8,
        revenue: 23700,
        bounceRate: 28.8,
        avgDuration: 4.4,
        engagement: 5.3,
        returning: 64,
        goalCompletions: 366,
        cpc: 0.23,
      },
      Direct: {
        visits: 5060,
        conversion: 7.6,
        revenue: 18100,
        bounceRate: 35.7,
        avgDuration: 3.7,
        engagement: 4.9,
        returning: 82,
        goalCompletions: 336,
        cpc: 0,
      },
      "Social Media": {
        visits: 5250,
        conversion: 4.7,
        revenue: 14900,
        bounceRate: 21.7,
        avgDuration: 5.1,
        engagement: 5.9,
        returning: 67,
        goalCompletions: 229,
        cpc: 0.48,
      },
      Email: {
        visits: 3530,
        conversion: 9.8,
        revenue: 22300,
        bounceRate: 16.7,
        avgDuration: 6,
        engagement: 6.3,
        returning: 100,
        goalCompletions: 317,
        cpc: 0.02,
      },
      Referral: {
        visits: 2840,
        conversion: 6.6,
        revenue: 11200,
        bounceRate: 31.8,
        avgDuration: 4.1,
        engagement: 4.6,
        returning: 75,
        goalCompletions: 172,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 2830,
        conversion: 3.9,
        revenue: 9700,
        bounceRate: 43.5,
        avgDuration: 2.7,
        engagement: 3.3,
        returning: 44,
        goalCompletions: 93,
        cpc: 1.13,
      },
    },
  },
  {
    month: "Dec",
    channels: {
      "Organic Search": {
        visits: 7600,
        conversion: 6,
        revenue: 25000,
        bounceRate: 28,
        avgDuration: 4.5,
        engagement: 5.4,
        returning: 67,
        goalCompletions: 384,
        cpc: 0.21,
      },
      Direct: {
        visits: 5280,
        conversion: 7.8,
        revenue: 19100,
        bounceRate: 35,
        avgDuration: 3.8,
        engagement: 5,
        returning: 86,
        goalCompletions: 352,
        cpc: 0,
      },
      "Social Media": {
        visits: 5500,
        conversion: 4.9,
        revenue: 15800,
        bounceRate: 21,
        avgDuration: 5.2,
        engagement: 6,
        returning: 71,
        goalCompletions: 246,
        cpc: 0.44,
      },
      Email: {
        visits: 3690,
        conversion: 10.1,
        revenue: 23600,
        bounceRate: 16.1,
        avgDuration: 6.1,
        engagement: 6.4,
        returning: 104,
        goalCompletions: 335,
        cpc: 0.01,
      },
      Referral: {
        visits: 2980,
        conversion: 6.8,
        revenue: 11800,
        bounceRate: 31,
        avgDuration: 4.2,
        engagement: 4.7,
        returning: 79,
        goalCompletions: 183,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 3000,
        conversion: 4.1,
        revenue: 10400,
        bounceRate: 42.5,
        avgDuration: 2.8,
        engagement: 3.4,
        returning: 47,
        goalCompletions: 100,
        cpc: 1.1,
      },
    },
  },
];

/*
 * Muted accent colours designed for the neutral Wrapper background.
 * Only colours were changed; component layout and functionality are unchanged.
 */
const channelColors = {
  "Organic Search": {
    primary: "#2DD4BF",
    dark: "#0F766E",
    soft: "rgba(45, 212, 191, 0.055)",
    border: "rgba(94, 234, 212, 0.13)",
  },

  Direct: {
    primary: "#60A5FA",
    dark: "#2563EB",
    soft: "rgba(96, 165, 250, 0.055)",
    border: "rgba(147, 197, 253, 0.13)",
  },

  "Social Media": {
    primary: "#818CF8",
    dark: "#4F46E5",
    soft: "rgba(129, 140, 248, 0.055)",
    border: "rgba(165, 180, 252, 0.13)",
  },

  Email: {
    primary: "#F87171",
    dark: "#B91C1C",
    soft: "rgba(248, 113, 113, 0.05)",
    border: "rgba(252, 165, 165, 0.12)",
  },

  Referral: {
    primary: "#FBBF24",
    dark: "#B45309",
    soft: "rgba(251, 191, 36, 0.05)",
    border: "rgba(253, 230, 138, 0.12)",
  },

  "Paid Ads": {
    primary: "#22D3EE",
    dark: "#0E7490",
    soft: "rgba(34, 211, 238, 0.05)",
    border: "rgba(103, 232, 249, 0.12)",
  },
};

const chartTypes = [
  {
    id: "bar",
    label: "Bar",
    icon: BarChart3,
    color: "#60A5FA",
  },
  {
    id: "line",
    label: "Line",
    icon: LineChartIcon,
    color: "#2DD4BF",
  },
  {
    id: "area",
    label: "Area",
    icon: TrendingUp,
    color: "#818CF8",
  },
  {
    id: "radar",
    label: "Radar",
    icon: Layers,
    color: "#FBBF24",
  },
  {
    id: "pie",
    label: "Pie",
    icon: PieChartIcon,
    color: "#22D3EE",
  },
];

const metricOptions = [
  {
    id: "visits",
    label: "Visits",
    icon: Users,
    color: "#60A5FA",
    soft: "rgba(96, 165, 250, 0.055)",
    border: "rgba(147, 197, 253, 0.13)",
  },
  {
    id: "conversion",
    label: "Conversion",
    icon: Target,
    color: "#2DD4BF",
    soft: "rgba(45, 212, 191, 0.055)",
    border: "rgba(94, 234, 212, 0.13)",
  },
  {
    id: "revenue",
    label: "Revenue",
    icon: DollarSign,
    color: "#A78BFA",
    soft: "rgba(167, 139, 250, 0.055)",
    border: "rgba(196, 181, 253, 0.13)",
  },
  {
    id: "engagement",
    label: "Engagement",
    icon: Activity,
    color: "#22D3EE",
    soft: "rgba(34, 211, 238, 0.05)",
    border: "rgba(103, 232, 249, 0.12)",
  },
  {
    id: "bounceRate",
    label: "Bounce Rate",
    icon: TrendingDown,
    color: "#F87171",
    soft: "rgba(248, 113, 113, 0.05)",
    border: "rgba(252, 165, 165, 0.12)",
  },
];

const ANALYTICS_STYLES = `
  .analytics-thin-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(124, 135, 152, 0.3) transparent;
  }

  .analytics-thin-scroll::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  .analytics-thin-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .analytics-thin-scroll::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(124, 135, 152, 0.3);
  }

  .analytics-thin-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.44);
  }

  .analytics-thin-scroll::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

const chartTheme = {
  grid: "rgba(124, 135, 152, 0.075)",
  axis: "rgba(124, 135, 152, 0.12)",
  text: "#727E8F",
};

const sanitizeId = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const formatAxisValue = (value, metric) => {
  if (metric === "revenue") {
    return value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }

  return Number(value).toLocaleString();
};

const formatMetricValue = (value, metric) => {
  const safeValue = Number(value || 0);

  if (metric === "revenue") {
    return `$${safeValue.toLocaleString()}`;
  }

  if (metric === "conversion" || metric === "bounceRate") {
    return `${safeValue.toFixed(1)}%`;
  }

  if (metric === "engagement") {
    return safeValue.toFixed(1);
  }

  return safeValue.toLocaleString();
};

const getMetricLabel = (metric) => metricOptions.find((item) => item.id === metric)?.label || "Metric";

const EmptyChartState = () => (
  <motion.div
    initial={{
      opacity: 0,
    }}
    animate={{
      opacity: 1,
    }}
    className="flex h-full flex-col items-center justify-center px-4 text-center"
  >
    <span className="flex size-16 items-center justify-center rounded-2xl border border-white/[0.045] bg-white/[0.012] text-[#727E8F]">
      <BarChart3 size={27} />
    </span>

    <p className="mt-4 text-[11px] font-bold text-[#C7CFDA]">No channels selected</p>

    <p className="mt-1 max-w-sm text-[9px] leading-5 text-[#727E8F]">Select at least one traffic channel to display analytics.</p>
  </motion.div>
);

export const AdvancedTrafficChannelAnalysis = () => {
  const [viewMode, setViewMode] = useState("bar");

  const [selectedChannels, setSelectedChannels] = useState(Object.keys(channelColors));

  const [selectedMonth] = useState("Dec");
  const [metric, setMetric] = useState("visits");

  const [timeRange, setTimeRange] = useState("1y");

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const processedData = useMemo(() => {
    let monthsToShow = monthlyTrafficData;

    if (timeRange === "3m") {
      monthsToShow = monthlyTrafficData.slice(-3);
    }

    if (timeRange === "6m") {
      monthsToShow = monthlyTrafficData.slice(-6);
    }

    return monthsToShow.map((month) => {
      const dataPoint = {
        month: month.month,
      };

      selectedChannels.forEach((channel) => {
        const channelData = month.channels?.[channel];

        if (channelData) {
          dataPoint[channel] = channelData[metric] || 0;
        }
      });

      return dataPoint;
    });
  }, [selectedChannels, metric, timeRange]);

  const currentMetric = useMemo(() => metricOptions.find((item) => item.id === metric) || metricOptions[0], [metric]);

  const selectedTotal = useMemo(() => {
    const month = monthlyTrafficData.find((item) => item.month === selectedMonth) || monthlyTrafficData[monthlyTrafficData.length - 1];

    return selectedChannels.reduce((total, channel) => total + Number(month?.channels?.[channel]?.[metric] || 0), 0);
  }, [metric, selectedChannels, selectedMonth]);

  const toggleChannel = useCallback((channel) => {
    setSelectedChannels((previousChannels) => (previousChannels.includes(channel) ? previousChannels.filter((item) => item !== channel) : [...previousChannels, channel]));
  }, []);

  const selectAllChannels = useCallback(() => {
    setSelectedChannels(Object.keys(channelColors));
  }, []);

  const deselectAllChannels = useCallback(() => {
    setSelectedChannels([]);
  }, []);

  const handleRefresh = () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 850);
  };

  const renderCartesianAxes = () => (
    <>
      <CartesianGrid strokeDasharray="4 6" stroke={chartTheme.grid} vertical={false} />

      <XAxis
        dataKey="month"
        tick={{
          fill: chartTheme.text,
          fontSize: 10,
        }}
        tickLine={false}
        axisLine={{
          stroke: chartTheme.axis,
        }}
        dy={10}
      />

      <YAxis
        tickFormatter={(value) => formatAxisValue(value, metric)}
        tick={{
          fill: chartTheme.text,
          fontSize: 10,
        }}
        tickLine={false}
        axisLine={false}
        width={54}
      />
    </>
  );

  const renderChart = () => {
    const commonMargin = {
      top: 14,
      right: 18,
      bottom: 8,
      left: 4,
    };

    switch (viewMode) {
      case "bar":
        return (
          <BarChart data={processedData} margin={commonMargin} barGap={4}>
            {renderCartesianAxes()}

            <Tooltip
              cursor={{
                fill: "rgba(148,163,184,0.012)",
              }}
              content={<CustomTooltip metric={metric} />}
            />

            <defs>
              {selectedChannels.map((channel) => {
                const colors = channelColors[channel];

                return (
                  <linearGradient key={channel} id={`bar-${sanitizeId(channel)}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors?.primary} stopOpacity={0.8} />

                    <stop offset="100%" stopColor={colors?.dark} stopOpacity={0.42} />
                  </linearGradient>
                );
              })}
            </defs>

            {selectedChannels.map((channel) => (
              <Bar key={channel} dataKey={channel} fill={`url(#bar-${sanitizeId(channel)})`} radius={[5, 5, 1, 1]} barSize={22} />
            ))}
          </BarChart>
        );

      case "line":
        return (
          <ComposedChart data={processedData} margin={commonMargin}>
            {renderCartesianAxes()}

            <Tooltip
              cursor={{
                stroke: chartTheme.axis,
                strokeDasharray: "4 4",
              }}
              content={<CustomTooltip metric={metric} />}
            />

            {selectedChannels.map((channel) => (
              <Line
                key={channel}
                type="monotone"
                dataKey={channel}
                stroke={channelColors[channel]?.primary}
                strokeOpacity={0.88}
                strokeWidth={2.25}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: channelColors[channel]?.primary,
                  stroke: "#11161D",
                  strokeWidth: 2,
                }}
              />
            ))}
          </ComposedChart>
        );

      case "area":
        return (
          <AreaChart data={processedData} margin={commonMargin}>
            {renderCartesianAxes()}

            <Tooltip
              cursor={{
                stroke: chartTheme.axis,
                strokeDasharray: "4 4",
              }}
              content={<CustomTooltip metric={metric} />}
            />

            <defs>
              {selectedChannels.map((channel) => {
                const colors = channelColors[channel];

                return (
                  <linearGradient key={channel} id={`area-${sanitizeId(channel)}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors?.primary} stopOpacity={0.18} />

                    <stop offset="95%" stopColor={colors?.primary} stopOpacity={0} />
                  </linearGradient>
                );
              })}
            </defs>

            {selectedChannels.map((channel) => (
              <Area key={channel} type="monotone" dataKey={channel} stroke={channelColors[channel]?.primary} strokeOpacity={0.88} fill={`url(#area-${sanitizeId(channel)})`} strokeWidth={2} />
            ))}
          </AreaChart>
        );

      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="76%" data={processedData}>
            <PolarGrid stroke={chartTheme.grid} />

            <PolarAngleAxis
              dataKey="month"
              tick={{
                fill: chartTheme.text,
                fontSize: 10,
              }}
            />

            <PolarRadiusAxis
              tick={{
                fill: chartTheme.text,
                fontSize: 9,
              }}
              axisLine={false}
            />

            {selectedChannels.map((channel) => (
              <Radar
                key={channel}
                name={channel}
                dataKey={channel}
                stroke={channelColors[channel]?.primary}
                strokeOpacity={0.86}
                fill={channelColors[channel]?.primary}
                fillOpacity={0.075}
                strokeWidth={2}
              />
            ))}

            <Tooltip content={<CustomTooltip metric={metric} />} />
          </RadarChart>
        );

      case "pie": {
        const currentMonthData = monthlyTrafficData.find((month) => month.month === selectedMonth);

        const pieData = selectedChannels
          .map((channel) => ({
            name: channel,
            value: currentMonthData?.channels?.[channel]?.[metric] || 0,
            color: channelColors[channel]?.primary,
          }))
          .filter((item) => item.value > 0);

        return (
          <RePieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius="52%" outerRadius="76%" paddingAngle={3} dataKey="value" stroke="#12171E" strokeWidth={2}>
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} fillOpacity={0.82} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip metric={metric} />} />
          </RePieChart>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Wrapper className={`relative overflow-visible p-0 ${isFullscreen ? "fixed inset-3 z-[9999] m-0 max-h-[calc(100vh-24px)] overflow-y-auto" : ""}`}>
      <style>{ANALYTICS_STYLES}</style>

      <section className="group relative overflow-hidden rounded-[inherit] border border-slate-200/70 bg-transparent p-4 shadow-sm dark:border-white/[0.045] sm:p-5 2xl:p-6">
        <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-blue-400/[0.014] blur-[110px]" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-cyan-400/[0.01] blur-[110px]" />

        <div className="relative z-10">
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex flex-col gap-5 border-b border-slate-200/65 pb-5 dark:border-white/[0.045] xl:flex-row xl:items-center xl:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-blue-300/[0.1] bg-blue-300/[0.03] text-blue-200/70 shadow-[0_12px_28px_rgba(59,130,246,0.045)]">
                <BarChart3 size={19} />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-black tracking-[-0.025em] text-slate-900 dark:text-[#DCE3EC]">Advanced Channel Analytics</h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-300/[0.09] bg-teal-300/[0.025] px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.08em] text-teal-200/65">
                    <span className="size-1.5 rounded-full bg-teal-300/80 shadow-[0_0_7px_rgba(45,212,191,0.36)]" />
                    Live
                  </span>
                </div>

                <p className="mt-1.5 text-[9px] leading-4 text-slate-400 dark:text-[#727E8F]">Real-time performance across all portfolio traffic sources.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-xl border border-slate-200/70 bg-white/35 p-1 dark:border-white/[0.05] dark:bg-white/[0.01]">
                {["3m", "6m", "1y"].map((range) => {
                  const active = timeRange === range;

                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setTimeRange(range)}
                      className={`h-8 rounded-lg px-3 text-[8px] font-semibold transition-all duration-300 ${
                        active
                          ? "border border-blue-300/[0.12] bg-blue-300/[0.04] text-blue-200/75 shadow-[0_7px_18px_rgba(59,130,246,0.045)]"
                          : "border border-transparent text-slate-400 hover:text-slate-700 dark:text-[#727E8F] dark:hover:text-[#C7CFDA]"
                      }`}
                    >
                      {range === "1y" ? "1 Year" : range === "3m" ? "3 Months" : "6 Months"}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                aria-label="Refresh analytics"
                title="Refresh analytics"
                disabled={isRefreshing}
                onClick={handleRefresh}
                className="flex size-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white/35 text-slate-500 transition-all hover:-translate-y-0.5 hover:border-blue-300/25 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.05] dark:bg-white/[0.01] dark:text-[#727E8F] dark:hover:border-blue-300/[0.1] dark:hover:bg-blue-300/[0.02] dark:hover:text-blue-200/70"
              >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              </button>

              <button
                type="button"
                aria-label={isFullscreen ? "Exit fullscreen" : "Open fullscreen"}
                title={isFullscreen ? "Exit fullscreen" : "Open fullscreen"}
                onClick={() => setIsFullscreen((previousValue) => !previousValue)}
                className="flex size-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white/35 text-slate-500 transition-all hover:-translate-y-0.5 hover:border-indigo-300/25 hover:text-indigo-700 dark:border-white/[0.05] dark:bg-white/[0.01] dark:text-[#727E8F] dark:hover:border-indigo-300/[0.1] dark:hover:bg-indigo-300/[0.02] dark:hover:text-indigo-200/70"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>
          </motion.div>

          <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="analytics-thin-scroll max-w-full overflow-x-auto">
              <div className="flex min-w-max items-center rounded-xl border border-slate-200/70 bg-white/35 p-1 dark:border-white/[0.05] dark:bg-white/[0.01]">
                {metricOptions.map((item) => {
                  const Icon = item.icon;
                  const active = metric === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMetric(item.id)}
                      className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[8px] font-semibold transition-all duration-300"
                      style={
                        active
                          ? {
                              color: item.color,
                              background: item.soft,
                              borderColor: item.border,
                            }
                          : {
                              color: "rgba(124,135,152,0.72)",
                              background: "transparent",
                              borderColor: "transparent",
                            }
                      }
                    >
                      <Icon size={12} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex w-fit items-center rounded-xl border border-slate-200/70 bg-white/35 p-1 dark:border-white/[0.05] dark:bg-white/[0.01]">
              {chartTypes.map((chart) => {
                const Icon = chart.icon;
                const active = viewMode === chart.id;

                return (
                  <button
                    key={chart.id}
                    type="button"
                    title={`${chart.label} chart`}
                    aria-label={`${chart.label} chart`}
                    onClick={() => setViewMode(chart.id)}
                    className="flex size-8 items-center justify-center rounded-lg border transition-all duration-300"
                    style={
                      active
                        ? {
                            color: chart.color,
                            background: `${chart.color}0D`,
                            borderColor: `${chart.color}20`,
                          }
                        : {
                            color: "rgba(124,135,152,0.72)",
                            background: "transparent",
                            borderColor: "transparent",
                          }
                    }
                  >
                    <Icon size={13} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <EnhancedLegend selectedChannels={selectedChannels} onToggle={toggleChannel} onSelectAll={selectAllChannels} onDeselectAll={deselectAllChannels} />
          </div>

          <div className="mt-4 overflow-hidden rounded-[22px] border border-slate-200/70 bg-white/[0.32] dark:border-white/[0.045] dark:bg-white/[0.008]">
            <div className="flex flex-col gap-3 border-b border-slate-200/65 px-4 py-3 dark:border-white/[0.04] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[7px] font-semibold uppercase tracking-[0.11em] text-slate-400 dark:text-[#626E7E]">Performance visualization</p>

                <h3 className="mt-1 text-[10px] font-bold text-slate-800 dark:text-[#BCC6D2]">{getMetricLabel(metric)} by traffic channel</h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200/70 bg-white/45 px-3 py-1.5 text-[8px] text-slate-500 dark:border-white/[0.05] dark:bg-white/[0.01] dark:text-[#727E8F]">
                  {selectedChannels.length} of {Object.keys(channelColors).length} channels
                </span>

                <span
                  className="rounded-full border px-3 py-1.5 text-[8px] font-semibold"
                  style={{
                    color: currentMetric.color,
                    background: currentMetric.soft,
                    borderColor: currentMetric.border,
                  }}
                >
                  {formatMetricValue(selectedTotal, metric)} in {selectedMonth}
                </span>
              </div>
            </div>

            <div className={`w-full p-2 sm:p-3 ${isFullscreen ? "h-[calc(100vh-330px)] min-h-[440px]" : "h-[430px]"}`}>
              {selectedChannels.length === 0 ? (
                <EmptyChartState />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};

export const EnhancedLegend = ({ selectedChannels, onToggle, onSelectAll, onDeselectAll }) => {
  const allSelected = selectedChannels.length === Object.keys(channelColors).length;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/[0.28] p-3 dark:border-white/[0.045] dark:bg-white/[0.006] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {Object.entries(channelColors).map(([channel, colors]) => {
          const selected = selectedChannels.includes(channel);

          return (
            <motion.button
              key={channel}
              type="button"
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() => onToggle(channel)}
              className="flex h-8 items-center gap-2 rounded-xl border px-3 text-[8px] font-semibold transition-all duration-300"
              style={{
                color: selected ? colors.primary : "rgba(124,135,152,0.7)",
                background: selected ? colors.soft : "transparent",
                borderColor: selected ? colors.border : "rgba(124,135,152,0.095)",
              }}
            >
              <span
                className="flex size-4 items-center justify-center rounded-full border"
                style={{
                  color: selected ? colors.primary : "rgba(124,135,152,0.46)",
                  background: selected ? `${colors.primary}10` : "transparent",
                  borderColor: selected ? colors.border : "rgba(124,135,152,0.11)",
                }}
              >
                {selected ? (
                  <Check size={9} />
                ) : (
                  <span
                    className="size-1.5 rounded-full"
                    style={{
                      background: colors.primary,
                    }}
                  />
                )}
              </span>

              {channel}
            </motion.button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onSelectAll}
          disabled={allSelected}
          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200/70 bg-white/35 px-3 text-[8px] font-semibold text-slate-500 transition-all hover:border-teal-300/25 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.05] dark:bg-white/[0.01] dark:text-[#727E8F] dark:hover:border-teal-300/[0.09] dark:hover:text-teal-200/65"
        >
          <Check size={11} />
          All
        </button>

        <button
          type="button"
          onClick={onDeselectAll}
          disabled={selectedChannels.length === 0}
          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200/70 bg-white/35 px-3 text-[8px] font-semibold text-slate-500 transition-all hover:border-red-300/25 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.05] dark:bg-white/[0.01] dark:text-[#727E8F] dark:hover:border-red-300/[0.09] dark:hover:text-red-200/65"
        >
          <X size={11} />
          Clear
        </button>
      </div>
    </div>
  );
};

EnhancedLegend.propTypes = {
  selectedChannels: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onDeselectAll: PropTypes.func.isRequired,
};

export const CustomTooltip = ({ active, payload, label, metric = "visits" }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const resolvedLabel = label || payload[0]?.name || "Overview";

  const monthData = monthlyTrafficData.find((month) => month.month === resolvedLabel) || null;

  const total = payload.reduce((sum, entry) => sum + Number(entry.value || 0), 0);

  return (
    <div className="min-w-[270px] overflow-hidden rounded-[18px] border border-white/[0.065] bg-[#12171E]/95 p-3.5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.52)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.05] pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl border border-blue-300/[0.09] bg-blue-300/[0.025] text-blue-200/70">
            <BarChart3 size={14} />
          </span>

          <div>
            <p className="text-[10px] font-bold text-[#DCE3EC]">{resolvedLabel}</p>

            <p className="mt-0.5 text-[7px] uppercase tracking-[0.1em] text-[#626E7E]">{getMetricLabel(metric)}</p>
          </div>
        </div>

        <span className="rounded-full border border-white/[0.055] bg-white/[0.012] px-2.5 py-1 text-[8px] font-bold tabular-nums text-[#9CA8B7]">{formatMetricValue(total, metric)}</span>
      </div>

      <div className="analytics-thin-scroll mt-3 max-h-[300px] space-y-2 overflow-y-auto pr-1">
        {payload.map((entry, index) => {
          const channel = entry.dataKey || entry.name || "Channel";

          const channelData = monthData?.channels?.[channel];

          const percentage = total > 0 ? ((Number(entry.value || 0) / total) * 100).toFixed(1) : "0.0";

          const colors = channelColors[channel] || channelColors.Direct;

          return (
            <div key={`${channel}-${index}`} className="rounded-xl border border-white/[0.045] bg-white/[0.008] p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{
                      background: colors.primary,
                      boxShadow: `0 0 8px ${colors.primary}3D`,
                    }}
                  />

                  <p className="truncate text-[9px] font-semibold text-[#B8C1CD]">{channel}</p>

                  <span className="rounded-full border border-white/[0.045] bg-white/[0.008] px-2 py-0.5 text-[7px] text-[#727E8F]">{percentage}%</span>
                </div>

                <p
                  className="shrink-0 text-[9px] font-black tabular-nums"
                  style={{
                    color: colors.primary,
                  }}
                >
                  {formatMetricValue(entry.value, metric)}
                </p>
              </div>

              {channelData && (
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <div className="rounded-lg border border-white/[0.04] bg-white/[0.006] px-2 py-2 text-center">
                    <p className="text-[6px] font-semibold uppercase tracking-[0.08em] text-[#626E7E]">Conversion</p>

                    <p className="mt-1 text-[8px] font-bold text-teal-200/70">{channelData.conversion}%</p>
                  </div>

                  <div className="rounded-lg border border-white/[0.04] bg-white/[0.006] px-2 py-2 text-center">
                    <p className="text-[6px] font-semibold uppercase tracking-[0.08em] text-[#626E7E]">Engagement</p>

                    <p className="mt-1 text-[8px] font-bold text-blue-200/70">
                      {channelData.engagement}
                      /10
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/[0.04] bg-white/[0.006] px-2 py-2 text-center">
                    <p className="text-[6px] font-semibold uppercase tracking-[0.08em] text-[#626E7E]">Bounce</p>

                    <p className="mt-1 text-[8px] font-bold text-red-200/70">{channelData.bounceRate}%</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  metric: PropTypes.string,
};
