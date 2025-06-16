import PropTypes from "prop-types";

export const GlowingButton = ({ children, className }) => {
  return (
    <>
      <div className="glowing-box glowing-box-active">
        <div className="glowing-box-animations">
          <div className="glowing-box-glow"></div>
          <div className="glowing-box-stars-masker">
            <div className="glowing-box-stars"></div>
          </div>
        </div>
        <div className="glowing-box-borders-masker">
          <div className="glowing-box-borders"></div>
        </div>
        <button className={`glowing-box-button ${className}`}>
          <span>{children}</span>
        </button>
      </div>
    </>
  );
};
export const MainButton = ({ children, className }) => {
  return (
    <>
      <button
        className={`${className} transition-colors duration-300 group inline-flex items-center outline-none justify-center tracking-tight leading-none focus:outline-white focus:outline-1 focus:outline-offset-4 h-10 text-15 px-6 rounded-full md:h-9 relative shadow-[0px_2px_2px_0px_rgba(0,0,0,0.74)] group font-semibold`}
      >
        <span className="absolute -inset-px bottom-[-1.5px] rounded-full bg-[linear-gradient(180deg,#fcc171_0%,#C17C56_50%,#362821_100%)]"></span>
        <span className="absolute -top-[5px] bottom-0.5 left-1/2 w-[91%] -translate-x-1/2 bg-btn-glowing mix-blend-screen blur-[1px] transition-transform duration-300 ease-in-out group-hover:translate-y-[-2px]"></span>
        <span className="absolute inset-0 rounded-full bg-black"></span>
        <span className="absolute inset-0 rounded-full bg-btn-glowing-inset opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-0"></span>
        <span className="absolute inset-0 rounded-full bg-btn-glowing-inset-hover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></span>
        <span className="relative z-20 bg-[linear-gradient(180deg,#FFF_33.33%,#E4D0B1_116.67%)] bg-clip-text text-transparent">
          <span className="">{children}</span>
        </span>
      </button>
    </>
  );
};
export const Button = ({ children }) => {
  return (
    <>
      <button className="group relative px-8 py-2.5 rounded-full backdrop-blur-xl border-2 border-slate-400 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 via-black-900/60 to-black/80 shadow-2xl hover:shadow-indigo-500/30 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out cursor-pointer hover:border-indigo-400/60 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        <div className="absolute inset-0 rounded bg-gradient-to-r from-indigo-500/10 via-indigo-400/20 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10 flex items-center gap-4">
          <p className="text-indigo-400 text-sm group-hover:text-indigo-300 transition-colors duration-300 drop-shadow-sm">
            <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">{children}</p>
            <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">{children}</p>
          </p>
        </div>
      </button>
    </>
  );
};
export const ActionButton = ({ children, onClick, className, type }) => {
  return (
    <button
      className={`rounded-full inline-block text-center textSizeSm text-white h-10 3xl:h-12 px-7 cursor-pointer shadow-[0px_4px_20px_rgba(0,_0,_0,_0.5),_inset_0px_1px_0px_rgba(255,_255,_255,_0.4),_inset_0px_-4px_13px_rgba(0,_0,_0,_0.2)] ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
export const AnimatedButton = ({ children, onClick, className, type }) => {
  return (
    <button className={`button !px-7 h-10 3xl:h-12 group ${className}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
};
export const GhostButton = ({ children, onClick, className, type }) => {
  return (
    <button className={`button !px-7 h-10 3xl:h-12 ${className}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
};
export const TertiaryButton = ({ children, onClick, className, type }) => {
  return (
    <button className={`tertiary-button px-7 h-10 3xl:h-12 capitalize textSizeSm ${className}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export const PrimaryButton = ({ text, onclick }) => {
  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    button.style.setProperty("--mouse-x", `${x}px`);
    button.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="primary-btn" onMouseMove={handleMouseMove} onClick={onclick}>
      <button className="primary-btn__button">
        <div className="primary-btn__background">
          <div className="primary-btn__background-glow"></div>
        </div>

        <div className="primary-btn__contents uppercase">{text}</div>
      </button>
    </div>
  );
};

export const SecondaryButton = ({ children, onClick, className }) => {
  return (
    <button className={`secondary-button ${className}`} onClick={onClick}>
      {children}
      <span className="button-border"></span>
    </button>
  );
};

export const IconButton = ({ icon, text, className }) => {
  return (
    <button className={`iconbtn flex items-center justify-center gap-2 text-center bg-black py-2 px-3 text-sm shadow-md rounded-md border border-white/20 ${className}`}>
      <span>{icon}</span>
      {text}
    </button>
  );
};

{
  /*
  dark btn
  <button className="transition-colors duration-300 group inline-flex items-center outline-none relative justify-center tracking-tight leading-none focus:outline-white focus:outline-1 focus:outline-offset-4 h-[34px] text-15 px-[18px] rounded-full text-gray-94 shadow-[0px_3px_7.2px_0px_rgba(10,10,10,0.20)] dark:shadow-[0px_3px_7.2px_0px_rgba(10,10,10,0.80)] font-semibold">
  <span className="absolute -inset-px bottom-[-1.5px] rounded-full bg-[linear-gradient(180deg,#6d6d7f_0%,#292C3D_50%,#17181C_100%)] transition-opacity duration-200 group-hover:opacity-0"></span>
  <span className="absolute -inset-px bottom-[-1.5px] rounded-full bg-[linear-gradient(180deg,#9999B3_0%,#4D4D5B00_100%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></span>
  <span className="absolute inset-0 rounded-full bg-[#16171D]"></span>
  <span className="absolute inset-0 rounded-full bg-[radial-gradient(195.27%_60.29%_at_50%_60.29%,_rgba(6,6,9,0.00)_0%,_#25252D_100%)] transition-opacity duration-200 group-hover:opacity-0"></span>
  <span className="absolute inset-0 rounded-full bg-[radial-gradient(99.73%_74.81%_at_49.59%_-33.82%,_#8D91A5_0%,_rgba(141,145,165,0.30)_49%,_rgba(29,30,37,0.00)_100%),_radial-gradient(195.27%_60.29%_at_50%_60.29%,_rgba(6,6,9,0.00)_0%,_#25252D_100%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></span>
  <span className="relative z-20">Get in touch</span>
</button>;
 */
}
GlowingButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
};
PrimaryButton.propTypes = {
  text: PropTypes.string,
  onclick: PropTypes.any,
};
SecondaryButton.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  onClick: PropTypes.any,
};
TertiaryButton.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  onClick: PropTypes.any,
  type: PropTypes.any,
};
ActionButton.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  onClick: PropTypes.any,
  type: PropTypes.any,
};
GhostButton.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  onClick: PropTypes.any,
  type: PropTypes.any,
};
IconButton.propTypes = {
  icon: PropTypes.any,
  text: PropTypes.string,
  className: PropTypes.string,
};
