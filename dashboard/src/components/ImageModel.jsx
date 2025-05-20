import { Dialog, DialogBody, IconButton } from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";

export const ImageModel = ({ open, handleOpen, src, alt }) => {
  return (
    <Dialog size="lg" open={open} handler={handleOpen}>
      <IconButton size="sm" onClick={handleOpen} className="absolute -top-5 -right-5 z-20 bg-red-400">
        <IoClose size={20} />
      </IconButton>
      <DialogBody>
        <img alt={alt} className="h-[48rem] w-full rounded-lg object-cover object-center" src={src} />
      </DialogBody>
    </Dialog>
  );
};
