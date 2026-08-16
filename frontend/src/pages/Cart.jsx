import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaCreditCard, FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";

import { clearCart, getCartItems, getCartSummary, getWishlistItems, moveCartItemToWishlist, moveWishlistItemToCart, removeCartItem, removeWishlistItem, subscribeCart, subscribeWishlist } from "@/utils/cart";
import { submitEsewaForm } from "@/utils/payment";
import { REACT_APP_BACKEND_URL } from "@/utils/api";

const defaultShippingInfo = {
  address: "",
  city: "",
  phoneNo: "",
  postalCode: "",
  country: "",
};

const checkoutSteps = [
  { id: "cart", label: "Cart" },
  { id: "shipping", label: "Shipping" },
  { id: "order", label: "Order" },
  { id: "payment", label: "Payment" },
];

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en", { maximumFractionDigits: 2 })}`;

export const Cart = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [items, setItems] = useState(() => getCartItems());
  const [wishlistItems, setWishlistItems] = useState(() => getWishlistItems());
  const [shippingInfo, setShippingInfo] = useState(defaultShippingInfo);
  const [activeStep, setActiveStep] = useState("cart");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState("esewa");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const summary = useMemo(() => getCartSummary(items), [items]);
  const discountAmount = Number(appliedCoupon?.discountAmount || 0);
  const orderTotal = Math.max(Number((summary.subtotal - discountAmount).toFixed(2)), 0);

  useEffect(() => subscribeCart(setItems), []);
  useEffect(() => subscribeWishlist(setWishlistItems), []);

  useEffect(() => {
    if (appliedCoupon) {
      setAppliedCoupon(null);
    }
  }, [summary.subtotal]);

  useEffect(() => {
    if (!isLoggedIn) return undefined;

    const timeoutId = setTimeout(() => {
      axios
        .post(`${REACT_APP_BACKEND_URL}/business/cart/abandonment`, {
          items: items.map((item) => ({
            product: item.id,
            productType: item.type,
            title: item.title || item.name,
            price: item.price,
            quantity: item.quantity || 1,
          })),
          subtotal: summary.subtotal,
        })
        .catch(() => {});
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [isLoggedIn, items, summary.subtotal]);

  useEffect(() => {
    setShippingInfo((currentValue) => ({
      ...currentValue,
      phoneNo: currentValue.phoneNo || user?.phone || "",
      address: currentValue.address || user?.address || "",
    }));
  }, [user]);

  const handleRemove = (item) => {
    const nextItems = removeCartItem(item.id, item.type);
    setItems(nextItems);
    toast.success("Removed from cart.");
  };

  const handleSaveForLater = (item) => {
    const nextItems = moveCartItemToWishlist(item);
    setItems(nextItems);
    setWishlistItems(getWishlistItems());
    toast.success("Saved for later.");
  };

  const handleMoveToCart = (item) => {
    moveWishlistItemToCart(item);
    setItems(getCartItems());
    setWishlistItems(getWishlistItems());
    toast.success("Moved to cart.");
  };

  const handleShippingChange = (event) => {
    const { name, value } = event.target;
    setShippingInfo((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }

    try {
      setIsApplyingCoupon(true);
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/coupon/validate`, {
        code: couponCode,
        subtotal: summary.subtotal,
      });

      setAppliedCoupon(response.data?.coupon);
      setCouponCode(response.data?.coupon?.code || couponCode.trim().toUpperCase());
      toast.success("Coupon applied.");
    } catch (error) {
      setAppliedCoupon(null);
      toast.error(error.response?.data?.error || error.message || "Coupon could not be applied.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed.");
  };

  const validateCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return false;
    }

    if (!isLoggedIn) {
      toast.error("Please log in before checkout.");
      navigate("/login");
      return false;
    }

    const missingField = Object.entries(shippingInfo).find(([, value]) => !String(value || "").trim());

    if (missingField) {
      toast.error("Please complete your shipping/contact details.");
      setActiveStep("shipping");
      return false;
    }

    return true;
  };

  const handleCheckout = async (event) => {
    event.preventDefault();

    if (!validateCheckout()) return;

    try {
      setIsCheckingOut(true);
      setActiveStep("order");

      const orderResponse = await axios.post(`${REACT_APP_BACKEND_URL}/order/new`, {
        shippingInfo,
        couponCode: appliedCoupon?.code || "",
        items: items.map((item) => ({
          product: item.id,
          productType: item.type,
          quantity: item.quantity || 1,
        })),
      });

      const orderId = orderResponse.data?.data?._id;
      const orderStatus = orderResponse.data?.data?.status;

      if (!orderId) {
        throw new Error("Order was created without an order ID.");
      }

      if (orderStatus === "paid") {
        clearCart();
        navigate(`/payment/success?orderId=${orderId}&gateway=coupon`);
        return;
      }

      setActiveStep("payment");
      const paymentEndpoint = paymentGateway === "stripe" ? "/payment/stripe/initiate-payment" : "/payment/initiate-payment";
      const paymentResponse = await axios.post(`${REACT_APP_BACKEND_URL}${paymentEndpoint}`, { orderId });

      if (!paymentResponse.data?.paymentUrl) {
        throw new Error("Payment gateway details were not returned.");
      }

      if (paymentGateway === "stripe") {
        window.location.href = paymentResponse.data.paymentUrl;
        return;
      }

      submitEsewaForm(paymentResponse.data.paymentUrl, paymentResponse.data.formData);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Checkout failed.");
      setIsCheckingOut(false);
      setActiveStep("shipping");
    }
  };

  const handleClearCart = () => {
    clearCart();
    setItems([]);
    toast.success("Cart cleared.");
  };

  return (
    <section className="min-h-[75vh] p-3 sm:p-4">
      <div className="container relative z-10">
        <div className="mb-6 mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-teal-600 dark:text-teal-200/60">Checkout</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-gray-950 dark:text-white/90">Cart & payment</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-white/40">Review your items, add shipping/contact details, create the order, then continue securely with eSewa or Stripe.</p>
          </div>

          {items.length > 0 && (
            <button type="button" onClick={handleClearCart} className="inline-flex w-fit items-center gap-2 rounded-lg border border-rose-300/30 bg-rose-500/[0.06] px-4 py-3 text-[10px] font-bold text-rose-700 transition-all hover:bg-rose-500/[0.10] dark:border-rose-300/[0.10] dark:text-rose-100/75">
              <FaTrashAlt />
              Clear cart
            </button>
          )}
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4">
          {checkoutSteps.map((step, index) => {
            const activeIndex = checkoutSteps.findIndex((item) => item.id === activeStep);
            const isDone = index < activeIndex;
            const isActive = step.id === activeStep;

            return (
              <div key={step.id} className={`rounded-2xl border px-4 py-3 ${isDone || isActive ? "border-teal-300/30 bg-teal-500/[0.07] text-teal-700 dark:border-teal-300/[0.10] dark:text-teal-100/75" : "border-gray-200/70 bg-white/50 text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/25"}`}>
                <div className="flex items-center gap-2">
                  {isDone ? <IoCheckmarkCircle /> : <span className="text-[10px] font-black">{index + 1}</span>}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {items.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-gray-300/80 bg-gray-50/50 p-10 text-center dark:border-white/[0.07] dark:bg-white/[0.016]">
            <FaShoppingCart className="mx-auto text-3xl text-gray-400 dark:text-white/25" />
            <h2 className="mt-4 text-lg font-black text-gray-950 dark:text-white/85">Your cart is empty</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-white/35">Add a paid course or project first, then come back for checkout.</p>
            <Link to="/courses" className="mt-5 inline-flex rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-bold text-white transition-all hover:bg-teal-500">
              Browse courses
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <div className="rounded-[26px] border border-gray-200/70 bg-gray-50/55 p-4 dark:border-white/[0.055] dark:bg-white/[0.018]">
                <h2 className="text-sm font-black text-gray-950 dark:text-white/85">Cart items</h2>
                <div className="mt-4 space-y-3">
                  {items.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="flex flex-col gap-3 rounded-2xl border border-gray-200/70 bg-white/65 p-3 dark:border-white/[0.05] dark:bg-white/[0.02] sm:flex-row sm:items-center">
                      <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-gray-200/70 bg-gray-100 dark:border-white/[0.055] dark:bg-white/[0.03]">
                        {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-lg font-black text-teal-600">{item.title?.charAt(0)}</div>}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="rounded-full border border-teal-300/20 bg-teal-500/[0.06] px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-teal-700 dark:border-teal-300/[0.08] dark:text-teal-100/70">{item.type}</span>
                        <h3 className="mt-2 text-sm font-black text-gray-950 dark:text-white/85">{item.title}</h3>
                        <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-gray-500 dark:text-white/35">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                        <p className="text-sm font-black text-gray-950 dark:text-white/85">{money(item.price)}</p>
                        <button type="button" onClick={() => handleRemove(item)} className="rounded-lg border border-rose-300/25 bg-rose-500/[0.06] px-3 py-2 text-[10px] font-bold text-rose-700 transition-all hover:bg-rose-500/[0.10] dark:border-rose-300/[0.10] dark:text-rose-100/70">
                          Remove
                        </button>
                        <button type="button" onClick={() => handleSaveForLater(item)} className="rounded-lg border border-amber-300/25 bg-amber-500/[0.06] px-3 py-2 text-[10px] font-bold text-amber-700 transition-all hover:bg-amber-500/[0.10] dark:border-amber-300/[0.10] dark:text-amber-100/70">
                          Save later
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {wishlistItems.length > 0 && (
                <div className="rounded-[26px] border border-gray-200/70 bg-gray-50/55 p-4 dark:border-white/[0.055] dark:bg-white/[0.018]">
                  <h2 className="text-sm font-black text-gray-950 dark:text-white/85">Saved for later</h2>
                  <div className="mt-4 space-y-3">
                    {wishlistItems.map((item) => (
                      <div key={`${item.type}-${item.id}-wishlist`} className="flex flex-col gap-3 rounded-2xl border border-gray-200/70 bg-white/65 p-3 dark:border-white/[0.05] dark:bg-white/[0.02] sm:flex-row sm:items-center">
                        <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-gray-200/70 bg-gray-100 dark:border-white/[0.055] dark:bg-white/[0.03]">
                          {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-lg font-black text-teal-600">{item.title?.charAt(0)}</div>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-black text-gray-950 dark:text-white/85">{item.title}</h3>
                          <p className="mt-1 text-[10px] text-gray-500 dark:text-white/35">{item.type} · {money(item.price)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleMoveToCart(item)} className="rounded-lg border border-teal-300/25 bg-teal-500/[0.06] px-3 py-2 text-[10px] font-bold text-teal-700 dark:border-teal-300/[0.10] dark:text-teal-100/70">
                            Move to cart
                          </button>
                          <button type="button" onClick={() => setWishlistItems(removeWishlistItem(item.id, item.type))} className="rounded-lg border border-rose-300/25 bg-rose-500/[0.06] px-3 py-2 text-[10px] font-bold text-rose-700 dark:border-rose-300/[0.10] dark:text-rose-100/70">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-[26px] border border-gray-200/70 bg-gray-50/55 p-4 dark:border-white/[0.055] dark:bg-white/[0.018]">
                <h2 className="text-sm font-black text-gray-950 dark:text-white/85">Shipping & contact</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input name="address" value={shippingInfo.address} onChange={handleShippingChange} placeholder="Address" className="h-11 rounded-xl border border-gray-200/75 bg-white/70 px-4 text-[11px] font-medium text-gray-800 outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
                  <input name="city" value={shippingInfo.city} onChange={handleShippingChange} placeholder="City" className="h-11 rounded-xl border border-gray-200/75 bg-white/70 px-4 text-[11px] font-medium text-gray-800 outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
                  <input name="phoneNo" value={shippingInfo.phoneNo} onChange={handleShippingChange} placeholder="Phone number" className="h-11 rounded-xl border border-gray-200/75 bg-white/70 px-4 text-[11px] font-medium text-gray-800 outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
                  <input name="postalCode" value={shippingInfo.postalCode} onChange={handleShippingChange} placeholder="Postal code" className="h-11 rounded-xl border border-gray-200/75 bg-white/70 px-4 text-[11px] font-medium text-gray-800 outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
                  <input name="country" value={shippingInfo.country} onChange={handleShippingChange} placeholder="Country" className="h-11 rounded-xl border border-gray-200/75 bg-white/70 px-4 text-[11px] font-medium text-gray-800 outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75 sm:col-span-2" />
                </div>
              </div>

              <div className="rounded-[26px] border border-gray-200/70 bg-gray-50/55 p-4 dark:border-white/[0.055] dark:bg-white/[0.018]">
                <h2 className="text-sm font-black text-gray-950 dark:text-white/85">Payment option</h2>
                <p className="mt-1 text-[10px] leading-5 text-gray-500 dark:text-white/35">Choose how you want to pay for this order.</p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    {
                      id: "esewa",
                      title: "eSewa",
                      text: "Pay through eSewa checkout.",
                    },
                    {
                      id: "stripe",
                      title: "Stripe",
                      text: "Pay with card through Stripe Checkout.",
                    },
                  ].map((gateway) => {
                    const isSelected = paymentGateway === gateway.id;

                    return (
                      <button
                        key={gateway.id}
                        type="button"
                        onClick={() => setPaymentGateway(gateway.id)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          isSelected
                            ? "border-teal-300/35 bg-teal-500/[0.08] shadow-[0_14px_34px_rgba(20,184,166,0.08)] dark:border-teal-300/[0.12] dark:bg-teal-300/[0.045]"
                            : "border-gray-200/70 bg-white/55 hover:border-teal-300/30 hover:bg-teal-500/[0.035] dark:border-white/[0.05] dark:bg-white/[0.02]"
                        }`}
                      >
                        <span className={`flex size-10 items-center justify-center rounded-xl border ${isSelected ? "border-teal-300/25 bg-teal-500/[0.10] text-teal-700 dark:border-teal-300/[0.10] dark:text-teal-100/75" : "border-gray-200/70 bg-gray-50 text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.025] dark:text-white/30"}`}>
                          <FaCreditCard />
                        </span>
                        <span className="mt-3 block text-sm font-black text-gray-950 dark:text-white/85">{gateway.title}</span>
                        <span className="mt-1 block text-[10px] leading-5 text-gray-500 dark:text-white/35">{gateway.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside className="h-fit rounded-[26px] border border-gray-200/70 bg-gray-50/55 p-5 dark:border-white/[0.055] dark:bg-white/[0.018]">
              <h2 className="text-sm font-black text-gray-950 dark:text-white/85">Order summary</h2>
              <div className="mt-4 space-y-3 text-[11px] text-gray-500 dark:text-white/35">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{summary.count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{money(summary.subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-teal-700 dark:text-teal-200/70">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-{money(discountAmount)}</span>
                  </div>
                )}
                <div className="rounded-2xl border border-gray-200/70 bg-white/55 p-3 dark:border-white/[0.05] dark:bg-white/[0.02]">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/25">Coupon code</label>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                      placeholder="SAVE20"
                      disabled={Boolean(appliedCoupon)}
                      className="h-10 min-w-0 flex-1 rounded-xl border border-gray-200/75 bg-white/70 px-3 text-[10px] font-bold uppercase text-gray-800 outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75"
                    />
                    {appliedCoupon ? (
                      <button type="button" onClick={handleRemoveCoupon} className="rounded-xl border border-rose-300/25 bg-rose-500/[0.06] px-3 text-[10px] font-bold text-rose-700 dark:border-rose-300/[0.10] dark:text-rose-100/70">
                        Remove
                      </button>
                    ) : (
                      <button type="button" onClick={handleApplyCoupon} disabled={isApplyingCoupon} className="rounded-xl border border-teal-300/25 bg-teal-500/[0.08] px-3 text-[10px] font-bold text-teal-700 disabled:opacity-60 dark:border-teal-300/[0.10] dark:text-teal-100/70">
                        {isApplyingCoupon ? "..." : "Apply"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Gateway</span>
                  <span>{orderTotal <= 0 ? "Coupon" : paymentGateway === "stripe" ? "Stripe" : "eSewa"}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-200/70 pt-4 dark:border-white/[0.055]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/25">Total</span>
                  <span className="text-xl font-black text-gray-950 dark:text-white/90">{money(orderTotal)}</span>
                </div>
              </div>

              <button type="submit" disabled={isCheckingOut} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-[11px] font-black text-white transition-all hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60">
                <FaCreditCard />
                {isCheckingOut ? "Starting payment..." : orderTotal <= 0 ? "Create free order" : `Create order & pay with ${paymentGateway === "stripe" ? "Stripe" : "eSewa"}`}
              </button>

              <p className="mt-3 text-center text-[10px] leading-5 text-gray-400 dark:text-white/25">You will be redirected to the selected payment gateway after the order is created.</p>
            </aside>
          </form>
        )}
      </div>
    </section>
  );
};
