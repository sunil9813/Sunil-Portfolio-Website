import React from "react";

export const Footer = () => {
  return (
    <>
      <footer className="relative h-56 dark:bg-[#0B0C0F] backdrop-blur-3xl mt-16">
        <FooterBg />
      </footer>
    </>
  );
};

export const FooterBg = () => {
  return (
    <>
      <div className="background relative">
        <div className="pointer-events-none absolute z-50 left-[250px] top-[-102px] h-[248px] w-[800px] rounded-full bg-[#4474F2] opacity-[0.11] blur-[100px]" aria-hidden="true"></div>

        {/* for background */}
        <div className="pointer-events-none absolute right-[35%] top-[-52px] h-[248px] w-[490px] rounded-full bg-[radial-gradient(92.52%_89.86%_at_62.86%_11.06%,#3BDCFF_27.2%,#69B7FF_80.5%,#4759FF_100%)] opacity-[0.25] blur-[100px]"></div>
        {/* for line */}
        <div className="pointer-events-none absolute right-[35%] top-0 z-20 h-[1px] w-[524px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#FFFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter"></div>
        {/* line more bright  */}
        <div className="pointer-events-none absolute right-[35%] top-0 z-20 h-[1px] w-[524px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#FFFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter blur-[1px]"></div>
        {/* line more blur  */}
        <div className="pointer-events-none absolute right-[35%] top-0 z-20 h-[1px] w-[524px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#BAFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter blur-[5px]"></div>

        {/* for blur color light */}
        <div className="pointer-events-none absolute right-[45%] top-[-11px] h-[23px] w-[400px] rounded-[50%] bg-[#E6FCFF] opacity-20 mix-blend-plus-lighter blur-[25px]"></div>
        <div className="pointer-events-none absolute right-[45%] top-[-16px] h-[32px] w-[448px] rounded-[50%] bg-[#67DBFF] opacity-25 mix-blend-plus-lighter blur-[50px]"></div>
      </div>
    </>
  );
};
