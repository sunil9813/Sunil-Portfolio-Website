import { Users, Package, FileText, DollarSign } from "lucide-react";

import { Eye, Heart, MessageCircle, Download, Star, BarChart3 } from "lucide-react";

import { Smartphone, Clock, TrendingDown, Zap } from "lucide-react";

import { Trophy, Calendar, Award } from "lucide-react";

import { Globe, MapPin } from "lucide-react";

import { useState, useEffect, useRef } from "react";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, ChevronRight, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";

import { Maximize2, Filter, ChevronUp, ChevronDown } from "lucide-react";

import { Activity, ShoppingCart, UserPlus, Wifi, WifiOff } from "lucide-react";

import { Rocket, Settings, EyeOff } from "lucide-react";

import { Save, X, PieChart, Grid } from "lucide-react";

import { Database, Search, Play, History, Code, LineChart, Copy, Share2 } from "lucide-react";

import { Shield, Lock, Key, Server, CheckCircle } from "lucide-react";

import { Upload, Cloud, AlertCircle, ExternalLink, Link } from "lucide-react";

export const DataIntegrationHub = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: "Google Analytics",
      status: "connected",
      lastSync: "5 minutes ago",
      syncStatus: "success",
      icon: "📊",
    },
    {
      id: 2,
      name: "Stripe",
      status: "connected",
      lastSync: "1 hour ago",
      syncStatus: "success",
      icon: "💳",
    },
    {
      id: 3,
      name: "Slack",
      status: "connected",
      lastSync: "2 hours ago",
      syncStatus: "warning",
      icon: "💬",
    },
    {
      id: 4,
      name: "Salesforce",
      status: "disconnected",
      lastSync: "2 days ago",
      syncStatus: "error",
      icon: "📈",
    },
    {
      id: 5,
      name: "MySQL Database",
      status: "connected",
      lastSync: "Real-time",
      syncStatus: "success",
      icon: "🗄️",
    },
    {
      id: 6,
      name: "Shopify",
      status: "pending",
      lastSync: "Never",
      syncStatus: "idle",
      icon: "🛒",
    },
  ]);

  const [exports, setExports] = useState([
    {
      id: 1,
      name: "Monthly Revenue Report",
      format: "PDF",
      size: "2.4 MB",
      status: "completed",
      scheduled: "Daily at 9 AM",
    },
    {
      id: 2,
      name: "User Analytics CSV",
      format: "CSV",
      size: "45 MB",
      status: "processing",
      scheduled: "Weekly on Monday",
    },
    {
      id: 3,
      name: "API Data Dump",
      format: "JSON",
      size: "128 MB",
      status: "queued",
      scheduled: "Manual",
    },
    {
      id: 4,
      name: "Executive Summary",
      format: "PPT",
      size: "8.2 MB",
      status: "failed",
      scheduled: "Monthly",
    },
  ]);

  const [activeTab, setActiveTab] = useState("integrations");
  const [isSyncing, setIsSyncing] = useState(false);

  const syncAll = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const availableIntegrations = [
    { name: "GitHub", category: "Development" },
    { name: "Jira", category: "Project Management" },
    { name: "HubSpot", category: "Marketing" },
    { name: "Zapier", category: "Automation" },
    { name: "QuickBooks", category: "Accounting" },
    { name: "Mailchimp", category: "Email" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
            <Database size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Data Integration Hub</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Connect, sync, and export your data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={syncAll} disabled={isSyncing} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Syncing..." : "Sync All"}
          </button>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {["integrations", "exports", "api", "webhooks"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize relative ${
              activeTab === tab ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
          </button>
        ))}
      </div>

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{integration.name}</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${integration.status === "connected" ? "bg-emerald-500" : integration.status === "pending" ? "bg-amber-500" : "bg-red-500"}`} />
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{integration.status}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-1 rounded ${
                      integration.syncStatus === "success"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : integration.syncStatus === "warning"
                          ? "bg-amber-500/10 text-amber-600"
                          : integration.syncStatus === "error"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-gray-500/10 text-gray-600"
                    }`}
                  >
                    {integration.syncStatus === "success" ? (
                      <CheckCircle size={14} />
                    ) : integration.syncStatus === "warning" ? (
                      <AlertCircle size={14} />
                    ) : integration.syncStatus === "error" ? (
                      <AlertCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">Last sync: {integration.lastSync}</div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">Configure</button>
                  <button className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Sync Now</button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Available Integrations</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableIntegrations.map((integration, index) => (
                <button
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{integration.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{integration.category}</div>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">
                    <Link size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Exports Tab */}
      {activeTab === "exports" && (
        <div>
          <div className="space-y-3 mb-6">
            {exports.map((exportItem) => (
              <div key={exportItem.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <Download size={16} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{exportItem.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {exportItem.format} • {exportItem.size} • {exportItem.scheduled}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium ${
                      exportItem.status === "completed" ? "text-emerald-600" : exportItem.status === "processing" ? "text-blue-600" : exportItem.status === "queued" ? "text-amber-600" : "text-red-600"
                    }`}
                  >
                    {exportItem.status.charAt(0).toUpperCase() + exportItem.status.slice(1)}
                  </span>
                  <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Create New Export</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded bg-blue-500/10 text-blue-600">
                    <Download size={16} />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Custom Export</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select data range and format</p>
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">Configure</button>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-600">
                    <Clock size={16} />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Scheduled Export</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Set up automatic exports</p>
                <button className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm">Schedule</button>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded bg-purple-500/10 text-purple-600">
                    <Cloud size={16} />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Cloud Sync</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Sync to cloud storage</p>
                <button className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">Connect</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Tab */}
      {activeTab === "api" && (
        <div>
          <div className="p-4 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 text-white mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-lg">API Access</h4>
                <p className="text-gray-300 text-sm">Programmatic access to your dashboard data</p>
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-sm">Active</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Key:</span>
                <code className="px-2 py-1 bg-white/10 rounded text-sm font-mono">sk_live_•••••••••••••••••••••••</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Rate Limit:</span>
                <span>100 requests/minute</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Version:</span>
                <span>v2.1</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">Quick Start</h5>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                {`curl -X GET \\
  https://api.yourplatform.com/v2/metrics \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">API Endpoints</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <code className="text-blue-600 dark:text-blue-400">GET /metrics</code>
                  <span className="text-gray-500">Dashboard metrics</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <code className="text-green-600 dark:text-green-400">POST /exports</code>
                  <span className="text-gray-500">Create exports</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <code className="text-purple-600 dark:text-purple-400">GET /realtime</code>
                  <span className="text-gray-500">Real-time data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === "webhooks" && (
        <div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Configure Webhooks</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Webhook URL</label>
                <input type="text" placeholder="https://your-server.com/webhook" className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Events to Trigger</label>
                <div className="space-y-2">
                  {["New User", "Payment Received", "Content Published", "Error Alert"].map((event) => (
                    <label key={event} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save Webhook</button>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <Zap size={14} className="inline mr-1" />
            Webhooks will send POST requests to your specified URL when events occur.
          </div>
        </div>
      )}
    </div>
  );
};

export const SecurityComplianceCenter = () => {
  const [securityScore, setSecurityScore] = useState(92);
  const [activeSessions, setActiveSessions] = useState(3);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    ipWhitelist: false,
    sessionTimeout: 30,
    auditLogging: true,
    dataEncryption: true,
    apiRateLimit: 100,
  });

  const [complianceStatus, setComplianceStatus] = useState([
    { standard: "GDPR", status: "compliant", lastAudit: "2024-01-15" },
    { standard: "HIPAA", status: "in-progress", lastAudit: "2024-01-10" },
    { standard: "SOC 2", status: "compliant", lastAudit: "2023-12-20" },
    { standard: "ISO 27001", status: "pending", lastAudit: "2023-11-30" },
    { standard: "PCI DSS", status: "non-compliant", lastAudit: "2023-12-05" },
  ]);

  const [securityEvents, setSecurityEvents] = useState([
    { id: 1, event: "Login from new device", user: "admin@company.com", ip: "192.168.1.100", time: "10 min ago", severity: "low" },
    { id: 2, event: "Failed login attempt", user: "unknown", ip: "203.0.113.25", time: "1 hour ago", severity: "medium" },
    { id: 3, event: "API key rotation", user: "system", ip: "10.0.0.1", time: "2 hours ago", severity: "low" },
    { id: 4, event: "Data export initiated", user: "analyst@company.com", ip: "192.168.1.50", time: "4 hours ago", severity: "medium" },
    { id: 5, event: "User permission changed", user: "admin@company.com", ip: "192.168.1.100", time: "1 day ago", severity: "high" },
  ]);

  const [accessControls, setAccessControls] = useState([
    { role: "Admin", users: 3, permissions: "Full access", status: "active" },
    { role: "Editor", users: 12, permissions: "Create & edit", status: "active" },
    { role: "Viewer", users: 45, permissions: "Read only", status: "active" },
    { role: "Auditor", users: 2, permissions: "Read & audit", status: "inactive" },
  ]);

  const getSecurityLevel = (score) => {
    if (score >= 90) return { color: "text-emerald-500", label: "Excellent" };
    if (score >= 75) return { color: "text-blue-500", label: "Good" };
    if (score >= 60) return { color: "text-amber-500", label: "Fair" };
    return { color: "text-red-500", label: "Poor" };
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-500/10 text-red-600";
      case "medium":
        return "bg-amber-500/10 text-amber-600";
      case "low":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case "compliant":
        return "text-emerald-600 bg-emerald-500/10";
      case "in-progress":
        return "text-blue-600 bg-blue-500/10";
      case "pending":
        return "text-amber-600 bg-amber-500/10";
      case "non-compliant":
        return "text-red-600 bg-red-500/10";
      default:
        return "text-gray-600 bg-gray-500/10";
    }
  };

  const runSecurityScan = () => {
    // Simulate security scan
    setSecurityScore((prev) => Math.min(prev + 2, 100));
  };

  const securityLevel = getSecurityLevel(securityScore);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 text-white">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Security & Compliance Center</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enterprise security controls and compliance monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={runSecurityScan} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            <RefreshCw size={14} />
            Run Scan
          </button>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Security Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{securityScore}</div>
            <div className="text-sm text-gray-300">Security Score</div>
            <div className={`text-sm font-medium ${securityLevel.color}`}>{securityLevel.label}</div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
              <span>Vulnerabilities</span>
              <span>Low</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: "95%" }} />
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white">Active Sessions</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{activeSessions}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Admin sessions</span>
              <span className="font-medium">1</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Last activity</span>
              <span className="font-medium">5 min ago</span>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-emerald-600" />
              <span className="font-medium text-gray-900 dark:text-white">API Security</span>
            </div>
            <div className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded text-xs font-medium">Secure</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Rate limit</span>
              <span className="font-medium">{securitySettings.apiRateLimit}/min</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Keys rotated</span>
              <span className="font-medium">7 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Security Settings</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(securitySettings).map(([key, value]) => (
            <div key={key} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">{key.replace(/([A-Z])/g, " $1").toLowerCase()}</div>
                <div className={`w-3 h-3 rounded-full ${value ? "bg-emerald-500" : "bg-gray-300"}`} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{typeof value === "boolean" ? (value ? "Enabled" : "Disabled") : `${value} minutes`}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Status */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Compliance Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {complianceStatus.map((item, index) => (
            <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <div className="font-semibold text-gray-900 dark:text-white mb-1">{item.standard}</div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${getComplianceColor(item.status)}`}>{item.status.replace("-", " ").toUpperCase()}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Audited: {item.lastAudit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Events */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white">Security Events</h4>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
        </div>
        <div className="space-y-2">
          {securityEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{event.event}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {event.user} • {event.ip}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${getSeverityColor(event.severity)}`}>{event.severity.toUpperCase()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Access Controls */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Access Controls</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {accessControls.map((role, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900 dark:text-white">{role.role}</div>
                <div className={`w-2 h-2 rounded-full ${role.status === "active" ? "bg-emerald-500" : "bg-gray-300"}`} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{role.permissions}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{role.users} users</span>
                <span className={`font-medium ${role.status === "active" ? "text-emerald-600" : "text-gray-600"}`}>{role.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm">
            <Download size={14} />
            Export Audit Logs
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm">
            <FileText size={14} />
            Compliance Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm">
            <Users size={14} />
            User Access Review
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm">
            <Activity size={14} />
            Real-time Monitoring
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdvancedAnalyticsEngine = () => {
  const [query, setQuery] = useState("SELECT * FROM users WHERE created_at >= '2024-01-01'");
  const [results, setResults] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", signups: 150, conversion: 3.2 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", signups: 230, conversion: 4.8 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", signups: 95, conversion: 2.1 },
  ]);
  const [savedQueries, setSavedQueries] = useState([
    { id: 1, name: "Monthly Active Users", query: "SELECT COUNT(*) FROM users WHERE last_active >= NOW() - INTERVAL 30 DAY" },
    { id: 2, name: "Revenue by Channel", query: "SELECT channel, SUM(revenue) FROM sales GROUP BY channel" },
    { id: 3, name: "User Retention", query: "SELECT cohort, retention_rate FROM retention_metrics" },
  ]);
  const [visualizationType, setVisualizationType] = useState("table");
  const [isRunning, setIsRunning] = useState(false);

  const queryRef = useRef(null);

  const runQuery = () => {
    setIsRunning(true);
    // Simulate query execution
    setTimeout(() => {
      setResults([...results, { id: 4, name: "New User", email: "new@example.com", signups: 50, conversion: 1.5 }]);
      setIsRunning(false);
    }, 1500);
  };

  const saveQuery = () => {
    const name = prompt("Enter a name for this query:");
    if (name && query) {
      setSavedQueries([...savedQueries, { id: savedQueries.length + 1, name, query }]);
    }
  };

  const loadQuery = (savedQuery) => {
    setQuery(savedQuery);
    if (queryRef.current) {
      queryRef.current.focus();
    }
  };

  const exportResults = (format) => {
    console.log(`Exporting results as ${format}`);
    // Implement export functionality
  };

  const quickQueries = [
    { name: "Top Performers", query: "SELECT * FROM content ORDER BY views DESC LIMIT 10" },
    { name: "Revenue Trends", query: "SELECT date, SUM(revenue) FROM transactions GROUP BY date" },
    { name: "User Growth", query: "SELECT WEEK(created_at) as week, COUNT(*) FROM users GROUP BY week" },
    { name: "Engagement Metrics", query: "SELECT content_type, AVG(engagement_time) FROM analytics GROUP BY content_type" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
            <Database size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Advanced Analytics Engine</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">SQL queries and custom data exploration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={saveQuery} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm">
            <Save size={14} />
            Save
          </button>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <History size={16} />
          </button>
        </div>
      </div>

      {/* Query Editor */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-900 dark:text-white">Query Editor</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">{query.length} chars</span>
            <button onClick={() => setQuery("")} className="p-1 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="relative">
          <textarea
            ref={queryRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-32 font-mono text-sm p-4 bg-gray-900 text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your SQL query here..."
            spellCheck={false}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <button onClick={() => navigator.clipboard.writeText(query)} className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded" title="Copy query">
              <Copy size={12} />
            </button>
            <button
              onClick={runQuery}
              disabled={isRunning || !query.trim()}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm disabled:opacity-50"
            >
              <Play size={12} className={isRunning ? "animate-spin" : ""} />
              {isRunning ? "Running..." : "Run Query"}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Queries */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Quick Queries</h4>
          <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickQueries.map((q, index) => (
            <button
              key={index}
              onClick={() => loadQuery(q.query)}
              className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              <div className="font-medium text-gray-900 dark:text-white text-sm">{q.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{q.query.substring(0, 40)}...</div>
            </button>
          ))}
        </div>
      </div>

      {/* Results Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Results ({results.length} rows)</h4>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {["table", "chart", "json"].map((type) => (
                <button
                  key={type}
                  onClick={() => setVisualizationType(type)}
                  className={`px-3 py-1 rounded text-xs capitalize ${visualizationType === type ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {["CSV", "JSON", "Excel"].map((format) => (
              <button key={format} onClick={() => exportResults(format)} className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                {format}
              </button>
            ))}
          </div>
        </div>

        {visualizationType === "table" && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {Object.keys(results[0] || {}).map((key) => (
                      <th key={key} className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                        {key.replace("_", " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {results.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      {Object.values(row).map((value, idx) => (
                        <td key={idx} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {visualizationType === "chart" && (
          <div className="h-64 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">Chart visualization for query results</p>
              <button className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">Generate Chart</button>
            </div>
          </div>
        )}

        {visualizationType === "json" && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto max-h-64">{JSON.stringify(results, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Saved Queries */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Saved Queries</h4>
        <div className="space-y-2">
          {savedQueries.map((saved) => (
            <div key={saved.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Code size={14} />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{saved.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md">{saved.query}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => loadQuery(saved.query)} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" title="Load query">
                  <Play size={12} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Share2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdvancedFiltering = () => {
  const [filters, setFilters] = useState([
    { id: 1, field: "date_range", operator: "last_30_days", value: "Last 30 days", active: true },
    { id: 2, field: "content_type", operator: "all", value: "All Content", active: true },
    { id: 3, field: "revenue", operator: "greater_than", value: "$100", active: false },
    { id: 4, field: "users", operator: "new_users", value: "New Users Only", active: true },
  ]);

  const [savedViews, setSavedViews] = useState([
    { id: 1, name: "Monthly Review", filters: 3, lastUsed: "2 days ago" },
    { id: 2, name: "Revenue Analysis", filters: 4, lastUsed: "1 week ago" },
    { id: 3, name: "User Growth", filters: 2, lastUsed: "3 days ago" },
  ]);

  // ✅ PURE JS (no TS generics)
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [newFilter, setNewFilter] = useState({ field: "", operator: "", value: "" });

  const fields = [
    { value: "date_range", label: "Date Range", icon: Calendar },
    { value: "content_type", label: "Content Type", icon: FileText },
    { value: "revenue", label: "Revenue", icon: DollarSign },
    { value: "users", label: "Users", icon: Users },
    { value: "downloads", label: "Downloads", icon: Download },
    { value: "engagement", label: "Engagement", icon: Activity },
  ];

  const operators = [
    { value: "equals", label: "Equals" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does not contain" },
    { value: "last_days", label: "Last X days" },
  ];

  const toggleFilter = (id) => {
    setFilters(filters.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
  };

  const removeFilter = (id) => {
    setFilters(filters.filter((f) => f.id !== id));
  };

  const addFilter = () => {
    if (!newFilter.field || !newFilter.operator || !newFilter.value) return;

    setFilters([
      ...filters,
      {
        id: Date.now(),
        ...newFilter,
        active: true,
      },
    ]);
    setNewFilter({ field: "", operator: "", value: "" });
  };

  const saveView = () => {
    const name = prompt("Enter a name for this view:");
    if (!name) return;

    setSavedViews([
      ...savedViews,
      {
        id: Date.now(),
        name,
        filters: filters.length,
        lastUsed: "Just now",
      },
    ]);
  };

  const activeFilters = filters.filter((f) => f.active).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border p-5 shadow-lg">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg">Advanced Filtering</h3>
          <p className="text-sm text-gray-500">Create custom views with sophisticated filters</p>
        </div>

        <div className="flex gap-2">
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="px-3 py-2 rounded border" />

          <button onClick={() => setViewMode("grid")}>
            <Grid size={16} />
          </button>
          <button onClick={() => setViewMode("list")}>
            <BarChart3 size={16} />
          </button>
          <button onClick={() => setViewMode("chart")}>
            <PieChart size={16} />
          </button>
        </div>
      </div>

      {/* Active Filters */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span>Active Filters ({activeFilters})</span>
          <button onClick={saveView} className="text-blue-600 flex gap-1">
            <Save size={14} /> Save View
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => {
            const Icon = fields.find((f) => f.value === filter.field)?.icon || Filter;

            return (
              <div key={filter.id} className="flex items-center gap-2 border rounded-full px-3 py-1">
                <button onClick={() => toggleFilter(filter.id)} className={`w-3 h-3 rounded-full ${filter.active ? "bg-blue-500" : "bg-gray-400"}`} />
                <Icon size={12} />
                <span>{filter.value}</span>
                <button onClick={() => removeFilter(filter.id)}>
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Filter */}
      <div className="flex gap-2">
        <select value={newFilter.field} onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}>
          <option value="">Field</option>
          {fields.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <select value={newFilter.operator} onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value })}>
          <option value="">Operator</option>
          {operators.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <input value={newFilter.value} onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })} placeholder="Value" />

        <button onClick={addFilter} className="bg-blue-600 text-white px-3 rounded">
          Add
        </button>
      </div>
    </div>
  );
};

export const AdvancedKPIMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [visibleKPIs, setVisibleKPIs] = useState({
    revenue: true,
    users: true,
    engagement: true,
    conversion: true,
    retention: true,
    growth: true,
  });

  const kpis = [
    {
      id: "revenue",
      name: "Monthly Recurring Revenue",
      current: 24580,
      target: 30000,
      growth: 18.5,
      trend: "up",
      icon: DollarSign,
      color: "emerald",
      importance: "high",
    },
    {
      id: "users",
      name: "Active Users",
      current: 14250,
      target: 20000,
      growth: 12.3,
      trend: "up",
      icon: Users,
      color: "blue",
      importance: "high",
    },
    {
      id: "engagement",
      name: "User Engagement Score",
      current: 78.5,
      target: 85,
      growth: 8.2,
      trend: "up",
      icon: Activity,
      color: "purple",
      importance: "medium",
    },
    {
      id: "conversion",
      name: "Conversion Rate",
      current: 3.8,
      target: 5,
      growth: -2.1,
      trend: "down",
      icon: TrendingUp,
      color: "amber",
      importance: "critical",
    },
    {
      id: "retention",
      name: "30-day Retention",
      current: 42.3,
      target: 50,
      growth: 5.7,
      trend: "up",
      icon: Award,
      color: "cyan",
      importance: "medium",
    },
    {
      id: "growth",
      name: "MoM Growth Rate",
      current: 15.8,
      target: 20,
      growth: 22.4,
      trend: "up",
      icon: Rocket,
      color: "pink",
      importance: "high",
    },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case "emerald":
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-600 dark:text-emerald-400",
          gradient: "from-emerald-500 to-teal-500",
        };
      case "blue":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-600 dark:text-blue-400",
          gradient: "from-blue-500 to-cyan-500",
        };
      case "purple":
        return {
          bg: "bg-purple-500/10",
          text: "text-purple-600 dark:text-purple-400",
          gradient: "from-purple-500 to-pink-500",
        };
      case "amber":
        return {
          bg: "bg-amber-500/10",
          text: "text-amber-600 dark:text-amber-400",
          gradient: "from-amber-500 to-orange-500",
        };
      case "cyan":
        return {
          bg: "bg-cyan-500/10",
          text: "text-cyan-600 dark:text-cyan-400",
          gradient: "from-cyan-500 to-blue-500",
        };
      case "pink":
        return {
          bg: "bg-pink-500/10",
          text: "text-pink-600 dark:text-pink-400",
          gradient: "from-pink-500 to-rose-500",
        };
      default:
        return {
          bg: "bg-gray-500/10",
          text: "text-gray-600 dark:text-gray-400",
          gradient: "from-gray-500 to-gray-600",
        };
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case "critical":
        return "text-red-500 bg-red-500/10";
      case "high":
        return "text-amber-500 bg-amber-500/10";
      case "medium":
        return "text-blue-500 bg-blue-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const toggleKPI = (id) => {
    setVisibleKPIs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectedKPI = kpis.find((k) => k.id === selectedMetric);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            <Target size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Advanced KPI Metrics</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customizable performance indicators</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <Settings size={16} />
          </button>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {kpis.map((kpi) => {
          const colors = getColorClasses(kpi.color);
          const Icon = kpi.icon;
          const progress = (kpi.current / kpi.target) * 100;

          return (
            <div
              key={kpi.id}
              onClick={() => setSelectedMetric(kpi.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${visibleKPIs[kpi.id] ? "bg-white dark:bg-gray-800" : "opacity-60 bg-gray-50 dark:bg-gray-900"}`}
            >
              <div className="flex justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${colors.bg} ${colors.text}`}>
                    <Icon size={14} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleKPI(kpi.id);
                    }}
                  >
                    {visibleKPIs[kpi.id] ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getImportanceColor(kpi.importance)}`}>{kpi.importance.toUpperCase()}</span>
              </div>

              <div className="text-2xl font-bold">
                {kpi.current}
                {["conversion", "engagement", "retention"].includes(kpi.id) && "%"}
              </div>

              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${colors.gradient}`} style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected KPI Details */}
      {selectedKPI && (
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">{selectedKPI.name} Analysis</h4>
          <p className="text-sm text-gray-500">Goal achievement: {((selectedKPI.current / selectedKPI.target) * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
};

export const RealTimeActivity = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "purchase",
      user: "Alex Johnson",
      action: "purchased",
      item: "E-commerce Template",
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      location: "New York, US",
      value: 49,
    },
    {
      id: 2,
      type: "like",
      user: "Maria Garcia",
      action: "liked",
      item: "Your React Tutorial",
      timestamp: new Date(Date.now() - 4 * 60 * 1000),
      location: "Madrid, ES",
    },
    {
      id: 3,
      type: "download",
      user: "Tech Startup Inc",
      action: "downloaded",
      item: "Business Dashboard",
      timestamp: new Date(Date.now() - 7 * 60 * 1000),
      location: "San Francisco, US",
    },
    {
      id: 4,
      type: "rating",
      user: "Sarah Wilson",
      action: "rated",
      item: "Mobile Banking App",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      location: "London, UK",
      value: 5,
    },
    {
      id: 5,
      type: "comment",
      user: "John Smith",
      action: "commented on",
      item: "UI/UX Trends Article",
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      location: "Toronto, CA",
    },
  ]);

  const [isLive, setIsLive] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const wsRef = (useRef < WebSocket) | (null > null);

  const getActivityIcon = (type) => {
    switch (type) {
      case "purchase":
        return ShoppingCart;
      case "like":
        return Heart;
      case "comment":
        return MessageCircle;
      case "download":
        return Download;
      case "view":
        return Eye;
      case "follow":
        return UserPlus;
      case "rating":
        return Star;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "purchase":
        return "text-emerald-500 bg-emerald-500/10";
      case "like":
        return "text-pink-500 bg-pink-500/10";
      case "comment":
        return "text-blue-500 bg-blue-500/10";
      case "download":
        return "text-purple-500 bg-purple-500/10";
      case "view":
        return "text-amber-500 bg-amber-500/10";
      case "follow":
        return "text-cyan-500 bg-cyan-500/10";
      case "rating":
        return "text-yellow-500 bg-yellow-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const simulateNewActivity = () => {
    const newEvent = {
      id: activities.length + 1,
      type: ["purchase", "like", "comment", "download"][Math.floor(Math.random() * 4)],
      user: ["Emma Davis", "Michael Brown", "Sophia Lee", "David Wilson"][Math.floor(Math.random() * 4)],
      action: ["purchased", "liked", "commented on", "downloaded"][Math.floor(Math.random() * 4)],
      item: ["Premium Template", "Design System", "API Documentation", "Mobile App"][Math.floor(Math.random() * 4)],
      timestamp: new Date(),
      location: ["Berlin, DE", "Tokyo, JP", "Sydney, AU", "Paris, FR"][Math.floor(Math.random() * 4)],
      value: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 20 : undefined,
    };

    setActivities((prev) => [newEvent, ...prev.slice(0, 9)]); // Keep only last 10
  };

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of new activity
        simulateNewActivity();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const toggleLive = () => {
    setIsLive(!isLive);
    setConnectionStatus(isLive ? "disconnected" : "connecting");

    setTimeout(() => {
      setConnectionStatus(isLive ? "disconnected" : "connected");
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <Activity size={20} />
            </div>
            {isLive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                <div className="w-full h-full bg-red-500 rounded-full animate-ping" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Real-time Activity Stream</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className={`flex items-center gap-1 ${connectionStatus === "connected" ? "text-emerald-500" : connectionStatus === "connecting" ? "text-amber-500" : "text-red-500"}`}>
                {connectionStatus === "connected" ? (
                  <>
                    <Wifi size={12} />
                    <span>Live connected</span>
                  </>
                ) : connectionStatus === "connecting" ? (
                  <>
                    <Zap size={12} />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={12} />
                    <span>Disconnected</span>
                  </>
                )}
              </span>
              <span className="text-gray-500 dark:text-gray-400">•</span>
              <span className="text-gray-500 dark:text-gray-400">{activities.length} activities in stream</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLive}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isLive ? "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            {isLive ? "Pause" : "Go Live"}
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClasses = getActivityColor(activity.type);

          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all group animate-in slide-in-from-right-2">
              <div className={`p-2 rounded-lg ${colorClasses}`}>
                <Icon size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-medium text-gray-700 dark:text-gray-300">{activity.item}</span>
                      {activity.value && <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">${activity.value}</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Globe size={10} />
                        {activity.location}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={10} />
                        {formatTime(activity.timestamp)}
                      </div>
                    </div>
                  </div>

                  {activity.type === "purchase" && <div className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white">+{activity.value}</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">{activities.filter((a) => a.type === "purchase").length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Purchases Today</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">{activities.filter((a) => a.type === "download").length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">{activities.filter((a) => a.type === "like").length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">{activities.reduce((sum, a) => sum + (a.value || 0), 0)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Revenue Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PredictiveAnalytics = () => {
  const [timeRange, setTimeRange] = useState("next_quarter");
  const [forecastData, setForecastData] = useState([
    { month: "Jan", actual: 4200, forecast: 4500, lower: 4100, upper: 4900 },
    { month: "Feb", actual: 5100, forecast: 5300, lower: 5000, upper: 5600 },
    { month: "Mar", actual: 5800, forecast: 6100, lower: 5700, upper: 6500 },
    { month: "Apr", actual: 6200, forecast: 6500, lower: 6000, upper: 7000 },
    { month: "May", actual: null, forecast: 7200, lower: 6800, upper: 7600 },
    { month: "Jun", actual: null, forecast: 8100, lower: 7700, upper: 8500 },
    { month: "Jul", actual: null, forecast: 8900, lower: 8500, upper: 9300 },
  ]);

  const [metrics, setMetrics] = useState([
    { name: "Revenue", current: 6200, forecast: 8900, growth: 43.5, icon: DollarSign },
    { name: "Users", current: 24500, forecast: 35400, growth: 44.5, icon: Users },
    { name: "Downloads", current: 12400, forecast: 18700, growth: 50.8, icon: Download },
    { name: "Engagement", current: 78, forecast: 89, growth: 14.1, icon: TrendingUp },
  ]);

  const calculateConfidence = (lower, upper, forecast) => {
    const range = upper - lower;
    const confidence = 100 - (range / forecast) * 100;
    return Math.max(60, Math.min(95, confidence));
  };

  const getGrowthColor = (growth) => {
    if (growth > 40) return "text-emerald-400";
    if (growth > 20) return "text-blue-400";
    if (growth > 0) return "text-amber-400";
    return "text-red-400";
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 85) return "bg-emerald-500";
    if (confidence > 75) return "bg-blue-500";
    if (confidence > 65) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Predictive Analytics</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered forecasting & trend analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
          >
            <option value="next_month">Next Month</option>
            <option value="next_quarter">Next Quarter</option>
            <option value="next_year">Next Year</option>
          </select>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <Filter size={16} />
          </button>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Forecast Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                  <Icon size={16} className="text-gray-600 dark:text-gray-400" />
                </div>
                <span className={`text-sm font-semibold ${getGrowthColor(metric.growth)}`}>+{metric.growth}%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{metric.forecast.toLocaleString()}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{metric.name} Forecast</div>
              <div className="mt-2 text-xs text-gray-400">Current: {metric.current.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      {/* Forecast Chart Visualization */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Revenue Forecast with Confidence Interval</h4>
          <div className="text-sm text-gray-500 dark:text-gray-400">Q2 2024 Projection</div>
        </div>

        <div className="relative h-48 w-full">
          {/* Background Grid */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border-t border-gray-200 dark:border-gray-700" />
            ))}
          </div>

          {/* Confidence Intervals & Forecast Line */}
          <div className="absolute inset-0 flex items-end">
            {forecastData.map((month, index) => {
              const confidence = calculateConfidence(month.lower, month.upper, month.forecast);

              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full px-1">
                  {/* Confidence Interval Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-purple-500/20 to-pink-500/10 rounded-t"
                    style={{
                      height: `${((month.upper - 4000) / 6000) * 100}%`,
                      marginBottom: `${((month.lower - 4000) / 6000) * 100}%`,
                    }}
                  />

                  {/* Forecast Point */}
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${getConfidenceColor(confidence)} transform -translate-y-1/2`} />
                    {month.actual && <div className="absolute w-2 h-2 rounded-full bg-gray-900 dark:bg-white transform -translate-y-1/2 -translate-x-1/2" />}
                  </div>

                  {/* Month Label */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">{month.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-gray-600 dark:text-gray-300">Forecast</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white" />
            <span className="text-gray-600 dark:text-gray-300">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-full h-2 rounded bg-gradient-to-t from-purple-500/20 to-pink-500/10" />
            <span className="text-gray-600 dark:text-gray-300">90% Confidence</span>
          </div>
        </div>
      </div>

      {/* Key Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ChevronUp className="text-emerald-500" size={16} />
            <h4 className="font-semibold text-gray-900 dark:text-white">Upside Potential</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Highest growth expected in mobile app downloads (projected +62%)</p>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">Confidence: 88%</div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ChevronDown className="text-amber-500" size={16} />
            <h4 className="font-semibold text-gray-900 dark:text-white">Watch Area</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">User retention may dip in Q3 based on seasonal patterns</p>
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">Confidence: 72%</div>
        </div>
      </div>
    </div>
  );
};

export const QuickStats = () => {
  const stats = [
    {
      label: "Today's Visitors",
      value: "2,458",
      change: "+12.5%",
      icon: Users,
      color: "blue",
    },
    {
      label: "Active Projects",
      value: "42",
      change: "+8.2%",
      icon: Package,
      color: "emerald",
    },
    {
      label: "Pending Reviews",
      value: "18",
      change: "-3.4%",
      icon: FileText,
      color: "amber",
    },
    {
      label: "Revenue Today",
      value: "$3,458",
      change: "+24.8%",
      icon: DollarSign,
      color: "purple",
    },
  ];

  // Color classes for Tailwind
  const colorClasses = {
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
    },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const colors = colorClasses[stat.color];

        return (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-sm font-medium ${stat.change.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export const RecentActivity = () => {
  const activities = [
    {
      user: "John Doe",
      action: "published a new project",
      time: "2 min ago",
      type: "project",
    },
    {
      user: "Sarah Smith",
      action: "commented on your blog",
      time: "5 min ago",
      type: "comment",
    },
    {
      user: "Mike Johnson",
      action: "downloaded your template",
      time: "12 min ago",
      type: "download",
    },
    {
      user: "Emma Wilson",
      action: "rated your project 5 stars",
      time: "18 min ago",
      type: "rating",
    },
    {
      user: "Alex Brown",
      time: "25 min ago",
      type: "follow",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recent Activity</h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors">View All</button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {activity.user.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-semibold">{activity.user}</span> {activity.action || "started following you"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PlatformInsights = () => {
  const insights = [
    {
      title: "Mobile Traffic Dominates",
      description: "68% of your traffic comes from mobile devices",
      icon: Smartphone,
      type: "info",
    },
    {
      title: "High Engagement Time",
      description: "Average session duration increased by 42%",
      icon: Clock,
      type: "success",
    },
    {
      title: "Conversion Rate Drop",
      description: "Check your recent project pricing strategy",
      icon: TrendingDown,
      type: "warning",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <Zap size={20} />
          </div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Platform Insights</h3>
        </div>
      </div>
      <div className="space-y-4">
        {insights.map((insight, index) => {
          let bgColor, textColor, iconBg;

          switch (insight.type) {
            case "success":
              bgColor = "bg-emerald-50 dark:bg-emerald-900/20";
              textColor = "text-emerald-600 dark:text-emerald-400";
              iconBg = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
              break;
            case "warning":
              bgColor = "bg-amber-50 dark:bg-amber-900/20";
              textColor = "text-amber-600 dark:text-amber-400";
              iconBg = "bg-amber-500/10 text-amber-600 dark:text-amber-400";
              break;
            default:
              bgColor = "bg-blue-50 dark:bg-blue-900/20";
              textColor = "text-blue-600 dark:text-blue-400";
              iconBg = "bg-blue-500/10 text-blue-600 dark:text-blue-400";
          }

          return (
            <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${bgColor} border ${textColor.replace("text-", "border-")}/20 transition-transform hover:scale-[1.02]`}>
              <div className={`p-2 rounded-lg ${iconBg} flex-shrink-0`}>
                <insight.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{insight.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TopContent = () => {
  const topProjects = [
    {
      title: "E-commerce Dashboard",
      views: 12500,
      revenue: 2400,
      growth: 24,
    },
    {
      title: "Mobile Banking App",
      views: 11200,
      revenue: 3200,
      growth: 18,
    },
    {
      title: "Portfolio Template",
      views: 8500,
      revenue: 1200,
      growth: 32,
    },
  ];

  const topBlogs = [
    {
      title: "React Best Practices 2024",
      views: 85000,
      comments: 240,
      growth: 42,
    },
    {
      title: "UI/UX Design Trends",
      views: 72000,
      comments: 180,
      growth: 28,
    },
    {
      title: "JavaScript Optimization",
      views: 68000,
      comments: 150,
      growth: 35,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Top Projects</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">This Month</span>
        </div>
        <div className="space-y-3">
          {topProjects.map((project, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">{project.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{project.views.toLocaleString()} views</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">${project.revenue.toLocaleString()}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">+{project.growth}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Blogs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Top Blogs</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">This Month</span>
        </div>
        <div className="space-y-3">
          {topBlogs.map((blog, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">{blog.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{blog.comments} comments</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">{(blog.views / 1000).toFixed(1)}k</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">+{blog.growth}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AchievementBadges = () => {
  const badges = [
    {
      name: "Content Creator",
      icon: FileText,
      progress: 85,
      unlocked: true,
    },
    {
      name: "Top Seller",
      icon: Trophy,
      progress: 100,
      unlocked: true,
    },
    {
      name: "Engagement Master",
      icon: Heart,
      progress: 72,
      unlocked: false,
    },
    {
      name: "Consistent Author",
      icon: Calendar,
      progress: 45,
      unlocked: false,
    },
    {
      name: "Quality Expert",
      icon: Award,
      progress: 90,
      unlocked: true,
    },
    {
      name: "Community Leader",
      icon: Users,
      progress: 68,
      unlocked: false,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Your Achievements</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">3/6 unlocked</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg text-center transition-all duration-300 hover:scale-105 ${
              badge.unlocked
                ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800 shadow-sm"
                : "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center transition-transform ${
                badge.unlocked ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
              }`}
            >
              <badge.icon size={24} />
            </div>
            <div className="font-medium text-gray-900 dark:text-white mb-1">{badge.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{badge.unlocked ? "Unlocked 🎉" : `${badge.progress}% to unlock`}</div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${badge.unlocked ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-gray-400 to-gray-500"}`}
                style={{ width: `${badge.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GeographicDistribution = () => {
  const countries = [
    {
      name: "United States",
      visitors: 12500,
      percentage: 42,
      growth: 12,
    },
    {
      name: "India",
      visitors: 8500,
      percentage: 28,
      growth: 24,
    },
    {
      name: "United Kingdom",
      visitors: 5200,
      percentage: 17,
      growth: 8,
    },
    {
      name: "Germany",
      visitors: 3200,
      percentage: 11,
      growth: 15,
    },
    {
      name: "Others",
      visitors: 1800,
      percentage: 6,
      growth: -2,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <Globe size={20} />
          </div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Audience Geography</h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Top 5 Countries</span>
      </div>
      <div className="space-y-4">
        {countries.map((country, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{country.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">{country.visitors.toLocaleString()}</span>
                <span className={`text-xs font-medium whitespace-nowrap ${country.growth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {country.growth >= 0 ? "+" : ""}
                  {country.growth}%
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${country.percentage}%` }} />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">{country.percentage}% of total traffic</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GoalsProgress = () => {
  const goals = [
    {
      label: "Monthly Revenue",
      target: 10000,
      current: 8500,
      color: "emerald",
    },
    {
      label: "New Projects",
      target: 20,
      current: 14,
      color: "blue",
    },
    {
      label: "Blog Posts",
      target: 12,
      current: 8,
      color: "purple",
    },
    {
      label: "User Engagement",
      target: 85,
      current: 72,
      color: "amber",
    },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case "emerald":
        return "from-emerald-500 to-emerald-600";
      case "blue":
        return "from-blue-500 to-blue-600";
      case "purple":
        return "from-purple-500 to-purple-600";
      case "amber":
        return "from-amber-500 to-amber-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Monthly Goals</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">Due in 12 days</span>
      </div>
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const percentage = (goal.current / goal.target) * 100;
          const gradientClass = getColorClasses(goal.color);

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900 dark:text-white">{goal.label}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${gradientClass} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${Math.min(percentage, 100)}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}% complete</span>
                <span
                  className={`font-medium ${percentage >= 100 ? "text-emerald-600 dark:text-emerald-400" : percentage >= 70 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {percentage >= 100 ? "Achieved! 🎉" : `${goal.target - goal.current} to go`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</span>
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">72.5%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: "72.5%" }} />
        </div>
      </div>
    </div>
  );
};

export const AIInsights = () => {
  const [insights, setInsights] = useState([
    {
      id: 1,
      title: "Content Optimization Opportunity",
      description: "Your React tutorial has 85% completion rate. Consider creating an advanced follow-up.",
      type: "opportunity",
      confidence: 92,
      action: "Create Advanced Course",
      impact: "high",
    },
    {
      id: 2,
      title: "Revenue Growth Prediction",
      description: "Based on current trends, you're projected to grow by 34% next quarter.",
      type: "prediction",
      confidence: 87,
      action: "Scale Marketing",
      impact: "medium",
    },
    {
      id: 3,
      title: "Audience Engagement Alert",
      description: "Mobile engagement dropped 12% this week. Check responsive design issues.",
      type: "alert",
      confidence: 78,
      action: "Audit Mobile UX",
      impact: "critical",
    },
  ]);

  const [feedback, setFeedback] = useState({});

  const handleFeedback = (id, helpful) => {
    setFeedback((prev) => ({ ...prev, [id]: helpful }));
  };

  const refreshInsights = () => {
    // In real app, this would fetch new insights from API
    console.log("Refreshing AI insights...");
  };

  const getInsightColor = (type) => {
    switch (type) {
      case "opportunity":
        return "bg-gradient-to-r from-emerald-500 to-teal-500";
      case "prediction":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "alert":
        return "bg-gradient-to-r from-amber-500 to-orange-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "high":
        return "text-emerald-600 dark:text-emerald-400";
      case "critical":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <Brain size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">AI Insights & Recommendations</h3>
            <p className="text-sm text-gray-300">Powered by machine learning algorithms</p>
          </div>
        </div>
        <button onClick={refreshInsights} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getInsightColor(insight.type)}`} />
                <span className="text-sm font-semibold text-white">{insight.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getImpactColor(insight.impact)} bg-white/10`}>{insight.impact.toUpperCase()}</span>
                <span className="text-xs text-gray-300">{insight.confidence}% confidence</span>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4">{insight.description}</p>

            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-4 py-2 rounded-lg transition-all group-hover:scale-[1.02]">
                {insight.action}
                <ChevronRight size={16} />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Was this helpful?</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleFeedback(insight.id, true)}
                    className={`p-1.5 rounded hover:bg-emerald-500/20 ${feedback[insight.id] === true ? "bg-emerald-500/30 text-emerald-400" : "text-gray-400"}`}
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button
                    onClick={() => handleFeedback(insight.id, false)}
                    className={`p-1.5 rounded hover:bg-red-500/20 ${feedback[insight.id] === false ? "bg-red-500/30 text-red-400" : "text-gray-400"}`}
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-300">
            <Zap size={14} className="inline mr-2 text-amber-400" />
            Next insight update in: <span className="font-semibold text-white">2h 15m</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-gray-300">Opportunity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-gray-300">Prediction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-gray-300">Alert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
