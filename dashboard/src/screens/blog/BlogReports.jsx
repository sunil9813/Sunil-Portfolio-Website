import { DateFormatter } from "@/components/common/DateFormatter";
import { Wrapper } from "@/routes";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaExternalLinkAlt, FaFlag, FaSearch } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const statusOptions = ["new", "reviewing", "fixed", "ignored"];

const statusStyle = {
  new: "bg-rose-300/[0.08] text-rose-700 dark:text-rose-100/70",
  reviewing: "bg-amber-300/[0.08] text-amber-700 dark:text-amber-100/70",
  fixed: "bg-emerald-300/[0.08] text-emerald-700 dark:text-emerald-100/70",
  ignored: "bg-white/[0.045] text-gray-500 dark:text-white/45",
};

export const BlogReports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const fetchReports = () => {
    setIsLoading(true);
    axios
      .get(`${REACT_APP_BACKEND_URL}/blog/admin/reports`, { withCredentials: true })
      .then((response) => {
        setReports(response.data?.reports || []);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error || "Could not load blog reports.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return reports;

    return reports.filter((report) =>
      [report.message, report.email, report.name, report.status, report.blog?.title, report.user?.name, report.user?.email].some((value) => String(value || "").toLowerCase().includes(term)),
    );
  }, [reports, searchTerm]);

  const handleStatusChange = async (reportId, status) => {
    try {
      setUpdatingId(reportId);
      const response = await axios.patch(`${REACT_APP_BACKEND_URL}/blog/admin/reports/${reportId}`, { status }, { withCredentials: true });
      setReports((currentReports) => currentReports.map((report) => (report._id === reportId ? response.data?.report || { ...report, status } : report)));
      toast.success("Report status updated.");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Could not update report.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <section className="space-y-4">
      <Wrapper className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-rose-500/[0.03] blur-[90px]" />
        <div className="relative z-10">
          <span className="inline-flex rounded-full border border-rose-300/[0.12] bg-rose-300/[0.05] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-100/65">
            Quality control
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-gray-900 dark:text-white/90">Blog reports & edit suggestions</h1>
          <p className="mt-1 max-w-2xl text-xs leading-6 text-gray-500 dark:text-white/35">Review reader-submitted corrections, bugs, outdated content, and improvement ideas.</p>
        </div>
      </Wrapper>

      <Wrapper className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25" size={12} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search report, blog, status..."
              className="h-11 w-full rounded-full border border-gray-200/70 bg-gray-50/60 pl-10 pr-4 text-xs outline-none transition focus:border-rose-300/40 dark:border-white/[0.055] dark:bg-white/[0.025] dark:text-white/70"
            />
          </div>
          <span className="rounded-full border border-white/[0.055] bg-white/[0.035] px-4 py-2 text-[10px] font-semibold text-gray-500 dark:text-white/45">{filteredReports.length} reports</span>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <Wrapper className="p-8 text-center text-xs text-gray-500 dark:text-white/35">Loading reports...</Wrapper>
          ) : filteredReports.length ? (
            filteredReports.map((report) => (
              <article key={report._id} className="rounded-2xl border border-gray-200/70 bg-gray-50/50 p-4 dark:border-white/[0.055] dark:bg-white/[0.018]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex size-9 items-center justify-center rounded-full bg-rose-300/[0.08] text-rose-700 dark:text-rose-100/70">
                        <FaFlag size={12} />
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-semibold capitalize ${statusStyle[report.status || "new"]}`}>{report.status || "new"}</span>
                      <span className="text-[10px] text-gray-400 dark:text-white/30">
                        <DateFormatter date={report.createdAt} />
                      </span>
                    </div>

                    <h2 className="mt-3 line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white/85">{report.blog?.title || "Blog unavailable"}</h2>
                    <p className="mt-2 text-xs leading-6 text-gray-600 dark:text-white/55">{report.message}</p>
                    <p className="mt-3 text-[10px] text-gray-400 dark:text-white/30">
                      Sent by {report.user?.name || report.name || "Reader"} {report.email || report.user?.email ? `• ${report.email || report.user?.email}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {report.blog?.slug && (
                      <NavLink
                        to={`/view-blog/${report.blog.slug}`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/[0.055] bg-white/[0.035] px-4 text-[10px] font-semibold text-gray-600 transition hover:-translate-y-0.5 hover:bg-white/[0.06] dark:text-white/60"
                      >
                        <FaExternalLinkAlt size={10} />
                        Open
                      </NavLink>
                    )}

                    <select
                      value={report.status || "new"}
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
                    {report.status === "fixed" && <FaCheckCircle className="text-emerald-500" size={15} />}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <Wrapper className="p-8 text-center text-xs text-gray-500 dark:text-white/35">No reports found.</Wrapper>
          )}
        </div>
      </Wrapper>
    </section>
  );
};
