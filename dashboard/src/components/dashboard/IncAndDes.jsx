import { BsArrowDown, BsArrowUp } from "react-icons/bs";

export const IncreaseWrapper = ({ value, className }) => {
  return (
    <>
      <div className={`${className} p-1 rounded-md bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1`}>
        <BsArrowUp />
        {value}
      </div>
    </>
  );
};

export const DecreaseWrapper = ({ value, className }) => {
  return (
    <>
      <div className={`${className} p-1 rounded-md bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1`}>
        <BsArrowDown />
        {value}
      </div>
    </>
  );
};
