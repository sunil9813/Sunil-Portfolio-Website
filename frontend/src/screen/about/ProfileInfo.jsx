import React from "react";
import Typewriter from "typewriter-effect";
import { FaFacebookF, FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";
import { NavLink } from "react-router";
import { InputLabel } from "@/components/customeUI/Title";
import { AnimatedTooltip } from "@/components/ui/AnimatedTooltip";

export const socialLinks = [
  {
    id: 1,
    name: "Facebook",
    url: "",
    iconColor: "bg-[#3b5998]",
    icon: <FaFacebookF size={20} />,
    designation: "835 Followers",
    image: "../image/social/facebook.png",
  },
  {
    id: 2,
    name: "GitHub",
    url: "https://www.github.com",
    iconColor: "bg-[#000]",
    icon: <FaGithub size={20} />,
    designation: "2.3k Followers",
    image: "../image/social/github.png",
  },
  {
    id: 3,
    name: "Instagram",
    url: "https://www.instagram.com/gorkcoder/",
    iconColor: "bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743]",
    icon: <FaInstagram size={20} />,
    designation: "1k Followers",
    image: "../image/social/instagram.png",
  },
  {
    id: 4,
    name: "YouTube",
    url: "https://www.youtube.com/channel/UCEaZ92FpOJX4aSYLN9Evj5g",
    iconColor: "bg-[#dc2641]",
    icon: <FaYoutube size={20} />,
    designation: "21.3k Subscribers",
    image: "../image/social/youtube.png",
  },
];

export const ProfileInfo = () => {
  return (
    <>
      <section className="profileme mt-10 relative z-20">
        <div className="container md:flex md:items-center gap-10">
          <div className="w-full md:w-1/3">
            <div className="images md:w-56 md:h-56 lg:w-80 lg:h-80 rounded-full relative">
              <img src="/image/profilepic.png" alt="profile" className="w-full h-full object-cover aspect-square rounded-full" />
            </div>
          </div>
          <div className="details w-full md:w-2/3">
            <h4 className="text-md font-semibold mb-3">Hello Everyone!</h4>
            <InputLabel className="text-xs lg:text-m">
              I'm a Full Stack Developer with a strong focus on the MERN stack (MongoDB, Express, React, Node.js). I build fast, responsive, and scalable web applications—from backend APIs to polished
              user interfaces. Passionate about clean code, performance, and turning ideas into real-world solutions.
            </InputLabel>
            <div className="text-xl md:text-2xl lg:text-5xl font-bold my-3 gardient-text profileme-heading">
              <Typewriter
                className="text-gradient"
                options={{
                  strings: ["I'm Sunil B.K", "Full Stack Developer"],
                  autoStart: true,
                  loop: true,
                }}
              />
            </div>
            <div className="flex flex-row items-center mb-10 w-full">
              <AnimatedTooltip items={socialLinks} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const SocialIcon = () => {
  const classes = "flex justify-center items-center w-9 h-9 rounded-full transition ease-in-out duration-500 text-white";

  // Tooltip animation variants
  const tooltipVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  };

  return (
    <section className="social flex items-center gap-3">
      {/* Facebook */}
      <motion.div className="relative" whileHover="visible" initial="hidden">
        <NavLink to="" target="_blank" className={`${classes} bg-[#3b5998] hover:bg-[#2d4373]`}>
          <FaFacebookF size={20} />
        </NavLink>
        <motion.div className="absolute -top-10 px-3 py-1.5 text-sm rounded bg-[#3b5998] text-white whitespace-nowrap" variants={tooltipVariants}>
          835 Followers
          <div className="absolute top-full w-0 h-0 border-l-4 border-r-4 border-b-0 border-l-transparent border-r-transparent border-b-transparent border-t-4 border-t-[#3b5998] transform -translate-x-1/2"></div>
        </motion.div>
      </motion.div>

      {/* GitHub */}
      <motion.div className="relative" whileHover="visible" initial="hidden">
        <NavLink to="https://www.github.com" target="_blank" className={`${classes} bg-[#000] hover:bg-[#333]`}>
          <FaGithub size={20} />
        </NavLink>
        <motion.div className="absolute -top-10  px-3 py-1.5 text-sm rounded bg-[#000] text-white whitespace-nowrap" variants={tooltipVariants}>
          1.1k Followers
          <div className="absolute top-full w-0 h-0 border-l-4 border-r-4 border-b-0 border-l-transparent border-r-transparent border-b-transparent border-t-4 border-t-[#000] transform -translate-x-1/2"></div>
        </motion.div>
      </motion.div>

      {/* Instagram */}
      <motion.div className="relative" whileHover="visible" initial="hidden">
        <NavLink to="https://www.instagram.com/gorkcoder/" target="_blank" className={`${classes} bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] hover:opacity-90`}>
          <FaInstagram size={20} />
        </NavLink>
        <motion.div className="absolute -top-10 px-3 py-1.5 text-sm rounded bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] text-white whitespace-nowrap" variants={tooltipVariants}>
          1,000 Followers
          <div className="absolute top-full w-0 h-0 border-l-4 border-r-4 border-b-0 border-l-transparent border-r-transparent border-b-transparent border-t-4 border-t-[#dc2743] transform -translate-x-1/2"></div>
        </motion.div>
      </motion.div>

      {/* YouTube */}
      <motion.div className="relative" whileHover="visible" initial="hidden">
        <NavLink to="https://www.youtube.com/channel/UCEaZ92FpOJX4aSYLN9Evj5g" target="_blank" className={`${classes} bg-[#dc2641] hover:bg-[#b21e35]`}>
          <FaYoutube size={20} />
        </NavLink>
        <motion.div className="absolute -top-10 left-0 px-3 py-1.5 text-sm rounded bg-[#dc2641] text-white whitespace-nowrap" variants={tooltipVariants}>
          12,000 Subscriber
          <div className="absolute top-full w-0 h-0 border-l-4 border-r-4 border-b-0 border-l-transparent border-r-transparent border-b-transparent border-t-4 border-t-[#dc2641] transform -translate-x-1/2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};
