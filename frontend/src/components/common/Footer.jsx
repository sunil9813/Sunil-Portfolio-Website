import React, { useEffect } from "react";
import { MainButton, TertiaryButton } from "@/components/customeUI/Button";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { HeadingThree, InputLabel } from "@/components/customeUI/Title";
import { Logo } from "@/router";
import { Input, InputForResume } from "../customeUI/Input";
import { AnimatedTooltip } from "../ui/AnimatedTooltip";
import { socialLinks } from "@/screen/about/ProfileInfo";
import { navbar } from "@/assets/dummyData";
import { NavLink } from "react-router";
import { RectangleSVG } from "@/utils/SVG";
import { useDispatch, useSelector } from "react-redux";
import { getallBlog } from "@/redux/slices/blogSlice";

export const Footer = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blog);
  const { BlogList } = blogs;

  useEffect(() => {
    dispatch(getallBlog());
  }, [dispatch]);
  return (
    <>
      {/* <ContactFooter /> */}
      <footer className="relative dark:bg-[#0B0C0F] backdrop-blur-3xl overflow-hidden">
        <FooterBg />
        <div className="w-full mx-auto absolute top-0 left-0 right-0">
          <RectangleSVG className="w-auto mx-auto h-full object-contain" />
        </div>

        <div className="container pt-16 pb-10 relative z-20">
          <div className="md:flex md:flex-wrap md:justify-between md:gap-5">
            <div className="box">
              <div className="flex items-center gap-2">
                <Logo />
                <h3 className="text-xl heading-gardient roadmap-title">Gorkcoder</h3>
              </div>
              <p className="text-xl font-normal my-3">SUBSCRIBE TO OUR NEWSLETTER</p>
              <div className="flexC mb-10 relative w-auto md:w-96 rounded-full p-0.5 textColor textSizeSm bg-gray-900/5 dark:bg-gray-50/5">
                <InputForResume placeholder="email address" className="outline-none rounded-full !bg-none" />
                <div className=" absolute right-0.5">
                  <TertiaryButton>Submit</TertiaryButton>
                </div>
              </div>

              <div className="flex flex-row items-center mb-10 w-full">
                <AnimatedTooltip items={socialLinks} />
              </div>
            </div>
            <div className="box">
              <HeadingThree className="mb-5">Recent posts</HeadingThree>
              <div className="grid grid-cols-3 gap-2">
                {BlogList?.slice(0, 9)?.map((blog) => (
                  <NavLink to={`/view-blog/${blog?.slug}`} className="cursor-pointer">
                    <div className="size-20 md:size-16">
                      <img src={blog?.cover?.filePath} alt={blog?.publicId} className="w-full h-full object-cover rounded-lg" />
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="box">
              <HeadingThree className="mb-5">Other Links</HeadingThree>
              <ul>
                <li>
                  <NavLink className="capitalize mb-3 block hover:text-white transition-all ease-in-out" to="/term-condition">
                    Terms & Condition
                  </NavLink>
                </li>
                <li>
                  <NavLink className="capitalize mb-3 block hover:text-white transition-all ease-in-out" to="/team">
                    Our Team
                  </NavLink>
                </li>
                <li>
                  <NavLink className="capitalize mb-3 block hover:text-white transition-all ease-in-out" to="/privacy-policy">
                    Privacy Policy
                  </NavLink>
                </li>
                <li>
                  <NavLink className="capitalize mb-3 block hover:text-white transition-all ease-in-out" to="/customer-feedback">
                    Testimonials/Reviews
                  </NavLink>
                </li>
                <li>
                  <NavLink className="capitalize mb-3 block hover:text-white transition-all ease-in-out" to="/roadmap">
                    Roadmap
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="box">
              <HeadingThree className="mb-5">Quick Links</HeadingThree>
              <ul>
                {navbar.map((link) => (
                  <li key={link?.id}>
                    <NavLink className=" capitalize mb-3 block hover:text-white transition-all ease-in-out" to={link?.path}>
                      {link?.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="py-5 border-t border-white/10 pt-8">
          <div className="container flex text-center flex-col md:flex-row md:justify-between">
            <p>@2025 All the Copyright Reserved.</p>

            <div className="flexC gap-2">
              <NavLink to="/privacy-policy">Privacy Policy</NavLink>
              <div className="h-5 w-[1px] bg-gray-50/30" />
              <NavLink to="/term-condition">Terms & Condition</NavLink>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export const FooterBg = () => {
  return (
    <>
      <div className="background relative">
        <div className="pointer-events-none absolute z-50 left-[250px] top-[-102px] h-[248px] w-[800px] rounded-full bg-[#4474F2] opacity-[0.11] blur-[100px]" aria-hidden="true"></div>

        {/* for background */}
        <div className="pointer-events-none absolute right-[35%] top-[-52px] h-[248px] w-[490px] rounded-full bg-[radial-gradient(92.52%_89.86%_at_62.86%_11.06%,#3BDCFF_27.2%,#69B7FF_80.5%,#4759FF_100%)] opacity-[0.25] blur-[100px]"></div>
        {/* for line */}
        <div className="pointer-events-none absolute right-[35%] top-0 z-20 h-[1px] w-[524px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#FFFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter"></div>
        {/* line more bright  */}
        <div className="pointer-events-none absolute right-[35%] top-0 z-20 h-[1px] w-[524px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#FFFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter blur-[1px]"></div>
        {/* line more blur  */}
        <div className="pointer-events-none absolute right-[35%] top-0 z-20 h-[1px] w-[524px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#BAFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter blur-[5px]"></div>

        {/* for blur color light */}
        <div className="pointer-events-none absolute right-[45%] top-[-11px] h-[23px] w-[400px] rounded-[50%] bg-[#E6FCFF] opacity-20 mix-blend-plus-lighter blur-[25px]"></div>
        <div className="pointer-events-none absolute right-[45%] top-[-16px] h-[32px] w-[448px] rounded-[50%] bg-[#67DBFF] opacity-25 mix-blend-plus-lighter blur-[50px]"></div>
      </div>
    </>
  );
};

export const ContactFooter = () => {
  return (
    <>
      <div className="contact relative w-full overflow-hidden">
        <div className="container">
          <div className="bottom-contact flex flex-col items-center my-10 p-8 rounded-xl relative">
            <h1 className="text-6xl font-semibold gardient-text2">Ready to Build What's Next?</h1>
            <InputLabel>Let’s turn your ideas into powerful digital experiences. From frontend finesse to backend brilliance — I'm here to help bring your vision to life.</InputLabel>
            <ul className="textColor text-lg flex justify-center items-center gap-5 flex-wrap py-5">
              <li className="flex gap-2">
                <IoMdCheckmarkCircleOutline size={25} />
                Ongoing support for all your projects
              </li>
              <li className="flex gap-2">
                <IoMdCheckmarkCircleOutline size={25} />
                Professional guidance for your ideas
              </li>
              <li className="flex gap-2">
                <IoMdCheckmarkCircleOutline size={25} />
                Quick responses and clear explanations
              </li>
              <li className="flex gap-2">
                <IoMdCheckmarkCircleOutline size={25} />
                Versatile skills across multiple technologies
              </li>
            </ul>
            <MainButton>Contact Us</MainButton>
            <div className="img-right absolute -bottom-[20%] -left-[21.5%]">
              <img src="../image/hand.svg" alt="hand" />
            </div>
            <div className="img-right absolute -top-[20%] -right-[21.5%]">
              <img src="../image/hand.svg" alt="hand" className=" rotate-180" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
