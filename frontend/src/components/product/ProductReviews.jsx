import PropTypes from "prop-types";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { toast } from "react-toastify";
import { REACT_APP_BACKEND_URL } from "@/utils/api";
import { CustomDropdown } from "@/components/ui/CustomDropdown";

const ratingOptions = [5, 4, 3, 2, 1];

export const ProductReviews = ({ productType, productId, canReview = false }) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratingBreakdown = useMemo(
    () =>
      ratingOptions.map((rating) => ({
        rating,
        count: reviews.filter((review) => Number(review.rating) === rating).length,
      })),
    [reviews],
  );

  const fetchReviews = async () => {
    if (!productType || !productId) return;

    const response = await axios.get(`${REACT_APP_BACKEND_URL}/business/reviews/${productType}/${productId}`);

    setReviews(response.data?.reviews || []);
    setSummary({
      averageRating: response.data?.averageRating || 0,
      totalReviews: response.data?.totalReviews || 0,
    });
  };

  useEffect(() => {
    fetchReviews().catch(() => {});
  }, [productType, productId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.comment.trim()) {
      toast.error("Please write a short review.");
      return;
    }

    try {
      setIsSubmitting(true);

      await axios.post(`${REACT_APP_BACKEND_URL}/business/reviews/${productType}/${productId}`, form);

      setForm({ rating: 5, comment: "" });
      toast.success("Review submitted for approval.");
      await fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="
        relative isolate overflow-hidden rounded-[26px]
        border border-gray-200/80 bg-white
        p-2
        before:pointer-events-none before:absolute before:inset-x-12 before:top-0
        before:-z-10 before:h-px before:bg-gradient-to-r
        before:from-transparent before:via-teal-400/55 before:to-transparent
        dark:border-white/[0.065]
        dark:bg-[#15181d]
        dark:before:via-teal-300/20
        sm:p-2.5
      "
    >
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-stretch">
        {/* Rating summary */}
        <div
          className="
            relative overflow-hidden rounded-[22px]
            border border-gray-200/75
            bg-gradient-to-br from-gray-50 via-white to-amber-50/35
            p-5
            shadow-[inset_0_1px_0_rgba(255,255,255,0.80)]
            after:pointer-events-none after:absolute after:-right-16 after:-top-16
            after:size-44 after:rounded-full after:bg-amber-400/[0.08]
            after:blur-[65px]
            dark:border-white/[0.055]
            dark:bg-[linear-gradient(145deg,#1b1e24_0%,#181b20_100%)]
            dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
            dark:after:bg-amber-300/[0.035]
            sm:p-6
            lg:w-[34%] lg:max-w-[320px]
          "
        >
          <div className="relative z-10">
            <p
              className="
                text-[9px] font-semibold uppercase tracking-[0.24em]
                text-teal-600 dark:text-teal-200/55
              "
            >
              Verified reviews
            </p>

            <div className="mt-5 flex items-center gap-4">
              <span
                className="
                  text-[42px] font-semibold leading-none tracking-[-0.055em]
                  text-gray-950 dark:text-white/90
                "
              >
                {summary.averageRating || "0.0"}
              </span>

              <div>
                <div className="flex gap-0.5 text-[15px] text-amber-400">
                  {ratingOptions.slice(0, 5).map((rating) => (
                    <AiFillStar key={rating} className="drop-shadow-[0_3px_6px_rgba(245,158,11,0.22)]" />
                  ))}
                </div>

                <p
                  className="
                    mt-1.5 text-[9px] font-semibold
                    text-gray-500 dark:text-white/30
                  "
                >
                  {summary.totalReviews} approved review
                  {summary.totalReviews === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div
              className="
                mt-6 space-y-3 rounded-[16px]
                border border-gray-200/70
                bg-white/60 p-4
                dark:border-white/[0.045]
                dark:bg-black/[0.08]
              "
            >
              {ratingBreakdown.map((item) => (
                <div
                  key={item.rating}
                  className="
                    grid grid-cols-[30px_minmax(0,1fr)_20px]
                    items-center gap-2.5
                    text-[9px] text-gray-500
                    dark:text-white/30
                  "
                >
                  <span className="flex items-center gap-1 font-semibold">
                    {item.rating}

                    <AiFillStar className="text-[10px] text-amber-400" />
                  </span>

                  <div
                    className="
                      h-1.5 overflow-hidden rounded-full
                      bg-gray-200/90
                      dark:bg-white/[0.07]
                    "
                  >
                    <div
                      className="
                        h-full rounded-full
                        bg-gradient-to-r from-teal-600 to-teal-400
                        shadow-[0_0_8px_rgba(20,184,166,0.28)]
                        transition-all duration-500
                      "
                      style={{
                        width: summary.totalReviews ? `${(item.count / summary.totalReviews) * 100}%` : "0%",
                      }}
                    />
                  </div>

                  <span className="text-right font-bold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form and reviews */}
        <div
          className="
            min-w-0 flex-1 rounded-[22px]
            border border-gray-200/75
            bg-gray-50/45 p-3
            dark:border-white/[0.055]
            dark:bg-white/[0.012]
            sm:p-4
          "
        >
          {canReview && (
            <form
              onSubmit={handleSubmit}
              className="
                rounded-[18px]
                border border-gray-200/80
                bg-white p-2
                shadow-[0_10px_30px_rgba(15,23,42,0.045)]
                transition-colors duration-300
                focus-within:border-teal-500/25
                dark:border-white/[0.055]
                dark:bg-white/[0.022]
                dark:shadow-[0_14px_34px_rgba(0,0,0,0.14)]
                dark:focus-within:border-teal-300/[0.12]
              "
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <CustomDropdown
                  value={form.rating}
                  onChange={(value) =>
                    setForm((currentValue) => ({
                      ...currentValue,
                      rating: Number(value),
                    }))
                  }
                  options={ratingOptions.map((rating) => ({ value: rating, label: `${rating} stars` }))}
                  className="sm:w-[118px]"
                  buttonClassName="!h-11 !rounded-xl !bg-gray-50 !text-gray-700 !ring-gray-200/80 dark:!bg-white/[0.025] dark:!text-white/65 dark:!ring-white/[0.055]"
                  menuClassName="!min-w-[150px]"
                  align="left"
                />

                <input
                  value={form.comment}
                  onChange={(event) =>
                    setForm((currentValue) => ({
                      ...currentValue,
                      comment: event.target.value,
                    }))
                  }
                  placeholder="Write your review..."
                  className="
                    h-11 min-w-0 flex-1 rounded-xl
                    border border-gray-200/80
                    bg-gray-50 px-3.5
                    text-[11px] font-medium text-gray-700
                    outline-none transition-all
                    placeholder:text-gray-400
                    focus:border-teal-500/30 focus:bg-white
                    dark:border-white/[0.055]
                    dark:bg-white/[0.025]
                    dark:text-white/70
                    dark:placeholder:text-white/20
                    dark:focus:border-teal-300/[0.12]
                    dark:focus:bg-white/[0.035]
                  "
                />

                <button
                  disabled={isSubmitting}
                  className="
                    relative h-11 shrink-0 overflow-hidden
                    rounded-xl border border-teal-400/20
                    bg-teal-600 px-6
                    text-[10px] font-semibold text-white
                    shadow-[0_9px_22px_rgba(13,148,136,0.20)]
                    transition-all duration-300
                    before:pointer-events-none before:absolute
                    before:inset-x-4 before:top-0 before:h-px
                    before:bg-gradient-to-r
                    before:from-transparent before:via-white/60 before:to-transparent
                    hover:-translate-y-0.5
                    hover:bg-teal-500
                    hover:shadow-[0_13px_28px_rgba(13,148,136,0.27)]
                    active:translate-y-0 active:scale-[0.98]
                    disabled:pointer-events-none disabled:opacity-50
                    sm:min-w-[105px]
                  "
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </div>

              <p
                className="
                  px-1.5 pb-1 pt-2.5
                  text-[9px] font-medium leading-5
                  text-gray-400 dark:text-white/25
                "
              >
                Only purchased users can review. Admin approval is required before it appears publicly.
              </p>
            </form>
          )}

          <div className={canReview ? "mt-3 space-y-2.5" : "space-y-2.5"}>
            {reviews.length > 0 ? (
              reviews.slice(0, 6).map((review) => (
                <div
                  key={review._id}
                  className="
                    group relative overflow-hidden rounded-[17px]
                    border border-gray-200/75
                    bg-white/75 p-4
                    shadow-[0_8px_24px_rgba(15,23,42,0.03)]
                    transition-all duration-300
                    before:absolute before:bottom-4 before:left-0 before:top-4
                    before:w-[2px] before:rounded-r-full
                    before:bg-teal-500/35
                    hover:border-teal-500/20
                    hover:bg-white
                    hover:shadow-[0_12px_28px_rgba(15,23,42,0.055)]
                    dark:border-white/[0.05]
                    dark:bg-white/[0.018]
                    dark:before:bg-teal-300/20
                    dark:hover:border-teal-300/[0.10]
                    dark:hover:bg-white/[0.027]
                    dark:hover:shadow-[0_14px_32px_rgba(0,0,0,0.14)]
                  "
                >
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className="
                        text-[11px] font-semibold
                        text-gray-800 dark:text-white/75
                      "
                    >
                      {review.user?.name || "Verified user"}
                    </p>

                    <span
                      className="
                        flex shrink-0 items-center gap-1
                        rounded-lg border border-amber-400/15
                        bg-amber-400/[0.07]
                        px-2 py-1
                        text-[9px] font-semibold text-amber-600
                        dark:border-amber-300/[0.08]
                        dark:bg-amber-300/[0.035]
                        dark:text-amber-300/75
                      "
                    >
                      {review.rating}
                      <AiFillStar className="text-[11px]" />
                    </span>
                  </div>

                  <p
                    className="
                      mt-2.5 text-[11px] font-medium leading-6
                      text-gray-500 dark:text-white/35
                    "
                  >
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <div
                className="
                  rounded-[18px]
                  border border-dashed border-gray-300/80
                  bg-white/40 px-5 py-9 text-center
                  text-[11px] font-medium text-gray-400
                  dark:border-white/[0.07]
                  dark:bg-white/[0.01]
                  dark:text-white/25
                "
              >
                No approved reviews yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

ProductReviews.propTypes = {
  productType: PropTypes.string.isRequired,
  productId: PropTypes.string,
  canReview: PropTypes.bool,
};
