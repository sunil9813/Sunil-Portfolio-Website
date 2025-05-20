import { BreadcrumbsComponent, Table, Wrapper } from "@/utils/Router";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import "react-confirm-alert/src/react-confirm-alert.css";
import { BentoCard } from "@/ui/BentoCard";
import PropTypes from "prop-types";
import { deleteProject, getallProjectCreatedByUser, updateFeaturedStatus, updateVisibility } from "@/redux/slices/projectSlice";

const TABLE_HEAD = ["S.N", "Title", "Price", "Thumbnail", "Assets", "Views", "Likes", "Ratings", "Download", "Category", "Visibility", "Featured", "Created"];

export const UserCreateProjectList = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.project);
  const { posts } = projects;

  useEffect(() => {
    dispatch(getallProjectCreatedByUser());
  }, [dispatch]);

  const removeblog = async (id) => {
    await dispatch(deleteProject(id));
    await dispatch(getallProjectCreatedByUser());
  };
  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this project",
      message: "Are you sure to do delete this project?.",
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
        <div className="px-5 pt-5">
          <BreadcrumbsComponent currentPage="All Project" space={true} />
        </div>
        <Table
          head={TABLE_HEAD}
          rowData={posts}
          deleteFun={confirmDelete}
          btntext="Add project"
          linktocreate="create-project"
          linktoview="view-project"
          linktoupdate="update-project"
          rowsPerPageNumber={7}
          comp={<ProjectListCard rowData={posts} />}
          type="project"
          handleVisibilityToggle={handleVisibilityToggle}
          handleFeaturedToggle={handleFeaturedToggle}
          hidden={true}
        />
      </Wrapper>
    </>
  );
};

export const ProjectListCard = ({ rowData }) => {
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
ProjectListCard.propTypes = {
  rowData: PropTypes.any,
};
