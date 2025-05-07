import { BreadcrumbsComponent, Table, Wrapper } from "@/utils/Router";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import "react-confirm-alert/src/react-confirm-alert.css";
import { deleteBlog, getallBlog, updateFeaturedStatus, updateVisibility } from "@/redux/slices/blogSlice";
import { BentoCard } from "@/ui/BentoCard";
import PropTypes from "prop-types";

const TABLE_HEAD = ["S.N", "User", "Title", "Cover", "Views", "Likes", "Category", "Visibility", "Featured", "Created"];

export const BlogList = () => {
  const dispatch = useDispatch();

  const { blogs } = useSelector((state) => state.blog);
  const { BlogList } = blogs;

  useEffect(() => {
    dispatch(getallBlog());
  }, [dispatch]);

  const removeblog = async (id) => {
    await dispatch(deleteBlog(id));
    await dispatch(getallBlog());
  };
  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this blog",
      message: "Are you sure to do delete this category?.",
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
  const handleVisibilityToggle = (blogId, visibility) => {
    dispatch(updateVisibility({ blogId, visibility }));
  };

  // Update blog featured status
  const handleFeaturedToggle = (blogId, featured) => {
    dispatch(updateFeaturedStatus({ blogId, featured }));
  };

  return (
    <>
      <Wrapper className="blogs-list">
        <div className="px-5 pt-5">
          <BreadcrumbsComponent currentPage="All Blogs" space={true} />
        </div>
        <Table
          head={TABLE_HEAD}
          rowData={BlogList}
          deleteFun={confirmDelete}
          btntext="Add blog"
          linktocreate="create-blog"
          linktoview="view-blog"
          linktoupdate="update-blog"
          rowsPerPageNumber={7}
          comp={<BlogListCard rowData={BlogList} />}
          type="blog"
          handleVisibilityToggle={handleVisibilityToggle}
          handleFeaturedToggle={handleFeaturedToggle}
        />
      </Wrapper>
    </>
  );
};

export const BlogListCard = ({ rowData }) => {
  // Use rowData if provided, otherwise fallback to dummyBlogs
  //const blogs = dummyBlogs;
  const blogs = rowData;

  // Chunk blogs into groups of 19
  const chunkSize = 19;
  const blogChunks = [];
  for (let i = 0; i < blogs?.length; i += chunkSize) {
    blogChunks.push(blogs.slice(i, i + chunkSize));
  }

  return (
    <div className="p-5">
      {blogChunks.map((chunk, index) => (
        <BentoCard key={index} blogs={chunk} />
      ))}
    </div>
  );
};
BlogListCard.propTypes = {
  rowData: PropTypes.any,
};
