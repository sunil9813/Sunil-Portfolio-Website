import { motion as Motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight, FiCoffee, FiMessageCircle, FiRefreshCw, FiUsers } from "react-icons/fi";
import testimonialService from "@/redux/services/portfolio/testimonialService";
import { normalizeCustomerReviews, summarizeCustomerReviews } from "./testimonialData";
import "./Testimonial.scss";

const displayName = review => review.isDemo ? review.name.replace(/ \(Demo\)$/, "") : review.name;
const displayRole = review => review.isDemo ? review.title.replace(/ at Fictional preview project$/, "") : review.title;
const previewQuote = review => {
  const content = review.isDemo ? review.quote.replace(/^Demo review — /, "") : review.quote;
  if (Array.from(content).length <= 200) return content;
  const cut = Array.from(content).slice(0, 200).join("");
  const boundary = cut.lastIndexOf(" ");
  return cut.slice(0, boundary > 140 ? boundary : cut.length).trimEnd() + "…";
};

const ReviewAvatar = ({ review }) => {
  const [failedUrl, setFailedUrl] = useState(null);
  return <span className="testimonial-deck__avatar" aria-hidden="true">
    {review.avatar && failedUrl !== review.avatar
      ? <img src={review.avatar} alt="" width="96" height="96" loading="lazy" decoding="async" draggable="false" onError={() => setFailedUrl(review.avatar)} />
      : <span>{review.initials}</span>}
  </span>;
};

export const Testimonial = () => {
  const [result, setResult] = useState({ status: "loading", data: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setResult({ status: "loading", data: null });
    testimonialService.getAllTestimonial({ signal: controller.signal, timeout: 15000 })
      .then(data => { if (!controller.signal.aborted) setResult({ status: "ready", data }); })
      .catch(() => { if (!controller.signal.aborted) setResult({ status: "error", data: null }); });
    return () => controller.abort();
  }, [attempt]);
  const reviews = useMemo(() => normalizeCustomerReviews(result.data), [result.data]);
  return <TestimonialReader reviews={reviews} status={result.status} onRetry={() => setAttempt(value => value + 1)} />;
};

