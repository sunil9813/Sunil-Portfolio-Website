import { Logo } from "./Logo";

export const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-10 bg-[rgba(63,63,63,0.8)]">
      <div className="absolute top-[45%] left-1/2 z-50">
        <div className="custom-loader relative z-50">
          <Logo size="large" />
        </div>
      </div>
    </div>
  );
};
