import { AnimatePresence, animate, motion as Motion, useIsPresent, useMotionValue, usePresenceData, useReducedMotion } from "framer-motion";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiRefreshCw, FiStar } from "react-icons/fi";
import { RiDoubleQuotesL } from "react-icons/ri";
import testimonialService from "@/redux/services/portfolio/testimonialService";
import { normalizeCustomerReviews, summarizeCustomerReviews } from "./testimonialData";
import { reviewAccent, reviewExcerpt, reviewIndex, reviewPages, reviewSlots, reviewerName, reviewerRole } from "./testimonialSpotlightData";
import "./TestimonialSpotlight.scss";

function ReviewerPortrait({ review, active, reduced }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const hasPhoto = review.avatar && review.avatar !== failedUrl;
  return <div className="testimonial-spotlight__portrait">
    {hasPhoto ? <Motion.img src={review.avatar} alt={reviewerName(review)} width="160" height="160" loading="lazy" decoding="async" draggable="false" onError={() => setFailedUrl(review.avatar)} initial={false} animate={{ scale: active || reduced ? 1 : 1.08 }} transition={{ duration: reduced ? 0 : .7, ease: [.16, 1, .3, 1] }} />
      : <span role="img" aria-label={reviewerName(review) + ": no photo provided"}>{review.initials}</span>}
  </div>;
}

function ReviewSlide({ review, index, total, offset, position, cardWidth, stride, direction, reduced }) {
  const present = useIsPresent();
  const presenceDirection = usePresenceData();
  const departure = typeof presenceDirection === "number" ? presenceDirection : direction;
  const active = offset === 0;
  const available = active && present;
  const theme = reviewAccent(index);
  const recede = reduced ? 0 : offset * -7;

  return <Motion.article className="testimonial-spotlight__card" data-active={available} data-review-position={position} data-review-id={review.id}
    style={{ width: cardWidth, marginLeft: -cardWidth / 2, "--review-accent": theme.accent, "--review-wash": theme.wash }}
    aria-roledescription="slide" aria-label={`${index + 1} of ${total}: ${reviewerName(review)}`} aria-hidden={!available} inert={!available ? true : undefined}
    initial={{ x: reduced ? offset * stride : (offset + direction) * stride, opacity: reduced ? 1 : 0, scale: active ? 1 : .93, rotateY: recede, z: active || reduced ? 0 : -35 }}
    animate={{ x: offset * stride, opacity: active ? 1 : .24, scale: active ? 1 : .93, rotateY: recede, z: active || reduced ? 0 : -35 }}
    exit={{ x: reduced ? offset * stride : -departure * stride * 2, opacity: 0, scale: .93, z: reduced ? 0 : -55 }}
    transition={reduced ? { duration: .12, x: { duration: 0 }, scale: { duration: 0 }, rotateY: { duration: 0 }, z: { duration: 0 } } : { duration: .65, ease: [.16, 1, .3, 1], opacity: { duration: .3 } }}>
    <aside className="testimonial-spotlight__person">
      <ReviewerPortrait review={review} active={active} reduced={reduced} />
      {Number.isFinite(review.rating) && <div className="testimonial-spotlight__rating"><span><FiStar aria-hidden="true" /><strong>{review.rating.toFixed(1)}</strong><span>/ 5</span></span><small>{review.isDemo ? "Demo rating" : "Customer rating"}</small></div>}
      <Link className="testimonial-spotlight__full" to={"/customer-feedback#review-" + review.id} aria-label={`Read full ${review.isDemo ? "demo " : ""}review from ${reviewerName(review)}`}><span>Full review</span><span className="testimonial-spotlight__full-arrow" aria-hidden="true"><FiArrowRight /><FiArrowRight /></span></Link>
    </aside>
    <div className="testimonial-spotlight__body">
      <div className="testimonial-spotlight__identity"><div><h3 dir="auto">{reviewerName(review)}</h3>{reviewerRole(review) && <p dir="auto">{reviewerRole(review)}</p>}{review.isDemo && <span className="testimonial-spotlight__demo">Demo review · fictional</span>}</div><RiDoubleQuotesL className="testimonial-spotlight__quote-mark" aria-hidden="true" /></div>
      <Motion.blockquote dir="auto" initial={false} animate={{ y: active || reduced ? 0 : 7, opacity: active ? 1 : .8 }} transition={{ duration: reduced ? .12 : .45, delay: active && !reduced ? .08 : 0, ease: [.16, 1, .3, 1] }}>“{reviewExcerpt(review)}”</Motion.blockquote>
      <div className="testimonial-spotlight__source"><span>{review.isDemo ? "Fictional preview" : "Customer feedback"}</span>{review.date && <time dateTime={review.date}>{new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(review.date))}</time>}</div>
    </div>
  </Motion.article>;
}

export function TestimonialSpotlight() {
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
  return <TestimonialSpotlightReader reviews={reviews} status={result.status} onRetry={() => setAttempt(value => value + 1)} />;
}

