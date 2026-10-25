import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion as Motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiCode, FiMonitor } from "react-icons/fi";
import { bloomConnectionGeometry } from "./projectBloomConnection";
import "./ProjectBloom.scss";

const FRAME_COUNT = 90;
const frameSource = (index) => `/image/home/project-bloom/frame-${String(index).padStart(3, "0")}.webp`;

function BloomWord({ children, progress, index, reduced }) {
  const start = 0.18 + index * 0.025;
  const opacity = useTransform(progress, [start, start + 0.15], [0.55, 1]);
  const y = useTransform(progress, [start, start + 0.15], [7, 0]);
  return <Motion.span className="project-bloom__word" style={reduced ? undefined : { opacity, y }}>{children}</Motion.span>;
}

export const ProjectBloom = ({ connectionRef, artOnly = false, progress }) => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [connection, setConnection] = useState(null);
  const reduced = useReducedMotion();
  const nearby = useInView(sectionRef, { margin: "600px 0px" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: [connection ? `${connection.top}px end` : "start end", "end start"] });
  const sectionProgress = useTransform(scrollYProgress, [0, .68], [0, 1]);
  const bloomProgress = progress ?? sectionProgress;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const conversation = connectionRef?.current;
    const button = conversation?.querySelector('a[href="/contact"]');
    if (!section || !conversation || !button) return;

    let request = 0;
    const measure = () => {
      request = 0;
      const buttonBox = button.getBoundingClientRect();
      const sectionBox = section.getBoundingClientRect();
      const mobile = window.matchMedia("(max-width: 899px)").matches;
      const anchorX = buttonBox.left - sectionBox.left + 16;
      const rootX = mobile ? 24 : anchorX;
      const rootY = sectionBox.top + 24;
      const next = bloomConnectionGeometry({
        width: section.clientWidth,
        rootX,
        rootY,
        sectionTop: sectionBox.top,
        mobile,
      });
      setConnection(previous => previous && Object.keys(next).every(key => typeof next[key] === "number" ? Math.abs(previous[key] - next[key]) < .5 : previous[key] === next[key]) ? previous : next);
    };
    const schedule = () => { if (!request) request = requestAnimationFrame(measure); };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(conversation);
    observer.observe(button);
    observer.observe(section.parentElement);
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(request);
    };
  }, [connectionRef]);

  useEffect(() => {
    if (!nearby || reduced) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!context) return;

    const frames = new Map();
    const pending = new Set();
    const failed = new Set();
    const controller = new AbortController();
    let disposed = false;
    let target = 0;
    let lastDrawn = -1;
    let paintRequest = 0;

    const paint = () => {
      paintRequest = 0;
      if (disposed || !frames.size) return;
      const nearest = [...frames.keys()].reduce((best, index) => Math.abs(index - target) < Math.abs(best - target) ? index : best);
      if (nearest === lastDrawn) return;
      context.drawImage(frames.get(nearest), 0, 0, canvas.width, canvas.height);
      canvas.dataset.ready = "true";
      lastDrawn = nearest;
    };
    const schedulePaint = () => {
      if (!paintRequest && !disposed) paintRequest = requestAnimationFrame(paint);
    };
    const loadWindow = () => {
      if (disposed) return;
      const candidates = [target];
      for (let distance = 1; distance <= 7; distance += 1) candidates.push(target + distance, target - distance);
      for (const index of candidates) {
        if (pending.size >= 3) break;
        if (index < 0 || index >= FRAME_COUNT || frames.has(index) || pending.has(index) || failed.has(index)) continue;
        pending.add(index);
        fetch(frameSource(index), { signal: controller.signal })
          .then((response) => {
            if (!response.ok) throw new Error("Bloom frame unavailable");
            return response.blob();
          })
          .then((blob) => createImageBitmap(blob))
          .then((bitmap) => {
            if (disposed) { bitmap.close(); return; }
            frames.set(index, bitmap);
            // Keep decoded memory bounded even after scrubbing the whole sequence.
            for (const [cachedIndex, cachedBitmap] of frames) {
              if (Math.abs(cachedIndex - target) > 12) { cachedBitmap.close(); frames.delete(cachedIndex); }
            }
            schedulePaint();
          })
          .catch(() => { failed.add(index); })
          .finally(() => { pending.delete(index); loadWindow(); });
      }
    };
    const update = (progress) => {
      target = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(progress * (FRAME_COUNT - 1))));
      loadWindow();
      schedulePaint();
    };
    update(bloomProgress.get());
    const unsubscribe = bloomProgress.on("change", update);
    return () => {
      disposed = true;
      unsubscribe();
      controller.abort();
      cancelAnimationFrame(paintRequest);
      frames.forEach((bitmap) => bitmap.close());
      canvas.removeAttribute("data-ready");
    };
  }, [nearby, reduced, bloomProgress]);

  const word = (text, index) => <BloomWord key={text} progress={scrollYProgress} index={index} reduced={reduced}>{text}</BloomWord>;

  if (artOnly) return (
    <div ref={sectionRef} className="project-bloom__art absolute inset-0" aria-hidden="true">
      <img className="!object-contain !object-center" src={frameSource(89)} alt="" width="1280" height="720" loading="eager" fetchPriority="high" decoding="async" />
      {!reduced && <canvas className="!object-contain !object-center" ref={canvasRef} width="1280" height="720" />}
    </div>
  );

  return (
    <section ref={sectionRef} className={"project-bloom scroll-mt-24 " + (connectionRef ? "!isolation-auto !overflow-visible !bg-transparent" : "")} style={connection ? { height: connection.sectionHeight } : undefined} id="project-bloom" aria-labelledby="project-bloom-title">
      <div className="project-bloom__art z-0" style={connection ? { left: connection.left, top: connection.top, width: connection.width, height: connection.height, right: "auto", bottom: "auto" } : undefined} aria-hidden="true">
        <img className={connection ? "!object-fill !object-top" : undefined} src={frameSource(89)} alt="" width="1280" height="720" loading="lazy" decoding="async" />
        {!reduced && <canvas className={connection ? "!object-fill !object-top" : undefined} ref={canvasRef} width="1280" height="720" />}
      </div>
      <div className={"project-bloom__content z-10 " + (connection ? "max-[899px]:!left-[6%] max-[899px]:!w-[88%] max-[899px]:!max-w-none" : "")} style={connection?.contentTop >= 0 ? { top: connection.contentTop, bottom: "auto", transform: "none" } : undefined}>
        <h2 id="project-bloom-title" aria-label="From your first idea to a full-stack experience.">
          <span className="project-bloom__line text-[.76em] font-medium text-[var(--home-muted)]" aria-hidden="true">
            {word("From", 0)}{word("your", 1)}{word("first", 2)}
            <span className="project-bloom__icon !border-0 !bg-transparent"><FiMonitor /></span>
          </span>
          <span className="project-bloom__line" aria-hidden="true">
            {word("idea", 3)}{word("to", 4)}{word("a", 5)}{word("full-stack", 6)}
          </span>
          <span className="project-bloom__line text-[#c9b9ee]" aria-hidden="true">
            <span className="project-bloom__icon !border-0 !bg-transparent"><FiCode /></span>{word("experience.", 7)}
          </span>
        </h2>
      </div>
    </section>
  );
};
