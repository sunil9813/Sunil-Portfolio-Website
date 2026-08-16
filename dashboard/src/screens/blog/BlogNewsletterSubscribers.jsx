import { DateFormatter } from "@/components/common/DateFormatter";
import { Wrapper } from "@/routes";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FaDownload, FaEnvelope, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

const csvEscape = (value = "") => `"${String(value).replace(/"/g, '""')}"`;

export const BlogNewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${REACT_APP_BACKEND_URL}/blog/admin/newsletter`, { withCredentials: true })
      .then((response) => {
        setSubscribers(response.data?.subscribers || []);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error || "Could not load newsletter subscribers.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredSubscribers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return subscribers;

    return subscribers.filter((subscriber) => [subscriber.email, subscriber.name, subscriber.source].some((value) => String(value || "").toLowerCase().includes(term)));
  }, [searchTerm, subscribers]);

  const handleExport = () => {
    const header = ["Email", "Name", "Source", "Active", "Subscribed At"];
    const rows = filteredSubscribers.map((subscriber) => [
      subscriber.email,
      subscriber.name,
      subscriber.source,
      subscriber.isActive ? "Active" : "Inactive",
      subscriber.createdAt,
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "newsletter-subscribers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-4">
      <Wrapper className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-cyan-500/[0.035] blur-[90px]" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-cyan-300/[0.12] bg-cyan-300/[0.05] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-100/65">
              Newsletter
            </span>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-gray-900 dark:text-white/90">Newsletter subscribers</h1>
            <p className="mt-1 max-w-2xl text-xs leading-6 text-gray-500 dark:text-white/35">People who subscribed from your blog detail pages and website forms.</p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-5 text-xs font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:bg-white/[0.07] dark:text-white/70"
          >
            <FaDownload size={12} />
            Export CSV
          </button>
        </div>
      </Wrapper>

      <Wrapper className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25" size={12} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search email, name, or source..."
              className="h-11 w-full rounded-full border border-gray-200/70 bg-gray-50/60 pl-10 pr-4 text-xs outline-none transition focus:border-cyan-300/40 dark:border-white/[0.055] dark:bg-white/[0.025] dark:text-white/70"
            />
          </div>
          <span className="rounded-full border border-white/[0.055] bg-white/[0.035] px-4 py-2 text-[10px] font-semibold text-gray-500 dark:text-white/45">
            {filteredSubscribers.length} subscribers
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200/70 dark:border-white/[0.055]">
          <div className="grid grid-cols-[minmax(220px,1.2fr)_minmax(120px,.7fr)_minmax(120px,.6fr)_minmax(120px,.6fr)] bg-gray-50/70 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:bg-white/[0.025] dark:text-white/35">
            <span>Email</span>
            <span>Source</span>
            <span>Status</span>
            <span>Joined</span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-gray-500 dark:text-white/35">Loading subscribers...</div>
          ) : filteredSubscribers.length ? (
            filteredSubscribers.map((subscriber) => (
              <article
                key={subscriber._id || subscriber.email}
                className="grid grid-cols-[minmax(220px,1.2fr)_minmax(120px,.7fr)_minmax(120px,.6fr)_minmax(120px,.6fr)] items-center gap-3 border-t border-gray-200/70 px-4 py-3 text-xs dark:border-white/[0.045]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cyan-300/[0.08] text-cyan-700 dark:text-cyan-100/70">
                    <FaEnvelope size={12} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-gray-800 dark:text-white/75">{subscriber.email}</span>
                    {subscriber.name && <span className="mt-0.5 block truncate text-[10px] text-gray-400 dark:text-white/30">{subscriber.name}</span>}
                  </span>
                </span>
                <span className="truncate text-gray-500 dark:text-white/40">{subscriber.source || "website"}</span>
                <span className="w-fit rounded-full bg-emerald-300/[0.08] px-3 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-100/70">
                  {subscriber.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-gray-500 dark:text-white/40">
                  <DateFormatter date={subscriber.createdAt} />
                </span>
              </article>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-gray-500 dark:text-white/35">No subscribers found.</div>
          )}
        </div>
      </Wrapper>
    </section>
  );
};
