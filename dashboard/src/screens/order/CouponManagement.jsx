import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";

const defaultForm = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscountAmount: "",
  minOrderAmount: "",
  usageLimit: "",
  expiresAt: "",
  isActive: true,
};

export const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCoupons = async () => {
    const response = await axios.get(`${REACT_APP_BACKEND_URL}/coupon/admin`);
    setCoupons(response.data?.coupons || []);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      await axios.post(`${REACT_APP_BACKEND_URL}/coupon/admin`, {
        ...form,
        discountValue: Number(form.discountValue || 0),
        maxDiscountAmount: Number(form.maxDiscountAmount || 0),
        minOrderAmount: Number(form.minOrderAmount || 0),
        usageLimit: Number(form.usageLimit || 0),
        expiresAt: form.expiresAt || null,
      });
      toast.success("Coupon created.");
      setForm(defaultForm);
      await fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Unable to create coupon.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCoupon = async (coupon) => {
    await axios.put(`${REACT_APP_BACKEND_URL}/coupon/admin/${coupon._id}`, {
      isActive: !coupon.isActive,
    });
    await fetchCoupons();
  };

  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
      <form onSubmit={handleSubmit} className="h-fit rounded-3xl border border-gray-200/70 bg-light-surface2 p-5 dark:border-white/[0.055] dark:bg-dark-surface2">
        <h1 className="text-xl font-black text-gray-900 dark:text-white/90">Create Coupon</h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-white/35">Add checkout discounts for campaigns and paid access sales.</p>

        <div className="mt-5 grid gap-3">
          <input name="code" value={form.code} onChange={handleChange} placeholder="SAVE20" className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs uppercase outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Short description" className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
          <select name="discountType" value={form.discountType} onChange={handleChange} className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed amount</option>
          </select>
          <input name="discountValue" value={form.discountValue} onChange={handleChange} placeholder="Discount value" type="number" className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
          <input name="maxDiscountAmount" value={form.maxDiscountAmount} onChange={handleChange} placeholder="Max discount amount" type="number" className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
          <input name="minOrderAmount" value={form.minOrderAmount} onChange={handleChange} placeholder="Minimum order amount" type="number" className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
          <input name="usageLimit" value={form.usageLimit} onChange={handleChange} placeholder="Usage limit, 0 = unlimited" type="number" className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
          <input name="expiresAt" value={form.expiresAt} onChange={handleChange} type="date" className="h-11 rounded-xl border border-gray-200/70 bg-white/70 px-4 text-xs outline-none dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75" />
          <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/45">
            <input name="isActive" checked={form.isActive} onChange={handleChange} type="checkbox" />
            Active
          </label>
        </div>

        <button type="submit" disabled={isLoading} className="mt-5 h-11 w-full rounded-xl bg-teal-600 text-xs font-bold text-white disabled:opacity-60">
          {isLoading ? "Creating..." : "Create coupon"}
        </button>
      </form>

      <div className="rounded-3xl border border-gray-200/70 bg-light-surface2 p-5 dark:border-white/[0.055] dark:bg-dark-surface2">
        <h2 className="text-xl font-black text-gray-900 dark:text-white/90">Coupons</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-white/30">
              <tr className="border-b border-gray-200/70 dark:border-white/[0.055]">
                <th className="py-3">Code</th>
                <th>Discount</th>
                <th>Used</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b border-gray-200/70 dark:border-white/[0.045]">
                  <td className="py-4 font-black text-gray-900 dark:text-white/85">{coupon.code}</td>
                  <td>{coupon.discountType === "fixed" ? `Rs. ${coupon.discountValue}` : `${coupon.discountValue}%`}</td>
                  <td>{coupon.usedCount}/{coupon.usageLimit || "∞"}</td>
                  <td>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "No expiry"}</td>
                  <td>{coupon.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <button type="button" onClick={() => toggleCoupon(coupon)} className="rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 text-[10px] font-bold text-gray-600 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/60">
                      {coupon.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500 dark:text-white/35">No coupons created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