export function TestimonialSpotlightReader({ reviews = [], status = "ready", onRetry }) {
  const reduced = useReducedMotion();
  const carouselId = useId();
  const stageRef = useRef(null);
  const pointer = useRef(null);
  const dragX = useMotionValue(0);
  const [cursor, setCursor] = useState(0);
  const [direction, setDirection] = useState(1);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(444);
  const ordered = useMemo(() => [...reviews.filter(review => !review.isDemo), ...reviews.filter(review => review.isDemo)], [reviews]);
  const summary = useMemo(() => summarizeCustomerReviews(ordered), [ordered]);
  const total = ordered.length;
  const current = reviewIndex(cursor, total);
  const cardWidth = width ? width <= 760 ? Math.max(240, width - 40) : Math.min(820, width * .76) : 820;
  const stride = cardWidth + (width <= 760 ? 20 : 40);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => setWidth(stage.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [status, total]);

  useLayoutEffect(() => {
    const card = stageRef.current?.querySelector(`[data-review-position="${cursor}"][data-active="true"]`);
    if (!card) return;
    const measure = () => setHeight(card.offsetHeight + 24);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(card);
    return () => observer.disconnect();
  }, [cursor, status, width, ordered]);

  useEffect(() => () => dragX.stop(), [dragX]);

  const move = delta => {
    if (total < 2 || !delta) return;
    setDirection(Math.sign(delta));
    setCursor(value => value + delta);
  };
  const goTo = index => {
    let delta = index - current;
    if (delta > total / 2) delta -= total;
    if (delta < -total / 2) delta += total;
    move(delta);
  };
  const settleDrag = () => {
    if (reduced) { dragX.set(0); return; }
    animate(dragX, 0, { type: "spring", stiffness: 260, damping: 30 });
  };
  const cancelGesture = () => {
    if (!pointer.current) return;
    pointer.current = null;
    if (stageRef.current) delete stageRef.current.dataset.dragging;
    settleDrag();
  };
  const finishGesture = event => {
    const start = pointer.current;
    pointer.current = null;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.vertical && Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.2) move(dx < 0 ? 1 : -1);
    settleDrag();
  };

  return <section id="testimonials" className="testimonial-home testimonial-spotlight" aria-labelledby="testimonial-spotlight-title">
    <div className="container testimonial-spotlight__heading"><h2 id="testimonial-spotlight-title">What my clients say.</h2><p>Feedback from the people behind the work.</p></div>
    {status !== "ready" || !total ? <div className="container testimonial-spotlight__state" role="status" aria-busy={status === "loading"}>
      {status === "loading" ? <><p>Loading customer reviews…</p><div className="testimonial-spotlight__skeleton" aria-hidden="true" /></>
        : status === "error" ? <><h3>Reviews couldn’t load.</h3><p>Please try again to see the latest feedback.</p><button type="button" disabled={!onRetry} onClick={onRetry}><FiRefreshCw aria-hidden="true" />Try again</button></>
          : <><h3>Customer stories are on their way.</h3><p>Reviews will appear here as they’re added.</p></>}
    </div> : <>
      <Motion.div ref={stageRef} id={carouselId} className="testimonial-spotlight__stage" role="region" aria-roledescription="carousel" aria-label="Customer feedback" tabIndex={0}
        animate={{ height }} transition={{ duration: reduced ? 0 : .3, ease: [.16, 1, .3, 1] }}
        onKeyDown={event => {
          if (event.target !== event.currentTarget || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          if (event.key === "Home" || event.key === "End") goTo(event.key === "Home" ? 0 : total - 1);
          else move(event.key === "ArrowRight" ? 1 : -1);
        }}
        onPointerDown={event => {
          if (total < 2 || event.button !== 0 || event.target.closest("a,button")) return;
          dragX.stop();
          dragX.set(0);
          pointer.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          const start = pointer.current;
          if (!start || start.vertical) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (!start.horizontal) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
            if (Math.abs(dy) > Math.abs(dx) * 1.2) { start.vertical = true; return; }
            if (Math.abs(dx) < Math.abs(dy) * 1.2) return;
            start.horizontal = true;
            event.currentTarget.dataset.dragging = "true";
          }
          if (!reduced) {
            const bound = Math.min(180, stride * .33);
            dragX.set(Math.max(-bound, Math.min(bound, dx * .58)));
          }
        }}
        onPointerUp={finishGesture} onPointerCancel={cancelGesture} onLostPointerCapture={cancelGesture}>
        <Motion.div className="testimonial-spotlight__rail" style={{ x: dragX }}>
          <AnimatePresence initial={false} custom={direction}>
            {reviewSlots(cursor, total).map(({ position, offset, index }) => <ReviewSlide key={position} review={ordered[index]} index={index} total={total} offset={offset} position={position} cardWidth={cardWidth} stride={stride} direction={direction} reduced={Boolean(reduced)} />)}
          </AnimatePresence>
        </Motion.div>
      </Motion.div>
      <div className="container testimonial-spotlight__footer" style={{ "--review-accent": reviewAccent(current).accent }}>
        <div className="testimonial-spotlight__navigation"><button type="button" aria-label="Previous testimonial" aria-controls={carouselId} disabled={total < 2} onClick={() => move(-1)}><FiChevronLeft aria-hidden="true" /></button>
          <div className="testimonial-spotlight__pages" role="group" aria-label="Choose a testimonial">{reviewPages(current, total).map(index => <button key={index} type="button" aria-label={`Show testimonial ${index + 1}: ${reviewerName(ordered[index])}`} aria-current={index === current ? "true" : undefined} aria-controls={carouselId} onClick={() => goTo(index)}><span /></button>)}</div>
          <button type="button" aria-label="Next testimonial" aria-controls={carouselId} disabled={total < 2} onClick={() => move(1)}><FiChevronRight aria-hidden="true" /></button>
        </div>
        <p className="testimonial-spotlight__position" role="status" aria-live="polite" aria-atomic="true">{current + 1} <span>of {total}</span></p>
        <div className="testimonial-spotlight__closing"><div>{summary.average !== null && <p><strong>{summary.average.toFixed(1)} / 5</strong> from {summary.rated} customer {summary.rated === 1 ? "review" : "reviews"}</p>}{summary.demo > 0 && <p className="testimonial-spotlight__disclosure">Includes {summary.demo} fictional demo reviews. Demo ratings are excluded.</p>}</div><Link to="/customer-feedback">All reviews<FiArrowRight aria-hidden="true" /></Link></div>
      </div>
    </>}
  </section>;
}
