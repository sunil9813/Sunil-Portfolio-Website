import { BsInstagram, BsTiktok, BsTwitterX } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { LiaCrownSolid } from "react-icons/lia";
import PropTypes from "prop-types";
import { generateItemColor } from "@/utils";
import { MdAdminPanelSettings } from "react-icons/md";
import { Tooltip } from "@material-tailwind/react";

export const UserProfile = ({ rowData }) => {
  return (
    <>
      <div className="cont pt-3 grid grid-cols-4 3xl:grid-cols-5 gap-4 p-5">
        <UserProfileCardDesign rowData={rowData} />
      </div>
    </>
  );
};

export const UserProfileCardDesign = ({ rowData }) => {
  return (
    <>
      {rowData &&
        rowData.map((user, index) => (
          <div className="profile-card-one relative rounded-xl bg-light-highlight dark:bg-dark-highlight border border-gray-500/20" key={`${name}-${index}`}>
            <div className="line1"></div>
            <div className="line2"></div>
            {user?.role === "admin" && (
              <Tooltip
                content="Admin"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 },
                }}
                className="bg-green-500 text-xs rounded-sm"
              >
                <button className="bg-green-500 shadow-md  text-white p-1 rounded-full absolute top-0 left-0 m-2">
                  <MdAdminPanelSettings size={20} />
                </button>
              </Tooltip>
            )}
            <button className="flexC gap-1 bg-yellow-800 text-xs 3xl:text-sm px-3 py-1 textColor rounded-sm absolute top-0 right-0 m-2">
              <LiaCrownSolid />
              Pro
            </button>
            <div className="cover w-full h-32 bg-black rounded-t-xl">
              {user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" || user?.user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
                <div
                  className="w-full h-full object-cover rounded-t-xl"
                  style={{
                    background: generateItemColor(user?.user?.name || user?.name || "X"),
                  }}
                ></div>
              ) : (
                <img src={user?.user?.cover?.filePath || user?.cover?.filePath} alt={user?.user?.cover?.publicId || user?.cover?.publicId} className="w-full h-full object-cover rounded-t-xl" />
              )}
            </div>
            <div className="px-5 pb-8">
              <div className="w-20 h-20 relative z-10 rounded-full border-[3px] border-light-highlight dark:border-dark-highlight -mt-12">
                {user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" || user?.user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
                  <div
                    className="font-semibold capitalize w-full h-full rounded-full flex justify-center items-center text-white text-4xl"
                    style={{
                      background: generateItemColor(user?.user?.name || user?.name || "X"),
                    }}
                  >
                    {(user?.user?.name?.charAt(0) || user?.name?.charAt(0)) ?? "?"}
                  </div>
                ) : (
                  <img src={user?.user?.avatar?.url || user?.avatar?.url} alt={user?.user?.avatar?.publicId || user?.avatar?.publicId} className="w-full h-full object-cover rounded-full" />
                )}
              </div>
              <div className="flexbC mt-3">
                <div>
                  <h4 className="font-normal text-sm textColor capitalize">{user?.name}</h4>
                  <span className="textColor text-xs opacity-65">{user?.email}</span>
                </div>
                <button className="!text-xs 3xl:!text-sm bg-indigo-500 px-4 py-1 text-white rounded-md">Follow</button>
              </div>
              <p className="text-[10px] 3xl:text-xs opacity-75 textColor my-2">Lorem ipsum dolor sit amet consectetur adipis icing elit. Beatae, fuga!</p>
              <div className="flex justify-between gap-2 w-full">
                <div className="flexC gap-1">
                  <span className="textColor text-xs">Posts</span>
                  <h3 className="text-xs textColor opacity-65">1,908</h3>
                </div>
                <div className="flexC gap-1">
                  <span className="textColor text-xs">Followers</span>
                  <h3 className="text-xs textColor opacity-65">12.0k</h3>
                </div>
                <div className="flexC gap-1">
                  <span className="textColor text-xs">Following</span>
                  <h3 className="text-xs textColor opacity-65">1400</h3>
                </div>
              </div>
              <div className="social-icon flex gap-2 mt-3 text-xs">
                <FaFacebookF className="text-indigo-400" />
                <BsInstagram className="text-orange-400" />
                <BsTwitterX className="text-blue-400" />
                <BsTiktok className="text-purple-400" />
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

// PropTypes Validation
const rowDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  })
);

UserProfile.propTypes = {
  rowData: rowDataShape,
};

UserProfileCardDesign.propTypes = {
  rowData: rowDataShape,
};
