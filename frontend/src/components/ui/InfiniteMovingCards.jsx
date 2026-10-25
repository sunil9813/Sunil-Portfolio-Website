("use client");
import { cn } from "@/utils/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { RiDoubleQuotesL } from "react-icons/ri";

export const InfiniteMovingCards = ({ items, direction = "left", speed = "fast", pauseOnHover = true, className }) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return undefined;

    const duration = speed === "fast" ? "40s" : speed === "normal" ? "80s" : "120s";
    const originalItems = Array.from(scrollerRef.current.children).filter((item) => !item.dataset.clone);
    const duplicatedItems = originalItems.map((item) => {
      const duplicate = item.cloneNode(true);
      duplicate.dataset.clone = "true";
      duplicate.setAttribute("aria-hidden", "true");
      scrollerRef.current.appendChild(duplicate);
      return duplicate;
    });

    containerRef.current.style.setProperty("--animation-direction", direction === "left" ? "forwards" : "reverse");
    containerRef.current.style.setProperty("--animation-duration", duration);
    setStart(true);

    return () => duplicatedItems.forEach((item) => item.remove());
  }, [direction, speed]);

  return (
    <div ref={containerRef} className={cn("scroller relative z-20 w-full overflow-hidden", "[mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]", className)}>
      <ul
        ref={scrollerRef}
        className={cn("flex min-w-full shrink-0 gap-3 flex-nowrap", start && "animate-scroll", pauseOnHover && "hover:[animation-play-state:paused]")}
        style={{
          // Double the width to accommodate duplicated items
          width: `calc(${items.length * 13}rem)`,
        }}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-48 flex-shrink-0 rounded-full !m-0 border border-b-0 border-zinc-200 bg-gradient-to-b from-white to-gray-50 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800"
            key={`${item.name}-${idx}`}
          >
            <div className="relative z-20 flex items-center gap-2 p-2">
              <div className="h-10 flex items-center justify-center rounded p-1">
                <img src={item?.icon} alt={item?.name} className="w-full h-full object-contain rounded-lg" />
              </div>
              <h3 className="text-sm font-medium text-center text-neutral-700 dark:text-gray-300">{item.name}</h3>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const TestimonialCards = ({ items, direction = "left", speed = "fast", pauseOnHover = true, className }) => {
  const reducedMotion = useReducedMotion();
  const duration = speed === "fast" ? "28s" : speed === "normal" ? "48s" : "76s";
  const visibleItems = reducedMotion ? items : [...items, ...items];

  return (
    <div
      className={cn("testimonial-marquee scroller", className)}
      tabIndex={reducedMotion ? 0 : undefined}
      role={reducedMotion ? "region" : undefined}
      aria-label={reducedMotion ? "Scrollable testimonials" : undefined}
      style={{
        "--animation-direction": direction === "left" ? "forwards" : "reverse",
        "--animation-duration": duration,
      }}
    >
      <ul
        className={cn("testimonial-marquee__track", !reducedMotion && "animate-scroll", pauseOnHover && "hover:[animation-play-state:paused]")}
      >
        {visibleItems.map((item, index) => {
          const itemIndex = index % items.length;
          const isDuplicate = index >= items.length;
          const initials = item.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2);

          return (
            <li className="testimonial-card" key={`${item.name}-${index}`} aria-hidden={isDuplicate || undefined}>
              <blockquote className="testimonial-card__quote">
                <div className="testimonial-card__topline">
                  <span className="testimonial-card__mark" aria-hidden="true"><RiDoubleQuotesL /></span>
                  <span className="testimonial-card__number" aria-hidden="true">{String(itemIndex + 1).padStart(2, "0")}</span>
                </div>

                <p>“{item.quote}”</p>

                <footer className="testimonial-card__author">
                  <span className="testimonial-card__avatar" aria-hidden="true">{initials}</span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.title}</small>
                  </span>
                </footer>
              </blockquote>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
