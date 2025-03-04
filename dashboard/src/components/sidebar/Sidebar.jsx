import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarItem } from "./SidebarItem";
import { menu } from "@/assets/Data";
import { Logo } from "../common/Logo";
import { CiGrid41 } from "react-icons/ci";

export const Sidebar = () => {
  const [openIndex, setOpenIndex] = useState(null); // Track the open sub-menu
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const handleSubMenuToggle = (index) => {
    // Toggle the open submenu (if the clicked index is already open, close it; otherwise open it)
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="sidebars bg-sidebarbg h-[100vh]">
      <div className="border-b h-[8vh] border-gray-50/10 logo flex justify-between items-center">
        <button className="flex items-center" onClick={goHome}>
          <Logo size="xs" />
          <h1 className="text-2xl font-semibold text-indigo-500">MetaDash</h1>
        </button>
        <div className="flex px-5">
          <CiGrid41 size={25} />
        </div>
      </div>

      <div className="p-3">
        {menu.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            isOpenState={openIndex === index} // Check if submenu is open
            onSubMenuToggle={() => handleSubMenuToggle(index)} // Toggle submenu
          />
        ))}
      </div>
    </section>
  );
};
