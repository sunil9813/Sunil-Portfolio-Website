import { BreadcrumbsComponent, Table, Wrapper } from "@/utils/Router";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import "react-confirm-alert/src/react-confirm-alert.css";
import { BentoCard } from "@/ui/BentoCard";
import PropTypes from "prop-types";
import { updateFeaturedStatus, updateVisibility } from "@/redux/slices/projectSlice";
import { deleteChapter, getAllChapter } from "@/redux/slices/universityStructure/chapterSlice";

const TABLE_HEAD = ["S.N", "User", "Subject", "Title", "Views", "Likes", "Ratings", "Created"];

export const ChapterOverview = () => {
  const dispatch = useDispatch();
  const { chapters } = useSelector((state) => state.chapter);
  const { chaptersBySubject } = chapters;

  // Flatten all chapters across all subjects
  const allChapters = chaptersBySubject ? Object.values(chaptersBySubject).flat() : [];

  useEffect(() => {
    dispatch(getAllChapter());
  }, [dispatch]);

  const removeblog = async (id) => {
    await dispatch(deleteChapter(id));
    await dispatch(getAllChapter());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this chapter",
      message: "Are you sure to do delete this chapter?",
      buttons: [
        {
          label: "Delete",
          onClick: () => removeblog(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  const handleVisibilityToggle = (projectId, visibility) => {
    dispatch(updateVisibility({ projectId, visibility }));
  };

  const handleFeaturedToggle = (projectId, featured) => {
    dispatch(updateFeaturedStatus({ projectId, featured }));
  };

  return (
    <Wrapper className="projects-list">
      <div className="px-5 pt-5">
        <BreadcrumbsComponent currentPage="All Project" space={true} />
      </div>
      <Table
        head={TABLE_HEAD}
        rowData={allChapters}
        deleteFun={confirmDelete}
        btntext="Add chapter"
        linktocreate="create-chapter"
        linktoview="view-chapter"
        linktoupdate="update-chapter"
        rowsPerPageNumber={7}
        comp={<CourseListCard rowData={allChapters} />}
        type="chapter"
        handleVisibilityToggle={handleVisibilityToggle}
        handleFeaturedToggle={handleFeaturedToggle}
      />
    </Wrapper>
  );
};

export const CourseListCard = ({ rowData }) => {
  const projects = rowData || [];

  const chunkSize = 19;
  const blogChunks = [];
  for (let i = 0; i < projects.length; i += chunkSize) {
    blogChunks.push(projects.slice(i, i + chunkSize));
  }

  return (
    <div className="p-5">
      {blogChunks.map((chunk, index) => (
        <BentoCard key={index} projects={chunk} />
      ))}
    </div>
  );
};

CourseListCard.propTypes = {
  rowData: PropTypes.array,
};
