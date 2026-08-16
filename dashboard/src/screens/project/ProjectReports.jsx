import { DateFormatter } from "@/components/common/DateFormatter";
import { Wrapper } from "@/routes";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FaChartLine, FaCheckCircle, FaDownload, FaExternalLinkAlt, FaFlag, FaGlobe, FaSearch, FaSyncAlt, FaUsers } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const statusOptions = ["pending", "resolved", "dismissed"];
const healthOptions = ["all", "Ready", "Needs polish", "Needs setup"];

const statusStyle = {
  pending: "bg-amber-300/[0.08] text-amber-700 dark:text-amber-100/70",
  resolved: "bg-emerald-300/[0.08] text-emerald-700 dark:text-emerald-100/70",
  dismissed: "bg-white/[0.045] text-gray-500 dark:text-white/45",
};

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-200/70 bg-gray-50/50 p-4 dark:border-white/[0.055] dark:bg-white/[0.018]">
    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-white/30">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white/85">{value}</p>
  </div>
);

const getHealthTone = (score = 0) => {
  if (score >= 90) return "bg-emerald-300/[0.08] text-emerald-700 dark:text-emerald-100/70";
  if (score >= 65) return "bg-amber-300/[0.08] text-amber-700 dark:text-amber-100/70";
  return "bg-rose-300/[0.08] text-rose-700 dark:text-rose-100/70";
};

const getDemoTone = (status = "unknown") => {
  if (status === "online") return "bg-emerald-300/[0.08] text-emerald-700 dark:text-emerald-100/70";
  if (status === "broken" || status === "timeout") return "bg-rose-300/[0.08] text-rose-700 dark:text-rose-100/70";
  return "bg-white/[0.045] text-gray-500 dark:text-white/42";
};

const formatCurrency = (amount = 0) => `Rs. ${Number(amount || 0).toLocaleString()}`;

const ProjectSalesChart = ({ rows = [] }) => {
  const chartRows = rows
    .slice()
    .sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0))
    .slice(0, 8)
    .map((project) => ({
      title: project.title?.length > 18 ? `${project.title.slice(0, 18)}...` : project.title,
      revenue: Number(project.revenue || 0),
      purchases: Number(project.purchases || 0),
    }));

  return (
    <Wrapper className="p-4">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-indigo-300/[0.08] text-indigo-700 dark:text-indigo-100/70">
            <FaChartLine size={13} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white/85">Project sales analytics</h2>
            <p className="text-[10px] text-gray-400 dark:text-white/30">Revenue and paid order comparison for your strongest projects.</p>
          </div>
        </div>
        <span className="rounded-full bg-white/[0.035] px-4 py-2 text-[10px] font-semibold text-gray-500 ring-1 ring-white/[0.045] dark:text-white/45">{chartRows.length} tracked</span>
      </div>

      <div className="h-[270px] rounded-2xl bg-white/[0.02] p-3 ring-1 ring-white/[0.035]">
        {chartRows.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartRows} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="title" tick={{ fontSize: 9, fill: "rgba(148,163,184,.75)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "rgba(148,163,184,.65)" }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(45,212,191,0.05)" }}
                contentStyle={{ borderRadius: 14, border: "1px solid rgba(255,255,255,.08)", background: "#111827", color: "#fff", fontSize: 11 }}
                formatter={(value, name) => (name === "revenue" ? [formatCurrency(value), "Revenue"] : [value, "Sales"])}
              />
              <Bar dataKey="revenue" fill="#2dd4bf" radius={[10, 10, 0, 0]} />
              <Bar dataKey="purchases" fill="#818cf8" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400 dark:text-white/30">No paid project sales yet.</div>
        )}
      </div>
    </Wrapper>
  );
};

