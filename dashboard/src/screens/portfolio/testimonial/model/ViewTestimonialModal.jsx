import { Button, Dialog, DialogBody, DialogHeader, Input, InputLabel, Rating } from "@material-tailwind/react";
import { MdLocationPin, MdOutlineStar } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { IoMailUnread } from "react-icons/io5";
import { BiPhoneCall, BiWorld } from "react-icons/bi";
import { BsFillBuildingsFill } from "react-icons/bs";
import { PiHandbagFill } from "react-icons/pi";
import { TbCurrencyDollar } from "react-icons/tb";
import { FaRegFilePdf } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

export const ViewTestimonialModal = ({ open, handler, testimonial }) => {
  return (
    <Dialog open={open} handler={handler} size={testimonial?.type === "contact" ? "md" : "lg"} className="highlightbg">
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
          <Button color="red" onClick={handler} size="sm">
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
                <div className="input flex items-center gap-2 p-1 bg-orange-700 rounded-full my-1 px-5">
                  <span className="textSizeSm textColor">(5/{testimonial?.rating}) Rating</span>
                  <Rating ratedIcon={<MdOutlineStar color="yellow" />} value={testimonial?.rating || 0} readonly />
                </div>
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
  );
};

ViewTestimonialModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handler: PropTypes.func.isRequired,
  testimonial: PropTypes.shape({
    _id: PropTypes.string,
    type: PropTypes.oneOf(["contact", "feedback", "inquiry"]),
    fullname: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    location: PropTypes.string,
    content: PropTypes.string,
    rating: PropTypes.number,
    position: PropTypes.string,
    company: PropTypes.string,
    cost: PropTypes.string,
    link: PropTypes.string,
    projectDoc: PropTypes.shape({
      filePath: PropTypes.string,
    }),
    reply: PropTypes.bool,
  }),
};
