import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { HiOutlineTrash, HiOutlineXMark } from "react-icons/hi2";

import { deleteTestimonial, getAllTestimonial } from "@/redux/slices/portfolio/testimonialSlice";
import { TestimonialTable } from "./TestimonialTable";

const getArray = (value) => (Array.isArray(value) ? value : []);

const getErrorMessage = (error, fallback = "Something went wrong.") => {
  if (typeof error === "string") {
    return error;
  }

  return error?.response?.data?.error || error?.response?.data?.message || error?.data?.error || error?.data?.message || error?.message || error?.error || fallback;
};

const executeThunk = async (dispatch, thunkAction) => {
  const request = dispatch(thunkAction);

  if (typeof request?.unwrap === "function") {
    return request.unwrap();
  }

  const result = await request;

  if (result?.meta?.requestStatus === "rejected" || result?.error) {
    throw result?.payload || result?.error;
  }

  return result?.payload ?? result;
};
export const AllTestimonial = () => {
  const dispatch = useDispatch();

  const { testimonials, isLoading, loading } = useSelector((state) => state.testimonial);

  const testimonialList = getArray(testimonials?.testimonialList || testimonials);

  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    dispatch(getAllTestimonial());
  }, [dispatch]);

  const removeTestimonial = async (id) => {
    if (!id || deletingId) {
      return;
    }

    try {
      setDeletingId(id);

      await executeThunk(dispatch, deleteTestimonial(id));

      toast.success("Testimonial deleted successfully.");

      dispatch(getAllTestimonial());
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete testimonial."));
    } finally {
      setDeletingId("");
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      overlayClassName: "testimonial-confirm-overlay",
      customUI: ({ onClose }) => (
        <div className="w-full max-w-[410px] overflow-hidden rounded-[26px] border border-[#242C36] bg-[#0B0F14] text-[#D8DEE8] shadow-[0_34px_100px_rgba(0,0,0,0.72)]">
          <div className="relative overflow-hidden border-b border-[#242C36] bg-[#0E141B] px-5 py-5">
            <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-red-500/[0.08] blur-[58px]" />

            <div className="relative flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-red-300/[0.12] bg-red-400/[0.07] text-red-300">
                <HiOutlineTrash size={20} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-red-300/55">Permanent action</p>

                <h2 className="mt-1 text-base font-black tracking-[-0.025em] text-[#F0F3F7]">Delete testimonial?</h2>

                <p className="mt-2 text-[10px] leading-5 text-[#8491A3]">This submission and its information will be permanently removed. This action cannot be undone.</p>
              </div>

              <button
                type="button"
                aria-label="Close confirmation"
                onClick={onClose}
                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#29323E] bg-[#111821] text-[#8491A3] transition-all hover:border-[#3A4654] hover:bg-[#151D27] hover:text-[#D8DEE8]"
              >
                <HiOutlineXMark size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 bg-[#0E141B] px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center rounded-xl border border-[#29323E] bg-[#111821] px-4 text-[9px] font-semibold text-[#AAB4C2] transition-all hover:-translate-y-0.5 hover:border-[#3A4654] hover:bg-[#151D27] hover:text-[#F0F3F7]"
            >
              Keep testimonial
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                removeTestimonial(id);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-300/[0.14] bg-red-400/[0.09] px-4 text-[9px] font-semibold text-red-200 transition-all hover:-translate-y-0.5 hover:bg-red-400/[0.16]"
            >
              <HiOutlineTrash size={14} />
              Delete permanently
            </button>
          </div>
        </div>
      ),
    });
  };

  return <TestimonialTable rowData={testimonialList} confirmDelete={confirmDelete} deletingId={deletingId} isLoading={Boolean(isLoading || loading)} />;
};
