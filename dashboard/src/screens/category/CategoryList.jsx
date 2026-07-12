import { deleteCategory, getallCategory } from "@/redux/slices/resources/categorySlice";
import { Table } from "@/routes";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";
import { CategoryCard } from "./CategoryListCard";

const TABLE_HEAD = ["S.N", "Created By", "Title", "Cover", "Type", "Posts", "Created"];

const CARD_ROWS_PER_PAGE = 8;

export const CategoryList = () => {
  const dispatch = useDispatch();

  const { categorys } = useSelector((state) => state.category);

  /*
   * Prevents an error when categorys or categoryList
   * has not loaded yet.
   */
  const categoryList = Array.isArray(categorys?.categoryList) ? categorys.categoryList : [];

  useEffect(() => {
    dispatch(getallCategory());
  }, [dispatch]);

  const removeCategory = async (id) => {
    await dispatch(deleteCategory(id));
    await dispatch(getallCategory());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this category",
      message: "Are you sure you want to delete this category?",
      buttons: [
        {
          label: "Delete",
          onClick: () => removeCategory(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  return (
    <div className="category-list">
      <Table
        head={TABLE_HEAD}
        rowData={categoryList}
        deleteFun={confirmDelete}
        btntext="Add category"
        linktocreate="create-category"
        linktoview="view-category"
        linktoupdate="update-category"
        rowsPerPageNumber={6}
        comp={<CategoryListCard rowData={categoryList} type="category" linktoupdate="update-category" linktoview="view-category" deleteFun={confirmDelete} rowsPerPage={CARD_ROWS_PER_PAGE} />}
        type="category"
      />
    </div>
  );
};

/* ==========================================================================
   CATEGORY CARD GRID WITH PAGINATION
   ========================================================================== */

export const CategoryListCard = ({ rowData = [], type = "category", linktoupdate = "update-category", linktoview = "view-category", deleteFun = () => {}, rowsPerPage = 6 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const safeRowData = Array.isArray(rowData) ? rowData : [];

  const totalItems = safeRowData.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  /*
   * If a category is deleted from the final page,
   * move the user back to the nearest available page.
   */
  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  const firstItemIndex = (currentPage - 1) * rowsPerPage;

  const lastItemIndex = Math.min(firstItemIndex + rowsPerPage, totalItems);

  const paginatedCategories = useMemo(() => {
    return safeRowData.slice(firstItemIndex, firstItemIndex + rowsPerPage);
  }, [safeRowData, firstItemIndex, rowsPerPage]);

  /*
   * Displays a maximum of five page buttons.
   */
  const visiblePages = useMemo(() => {
    const maximumVisiblePages = 5;

    if (totalPages <= maximumVisiblePages) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    let startPage = Math.max(1, currentPage - 2);

    let endPage = Math.min(totalPages, startPage + maximumVisiblePages - 1);

    if (endPage - startPage + 1 < maximumVisiblePages) {
      startPage = Math.max(1, endPage - maximumVisiblePages + 1);
    }

    return Array.from(
      {
        length: endPage - startPage + 1,
      },
      (_, index) => startPage + index,
    );
  }, [currentPage, totalPages]);

  const changePage = (pageNumber) => {
    const safePage = Math.min(Math.max(pageNumber, 1), totalPages);

    setCurrentPage(safePage);
  };

  if (totalItems === 0) {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0b0e16]/90 px-6 py-16 text-center shadow-[0_25px_70px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[75px]" />

        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white/35">
          <FolderOpen size={23} />
        </div>

        <h3 className="relative mt-4 text-[15px] font-semibold text-white/85">No categories found</h3>

        <p className="relative mt-1.5 text-[12px] text-white/35">Create your first category to see it here.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Responsive card grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {paginatedCategories.map((item, index) => {
          /*
           * originalIndex keeps each folder's colour
           * consistent between pagination pages.
           */
          const originalIndex = firstItemIndex + index;

          return (
            <CategoryCard
              key={item?._id || item?.slug || `${item?.title}-${originalIndex}`}
              item={item}
              itemIndex={originalIndex}
              type={type}
              linktoupdate={linktoupdate}
              linktoview={linktoview}
              onDelete={deleteFun}
            />
          );
        })}
      </div>

      {/* Card pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col gap-3 rounded-[20px] border border-white/[0.065] bg-[#0c101a]/80 p-3 shadow-[0_18px_45px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <p className="px-2 text-[10px] font-medium text-white/30">
            {firstItemIndex + 1}–{lastItemIndex} of {totalItems} categories
          </p>

          <div className="flex items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-white/55 transition-all duration-300 hover:border-violet-400/25 hover:bg-violet-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/[0.07] disabled:hover:bg-white/[0.035]"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((pageNumber) => {
              const isActive = currentPage === pageNumber;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => changePage(pageNumber)}
                  className={`relative flex h-9 min-w-9 items-center justify-center overflow-hidden rounded-xl px-2 text-[11px] font-bold transition-all duration-300 ${
                    isActive
                      ? "border border-violet-400/35 bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-[0_8px_24px_rgba(124,58,237,0.3)]"
                      : "border border-white/[0.07] bg-white/[0.035] text-white/40 hover:border-white/[0.14] hover:bg-white/[0.075] hover:text-white"
                  }`}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && <span className="pointer-events-none absolute inset-x-1 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />}

                  <span className="relative">{pageNumber}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-white/55 transition-all duration-300 hover:border-violet-400/25 hover:bg-violet-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/[0.07] disabled:hover:bg-white/[0.035]"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

CategoryListCard.propTypes = {
  rowData: PropTypes.array,
  type: PropTypes.string,
  linktoupdate: PropTypes.string,
  linktoview: PropTypes.string,
  deleteFun: PropTypes.func,
  rowsPerPage: PropTypes.number,
};
