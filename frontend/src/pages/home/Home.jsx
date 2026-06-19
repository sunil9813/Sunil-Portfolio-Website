import { BeyondJustCode, Expertise, Feature, Hero, MoreContent, Testimonial } from "@/router";
import { Welcome, WhyToSelect } from "@/screen/home/Hero";

export const Home = () => {
  return (
    <>
      <Hero />
      <WhyToSelect />
      <Expertise />
      <BeyondJustCode />
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
    </>
  );
};
