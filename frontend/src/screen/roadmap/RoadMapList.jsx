import { InputLabel } from "@/components/customeUI/Title";
import { bgGradients } from "@/utils";
import React from "react";
import { FaRegStar } from "react-icons/fa";

export const RoadMapList = () => {
  return (
    <>
      <WaveBackground />

      <section className="roadmap">
        <div className="container min-h-screen relative z-10">
          <div className="heading w-2/3 m-auto text-center mt-28 mb-10">
            <h1 className="text-6xl font-semibold gardient-text roadmap-title">Your Journey Starts with Clarity</h1>
            <h2 className="text-2xl textColor font-medium mt-4 text-white">Step into goal-focused paths crafted for skill mastery in coding, language exams, and emerging domains.</h2>
            <p className="label-shine mt-3 !text-white">Trusted by over 925,000 learners shaping their future with purpose and precision.</p>
          </div>

          <div className="grid grid-cols-4 gap-5 mt-16">
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
            <RoadMapCard />
          </div>
        </div>
      </section>
    </>
  );
};

export const RoadMapCard = () => {
  // Random selections
  const randomBg = bgGradients[Math.floor(Math.random() * bgGradients.length)];

  return (
    <div className="roadmap_card hover:scale-105 transition-transform ease-linear backdrop-blur-2xl p-5 relative rounded-2xl text-center overflow-hidden h-full" style={{ background: randomBg }}>
      {/* Content */}
      <div className="roadmap_card_img flexC">
        <img src="https://images.ctfassets.net/ooa29xqb8tix/6FCmyggaMVYfEER3lylc7w/e4ee849e873d32ba6fb4f2c749ff1426/web-app.png?w=400&q=50" alt="" />
      </div>

      <div className="deatils flexC flex-col gap-2">
        <h3 className="text-xl font-semibold text-white">Master AI Prompting for Stunning UI</h3>

        <div>
          <InputLabel>3 min read</InputLabel>
        </div>

        <button className="button !p-0 size-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FaRegStar />
        </button>
      </div>
    </div>
  );
};

export const WaveBackground = () => {
  return (
    <div className="wave-container relative w-full h-full overflow-hidden">
      {/* Define all clipPaths at the root level */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="wave1" clipPathUnits="objectBoundingBox">
            <path
              transform="scale(0.000694, 0.00143)"
              d="M872.997 77.086C660.195 -4.80687 653.497 83.6068 489.997 97.5861C326.497 111.565 310.746 85.3511 145.358 66.805C-20.0297 48.2589 -65.6199 90.9733 -144.742 110.754C-144.742 198.686 -150 739 -150 739L1508.86 739L1508.86 0.403809C1508.86 0.403809 1086.19 159.129 872.997 77.086Z"
            />
          </clipPath>
          <clipPath id="wave2" clipPathUnits="objectBoundingBox">
            <path
              transform="scale(0.000694, 0.00143)"
              d="M1075 93.4995C1018.5 85.9711 978.769 76.9106 916 41.9996C837.581 -1.61518 790.5 0.999031 669 0.999031C547.5 0.999031 484.744 53.7276 398.5 20.9992C328.97 -5.38623 314 40.9991 181.5 20.9991C49 0.999067 0.258789 0.99907 0.258789 0.99907C0.258789 87.821 0.25879 435.567 0.25879 435.567L1504.12 435.567L1504.12 155C1504.12 155 1335.5 111 1278 103C1220.5 95.0004 1203.09 145.713 1167.5 127.499C1126.21 106.367 1131.5 101.028 1075 93.4995Z"
            />
          </clipPath>
          <clipPath id="wave3" clipPathUnits="objectBoundingBox">
            <path
              transform="scale(0.000694, 0.00143)"
              d="M1175.8 62.9028C962.86 -18.9901 952.676 -4.07674 730.548 14.9028C508.419 33.8824 439.745 81.449 274.248 62.9029C108.752 44.3568 21.0657 67.9805 -58.1089 87.7612C-58.1089 175.694 -58.1091 584 -58.1091 584L1464.99 584L1464.99 62.9027C1464.99 62.9027 1389.13 144.946 1175.8 62.9028Z"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Background gradient */}
      <div className="background-gradient absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>

      {/* Decorative elements */}
      <div className="circle circle-1 absolute rounded-full bg-white/10 w-64 h-64 top-1/4 left-1/4"></div>
      <div className="circle circle-2 absolute rounded-full bg-white/5 w-96 h-96 bottom-1/4 right-1/4"></div>
      <div className="circle circle-3 absolute rounded-full bg-white/15 w-32 h-32 top-3/4 right-1/3"></div>

      <div className="pill pill-1 absolute rounded-full bg-white/20 w-48 h-8 top-1/3 left-1/3 rotate-45"></div>
      <div className="pill pill-2 absolute rounded-full bg-white/15 w-32 h-6 bottom-1/3 right-1/3 -rotate-12"></div>
      <div className="pill pill-3 absolute rounded-full bg-white/10 w-24 h-4 top-1/4 right-1/4 rotate-30"></div>

      {/* Waves with clip-path applied */}
      <div className="wave wave-1 absolute bottom-0 left-0 w-full h-1/3 bg-white/10" style={{ clipPath: "url(#wave1)" }}></div>
      <div className="wave wave-2 absolute bottom-0 left-0 w-full h-1/3 bg-white/15" style={{ clipPath: "url(#wave2)" }}></div>
      <div className="wave wave-3 absolute bottom-0 left-0 w-full h-1/3 bg-white/20" style={{ clipPath: "url(#wave3)" }}></div>
    </div>
  );
};
