import { deleteCategory, getallCategory } from "@/redux/slices/resources/categorySlice";
import { BreadcrumbsComponent, Table, Wrapper } from "@/utils/Router";
import { Tooltip } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import "react-confirm-alert/src/react-confirm-alert.css";
import { NavLink, useNavigate } from "react-router-dom";
import { CiEdit, CiLink, CiTrash } from "react-icons/ci";
import { CategoryCard } from "./CategoryListCard";

const TABLE_HEAD = ["S.N", "Created By", "Title", "Cover", "Type", "Posts", "Created"];

export const CategoryList = () => {
  const dispatch = useDispatch();

  const { categorys } = useSelector((state) => state.category);
  const { categoryList } = categorys;

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
      message: "Are you sure to do delete this category?.",
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
    <>
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
          comp={<CategoryListCard rowData={categoryList} type="category" linktoupdate="update-category" deleteFun={confirmDelete} linktoview="view-category" />}
          type="category"
        />
      </div>
    </>
  );
};

export const CategoryListCard = ({ rowData, type, linktoupdate, linktoview, deleteFun }) => {
  return (
    <Wrapper className="p-5 grid grid-cols-4 gap-3 mb-5">
      {rowData?.map((item, index) => (
        <CategoryCard key={item?._id || index} item={item} type={type} linktoupdate={linktoupdate} linktoview={linktoview} onDelete={deleteFun} />
      ))}
    </Wrapper>
  );
};

CategoryListCard.propTypes = {
  rowData: PropTypes.array,
  type: PropTypes.string,
  linktoupdate: PropTypes.string,
  linktoview: PropTypes.string,
  deleteFun: PropTypes.func,
};
