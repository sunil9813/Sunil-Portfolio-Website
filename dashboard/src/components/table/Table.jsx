import React, { cloneElement, isValidElement, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Checkbox, Switch, Tooltip } from "@material-tailwind/react";
import {
  ArrowDownAZ,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  Eye,
  FileText,
  FolderOpen,
  Grid2X2,
  ImageOff,
  LayoutList,
  Mail,
  PencilLine,
  Plus,
  Rows3,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { DateFormatter } from "../common/DateFormatter";
import { TertiaryButton } from "../customeUI/Button";
import { generateItemColor, truncateText } from "@/utils";
import { Wrapper } from "../customeUI/Wrapper";

/* ==========================================================================
   CONSTANTS
   ========================================================================== */

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3940/3940417.png";

const DEFAULT_PAGE_SIZES = [5, 7, 10, 15, 20];

/* ==========================================================================
   GENERAL HELPERS
   ========================================================================== */

const getIdentifier = (item) => item?.slug || item?._id;

const getAvatarUrl = (item) => {
  const avatar = item?.user?.avatar || item?.createdBy?.avatar || item?.author?.avatar || item?.avatar;

  if (!avatar) {
    return null;
  }

  if (typeof avatar === "string") {
    return avatar;
  }

  return avatar?.url || avatar?.filePath || null;
};

const getDisplayName = (item) => item?.user?.name || item?.createdBy?.name || item?.author?.name || item?.name || item?.fullname || item?.title || "Unknown";

const getDisplayEmail = (item) => item?.user?.email || item?.createdBy?.email || item?.author?.email || item?.email || item?.emails?.[0]?.email || "";

const getImageUrl = (image) => {
  if (!image) {
    return null;
  }

  if (typeof image === "string") {
    return image;
  }

  return image?.filePath || image?.url || image?.src || null;
};

const getPostsCount = (item) => {
  if (Array.isArray(item?.posts)) {
    return item.posts.length;
  }

  return item?.postsCount ?? item?.postCount ?? item?.totalPosts ?? 0;
};

const getSearchableValue = (item) =>
  [
    item?.name,
    item?.title,
    item?.fullname,
    item?.email,

    item?.user?.name,
    item?.user?.email,

    item?.createdBy?.name,
    item?.createdBy?.email,

    item?.author?.name,
    item?.author?.email,

    item?.role,
    item?.type,
    item?.position,
    item?.location,
    item?.address,

    item?.category?.title,
    item?.university?.name,
    item?.faculty?.name,
    item?.subject?.name,

    item?.description,
    item?.content,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const getSortingName = (item) => String(item?.title || item?.name || item?.fullname || item?.user?.name || "").toLowerCase();

const getCreatedTime = (item) => {
  const date = new Date(item?.createdAt || 0);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  return date.getTime();
};

const createPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};

/* ==========================================================================
   PREMIUM FOLDER ICON
   ========================================================================== */

const FolderManagementIcon = () => (
  <div className="relative h-11 w-12 flex-shrink-0">
    <span
      className="
        absolute right-0 top-0
        h-7 w-8
        rotate-[-8deg]
        rounded-xl
        border border-white/[0.05]
        bg-gradient-to-br
        from-[#24272c]
        to-[#111316]
        opacity-80
      "
    />

    <span
      className="
        absolute right-0 top-1
        h-7 w-9
        rotate-[-3deg]
        rounded-xl
        border border-white/[0.06]
        bg-gradient-to-br
        from-[#2c2f35]
        to-[#17191d]
      "
    />

    <span
      className="
        absolute bottom-0 left-0
        flex h-9 w-11
        items-center justify-center
        rounded-xl
        border border-white/[0.08]
        bg-gradient-to-br
        from-[#25282d]
        via-[#181a1e]
        to-[#0d0e10]
        text-white/70
        shadow-[0_12px_30px_rgba(0,0,0,0.55)]
      "
      style={{
        boxShadow: "0 12px 30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.055)",
      }}
    >
      <span
        className="
          absolute -top-1.5 left-0
          h-4 w-5
          rounded-t-lg
          border-l border-t
          border-white/[0.05]
          bg-[#25282d]
        "
      />

      <FolderOpen size={18} strokeWidth={1.8} className="relative z-10" />
    </span>
  </div>
);

/* ==========================================================================
   USER AVATAR
   ========================================================================== */

const UserAvatar = ({ item, displayName }) => {
  const [imageError, setImageError] = useState(false);

  const avatarUrl = getAvatarUrl(item);

  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  const showFallback = !avatarUrl || avatarUrl === DEFAULT_AVATAR || imageError;

  if (showFallback) {
    return (
      <span
        className="
          flex h-9 w-9
          flex-shrink-0
          items-center justify-center
          rounded-xl
          border border-white/[0.08]
          text-[11px]
          font-bold
          shadow-[0_4px_12px_rgba(0,0,0,0.4)]
        "
        style={{
          background: generateItemColor(displayName || "Unknown"),
          color: "#fff",
        }}
      >
        {displayName?.trim()?.charAt(0)?.toUpperCase() || "?"}
      </span>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={displayName}
      loading="lazy"
      onError={() => setImageError(true)}
      className="
        h-9 w-9
        flex-shrink-0
        rounded-xl
        border border-white/[0.08]
        object-cover
        shadow-[0_4px_12px_rgba(0,0,0,0.4)]
      "
    />
  );
};

UserAvatar.propTypes = {
  item: PropTypes.object,
  displayName: PropTypes.string,
};

/* ==========================================================================
   TABLE THUMBNAIL
   ========================================================================== */

const TableThumbnail = ({ src, alt = "Thumbnail", widthClass = "w-12", heightClass = "h-10" }) => {
  const [imageError, setImageError] = useState(false);

  const imageUrl = getImageUrl(src);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  return (
    <div
      className={`
        ${widthClass}
        ${heightClass}
        group/image
        relative flex
        flex-shrink-0
        items-center justify-center
        overflow-hidden
        rounded-xl
        border border-white/[0.06]
        bg-[#15171b]
        transition-all duration-300
        hover:border-white/[0.12]
      `}
      style={{
        boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {imageUrl && !imageError ? (
        <>
          <img
            src={imageUrl}
            alt={alt}
            loading="lazy"
            onError={() => setImageError(true)}
            className="
              h-full w-full
              object-cover
              transition-transform
              duration-500
              group-hover/image:scale-110
            "
          />

          <span
            className="
              pointer-events-none
              absolute inset-0
              bg-gradient-to-t
              from-black/40
              to-transparent
            "
          />

          <span
            className="
              pointer-events-none
              absolute inset-0
              ring-1 ring-inset
              ring-white/[0.08]
            "
          />
        </>
      ) : (
        <ImageOff size={16} strokeWidth={1.6} className="text-white/20" />
      )}
    </div>
  );
};

TableThumbnail.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  alt: PropTypes.string,
  widthClass: PropTypes.string,
  heightClass: PropTypes.string,
};

/* ==========================================================================
   DATA BADGE
   ========================================================================== */

const DataBadge = ({ children, variant = "purple", icon }) => {
  const variants = {
    purple: "border-violet-300/[0.12] bg-violet-300/[0.055] text-violet-200/85",

    indigo: "border-slate-300/[0.12] bg-slate-300/[0.05] text-slate-200/85",

    teal: "border-teal-300/[0.12] bg-teal-300/[0.05] text-teal-200/85",

    amber: "border-amber-300/[0.12] bg-amber-300/[0.05] text-amber-200/85",

    green: "border-emerald-300/[0.12] bg-emerald-300/[0.05] text-emerald-200/85",

    pink: "border-rose-300/[0.12] bg-rose-300/[0.05] text-rose-200/85",

    blue: "border-sky-300/[0.12] bg-sky-300/[0.05] text-sky-200/85",

    gray: "border-white/[0.075] bg-white/[0.035] text-white/[0.52]",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        whitespace-nowrap
        rounded-full
        border
        px-2.5
        py-[5px]
        text-[10px]
        font-semibold
        tracking-wide
        shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
        backdrop-blur-sm
        transition-all
        duration-200
        group-hover:border-white/[0.12]
        group-hover:brightness-110
        ${variants[variant] || variants.gray}
      `}
    >
      {icon}
      {children}
    </span>
  );
};

DataBadge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  icon: PropTypes.node,
};

/* ==========================================================================
   SELECT CONTROL
   ========================================================================== */

const SelectControl = ({ icon, label, value, options, onChange }) => (
  <label
    className="
      group relative
      flex h-10
      items-center
      gap-2
      rounded-xl
      border border-white/[0.06]
      bg-[#101216]
      px-3
      text-[10px]
      text-white/30
      backdrop-blur-md
      transition-all
      duration-200
      hover:border-white/[0.12]
      hover:bg-[#191c21]
      focus-within:border-white/[0.16]
      focus-within:bg-[#1b1e23]
      focus-within:ring-2
      focus-within:ring-white/[0.05]
    "
    style={{
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.2)",
    }}
  >
    <span
      className="
        flex h-6 w-6
        flex-shrink-0
        items-center justify-center
        rounded-lg
        border border-white/[0.05]
        bg-[#17191d]
        text-white/[0.45]
        transition-colors
        group-hover:bg-[#22252b]
        group-hover:text-white/75
      "
    >
      {icon}
    </span>

    <span className="hidden text-white/30 2xl:inline">{label}</span>

    <select
      value={value}
      onChange={onChange}
      className="
        min-w-[62px]
        cursor-pointer
        appearance-none
        border-0
        bg-transparent
        pr-5
        text-[11px]
        font-semibold
        text-white/80
        outline-none
      "
      aria-label={label}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-[#111317] text-white">
          {option.label}
        </option>
      ))}
    </select>

    <ChevronDown
      size={12}
      className="
        pointer-events-none
        absolute right-2.5
        text-white/35
        transition-transform
        group-focus-within:rotate-180
      "
    />
  </label>
);

SelectControl.propTypes = {
  icon: PropTypes.node,

  label: PropTypes.string.isRequired,

  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,

  onChange: PropTypes.func.isRequired,
};

/* ==========================================================================
   ACTION BUTTONS — SAME DARK COLOUR
   ========================================================================== */

const ActionButtons = ({ item, type, linktoview, linktoupdate, deleteFun, navigate }) => {
  const identifier = getIdentifier(item);

  const actionButtonClass = `
    flex h-8 w-8
    items-center justify-center
    rounded-lg
    border border-white/[0.055]
    bg-[#111317]
    text-white/[0.42]
    shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
    transition-all
    duration-200
    ease-out
    hover:-translate-y-0.5
    hover:border-white/[0.13]
    hover:bg-[#202329]
    hover:text-white/90
    hover:shadow-[0_7px_16px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.04)]
    focus:outline-none
    focus:ring-2
    focus:ring-white/[0.10]
    disabled:cursor-not-allowed
    disabled:opacity-25
    disabled:hover:translate-y-0
  `;

  return (
    <div
      className="
        inline-flex
        items-center
        gap-1
        rounded-xl
        border border-white/[0.06]
        bg-[#090a0c]/95
        p-1
        shadow-[0_10px_24px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.025)]
        backdrop-blur-xl
        transition-all
        duration-200
        group-hover:border-white/[0.10]
        group-hover:bg-[#0d0f12]
      "
    >
      <Tooltip content={`View ${type}`}>
        <button
          type="button"
          disabled={!identifier}
          onClick={() => {
            if (identifier) {
              navigate(`/${linktoview}/${identifier}`);
            }
          }}
          className={actionButtonClass}
          aria-label={`View ${type}`}
        >
          <Eye size={14} strokeWidth={2} />
        </button>
      </Tooltip>

      <Tooltip content={`Edit ${type}`}>
        <NavLink
          to={identifier ? `/${linktoupdate}/${identifier}` : "#"}
          className={`
            ${actionButtonClass}
            ${!identifier ? "pointer-events-none opacity-25" : ""}
          `}
          aria-label={`Edit ${type}`}
        >
          <PencilLine size={14} strokeWidth={2} />
        </NavLink>
      </Tooltip>

      <Tooltip content={`Delete ${type}`}>
        <button type="button" disabled={!item?._id} onClick={() => deleteFun?.(item?._id)} className={actionButtonClass} aria-label={`Delete ${type}`}>
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </Tooltip>
    </div>
  );
};

ActionButtons.propTypes = {
  item: PropTypes.object,
  type: PropTypes.string,
  linktoview: PropTypes.string,
  linktoupdate: PropTypes.string,
  deleteFun: PropTypes.func,
  navigate: PropTypes.func,
};

/* ==========================================================================
   SWITCHES
   ========================================================================== */

const BareVisibilitySwitch = ({ item, handleVisibilityToggle }) => {
  const isPublic = item?.visibility === "public";

  return (
    <Tooltip content={isPublic ? "Public" : "Private"}>
      <div className="flex items-center">
        <Switch
          checked={isPublic}
          disabled={!handleVisibilityToggle}
          className="
            h-full w-full
            checked:bg-violet-500
          "
          circleProps={{
            className: "border-none shadow-sm",
          }}
          onChange={() => handleVisibilityToggle?.(item?._id, isPublic ? "private" : "public")}
        />
      </div>
    </Tooltip>
  );
};

BareVisibilitySwitch.propTypes = {
  item: PropTypes.object,

  handleVisibilityToggle: PropTypes.func,
};

const BareFeaturedSwitch = ({ item, handleFeaturedToggle }) => {
  const isFeatured = item?.featured === true;

  return (
    <Tooltip content={isFeatured ? "Featured" : "Not featured"}>
      <div className="flex items-center">
        <Switch
          checked={isFeatured}
          disabled={!handleFeaturedToggle}
          className="
            h-full w-full
            checked:bg-amber-500
          "
          circleProps={{
            className: "border-none shadow-sm",
          }}
          onChange={() => handleFeaturedToggle?.(item?._id, !isFeatured)}
        />
      </div>
    </Tooltip>
  );
};

BareFeaturedSwitch.propTypes = {
  item: PropTypes.object,

  handleFeaturedToggle: PropTypes.func,
};

const StatusToggles = ({ item, handleVisibilityToggle, handleFeaturedToggle }) => (
  <div className="flex items-center gap-3">
    <BareVisibilitySwitch item={item} handleVisibilityToggle={handleVisibilityToggle} />

    <BareFeaturedSwitch item={item} handleFeaturedToggle={handleFeaturedToggle} />
  </div>
);

StatusToggles.propTypes = {
  item: PropTypes.object,

  handleVisibilityToggle: PropTypes.func,

  handleFeaturedToggle: PropTypes.func,
};

/* ==========================================================================
   PAGINATION
   ========================================================================== */

const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
  const paginationItems = createPaginationItems(currentPage, totalPages);

  const navigationButtonClass = `
    flex h-9 w-9
    items-center justify-center
    rounded-xl
    border border-white/[0.06]
    bg-[#101216]
    text-white/[0.38]
    shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
    backdrop-blur-md
    transition-all
    duration-200
    hover:-translate-y-0.5
    hover:border-white/[0.13]
    hover:bg-[#1c1f24]
    hover:text-white/[0.85]
    disabled:cursor-not-allowed
    disabled:opacity-25
    disabled:hover:translate-y-0
  `;

  return (
    <div className="flex items-center gap-1.5">
      <button type="button" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className={navigationButtonClass} aria-label="Previous page">
        <ChevronLeft size={15} strokeWidth={2.2} />
      </button>

      <div className="hidden items-center gap-1.5 sm:flex">
        {paginationItems.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="
                    flex h-9 w-6
                    items-center
                    justify-center
                    text-[10px]
                    text-white/20
                  "
              >
                •••
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                  flex h-9
                  min-w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-2
                  text-[10px]
                  font-semibold
                  transition-all
                  duration-200
                  hover:-translate-y-0.5

                  ${
                    isActive
                      ? `
                        border-white/[0.16]
                        bg-[#26292f]
                        text-white
                        shadow-[0_9px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]
                      `
                      : `
                        border-white/[0.06]
                        bg-[#101216]
                        text-white/[0.38]
                        hover:border-white/[0.13]
                        hover:bg-[#1c1f24]
                        hover:text-white/[0.85]
                      `
                  }
                `}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      <span
        className="
          flex h-9
          min-w-[74px]
          items-center
          justify-center
          rounded-xl
          border border-white/[0.06]
          bg-[#101216]
          px-3
          text-[10px]
          font-semibold
          text-white/55
          sm:hidden
        "
      >
        {currentPage} / {totalPages}
      </span>

      <button type="button" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className={navigationButtonClass} aria-label="Next page">
        <ChevronRight size={15} strokeWidth={2.2} />
      </button>
    </div>
  );
};

TablePagination.propTypes = {
  currentPage: PropTypes.number.isRequired,

  totalPages: PropTypes.number.isRequired,

  onPageChange: PropTypes.func.isRequired,
};

/* ==========================================================================
   MAIN TABLE
   ========================================================================== */

export const Table = ({
  head,
  rowData = [],
  btntext = "Add new",
  linktocreate = "",
  linktoview = "",
  comp = null,
  deleteFun = () => {},
  rowsPerPageNumber = 7,
  type,
  linktoupdate = "",
  handleVisibilityToggle,
  handleFeaturedToggle,
  hidden = false,
}) => {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("table");

  const [searchQuery, setSearchQuery] = useState("");

  const [sortOption, setSortOption] = useState("newest");

  const [density, setDensity] = useState("comfortable");

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageNumber);

  const supportsCardView = isValidElement(comp);

  const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : "Record";

  const pageSizeOptions = useMemo(() => {
    return Array.from(new Set([rowsPerPageNumber, ...DEFAULT_PAGE_SIZES])).sort((first, second) => first - second);
  }, [rowsPerPageNumber]);

  /* ==========================================================================
     FILTER AND SORT
     ========================================================================== */

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return rowData;
    }

    return rowData.filter((item) => getSearchableValue(item).includes(query));
  }, [rowData, searchQuery]);

  const sortedData = useMemo(() => {
    const data = [...filteredData];

    switch (sortOption) {
      case "oldest":
        return data.sort((firstItem, secondItem) => getCreatedTime(firstItem) - getCreatedTime(secondItem));

      case "az":
        return data.sort((firstItem, secondItem) => getSortingName(firstItem).localeCompare(getSortingName(secondItem)));

      case "za":
        return data.sort((firstItem, secondItem) => getSortingName(secondItem).localeCompare(getSortingName(firstItem)));

      case "newest":
      default:
        return data.sort((firstItem, secondItem) => getCreatedTime(secondItem) - getCreatedTime(firstItem));
    }
  }, [filteredData, sortOption]);

  /* ==========================================================================
     PAGINATION
     ========================================================================== */

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));

  const currentRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;

    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const firstVisibleRow = sortedData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;

  const lastVisibleRow = Math.min(currentPage * rowsPerPage, sortedData.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption, rowsPerPage, type]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const cardView = useMemo(() => {
    if (!isValidElement(comp)) {
      return comp;
    }

    return cloneElement(comp, {
      rowData: sortedData,

      itemsPerPage: rowsPerPage,
    });
  }, [comp, sortedData, rowsPerPage]);

  /* ==========================================================================
     SHARED TABLE STYLES
     ========================================================================== */

  const rowPadding = density === "compact" ? "py-2.5" : "py-4";

  const rowClass = `
    group
    odd:bg-[#0d0f12]
    even:bg-[#101216]
    transition-all
    duration-200
    ease-out
    hover:bg-[#181b20]
    hover:shadow-[inset_3px_0_0_rgba(255,255,255,0.18)]
  `;

  const tdClass = `
    border-b
    border-white/[0.045]
    px-5
    ${rowPadding}
    text-xs
    text-white/[0.58]
    align-middle
    transition-colors
    duration-200
  `;

  const textClass = `
    text-xs
    font-medium
    leading-5
    text-white/[0.78]
  `;

  /* ==========================================================================
     REUSABLE CELLS
     ========================================================================== */

  const renderUserCell = (item) => {
    if (hidden) {
      return null;
    }

    const displayName = getDisplayName(item);

    const email = getDisplayEmail(item);

    return (
      <td
        className={`
          ${tdClass}
          min-w-[210px]
        `}
      >
        <div className="flex items-center gap-3">
          <UserAvatar item={item} displayName={displayName} />

          <div className="flex min-w-0 flex-col gap-1">
            <span
              className="
                max-w-[165px]
                truncate
                text-xs
                font-semibold
                text-white/90
              "
              title={displayName}
            >
              {truncateText(displayName, 23)}
            </span>

            {email && (
              <span
                className="
                  flex
                  max-w-[170px]
                  items-center
                  gap-1
                  truncate
                  text-[10px]
                  text-white/30
                "
                title={email}
              >
                <Mail size={10} className="flex-shrink-0" />

                {email}
              </span>
            )}
          </div>
        </div>
      </td>
    );
  };

  const renderSerialCell = (serialNumber) => (
    <td
      className={`
        ${tdClass}
        relative w-16

        before:absolute
        before:bottom-2
        before:left-0
        before:top-2
        before:w-[2px]
        before:scale-y-0
        before:rounded-r-full
        before:bg-gradient-to-b
        before:from-white/35
        before:to-white/10
        before:transition-transform
        before:duration-300

        group-hover:before:scale-y-100
      `}
    >
      <span
        className="
          inline-flex h-8
          min-w-8
          items-center justify-center
          rounded-lg
          border border-white/[0.055]
          bg-[#111317]
          px-2
          font-mono
          text-[10px]
          font-semibold
          text-white/28
          shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]
          transition-all
          duration-200
          group-hover:border-white/[0.12]
          group-hover:bg-[#202329]
          group-hover:text-white/80
        "
      >
        {String(serialNumber).padStart(2, "0")}
      </span>
    </td>
  );

  const renderDateCell = (item) => (
    <td
      className={`
        ${tdClass}
        min-w-[145px]
      `}
    >
      <div className="flex items-center gap-2 whitespace-nowrap text-white/40">
        <span
          className="
            flex h-8 w-8
            items-center justify-center
            rounded-lg
            border border-white/[0.06]
            bg-[#111317]
            text-white/[0.38]
            transition-all
            duration-200
            group-hover:border-white/[0.12]
            group-hover:bg-[#202329]
            group-hover:text-white/[0.78]
          "
        >
          <CalendarDays size={13} strokeWidth={1.8} />
        </span>

        <DateFormatter date={item?.createdAt} />
      </div>
    </td>
  );

  const renderActionCell = (item) => (
    <td
      className={`
        ${tdClass}
        sticky right-0
        z-[3]
        w-32
        min-w-[128px]
        border-l
        border-white/[0.04]
        text-center
        backdrop-blur-xl
        transition-colors
        duration-200
      `}
      style={{
        background: "linear-gradient(90deg, rgba(9,10,12,0.96) 0%, rgba(11,12,15,0.985) 100%)",

        boxShadow: "-18px 0 30px -23px rgba(0,0,0,0.98)",
      }}
    >
      <ActionButtons item={item} type={type} linktoview={linktoview} linktoupdate={linktoupdate} deleteFun={deleteFun} navigate={navigate} />
    </td>
  );

  /* ==========================================================================
     TABLE ROWS
     ========================================================================== */

  const renderRowByType = (item, serialNumber) => {
    switch (type) {
      case "users":
        return (
          <tr key={item?._id || serialNumber} className={rowClass}>
            {renderSerialCell(serialNumber)}

            {renderUserCell(item)}

            <td className={`${tdClass} min-w-[120px]`}>
              <DataBadge variant="purple">{item?.role || "User"}</DataBadge>
            </td>

            <td className={`${tdClass} min-w-[120px]`}>
              <DataBadge variant="green" icon={<CheckCircle2 size={11} />}>
                Active
              </DataBadge>
            </td>

            {renderDateCell(item)}

            {renderActionCell(item)}
          </tr>
        );

      case "category":
        return (
          <tr key={item?._id || serialNumber} className={rowClass}>
            {renderSerialCell(serialNumber)}

            {renderUserCell(item)}

            <td className={`${tdClass} min-w-[225px]`}>
              <div className="flex items-center gap-3">
                <span
                  className="
                    flex h-9 w-9
                    flex-shrink-0
                    items-center justify-center
                    rounded-xl
                    border border-violet-400/15
                    bg-gradient-to-br
                    from-violet-400/15
                    to-indigo-400/10
                    text-violet-300
                    shadow-sm
                    transition-transform
                    group-hover:scale-105
                  "
                >
                  <FolderOpen size={17} strokeWidth={1.8} />
                </span>

                <div className="flex min-w-0 flex-col gap-1">
                  <NavLink
                    to={getIdentifier(item) ? `/${linktoview}/${getIdentifier(item)}` : "#"}
                    className="
                      max-w-[185px]
                      truncate
                      text-xs
                      font-semibold
                      text-white/90
                      transition-colors
                      hover:text-violet-300
                    "
                  >
                    {item?.title || "Untitled"}
                  </NavLink>

                  {item?.description && (
                    <span
                      className="
                        max-w-[190px]
                        truncate
                        text-[10px]
                        text-white/25
                      "
                    >
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
            </td>

            <td className={`${tdClass} w-20`}>
              <TableThumbnail src={item?.cover} alt={item?.title || "Category"} widthClass="w-11" heightClass="h-11" />
            </td>

            <td className={`${tdClass} min-w-[115px]`}>
              <DataBadge variant="teal">{item?.type || "Category"}</DataBadge>
            </td>

            <td className={`${tdClass} min-w-[105px]`}>
              <DataBadge variant="purple" icon={<Database size={11} />}>
                {getPostsCount(item)} posts
              </DataBadge>
            </td>

            {renderDateCell(item)}

            {renderActionCell(item)}
          </tr>
        );

      case "blog":
        return (
          <tr key={item?._id || serialNumber} className={rowClass}>
            {renderSerialCell(serialNumber)}

            {renderUserCell(item)}

            <td className={`${tdClass} min-w-[260px]`}>
              <span className={textClass}>{truncateText(item?.title, 36)}</span>
            </td>

            <td className={tdClass}>
              <TableThumbnail src={item?.cover} alt={item?.title} />
            </td>

            <td className={tdClass}>
              <DataBadge variant="teal">{item?.numOfViews || 0}</DataBadge>
            </td>

            <td className={tdClass}>
              <DataBadge variant="amber">{item?.likes?.length || 0}</DataBadge>
            </td>

            <td className={`${tdClass} min-w-[140px]`}>
              <DataBadge variant="purple">{item?.category?.title || "No category"}</DataBadge>
            </td>

            <td className={tdClass}>
              <BareVisibilitySwitch item={item} handleVisibilityToggle={handleVisibilityToggle} />
            </td>

            <td className={tdClass}>
              <BareFeaturedSwitch item={item} handleFeaturedToggle={handleFeaturedToggle} />
            </td>

            {renderDateCell(item)}

            {renderActionCell(item)}
          </tr>
        );

      case "project":
        return (
          <tr key={item?._id || serialNumber} className={rowClass}>
            {renderSerialCell(serialNumber)}

            {renderUserCell(item)}

            <td className={`${tdClass} min-w-[220px]`}>
              <span className={textClass}>{truncateText(item?.title, 28)}</span>
            </td>

            <td className={tdClass}>
              <span className="font-bold text-emerald-300">${item?.price || 0}</span>
            </td>

            <td className={tdClass}>
              <TableThumbnail src={item?.thumbnail} alt={item?.title} />
            </td>

            <td className={tdClass}>
              <DataBadge variant="green">{item?.assets?.length || 0} assets</DataBadge>
            </td>

            <td className={tdClass}>
              <DataBadge variant="teal">{item?.numOfViews || 0}</DataBadge>
            </td>

            <td className={tdClass}>
              <DataBadge variant="amber">{item?.likes?.length || 0}</DataBadge>
            </td>

            <td className={tdClass}>
              <DataBadge variant="purple">{item?.ratings || 0}</DataBadge>
            </td>

            <td className={tdClass}>
              <DataBadge variant="pink">{item?.downloadCount || 0}</DataBadge>
            </td>

            <td className={`${tdClass} min-w-[140px]`}>{item?.category?.title || "No category"}</td>

            <td className={tdClass}>
              <BareVisibilitySwitch item={item} handleVisibilityToggle={handleVisibilityToggle} />
            </td>

            <td className={tdClass}>
              <BareFeaturedSwitch item={item} handleFeaturedToggle={handleFeaturedToggle} />
            </td>

            {renderDateCell(item)}

            {renderActionCell(item)}
          </tr>
        );

      case "university":
        return (
          <tr key={item?._id || serialNumber} className={rowClass}>
            {renderSerialCell(serialNumber)}

            {renderUserCell(item)}

            <td className={`${tdClass} min-w-[180px]`}>
              <span className={textClass}>{item?.name || "—"}</span>
            </td>

            <td className={tdClass}>
              <TableThumbnail src={item?.logo} alt={item?.name} widthClass="w-11" heightClass="h-11" />
            </td>

            <td className={tdClass}>{item?.edate || "—"}</td>

            <td className={`${tdClass} min-w-[200px]`}>{truncateText(item?.location, 35)}</td>

            <td className={tdClass}>
              <DataBadge variant="blue">{item?.type || "University"}</DataBadge>
            </td>

            <td className={`${tdClass} min-w-[210px]`}>
              {item?.website ? (
                <a
                  href={item.website}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    block
                    max-w-[200px]
                    truncate
                    text-indigo-300
                    hover:text-indigo-200
                    hover:underline
                  "
                >
                  {item.website}
                </a>
              ) : (
                "—"
              )}
            </td>

            {renderDateCell(item)}

            {renderActionCell(item)}
          </tr>
        );

      case "department":
        return (
          <tr key={item?._id || serialNumber} className={rowClass}>
            {renderSerialCell(serialNumber)}

            {renderUserCell(item)}

            <td className={`${tdClass} min-w-[170px]`}>
              <span className={textClass}>{item?.name || "—"}</span>
            </td>

            <td className={tdClass}>
              <TableThumbnail src={item?.thumbnail} alt={item?.name} widthClass="w-11" heightClass="h-11" />
            </td>

            <td className={`${tdClass} min-w-[170px]`}>{item?.university?.name || "—"}</td>

            <td className={`${tdClass} min-w-[160px]`}>{item?.faculty?.name || "—"}</td>

            {renderDateCell(item)}

            {renderActionCell(item)}
          </tr>
        );

      case "course":
        return (
          <tr key={item?._id || serialNumber} className={rowClass}>
            {renderSerialCell(serialNumber)}

            {renderUserCell(item)}

            <td className={`${tdClass} min-w-[230px]`}>
              <NavLink
                to={`/course/allchapter/${item?.slug}`}
                className="
                  text-xs
                  font-semibold
                  text-white/80
                  transition-colors
                  hover:text-violet-300
                "
              >
                {truncateText(item?.name, 34)}
              </NavLink>
            </td>

            <td className={tdClass}>
              <DataBadge variant={item?.accessType === "paid" ? "amber" : "green"}>{item?.accessType === "paid" ? "Paid" : "Free"}</DataBadge>
            </td>

            <td className={tdClass}>
              <TableThumbnail src={item?.thumbnail} alt={item?.name} />
            </td>

            <td className={tdClass}>
              <DataBadge variant="teal">{item?.numOfViews || 0}</DataBadge>
            </td>

            <td className={tdClass}>
              <DataBadge variant="amber">{item?.likesCount || 0}</DataBadge>
            </td>

            <td className={tdClass}>
              <DataBadge variant="purple">{item?.ratings || 0}</DataBadge>
            </td>

            <td className={tdClass}>
              <StatusToggles item={item} handleVisibilityToggle={handleVisibilityToggle} handleFeaturedToggle={handleFeaturedToggle} />
            </td>

            {renderDateCell(item)}

            {renderActionCell(item)}
          </tr>
        );

      case "chapter":
        return (
          <tr key={item?._id || serialNumber} className={rowClass}>
            {renderSerialCell(serialNumber)}

            {renderUserCell(item)}

            <td className={`${tdClass} min-w-[170px]`}>{item?.subject?.name || "—"}</td>

            <td className={`${tdClass} min-w-[240px]`}>
              <span className={textClass}>{truncateText(item?.title, 36)}</span>
            </td>

            <td className={tdClass}>
              <DataBadge variant="teal">{item?.numOfViews || 0}</DataBadge>
            </td>

            <td className={tdClass}>
              <DataBadge variant="amber">{item?.likes?.length || 0}</DataBadge>
            </td>

            <td className={tdClass}>
              <DataBadge variant="purple">{item?.ratings || 0}</DataBadge>
            </td>

            {renderDateCell(item)}

            {renderActionCell(item)}
          </tr>
        );

      case "intros":
        return (
          <tr key={item?._id || serialNumber} className={rowClass}>
            {renderSerialCell(serialNumber)}

            {renderUserCell(item)}

            <td className={tdClass}>{item?.position || "—"}</td>

            <td className={tdClass}>{item?.phones?.[0]?.phone || "—"}</td>

            <td className={`${tdClass} min-w-[190px]`}>{item?.emails?.[0]?.email || "—"}</td>

            <td className={`${tdClass} min-w-[170px]`}>{truncateText(item?.address, 25)}</td>

            <td className={tdClass}>
              {item?.cv?.filePath ? (
                <a
                  href={item.cv.filePath}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-lg
                    border border-white/[0.06]
                    bg-[#111317]
                    text-white/[0.42]
                    transition-all
                    hover:border-white/[0.12]
                    hover:bg-[#202329]
                    hover:text-white/80
                  "
                >
                  <FileText size={15} />
                </a>
              ) : (
                "—"
              )}
            </td>

            <td className={tdClass}>
              <DataBadge variant="amber">{item?.downloadCount || 0}</DataBadge>
            </td>

            {renderDateCell(item)}

            {renderActionCell(item)}
          </tr>
        );

      case "resume":
        return (
          <tr key={item?._id || serialNumber} className={rowClass}>
            {renderSerialCell(serialNumber)}

            {renderUserCell(item)}

            {["education", "experience", "skills", "achievements", "training", "award", "reference"].map((field) => (
              <td key={field} className={tdClass}>
                <Checkbox checked={item?.[field]?.length > 0} readOnly color="deep-purple" className="border-white/20" />
              </td>
            ))}

            {renderDateCell(item)}

            {renderActionCell(item)}
          </tr>
        );

      case "service":
      case "testimonial":
        return (
          <tr key={item?._id || serialNumber} className={rowClass}>
            {renderSerialCell(serialNumber)}

            {renderUserCell(item)}

            <td className={`${tdClass} min-w-[260px]`}>
              <span className={textClass}>{truncateText(type === "testimonial" ? item?.content : item?.title, 42)}</span>
            </td>

            <td className={tdClass}>
              <TableThumbnail src={item?.cover} alt={item?.title || type} />
            </td>

            {renderDateCell(item)}

            {renderActionCell(item)}
          </tr>
        );

      default:
        return (
          <tr key={item?._id || serialNumber} className={rowClass}>
            {renderSerialCell(serialNumber)}

            {renderUserCell(item)}

            {renderDateCell(item)}

            {renderActionCell(item)}
          </tr>
        );
    }
  };

  /* ==========================================================================
     COMPONENT UI
     ========================================================================== */

  return (
    <div className="w-full">
      <Wrapper
        className="
          relative isolate
          overflow-hidden
          rounded-[28px]
          border border-white/[0.065]
          bg-[#090a0c]
          shadow-[0_34px_90px_rgba(0,0,0,0.58)]
          ring-1
          ring-black/40
        "
        style={{
          background: "linear-gradient(180deg, #0f1114 0%, #090a0c 100%)",
        }}
      >
        <span
          className="
            pointer-events-none
            absolute inset-x-0
            top-0
            z-30
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/[0.28]
            to-transparent
          "
        />

        <span
          className="
            pointer-events-none
            absolute
            -right-20
            -top-24
            h-64 w-64
            rounded-full
            bg-white/[0.025]
            blur-[90px]
          "
        />

        <span
          className="
            pointer-events-none
            absolute
            -left-28
            top-28
            h-60 w-60
            rounded-full
            bg-slate-400/[0.018]
            blur-[90px]
          "
        />

        {/* ================================================================
            HEADER
            ================================================================ */}

        <header
          className="
            relative z-20
            border-b
            border-white/[0.05]
            px-4 py-5
            sm:px-6
          "
          style={{
            background: "linear-gradient(180deg, rgba(20,22,26,0.97) 0%, rgba(12,13,16,0.985) 100%)",

            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="
              relative flex
              flex-col
              gap-4
              2xl:flex-row
              2xl:items-center
            "
          >
            <div className="flex min-w-[245px] items-center gap-3.5">
              <FolderManagementIcon />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    className="
                      m-0
                      truncate
                      text-[15px]
                      font-semibold
                      tracking-tight
                      text-white/95
                    "
                  >
                    {typeLabel} management
                  </h2>

                  <span
                    className="
                      inline-flex h-5
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-emerald-400/15
                      bg-emerald-400/[0.08]
                      px-2.5
                      text-[9px]
                      font-semibold
                      text-emerald-300
                    "
                  >
                    <span
                      className="
                        h-1.5 w-1.5
                        rounded-full
                        bg-emerald-400
                        shadow-[0_0_10px_rgba(52,211,153,0.6)]
                      "
                    />
                    Live
                  </span>
                </div>

                <p className="m-0 mt-1 truncate text-[10px] text-white/30">Search, organise and manage your {type} records</p>
              </div>
            </div>

            <div className="relative min-w-0 flex-1 2xl:max-w-[430px]">
              <Search
                size={16}
                strokeWidth={2}
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-white/[0.42]
                "
              />

              <input
                type="search"
                placeholder={`Search ${type} by name, email, category or description...`}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="
                  h-11 w-full
                  rounded-[14px]
                  border
                  border-white/[0.065]
                  bg-[#08090b]/90
                  pl-10 pr-10
                  text-[11px]
                  font-medium
                  text-white/[0.82]
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_8px_20px_rgba(0,0,0,0.26)]
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-white/20
                  hover:border-white/[0.11]
                  hover:bg-[#0b0c0f]
                  focus:border-white/[0.16]
                  focus:bg-[#0d0f12]
                  focus:ring-4
                  focus:ring-white/[0.035]
                "
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="
                    absolute
                    right-2.5
                    top-1/2
                    flex h-7 w-7
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-transparent
                    text-white/30
                    transition-all
                    hover:border-white/[0.10]
                    hover:bg-[#1b1e23]
                    hover:text-white/75
                  "
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <SelectControl
                icon={<ArrowDownAZ size={13} />}
                label="Sort"
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                options={[
                  {
                    value: "newest",
                    label: "Newest",
                  },
                  {
                    value: "oldest",
                    label: "Oldest",
                  },
                  {
                    value: "az",
                    label: "A–Z",
                  },
                  {
                    value: "za",
                    label: "Z–A",
                  },
                ]}
              />

              <SelectControl
                icon={<SlidersHorizontal size={13} />}
                label={viewMode === "card" ? "Cards" : "Rows"}
                value={rowsPerPage}
                onChange={(event) => setRowsPerPage(Number(event.target.value))}
                options={pageSizeOptions.map((size) => ({
                  value: size,
                  label: size,
                }))}
              />

              {viewMode === "table" && (
                <Tooltip content={density === "compact" ? "Use comfortable rows" : "Use compact rows"}>
                  <button
                    type="button"
                    onClick={() => setDensity(density === "compact" ? "comfortable" : "compact")}
                    className={`
                      flex h-10 w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_4px_12px_rgba(0,0,0,0.2)]
                      transition-all
                      duration-200
                      hover:-translate-y-0.5

                      ${
                        density === "compact"
                          ? `
                            border-white/[0.15]
                            bg-[#24272d]
                            text-white/[0.85]
                            shadow-[0_10px_22px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.05)]
                          `
                          : `
                            border-white/[0.06]
                            bg-[#101216]
                            text-white/35
                            hover:border-white/[0.12]
                            hover:bg-[#1c1f24]
                            hover:text-white/80
                          `
                      }
                    `}
                    aria-label="Change row density"
                    aria-pressed={density === "compact"}
                  >
                    <Rows3 size={14} />
                  </button>
                </Tooltip>
              )}

              {supportsCardView && (
                <div
                  className="
                    flex h-10
                    items-center
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-white/[0.03]
                    p-1
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
                  "
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`
                      flex h-8
                      items-center
                      gap-1.5
                      rounded-[9px]
                      px-2.5
                      text-[10px]
                      font-semibold
                      transition-all
                      duration-200

                      ${
                        viewMode === "table"
                          ? `
                            border border-white/[0.13]
                            bg-[#25282e]
                            text-white/90
                            shadow-[0_8px_18px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.05)]
                          `
                          : `
                            border border-transparent
                            text-white/35
                            hover:bg-[#181a1f]
                            hover:text-white/75
                          `
                      }
                    `}
                    aria-pressed={viewMode === "table"}
                  >
                    <LayoutList size={13} />
                    Table
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("card")}
                    className={`
                      flex h-8
                      items-center
                      gap-1.5
                      rounded-[9px]
                      px-2.5
                      text-[10px]
                      font-semibold
                      transition-all
                      duration-200

                      ${
                        viewMode === "card"
                          ? `
                            border border-white/[0.13]
                            bg-[#25282e]
                            text-white/90
                            shadow-[0_8px_18px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.05)]
                          `
                          : `
                            border border-transparent
                            text-white/35
                            hover:bg-[#181a1f]
                            hover:text-white/75
                          `
                      }
                    `}
                    aria-pressed={viewMode === "card"}
                  >
                    <Grid2X2 size={13} />
                    Cards
                  </button>
                </div>
              )}

              <TertiaryButton
                className="
                  group flex h-10
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/[0.12]
                  bg-gradient-to-br
                  from-[#2b2e34]
                  via-[#1d2025]
                  to-[#111317]
                  px-4
                  text-[10px]
                  font-semibold
                  text-white/90
                  shadow-[0_11px_24px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.06)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-white/[0.18]
                  hover:from-[#34383f]
                  hover:to-[#17191d]
                  hover:text-white
                  hover:shadow-[0_14px_30px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.08)]
                "
                onClick={() => navigate(`/${linktocreate}`)}
              >
                <Plus
                  size={14}
                  strokeWidth={2.3}
                  className="
                    transition-transform
                    duration-200
                    group-hover:rotate-90
                  "
                />

                <span>{btntext}</span>
              </TertiaryButton>
            </div>
          </div>

          <div
            className="
              relative mt-4
              flex flex-col
              gap-2.5
              border-t
              border-white/[0.04]
              pt-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="
                  inline-flex h-7
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-white/[0.06]
                  bg-white/[0.03]
                  px-2.5
                  text-[9px]
                  font-medium
                  text-white/35
                  backdrop-blur-sm
                "
              >
                <Database size={11} className="text-white/[0.42]" />
                Total
                <strong className="text-white/75">{rowData.length}</strong>
              </span>

              <span
                className="
                  inline-flex h-7
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-white/[0.06]
                  bg-white/[0.03]
                  px-2.5
                  text-[9px]
                  font-medium
                  text-white/35
                  backdrop-blur-sm
                "
              >
                <Search size={11} className="text-white/[0.45]" />
                Results
                <strong className="text-white/75">{sortedData.length}</strong>
              </span>

              <span
                className="
                  inline-flex h-7
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-white/[0.06]
                  bg-white/[0.03]
                  px-2.5
                  text-[9px]
                  font-medium
                  text-white/35
                  backdrop-blur-sm
                "
              >
                {viewMode === "table" ? <LayoutList size={11} className="text-white/[0.45]" /> : <Grid2X2 size={11} className="text-white/[0.45]" />}

                {viewMode === "table" ? "Table view" : "Card view"}
              </span>
            </div>

            {(searchQuery || sortOption !== "newest") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");

                  setSortOption("newest");
                }}
                className="
                  inline-flex h-7
                  items-center
                  gap-1.5
                  self-start
                  rounded-lg
                  border
                  border-white/[0.065]
                  bg-[#101216]
                  px-2.5
                  text-[9px]
                  font-semibold
                  text-white/[0.45]
                  transition-all
                  hover:border-white/[0.12]
                  hover:bg-[#1b1e23]
                  hover:text-white/80
                  sm:self-auto
                "
              >
                <X size={11} />
                Reset filters
              </button>
            )}
          </div>
        </header>

        {/* ================================================================
            TABLE VIEW
            ================================================================ */}

        {viewMode === "table" ? (
          <>
            <div
              className="
                custom-scrollbar
                relative
                overflow-x-auto
              "
              style={{
                background: "#0d0f12",
              }}
            >
              <table className="w-full min-w-max table-auto text-left">
                <thead className="sticky top-0 z-10">
                  <tr>
                    {head.map((heading, index) => (
                      <th
                        key={`${heading}-${index}`}
                        scope="col"
                        className="
                            whitespace-nowrap
                            border-b
                            border-white/[0.065]
                            bg-[#090a0c]/96
                            px-5 py-4
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-white/[0.38]
                            backdrop-blur-xl
                          "
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-white/[0.28]" />

                          {heading}
                        </span>
                      </th>
                    ))}

                    <th
                      scope="col"
                      className="
                        sticky right-0
                        z-20
                        border-b
                        border-l
                        border-white/[0.065]
                        bg-[#090a0c]/98
                        px-5 py-4
                        text-center
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-white/[0.38]
                        backdrop-blur-xl
                      "
                      style={{
                        boxShadow: "-16px 0 28px -22px rgba(0,0,0,0.95)",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.02]">
                  {currentRows.map((item, index) => {
                    const serialNumber = (currentPage - 1) * rowsPerPage + index + 1;

                    return renderRowByType(item, serialNumber);
                  })}
                </tbody>
              </table>
            </div>

            {sortedData.length === 0 && (
              <div
                className="
                  relative flex
                  min-h-[380px]
                  flex-col
                  items-center
                  justify-center
                  overflow-hidden
                  px-6
                  text-center
                "
                style={{
                  background: "linear-gradient(180deg, #101216 0%, #090a0c 100%)",
                }}
              >
                <span
                  className="
                    pointer-events-none
                    absolute
                    h-48 w-48
                    rounded-full
                    bg-white/[0.02]
                    blur-[80px]
                  "
                />

                <div
                  className="
                    relative mb-5
                    flex
                    h-[76px]
                    w-[76px]
                    items-center
                    justify-center
                    rounded-[24px]
                    border
                    border-white/[0.08]
                    bg-gradient-to-br
                    from-[#202329]
                    to-[#0d0f12]
                    text-white/[0.42]
                    shadow-[0_20px_40px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.045)]
                  "
                >
                  <Search size={28} strokeWidth={1.6} />
                </div>

                <h3 className="relative m-0 text-sm font-semibold text-white/[0.85]">No matching records found</h3>

                <p className="relative mt-1.5 max-w-[360px] text-[11px] leading-5 text-white/25">We could not find any {type} records matching your current search or filter settings.</p>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="
                      relative mt-5
                      inline-flex h-9
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-[#111317]
                      px-4
                      text-[10px]
                      font-semibold
                      text-white/55
                      transition-all
                      hover:-translate-y-0.5
                      hover:border-white/[0.14]
                      hover:bg-[#202329]
                      hover:text-white/[0.85]
                      hover:shadow-[0_10px_22px_rgba(0,0,0,0.32)]
                    "
                  >
                    <X size={12} />
                    Clear search
                  </button>
                )}
              </div>
            )}

            {sortedData.length > 0 && (
              <footer
                className="
                  relative flex
                  flex-col
                  gap-3
                  border-t
                  border-white/[0.05]
                  px-4 py-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:px-6
                "
                style={{
                  background: "linear-gradient(180deg, rgba(15,17,20,0.97) 0%, rgba(9,10,12,0.99) 100%)",

                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center gap-3 text-[10px] text-white/30">
                  <span
                    className="
                      flex h-8 w-8
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.07]
                      bg-[#111317]
                      text-white/[0.42]
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
                    "
                  >
                    <Database size={13} />
                  </span>

                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-white/55">
                      Showing <strong className="font-semibold text-white/[0.85]">{firstVisibleRow}</strong>–<strong className="font-semibold text-white/[0.85]">{lastVisibleRow}</strong> of{" "}
                      <strong className="font-semibold text-white/[0.85]">{sortedData.length}</strong> entries
                    </span>

                    <span className="text-[9px] text-white/20">
                      Page {currentPage} of {totalPages} · {rowsPerPage} rows per page
                    </span>
                  </div>
                </div>

                <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </footer>
            )}
          </>
        ) : (
          <div
            className="
              relative
              p-6
            "
            style={{
              background: "linear-gradient(180deg, #111317 0%, #090a0c 100%)",
            }}
          >
            {cardView}
          </div>
        )}
      </Wrapper>
    </div>
  );
};

/* ==========================================================================
   PROP TYPES
   ========================================================================== */

Table.propTypes = {
  head: PropTypes.arrayOf(PropTypes.string).isRequired,

  rowData: PropTypes.array,

  btntext: PropTypes.string,

  linktocreate: PropTypes.string,

  linktoview: PropTypes.string,

  linktoupdate: PropTypes.string,

  comp: PropTypes.node,

  deleteFun: PropTypes.func,

  rowsPerPageNumber: PropTypes.number,

  type: PropTypes.string.isRequired,

  handleVisibilityToggle: PropTypes.func,

  handleFeaturedToggle: PropTypes.func,

  hidden: PropTypes.bool,
};
