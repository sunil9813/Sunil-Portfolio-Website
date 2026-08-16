import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaCheckCircle, FaClock, FaMoneyCheckAlt, FaTimesCircle } from "react-icons/fa";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";

const formatDate = (date) => (date ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date)) : "-");
const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en", { maximumFractionDigits: 2 })}`;

const refundStatuses = ["all", "requested", "approved", "rejected", "refunded"];

const refundStatusMeta = {
  requested: { label: "Requested", icon: <FaClock />, className: "border-amber-300/25 bg-amber-500/[0.10] text-amber-700 dark:border-amber-300/[0.10] dark:text-amber-100/75" },
  approved: { label: "Approved", icon: <FaCheckCircle />, className: "border-sky-300/25 bg-sky-500/[0.09] text-sky-700 dark:border-sky-300/[0.10] dark:text-sky-100/75" },
  rejected: { label: "Rejected", icon: <FaTimesCircle />, className: "border-rose-300/25 bg-rose-500/[0.09] text-rose-700 dark:border-rose-300/[0.10] dark:text-rose-100/75" },
  refunded: { label: "Refunded", icon: <FaMoneyCheckAlt />, className: "border-emerald-300/25 bg-emerald-500/[0.09] text-emerald-700 dark:border-emerald-300/[0.10] dark:text-emerald-100/75" },
};

const refundCategoryLabels = {
  duplicate: "Duplicate payment",
  wrong_purchase: "Wrong purchase",
  technical_issue: "Technical issue",
  not_as_expected: "Not as expected",
  other: "Other",
};

const refundMethodLabels = {
  original_payment: "Original payment",
  bank_transfer: "Bank transfer",
  esewa: "eSewa",
  other: "Other",
};

const getRefundStatusMeta = (status = "requested") => refundStatusMeta[status] || refundStatusMeta.requested;

const getRefundTimelineSteps = (refund = {}) =>
  refund.timeline?.steps || [
    { key: "requested", label: "Requested", date: refund.createdAt, active: ["requested", "approved", "rejected", "refunded"].includes(refund.status) },
    { key: "reviewing", label: "Reviewing", date: refund.createdAt, active: ["requested", "approved", "rejected", "refunded"].includes(refund.status) },
    { key: "decision", label: refund.status === "rejected" ? "Rejected" : "Approved", date: refund.resolvedAt, active: ["approved", "rejected", "refunded"].includes(refund.status), danger: refund.status === "rejected" },
    { key: "refunded", label: "Refunded", date: refund.resolvedAt, active: refund.status === "refunded" },
  ];

const RefundTimeline = ({ refund }) => (
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
    {getRefundTimelineSteps(refund).map((step) => (
      <div
        key={step.key}
        className={`rounded-xl border p-3 ${
          step.danger
            ? "border-rose-300/25 bg-rose-500/[0.055] dark:border-rose-300/[0.09]"
            : step.active
              ? "border-teal-300/25 bg-teal-500/[0.055] dark:border-teal-300/[0.09]"
              : "border-gray-200/70 bg-white/45 dark:border-white/[0.05] dark:bg-white/[0.014]"
        }`}
      >
        <span className={`mb-2 block size-2 rounded-full ${step.danger ? "bg-rose-400" : step.active ? "bg-teal-300" : "bg-gray-300 dark:bg-white/20"}`} />
        <p className="text-[9px] font-black text-gray-800 dark:text-white/70">{step.label}</p>
        <p className="mt-1 text-[8px] font-semibold text-gray-400 dark:text-white/25">{step.date ? formatDate(step.date) : step.description || "Pending"}</p>
      </div>
    ))}
  </div>
);

