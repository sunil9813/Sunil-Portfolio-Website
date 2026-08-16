import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";

const initialPlan = { name: "", description: "", price: "", durationDays: 365, features: "" };
const initialBundle = { title: "", description: "", price: "", compareAtPrice: "", items: "" };

export const PlanBundleManagement = () => {
  const [plans, setPlans] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [planForm, setPlanForm] = useState(initialPlan);
  const [bundleForm, setBundleForm] = useState(initialBundle);

  const fetchData = async () => {
    const [planResponse, bundleResponse] = await Promise.all([
      axios.get(`${REACT_APP_BACKEND_URL}/business/admin/plans`),
      axios.get(`${REACT_APP_BACKEND_URL}/business/admin/bundles`),
    ]);
    setPlans(planResponse.data?.plans || []);
    setBundles(bundleResponse.data?.bundles || []);
  };

  useEffect(() => {
    fetchData().catch((error) => toast.error(error.response?.data?.error || "Unable to load plans and bundles."));
  }, []);

  const createPlan = async (event) => {
    event.preventDefault();
    await axios.post(`${REACT_APP_BACKEND_URL}/business/admin/plans`, planForm);
    setPlanForm(initialPlan);
    toast.success("Plan created.");
    await fetchData();
  };

  const createBundle = async (event) => {
    event.preventDefault();
    const items = bundleForm.items
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [productModel, product] = line.split(":").map((part) => part.trim());
        return { productModel, product };
      });
    await axios.post(`${REACT_APP_BACKEND_URL}/business/admin/bundles`, { ...bundleForm, items });
    setBundleForm(initialBundle);
    toast.success("Bundle created.");
    await fetchData();
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">Sales</p>
        <h1 className="mt-2 text-2xl font-black text-gray-950">Membership plans & bundles</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <form onSubmit={createPlan} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-gray-950">Create membership plan</h2>
          <div className="mt-4 grid gap-3">
            <input value={planForm.name} onChange={(event) => setPlanForm((value) => ({ ...value, name: event.target.value }))} placeholder="Plan name" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none" />
            <input value={planForm.price} onChange={(event) => setPlanForm((value) => ({ ...value, price: event.target.value }))} placeholder="Price" type="number" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none" />
            <input value={planForm.durationDays} onChange={(event) => setPlanForm((value) => ({ ...value, durationDays: event.target.value }))} placeholder="Duration days" type="number" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none" />
            <textarea value={planForm.description} onChange={(event) => setPlanForm((value) => ({ ...value, description: event.target.value }))} placeholder="Description" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none" />
            <textarea value={planForm.features} onChange={(event) => setPlanForm((value) => ({ ...value, features: event.target.value }))} placeholder="One feature per line" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none" />
          </div>
          <button className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-[10px] font-bold text-white">Create plan</button>
        </form>

        <form onSubmit={createBundle} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-gray-950">Create product bundle</h2>
          <div className="mt-4 grid gap-3">
            <input value={bundleForm.title} onChange={(event) => setBundleForm((value) => ({ ...value, title: event.target.value }))} placeholder="Bundle title" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none" />
            <input value={bundleForm.price} onChange={(event) => setBundleForm((value) => ({ ...value, price: event.target.value }))} placeholder="Bundle price" type="number" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none" />
            <input value={bundleForm.compareAtPrice} onChange={(event) => setBundleForm((value) => ({ ...value, compareAtPrice: event.target.value }))} placeholder="Compare at price" type="number" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none" />
            <textarea value={bundleForm.description} onChange={(event) => setBundleForm((value) => ({ ...value, description: event.target.value }))} placeholder="Description" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none" />
            <textarea value={bundleForm.items} onChange={(event) => setBundleForm((value) => ({ ...value, items: event.target.value }))} placeholder={"Items, one per line:\nSubject:64abc...\nProject:64def..."} className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none" />
          </div>
          <button className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-[10px] font-bold text-white">Create bundle</button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-gray-950">Plans</h2>
          <div className="mt-4 space-y-2">
            {plans.map((plan) => <div key={plan._id} className="rounded-xl border border-gray-100 p-3 text-xs"><b>{plan.name}</b> · Rs. {plan.price} · {plan.durationDays} days</div>)}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-gray-950">Bundles</h2>
          <div className="mt-4 space-y-2">
            {bundles.map((bundle) => <div key={bundle._id} className="rounded-xl border border-gray-100 p-3 text-xs"><b>{bundle.title}</b> · Rs. {bundle.price} · {bundle.items?.length || 0} items</div>)}
          </div>
        </div>
      </div>
    </section>
  );
};
