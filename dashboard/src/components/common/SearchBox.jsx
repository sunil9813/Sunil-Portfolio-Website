import { FiSearch } from "react-icons/fi";

export const SearchBox = () => {
  return (
    <>
      <div className="search-box group relative w-full">
        <form className="relative flex h-10 w-full items-center overflow-hidden rounded-full border border-gray-200/80 bg-light-surface2 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md focus-within:border-indigo-300/40 focus-within:shadow-[0_8px_25px_rgba(79,70,229,0.08)] dark:border-white/[0.055] dark:bg-dark-surface2 dark:shadow-[0_8px_24px_rgba(0,0,0,0.14)] dark:hover:border-white/[0.09] dark:focus-within:border-indigo-300/[0.14] dark:focus-within:bg-white/[0.018] dark:focus-within:shadow-[0_10px_30px_rgba(0,0,0,0.22)] 2xl:h-10 3xl:h-12">
          {/* Subtle focus background */}
          <span className="pointer-events-none absolute -left-10 top-1/2 size-24 -translate-y-1/2 rounded-full bg-indigo-500/[0.04] blur-2xl opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 dark:bg-indigo-300/[0.025]" />

          <span className="pointer-events-none absolute -right-10 top-1/2 size-24 -translate-y-1/2 rounded-full bg-cyan-500/[0.035] blur-2xl opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 dark:bg-cyan-300/[0.018]" />

          {/* Search icon */}
          <span className="pointer-events-none absolute left-2 flex size-7 items-center justify-center rounded-full border border-transparent text-light-text-primary/40 transition-all duration-300 group-focus-within:border-indigo-300/20 group-focus-within:bg-indigo-500/[0.06] group-focus-within:text-indigo-600 dark:text-dark-text-primary/35 dark:group-focus-within:border-indigo-300/[0.08] dark:group-focus-within:bg-indigo-300/[0.03] dark:group-focus-within:text-indigo-200/65 3xl:left-2.5 3xl:size-8">
            <FiSearch size={16} className="transition-transform duration-300 group-focus-within:scale-105 3xl:text-lg" />
          </span>

          {/* Search input */}
          <input
            type="search"
            aria-label="Search"
            autoComplete="off"
            className="relative z-10 h-full w-full bg-transparent pl-11 pr-14 text-xs text-gray-800 outline-none placeholder:text-gray-400/75 dark:text-white/75 dark:placeholder:text-white/25 3xl:pl-12 3xl:pr-16 3xl:text-sm"
            placeholder="Search anything..."
          />

          {/* Keyboard shortcut */}
          <span className="pointer-events-none absolute right-2 inline-flex h-6 min-w-8 items-center justify-center rounded-full border border-gray-200/80 bg-gray-50/80 px-2 text-[8px] font-semibold text-gray-400 transition-all duration-300 group-focus-within:border-indigo-300/20 group-focus-within:bg-indigo-500/[0.05] group-focus-within:text-indigo-500 dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/25 dark:group-focus-within:border-indigo-300/[0.08] dark:group-focus-within:bg-indigo-300/[0.025] dark:group-focus-within:text-indigo-200/55 3xl:right-2.5 3xl:h-7 3xl:min-w-9">
            ⌘ K
          </span>

          {/* Bottom focus accent */}
          <span className="pointer-events-none absolute inset-x-8 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent transition-transform duration-300 group-focus-within:scale-x-100 dark:via-indigo-300/30" />
        </form>
      </div>
    </>
  );
};
