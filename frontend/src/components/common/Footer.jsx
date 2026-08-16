import { useEffect } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FiBookOpen, FiCode, FiLayers, FiMail } from "react-icons/fi";
import { FaFacebookF, FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";

import { MainButton, TertiaryButton } from "@/components/customeUI/Button";
import { HeadingThree, InputLabel } from "@/components/customeUI/Title";
import { Logo } from "@/components/common/Logo";
import { InputForResume } from "../customeUI/Input";
import { AnimatedTooltip } from "../ui/AnimatedTooltip";
import { socialLinks } from "@/screen/about/ProfileInfo";
import { navbar } from "@/assets/dummyData";
import { RectangleSVG } from "@/utils/SVG";
import { getallBlog } from "@/redux/slices/blogSlice";

const footerSocialLinks = socialLinks.map((item) => {
  const iconMap = {
    Facebook: <FaFacebookF />,
    GitHub: <FaGithub />,
    Instagram: <FaInstagram />,
    YouTube: <FaYoutube />,
  };

  return {
    ...item,
    iconOnly: true,
    icon: iconMap[item.name] || item.icon,
    iconClassName:
      "border-white/[0.08] bg-white/[0.032] text-white/48 shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_10px_24px_rgba(0,0,0,0.16)] hover:border-cyan-300/[0.22] hover:bg-cyan-300/[0.065] hover:text-cyan-100/85 hover:shadow-[0_0_18px_rgba(103,232,249,0.12)]",
  };
});

export const Footer = () => {
  const dispatch = useDispatch();

  const { blogs } = useSelector((state) => state.blog);
  const { BlogList = [] } = blogs || {};

  useEffect(() => {
    dispatch(getallBlog());
  }, [dispatch]);

  return (
    <>
      {/* Enable this section when needed */}
      {/* <ContactFooter /> */}

      <footer className="relative isolate overflow-hidden border-t border-cyan-100/[0.06] text-white/45 shadow-[0_-25px_80px_rgba(0,0,0,0.25)]">
        <FooterBg />

        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto w-full opacity-35">
          <RectangleSVG className="mx-auto h-full w-auto object-contain" />
        </div>

        <div className="container relative z-20 pb-12 pt-16 sm:pt-20">
          <div className="absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/20 to-transparent" />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_0.65fr_0.65fr] lg:gap-8 xl:gap-12">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center transition-transform duration-300 hover:scale-105">
                  <span className="absolute inset-0 rounded-full bg-cyan-300/10 blur-xl" />
                  <span className="relative">
                    <Logo />
                  </span>
                </div>

                <h3 className="heading-gardient roadmap-title text-xl font-semibold tracking-[-0.03em] text-white/90">Gorkcoder</h3>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#335240]/30 bg-[#335240]/15 px-3 py-1.5 text-[9px] font-semibold text-emerald-100/64">
                <span className="size-1.5 rounded-full bg-emerald-300/70 shadow-[0_0_10px_rgba(110,231,183,0.45)]" />
                Available for collaboration
              </div>

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Subscribe to our newsletter</p>
              <p className="mt-2 max-w-sm text-[10px] font-medium leading-5 text-white/30">Get useful development resources, new courses and recent articles delivered to your inbox.</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <FooterMiniChip icon={<FiCode />} label="MERN" />
                <FooterMiniChip icon={<FiBookOpen />} label="Courses" />
                <FooterMiniChip icon={<FiLayers />} label="Resources" />
              </div>

              <div className="group/form relative mt-5 flex h-12 w-full max-w-sm items-center overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.028] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_12px_30px_rgba(0,0,0,0.18)] transition-all duration-300 focus-within:border-cyan-300/[0.18] focus-within:bg-white/[0.038]">
                <span className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-cyan-300/[0.045] to-transparent" />
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/20">
                  <FiMail size={13} />
                </span>

                <InputForResume
                  placeholder="email address"
                  className="h-full min-w-0 flex-1 !rounded-full !border-0 !bg-transparent pl-9 pr-3 !text-[10px] !text-white/70 outline-none placeholder:!text-white/20"
                />

                <TertiaryButton className="h-10 shrink-0 !rounded-full !border-white/[0.12] !bg-white/90 !px-5 !text-[9px] !font-semibold !text-[#111827] transition-all duration-300 hover:!bg-cyan-100">
                  Submit
                </TertiaryButton>
              </div>

              <div className="mt-7 flex w-full items-center">
                <AnimatedTooltip items={footerSocialLinks} />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <FooterHeading>Recent posts</FooterHeading>

                <NavLink
                  to="/blog"
                  className="mt-0.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[8px] font-semibold text-white/35 transition-all hover:border-cyan-300/[0.12] hover:text-cyan-100/70"
                >
                  View all
                </NavLink>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {BlogList.slice(0, 9).map((blog) => (
                  <NavLink
                    key={blog?._id || blog?.slug}
                    to={`/view-blog/${blog?.slug}`}
                    className="group/post relative aspect-square overflow-hidden rounded-[13px] border border-white/[0.06] bg-white/[0.025] shadow-[0_8px_20px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/[0.14] hover:shadow-[0_12px_26px_rgba(0,0,0,0.22)]"
                  >
                    {blog?.cover?.filePath ? (
                      <img
                        src={blog.cover.filePath}
                        alt={blog?.publicId || blog?.title || "Recent post"}
                        className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover/post:scale-110 group-hover/post:opacity-100"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-300/[0.08] via-white/[0.025] to-violet-300/[0.08] text-sm font-semibold text-white/45">
                        {blog?.title?.charAt(0)?.toUpperCase() || "G"}
                      </span>
                    )}

                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090b0f]/55 via-transparent to-transparent opacity-50 transition-opacity duration-300 group-hover/post:opacity-20" />
                    <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.16] to-transparent" />
                  </NavLink>
                ))}

                {BlogList.length === 0 &&
                  Array.from({ length: 9 }).map((_, index) => (
                    <span key={index} className="aspect-square rounded-[13px] border border-white/[0.055] bg-gradient-to-br from-white/[0.045] via-white/[0.018] to-cyan-300/[0.025]" />
                  ))}
              </div>
            </div>

            <div>
              <FooterHeading>Other Links</FooterHeading>

              <ul className="space-y-1">
                <FooterLink to="/term-condition">Terms &amp; Condition</FooterLink>
                <FooterLink to="/team">Our Team</FooterLink>
                <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
                <FooterLink to="/customer-feedback">Testimonials/Reviews</FooterLink>
                <FooterLink to="/roadmap">Roadmap</FooterLink>
              </ul>
            </div>

            <div>
              <FooterHeading>Quick Links</FooterHeading>

              <ul className="space-y-1">
                {navbar.map((link) => (
                  <FooterLink key={link?.id} to={link?.path}>
                    {link?.name}
                  </FooterLink>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="relative z-20 border-t border-white/[0.055] bg-black/[0.12]">
          <span className="pointer-events-none absolute inset-x-[18%] top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/20 to-transparent" />

          <div className="container flex flex-col items-center justify-between gap-4 py-6 text-center text-[9px] font-medium text-white/30 md:flex-row">
            <p className="tracking-[0.02em]">@2025 All the Copyright Reserved.</p>

            <div className="flex items-center gap-3">
              <NavLink
                to="/privacy-policy"
                className="rounded-full border border-transparent px-2.5 py-1.5 transition-all duration-200 hover:border-white/[0.06] hover:bg-white/[0.02] hover:text-cyan-200/70"
              >
                Privacy Policy
              </NavLink>

              <div className="h-4 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

              <NavLink
                to="/term-condition"
                className="rounded-full border border-transparent px-2.5 py-1.5 transition-all duration-200 hover:border-white/[0.06] hover:bg-white/[0.02] hover:text-cyan-200/70"
              >
                Terms &amp; Condition
              </NavLink>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

const FooterHeading = ({ children }) => {
  return (
    <div className="mb-5">
      <HeadingThree className="!mb-0 !text-[11px] !font-semibold !uppercase !tracking-[0.08em] !text-white/75">{children}</HeadingThree>

      <div className="mt-2 flex items-center gap-2">
        <span className="size-1 rounded-full bg-cyan-300/55 shadow-[0_0_6px_rgba(103,232,249,0.35)]" />
        <span className="h-px w-12 bg-gradient-to-r from-cyan-300/30 via-white/10 to-transparent" />
      </div>
    </div>
  );
};

const FooterMiniChip = ({ icon, label }) => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.022] px-2.5 py-1.5 text-[8px] font-semibold text-white/38 transition-all hover:border-cyan-300/[0.12] hover:bg-cyan-300/[0.035] hover:text-cyan-100/68">
      <span className="text-cyan-100/45">{icon}</span>
      {label}
    </span>
  );
};