export const ReviewSupportManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [activeReply, setActiveReply] = useState({});
  const [activeAnswer, setActiveAnswer] = useState({});
  const [refundStatusFilter, setRefundStatusFilter] = useState("all");
  const [refundNotes, setRefundNotes] = useState({});
  const [updatingRefundId, setUpdatingRefundId] = useState("");
  const [notificationForm, setNotificationForm] = useState({ title: "", message: "", type: "info", link: "" });

  const visibleRefunds = useMemo(() => (refundStatusFilter === "all" ? refunds : refunds.filter((refund) => refund.status === refundStatusFilter)), [refundStatusFilter, refunds]);
  const refundStats = useMemo(
    () => ({
      total: refunds.length,
      requested: refunds.filter((refund) => refund.status === "requested").length,
      approved: refunds.filter((refund) => refund.status === "approved").length,
      refundedAmount: refunds.filter((refund) => refund.status === "refunded").reduce((total, refund) => total + Number(refund.order?.amount || 0), 0),
    }),
    [refunds],
  );

  const fetchData = async () => {
    const [reviewResponse, ticketResponse, questionResponse, refundResponse] = await Promise.all([
      axios.get(`${REACT_APP_BACKEND_URL}/business/admin/reviews`),
      axios.get(`${REACT_APP_BACKEND_URL}/business/admin/tickets`),
      axios.get(`${REACT_APP_BACKEND_URL}/business/admin/questions`),
      axios.get(`${REACT_APP_BACKEND_URL}/business/admin/refunds`),
    ]);
    setReviews(reviewResponse.data?.reviews || []);
    setTickets(ticketResponse.data?.tickets || []);
    setQuestions(questionResponse.data?.questions || []);
    setRefunds(refundResponse.data?.refunds || []);
  };

  useEffect(() => {
    fetchData().catch((error) => toast.error(error.response?.data?.error || "Unable to load reviews/support."));
  }, []);

  const updateReview = async (id, status) => {
    await axios.patch(`${REACT_APP_BACKEND_URL}/business/admin/reviews/${id}`, { status });
    toast.success("Review updated.");
    await fetchData();
  };

  const updateTicket = async (id, status) => {
    await axios.patch(`${REACT_APP_BACKEND_URL}/business/admin/tickets/${id}`, { status });
    toast.success("Ticket updated.");
    await fetchData();
  };

  const replyTicket = async (id) => {
    const message = activeReply[id];
    if (!message?.trim()) return toast.error("Please enter a reply.");
    await axios.post(`${REACT_APP_BACKEND_URL}/business/support/${id}/reply`, { message });
    setActiveReply((currentValue) => ({ ...currentValue, [id]: "" }));
    toast.success("Reply sent.");
    await fetchData();
  };

  const sendNotification = async (event) => {
    event.preventDefault();

    if (!notificationForm.title.trim() || !notificationForm.message.trim()) {
      return toast.error("Please enter notification title and message.");
    }

    await axios.post(`${REACT_APP_BACKEND_URL}/business/admin/notifications`, {
      ...notificationForm,
      audience: "all",
    });
    setNotificationForm({ title: "", message: "", type: "info", link: "" });
    toast.success("Notification sent to users.");
  };

  const answerQuestion = async (id) => {
    const answer = activeAnswer[id];
    if (!answer?.trim()) return toast.error("Please enter an answer.");
    await axios.patch(`${REACT_APP_BACKEND_URL}/business/admin/questions/${id}`, { answer, status: "answered" });
    setActiveAnswer((currentValue) => ({ ...currentValue, [id]: "" }));
    toast.success("Question answered.");
    await fetchData();
  };

  const hideQuestion = async (id) => {
    await axios.patch(`${REACT_APP_BACKEND_URL}/business/admin/questions/${id}`, { status: "hidden" });
    toast.success("Question hidden.");
    await fetchData();
  };

  const updateRefund = async (id, status) => {
    try {
      setUpdatingRefundId(id);
      await axios.patch(`${REACT_APP_BACKEND_URL}/business/admin/refunds/${id}`, { status, adminNote: refundNotes[id] || "" });
      setRefundNotes((currentValue) => ({ ...currentValue, [id]: "" }));
      toast.success("Refund updated.");
      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to update refund.");
    } finally {
      setUpdatingRefundId("");
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">Quality</p>
        <h1 className="mt-2 text-2xl font-black text-gray-950">Reviews & support</h1>
      </div>

      <form onSubmit={sendNotification} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-black text-gray-950">Broadcast notification</h2>
            <p className="mt-1 text-xs text-gray-500">Send an account-dashboard alert to all users.</p>
          </div>
          <button className="rounded-lg bg-teal-600 px-4 py-2 text-[10px] font-bold text-white">Send notification</button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={notificationForm.title} onChange={(event) => setNotificationForm((value) => ({ ...value, title: event.target.value }))} placeholder="Title" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none" />
          <select value={notificationForm.type} onChange={(event) => setNotificationForm((value) => ({ ...value, type: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none">
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="payment">Payment</option>
            <option value="course">Course</option>
            <option value="system">System</option>
          </select>
          <input value={notificationForm.link} onChange={(event) => setNotificationForm((value) => ({ ...value, link: event.target.value }))} placeholder="/account?tab=orders" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none md:col-span-2" />
          <textarea value={notificationForm.message} onChange={(event) => setNotificationForm((value) => ({ ...value, message: event.target.value }))} placeholder="Message" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none md:col-span-2" />
        </div>
      </form>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-gray-950">Product reviews</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="text-[10px] uppercase tracking-widest text-gray-400">
              <tr><th className="py-2">Product</th><th>User</th><th>Rating</th><th>Comment</th><th>Status</th><th className="text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td className="py-3 font-bold text-gray-800">{review.product?.title || review.product?.name || "Product"}</td>
                  <td>{review.user?.email}</td>
                  <td>{review.rating}/5</td>
                  <td className="max-w-xs truncate">{review.comment}</td>
                  <td className="capitalize">{review.status}</td>
                  <td className="space-x-2 text-right">
                    <button onClick={() => updateReview(review._id, "approved")} className="rounded-lg bg-emerald-600 px-3 py-2 text-[10px] font-bold text-white">Approve</button>
                    <button onClick={() => updateReview(review._id, "rejected")} className="rounded-lg bg-rose-600 px-3 py-2 text-[10px] font-bold text-white">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-gray-950">Product Q&A</h2>
        <div className="mt-4 space-y-3">
          {questions.map((question) => (
            <div key={question._id} className="rounded-xl border border-gray-100 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-gray-900">{question.product?.title || question.product?.name || "Product"}</p>
                  <p className="mt-1 text-xs text-gray-500">{question.user?.email} · {question.status}</p>
                  <p className="mt-3 text-xs leading-5 text-gray-700">Q: {question.question}</p>
                  {question.answer && <p className="mt-2 text-xs leading-5 text-teal-700">A: {question.answer}</p>}
                </div>
                <button onClick={() => hideQuestion(question._id)} className="rounded-lg bg-gray-800 px-3 py-2 text-[10px] font-bold text-white">Hide</button>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input value={activeAnswer[question._id] || ""} onChange={(event) => setActiveAnswer((currentValue) => ({ ...currentValue, [question._id]: event.target.value }))} placeholder="Answer publicly..." className="min-h-10 flex-1 rounded-lg border border-gray-200 px-3 text-xs outline-none" />
                <button onClick={() => answerQuestion(question._id)} className="rounded-lg bg-teal-600 px-4 py-2 text-[10px] font-bold text-white">Answer</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-light-surface2 p-5 shadow-sm dark:border-white/[0.055] dark:bg-dark-surface2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-rose-500 dark:text-rose-200/65">Payment care</p>
            <h2 className="mt-2 text-xl font-black text-gray-950 dark:text-white/90">Refund requests</h2>
            <p className="mt-1 max-w-2xl text-xs leading-6 text-gray-500 dark:text-white/35">Review customer refund requests, add an admin note, and move each request through approval to refunded.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {refundStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setRefundStatusFilter(status)}
                className={`rounded-xl border px-4 py-2 text-[10px] font-black capitalize transition-all ${
                  refundStatusFilter === status
                    ? "border-teal-300/30 bg-teal-500/[0.10] text-teal-700 dark:border-teal-300/[0.10] dark:text-teal-100/75"
                    : "border-gray-200/70 bg-white/55 text-gray-500 hover:border-teal-300/35 dark:border-white/[0.06] dark:bg-white/[0.022] dark:text-white/40"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 dark:border-white/[0.055] dark:bg-white/[0.022]">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/25">Total</p>
            <h3 className="mt-2 text-2xl font-black text-gray-950 dark:text-white/90">{refundStats.total}</h3>
          </div>
          <div className="rounded-2xl border border-amber-300/25 bg-amber-500/[0.06] p-4 dark:border-amber-300/[0.09]">
            <p className="text-[9px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-100/60">Requested</p>
            <h3 className="mt-2 text-2xl font-black text-gray-950 dark:text-white/90">{refundStats.requested}</h3>
          </div>
          <div className="rounded-2xl border border-sky-300/25 bg-sky-500/[0.055] p-4 dark:border-sky-300/[0.09]">
            <p className="text-[9px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-100/60">Approved</p>
            <h3 className="mt-2 text-2xl font-black text-gray-950 dark:text-white/90">{refundStats.approved}</h3>
          </div>
          <div className="rounded-2xl border border-emerald-300/25 bg-emerald-500/[0.055] p-4 dark:border-emerald-300/[0.09]">
            <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-100/60">Refunded amount</p>
            <h3 className="mt-2 text-2xl font-black text-gray-950 dark:text-white/90">{money(refundStats.refundedAmount)}</h3>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {visibleRefunds.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300/80 bg-white/45 p-8 text-center text-xs text-gray-500 dark:border-white/[0.07] dark:bg-white/[0.016] dark:text-white/35 xl:col-span-2">
              No refund requests found for this filter.
            </div>
          ) : (
            visibleRefunds.map((refund) => {
              const statusMeta = getRefundStatusMeta(refund.status);
              const orderItems = Array.isArray(refund.order?.orderItems) ? refund.order.orderItems : [];

              return (
                <article key={refund._id} className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/60 dark:border-white/[0.055] dark:bg-white/[0.022]">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200/70 p-4 dark:border-white/[0.05]">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-gray-950 dark:text-white/90">{refund.user?.name || "Customer"}</p>
                      <p className="mt-1 truncate text-[10px] font-semibold text-gray-400 dark:text-white/25">{refund.user?.email || "No email"} · {formatDate(refund.createdAt)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black ${statusMeta.className}`}>
                      {statusMeta.icon}
                      {statusMeta.label}
                    </span>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-gray-200/70 bg-white/50 p-3 dark:border-white/[0.05] dark:bg-white/[0.016]">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/25">Order</p>
                        <p className="mt-1 truncate text-[10px] font-black text-gray-700 dark:text-white/60" title={refund.order?._id}>{refund.order?._id || "-"}</p>
                      </div>
                      <div className="rounded-xl border border-gray-200/70 bg-white/50 p-3 dark:border-white/[0.05] dark:bg-white/[0.016]">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/25">Amount</p>
                        <p className="mt-1 text-[12px] font-black text-gray-950 dark:text-white/85">{money(refund.order?.amount)}</p>
                      </div>
                      <div className="rounded-xl border border-gray-200/70 bg-white/50 p-3 dark:border-white/[0.05] dark:bg-white/[0.016]">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/25">Gateway</p>
                        <p className="mt-1 text-[10px] font-bold capitalize text-gray-600 dark:text-white/45">{refund.order?.paymentInfo?.method || "-"}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200/70 bg-white/45 p-3 dark:border-white/[0.05] dark:bg-white/[0.016]">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/25">Request details</p>
                      <p className="mt-2 text-xs font-bold text-gray-800 dark:text-white/70">{refundCategoryLabels[refund.category] || "Other"} · {refundMethodLabels[refund.refundMethod] || "Original payment"}</p>
                      {refund.refundContact && <p className="mt-1 text-[10px] font-semibold text-gray-400 dark:text-white/30">Contact: {refund.refundContact}</p>}
                      <p className="mt-3 text-xs leading-6 text-gray-600 dark:text-white/42">{refund.reason}</p>
                    </div>

                    {orderItems.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {orderItems.slice(0, 4).map((item) => (
                          <span key={`${refund._id}-${item.product || item.title}`} className="rounded-lg border border-gray-200/70 bg-white/55 px-3 py-1.5 text-[9px] font-bold text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.016] dark:text-white/35">
                            {item.title || "Item"}
                          </span>
                        ))}
                      </div>
                    )}

                    <RefundTimeline refund={refund} />

                    <textarea
                      value={refundNotes[refund._id] || refund.adminNote || ""}
                      onChange={(event) => setRefundNotes((currentValue) => ({ ...currentValue, [refund._id]: event.target.value }))}
                      placeholder="Admin note shown to user..."
                      className="min-h-20 w-full rounded-xl border border-gray-200/70 bg-white/70 px-4 py-3 text-xs text-gray-700 outline-none transition-all focus:border-teal-300/45 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/70"
                    />

                    <div className="flex flex-wrap justify-end gap-2">
                      <button disabled={updatingRefundId === refund._id} onClick={() => updateRefund(refund._id, "approved")} className="rounded-xl border border-sky-300/25 bg-sky-500/[0.08] px-4 py-2 text-[10px] font-black text-sky-700 transition-all hover:bg-sky-500/[0.13] disabled:opacity-60 dark:border-sky-300/[0.10] dark:text-sky-100/75">Approve</button>
                      <button disabled={updatingRefundId === refund._id} onClick={() => updateRefund(refund._id, "rejected")} className="rounded-xl border border-rose-300/25 bg-rose-500/[0.08] px-4 py-2 text-[10px] font-black text-rose-700 transition-all hover:bg-rose-500/[0.13] disabled:opacity-60 dark:border-rose-300/[0.10] dark:text-rose-100/75">Reject</button>
                      <button disabled={updatingRefundId === refund._id} onClick={() => updateRefund(refund._id, "refunded")} className="rounded-xl border border-emerald-300/25 bg-emerald-500/[0.09] px-4 py-2 text-[10px] font-black text-emerald-700 transition-all hover:bg-emerald-500/[0.14] disabled:opacity-60 dark:border-emerald-300/[0.10] dark:text-emerald-100/75">
                        {updatingRefundId === refund._id ? "Saving..." : "Mark refunded"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-gray-950">Support tickets</h2>
        <div className="mt-4 space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="rounded-xl border border-gray-100 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-gray-900">{ticket.subject}</p>
                  <p className="mt-1 text-xs text-gray-500">{ticket.user?.email} · {formatDate(ticket.createdAt)}</p>
                  <p className="mt-3 text-xs leading-5 text-gray-600">{ticket.message}</p>
                </div>
                <select value={ticket.status} onChange={(event) => updateTicket(ticket._id, event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs">
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input value={activeReply[ticket._id] || ""} onChange={(event) => setActiveReply((currentValue) => ({ ...currentValue, [ticket._id]: event.target.value }))} placeholder="Reply to user..." className="min-h-10 flex-1 rounded-lg border border-gray-200 px-3 text-xs outline-none" />
                <button onClick={() => replyTicket(ticket._id)} className="rounded-lg bg-teal-600 px-4 py-2 text-[10px] font-bold text-white">Send reply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
