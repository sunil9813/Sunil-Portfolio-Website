import { BreadcrumbsComponent, Table } from "@/utils/Router";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import "react-confirm-alert/src/react-confirm-alert.css";
import { deleteBlog, getallBlog, updateFeaturedStatus, updateVisibility } from "@/redux/slices/blogSlice";

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
      <section className="category-list">
        <BreadcrumbsComponent text="categories" />
        <Table
          head={TABLE_HEAD}
          rowData={BlogList}
          deleteFun={confirmDelete}
          btntext="Add blog"
          linktocreate="create-blog"
          linktoview="view-blog"
          linktoupdate="update-blog"
          rowsPerPageNumber={7}
          comp={<BlogListCard />}
          type="blog"
          handleVisibilityToggle={handleVisibilityToggle}
          handleFeaturedToggle={handleFeaturedToggle}
        />
      </section>
    </>
  );
};

export const BlogListCard = () => {
  return <div>Card</div>;
};
