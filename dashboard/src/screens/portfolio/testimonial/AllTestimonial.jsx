import { deleteTestimonial, getAllTestimonial, getTestimonial, updateTestimonial } from "@/redux/slices/portfolio/testimonialSlice";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, CardFooter, Tabs, TabsHeader, Tab, IconButton, TabPanel, TabsBody, Rating, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { generateItemColor, truncateText } from "@/utils";
import { DateFormatter } from "@/components/common/DateFormatter";
import { NavLink } from "react-router-dom";
import { CiEdit, CiTrash, CiUser } from "react-icons/ci";
import { FaRegFilePdf } from "react-icons/fa";
import { Input, InputLabel, TertiaryButton, Wrapper } from "@/utils/Router";
import { MdEmail, MdLocationPin, MdOutlineStarPurple500 } from "react-icons/md";
import { IoEyeSharp, IoMailUnread } from "react-icons/io5";
import { BiPhoneCall, BiWorld } from "react-icons/bi";
import { BsFillBuildingsFill } from "react-icons/bs";
import { PiHandbagFill } from "react-icons/pi";
import { TbCurrencyDollar } from "react-icons/tb";
import PropTypes from "prop-types";

const TABS = [
  { label: "Contact", value: "contact" },
  { label: "Feedback", value: "feedback" },
  { label: "Project Inquiry", value: "inquiry" },
];

