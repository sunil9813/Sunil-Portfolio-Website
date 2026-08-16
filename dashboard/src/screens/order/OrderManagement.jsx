import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FaDownload, FaEnvelopeOpenText, FaExclamationTriangle, FaFileInvoice, FaRegEye, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";

const statusOptions = ["all", "unpaid", "pending", "paid", "failed", "cancelled", "refunded"];
const gatewayOptions = ["all", "stripe", "esewa", "coupon", "manual"];
const refundOptions = ["all", "none", "requested", "approved", "rejected", "refunded"];

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en", { maximumFractionDigits: 2 })}`;
const formatDate = (value) => (value ? new Date(value).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" }) : "-");

export const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [paymentEvents, setPaymentEvents] = useState([]);
  const [paymentEventStatus, setPaymentEventStatus] = useState("all");
  const [status, setStatus] = useState("all");
  const [gateway, setGateway] = useState("all");
  const [refundStatus, setRefundStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [resendingId, setResendingId] = useState("");

  const paidRevenue = useMemo(() => orders.filter((order) => order.status === "paid").reduce((total, order) => total + Number(order.amount || 0), 0), [orders]);

  const fetchOrders = async () => {
    setIsLoading(true);
    const response = await axios.get(`${REACT_APP_BACKEND_URL}/order/admin/orders`, {
      params: { status, gateway, refundStatus, dateFrom, dateTo, search },
    });
    setOrders(response.data?.orders || []);
    setIsLoading(false);
  };

  const fetchPaymentEvents = async () => {
    const provider = ["stripe", "esewa"].includes(gateway) ? gateway : "all";
    const response = await axios.get(`${REACT_APP_BACKEND_URL}/business/admin/payment-events`, {
      params: { provider, status: paymentEventStatus },
    });
    setPaymentEvents(response.data?.events || []);
  };

  useEffect(() => {
    fetchOrders();
    fetchPaymentEvents();
  }, [status, gateway, refundStatus, paymentEventStatus]);

  const handleResendInvoice = async (orderId) => {
    try {
      setResendingId(orderId);
      await axios.post(`${REACT_APP_BACKEND_URL}/business/invoice/${orderId}/resend`);
      toast.success("Invoice email resent.");
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to resend invoice.");
    } finally {
      setResendingId("");
    }
  };

  const paymentEventsExportProvider = ["stripe", "esewa"].includes(gateway) ? `?provider=${gateway}` : "";
  const paymentEventsExportStatus = paymentEventStatus !== "all" ? `${paymentEventsExportProvider ? "&" : "?"}status=${paymentEventStatus}` : "";
  const paymentEventsExportUrl = `${REACT_APP_BACKEND_URL}/business/admin/export/payment-events.csv${paymentEventsExportProvider}${paymentEventsExportStatus}`;
  const emailPreviewUrl = (template) => `${REACT_APP_BACKEND_URL}/business/admin/email-preview/${template}`;

  const handleStatusUpdate = async (orderId, nextStatus) => {
    try {
      setUpdatingId(orderId);
      await axios.patch(`${REACT_APP_BACKEND_URL}/order/admin/${orderId}/status`, {
        status: nextStatus,
        paymentMethod: "manual",
      });
      toast.success("Order status updated.");
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Unable to update order.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200/70 bg-light-surface2 p-5 dark:border-white/[0.055] dark:bg-dark-surface2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">Orders</p>
          <h2 className="mt-2 text-2xl font-black text-gray-900 dark:text-white/90">{orders.length}</h2>
        </div>
        <div className="rounded-3xl border border-gray-200/70 bg-light-surface2 p-5 dark:border-white/[0.055] dark:bg-dark-surface2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">Paid revenue</p>
          <h2 className="mt-2 text-2xl font-black text-gray-900 dark:text-white/90">{money(paidRevenue)}</h2>
        </div>
        <div className="rounded-3xl border border-gray-200/70 bg-light-surface2 p-5 dark:border-white/[0.055] dark:bg-dark-surface2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">Pending</p>
          <h2 className="mt-2 text-2xl font-black text-gray-900 dark:text-white/90">{orders.filter((order) => ["pending", "unpaid"].includes(order.status)).length}</h2>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200/70 bg-light-surface2 p-5 dark:border-white/[0.055] dark:bg-dark-surface2">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white/90">Order Management</h1>
            <p className="mt-1 text-xs text-gray-500 dark:text-white/35">Search, filter, verify, refund, or cancel customer orders.</p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-6">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search email, order, item, coupon" className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75 xl:col-span-2" />
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75">
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select value={gateway} onChange={(event) => setGateway(event.target.value)} className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75">
              {gatewayOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "all gateways" : option}
                </option>
              ))}
            </select>
            <select value={refundStatus} onChange={(event) => setRefundStatus(event.target.value)} className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75">
              {refundOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "all refunds" : option}
                </option>
              ))}
            </select>
            <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
            <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
            <button type="button" onClick={fetchOrders} className="h-11 rounded-xl bg-teal-600 px-5 text-xs font-bold text-white">
              Search
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-xs">
            <thead className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-white/30">
              <tr className="border-b border-gray-200/70 dark:border-white/[0.055]">
                <th className="py-3">Order</th>
                <th>User</th>
                <th>Items</th>
                <th>Total</th>
                <th>Discount</th>
                <th>Gateway</th>
                <th>Refund</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-500 dark:text-white/35">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-500 dark:text-white/35">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-200/70 dark:border-white/[0.045]">
                    <td className="py-4 font-bold text-gray-900 dark:text-white/80">{order.paymentInfo?.id || order._id}</td>
                    <td>
                      <p className="font-semibold text-gray-800 dark:text-white/70">{order.user?.name || "User"}</p>
                      <p className="text-[10px] text-gray-400 dark:text-white/30">{order.user?.email}</p>
                    </td>
                    <td>{order.orderItems?.length || 0}</td>
                    <td>{money(order.amount)}</td>
                    <td>
                      {Number(order.discountAmount || 0) > 0 ? (
                        <span className="rounded-lg border border-emerald-300/20 bg-emerald-500/[0.07] px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:border-emerald-300/[0.09] dark:text-emerald-100/70">
                          -{money(order.discountAmount)}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-white/25">-</span>
                      )}
                    </td>
                    <td>{order.paymentInfo?.method || "-"}</td>
                    <td>
                      <span className="rounded-lg border border-gray-200/70 bg-white/45 px-2.5 py-1 text-[10px] font-bold capitalize text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/35">
                        {order.refund?.status || "none"}
                      </span>
                    </td>
                    <td>
                      <span className="rounded-lg bg-teal-500/[0.08] px-2.5 py-1 text-[10px] font-bold text-teal-700 dark:text-teal-200/75">{order.status}</span>
                    </td>
                    <td>
                      <div className="flex flex-wrap items-center gap-2">
                        <select disabled={updatingId === order._id} value={order.status} onChange={(event) => handleStatusUpdate(order._id, event.target.value)} className="h-9 rounded-xl border border-gray-200/70 bg-white/70 px-3 text-[10px] outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75">
                          {statusOptions.filter((option) => option !== "all").map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <a href={`${REACT_APP_BACKEND_URL}/business/invoice/${order._id}`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-xl border border-teal-300/20 bg-teal-500/[0.08] px-3 text-[10px] font-bold text-teal-700 hover:bg-teal-500/[0.13] dark:border-teal-300/[0.10] dark:text-teal-100/70">
                          <FaFileInvoice />
                          Invoice
                        </a>
                        <a href={`${REACT_APP_BACKEND_URL}/business/invoice/${order._id}?format=pdf`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.08] px-3 text-[10px] font-bold text-indigo-700 hover:bg-indigo-500/[0.13] dark:border-indigo-300/[0.10] dark:text-indigo-100/70">
                          <FaDownload />
                          PDF
                        </a>
                        <a href={`${REACT_APP_BACKEND_URL}/business/invoice/verify/${order._id}`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-500/[0.08] px-3 text-[10px] font-bold text-emerald-700 hover:bg-emerald-500/[0.13] dark:border-emerald-300/[0.10] dark:text-emerald-100/70">
                          <FaShieldAlt />
                          Verify
                        </a>
                        <button type="button" disabled={resendingId === order._id} onClick={() => handleResendInvoice(order._id)} className="inline-flex h-9 items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-500/[0.08] px-3 text-[10px] font-bold text-cyan-700 hover:bg-cyan-500/[0.13] disabled:cursor-not-allowed disabled:opacity-60 dark:border-cyan-300/[0.10] dark:text-cyan-100/70">
                          <FaEnvelopeOpenText />
                          {resendingId === order._id ? "Sending" : "Email"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200/70 bg-light-surface2 p-5 dark:border-white/[0.055] dark:bg-dark-surface2">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/80 dark:text-cyan-200/55">Email previews</p>
            <h2 className="mt-1 text-lg font-black text-gray-900 dark:text-white/85">Preview transactional templates</h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-white/35">Open a safe browser preview before sending invoice, refund, or payment alert emails.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              ["invoice", "Invoice email"],
              ["refund", "Refund email"],
              ["payment_failed", "Payment alert"],
            ].map(([template, label]) => (
              <a key={template} href={emailPreviewUrl(template)} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-[10px] font-bold text-gray-600 hover:bg-white/[0.08] dark:text-white/55">
                <FaRegEye />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200/70 bg-light-surface2 p-5 dark:border-white/[0.055] dark:bg-dark-surface2">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-500/80 dark:text-teal-200/55">Payment audit</p>
            <h2 className="mt-1 text-lg font-black text-gray-900 dark:text-white/85">Recent gateway events</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["all", "failed", "processed", "received", "warning"].map((option) => (
              <button key={option} type="button" onClick={() => setPaymentEventStatus(option)} className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[10px] font-bold uppercase tracking-wider ${paymentEventStatus === option ? "bg-rose-500/[0.12] text-rose-700 ring-1 ring-rose-400/20 dark:text-rose-100/75" : "border border-gray-200/70 bg-white/60 text-gray-500 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/40"}`}>
                {option === "failed" && <FaExclamationTriangle />}
                {option}
              </button>
            ))}
            <a href={paymentEventsExportUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-xl border border-teal-300/20 bg-teal-500/[0.08] px-4 text-[10px] font-bold text-teal-700 dark:border-teal-300/[0.10] dark:text-teal-100/70">
              Export CSV
            </a>
            <button type="button" onClick={fetchPaymentEvents} className="h-10 rounded-xl border border-gray-200/70 bg-white/60 px-4 text-[10px] font-bold text-gray-600 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/45">
              Refresh
            </button>
          </div>
        </div>
        <div className="grid gap-2">
          {paymentEvents.length > 0 ? (
            paymentEvents.slice(0, 8).map((event) => (
              <div key={event._id} className="grid gap-2 rounded-2xl border border-gray-200/70 bg-white/45 p-3 text-xs dark:border-white/[0.05] dark:bg-white/[0.018] md:grid-cols-[110px_90px_1fr_150px_120px]">
                <span className="font-black uppercase tracking-widest text-gray-500 dark:text-white/45">{event.provider}</span>
                <span className={`rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${event.status === "failed" ? "bg-rose-500/[0.10] text-rose-700 dark:text-rose-100/70" : event.status === "processed" ? "bg-emerald-500/[0.10] text-emerald-700 dark:text-emerald-100/70" : "bg-white/50 text-gray-500 dark:bg-white/[0.035] dark:text-white/35"}`}>{event.status || "received"}</span>
                <span className="truncate font-semibold text-gray-800 dark:text-white/70" title={event.message || event.type || event.eventId}>{event.message || event.type || event.eventId}</span>
                <span className="text-gray-500 dark:text-white/35">{event.order?.user?.email || event.order?._id || "-"}</span>
                <span className="text-right text-gray-400 dark:text-white/30">{formatDate(event.createdAt || event.processedAt)}</span>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-gray-200/70 p-5 text-center text-xs text-gray-500 dark:border-white/[0.06] dark:text-white/35">No payment gateway events recorded yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};
