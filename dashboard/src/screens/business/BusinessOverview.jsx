import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";

const formatCurrency = (amount = 0) => `Rs. ${Number(amount || 0).toLocaleString()}`;
const formatDate = (date) => (date ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date)) : "-");

export const BusinessOverview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [abandonedCarts, setAbandonedCarts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [analyticsResponse, downloadsResponse, auditResponse, abandonedResponse] = await Promise.all([
          axios.get(`${REACT_APP_BACKEND_URL}/business/admin/analytics`),
          axios.get(`${REACT_APP_BACKEND_URL}/business/admin/downloads`),
          axios.get(`${REACT_APP_BACKEND_URL}/business/admin/audit-logs`),
          axios.get(`${REACT_APP_BACKEND_URL}/business/admin/abandoned-carts`),
        ]);
        setAnalytics(analyticsResponse.data?.analytics || {});
        setDownloads(downloadsResponse.data?.downloads || []);
        setAuditLogs(auditResponse.data?.logs || []);
        setAbandonedCarts(abandonedResponse.data?.carts || []);
      } catch (error) {
        toast.error(error.response?.data?.error || "Unable to load business overview.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: "Total revenue", value: formatCurrency(analytics?.totalRevenue) },
    { label: "This month", value: formatCurrency(analytics?.monthlyRevenue) },
    { label: "Paid orders", value: analytics?.paidOrders || 0 },
    { label: "Unpaid orders", value: analytics?.unpaidOrders || 0 },
    { label: "Downloads", value: analytics?.downloadsCount || 0 },
    { label: "Pending reviews", value: analytics?.reviewsPending || 0 },
    { label: "Pending Q&A", value: analytics?.questionsPending || 0 },
    { label: "Open tickets", value: analytics?.ticketsOpen || 0 },
    { label: "Abandoned carts", value: analytics?.openAbandonedCarts || 0 },
    { label: "Conversion", value: `${analytics?.conversionRate || 0}%` },
  ];
  const maxMonthlyRevenue = Math.max(...(analytics?.monthlyRevenueSeries || []).map((item) => item.revenue), 1);

  if (isLoading) {
    return <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500">Loading business overview...</div>;
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">Business</p>
          <h1 className="mt-2 text-2xl font-black text-gray-950">Revenue & product overview</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`${REACT_APP_BACKEND_URL}/business/admin/export/orders.csv`} className="rounded-lg bg-teal-600 px-4 py-2 text-[10px] font-bold text-white">Export orders CSV</a>
          <a href={`${REACT_APP_BACKEND_URL}/business/admin/export/users.csv`} className="rounded-lg border border-gray-200 px-4 py-2 text-[10px] font-bold text-gray-700">Export users CSV</a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
            <p className="mt-2 text-xl font-black text-gray-950">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-gray-950">Monthly revenue</h2>
          <div className="mt-4 space-y-3">
            {(analytics?.monthlyRevenueSeries || []).map((item) => (
              <div key={item.month}>
                <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-gray-500">
                  <span>{item.month}</span>
                  <span>{formatCurrency(item.revenue)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-teal-500" style={{ width: `${(item.revenue / maxMonthlyRevenue) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-gray-950">Coupon performance</h2>
          <div className="mt-4 space-y-3">
            {(analytics?.couponPerformance || []).map((coupon) => (
              <div key={coupon.code} className="rounded-xl border border-gray-100 p-3 text-xs">
                <p className="font-black text-gray-800">{coupon.code}</p>
                <p className="mt-1 text-gray-500">{coupon.uses} uses · {formatCurrency(coupon.discount)} discount · {formatCurrency(coupon.revenue)} revenue</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-gray-950">Open abandoned carts</h2>
          <div className="mt-4 space-y-3">
            {abandonedCarts.slice(0, 8).map((cart) => (
              <div key={cart._id} className="rounded-xl border border-gray-100 p-3">
                <p className="text-xs font-bold text-gray-800">{cart.user?.email || "User"}</p>
                <p className="mt-1 text-[10px] text-gray-400">{cart.items?.length || 0} items · {formatCurrency(cart.subtotal)} · {formatDate(cart.updatedAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-gray-950">Best sellers</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="text-[10px] uppercase tracking-widest text-gray-400">
                <tr><th className="py-2">Product</th><th>Type</th><th>Sold</th><th>Revenue</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(analytics?.bestSellers || []).map((item) => (
                  <tr key={`${item.productModel}-${item.title}`}>
                    <td className="py-3 font-bold text-gray-800">{item.title}</td>
                    <td>{item.productModel}</td>
                    <td>{item.sold}</td>
                    <td>{formatCurrency(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-gray-950">Recent downloads</h2>
          <div className="mt-4 space-y-3">
            {downloads.slice(0, 8).map((download) => (
              <div key={download._id} className="rounded-xl border border-gray-100 p-3">
                <p className="text-xs font-bold text-gray-800">{download.title || "Download"}</p>
                <p className="mt-1 text-[10px] text-gray-400">{download.user?.email || "User"} · {formatDate(download.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-gray-950">Audit log</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="text-[10px] uppercase tracking-widest text-gray-400">
              <tr><th className="py-2">Action</th><th>Message</th><th>Actor</th><th>Date</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.slice(0, 20).map((log) => (
                <tr key={log._id}>
                  <td className="py-3 font-bold text-gray-800">{log.action}</td>
                  <td>{log.message || "-"}</td>
                  <td>{log.actor?.email || "System"}</td>
                  <td>{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
