import { useEffect, useState } from "react";
import { FaBookmark, FaRegUser, FaShoppingCart, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { IoNotificationsOutline, IoSettingsOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { navbar } from "../../assets/dummyData";
import { Logo } from "./Logo";
import { logout } from "@/redux/slices/authSlice";
import { TertiaryButton } from "../customeUI/Button";
import { getCartItems, getCartSummary, subscribeCart } from "@/utils/cart";
import { REACT_APP_BACKEND_URL } from "@/utils/api";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3940/3940417.png";

const getAvatarUrl = (avatar) => {
  if (!avatar) return "";
  if (typeof avatar === "string") return avatar;
  return avatar?.url || avatar?.filePath || "";
};

export const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartSummary, setCartSummary] = useState(() => getCartSummary());
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const avatarUrl = getAvatarUrl(user?.avatar);
  const showAvatarImage = avatarUrl && avatarUrl !== DEFAULT_AVATAR;
  const displayName = user?.name || user?.fullname || "Account";

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsProfileOpen(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setCartSummary(getCartSummary(getCartItems()));
    return subscribeCart((items) => setCartSummary(getCartSummary(items)));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      if (!isLoggedIn) {
        setUnreadNotifications(0);
        return;
      }

      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/business/notifications`);
        if (isMounted) {
          setUnreadNotifications(Number(response.data?.unreadCount || 0));
        }
      } catch (error) {
        if (isMounted) {
          setUnreadNotifications(0);
        }
      }
    };

    fetchNotifications();
    const intervalId = window.setInterval(fetchNotifications, 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [isLoggedIn]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  const profileMenu = (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsProfileOpen((currentValue) => !currentValue)}
        className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.055] py-1.5 pl-1.5 pr-3 text-left shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-all hover:border-teal-200/[0.18] hover:bg-white/[0.085]"
      >
        <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.10] bg-teal-300/[0.10] text-[11px] font-bold uppercase text-teal-100/80">
          {showAvatarImage ? <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" /> : displayName.charAt(0)}
        </span>
        <span className="hidden max-w-28 truncate text-[10px] font-semibold text-white/70 sm:block">{displayName}</span>
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 z-[10000] mt-2 w-64 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#121820]/95 p-2 shadow-[0_22px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
          <div className="border-b border-white/[0.055] px-3 py-3">
            <p className="truncate text-[12px] font-semibold text-white/90">{displayName}</p>
            <p className="mt-0.5 truncate text-[10px] text-white/40">{user?.email || "Profile dashboard"}</p>
          </div>

          <div className="py-2">
            {[
              { to: "/account", label: "Dashboard", icon: <FaRegUser /> },
              { to: "/account?tab=bookmarks", label: "Bookmarks", icon: <FaBookmark /> },
              { to: "/account?tab=account", label: "Account", icon: <IoSettingsOutline /> },
              { to: "/account?tab=privacy", label: "Privacy", icon: <IoShieldCheckmarkOutline /> },
            ].map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-medium text-white/50 transition-all hover:bg-teal-300/[0.055] hover:text-teal-100/80"
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[10px] font-medium text-rose-200/70 transition-all hover:bg-rose-300/[0.055] hover:text-rose-100"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const navList = (
    <ul className="navbar mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 capitalize">
      {navbar.map((link) => (
        <li key={link.id} className="p-1 font-normal text-white/62 transition duration-300 ease-in-out hover:text-white">
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
          fixed left-0 top-0 z-[9999] w-full will-change-transform
          transition-all duration-500 ease-out
          ${!isMounted ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
          ${
            isScrolled
              ? "bg-[linear-gradient(180deg,rgba(13,18,24,0.88)_0%,rgba(13,18,24,0.68)_100%)] py-2 shadow-[0_18px_55px_rgba(0,0,0,0.34)] backdrop-blur-2xl"
              : "bg-transparent py-2 shadow-none"
          }
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
            <NavLink
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="relative flex size-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.055] text-white/70 shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-all hover:border-teal-200/[0.18] hover:bg-white/[0.085] hover:text-teal-100"
              aria-label="Open cart"
            >
              <FaShoppingCart size={15} />
              {cartSummary.count > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-white shadow-lg">
                  {cartSummary.count > 9 ? "9+" : cartSummary.count}
                </span>
              )}
            </NavLink>

            {isLoggedIn && (
              <NavLink
                to="/account?tab=notifications"
                onClick={() => setIsMenuOpen(false)}
                className="relative hidden size-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.055] text-white/70 shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-all hover:border-teal-200/[0.18] hover:bg-white/[0.085] hover:text-teal-100 sm:flex"
                aria-label="Open alerts"
              >
                <IoNotificationsOutline size={18} />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-teal-500 text-[9px] font-black text-white shadow-lg">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </NavLink>
            )}

            <div className="hidden md:block">
              {isLoggedIn && user ? (
                profileMenu
              ) : (
                <NavLink to="/login">
                  <TertiaryButton>Connect with me</TertiaryButton>
                </NavLink>
              )}
            </div>

            <TertiaryButton className="!px-0 size-10 flexC lg:hidden text-white/70 focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
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
          relative z-[9999] bg-[#121820]/96 shadow-[0_22px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl
        `}
        >
          <div className="container py-4">
            {navList}
            <div className="md:hidden mt-4">
              {isLoggedIn && user ? (
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-teal-300/[0.10] text-[11px] font-bold uppercase text-teal-100/80">
                      {showAvatarImage ? <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" /> : <FaUserCircle size={18} />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold text-white/90">{displayName}</p>
                      <p className="truncate text-[10px] text-white/40">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <NavLink to="/account" onClick={() => setIsMenuOpen(false)} className="rounded-xl bg-teal-300/[0.08] px-3 py-2 text-center text-[10px] font-semibold text-teal-100/75">
                      Dashboard
                    </NavLink>
                    <NavLink to="/cart" onClick={() => setIsMenuOpen(false)} className="rounded-xl bg-amber-300/[0.08] px-3 py-2 text-center text-[10px] font-semibold text-amber-100/75">
                      Cart ({cartSummary.count})
                    </NavLink>
                    <NavLink to="/account?tab=notifications" onClick={() => setIsMenuOpen(false)} className="rounded-xl bg-teal-300/[0.08] px-3 py-2 text-center text-[10px] font-semibold text-teal-100/75">
                      Alerts ({unreadNotifications})
                    </NavLink>
                    <button type="button" onClick={handleLogout} className="rounded-xl bg-rose-300/[0.08] px-3 py-2 text-[10px] font-semibold text-rose-100/75">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                  <TertiaryButton>Connect with me</TertiaryButton>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="h-16"></div>
    </>
  );
};