export const ProjectReports = () => {
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [downloadLogs, setDownloadLogs] = useState([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const [healthFilter, setHealthFilter] = useState("all");
  const [checkingDemoId, setCheckingDemoId] = useState("");

  const fetchData = () => {
    setIsLoading(true);
    Promise.all([
      axios.get(`${REACT_APP_BACKEND_URL}/project/admin/reports`, { withCredentials: true }),
      axios.get(`${REACT_APP_BACKEND_URL}/project/admin/analytics`, { withCredentials: true }),
    ])
      .then(([reportsResponse, analyticsResponse]) => {
        setReports(reportsResponse.data?.reports || []);
        setAnalytics(analyticsResponse.data || null);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error || "Could not load project reports.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredReports = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return reports;

    return reports.filter((report) =>
      [report.message, report.issueType, report.status, report.project?.title, report.user?.name, report.user?.email, report.pageUrl].some((value) => String(value || "").toLowerCase().includes(term)),
    );
  }, [reports, searchTerm]);

  const topProjects = useMemo(() => {
    const projects = analytics?.projects || [];
    const filtered = healthFilter === "all" ? projects : projects.filter((project) => project.health?.status === healthFilter);
    return filtered.slice(0, 8);
  }, [analytics, healthFilter]);

  const handleStatusChange = async (reportId, status) => {
    try {
      setUpdatingId(reportId);
      const response = await axios.patch(`${REACT_APP_BACKEND_URL}/project/admin/reports/${reportId}`, { status }, { withCredentials: true });
      setReports((currentReports) => currentReports.map((report) => (report._id === reportId ? response.data?.report || { ...report, status } : report)));
      toast.success("Project report status updated.");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Could not update project report.");
    } finally {
      setUpdatingId("");
    }
  };

  const handleAccessToggle = async (buyer) => {
    if (!selectedProject?._id || !buyer?.user?._id) return;

    try {
      const revoked = !buyer.accessRevoked;
      await axios.patch(`${REACT_APP_BACKEND_URL}/project/admin/${selectedProject._id}/access/${buyer.user._id}`, { revoked }, { withCredentials: true });
      setBuyers((currentBuyers) => currentBuyers.map((item) => (item.user?._id === buyer.user?._id ? { ...item, accessRevoked: revoked } : item)));
      toast.success(revoked ? "Download access revoked." : "Download access restored.");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Could not update buyer access.");
    }
  };

  const fetchProjectAccess = async (project) => {
    if (!project?._id) return;

    try {
      setSelectedProject(project);
      setAccessLoading(true);
      const [buyersResponse, logsResponse] = await Promise.all([
        axios.get(`${REACT_APP_BACKEND_URL}/project/admin/${project._id}/buyers`, { withCredentials: true }),
        axios.get(`${REACT_APP_BACKEND_URL}/project/admin/${project._id}/downloads`, { withCredentials: true }),
      ]);

      setBuyers(buyersResponse.data?.buyers || []);
      setDownloadLogs(logsResponse.data?.logs || []);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Could not load project buyer data.");
    } finally {
      setAccessLoading(false);
    }
  };

  const handleDemoCheck = async (project) => {
    if (!project?._id) return;

    try {
      setCheckingDemoId(project._id);
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/project/admin/${project._id}/check-demo`, {}, { withCredentials: true });
      const demoStatus = response.data?.demoStatus;
      const health = response.data?.health;

      setAnalytics((current) => {
        if (!current?.projects) return current;
        return {
          ...current,
          projects: current.projects.map((item) => (item._id === project._id ? { ...item, demoStatus, health } : item)),
        };
      });
      setSelectedProject((current) => (current?._id === project._id ? { ...current, demoStatus, health } : current));
      toast.success(response.data?.message || "Demo link checked.");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Could not check demo link.");
    } finally {
      setCheckingDemoId("");
    }
  };

  return (
    <section className="space-y-4">
      <Wrapper className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-teal-500/[0.03] blur-[90px]" />
        <div className="relative z-10">
          <span className="inline-flex rounded-full border border-teal-300/[0.12] bg-teal-300/[0.05] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-100/65">
            Project quality
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-gray-900 dark:text-white/90">Project reports & analytics</h1>
          <p className="mt-1 max-w-2xl text-xs leading-6 text-gray-500 dark:text-white/35">Review broken links, wrong files, access issues, and monitor project performance.</p>
        </div>
      </Wrapper>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Views" value={analytics?.totals?.views || 0} />
        <StatCard label="Downloads" value={analytics?.totals?.downloads || 0} />
        <StatCard label="Comments" value={analytics?.totals?.comments || 0} />
        <StatCard label="Purchases" value={analytics?.totals?.purchases || 0} />
        <StatCard label="Revenue" value={`Rs. ${analytics?.totals?.revenue || 0}`} />
        <StatCard label="Pending reports" value={analytics?.totals?.pendingReports || 0} />
      </div>

      <ProjectSalesChart rows={analytics?.projects || []} />

      <Wrapper className="p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-teal-300/[0.08] text-teal-700 dark:text-teal-100/70">
              <FaChartLine size={13} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white/85">Top project performance</h2>
              <p className="text-[10px] text-gray-400 dark:text-white/30">Views, downloads, purchases, conversion, and launch health.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {healthOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setHealthFilter(option)}
                className={`rounded-full px-3 py-2 text-[9px] font-semibold capitalize transition ${
                  healthFilter === option ? "bg-teal-300/[0.12] text-teal-700 ring-1 ring-teal-300/[0.14] dark:text-teal-100/75" : "bg-white/[0.035] text-gray-500 ring-1 ring-white/[0.04] dark:text-white/38"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {topProjects.map((project) => (
            <article key={project._id} className="rounded-2xl border border-gray-200/70 bg-gray-50/50 p-4 dark:border-white/[0.055] dark:bg-white/[0.018]">
              <h3 className="line-clamp-2 min-h-10 text-xs font-semibold text-gray-900 dark:text-white/80">{project.title}</h3>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-gray-500 dark:text-white/40">
                <span>{project.numOfViews || 0} views</span>
                <span>{project.downloadCount || 0} downloads</span>
                <span>{project.purchases || 0} sales</span>
                <span>{project.conversionRate || 0}% conv.</span>
              </div>
              <div className="mt-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.035]">
                <div className="flex items-center justify-between gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${getHealthTone(project.health?.score)}`}>{project.health?.status || "Needs setup"}</span>
                  <span className="text-[10px] font-semibold text-gray-500 dark:text-white/45">{project.health?.score || 0}%</span>
                </div>
                {project.health?.missing?.length ? <p className="mt-2 line-clamp-2 text-[9px] leading-4 text-gray-400 dark:text-white/28">Missing: {project.health.missing.slice(0, 2).join(", ")}</p> : <p className="mt-2 text-[9px] text-emerald-600 dark:text-emerald-100/45">Ready for buyers.</p>}
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-white/[0.025] p-2 ring-1 ring-white/[0.035]">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-semibold capitalize ${getDemoTone(project.demoStatus?.status)}`}>
                  <FaGlobe size={9} />
                  {project.demoStatus?.status || "unknown"}
                </span>
                <button
                  type="button"
                  onClick={() => handleDemoCheck(project)}
                  disabled={checkingDemoId === project._id || !project.urllink}
                  className="inline-flex h-7 items-center gap-1 rounded-full bg-white/[0.045] px-2.5 text-[9px] font-semibold text-gray-500 ring-1 ring-white/[0.045] transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-45 dark:text-white/45"
                >
                  <FaSyncAlt className={checkingDemoId === project._id ? "animate-spin" : ""} size={9} />
                  Check
                </button>
              </div>
              <button
                type="button"
                onClick={() => fetchProjectAccess(project)}
                className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-full bg-white/[0.045] text-[10px] font-semibold text-gray-600 ring-1 ring-white/[0.05] transition hover:bg-teal-300/[0.08] dark:text-white/55"
              >
                Buyers & logs
              </button>
            </article>
          ))}
        </div>
      </Wrapper>

      <Wrapper className="p-4">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white/85">Buyers & download audit</h2>
            <p className="text-[10px] text-gray-400 dark:text-white/30">
              {selectedProject?.title ? `Showing access history for ${selectedProject.title}` : "Select a top project above to inspect purchases and downloads."}
            </p>
          </div>
          {selectedProject && <span className="rounded-full bg-teal-300/[0.08] px-4 py-2 text-[10px] font-semibold text-teal-700 dark:text-teal-100/65">{buyers.length} buyers</span>}
        </div>

        {accessLoading ? (
          <div className="rounded-2xl bg-white/[0.025] p-8 text-center text-xs text-gray-500 dark:text-white/35">Loading buyers and download logs...</div>
        ) : selectedProject ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-gray-200/70 bg-gray-50/50 p-4 dark:border-white/[0.055] dark:bg-white/[0.018]">
              <div className="mb-3 flex items-center gap-2">
                <FaUsers className="text-teal-500" size={13} />
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white/75">Purchased users</h3>
              </div>
              <div className="space-y-2">
                {buyers.length ? (
                  buyers.map((buyer) => (
                    <div key={`${buyer.orderId}-${buyer.user?._id || buyer.user?.email}`} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.035] p-3 text-[10px] ring-1 ring-white/[0.035]">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-800 dark:text-white/70">{buyer.user?.name || "User"}</p>
                        <p className="truncate text-gray-400 dark:text-white/30">{buyer.user?.email || "No email"}</p>
                      </div>
                      <div className="text-right text-gray-400 dark:text-white/35">
                        <p>Rs. {buyer.itemPrice || buyer.amount || 0}</p>
                        <p>
                          <DateFormatter date={buyer.paidAt} />
                        </p>
                        <button type="button" onClick={() => handleAccessToggle(buyer)} className={`mt-2 rounded-full px-3 py-1 text-[9px] font-semibold ${buyer.accessRevoked ? "bg-emerald-300/[0.08] text-emerald-700 dark:text-emerald-100/70" : "bg-rose-300/[0.08] text-rose-700 dark:text-rose-100/70"}`}>
                          {buyer.accessRevoked ? "Restore" : "Revoke"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl bg-white/[0.025] p-4 text-xs text-gray-400 dark:text-white/30">No paid buyers yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200/70 bg-gray-50/50 p-4 dark:border-white/[0.055] dark:bg-white/[0.018]">
              <div className="mb-3 flex items-center gap-2">
                <FaDownload className="text-indigo-500" size={13} />
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white/75">Download log</h3>
              </div>
              <div className="space-y-2">
                {downloadLogs.length ? (
                  downloadLogs.map((log) => (
                    <div key={log._id} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.035] p-3 text-[10px] ring-1 ring-white/[0.035]">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-800 dark:text-white/70">{log.user?.name || "User"}</p>
                        <p className="truncate text-gray-400 dark:text-white/30">{log.resourceLabel || log.resourceType || "Resource"}</p>
                      </div>
                      <div className="text-right text-gray-400 dark:text-white/35">
                        <p>{log.resourceType || "file"}</p>
                        <p>
                          <DateFormatter date={log.createdAt} />
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl bg-white/[0.025] p-4 text-xs text-gray-400 dark:text-white/30">No downloads recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Wrapper>

      <Wrapper className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25" size={12} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search project report, status, user..."
              className="h-11 w-full rounded-full border border-gray-200/70 bg-gray-50/60 pl-10 pr-4 text-xs outline-none transition focus:border-teal-300/40 dark:border-white/[0.055] dark:bg-white/[0.025] dark:text-white/70"
            />
          </div>
          <span className="rounded-full border border-white/[0.055] bg-white/[0.035] px-4 py-2 text-[10px] font-semibold text-gray-500 dark:text-white/45">{filteredReports.length} reports</span>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <Wrapper className="p-8 text-center text-xs text-gray-500 dark:text-white/35">Loading project reports...</Wrapper>
          ) : filteredReports.length ? (
            filteredReports.map((report) => (
              <article key={report._id} className="rounded-2xl border border-gray-200/70 bg-gray-50/50 p-4 dark:border-white/[0.055] dark:bg-white/[0.018]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex size-9 items-center justify-center rounded-full bg-rose-300/[0.08] text-rose-700 dark:text-rose-100/70">
                        <FaFlag size={12} />
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-semibold capitalize ${statusStyle[report.status || "pending"]}`}>{report.status || "pending"}</span>
                      <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-semibold capitalize text-gray-500 dark:text-white/45">{report.issueType || "other"}</span>
                      <span className="text-[10px] text-gray-400 dark:text-white/30">
                        <DateFormatter date={report.createdAt} />
                      </span>
                    </div>

                    <h2 className="mt-3 line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white/85">{report.project?.title || "Project unavailable"}</h2>
                    <p className="mt-2 text-xs leading-6 text-gray-600 dark:text-white/55">{report.message}</p>
                    <p className="mt-3 text-[10px] text-gray-400 dark:text-white/30">
                      Sent by {report.user?.name || "Visitor"} {report.user?.email ? `• ${report.user.email}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {report.project?.slug && (
                      <NavLink
                        to={`/view-project/${report.project.slug}`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/[0.055] bg-white/[0.035] px-4 text-[10px] font-semibold text-gray-600 transition hover:-translate-y-0.5 hover:bg-white/[0.06] dark:text-white/60"
                      >
                        <FaExternalLinkAlt size={10} />
                        Open
                      </NavLink>
                    )}

                    <select
                      value={report.status || "pending"}
                      disabled={updatingId === report._id}
                      onChange={(event) => handleStatusChange(report._id, event.target.value)}
                      className="h-10 rounded-full border border-gray-200/70 bg-white/70 px-4 text-[10px] font-semibold capitalize text-gray-600 outline-none dark:border-white/[0.055] dark:bg-white/[0.035] dark:text-white/60"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {report.status === "resolved" && <FaCheckCircle className="text-emerald-500" size={15} />}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <Wrapper className="p-8 text-center text-xs text-gray-500 dark:text-white/35">No project reports found.</Wrapper>
          )}
        </div>
      </Wrapper>
    </section>
  );
};
