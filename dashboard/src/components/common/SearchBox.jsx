import { FiSearch } from "react-icons/fi";

export const SearchBox = () => {
  return (
    <>
      <div className="search-box relative">
        <form className={`button !p-0 w-full h-10 2xl:h-10 3xl:h-12 bg-light-surface2 dark:bg-dark-surface2 rounded-full flexC`}>
          <FiSearch size={18} className="absolute top-2.5 3xl:top-4 left-3 z-10 text-light-text-primary/40 dark:text-dark-text-primary/40" />
          <input className="w-full h-full px-5 pl-9 text-xs 3xl:text-sm text-textcolor" placeholder="Search anything...." />
        </form>
      </div>
    </>
  );
};
