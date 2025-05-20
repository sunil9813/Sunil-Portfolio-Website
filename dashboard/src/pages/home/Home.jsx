import { GradientWrapper } from "@/components/cards/GlowCard";
import { ProfileCard } from "@/ui/ProfileCard";
import { DropdownWrapper, Wrapper } from "@/utils/Router";
import { useState } from "react";

export const Home = () => {
  return (
    <>
      <Wrapper className="p-5">
        <h1 className="text-xl font-semibold text-black dark:text-white mb-5">List of Components</h1>
        <ProfileCard />
        <div className="flex flex-wrap gap-5 my-8">
          <DropDownComponent />
          <GradientWrapper className="w-72">
            <input type="text" className="bg-none outline-none h-12 px-3 w-full" placeholder="Search here..." />
          </GradientWrapper>
        </div>
      </Wrapper>
    </>
  );
};

export const DropDownComponent = () => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  return (
    <>
      <div className="relative inline-block">
        <button className="px-5 py-2 bg-indigo-500 text-sm text-white rounded-full" onClick={() => setIsOpenDropdown(!isOpenDropdown)} aria-expanded={isOpenDropdown}>
          Open Dropdown
        </button>
        <DropdownWrapper align="right" isOpen={isOpenDropdown} onClose={() => setIsOpenDropdown(false)} className="w-60 p-4 bg-white shadow-lg rounded-md">
          <h1 className="text-lg font-semibold">Home Content</h1>
          <p className="mt-2">This is your dropdown content</p>
        </DropdownWrapper>
      </div>
    </>
  );
};
