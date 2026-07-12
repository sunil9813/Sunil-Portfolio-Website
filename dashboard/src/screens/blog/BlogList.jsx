import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "react-confirm-alert/src/react-confirm-alert.css";

import { deleteBlog, getallBlog, updateFeaturedStatus, updateVisibility } from "@/redux/slices/blogSlice";
import { Table } from "@/routes";
import { BentoCard } from "@/ui/BentoCard";

const TABLE_HEAD = ["S.N", "User", "Title", "Cover", "Views", "Likes", "Category", "Visibility", "Featured", "Created"];

/*
 * Table and card view use separate page sizes.
 *
 * Table:
 * 10 rows prevents 9 records from creating
 * a second page containing only one row.
 *
 * Card view:
 * Remains at the requested 8 cards per page.
 */
const TABLE_ROWS_PER_PAGE = 6;
const CARD_ITEMS_PER_PAGE = 8;

export const BlogList = () => {
  const dispatch = useDispatch();

  const blogList = useSelector((state) => state.blog?.blogs?.BlogList || []);

  useEffect(() => {
    dispatch(getallBlog());
  }, [dispatch]);

  const removeBlog = async (id) => {
    await dispatch(deleteBlog(id));
    await dispatch(getallBlog());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this blog",
      message: "Are you sure you want to delete this blog? This action cannot be undone.",
      buttons: [
        {
          label: "Delete",
          onClick: () => removeBlog(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  const handleVisibilityToggle = (blogId, visibility) => {
    dispatch(
      updateVisibility({
        blogId,
        visibility,
      }),
    );
  };

  const handleFeaturedToggle = (blogId, featured) => {
    dispatch(
      updateFeaturedStatus({
        blogId,
        featured,
      }),
    );
  };

  return (
    <Table
      head={TABLE_HEAD}
      rowData={blogList}
      deleteFun={confirmDelete}
      btntext="Add blog"
      linktocreate="create-blog"
      linktoview="view-blog"
      linktoupdate="update-blog"
      rowsPerPageNumber={TABLE_ROWS_PER_PAGE}
      comp={<BlogListCard rowData={blogList} />}
      type="blog"
      handleVisibilityToggle={handleVisibilityToggle}
      handleFeaturedToggle={handleFeaturedToggle}
    />
  );
};

const PaginationButton = ({ children, active = false, disabled = false, ariaLabel, onClick }) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-9 items-center justify-center rounded-xl border text-[9px] font-bold transition-all duration-300 ${
        active
          ? "border-white/[0.14] bg-white/[0.075] text-[#E2E7ED] shadow-[0_8px_22px_rgba(0,0,0,0.2)]"
          : "border-[#242C36] bg-[#10161E] text-[#748191] hover:border-[#35414F] hover:bg-[#151C25] hover:text-[#D8DEE8]"
      } disabled:cursor-not-allowed disabled:opacity-30`}
    >
      {children}
    </button>
  );
};

PaginationButton.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const BlogListCard = ({ rowData = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const blogs = useMemo(() => {
    return Array.isArray(rowData) ? rowData.filter(Boolean) : [];
  }, [rowData]);

  const totalItems = blogs.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / CARD_ITEMS_PER_PAGE));

  /*
   * Move back to the nearest valid page
   * when a blog is deleted.
   */
  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(Math.max(previousPage, 1), totalPages));
  }, [totalPages]);

  const visibleBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * CARD_ITEMS_PER_PAGE;

    return blogs.slice(startIndex, startIndex + CARD_ITEMS_PER_PAGE);
  }, [blogs, currentPage]);

  const visiblePageNumbers = useMemo(() => {
    const maximumButtons = 5;

    if (totalPages <= maximumButtons) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1,
      );
    }

    let startPage = Math.max(1, currentPage - 2);

    let endPage = Math.min(totalPages, startPage + maximumButtons - 1);

    if (endPage - startPage < maximumButtons - 1) {
      startPage = Math.max(1, endPage - maximumButtons + 1);
    }

    return Array.from(
      {
        length: endPage - startPage + 1,
      },
      (_, index) => startPage + index,
    );
  }, [currentPage, totalPages]);

  const firstVisibleItem = totalItems === 0 ? 0 : (currentPage - 1) * CARD_ITEMS_PER_PAGE + 1;

  const lastVisibleItem = Math.min(currentPage * CARD_ITEMS_PER_PAGE, totalItems);

  const changePage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);

    window.requestAnimationFrame(() => {
      document.getElementById("blog-card-list")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <section id="blog-card-list" className="scroll-mt-24">
      <BentoCard blogs={visibleBlogs} startIndex={(currentPage - 1) * CARD_ITEMS_PER_PAGE} />

      {totalPages > 1 && (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#242C36] bg-[#0E141B] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-semibold text-[#9AA5B3]">
              Showing {firstVisibleItem}–{lastVisibleItem} of {totalItems} results
            </p>

            <p className="mt-1 text-[7px] text-[#596676]">
              Page {currentPage} of {totalPages} · {CARD_ITEMS_PER_PAGE} cards per page
            </p>
          </div>

          <nav aria-label="Blog card pagination" className="flex flex-wrap items-center gap-1.5">
            <PaginationButton ariaLabel="Previous page" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
              <ChevronLeft size={14} />
            </PaginationButton>

            {visiblePageNumbers.map((page) => (
              <PaginationButton key={page} ariaLabel={`Go to page ${page}`} active={page === currentPage} onClick={() => changePage(page)}>
                {page}
              </PaginationButton>
            ))}

            <PaginationButton ariaLabel="Next page" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
              <ChevronRight size={14} />
            </PaginationButton>
          </nav>
        </div>
      )}
    </section>
  );
};

BlogListCard.propTypes = {
  rowData: PropTypes.arrayOf(PropTypes.object),
};
