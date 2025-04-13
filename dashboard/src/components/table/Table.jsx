import { CardHeader, Typography, Button, Avatar, IconButton, Tooltip, Switch, Chip } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { CiEdit, CiGrid2H, CiGrid41, CiLink, CiTrash } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { SearchBox, Wrapper } from "@/utils/Router";
import { useState } from "react";
import { Pagination } from "../Pagination";
import { DateFormatter } from "../common/DateFormatter";
import { generateItemColor, truncateText } from "@/utils";

export const Table = ({ head, rowData, btntext, linktocreate, linktoview, comp, deleteFun, rowsPerPageNumber = 5, type, linktoupdate, handleVisibilityToggle, handleFeaturedToggle }) => {
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
      <Wrapper className="common-table">
        <CardHeader floated={false} shadow={false} className="rounded-none bg-sidebarbg py-2">
          <div className="flex items-center justify-between gap-8">
            {/* <GradientWrapper className="w-72">
              <input type="text" className="bg-none outline-none h-12 px-3 w-full" placeholder="Search here..." />
            </GradientWrapper> */}
            <div className="search-box w-2/5">
              <SearchBox />
            </div>
            <div className="flex items-center gap-3">
              <IconButton color="teal" size="md" onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}>
                {viewMode === "table" ? <CiGrid2H size={20} className="text-white" /> : <CiGrid41 size={20} className="text-white" />}
              </IconButton>
              <Button className="flex items-center gap-3 text-white/70" size="md" color="teal" onClick={() => navigate(`/${linktocreate}`)}>
                <FaPlus size={18} /> {btntext}
              </Button>
            </div>
          </div>
        </CardHeader>

        {viewMode === "table" ? (
          <div className="w-full">
            {rowData?.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Typography variant="h6">No data available.</Typography>
              </div>
            ) : (
              <table className="mt-4 w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {head &&
                      head.map((list) => (
                        <th key={list} className="border-y border-gray-50/10 bg-primarybg p-4">
                          <Typography variant="small" className="font-normal leading-none text-white">
                            {list}
                          </Typography>
                        </th>
                      ))}
                    <th className="border-y border-gray-50/10 bg-primarybg p-4 text-white text-right px-5 w-52">
                      <Typography variant="small" className="font-normal leading-none text-white">
                        Action
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-textcolor">
                  {currentRows &&
                    currentRows.map((item, index) => {
                      const isLast = index === rowData?.length - 1;
                      const classes = isLast ? "p-4" : "p-4 border-b border-gray-50/10";

                      // Calculate dynamic serial number based on the current page
                      const serialNumber = (currentPage - 1) * rowsPerPage + index + 1;

                      return (
                        <tr key={`${item._id}-${serialNumber}`} className="even:bg-blue-gray-900/30 hover:bg-gray-900 transition-colors duration-300">
                          <td className={`${classes} w-20`}>{serialNumber}</td>
                          <td className={`${classes} w-56`}>
                            <div className="flex items-center gap-3">
                              {item?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" || item?.user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
                                <div
                                  className="font-semibold capitalize w-10 h-10 rounded-full flex justify-center items-center text-white text-xl"
                                  style={{
                                    background: generateItemColor(item?.user?.name || item?.name || "X"), // Unique background color
                                  }}
                                >
                                  {(item?.user?.name?.charAt(0) || item?.name?.charAt(0)) ?? "?"}
                                </div>
                              ) : (
                                <Avatar src={item?.user?.avatar?.url || item?.avatar?.url} alt={item?.user?.avatar?.publicId || item?.avatar?.publicId} size="sm" />
                              )}

                              <div className="flex flex-col">
                                <Typography variant="small" className="font-normal capitalize">
                                  {item?.user?.name || item?.name}
                                </Typography>
                                <Typography variant="small" className="font-normal opacity-70">
                                  {item?.user?.email || item?.email}
                                </Typography>
                              </div>
                            </div>
                          </td>

                          {/* Users List */}
                          {type === "users" && (
                            <>
                              <td className={classes}>
                                <div className="flex flex-col">
                                  <Typography variant="small" className="font-normal capitalize">
                                    {item?.role}
                                  </Typography>
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex flex-col">
                                  <Typography variant="small" className="font-normal">
                                    Do it
                                  </Typography>
                                </div>
                              </td>
                            </>
                          )}

                          {/* Cateory List */}
                          {type === "category" && (
                            <>
                              <td className={classes}>
                                <div className="flex flex-col">
                                  <Typography variant="small" className="font-normal uppercase">
                                    {item?.title}
                                  </Typography>
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex items-center gap-3">
                                  <Avatar src={item?.cover?.filePath} alt={item?.cover?.publicId} size="sm" variant="square" />
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex flex-col capitalize">
                                  <Typography variant="small" className="font-normal">
                                    {item?.type}
                                  </Typography>
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex flex-col">
                                  <Typography variant="small" className="font-normal">
                                    258 (TODO)
                                  </Typography>
                                </div>
                              </td>
                            </>
                          )}

                          {/* Blog List */}
                          {type === "blog" && (
                            <>
                              <td className={classes}>
                                <div className="flex flex-col">
                                  <Typography variant="small" className="font-normal uppercase">
                                    {truncateText(item?.title, 45)}
                                  </Typography>
                                </div>
                              </td>
                              <td className={classes}>
                                <button className="flex items-center gap-3">
                                  <Avatar src={item?.cover?.filePath} alt={item?.cover?.publicId} size="sm" variant="rounded" />
                                </button>
                              </td>
                              <td className={classes}>
                                <div className="flex flex-col capitalize">
                                  <div className="w-max">
                                    <Chip variant="outlined" className="rounded-full border border-gray-600" size="sm" value={item?.numOfViews === 0 ? "0" : item?.numOfViews} />
                                  </div>
                                </div>
                              </td>

                              {/* number of likes  to do */}
                              <td className={classes}>
                                <div className="flex flex-col capitalize">
                                  <div className="w-max">
                                    <Chip variant="outlined" className="rounded-full border border-gray-600" size="sm" value={item?.likes?.length === 0 ? "0" : item?.likes?.length} />
                                  </div>
                                </div>
                              </td>

                              <td className={classes}>
                                <div className="flex flex-col uppercase">
                                  <Typography variant="small" className="font-normal">
                                    {item?.category?.title}
                                  </Typography>
                                </div>
                              </td>

                              <td className={classes}>
                                <div className="flex flex-col">
                                  <Switch
                                    className="h-full w-full checked:bg-green-500"
                                    defaultChecked={item?.visibility === "public"}
                                    onChange={() => handleVisibilityToggle(item?._id, item?.visibility === "public" ? "private" : "public")}
                                  />
                                </div>
                              </td>

                              <td className={classes}>
                                <div className="flex flex-col">
                                  <Switch className="h-full w-full checked:bg-green-500" defaultChecked={item?.featured === true} onChange={() => handleFeaturedToggle(item?._id, !item?.featured)} />
                                </div>
                              </td>
                            </>
                          )}

                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography variant="small" className="font-normal">
                                <DateFormatter date={item?.createdAt} />
                              </Typography>
                            </div>
                          </td>
                          <td className={`${classes}`}>
                            <div className=" flex justify-end">
                              <Tooltip className="bg-green-400 capitalize" content={`Edit ${type}`}>
                                <NavLink to={`/${linktoupdate}/${item?.slug}`}>
                                  <IconButton variant="text" color="green" size="sm">
                                    <CiEdit size={20} />
                                  </IconButton>
                                </NavLink>
                              </Tooltip>
                              <Tooltip className="bg-red-400 capitalize" content={`Delete ${type}`}>
                                <IconButton variant="text" color="red" size="sm" onClick={() => deleteFun(item?._id)}>
                                  <CiTrash size={20} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip className="bg-blue-400 capitalize" content={`View ${type}`}>
                                <IconButton variant="text" color="blue" size="sm" onClick={() => navigate(`/${linktoview}/${item?.slug}`)}>
                                  <CiLink size={20} />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          comp
        )}

        {/* Pagination Footer */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </Wrapper>
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
  handleVisibilityToggle: PropTypes.any,
  handleFeaturedToggle: PropTypes.any,
};
