import { BsInstagram, BsTiktok, BsTwitterX } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { LiaCrownSolid } from "react-icons/lia";
import PropTypes from "prop-types";

const rowData = [
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    name: "John Michael",
    email: "john@creative-tim.com",
    job: "Manager",
    statu: "blocked",
    date: "23/04/18",
  },
];

export const ProfileCard = () => {
  return (
    <>
      <div className="grid grid-cols-4 3xl:grid-cols-5 gap-4">
        <UserProfileCardDesignThree rowData={rowData} />
        <UserProfileCardDesignTwo rowData={rowData} />
        <UserProfileCardDesignOne rowData={rowData} />
      </div>
    </>
  );
};
export const UserProfileCardDesignOne = () => {
  return (
    <>
      {rowData &&
        rowData.map(({ img, name, email }, index) => (
          <div
            className="profile-card-one relative overflow-hidden flexC flex-col text-center p-8 rounded-2xl bg-light-highlight dark:bg-dark-highlight border border-gray-500/20"
            key={`${name}-${index}`}
          >
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
            <button className="flexC gap-1 bg-yellow-800 text-xs 3xl:text-sm px-3 py-1 textColor rounded-sm absolute top-0 left-0 m-4">
              <LiaCrownSolid />
              Pro
            </button>
            <div className="w-20 h-20 rounded-full border-2 border-brown-500 mb-3">
              <img src={img} alt={name} className="rounded-full p-1" />
            </div>
            <h4 className="font-normal text-sm textColor">{name}</h4>
            <span className="textColor text-xs opacity-65">{email}</span>
            <div className="social-icon flex gap-2 my-5">
              <FaFacebookF size={15} className="text-indigo-400" />
              <BsInstagram size={15} className="text-orange-400" />
              <BsTwitterX size={15} className="text-blue-400" />
              <BsTiktok size={15} className="text-purple-400" />
            </div>
            <div className="flex justify-between w-full">
              <p>
                <span className="textColor text-xs opacity-65">Posts</span>
                <h3 className="font-normal text-sm textColor">1,908</h3>
              </p>
              <p>
                <span className="textColor text-xs opacity-65">Followers</span>
                <h3 className="font-normal text-sm textColor">12.0k</h3>
              </p>
              <p>
                <span className="textColor text-xs opacity-65">Following</span>
                <h3 className="font-normal text-sm textColor">1400</h3>
              </p>
            </div>
          </div>
        ))}
    </>
  );
};
export const UserProfileCardDesignTwo = () => {
  return (
    <>
      {rowData &&
        rowData.map(({ img, name, email }, index) => (
          <div className="profile-card-one relative rounded-xl bg-light-highlight dark:bg-dark-highlight border border-gray-500/20" key={`${name}-${index}`}>
            <div className="line1"></div>
            <div className="line2"></div>
            <button className="flexC gap-1 bg-yellow-800 text-xs 3xl:text-sm px-3 py-1 textColor rounded-sm absolute top-0 right-0 m-2">
              <LiaCrownSolid />
              Pro
            </button>
            <div className="cover w-full h-32 bg-black rounded-t-xl">
              <img src={img} alt={name} className="w-full h-full object-cover rounded-t-xl" />
            </div>
            <div className="px-5 pb-8">
              <div className="w-20 h-20 relative z-10 rounded-full border-[3px] border-light-highlight dark:border-dark-highlight -mt-12">
                <img src={img} alt={name} className="rounded-full" />
              </div>
              <div className="flexbC mt-3">
                <div>
                  <h4 className="font-normal text-sm textColor">{name}</h4>
                  <span className="textColor text-xs opacity-65">{email}</span>
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

export const UserProfileCardDesignThree = () => {
  return (
    <>
      {rowData &&
        rowData.map(({ img, name, email }, index) => (
          <div className="profile-card-one relative rounded-xl" key={`${name}-${index}`}>
            <button className="flexC gap-1 bg-yellow-800 text-xs 3xl:text-sm px-3 py-1 textColor rounded-sm absolute top-0 right-0 m-2">
              <LiaCrownSolid />
              Pro
            </button>
            <div className="cover w-full h-80 rounded-xl">
              <img src={img} alt={name} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-t from-light-surface2 to-transparent dark:from-dark-surface2 dark:to-transparent"></div>
            <div className="p-5 absolute bottom-0 left-0">
              <div className="flexbC mt-3">
                <div>
                  <h4 className="font-normal text-sm textColor">{name}</h4>
                  <span className="textColor text-xs opacity-65">{email}</span>
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

ProfileCard.propTypes = {
  rowData: rowDataShape,
};

UserProfileCardDesignOne.propTypes = {
  rowData: rowDataShape,
};

UserProfileCardDesignTwo.propTypes = {
  rowData: rowDataShape,
};

UserProfileCardDesignThree.propTypes = {
  rowData: rowDataShape,
};
