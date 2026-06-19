import { logout, RESET, selectUser } from "@/redux/slices/authSlice";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { CiStar } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { generateItemColor } from "@/utils";
import { ThemeToggle } from "../common/ThemeToggle";
import { DropdownWrapper, HeadingTwo, SearchBox } from "@/utils/Router";
import { useState } from "react";
import PropTypes from "prop-types";

export const Header = ({ title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const photo = user?.avatar?.url || user?.avatar;
  const username = user?.name || "Sunil";
  const role = user?.role || "Role";

  const logoutUser = async () => {
    dispatch(RESET());
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <header>
      <div className="flexbC h-[8vh] bg-light-surface1 dark:bg-dark-surface1">
        <div className="w-1/2">
          <HeadingTwo>{title}</HeadingTwo>
        </div>
        <div className="flex justify-end items-center gap-3">
          <div className="w-96">
            <SearchBox />
          </div>
          <div className="flexbC gap-2">
            <button className="button !p-0 size-10 3xl:size-12 bg-light-surface2 dark:bg-dark-highlight rounded-full flexC ">
              <CiStar className="text-textcolor text-lg 2xl:text-xl 3xl:text-2xl" />
            </button>
            <ThemeToggle />
            <button className="button !p-0 relative size-10 3xl:size-12 bg-light-surface2 dark:bg-dark-highlight rounded-full flexC ">
              <IoIosNotificationsOutline className="text-textcolor text-lg 2xl:text-xl 3xl:text-2xl" />
              <span className="bg-red-500 w-4 h-4 3xl:w-6 3xl:h-6 3xl:text-xs rounded-full text-[8px] flexC absolute -top-0.5 -right-1">10</span>
            </button>

            <UserMenu user={user?.avatar} username={username} role={role} photo={photo} logoutUser={logoutUser} />
          </div>
        </div>
      </div>
    </header>
  );
};

function UserMenu({ user, username, role, photo, logoutUser }) {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  return (
    <>
      <div className="relative inline-block">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => setIsOpenDropdown(!isOpenDropdown)} aria-expanded={isOpenDropdown}>
          {user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
            <div
              className="font-semibold capitalize size-10 3xl:size-12 rounded-full flexC text-white text-xl"
              style={{
                background: generateItemColor(username || "X"),
              }}
            >
              {username?.slice(0, 1) ?? "?"}
            </div>
          ) : (
            <button className="size-10 3xl:size-12 bg-light-surface2 dark:bg-dark-highlight rounded-full flexC relative ">
              <img src={photo} alt={user?.avatar?.publicId} className="w-full h-full object-cover rounded-full p-0.5" />
            </button>
          )}
        </div>
        <DropdownWrapper align="right" isOpen={isOpenDropdown} onClose={() => setIsOpenDropdown(false)} className="w-60">
          <div className="flex items-center gap-1 cursor-pointer mb-2 bg-light-highlight dark:bg-dark-highlight rounded-md">
            {user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
              <div
                className="font-semibold capitalize w-10 h-10  rounded-sm flexC text-white text-xl"
                style={{
                  background: generateItemColor(username || "X"),
                }}
              >
                {username?.slice(0, 1) ?? "?"}
              </div>
            ) : (
              <button className="w-10 h-10 bg-light-surface2 dark:bg-dark-highlight rounded-md flexC relative ">
                <img src={photo} alt={user?.avatar?.publicId} className="w-full h-full object-cover rounded-md p-0.5" />
              </button>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium capitalize xl:text-xs textColor">{username}</h3>
              </div>
              <span className="text-xs capitalize xl:text-[10px] text-light-text-tertiary dark:text-dark-text-tertiary">{role}</span>
            </div>
          </div>

          <ProfileList icon={<AiOutlineUser />} text="My Profile" link="/profile" />
          <ProfileList icon={<AiOutlineMail />} text="My Inbox" link="/profile" />
          <ProfileList icon={<IoSettingsOutline />} text="Setting" link="/profile" />

          <hr className="my-2 border-blue-gray-50/90 dark:border-blue-gray-50/10" />
          <button className="button" onClick={logoutUser}>
            Sign Out
          </button>
        </DropdownWrapper>
      </div>
    </>
  );
}

export const ProfileList = ({ icon, text, link }) => {
  return (
    <>
      <NavLink to={link} className="flex items-center gap-2 px-2 py-2 dark:hover:bg-gray-800/40 hover:bg-gray-100/100 rounded-md">
        <div className="w-4 text-gray-900 dark:text-gray-100">{icon}</div>
        <p className="text-xs text-gray-700 dark:text-gray-400">{text}</p>
      </NavLink>
    </>
  );
};

UserMenu.propTypes = {
  user: PropTypes.shape({
    avatar: PropTypes.string,
    avatarPublicId: PropTypes.string,
  }),
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
