import { Avatar, IconButton, Tooltip, Switch } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { CiEdit, CiGrid2H, CiGrid41, CiLink, CiTrash } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Pagination } from "../Pagination";
import { DateFormatter } from "../common/DateFormatter";
import { generateItemColor, truncateText } from "@/utils";
import { TertiaryButton } from "../customeUI/Button";

export const Table = ({ head, rowData, btntext, linktocreate, linktoview, comp, deleteFun, rowsPerPageNumber = 5, type, linktoupdate, handleVisibilityToggle, handleFeaturedToggle, hidden }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("table");
  // Model
  /*  const [openImageId, setOpenImageId] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = (id) => setOpenImageId(id);
  const handleClose = () => setOpen(null); */

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = rowsPerPageNumber;
  const totalPages = Math.ceil(rowData?.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get rows for the current page
  const indexOfFirstRow = (currentPage - 1) * rowsPerPage;
  const indexOfLastRow = Math.min(indexOfFirstRow + rowsPerPage, rowData?.length);
  const currentRows = rowData?.slice(indexOfFirstRow, indexOfLastRow);

  console.log(rowData);

  return (
    <>
      <section className="relative">
        <div className="flex items-center gap-2 absolute -top-7 right-4 z-10">
          <button className="button !w-auto !px-2" onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}>
            {viewMode === "table" ? <CiGrid2H size={15} className="text-black dark:text-white" /> : <CiGrid41 size={15} className="text-black dark:text-white" />}
          </button>
          <TertiaryButton className="!w-auto !h-auto py-2 !px-5 flex items-center gap-2" onClick={() => navigate(`/${linktocreate}`)}>
            <FaPlus size={10} /> <span className="!text-xs">{btntext}</span>
          </TertiaryButton>
        </div>
        {viewMode === "table" ? (
          <div className="w-full">
            {rowData?.length === 0 ? (
              <h2 className="capitalize p-14 text-center  text-xl 3xl:text-2xl font-semibold textColor">No data available.</h2>
            ) : (
              <>
                <div className="common-table relative">
                  <table className="mt-3 w-full min-w-max table-auto text-left overflow-hidden">
                    <thead>
                      <tr>
                        {head &&
                          head.map((list) => (
                            <th key={list} className="bg-[#03363d] p-2 3xl:p-3">
                              <span className="font-normal text-xs 3xl:text-sm text-white">{list}</span>
                            </th>
                          ))}
                        <th className="bg-[#03363d] p-2 3xl:p-3 text-white text-right px-5 w-10">
                          <span className="font-normal text-xs 3xl:text-sm text-white">Action</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-textcolor">
                      {currentRows &&
                        currentRows.map((item, index) => {
                          const isLast = index === rowData?.length - 1;
                          const classes = isLast ? "p-2 3xl:p-3" : "p-2 3xl:p-3 border-b border-gray-50/10";
                          const spanClass = "font-normal text-textColor capitalize text-xs 3xl:text-sm";

                          // Calculate dynamic serial number based on the current page
                          const serialNumber = (currentPage - 1) * rowsPerPage + index + 1;

                          return (
                            <tr key={`${item._id}-${serialNumber}`} className="transition-colors duration-300">
                              <td className={`${classes} ${spanClass} px-5 w-12`}>{serialNumber}</td>
                              {!hidden && (
                                <td className={`${classes}  ${type === "project" ? "w-auto" : "w-56"}`}>
                                  <div className="flex items-center gap-3">
                                    {item?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" || item?.user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
                                      <div
                                        className="font-semibold capitalize w-8 h-8 3xl:w-10 3xl:h-10 rounded-full flex justify-center items-center text-white text-xl"
                                        style={{
                                          background: generateItemColor(item?.user?.name || item?.name || "X"), // Unique background color
                                        }}
                                      >
                                        {(item?.user?.name?.charAt(0) || item?.name?.charAt(0)) ?? "?"}
                                      </div>
                                    ) : (
                                      <div className="w-8 h-8 3xl:w-10 3xl:h-10 rounded-full">
                                        <img
                                          src={item?.user?.avatar?.url || item?.avatar?.url}
                                          alt={item?.user?.avatar?.publicId || item?.avatar?.publicId}
                                          className="w-full h-full object-cover rounded-full"
                                        />
                                      </div>
                                    )}
                                    <div className="flex flex-col">
                                      <span className={spanClass}>{item?.user?.name || item?.name}</span>
                                      <span className="font-normal opacity-70 text-xs 3xl:text-sm">{item?.user?.email || item?.email}</span>
                                    </div>
                                  </div>
                                </td>
                              )}
                              {/* Users List */}
                              {type === "users" && (
                                <>
                                  <td className={classes}>
                                    <span className={spanClass}>{item?.role}</span>
                                  </td>
                                  <td className={classes}>
                                    <span className={spanClass}>Do it</span>
                                  </td>
                                </>
                              )}

                              {/* Cateory List */}
                              {type === "category" && (
                                <>
                                  <td className={classes}>
                                    <div className="flex flex-col">
                                      <span className={`${spanClass} !uppercase`}>{item?.title}</span>
                                    </div>
                                  </td>
                                  <td className={classes}>
                                    <div className="flex items-center gap-3">
                                      <Avatar src={item?.cover?.filePath} alt={item?.cover?.publicId} size="sm" className="!rounded-md" />
                                    </div>
                                  </td>
                                  <td className={classes}>
                                    <div className="flex flex-col capitalize">
                                      <span className={`${spanClass}`}>{item?.type}</span>
                                    </div>
                                  </td>
                                  <td className={classes}>
                                    <div className="flex flex-col">
                                      <span className={`${spanClass}`}>258 (TODO)</span>
                                    </div>
                                  </td>
                                </>
                              )}

                              {/* Blog List */}
                              {type === "blog" && (
                                <>
                                  <td className={classes}>
                                    <span className={spanClass}>{truncateText(item?.title, 30)}</span>
                                  </td>
                                  <td className={`${classes}`}>
                                    <button className="w-8 h-8 3xl:w-10 3xl:h-10 rounded-md">
                                      <img src={item?.cover?.filePath} alt={item?.cover?.publicId} className="w-full h-full object-cover rounded-md" />
                                    </button>
                                  </td>
                                  <td className={`${classes}`}>
                                    <div className="w-max">
                                      <div className="bg-teal-400/20 text-teal-500 dark:bg-teal-300/20 dark:text-teal-300 rounded-full text-xs px-3 py-1">
                                        {item?.numOfViews === 0 ? "0" : item?.numOfViews}
                                      </div>
                                    </div>
                                  </td>

                                  {/* number of likes  to do */}
                                  <td className={`${classes}`}>
                                    <div className="w-max">
                                      <div className="bg-yellow-400/20 text-yellow-800 dark:bg-yellow-300/20 dark:text-yellow-300 rounded-full text-xs px-3 py-1">
                                        {item?.likes?.length === 0 ? "0" : item?.likes?.length}
                                      </div>
                                    </div>
                                  </td>

                                  <td className={classes}>
                                    <span className={`${spanClass} !uppercase`}>{item?.category?.title}</span>
                                  </td>

                                  <td className={classes}>
                                    <Switch
                                      className="h-full w-full checked:bg-deep-purple-500"
                                      circleProps={{ className: "border-none" }}
                                      defaultChecked={item?.visibility === "public"}
                                      onChange={() => handleVisibilityToggle(item?._id, item?.visibility === "public" ? "private" : "public")}
                                    />
                                  </td>

                                  <td className={classes}>
                                    <Switch
                                      className="h-full w-full checked:bg-deep-purple-500"
                                      circleProps={{ className: "border-none" }}
                                      defaultChecked={item?.featured === true}
                                      onChange={() => handleFeaturedToggle(item?._id, !item?.featured)}
                                    />
                                  </td>
                                </>
                              )}

                              {/* Project List */}
                              {type === "project" && (
                                <>
                                  <td className={classes}>
                                    <span className={spanClass}>{truncateText(item?.title, 22)}</span>
                                  </td>
                                  <td className={classes}>
                                    <span className={spanClass}>${item?.price}</span>
                                  </td>
                                  <td className={`${classes}`}>
                                    {!item?.thumbnail || !item?.thumbnail?.filePath ? (
                                      <div className="w-16 h-8 3xl:w-20 3xl:h-10 rounded-md bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>
                                    ) : (
                                      <button className="w-16 h-8 3xl:w-20 3xl:h-10 rounded-md">
                                        <img src={item.thumbnail.filePath} alt={item.thumbnail.publicId || "thumbnail"} className="w-full h-full object-cover rounded-md" />
                                      </button>
                                    )}
                                  </td>
                                  <td className={`${classes}`}>
                                    <div className="w-max">
                                      <div className="bg-green-400/20 text-green-800 dark:bg-green-300/20 dark:text-green-300 rounded-full text-xs px-3 py-1">
                                        {item?.assets?.length === 0 ? "0" : item?.assets?.length}
                                      </div>
                                    </div>
                                  </td>

                                  <td className={`${classes}`}>
                                    <div className="w-max">
                                      <div className="bg-teal-400/20 text-teal-500 dark:bg-teal-300/20 dark:text-teal-300 rounded-full text-xs px-3 py-1">
                                        {item?.numOfViews === 0 ? "0" : item?.numOfViews}
                                      </div>
                                    </div>
                                  </td>

                                  {/* number of likes  to do */}
                                  <td className={`${classes}`}>
                                    <div className="w-max">
                                      <div className="bg-yellow-400/20 text-yellow-800 dark:bg-yellow-300/20 dark:text-yellow-300 rounded-full text-xs px-3 py-1">
                                        {item?.likes?.length === 0 ? "0" : item?.likes?.length}
                                      </div>
                                    </div>
                                  </td>
                                  <td className={`${classes}`}>
                                    <div className="w-max">
                                      <div className="bg-purple-400/20 text-purple-800 dark:bg-purple-300/20 dark:text-purple-300 rounded-full text-xs px-3 py-1">{item?.ratings}</div>
                                    </div>
                                  </td>
                                  <td className={`${classes}`}>
                                    <div className="w-max">
                                      <div className="bg-pink-400/20 text-pink-800 dark:bg-pink-300/20 dark:text-pink-300 rounded-full text-xs px-3 py-1">{item?.downloadCount}</div>
                                    </div>
                                  </td>

                                  <td className={classes}>
                                    <span className={`${spanClass} !uppercase`}>{item?.category?.title}</span>
                                  </td>

                                  <td className={classes}>
                                    <Switch
                                      className="h-full w-full checked:bg-deep-purple-500"
                                      circleProps={{ className: "border-none" }}
                                      defaultChecked={item?.visibility === "public"}
                                      onChange={() => handleVisibilityToggle(item?._id, item?.visibility === "public" ? "private" : "public")}
                                    />
                                  </td>

                                  <td className={classes}>
                                    <Switch
                                      className="h-full w-full checked:bg-deep-purple-500"
                                      circleProps={{ className: "border-none" }}
                                      defaultChecked={item?.featured === true}
                                      onChange={() => handleFeaturedToggle(item?._id, !item?.featured)}
                                    />
                                  </td>
                                </>
                              )}

                              {/* University List */}
                              {type === "university" && (
                                <>
                                  <td className={classes}>
                                    {/* <span className={spanClass}>{truncateText(item?.name)}</span> */}
                                    <span className={spanClass}>{item?.name}</span>
                                  </td>
                                  <td className={`${classes}`}>
                                    <button className="w-8 h-8 3xl:w-10 3xl:h-10 rounded-md">
                                      <img src={item?.logo?.filePath} alt={item?.logo?.publicId} className="w-full h-full object-cover rounded-md" />
                                    </button>
                                  </td>
                                  <td className={classes}>
                                    <span className={spanClass}>{item?.edate}</span>
                                  </td>
                                  <td className={classes}>
                                    <span className={spanClass}>{truncateText(item?.location, 30)}</span>
                                  </td>
                                  <td className={classes}>
                                    {/* <span className={spanClass}>{truncateText(item?.name)}</span> */}
                                    <span className={spanClass}>{item?.type}</span>
                                  </td>
                                  <td className={classes}>
                                    {/* <span className={spanClass}>{truncateText(item?.name)}</span> */}
                                    <NavLink to={item?.website} target="_blank" className={spanClass}>
                                      Browse URL
                                    </NavLink>
                                  </td>
                                </>
                              )}

                              {/* department List */}
                              {type === "department" && (
                                <>
                                  <td className={classes}>
                                    {/* <span className={spanClass}>{truncateText(item?.name)}</span> */}
                                    <span className={spanClass}>{item?.name}</span>
                                  </td>
                                  <td className={`${classes}`}>
                                    <button className="w-8 h-8 3xl:w-10 3xl:h-10 rounded-md">
                                      <img src={item?.thumbnail?.filePath} alt={item?.thumbnail?.publicId} className="w-full h-full object-cover rounded-md" />
                                    </button>
                                  </td>
                                  <td className={classes}>
                                    <span className={spanClass}>{item?.university?.name}</span>
                                  </td>
                                  <td className={classes}>
                                    <span className={spanClass}>{item?.faculty?.name}</span>
                                  </td>
                                </>
                              )}

                              {/* Subject / Courses List */}
                              {type === "course" && (
                                <>
                                  <td className={classes}>
                                    <span className={spanClass}>{truncateText(item?.name, 30)}</span>
                                  </td>
                                  <td className={classes}>
                                    <span className={spanClass}>{item?.accessType === "paid" ? `Paid` : "Free"}</span>
                                  </td>
                                  <td className={`${classes}`}>
                                    {!item?.thumbnail || !item?.thumbnail?.filePath ? (
                                      <div className="w-16 h-8 3xl:w-20 3xl:h-10 rounded-md bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>
                                    ) : (
                                      <button className="w-16 h-8 3xl:w-20 3xl:h-10 rounded-md">
                                        <img src={item.thumbnail.filePath} alt={item.thumbnail.publicId || "thumbnail"} className="w-full h-full object-cover rounded-md" />
                                      </button>
                                    )}
                                  </td>

                                  <td className={`${classes}`}>
                                    <div className="w-max">
                                      <div className="bg-teal-400/20 text-teal-500 dark:bg-teal-300/20 dark:text-teal-300 rounded-full text-xs px-3 py-1">
                                        {item?.numOfViews === 0 ? "0" : item?.numOfViews}
                                      </div>
                                    </div>
                                  </td>

                                  {/* number of likes  to do */}
                                  <td className={`${classes}`}>
                                    <div className="w-max">
                                      <div className="bg-yellow-400/20 text-yellow-800 dark:bg-yellow-300/20 dark:text-yellow-300 rounded-full text-xs px-3 py-1">
                                        {/* {item?.likes?.length === 0 ? "0" : item?.likes?.length} */}
                                        {item?.likesCount === 0 ? "0" : item?.likesCount}
                                      </div>
                                    </div>
                                  </td>
                                  <td className={`${classes}`}>
                                    <div className="w-max">
                                      <div className="bg-purple-400/20 text-purple-800 dark:bg-purple-300/20 dark:text-purple-300 rounded-full text-xs px-3 py-1">0{item?.ratings}</div>
                                    </div>
                                  </td>

                                  <td className={classes}>
                                    <Switch
                                      className="h-full w-full checked:bg-deep-purple-500"
                                      circleProps={{ className: "border-none" }}
                                      defaultChecked={item?.visibility === "public"}
                                      onChange={() => handleVisibilityToggle(item?._id, item?.visibility === "public" ? "private" : "public")}
                                    />
                                  </td>

                                  <td className={classes}>
                                    <Switch
                                      className="h-full w-full checked:bg-deep-purple-500"
                                      circleProps={{ className: "border-none" }}
                                      defaultChecked={item?.featured === true}
                                      onChange={() => handleFeaturedToggle(item?._id, !item?.featured)}
                                    />
                                  </td>
                                </>
                              )}

                              <td className={`${classes}`}>
                                <div className={spanClass}>
                                  <DateFormatter date={item?.createdAt} />
                                </div>
                              </td>
                              <td className={`${classes}`}>
                                <div className=" flex justify-end">
                                  <Tooltip className="bg-green-400 capitalize" content={`Edit ${type}`}>
                                    <NavLink to={`/${linktoupdate}/${item?.slug}`}>
                                      <IconButton variant="text" color="green" size="sm" className="text-md 3xl:text-xl">
                                        <CiEdit />
                                      </IconButton>
                                    </NavLink>
                                  </Tooltip>
                                  <Tooltip className="bg-red-400 capitalize" content={`Delete ${type}`}>
                                    <IconButton variant="text" color="red" size="sm" className="text-md 3xl:text-xl" onClick={() => deleteFun(item?._id)}>
                                      <CiTrash />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip className="bg-blue-400 capitalize" content={`View ${type}`}>
                                    <IconButton variant="text" color="blue" size="sm" className="text-md 3xl:text-xl" onClick={() => navigate(`/${linktoview}/${item?.slug}`)}>
                                      <CiLink />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  {/* Pagination Footer */}
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
              </>
            )}
          </div>
        ) : (
          comp
        )}
      </section>
    </>
  );
};

Table.propTypes = {
  head: PropTypes.array,
  rowData: PropTypes.array,
  btntext: PropTypes.string,
  linktocreate: PropTypes.string,
  linktoupdate: PropTypes.string,
  linktoview: PropTypes.string,
  comp: PropTypes.any,
  rowsPerPageNumber: PropTypes.number,
  type: PropTypes.string,
  deleteFun: PropTypes.any,
  hidden: PropTypes.any,
  handleVisibilityToggle: PropTypes.any,
  handleFeaturedToggle: PropTypes.any,
};
