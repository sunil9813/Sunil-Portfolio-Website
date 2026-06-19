import { ActionButton } from "@/components/customeUI/Button";
import { CenteredLightRays } from "@/screen/blog/BlogList";
import { MakeContact } from "@/screen/contact/MakeContact";
import React from "react";
import { FaPhoneFlip } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

export const Contact = () => {
  return (
    <>
      <div className="">
        <CenteredLightRays />
      </div>
      <section className="contact overflow-hidden">
        <div className="top-bg"></div>
        <div className="background">
          <div className="bg absolute top-0 left-0 z-10">
            <img src="https://wope.com/images/hero/hero-background-top.png" alt="top-line" />
          </div>
        </div>
        <div className="container relative z-20">
          <div className="heading m-auto text-center mt-32 mb-10">
            <h1 className="text-xl md:text-3xl lg:text-6xl font-semibold gardient-text contact-title">Stay Connected, Wherever You Are</h1>
            <h2 className="text-sm md:text-lg lg:text-2xl textColor font-medium heading-gardient">Questions, ideas, or partnerships—we're just a message away</h2>
            <p className="mt-3 text-xs md:text-sm text-white">Over 500,000 conversations started and counting. Yours could be next.</p>
          </div>

          <div className="background">
            <div className="bg-color absolute -z-10">{/* <img src="../image/hero-background-lights.png" alt="background" /> */}</div>
          </div>

          <div className="content p-5 md:p-10 mt-16 relative z-50">
            <MakeContact />
          </div>

          <div className="contact-info flex flex-col gap-5 justify-center md:flex-row lg:justify-around my-10">
            <div className="flex items-center gap-4">
              <ActionButton className="!p-0 h-10 w-10 md:h-12 md:w-12 flexC rotate-[120deg]">
                <FaPhoneFlip size={18} className="text-[#7d3ff1]" />
              </ActionButton>
              <h2 className="text-sm lg:text-lg textColor blog-detail-title">+61 434210364</h2>
            </div>
            <div className="flex items-center gap-4">
              <ActionButton className="!p-0  h-10 w-10 md:h-12 md:w-12 flexC">
                <MdEmail size={18} className="text-[#f1a73f]" />
              </ActionButton>
              <h2 className="text-sm lg:text-lg textColor blog-detail-title">sunilbk962@gmail.com</h2>
            </div>
            <div className="flex items-center gap-4">
              <ActionButton className="!p-0  h-10 w-10 md:h-12 md:w-12 flexC">
                <IoLocationSharp size={18} className="text-[#3ff1e2]" />
              </ActionButton>
              <h2 className="text-sm lg:text-lg textColor blog-detail-title">Sydney, Australia</h2>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
