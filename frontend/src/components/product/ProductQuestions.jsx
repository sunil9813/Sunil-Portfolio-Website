import PropTypes from "prop-types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { REACT_APP_BACKEND_URL } from "@/utils/api";

export const ProductQuestions = ({ productType, productId, isLoggedIn = false }) => {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestions = async () => {
    if (!productType || !productId) return;

    const response = await axios.get(`${REACT_APP_BACKEND_URL}/business/questions/${productType}/${productId}`);

    setQuestions(response.data?.questions || []);
  };

  useEffect(() => {
    fetchQuestions().catch(() => {});
  }, [productType, productId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please login to ask a question.");
      return;
    }

    if (!question.trim()) {
      toast.error("Please write your question.");
      return;
    }

    try {
      setIsSubmitting(true);

      await axios.post(`${REACT_APP_BACKEND_URL}/business/questions/${productType}/${productId}`, { question });

      setQuestion("");
      toast.success("Question submitted.");
      await fetchQuestions();
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to submit question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="
        relative isolate overflow-hidden rounded-[26px]
        border border-gray-200/80
        bg-gradient-to-br from-white via-white to-teal-50/25
        p-5
        before:pointer-events-none before:absolute before:inset-x-12 before:top-0
        before:-z-10 before:h-px before:bg-gradient-to-r
        before:from-transparent before:via-teal-400/60 before:to-transparent
        after:pointer-events-none after:absolute after:-right-24 after:-top-28
        after:-z-10 after:size-72 after:rounded-full
        after:bg-teal-400/[0.07] after:blur-[90px]
        dark:border-white/[0.065]
        dark:bg-[linear-gradient(145deg,#191c21_0%,#16191e_52%,#15181d_100%)]
        dark:before:via-teal-300/25
        dark:after:bg-teal-300/[0.035]
        sm:p-6
      "
    >
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p
            className="
              text-[9px] font-semibold uppercase tracking-[0.22em]
              text-teal-600 dark:text-teal-200/55
            "
          >
            Product Q&amp;A
          </p>

          <h3
            className="
              mt-2 text-xl font-semibold tracking-[-0.035em]
              text-gray-950 dark:text-white/90
            "
          >
            Ask before you buy
          </h3>

          <p
            className="
              mt-1.5 text-[11px] font-medium leading-5
              text-gray-500 dark:text-white/35
            "
          >
            Admin answers appear publicly for everyone.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="
          relative z-10 mt-5 flex flex-col gap-2
          rounded-[17px] border border-gray-200/80
          bg-gray-50/80 p-1.5
          shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]
          transition-colors duration-300
          focus-within:border-teal-500/30
          focus-within:bg-white
          dark:border-white/[0.06]
          dark:bg-white/[0.025]
          dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
          dark:focus-within:border-teal-300/[0.14]
          dark:focus-within:bg-white/[0.035]
          sm:flex-row
        "
      >
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about resources, access, updates..."
          className="
            h-11 min-w-0 flex-1 rounded-xl
            border border-transparent bg-transparent
            px-3.5 text-[11px] font-medium
            text-gray-700 outline-none
            placeholder:text-gray-400
            dark:text-white/70
            dark:placeholder:text-white/20
          "
        />

        <button
          disabled={isSubmitting}
          className="
            relative h-11 shrink-0 overflow-hidden rounded-xl
            border border-teal-400/20
            bg-gradient-to-b from-teal-500 to-teal-600
            px-6 text-[10px] font-semibold text-white
            shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_rgba(13,148,136,0.18)]
            transition-all duration-300
            before:pointer-events-none before:absolute before:inset-x-4 before:top-0
            before:h-px before:bg-gradient-to-r
            before:from-transparent before:via-white/60 before:to-transparent
            hover:-translate-y-0.5
            hover:from-teal-400 hover:to-teal-500
            hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_14px_28px_rgba(13,148,136,0.25)]
            active:translate-y-0 active:scale-[0.98]
            disabled:pointer-events-none disabled:opacity-50
          "
        >
          {isSubmitting ? "Sending..." : "Ask question"}
        </button>
      </form>

      <div className="relative z-10 mt-5 space-y-3">
        {questions.length > 0 ? (
          questions.map((item) => (
            <div
              key={item._id}
              className="
                group relative overflow-hidden rounded-[18px]
                border border-gray-200/75
                bg-white/70 p-4
                shadow-[0_8px_24px_rgba(15,23,42,0.035)]
                transition-all duration-300
                before:pointer-events-none before:absolute before:bottom-3
                before:left-0 before:top-3 before:w-px
                before:bg-gradient-to-b before:from-transparent
                before:via-teal-500/50 before:to-transparent
                hover:border-teal-500/20
                hover:bg-white
                hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]
                dark:border-white/[0.05]
                dark:bg-white/[0.018]
                dark:shadow-none
                dark:before:via-teal-300/25
                dark:hover:border-teal-300/[0.10]
                dark:hover:bg-white/[0.028]
              "
            >
              <p
                className="
                  text-[11px] font-bold leading-5
                  text-gray-800 dark:text-white/75
                "
              >
                Q: {item.question}
              </p>

              {item.answer ? (
                <p
                  className="
                    mt-2.5 border-t border-gray-200/70 pt-2.5
                    text-[11px] leading-6
                    text-gray-500
                    dark:border-white/[0.045]
                    dark:text-white/35
                  "
                >
                  <span
                    className="
                      mr-1 font-semibold
                      text-teal-700 dark:text-teal-200/65
                    "
                  >
                    Admin:
                  </span>

                  {item.answer}
                </p>
              ) : (
                <p
                  className="
                    mt-2.5 w-fit rounded-lg
                    border border-amber-400/15
                    bg-amber-400/[0.07]
                    px-2.5 py-1.5
                    text-[9px] font-bold
                    text-amber-700
                    dark:border-amber-300/[0.08]
                    dark:bg-amber-300/[0.035]
                    dark:text-amber-200/60
                  "
                >
                  Waiting for admin answer.
                </p>
              )}
            </div>
          ))
        ) : (
          <div
            className="
              rounded-[18px] border border-dashed
              border-gray-300/80
              bg-gray-50/45 p-7 text-center
              text-[11px] font-medium text-gray-400
              dark:border-white/[0.07]
              dark:bg-white/[0.012]
              dark:text-white/25
            "
          >
            No questions yet.
          </div>
        )}
      </div>
    </section>
  );
};

ProductQuestions.propTypes = {
  productType: PropTypes.string.isRequired,
  productId: PropTypes.string,
  isLoggedIn: PropTypes.bool,
};