const FooterLink = ({ to, children }) => {
  return (
    <li>
      <NavLink
        to={to}
        className="group/link relative flex w-fit items-center gap-2 py-1.5 text-[10px] font-medium capitalize text-white/35 transition-all duration-200 hover:translate-x-1 hover:text-white/72"
      >
        <span className="size-1 rounded-full bg-white/15 transition-all duration-200 group-hover/link:bg-cyan-300/60 group-hover/link:shadow-[0_0_6px_rgba(103,232,249,0.35)]" />
        <span className="relative">
          {children}
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-cyan-300/55 to-transparent transition-all duration-300 group-hover/link:w-full" />
        </span>
      </NavLink>
    </li>
  );
};

export const FooterBg = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[8%] top-[-180px] h-[420px] w-[720px] rounded-full bg-[#335240] opacity-[0.14] blur-[130px]" aria-hidden="true" />
      <div
        className="absolute right-[20%] top-[-170px] h-[380px] w-[620px] rounded-full bg-[radial-gradient(circle,#3BDCFF_0%,#335240_42%,transparent_72%)] opacity-[0.10] blur-[125px]"
        aria-hidden="true"
      />
      <div className="absolute inset-x-[20%] top-0 h-px bg-gradient-to-r from-transparent via-emerald-100/24 to-transparent" />
      <div className="absolute left-1/2 top-[-12px] h-6 w-[45%] -translate-x-1/2 rounded-full bg-emerald-200/[0.075] blur-[24px]" />
      <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(rgba(148,163,184,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.018)_1px,transparent_1px)] bg-[size:70px_70px] opacity-40" />
      <div className="absolute bottom-[-220px] left-1/2 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-[#335240]/[0.10] blur-[140px]" />
    </div>
  );
};

