import { Link, useParams, useSearchParams } from "react-router-dom";
import { FaCreditCard, FaFileInvoice, FaRedoAlt, FaShieldAlt } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { clearCart } from "@/utils/cart";
import { submitEsewaForm } from "@/utils/payment";
import { REACT_APP_BACKEND_URL } from "@/utils/api";

export const PaymentStatus = () => {
  const { status } = useParams();
  const [searchParams] = useSearchParams();
  const [payingGateway, setPayingGateway] = useState("");
  const isSuccess = status === "success";
  const orderId = searchParams.get("orderId");
  const transactionCode = searchParams.get("transactionCode");
  const gateway = searchParams.get("gateway");
  const error = searchParams.get("error");

  useEffect(() => {
    if (isSuccess) {
      clearCart();
    }
  }, [isSuccess]);

  const handleRetryPayment = async (selectedGateway = "stripe") => {
    if (!orderId) {
      toast.error("Order ID was not found. Please open Orders and retry payment from there.");
      return;
    }

    try {
      setPayingGateway(selectedGateway);
      const endpoint = selectedGateway === "stripe" ? "/payment/stripe/initiate-payment" : "/payment/initiate-payment";
      const response = await axios.post(`${REACT_APP_BACKEND_URL}${endpoint}`, { orderId });

      if (!response.data?.paymentUrl) {
        throw new Error("Payment gateway details were not returned.");
      }

      if (selectedGateway === "stripe") {
        window.location.href = response.data.paymentUrl;
        return;
      }

      submitEsewaForm(response.data.paymentUrl, response.data.formData);
    } catch (retryError) {
      toast.error(retryError.response?.data?.error || retryError.message || "Unable to restart payment.");
    } finally {
      setPayingGateway("");
    }
  };

  return (
    <section className="relative min-h-[70vh] overflow-hidden p-3 sm:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(20,184,166,.16),transparent_34%),radial-gradient(circle_at_85%_0%,rgba(168,85,247,.15),transparent_36%)]" />
      <div className="container relative z-10 flex min-h-[60vh] items-center justify-center">
        <div className="relative max-w-2xl overflow-hidden rounded-[32px] border border-gray-200/70 bg-gray-50/70 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/[0.065] dark:bg-white/[0.022] dark:shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
          <div className="pointer-events-none absolute -right-24 -top-28 size-64 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 size-64 rounded-full bg-purple-400/10 blur-3xl" />
          <div
            className={`relative mx-auto flex size-16 items-center justify-center rounded-2xl border text-2xl ${
              isSuccess
                ? "border-teal-300/25 bg-teal-500/[0.10] text-teal-700 dark:border-teal-300/[0.10] dark:text-teal-100/80"
                : "border-amber-300/25 bg-amber-500/[0.10] text-amber-700 dark:border-amber-300/[0.10] dark:text-amber-100/80"
            }`}
          >
            {isSuccess ? <IoCheckmarkCircle /> : <FaCreditCard />}
          </div>

          <p className="relative mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-white/25">{gateway ? `${gateway} payment` : "Secure payment"}</p>
          <h1 className="relative mt-3 text-3xl font-semibold tracking-[-0.04em] text-gray-950 dark:text-white/90">{isSuccess ? "Payment complete" : "Payment not completed"}</h1>
          <p className="relative mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 dark:text-white/40">
            {isSuccess ? "Your order was verified and paid access has been activated." : error || "The payment was cancelled, failed, or could not be verified."}
          </p>

          {(orderId || transactionCode) && (
            <div className="relative mt-5 rounded-2xl border border-gray-200/70 bg-white/60 p-4 text-left text-[10px] text-gray-500 dark:border-white/[0.055] dark:bg-white/[0.025] dark:text-white/40">
              {orderId && <p>Order ID: {orderId}</p>}
              {transactionCode && <p className="mt-1">Transaction: {transactionCode}</p>}
            </div>
          )}

          <div className="relative mt-5 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200/70 bg-white/45 p-4 dark:border-white/[0.05] dark:bg-white/[0.018]">
              <FaShieldAlt className="text-teal-500" />
              <p className="mt-2 text-[10px] font-bold text-gray-700 dark:text-white/65">Access is protected</p>
              <p className="mt-1 text-[9px] leading-5 text-gray-400 dark:text-white/28">Only paid orders unlock paid resources.</p>
            </div>
            <div className="rounded-2xl border border-gray-200/70 bg-white/45 p-4 dark:border-white/[0.05] dark:bg-white/[0.018]">
              <FaFileInvoice className="text-indigo-500" />
              <p className="mt-2 text-[10px] font-bold text-gray-700 dark:text-white/65">Invoice ready</p>
              <p className="mt-1 text-[9px] leading-5 text-gray-400 dark:text-white/28">Paid orders include invoice and PDF download.</p>
            </div>
            <div className="rounded-2xl border border-gray-200/70 bg-white/45 p-4 dark:border-white/[0.05] dark:bg-white/[0.018]">
              <FaRedoAlt className="text-amber-500" />
              <p className="mt-2 text-[10px] font-bold text-gray-700 dark:text-white/65">Retry anytime</p>
              <p className="mt-1 text-[9px] leading-5 text-gray-400 dark:text-white/28">Failed orders can be paid again from here or Orders.</p>
            </div>
          </div>

          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/account?tab=orders" className="rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-bold text-white transition-all hover:bg-teal-500">
              View orders
            </Link>
            {!isSuccess && orderId && (
              <>
                <button type="button" onClick={() => handleRetryPayment("stripe")} disabled={Boolean(payingGateway)} className="rounded-lg border border-indigo-300/25 bg-indigo-500/[0.08] px-5 py-3 text-[10px] font-bold text-indigo-700 transition-all hover:bg-indigo-500/[0.13] disabled:cursor-not-allowed disabled:opacity-60 dark:border-indigo-300/[0.10] dark:text-indigo-100/75">
                  {payingGateway === "stripe" ? "Opening Stripe..." : "Retry Stripe"}
                </button>
                <button type="button" onClick={() => handleRetryPayment("esewa")} disabled={Boolean(payingGateway)} className="rounded-lg border border-amber-300/25 bg-amber-500/[0.08] px-5 py-3 text-[10px] font-bold text-amber-700 transition-all hover:bg-amber-500/[0.13] disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-300/[0.10] dark:text-amber-100/75">
                  {payingGateway === "esewa" ? "Opening eSewa..." : "Retry eSewa"}
                </button>
              </>
            )}
            <Link to="/courses" className="rounded-lg border border-gray-200/80 bg-white/65 px-5 py-3 text-[10px] font-bold text-gray-700 transition-all hover:border-teal-300/45 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/65">
              Continue learning
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
