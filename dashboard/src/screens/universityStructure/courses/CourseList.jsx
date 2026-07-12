import { BreadcrumbsComponent, Table, Wrapper } from "@/routes";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import "react-confirm-alert/src/react-confirm-alert.css";
import { BentoCard } from "@/ui/BentoCard";
import PropTypes from "prop-types";
import { updateFeaturedStatus, updateVisibility } from "@/redux/slices/projectSlice";
import { deleteCourse, getAllCourse } from "@/redux/slices/universityStructure/courseSlice";

const TABLE_HEAD = ["S.N", "User", "Title", "Type", "Thumbnail", "Views", "Likes", "Ratings", "Visibility", "Featured", "Created"];

export const CourseList = () => {
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.course);
  const { subject } = courses;

  useEffect(() => {
    dispatch(getAllCourse());
  }, [dispatch]);

  const removeblog = async (id) => {
    await dispatch(deleteCourse(id));
    await dispatch(getAllCourse());
  };
  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this course",
      message: "Are you sure to do delete this course?.",
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

  // Update blog visibility
  const handleVisibilityToggle = (projectId, visibility) => {
    dispatch(updateVisibility({ projectId, visibility }));
  };

  // Update blog featured status
  const handleFeaturedToggle = (projectId, featured) => {
    dispatch(updateFeaturedStatus({ projectId, featured }));
  };

  return (
    <>
      <Wrapper className="projects-list">
        <Table
          head={TABLE_HEAD}
          rowData={subject}
          deleteFun={confirmDelete}
          btntext="Add course"
          linktocreate="create-courses"
          linktoview="view-course"
          linktoupdate="update-course"
          rowsPerPageNumber={7}
          comp={<CourseListCard rowData={subject} />}
          type="course"
          handleVisibilityToggle={handleVisibilityToggle}
          handleFeaturedToggle={handleFeaturedToggle}
        />
      </Wrapper>
    </>
  );
};

export const CourseListCard = ({ rowData }) => {
  // Use rowData if provided, otherwise fallback to dummyBlogs
  //const projects = dummyBlogs;
  const projects = rowData;

  // Chunk projects into groups of 19
  const chunkSize = 19;
  const blogChunks = [];
  for (let i = 0; i < projects?.length; i += chunkSize) {
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
  rowData: PropTypes.any,
};
