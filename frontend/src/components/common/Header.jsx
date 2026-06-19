import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Fixed import (removed bare 'react-router')
import { navbar } from "../../assets/dummyData";
import { Logo } from "../../router";
import { TertiaryButton } from "../customeUI/Button";
import { FiMenu, FiX } from "react-icons/fi"; // Import menu and close icons

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Trigger mount animation

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navList = (
    <ul className="navbar mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 capitalize">
      {navbar.map((link) => (
        <li key={link.id} className="p-1 font-normal text-gray-300 hover:text-black dark:text-text_light1 dark:hover:text-white transition ease-in-out delay-150 duration-300">
          <NavLink
            to={link.path}
            className={
              ({ isActive }) =>
                isActive
                  ? "menu-list-active" // active class
                  : "flex items-center gap-1" // default class
            }
            onClick={() => setIsMenuOpen(false)} // Close menu when a link is clicked
          >
            <span> {link.name} </span>
            <span className="icon"> {link?.icon} </span>
          </NavLink>
        </li>
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
            <div className={`logo transition-transform duration-500 ${isScrolled ? "scale-90" : "scale-100"}`}>
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">{navList}</div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Button */}
            <div className="hidden md:block">
              <TertiaryButton>Connect with me</TertiaryButton>
            </div>

            {/* Mobile Menu Button */}
            <TertiaryButton className="!px-0 size-10 flexC lg:hidden text-gray-300 dark:text-text_light1 focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </TertiaryButton>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
          lg:hidden
          overflow-hidden
          transition-all duration-300 ease-in-out
          ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
          bg-white dark:bg-slate-800 shadow-lg
        `}
        >
          <div className="container py-4">
            {navList}
            <div className="md:hidden mt-4">
              <TertiaryButton fullWidth>Connect with me</TertiaryButton>
            </div>
          </div>
        </div>
      </header>
      <div className="h-16"></div>
    </>
  );
};
