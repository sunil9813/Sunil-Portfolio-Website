import { AiOutlineSearch } from "react-icons/ai";

export const SearchBox = () => {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };
  return (
    <>
      <div className="input_glow search" onMouseMove={handleMouseMove}>
        <div className="input_glow_background">
          <div className="input_glow_background-glow bg-transparent"></div>
        </div>

        <div className="input_glow_background_filed">
          <div className="icon relative z-50 flex items-center justify-center w-12 bg-transparent h-12 text-gray-100/30">
            <AiOutlineSearch size={25} />
          </div>
          <div className="pl-8">
            <input className="p-2 w-full text-xs rounded-md text-gray-500 px-12" placeholder="Search here..." />
          </div>
        </div>
      </div>
    </>
  );
};
