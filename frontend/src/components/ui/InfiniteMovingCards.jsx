("use client");
import { cn } from "@/utils/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { HeadingThree } from "../customeUI/Title";

export const InfiniteMovingCards = ({ items, direction = "left", speed = "fast", pauseOnHover = true, className }) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    function addAnimation() {
      if (!containerRef.current || !scrollerRef.current) return;

      const scrollerContent = Array.from(scrollerRef.current.children);

      // Double the items for seamless looping
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current.appendChild(duplicatedItem);
      });

      getDirection();
      getSpeed();
      setStart(true);
    }

    addAnimation();
  }, []);

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--animation-direction", direction === "left" ? "forwards" : "reverse");
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      let duration;
      switch (speed) {
        case "fast":
          duration = "40s";
          break;
        case "normal":
          duration = "80s";
          break;
        case "slow":
          duration = "120s";
          break;
        default:
          duration = "80s";
      }
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  };

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
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div ref={containerRef} className={cn("scroller relative z-20 container overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]", className)}>
      <ul ref={scrollerRef} className={cn("flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-2", start && "animate-scroll", pauseOnHover && "hover:[animation-play-state:paused]")}>
        {items.map((item) => (
          <li className="relative w-[350px] max-w-full shrink-0 rounded-2xl black-custome-box px-8 py-6" key={item.name}>
            <div className=" absolute top-0 left-0 -z-10">
              <img src="../image/tesbg.avif" alt="tesbg" className=" invert opacity-10" />
            </div>
            <blockquote>
              <div aria-hidden="true" className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"></div>
              <div className="flex flex-col gap-6">
                <div className="avatar size-16 rounded-full">
                  <img src="https://images.ui8.net/uploads/softselect_wrappixel_logo_560x560_1722510701565.jpg" alt="" className="w-full h-full rounded-full" />
                </div>
                <div className="">
                  <HeadingThree>{item.name}</HeadingThree>
                  <span className="text-sm leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">{item.title}</span>
                </div>
              </div>
              <p className="relative z-20 text-sm leading-[1.6] font-normal text-neutral-800 dark:text-gray-100 my-5">"{item.quote}"</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="avatar size-8 rounded-full">
                  <img src="https://images.ui8.net/uploads/softselect_wrappixel_logo_560x560_1722510701565.jpg" alt="" className="w-full h-full rounded-full" />
                </div>
                <span className="text-sm leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">{item.name}</span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
