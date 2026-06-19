import { HeadingThree, InputLabel } from "@/components/customeUI/Title";
import { FeatureImg1, FeatureImg2, FeatureImg3, FeatureImg4 } from "@/utils/SVG";
import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineFeed } from "react-icons/md";

export const Feature = () => {
  return (
    <>
      <section className="feature py-10">
        <div className="container">
          <div className="heading w-full lg:w-2/3 m-auto text-center mb-10">
            <h1 className="text-xl md:text-3xl lg:text-6xl font-semibold blog-detail-title">Your Reading. Reimagined.</h1>
            <p>Packed with practical tools, thoughtful design, and powerful functionality to elevate your digital experience.</p>
          </div>

          <div className="content text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="feature-box overflow-hidden">
                <div className="h-48 w-full">
                  <FeatureImg1 />
                </div>
                <div className="p-5 pt-3">
                  <HeadingThree className="pb-2">Privacy-Preserving Development</HeadingThree>
                  <InputLabel>User-first mindset — no personal data stored unnecessarily. Every project respects privacy by design.</InputLabel>
                </div>
              </div>
              <div className="feature-box overflow-hidden">
                <div className="h-48 w-full">
                  <FeatureImg2 />
                </div>
                <div className="p-5 pt-3">
                  <HeadingThree className="pb-2">Efficient & Scalable Code</HeadingThree>
                  <InputLabel>From quick features to complex systems, I build with flexibility — whether you need a high-level view or detailed functionality.</InputLabel>
                </div>
              </div>
              <div className="feature-box overflow-hidden">
                <div className="h-48 w-full">
                  <FeatureImg3 />
                </div>
                <div className="p-5 pt-3">
                  <HeadingThree className="pb-2">Unified Tech Stack Expertise</HeadingThree>
                  <InputLabel>One streamlined stack — frontend to backend — no need to juggle multiple tools or teams. I handle the full flow.</InputLabel>
                </div>
              </div>
              <div className="feature-box overflow-hidden">
                <div className="h-48 w-full">
                  <FeatureImg4 />
                </div>
                <div className="p-5 pt-3">
                  <HeadingThree className="pb-2"> Modular, Reusable Components</HeadingThree>
                  <InputLabel>Built for clarity and reuse — clean code, small modules, and scalable features ready for any project.</InputLabel>
                </div>
              </div>
            </div>
            <div className="md:flex md:justify-between gap-3 my-3">
              <div className="mb-3 md:mb-0 feature-box p-10 w-full md:w-1/2">
                <button className="button flexC gap-1">
                  <FaRegUserCircle /> <span>Personalized</span>
                </button>
                <h3 className="mt-3 bg-gradient-to-r from-[#0085FF] to-white to-50% bg-clip-text text-center text-2xl font-medium text-transparent">Smart Content Delivery</h3>
                <InputLabel> Built with MERN to auto-adapt content based on user context — no manual setup, just seamless discovery.</InputLabel>
                <div className="img h-96 mt-8">
                  <img src="../image/home/f1.webp" alt="" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="feature-box p-10 w-full md:w-1/2">
                <button className="button flexC gap-1">
                  <MdOutlineFeed /> <span>Inspiring</span>
                </button>
                <h3 className="mt-3 bg-gradient-to-r from-[#FFA113] to-white to-50% bg-clip-text text-center text-2xl font-medium text-transparent">Intelligent Content Suggestions</h3>
                <InputLabel>Empowering users to explore more through smart recommendations — seamlessly integrated using MERN technologies.</InputLabel>
                <div className="img h-96 mt-8">
                  <img src="../image/home/f2.webp" alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
