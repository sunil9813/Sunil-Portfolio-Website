import { useRef } from "react";
import { Expertise } from "@/screen/home/Expertise";
// import { BeyondJustCode } from "@/screen/home/BeyondJustCode";
import { Feature } from "@/screen/home/Feature";
import { Hero } from "@/screen/home/Hero";
import { MoreContent } from "@/screen/home/MoreContent";
// Previous version retained unchanged; uncomment this import and its render to restore it.
// import { Testimonial } from "@/screen/home/Testimonial";
import { TestimonialSpotlight } from "@/screen/home/TestimonialSpotlight";
import { BuildProcess } from "@/screen/home/BuildProcess";
import { ProjectConversation } from "@/screen/home/ProjectConversation";
import { ProjectBloom } from "@/screen/home/ProjectBloom";
import { PortfolioStory } from "@/screen/home/PortfolioStory";
import { NextSteps } from "@/screen/home/NextSteps";
import { Welcome, WhyToSelect } from "@/screen/home/Hero";
import "./Home.scss";

export const Home = () => {
  const conversationRef = useRef(null);
  return (
    <div className="home-page">
      <Hero />
      <Expertise />
      {/* <BeyondJustCode /> */}
      <BuildProcess />
      <PortfolioStory />
      <NextSteps />
      <Feature />
      {/* <Testimonial /> */}
      <TestimonialSpotlight />
      <div className="project-connection relative isolate overflow-clip bg-[var(--home-canvas)]">
        <ProjectConversation sectionRef={conversationRef} />
        <ProjectBloom connectionRef={conversationRef} />
      </div>
      <MoreContent />
      {/* <Welcome /> */}

      {/*  <div className="container">
         <img src="https://framerusercontent.com/images/UXcY8391iq9o8qOfVyOrEUv0dU.png" alt="" />
        <img src="https://framerusercontent.com/images/eVPQSYBoVqwchmpN78sjyYtovY.svg" alt="" />
        <img src="https://deepgram.com/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F96965%2F1721935319-dg-our-values.png&w=1920&q=75" alt="" />
        <img src="https://framerusercontent.com/images/o9rhIMSIT2LufTy4CmVemCryQ0.png" alt="" />
      </div> */}
    </div>
  );
};
