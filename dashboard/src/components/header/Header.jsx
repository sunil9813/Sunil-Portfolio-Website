import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoChevronDown, IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";

import { getUserProfile, logout, RESET, selectUser } from "@/redux/slices/authSlice";
import { generateItemColor } from "@/utils";
import { DropdownWrapper, HeadingTwo, SearchBox } from "@/routes";
import { ThemeToggle } from "../common/ThemeToggle";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3940/3940417.png";
const DEFAULT_USER_NAME = "Demo User";
const DEFAULT_USER_ROLE = "Member";

const headerActionClassName =
  "group relative flex size-10 shrink-0 items-center justify-center rounded-full border border-gray-200/80 bg-light-surface2 text-gray-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-800 dark:border-white/[0.055] dark:bg-dark-highlight dark:text-dark-text-secondary dark:shadow-[0_8px_24px_rgba(0,0,0,0.16)] dark:hover:border-white/[0.1] dark:hover:bg-white/[0.04] dark:hover:text-white/75 3xl:size-12";

const normalizeUser = (value) => {
  if (!value) return null;

  if (value.profile) return value.profile;
  if (value.user) return value.user;

  return value;
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return null;

    return normalizeUser(JSON.parse(storedUser));
  } catch {
    return null;
  }
};

export const Header = ({ title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxUser = useSelector(selectUser);

  const user = useMemo(() => {
    return normalizeUser(reduxUser) || getStoredUser();
  }, [reduxUser]);

  useEffect(() => {
    const hasLoginSession = localStorage.getItem("isLoggedIn") || localStorage.getItem("user") || localStorage.getItem("token");

    if (hasLoginSession && !user?._id) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user?._id]);

  const photo = user?.avatar?.url || user?.avatar?.filePath || user?.avatar || DEFAULT_AVATAR;

  const username = user?.name || user?.username || DEFAULT_USER_NAME;

  const role = user?.role || DEFAULT_USER_ROLE;

  const logoutUser = async () => {
    dispatch(RESET());
    await dispatch(logout());

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    localStorage.removeItem("token");

    navigate("/login", { replace: true });
  };

  return (
    <header className="relative z-40">
      <div className="flexbC relative h-[8vh] min-h-[64px] px-1">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-24 size-60 rounded-full bg-indigo-500/[0.025] blur-[90px]" />
          <div className="absolute left-1/3 top-0 h-px w-52 bg-gradient-to-r from-transparent via-cyan-300/[0.08] to-transparent" />
        </div>

        <div className="relative z-10 w-1/2 min-w-0">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <HeadingTwo>{title}</HeadingTwo>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-end gap-3">
          <div className="w-96">
            <SearchBox />
          </div>

          <div className="flexbC gap-2">
            <button type="button" aria-label="Favourite items" title="Favourite items" className={headerActionClassName}>
              <CiStar className="text-lg transition-transform duration-300 group-hover:scale-110 2xl:text-xl 3xl:text-2xl" />
              <span className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>

            <ThemeToggle />

            <button type="button" aria-label="Notifications" title="Notifications" className={headerActionClassName}>
              <IoIosNotificationsOutline className="text-lg transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 2xl:text-xl 3xl:text-2xl" />
              <span className="absolute -right-1 -top-0.5 flex size-4 items-center justify-center rounded-full border-2 border-light-surface1 bg-red-500 text-[7px] font-bold leading-none text-white shadow-[0_3px_10px_rgba(239,68,68,0.35)] dark:border-dark-surface1 3xl:size-6 3xl:text-[9px]">
                10
              </span>
            </button>

            <UserMenu user={user} username={username} role={role} photo={photo} logoutUser={logoutUser} />
          </div>
        </div>
      </div>
    </header>
  );
};

function UserMenu({ user, username, role, photo, logoutUser }) {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const avatarSource = user?.avatar?.url || user?.avatar?.filePath || user?.avatar || photo;

  const showInitial = !avatarSource || avatarSource === DEFAULT_AVATAR;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpenDropdown}
        aria-label="Open user menu"
        onClick={() => setIsOpenDropdown((previousValue) => !previousValue)}
        className={`group/user flex h-10 items-center rounded-full border transition-all duration-300 hover:-translate-y-0.5 3xl:h-12 ${
          isOpenDropdown
            ? "border-indigo-300/25 bg-indigo-500/[0.055] shadow-[0_8px_24px_rgba(79,70,229,0.09)] dark:border-indigo-300/[0.11] dark:bg-indigo-300/[0.035]"
            : "border-gray-200/80 bg-light-surface2 shadow-sm hover:border-gray-300 dark:border-white/[0.055] dark:bg-dark-highlight dark:shadow-[0_8px_24px_rgba(0,0,0,0.16)] dark:hover:border-white/[0.1]"
        }`}
      >
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full 3xl:size-12">
          {showInitial ? (
            <span
              className="flex size-[34px] items-center justify-center rounded-full text-sm font-bold uppercase text-white shadow-[0_7px_18px_rgba(0,0,0,0.16)] 3xl:size-[42px] 3xl:text-base"
              style={{
                background: generateItemColor(username || DEFAULT_USER_NAME),
              }}
            >
              {username?.slice(0, 1)?.toUpperCase() || "D"}
            </span>
          ) : (
            <img src={avatarSource} alt={`${username} profile`} className="size-[34px] rounded-full border border-white/10 object-cover p-0.5 shadow-[0_7px_18px_rgba(0,0,0,0.16)] 3xl:size-[42px]" />
          )}

          <span className="absolute bottom-0.5 right-0.5 size-2.5 rounded-full border-2 border-light-surface2 bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.45)] dark:border-dark-highlight 3xl:size-3" />
        </span>

        <span className="hidden pr-2.5 xl:flex">
          <IoChevronDown
            className={`text-xs text-gray-400 transition-transform duration-300 dark:text-white/25 ${
              isOpenDropdown ? "rotate-180 text-indigo-500 dark:text-indigo-200/60" : "group-hover/user:text-gray-700 dark:group-hover/user:text-white/55"
            }`}
          />
        </span>
      </button>

      <DropdownWrapper align="right" isOpen={isOpenDropdown} onClose={() => setIsOpenDropdown(false)} className="w-[280px] !p-2">
        <div className="relative overflow-hidden rounded-xl border border-gray-200/70 bg-light-highlight p-3 dark:border-white/[0.05] dark:bg-white/[0.018]">
          <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-indigo-500/[0.07] blur-2xl" />

          <div className="relative flex items-center gap-3">
            {showInitial ? (
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-xl text-base font-bold uppercase text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                style={{
                  background: generateItemColor(username || DEFAULT_USER_NAME),
                }}
              >
                {username?.slice(0, 1)?.toUpperCase() || "D"}
              </div>
            ) : (
              <div className="size-11 shrink-0 overflow-hidden rounded-xl border border-gray-200/70 bg-light-surface2 p-0.5 dark:border-white/[0.06] dark:bg-dark-highlight">
                <img src={avatarSource} alt={`${username} profile`} className="size-full rounded-[9px] object-cover" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xs font-bold capitalize text-gray-900 dark:text-white/80">{username}</h3>

              <div className="mt-1 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.45)]" />
                <span className="truncate text-[9px] capitalize text-light-text-tertiary dark:text-dark-text-tertiary">{role}</span>
              </div>
            </div>
          </div>
        </div>

        <nav aria-label="User menu" className="mt-2 space-y-1">
          <ProfileList icon={<AiOutlineUser />} text="My Profile" link="/profile" />
          <ProfileList icon={<AiOutlineMail />} text="My Inbox" link="/profile" />
          <ProfileList icon={<IoSettingsOutline />} text="Setting" link="/profile" />
        </nav>

        <div className="my-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/[0.06]" />

        <button
          type="button"
          onClick={logoutUser}
          className="group/logout flex h-10 w-full items-center justify-between rounded-xl border border-transparent px-3 text-[10px] font-semibold text-gray-500 transition-all duration-300 hover:border-red-300/20 hover:bg-red-500/[0.045] hover:text-red-600 dark:text-white/35 dark:hover:border-red-300/[0.08] dark:hover:bg-red-300/[0.025] dark:hover:text-red-200/70"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-lg border border-gray-200/70 bg-gray-50 text-gray-400 transition-colors duration-300 group-hover/logout:border-red-300/20 group-hover/logout:bg-red-500/[0.05] group-hover/logout:text-red-500 dark:border-white/[0.05] dark:bg-white/[0.014] dark:text-white/25 dark:group-hover/logout:border-red-300/[0.08] dark:group-hover/logout:bg-red-300/[0.025] dark:group-hover/logout:text-red-200/65">
              <IoLogOutOutline size={14} />
            </span>
            Sign Out
          </span>

          <span className="text-[9px] opacity-0 transition-all duration-300 group-hover/logout:translate-x-0.5 group-hover/logout:opacity-60">→</span>
        </button>
      </DropdownWrapper>
    </div>
  );
}

export const ProfileList = ({ icon, text, link }) => {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `group/profile flex h-10 items-center gap-3 rounded-xl border px-3 transition-all duration-300 ${
          isActive
            ? "border-indigo-300/20 bg-indigo-500/[0.055] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.03] dark:text-indigo-200/70"
            : "border-transparent text-gray-600 hover:border-gray-200/70 hover:bg-gray-100/70 hover:text-gray-900 dark:text-white/35 dark:hover:border-white/[0.05] dark:hover:bg-white/[0.018] dark:hover:text-white/65"
        }`
      }
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-gray-200/70 bg-gray-50 text-sm text-gray-500 transition-all duration-300 group-hover/profile:border-indigo-300/20 group-hover/profile:bg-indigo-500/[0.05] group-hover/profile:text-indigo-600 dark:border-white/[0.05] dark:bg-white/[0.014] dark:text-white/30 dark:group-hover/profile:border-indigo-300/[0.08] dark:group-hover/profile:bg-indigo-300/[0.025] dark:group-hover/profile:text-indigo-200/65">
        {icon}
      </span>

      <p className="text-[10px] font-semibold">{text}</p>

      <span className="ml-auto text-[9px] opacity-0 transition-all duration-300 group-hover/profile:translate-x-0.5 group-hover/profile:opacity-45">→</span>
    </NavLink>
  );
};

UserMenu.propTypes = {
  user: PropTypes.object,
  username: PropTypes.string,
  role: PropTypes.string,
  photo: PropTypes.string,
  logoutUser: PropTypes.func.isRequired,
};

ProfileList.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};
