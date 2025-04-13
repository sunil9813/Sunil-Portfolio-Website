import { logout, RESET, selectUser } from "@/redux/slices/authSlice";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CiDark, CiStar } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Avatar, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import { IoSettingsOutline } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { PrimaryButton } from "../customeUI/Button";
import { generateItemColor } from "@/utils";

export const Header = () => {
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
    <header className="px-6 h-[8vh] py-3 border-b border-gray-50/10">
      <div className="flex justify-between items-center">
        <div className="w-1/2">
          <h3 className="text-lg font-semibold capitalize">Welcome {username} ✋ </h3>
          <span className="text-xs opacity-75">Here’s what’s happening with your store today.</span>
        </div>
        <div className="w-1/2 flex justify-end items-center gap-5">
          <div className="flex justify-between items-center gap-3">
            <button className="w-10 h-10 bg-sidebarbg rounded-full flex justify-center items-center">
              <CiStar size={25} className="text-gray-100/60" />
            </button>
            <button className="w-10 h-10 bg-sidebarbg rounded-full flex justify-center items-center">
              <CiDark size={25} className="text-gray-100/60" />
            </button>
            <button className="w-10 h-10 bg-sidebarbg rounded-full flex justify-center items-center relative">
              <IoIosNotificationsOutline size={25} className="text-gray-100/60" />
              <span className="bg-red-500 w-5 h-5 rounded-full text-[10px] flex items-center justify-center absolute top-0 right-0">10</span>
            </button>
            <div className="flex profile">
              <Menu
                animate={{
                  mount: { y: 0 },
                  unmount: { y: 25 },
                }}
              >
                <MenuHandler>
                  <div className="flex items-center gap-3 cursor-pointer">
                    {/* <div className="w-10 h-10 rounded-full">
                      <img src={photo} alt="avatar" className="w-full h-full rounded-full cursor-pointer" />
                    </div> */}
                    {user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
                      <div
                        className="font-semibold capitalize w-10 h-10 rounded-full flex justify-center items-center text-white text-xl"
                        style={{
                          background: generateItemColor(username || "X"),
                        }}
                      >
                        {username?.slice(0, 1) ?? "?"}
                      </div>
                    ) : (
                      <Avatar src={photo} alt={user?.avatar?.publicId} size="sm" />
                    )}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium capitalize">{username}</h3>
                        <MdKeyboardArrowDown size={22} />
                      </div>
                      <span className="text-textcolor text-xs capitalize">{role}</span>
                    </div>
                  </div>
                </MenuHandler>
                <MenuList className="w-52 menu bg-primarybg border border-white/10 shadow-menuShadow outline-none">
                  <MenuItem className="flex items-center gap-2 outline-none">
                    <div className="w-6 text-gray-50/60">
                      <AiOutlineUser size={20} />
                    </div>
                    <span className="text-md text-gray-100">My Profile</span>
                  </MenuItem>
                  <MenuItem className="flex items-center gap-2">
                    <div className="w-6 text-gray-50/60">
                      <AiOutlineMail size={20} />
                    </div>
                    <span className="text-md text-gray-100">My Inbox</span>
                  </MenuItem>
                  <MenuItem className="flex items-center gap-2">
                    <div className="w-6 text-gray-50/60">
                      <IoSettingsOutline size={20} />
                    </div>
                    <span className="text-md text-gray-100">Inbox</span>
                  </MenuItem>

                  <hr className="my-2 border-blue-gray-50/10" />
                  <PrimaryButton text="Sign Out" onclick={logoutUser} />
                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </header>
    /*  <header
      className="shadow-sm bg-white flex justify-between items-center h-[7vh] px-8 sticky top-0
    left-0 z-[100]"
    >
      <div className="flex items-center justify-between w-full">
        <div className="w-1/2">
          <SearchBox />
        </div>
        <div className="flex justify-end items-center gap-5 w-1/2">
          <Menu className="border-none">
            <MenuHandler>
              <Avatar variant="circular" size="sm" alt="candice wu" className="cursor-pointer" src={photo} />
            </MenuHandler>
            <MenuList className="w-80 -ml-6 border-none">
              <MenuItem className="text-center items-center flex flex-col">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <Avatar size="md" variant="circular" src={photo} alt="candice wu" />
                </div>
                <Typography variant="h6" color="blue-gray" className="mb-2 flex items-center gap-2 font-medium">
                  @{username}
                </Typography>
              </MenuItem>
              <MenuItem onClick={logoutUser} className="flex text-s items-center border-gray-200 py-3  transition-all ease-in-out hover:cursor-pointer hover:bg-gray-50">
                <AiOutlineLogout size={18} />
                <span className="ml-2">Sign Out</span>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </header> */
  );
};