export const TestimonialReader = ({ reviews = [], status = "ready", onRetry }) => {
  const reduced = useReducedMotion();
  const carouselId = useId();
  const viewportRef = useRef(null);
  const pointer = useRef(null);
  const [position, setPosition] = useState({ previous: false, next: false, progress: 0, current: 0 });
  const summary = useMemo(() => summarizeCustomerReviews(reviews), [reviews]);

  const measure = useCallback(() => {
    const element = viewportRef.current;
    if (!element) return;
    const maximum = Math.max(0, element.scrollWidth - element.clientWidth);
    const first = element.querySelector("[data-review-card]");
    const stride = first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap || 0) : 1;
    const left = Math.max(0, Math.min(maximum, element.scrollLeft));
    const next = { previous: left > 2, next: left < maximum - 2, progress: maximum ? left / maximum : 1, current: Math.min(reviews.length, Math.round(left / stride)) };
    setPosition(previous => previous.previous === next.previous && previous.next === next.next && previous.current === next.current && Math.abs(previous.progress - next.progress) < .002 ? previous : next);
  }, [reviews.length]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [measure, status]);

  const navigate = direction => {
    const element = viewportRef.current;
    const first = element?.querySelector("[data-review-card]");
    if (!element || !first) return;
    const stride = first.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap || 0);
    const target = direction === "start" ? 0 : direction === "end" ? element.scrollWidth : (Math.round(element.scrollLeft / stride) + direction) * stride;
    element.scrollTo({ left: Math.max(0, Math.min(element.scrollWidth - element.clientWidth, target)), behavior: reduced ? "instant" : "smooth" });
  };

  const finishDrag = event => {
    pointer.current = null;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <section id="testimonials" className="testimonial-home testimonial-deck" aria-labelledby="testimonial-home-title">
    <header className="testimonial-deck__heading">
      <span className="testimonial-deck__label"><FiUsers aria-hidden="true" />Testimonials</span>
      <h2 id="testimonial-home-title">What my clients <span>say.</span></h2>
      <p>Real perspectives from the people behind the projects.</p>
    </header>
    {status === "loading" ? <div className="testimonial-deck__state" role="status" aria-busy="true"><p>Loading customer reviews…</p><div className="testimonial-deck__skeleton" aria-hidden="true"><i /><i /><i /></div></div>
      : status === "error" ? <div className="testimonial-deck__state" role="status"><h3>Reviews couldn’t load.</h3><p>Please try again. You can still explore the rest of the portfolio.</p><button className="testimonial-deck__retry" onClick={onRetry}><FiRefreshCw aria-hidden="true" />Try again</button></div>
        : !reviews.length ? <div className="testimonial-deck__state" role="status"><h3>Customer stories are on their way.</h3><p>Reviews will appear here as they’re added.</p></div>
          : <>
            <div ref={viewportRef} id={carouselId} className="testimonial-deck__viewport" role="region" aria-roledescription="carousel" aria-label="Customer reviews" tabIndex={0} onScroll={measure}
              onKeyDown={event => {
                if (event.target !== event.currentTarget || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                navigate(event.key === "Home" ? "start" : event.key === "End" ? "end" : event.key === "ArrowRight" ? 1 : -1);
              }}
              onPointerDown={event => {
                if (event.pointerType !== "mouse" || event.button !== 0 || event.target.closest("a,button")) return;
                pointer.current = { x: event.clientX, left: event.currentTarget.scrollLeft };
              }}
              onPointerMove={event => {
                if (!pointer.current) return;
                const distance = event.clientX - pointer.current.x;
                if (Math.abs(distance) < 6 && !event.currentTarget.dataset.dragging) return;
                event.currentTarget.dataset.dragging = "true";
                if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
                event.currentTarget.scrollLeft = pointer.current.left - distance;
              }}
              onPointerUp={finishDrag} onPointerCancel={finishDrag} onPointerLeave={event => { if (!event.currentTarget.dataset.dragging) pointer.current = null; }} onLostPointerCapture={() => { pointer.current = null; }}>
              {reviews.map((review, index) => <Motion.article key={review.id} data-review-card className="testimonial-deck__card" aria-roledescription="slide" aria-label={(index + 1) + " of " + reviews.length + ": " + (review.isDemo ? "Demo review" : "Review") + " from " + displayName(review)}
                initial={{ y: reduced ? 0 : 28 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: reduced ? 0 : .6, delay: reduced ? 0 : (index % 4) * .06, ease: [.16, 1, .3, 1] }}>
                <div className="testimonial-deck__card-top"><ReviewAvatar review={review} />
                  <Link className="testimonial-deck__review-link" to={"/customer-feedback#review-" + review.id} aria-label={"Read full " + (review.isDemo ? "demo " : "") + "review from " + displayName(review)}><FiMessageCircle aria-hidden="true" /><span>Review</span><FiArrowUpRight aria-hidden="true" /></Link>
                </div>
                <div className="testimonial-deck__identity"><h3 dir="auto">{displayName(review)}</h3>{displayRole(review) && <p dir="auto">{displayRole(review)}</p>}{review.isDemo && <span className="testimonial-deck__demo">Demo review · fictional</span>}</div>
                <blockquote dir="auto">{previewQuote(review)}</blockquote>
              </Motion.article>)}
              <article data-review-card className="testimonial-deck__card testimonial-deck__invitation" aria-label="Start your project">
                <span className="testimonial-deck__coffee" aria-hidden="true"><FiCoffee /></span>
                <h3>Your next chapter<br />could start here.</h3><p>Let’s build something<br />worth talking about.</p>
                <Link to="/contact">Let’s talk<FiArrowUpRight aria-hidden="true" /></Link>
              </article>
            </div>
            <div className="testimonial-deck__footer">
              <div className="testimonial-deck__navigation">
                <div className="testimonial-deck__progress" aria-hidden="true"><span style={{ transform: `scaleX(${.08 + position.progress * .92})` }} /></div>
                <div className="testimonial-deck__arrows"><button type="button" aria-label="Previous review" aria-controls={carouselId} disabled={!position.previous} onClick={() => navigate(-1)}><FiChevronLeft aria-hidden="true" /></button><button type="button" aria-label="Next review" aria-controls={carouselId} disabled={!position.next} onClick={() => navigate(1)}><FiChevronRight aria-hidden="true" /></button></div>
              </div>
              <div className="testimonial-deck__closing">
                <div>{summary.average !== null && <p className="testimonial-deck__summary"><strong>{summary.average.toFixed(1)} / 5</strong> from {summary.rated} customer {summary.rated === 1 ? "review" : "reviews"}</p>}{summary.demo > 0 && <p className="testimonial-deck__disclosure">Includes {summary.demo} fictional demo reviews for preview. Demo ratings are excluded.</p>}</div>
                <Link to="/customer-feedback" className="testimonial-deck__all">All reviews<FiArrowUpRight aria-hidden="true" /></Link>
              </div>
              <span className="testimonial-deck__sr" role="status">{position.current < reviews.length ? `Review ${position.current + 1} of ${reviews.length}` : "Start your project"}</span>
            </div>
          </>}
  </section>;
};
