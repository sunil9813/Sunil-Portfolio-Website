import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "react-confirm-alert/src/react-confirm-alert.css";

import { deleteProject, getAllProject, updateFeaturedStatus, updateVisibility } from "@/redux/slices/projectSlice";
import { Table } from "@/routes";
import { ProjectCardView } from "./ProjectCardView";

const TABLE_HEAD = ["S.N", "User", "Title", "Price", "Thumbnail", "Assets", "Views", "Likes", "Ratings", "Download", "Category", "Visibility", "Featured", "Created"];

const PROJECTS_PER_PAGE = 5;

export const ProjectList = () => {
  const dispatch = useDispatch();

  const projectList = useSelector((state) => state.project?.projects?.posts || []);

  useEffect(() => {
    dispatch(getAllProject());
  }, [dispatch]);

  const removeProject = async (id) => {
    await dispatch(deleteProject(id));
    await dispatch(getAllProject());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this project",
      message: "Are you sure you want to delete this project? This action cannot be undone.",
      buttons: [
        {
          label: "Delete",
          onClick: () => removeProject(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  const handleVisibilityToggle = (projectId, visibility) => {
    dispatch(
      updateVisibility({
        projectId,
        visibility,
      }),
    );
  };

  const handleFeaturedToggle = (projectId, featured) => {
    dispatch(
      updateFeaturedStatus({
        projectId,
        featured,
      }),
    );
  };

  return (
    <div className="projects-list">
      <Table
        head={TABLE_HEAD}
        rowData={projectList}
        deleteFun={confirmDelete}
        btntext="Add project"
        linktocreate="create-project"
        linktoview="view-project"
        linktoupdate="update-project"
        rowsPerPageNumber={PROJECTS_PER_PAGE}
        comp={<ProjectListCard rowData={projectList} />}
        type="project"
        handleVisibilityToggle={handleVisibilityToggle}
        handleFeaturedToggle={handleFeaturedToggle}
      />
    </div>
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
          ? "border-white/[0.16] bg-white/[0.09] text-[#E8EDF3] shadow-[0_8px_22px_rgba(0,0,0,0.28)]"
          : "border-[#242C36] bg-[#10161E] text-[#748191] hover:-translate-y-0.5 hover:border-[#394552] hover:bg-[#171E27] hover:text-[#D8DEE8]"
      } disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0`}
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

const createPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  let startPage = Math.max(1, currentPage - 2);

  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  return Array.from(
    {
      length: endPage - startPage + 1,
    },
    (_, index) => startPage + index,
  );
};

export const ProjectListCard = ({ rowData = [], itemsPerPage = PROJECTS_PER_PAGE }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const projects = useMemo(() => {
    return Array.isArray(rowData) ? rowData.filter(Boolean) : [];
  }, [rowData]);

  const pageSize = Math.max(1, Number(itemsPerPage) || PROJECTS_PER_PAGE);

  const totalItems = projects.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(Math.max(previousPage, 1), totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  const visibleProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return projects.slice(startIndex, startIndex + pageSize);
  }, [projects, currentPage, pageSize]);

  const paginationItems = useMemo(() => createPaginationItems(currentPage, totalPages), [currentPage, totalPages]);

  const firstVisibleItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const lastVisibleItem = Math.min(currentPage * pageSize, totalItems);

  const changePage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);

    window.requestAnimationFrame(() => {
      document.getElementById("project-card-view")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <section id="project-card-view" className="scroll-mt-24">
      <ProjectCardView projects={visibleProjects} startIndex={(currentPage - 1) * pageSize} />

      {totalPages > 1 && (
        <footer className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#242C36] bg-[#0E141B] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-semibold text-[#9AA5B3]">
              Showing {firstVisibleItem}–{lastVisibleItem} of {totalItems} projects
            </p>

            <p className="mt-1 text-[7px] text-[#596676]">
              Page {currentPage} of {totalPages} · {pageSize} cards per page
            </p>
          </div>

          <nav aria-label="Project card pagination" className="flex flex-wrap items-center gap-1.5">
            <PaginationButton ariaLabel="Previous page" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
              <ChevronLeft size={14} />
            </PaginationButton>

            {paginationItems.map((page) => (
              <PaginationButton key={page} ariaLabel={`Go to page ${page}`} active={page === currentPage} onClick={() => changePage(page)}>
                {page}
              </PaginationButton>
            ))}

            <PaginationButton ariaLabel="Next page" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
              <ChevronRight size={14} />
            </PaginationButton>
          </nav>
        </footer>
      )}
    </section>
  );
};

ProjectListCard.propTypes = {
  rowData: PropTypes.arrayOf(PropTypes.object),
  itemsPerPage: PropTypes.number,
};
