import { Button, Dialog, DialogBody, DialogHeader, DialogFooter, Input, InputLabel } from "@material-tailwind/react";
import { CiUser } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import PropTypes from "prop-types";

export const ReplyTestimonialModal = ({ open, handler }) => {
  return (
    <Dialog open={open} handler={handler} className="highlightbg">
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
        <Button variant="text" size="sm" color="red" className="mr-1" onClick={handler}>
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" size="sm" color="green" onClick={handler}>
          <span>Send</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

ReplyTestimonialModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handler: PropTypes.func.isRequired,
};
