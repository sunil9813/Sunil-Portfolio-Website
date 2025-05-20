import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarItem } from "./SidebarItem";
import { menu } from "@/assets/Data";
import { Logo } from "../common/Logo";

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
    <section className="sidebars h-[100vh]">
      <div className="h-[8vh] flex justify-between items-center px-3">
        <button onClick={goHome} className="mt-4">
          <Logo size="xs" />
        </button>
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
