import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { navbar } from "../../assets/dummyData";
import { Logo } from "../../router";
import { GlowingButton, MainButton, TertiaryButton } from "../customeUI/Button";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Trigger mount animation

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navList = (
    <ul className="navbar mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 capitalize">
      {navbar.map((link) => (
        <p key={link.id} className="p-1 font-normal text-gray-500 hover:text-black dark:text-text_light1 dark:hover:text-white transition ease-in-out delay-150 duration-300">
          <NavLink to={link.path} className="flex items-center gap-1">
            <span> {link.name} </span>
            <span className="icon"> {link?.icon} </span>
          </NavLink>
        </p>
      ))}
    </ul>
  );

  return (
    <>
      <header
        className={`
      fixed w-full top-0 left-0 z-50
      transition-all duration-500 ease-out
      ${!isMounted ? "-translate-y-full" : "translate-y-0"}
      ${isScrolled ? "bg-white/10 dark:bg-slate-500/10 backdrop-blur-md shadow-sm py-2 sticky" : "bg-transparent dark:bg-transparent py-2"}
    `}
      >
        <div className="container flex justify-between items-center h-12">
          <div className="flex items-center gap-5">
            <div className="logo transition-transform duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}">
              <Logo />
            </div>
            {navList}
          </div>
          <div className="account flexC">
            <GlowingButton>Connect with me</GlowingButton>
          </div>
        </div>
      </header>
      <div className="h-16"></div>
    </>
  );
};