export const AllTestimonial = () => {
  const dispatch = useDispatch();

  const { testimonials } = useSelector((state) => state.testimonial);
  const { testimonialList } = testimonials;
  useEffect(() => {
    dispatch(getAllTestimonial());
  }, [dispatch]);

  const removeblog = async (id) => {
    await dispatch(deleteTestimonial(id));
    await dispatch(getAllTestimonial());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this testimonial",
      message: "Are you sure to do delete this testimonial?.",
      buttons: [
        {
          label: "Delete",
          onClick: () => removeblog(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  return (
    <>
      <TestimonialTable rowData={testimonialList} confirmDelete={confirmDelete} />
    </>
  );
};

export const TestimonialTable = ({ rowData, confirmDelete }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("contact");
  const [replyOpen, setReplyOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
  });

  const { testimonial } = useSelector((state) => state.testimonial);

  const handleReplyOpen = () => setReplyOpen(!replyOpen);
  const handleReplyClose = () => setReplyOpen(null);

  const handleViewOpen = async (id) => {
    const result = await dispatch(getTestimonial(id));
    if (result.payload) {
      setViewOpen(true);
    }
  };

  const handleViewClose = () => {
    setViewOpen(false);
  };

  // Define columns for each tab
  const COLUMNS = {
    contact: ["#", "User", "Phone", "Location", "Message", "Submission"],
    feedback: ["#", "User", "Feedback", "Rating", "Position", "Company", "Submission"],
    inquiry: ["#", "User", "Inquiry", "Project", "Cost", "Company", "Submission"],
  };

  // Filter data based on active tab
  const filteredData = {
    contact: rowData?.filter((item) => item.type === "contact"),
    feedback: rowData?.filter((item) => item.type === "feedback"),
    inquiry: rowData?.filter((item) => item.type === "inquiry"),
  };

  const renderTableRow = (type, item, index) => {
    const isLast = index === filteredData[type].length - 1;
    const classes = isLast ? "p-2" : "p-2 border-b border-blue-gray-100 dark:border-blue-gray-50/10";
    const spanClass = "font-normal text-textColor capitalize text-xs 3xl:text-sm";

    return (
      <tr key={index}>
        <td className={classes}>
          <span className={`${spanClass} px-2`}>{index + 1}</span>
        </td>

        {/* User Column (common for all types) */}
        {(type === "feedback" || type === "inquiry") && (
          <td className={classes}>
            <div className="flex items-center gap-3">
              {item?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" || item?.user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
                <div
                  className="font-semibold capitalize w-8 h-8 3xl:w-10 3xl:h-10 rounded-full flex justify-center items-center text-white text-xl"
                  style={{
                    background: generateItemColor(item?.user?.name || item?.name || "X"),
                  }}
                >
                  {(item?.user?.name?.charAt(0) || item?.name?.charAt(0)) ?? "?"}
                </div>
              ) : (
                <div className="w-8 h-8 3xl:w-10 3xl:h-10 rounded-full">
                  <img src={item?.user?.avatar?.url || item?.avatar?.url} alt={item?.user?.avatar?.publicId || item?.avatar?.publicId} className="w-full h-full object-cover rounded-full" />
                </div>
              )}
              <div className="flex flex-col">
                <span className={spanClass}>{item?.user?.name || item?.name}</span>
                <span className="font-normal opacity-70 text-xs 3xl:text-sm">{item?.user?.email || item?.email}</span>
              </div>
            </div>
          </td>
        )}

        {/* Type-specific columns */}
        {type === "contact" && (
          <>
            <td className={classes}>
              <span className={`${spanClass} px-2`}>{item?.fullname}</span>
            </td>
            <td className={classes}>
              <span className={`${spanClass} px-2`}>{item?.phone}</span>
            </td>
            <td className={classes}>
              <span className={`${spanClass} px-2`}>{item?.location}</span>
            </td>
            <td className={classes}>
              <span className={spanClass}>{truncateText(item?.content, 30)}</span>
            </td>
          </>
        )}

        {type === "feedback" && (
          <>
            <td className={classes}>
              <span className={spanClass}>{truncateText(item?.content, 30)}</span>
            </td>
            <td className={classes}>
              <Rating ratedIcon={<MdOutlineStarPurple500 />} value={item?.rating || 0} readonly />
            </td>
            <td className={classes}>
              <span className={spanClass}>{item?.position}</span>
            </td>
            <td className={classes}>
              <span className={spanClass}>{item?.company}</span>
            </td>
          </>
        )}

        {type === "inquiry" && (
          <>
            <td className={classes}>
              <span className={spanClass}>{truncateText(item?.content, 50)}</span>
            </td>
            <td className={classes}>
              {item?.projectDoc?.filePath ? (
                <NavLink to={item?.projectDoc?.filePath} target="_blank" className="no-underline">
                  <div className="relative bg-teal-400/20 text-teal-500 dark:bg-teal-300/20 dark:text-teal-300 rounded-full textSizeSm size-8 flexC">
                    <FaRegFilePdf />
                  </div>
                </NavLink>
              ) : (
                <span className="textColor textSizeSm">No document</span>
              )}
            </td>
            <td className={classes}>
              <span className={spanClass}>{item?.cost}</span>
            </td>
            <td className={classes}>
              <span className={spanClass}>{item?.company}</span>
            </td>
          </>
        )}

        {/* Common columns */}
        <td className={classes}>
          <span className={`${spanClass} px-2`}>
            <DateFormatter date={item?.createdAt} />
          </span>
        </td>
        <td className={classes}>
          <div className="flex justify-end gap-2">
            <IconButton color="green" size="sm" onClick={() => handleEditOpen(item?._id)}>
              <CiEdit size={20} />
            </IconButton>
            <IconButton color="red" size="sm" onClick={() => confirmDelete(item?._id)}>
              <CiTrash size={20} />
            </IconButton>
            <IconButton color="blue" size="sm" onClick={() => handleViewOpen(item?._id)}>
              <IoEyeSharp />
            </IconButton>
            <Button color="teal" size="sm" onClick={handleReplyOpen}>
              Reply
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  const handleEditOpen = async (id) => {
    const result = await dispatch(getTestimonial(id));
    if (result.payload) {
      setFormData({
        content: result.payload.content || "",
      });
      setEditOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateTestimonial({
          id: testimonial._id,
          data: formData,
        })
      );
      await dispatch(getAllTestimonial());
      handleEditClose();
    } catch (error) {
      console.error("Error updating testimonial:", error);
    }
  };

  return (
    <>
      {/* Edit Testimonial Modal */}
      <Dialog open={editOpen} handler={handleEditClose} size="sm" className="highlightbg">
        <DialogHeader className="textColor font-normal text-lg py-3 border-b border-blue-gray-100 dark:border-blue-gray-50/10">Edit Testimonial Content</DialogHeader>
        <DialogBody className="m-0 py-2">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              {/* Display-only fields */}
              <div className="input">
                <InputLabel className="my-2">Full Name</InputLabel>
                <div className="relative">
                  <Input type="text" className="pl-12" value={testimonial?.fullname || testimonial?.user?.name || testimonial?.name || ""} readOnly disabled />
                  <div className="icon size-9 3xl:size-10 bg-green-300 rounded-full flexC text-white absolute top-1 left-1">
                    <CiUser size={18} />
                  </div>
                </div>
              </div>

              <div className="input">
                <InputLabel className="my-2">Email</InputLabel>
                <div className="relative">
                  <Input type="email" className="pl-12" value={testimonial?.email || testimonial?.user?.email || ""} readOnly disabled />
                  <div className="icon size-9 3xl:size-10 bg-teal-300 rounded-full flexC text-white absolute top-1 left-1">
                    <IoMailUnread size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Editable content field */}
            <div className="mt-3">
              <InputLabel className="my-2">Message</InputLabel>
              <textarea
                className="w-full p-5 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-xl placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
              ></textarea>
            </div>

            <DialogFooter>
              <Button variant="text" size="sm" color="red" className="mr-1" onClick={handleEditClose}>
                <span>Cancel</span>
              </Button>
              <Button variant="gradient" size="sm" color="green" type="submit">
                <span>Update Content</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogBody>
      </Dialog>

      {/* View Testimonial Modal */}
      <Dialog open={viewOpen} handler={handleViewClose} size={testimonial?.type === "contact" ? "md" : "lg"} className="highlightbg">
        <DialogHeader className="textColor flex justify-between font-normal text-lg py-3 border-b border-blue-gray-100 dark:border-blue-gray-50/10">
          <span>Contact Details</span>
          <div className="flex gap-2">
            {testimonial?.reply === true ? (
              <Button color="green" variant="ghost" size="sm" disabled>
                Replied
              </Button>
            ) : (
              <Button color="teal" variant="ghost" size="sm">
                Reply
              </Button>
            )}
            <Button color="red" onClick={handleViewClose} size="sm">
              <span>Close</span>
            </Button>
          </div>
        </DialogHeader>
        <DialogBody className="m-0 py-2">
          {testimonial && (
            <>
              <div className={`${testimonial?.type === "contact" ? "grid grid-cols-2 gap-3" : "grid grid-cols-3 gap-3"}`}>
                <div className="input">
                  <div className="flex items-center gap-1">
                    <InputLabel className="my-2">Full Name</InputLabel>
                  </div>
                  <div className="relative">
                    <Input disabled readOnly className="pl-12" value={testimonial?.fullname} />
                    <div className="icon size-9 3xl:size-10 bg-green-300 rounded-full flexC text-white absolute top-1 left-1">
                      <CiUser size={18} />
                    </div>
                  </div>
                </div>
                <div className="input">
                  <div className="flex items-center gap-1">
                    <InputLabel className="my-2">Email</InputLabel>
                  </div>
                  <div className="relative">
                    <Input disabled readOnly className="pl-12" value={testimonial?.email} />
                    <div className="icon size-9 3xl:size-10 bg-teal-300 rounded-full flexC text-white absolute top-1 left-1">
                      <IoMailUnread size={18} />
                    </div>
                  </div>
                </div>
                <div className="input">
                  <div className="flex items-center gap-1">
                    <InputLabel className="my-2">Address</InputLabel>
                  </div>
                  <div className="relative">
                    <Input disabled readOnly className="pl-12" value={testimonial?.location} />
                    <div className="icon size-9 3xl:size-10 bg-purple-300 rounded-full flexC text-white absolute top-1 left-1">
                      <MdLocationPin size={18} />
                    </div>
                  </div>
                </div>

                <div className="input">
                  <div className="flex items-center gap-1">
                    <InputLabel className="my-2">Phone</InputLabel>
                  </div>
                  <div className="relative">
                    <Input disabled readOnly className="pl-12" value={testimonial?.phone} />
                    <div className="icon size-9 3xl:size-10 bg-blue-gray-300 rounded-full flexC text-white absolute top-1 left-1">
                      <BiPhoneCall size={18} />
                    </div>
                  </div>
                </div>

                {(testimonial?.type === "feedback" || testimonial?.type === "inquiry") && (
                  <>
                    <div className="input">
                      <div className="flex items-center gap-1">
                        <InputLabel className="my-2">Company Name</InputLabel>
                      </div>
                      <div className="relative">
                        <Input readOnly disabled className="pl-12" value={testimonial?.company} />
                        <div className="icon size-9 3xl:size-10 bg-brown-300 rounded-full flexC text-white absolute top-1 left-1">
                          <BsFillBuildingsFill size={18} />
                        </div>
                      </div>
                    </div>
                    <div className="input">
                      <div className="flex items-center gap-1">
                        <InputLabel className="my-2">Designation</InputLabel>
                      </div>
                      <div className="relative">
                        <Input readOnly disabled className="pl-12" value={testimonial?.position} />
                        <div className="icon size-9 3xl:size-10 bg-red-300 rounded-full flexC text-white absolute top-1 left-1">
                          <PiHandbagFill size={18} />
                        </div>
                      </div>
                    </div>
                    <NavLink to={testimonial?.link} className="input flex items-center gap-2 bg-deep-orange-400 rounded-full p-0.5 my-1" target="_blank">
                      <button className="icon size-9 3xl:size-10 bg-deep-orange-700 rounded-full flexC text-white">
                        <BiWorld size={18} />
                      </button>
                      <div className="flex items-center gap-1 text-white textSizeSm">
                        <span>Click to visit website</span>
                      </div>
                    </NavLink>
                    {testimonial?.type === "inquiry" && (
                      <NavLink to={testimonial?.projectDoc?.filePath} className="input flex items-center gap-2 bg-red-400 rounded-full p-0.5 my-1" target="_blank">
                        <button className="icon size-9 3xl:size-10 bg-red-700 rounded-full flexC text-white">
                          <FaRegFilePdf size={18} />
                        </button>
                        <div className="flex items-center gap-1 text-white textSizeSm">
                          <span>Click to view</span>
                        </div>
                      </NavLink>
                    )}
                  </>
                )}

                {testimonial?.type === "feedback" && (
                  <>
                    <div className="input flex items-center gap-2 p-1 bg-orange-700 rounded-full my-1 px-5">
                      <span className="textSizeSm textColor">(5/{testimonial?.rating}) Rating</span>
                      <Rating ratedIcon={<MdOutlineStarPurple500 color="yellow" />} value={testimonial?.rating || 0} readonly />
                    </div>
                  </>
                )}
              </div>

              {testimonial?.type === "inquiry" && (
                <div className="input">
                  <div className="flex items-center gap-1">
                    <InputLabel className="my-2">Budget of Project</InputLabel>
                  </div>
                  <div className="relative">
                    <Input readOnly disabled value={testimonial?.cost} className="pl-12" />
                    <div className="icon h-9 w-9 3xl:h-10 3xl:w-10 bg-amber-300 rounded-full flexC text-white absolute top-1 left-1">
                      <TbCurrencyDollar size={18} />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <InputLabel className="my-2">Message</InputLabel>
                <p className="w-full h-full p-5 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-xl placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50">
                  {testimonial?.content}
                </p>
              </div>
            </>
          )}
        </DialogBody>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={replyOpen} handler={handleReplyOpen} className="highlightbg">
        <DialogHeader className="textColor font-normal text-lg py-3 border-b border-blue-gray-100 dark:border-blue-gray-50/10">Reply Message</DialogHeader>
        <DialogBody className="m-0 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="input">
              <div className="flex items-center gap-1">
                <InputLabel className="my-2">Full Name</InputLabel>
              </div>
              <div className="relative">
                <Input type="text" name="fullname" className="pl-12" placeholder="John Doe" />
                <div className="icon size-9 3xl:size-10 bg-green-300 rounded-full flexC text-white absolute top-1 left-1">
                  <CiUser size={18} />
                </div>
              </div>
            </div>
            <div className="input">
              <div className="flex items-center gap-1">
                <InputLabel className="my-2">To</InputLabel>
              </div>
              <div className="relative">
                <Input type="text" name="fullname" className="pl-12" placeholder="example@gmail.com" />
                <div className="icon size-9 3xl:size-10 bg-pink-300 rounded-full flexC text-white absolute top-1 left-1">
                  <MdEmail size={18} />
                </div>
              </div>
            </div>
          </div>
          <InputLabel className="my-2 mt-3">Message</InputLabel>
          <textarea
            className="w-full p-5 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-xl placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50"
            name="content"
            placeholder="Write your message here..."
            rows={10}
          ></textarea>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" size="sm" color="red" className="mr-1" onClick={handleReplyClose}>
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" size="sm" color="green" onClick={handleReplyOpen}>
            <span>Send</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <Wrapper className="h-full w-full">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <div className="flex justify-between items-center px-4 pt-4">
            <TabsHeader className="bg-teal-500 w-[27rem]" indicatorProps={{ className: "bg-teal-500 shadow-none" }}>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value} className="text-white">
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
            <NavLink to="/create-testimonial">
              <TertiaryButton>Create</TertiaryButton>
            </NavLink>
          </div>
          <TabsBody>
            {TABS.map(({ value }) => (
              <TabPanel key={value} value={value} className="p-0">
                <table className="w-full text-left mt-4">
                  <thead>
                    <tr>
                      {COLUMNS[value].map((head) => (
                        <th key={head} className="cursor-pointer border-y border-blue-gray-100 dark:border-blue-gray-50/20 bg-blue-gray-50/50 dark:bg-blue-gray-900 py-4 px-2 transition-colors">
                          <Typography variant="small" className="font-normal leading-none textColor">
                            {head}
                          </Typography>
                        </th>
                      ))}
                      <th className="border-y border-blue-gray-100 dark:border-blue-gray-50/20 bg-blue-gray-50/50 dark:bg-blue-gray-900 transition-colors">
                        <Typography variant="small" className="font-normal leading-none textColor text-right px-4">
                          Action
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData[value]?.length > 0 ? (
                      filteredData[value].map((item, index) => renderTableRow(value, item, index))
                    ) : (
                      <tr>
                        <td colSpan={COLUMNS[value].length} className="text-center py-4">
                          No {value} data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>

        <CardFooter className="flex items-center justify-between p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page 1 of 10
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">
              Previous
            </Button>
            <Button variant="outlined" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Wrapper>
    </>
  );
};

TestimonialTable.propTypes = {
  rowData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["contact", "feedback", "inquiry"]).isRequired,
      name: PropTypes.string,
      user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        avatar: PropTypes.shape({
          url: PropTypes.string,
          publicId: PropTypes.string,
        }),
      }),
      fullname: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      location: PropTypes.string,
      content: PropTypes.string,
      rating: PropTypes.number,
      position: PropTypes.string,
      company: PropTypes.string,
      cost: PropTypes.string,
      projectDoc: PropTypes.shape({
        filePath: PropTypes.string,
      }),
      avatar: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          url: PropTypes.string,
          publicId: PropTypes.string,
        }),
      ]),
      createdAt: PropTypes.string.isRequired,
      slug: PropTypes.string,
    })
  ),
  confirmDelete: PropTypes.func.isRequired,
};
