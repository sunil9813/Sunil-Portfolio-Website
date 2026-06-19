import PropTypes from "prop-types";
import { Avatar, Tooltip } from "@material-tailwind/react";
import { BsInstagram, BsTiktok, BsTwitterX, BsFilePost, BsPeople, BsPersonPlus, BsStarFill, BsCheckCircle } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { generateItemColor } from "@/utils";
import { useState, useMemo } from "react";
import { Wrapper } from "@/utils/Router";

export const UserListCard = ({ rowData }) => {
  return (
    <>
      <Wrapper className="rounded-2xl p-3 overflow-hidden border border-blue-gray-100 dark:border-white/5 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {rowData.map((user) => {
            const displayName = user?.name || "Unknown";
            const email = user?.email;
            const role = user?.role || "Member";
            const isDefault = !user?.avatar?.url || user?.avatar?.url.includes("flaticon");
            const avatarColor = generateItemColor(displayName);

            const isVerified = user?.verified ?? displayName.length % 2 === 0;
            const isPremium = user?.premium ?? (email && email.includes("premium"));

            return (
              <div
                key={user._id}
                className="group relative flex flex-col bg-white/5 backdrop-blur-3xl rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-blue-gray-50 dark:border-white/5"
              >
                {/* Header – unique gradient */}
                <div className={`relative h-20 bg-gradient-to-r   dark:brightness-90`}>
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,_white_1px,_transparent_1px)] bg-[size:12px_12px]" />
                  {isPremium && <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400/95 text-slate-900 text-[10px] font-bold uppercase shadow backdrop-blur-sm">Pro</span>}
                </div>

                {/* Avatar */}
                <div className="flex justify-center -mt-11 mb-3">
                  <div className="relative">
                    {isDefault ? (
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white dark:ring-[#0f172a]"
                        style={{ background: avatarColor }}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <Avatar src={user.avatar.url} alt={displayName} className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-[#0f172a] shadow-lg" />
                    )}
                    <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#0f172a] rounded-full shadow" />
                    {isVerified && (
                      <div className="absolute -top-0.5 -right-0.5 bg-white dark:bg-[#0f172a] rounded-full p-0.5 shadow">
                        <BsCheckCircle className="w-4 h-4 text-blue-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center px-4 pb-4 text-center">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white truncate max-w-[140px] mt-1">{displayName}</h3>

                  <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 text-violet-700 dark:text-violet-300">
                    {role}
                  </span>

                  {email && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 truncate max-w-[160px]">{email}</p>}

                  {/* Social icons */}
                  <div className="flex items-center gap-3 mt-4 text-slate-400 dark:text-slate-500">
                    <Tooltip content="Facebook" className="bg-indigo-600 text-xs">
                      <button className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-indigo-500 transition-colors">
                        <FaFacebookF size={13} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Instagram" className="bg-pink-600 text-xs">
                      <button className="p-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-pink-500/20 hover:text-pink-500 transition-colors">
                        <BsInstagram size={13} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Twitter" className="bg-blue-600 text-xs">
                      <button className="p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-500/20 hover:text-blue-500 transition-colors">
                        <BsTwitterX size={13} />
                      </button>
                    </Tooltip>
                    <Tooltip content="TikTok" className="bg-gray-800 text-xs">
                      <button className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-500/20 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <BsTiktok size={13} />
                      </button>
                    </Tooltip>
                  </div>

                  {/* Divider */}
                  <div className="w-full my-4 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 w-full">
                    <div className="flex flex-col items-center">
                      <BsFilePost className="w-4 h-4 text-slate-400 mb-0.5" />
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{user.posts ?? 12}</p>
                      <p className="text-[10px] text-slate-400">Posts</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <BsPeople className="w-4 h-4 text-slate-400 mb-0.5" />
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{user.followers ?? "1.2k"}</p>
                      <p className="text-[10px] text-slate-400">Followers</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <BsPersonPlus className="w-4 h-4 text-slate-400 mb-0.5" />
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{user.following ?? 340}</p>
                      <p className="text-[10px] text-slate-400">Following</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Wrapper>
    </>
  );
};

UserListCard.propTypes = {
  rowData: PropTypes.array,
};
