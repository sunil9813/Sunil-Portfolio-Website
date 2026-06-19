import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { getIconUrls, iconMapping } from "@/utils";
import { DotBackground } from "@/components/customeUI/DotBackground";

const generateDummyImages = (count) => {
  // Get a subset of iconMapping based on the requested count
  const selectedIcons = iconMapping.slice(0, count);

  return selectedIcons.map((icon, i) => {
    // Get all possible URLs for this icon
    const urls = getIconUrls(icon.value);
    // Select the first URL that exists (or default to the first one)
    const url = urls[0]; // In a real app, you might want to check which URLs actually exist

    return {
      id: i + 1,
      url: url,
      title: icon.label,
      description: `This is the ${icon.label} technology icon`,
      value: icon.value,
    };
  });
};

export const ProjectList = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Generate 6 dummy images when component mounts
    setImages(generateDummyImages(300));
  }, []);

  return (
    <>
      <DotBackground />
      <section className="project-list">
        <div className="absolute -top-[70%] lg:-right-[30%] z-10">
          <img src="../image/bg/projectbg.avif" alt="projectbg" />
        </div>
        <div className="beam-light absolute top-0 left-[15%] z-10">
          <img src="../image/bg/beamlight.svg" alt="beamlight" className="h-full w-full object-cover" />
        </div>

        <div className="image-suffle">
          <div className="image-stack-top">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="stacked-image-top"
                style={{
                  "--i": index,
                  // Custom properties for animation
                  "--start-x": "0px",
                  "--end-x": `${(index - 2.5) * 60}px`,
                  "--rotation": `${(index - 2.5) * 15}deg`,
                }}
              >
                <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="project-bg">
          <div className="absolute inset-0">
            <span className="absolute -left-[10%] top-1/2 block aspect-[1.5489] w-[87.5%] -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] rounded-[100%] bg-[#2B2B44] opacity-30 blur-3xl"></span>
            <span className="absolute -bottom-[10%] -left-[30%] block aspect-[1.3555] w-[69%] -rotate-45 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,#268D8C_0%,rgba(38,141,140,0)_100%)] opacity-40 blur-3xl"></span>
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <span className="absolute -right-[10%] bottom-1/2 block aspect-[1.5489] w-[87.5%]  -rotate-[30deg] rounded-[100%] bg-[#2B2B44] opacity-30 blur-3xl"></span>
            <span className="absolute -bottom-[30%] right-[10%] block aspect-[1.3555] w-[69%] -rotate-45 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,#268D8C_0%,rgba(38,141,140,0)_100%)] opacity-40 blur-3xl"></span>
          </div>
        </div>
        <div className="absolute -bottom-14 w-full h-24 bg-[#13161C]  blur-xl"></div>

        <div className="container relative z-50">
          <div className="heading w-full lg:w-2/3 m-auto text-center mt-32 mb-16">
            <h1 className="text-2xl md:text-3xl lg:text-6xl font-semibold gardient-text">Project Showcase</h1>
            <h2 className="text-sm md:text-lg lg:text-2xl textColor font-medium heading-gardient mb-2">Explore 10,990 projects to boost your full-stack skills.</h2>
            <p className="none text-xs md:text-sm textColor opacity-70">Collaborate with 925,459 Developers Worldwide—Build, Deploy, and Innovate Together.</p>
          </div>

          {/* new bg */}
          {/*   <div className="framer-15ykzzss h-[70vh] overflow-hidden">
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-[50px]">
              <img src="../image/projectbg.png" alt="projectbg" />
            </div>
          </div> */}

          {/* end new bg */}
          <div className="relative z-50">
            <ProjectCard />
          </div>
        </div>
      </section>
    </>
  );
};
