import { GlitterCards } from "@/components/cards/GlowCard";
import { deleteCategory, getallCategory } from "@/redux/slices/resources/categorySlice";
import { BreadcrumbsComponent, Table } from "@/utils/Router";
import { Avatar } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { BsInstagram, BsTiktok, BsTwitterX } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import "react-confirm-alert/src/react-confirm-alert.css";

const TABLE_HEAD = ["S.N", "User", "Title", "Cover", "Type", "Posts", "Created"];

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
      <section className="category-list">
        <BreadcrumbsComponent text="categories" />
        <Table
          head={TABLE_HEAD}
          rowData={categoryList}
          deleteFun={confirmDelete}
          btntext="Add category"
          linktocreate="create-category"
          linktoview="view-category"
          linktoupdate="update-category"
          rowsPerPageNumber={7}
          comp={<CategoryListCard rowData={categoryList} />}
          type="category"
        />
      </section>
    </>
  );
};

export const CategoryListCard = ({ rowData }) => {
  return (
    <>
      <div className="card-container">
        <GlitterCards>
          {rowData &&
            rowData.map(({ img, name, email }, index) => (
              <div className="glitter-card profile-card rounded-lg p-8 flex gap-2 flex-col border border-white/20" key={`${name}-${index}`}>
                <div className="flex items-center justify-center flex-col gap-2 relative z-50">
                  {/*  <div className="cover h-32 w-full rounded-t-lg">
                <img
                  className="w-full h-full object-cover rounded-t-lg"
                  src="https://plus.unsplash.com/premium_photo-1681426414801-f36575c2de9e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y292ZXJ8ZW58MHx8MHx8fDA%3D"
                  alt=""
                />
              </div> */}
                  <Avatar src={img} alt={name} size="lg" />
                  <div className="text-center">
                    <h4 className="font-normal">{name}</h4>
                    <span className="text-textcolor font-normal text-sm">{email}</span>
                  </div>
                  <div className="social-icon text-teal-500 flex gap-2 my-5">
                    <FaFacebookF size={15} />
                    <BsInstagram size={15} />
                    <BsTwitterX size={15} />
                    <BsTiktok size={15} />
                  </div>
                </div>
                <div className="flex justify-between text-center relative z-50 w-full">
                  <div>
                    <h3 className="text-lg">1,908</h3>
                    <span className="text-textcolor font-normal text-sm">Posts</span>
                  </div>
                  <div>
                    <h3 className="text-lg">12.0k</h3>
                    <span className="text-textcolor font-normal text-sm">Followers</span>
                  </div>
                  <div>
                    <h3 className="text-lg">1400</h3>
                    <span className="text-textcolor font-normal text-sm">Following</span>
                  </div>
                </div>
              </div>
            ))}
        </GlitterCards>
      </div>
    </>
  );
};

CategoryListCard.propTypes = {
  rowData: PropTypes.array,
};