export const ContactFooter = () => {
  return (
    <div className="contact relative w-full overflow-hidden">
      <div className="container">
        <div className="bottom-contact relative my-10 flex flex-col items-center overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.025] p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.24)] sm:p-10">
          <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[70%] -translate-x-1/2 rounded-full bg-cyan-400/[0.055] blur-[100px]" />

          <h1 className="gardient-text2 relative z-10 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-6xl">Ready to Build What&apos;s Next?</h1>

          <InputLabel className="relative z-10 mx-auto mt-4 max-w-4xl">
            Let&apos;s turn your ideas into powerful digital experiences. From frontend finesse to backend brilliance — I&apos;m here to help bring your vision to life.
          </InputLabel>

          <ul className="textColor relative z-10 flex flex-wrap items-center justify-center gap-4 py-6 text-sm sm:text-base lg:text-lg">
            <li className="flex items-center gap-2">
              <IoMdCheckmarkCircleOutline size={22} className="text-cyan-300/65" />
              Ongoing support for all your projects
            </li>
            <li className="flex items-center gap-2">
              <IoMdCheckmarkCircleOutline size={22} className="text-cyan-300/65" />
              Professional guidance for your ideas
            </li>
            <li className="flex items-center gap-2">
              <IoMdCheckmarkCircleOutline size={22} className="text-cyan-300/65" />
              Quick responses and clear explanations
            </li>
            <li className="flex items-center gap-2">
              <IoMdCheckmarkCircleOutline size={22} className="text-cyan-300/65" />
              Versatile skills across multiple technologies
            </li>
          </ul>

          <MainButton className="relative z-10">Contact Us</MainButton>

          <div className="img-right pointer-events-none absolute -bottom-[20%] -left-[21.5%]">
            <img src="../image/hand.svg" alt="hand" />
          </div>

          <div className="img-right pointer-events-none absolute -right-[21.5%] -top-[20%]">
            <img src="../image/hand.svg" alt="hand" className="rotate-180" />
          </div>
        </div>
      </div>
    </div>
  );
};
