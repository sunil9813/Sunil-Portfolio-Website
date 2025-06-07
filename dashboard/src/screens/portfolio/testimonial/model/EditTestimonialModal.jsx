import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, InputLabel } from "@material-tailwind/react";
import { CiUser } from "react-icons/ci";
import { IoMailUnread } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { updateTestimonial, getAllTestimonial } from "@/redux/slices/portfolio/testimonialSlice";
import PropTypes from "prop-types";

export const EditTestimonialModal = ({ open, handler, formData, setFormData, testimonialId }) => {
  const dispatch = useDispatch();
  const { testimonial } = useSelector((state) => state.testimonial);

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
          id: testimonialId,
          data: formData,
        })
      );
      await dispatch(getAllTestimonial());
      handler();
    } catch (error) {
      console.error("Error updating testimonial:", error);
    }
  };

  return (
    <Dialog open={open} handler={handler} size="lg" className="highlightbg">
      <DialogHeader className="textColor font-normal text-lg py-3 border-b border-blue-gray-100 dark:border-blue-gray-50/10">Edit Testimonial Content</DialogHeader>
      <DialogBody className="m-0 py-2">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
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
            <Button variant="text" size="sm" color="red" className="mr-1" onClick={handler}>
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" size="sm" color="green" type="submit">
              <span>Update Content</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogBody>
    </Dialog>
  );
};

EditTestimonialModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handler: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    content: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  testimonialId: PropTypes.string.isRequired,
};
