import { GlowingButton, TertiaryButton } from "@/components/customeUI/Button";
import React from "react";
import { ServiceCard } from "../about/Service";

export const Hero = () => {
  return (
    <>
      <div className="h-full absolute top-0 left-0 w-full ">
        <ChromaticBackground />
      </div>
      <section className="hero relative z-10">
        <div className="container md:mb-20 h-[80vh] md:h-[100vh] relative z-50 flex !-mt-44 flex-col-reverse lg:flex-row lg:!-mt-0 lg:flex lg:items-center">
          <div className="heading w-full my-14 lg:my-0 lg:w-1/2 text-center lg:text-left">
            <GlowingButton className="!text-xs md:text-sm">Let's build something powerful together.</GlowingButton>
            <h1 className="text-xl md:text-2xl lg:text-[45px] font-semibold text-white leading-snug py-2">Bringing Your Ideas to Life with Full Stack Tech</h1>
            <p className="text-inherit text-xs lg:text-m textColor opacity-70">Crafting scalable, secure, and modern web applications using MongoDB, Express, React, and Node.js.</p>
          </div>
          <div className="w-full lg:w-1/2 relative -z-10">
            <img src="../image/hero/image.webp" alt="hero1" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </>
  );
};

export const ChromaticBackground = () => {
  return (
    <div className="framer-15o9q9d" data-framer-name="Background Chromatic">
      <div className="framer-1l2isai" data-framer-name="Backdrop Blur"></div>
      <div className="ssr-variant hidden-19ecmci">
        <div className="framer-zjg9f7" data-framer-name="Chromatic">
          <div>
            <img
              decoding="async"
              sizes="calc(100vw + 673px)"
              srcSet="https://framerusercontent.com/images/XlDDCnoxKwc5TnuyQk6NW4BHuI.png?scale-down-to=512 512w,https://framerusercontent.com/images/XlDDCnoxKwc5TnuyQk6NW4BHuI.png?scale-down-to=1024 1024w,https://framerusercontent.com/images/XlDDCnoxKwc5TnuyQk6NW4BHuI.png?scale-down-to=2048 2048w,https://framerusercontent.com/images/XlDDCnoxKwc5TnuyQk6NW4BHuI.png 2200w"
              src="https://framerusercontent.com/images/XlDDCnoxKwc5TnuyQk6NW4BHuI.png"
              alt="Chromatic"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const WhyToSelect = () => {
  return (
    <div className="container">
      <div className="heading w-full lg:mt-20 lg:w-1/2 m-auto text-center mb-10 relative z-10">
        <h1 className="text-3xl lg:text-6xl font-semibold blog-detail-title">Why Choose Me?</h1>
        <p className="">I combine hands-on experience with a problem-solving mindset to build fast, functional, and future-ready web solutions tailored to your goals.</p>
      </div>
      <ServiceCard />
    </div>
  );
};

export const Welcome = () => {
  return (
    <div className="relative">
      <div className="heading w-2/3 text-center absolute top-1/3 left-0 right-0 mx-auto">
        <p className="textColor">We welcome you to join us.</p>
        <h1 className="text-2xl md:text-6xl mb-5 font-semibold text-white">Start your journey</h1>
        <TertiaryButton>Join Now</TertiaryButton>
      </div>
      <div className="w-full md:h-[60vh] lg:h-[80vh]">
        <video autoPlay muted loop playsInline className="w-full h-full object-contain -z-10">
          <source src="/image/loading.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};
