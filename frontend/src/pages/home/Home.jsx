import { BeyondJustCode } from "@/screen/home/BeyondJustCode";
import { Expertise } from "@/screen/home/Expertise";
import { Feature } from "@/screen/home/Feature";
import { Hero } from "@/screen/home/Hero";
import { MoreContent } from "@/screen/home/MoreContent";
import { Testimonial } from "@/screen/home/Testimonial";
import { BuildProcess } from "@/screen/home/BuildProcess";
import { ProjectConversation } from "@/screen/home/ProjectConversation";
import { PortfolioStory } from "@/screen/home/PortfolioStory";
import { NextSteps } from "@/screen/home/NextSteps";
import { Welcome, WhyToSelect } from "@/screen/home/Hero";
import "./Home.scss";

export const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <WhyToSelect />
      <Expertise />
      <BeyondJustCode />
      <BuildProcess />
      <ProjectConversation />
      <PortfolioStory />
      <NextSteps />
      <Feature />
      <Testimonial />
      <MoreContent />
      <Welcome />

      {/*  <div className="container">
         <img src="https://framerusercontent.com/images/UXcY8391iq9o8qOfVyOrEUv0dU.png" alt="" />
        <img src="https://framerusercontent.com/images/eVPQSYBoVqwchmpN78sjyYtovY.svg" alt="" />
        <img src="https://deepgram.com/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F96965%2F1721935319-dg-our-values.png&w=1920&q=75" alt="" />
        <img src="https://framerusercontent.com/images/o9rhIMSIT2LufTy4CmVemCryQ0.png" alt="" />
      </div> */}
    </div>
  );
};
