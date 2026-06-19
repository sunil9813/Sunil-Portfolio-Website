import { deleteUserByAdmin, getAllUserByAdmin } from "@/redux/slices/authSlice";
import { BreadcrumbsComponent, GlitterCards, Table, Wrapper } from "@/utils/Router";
import { Avatar } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { BsInstagram, BsTiktok, BsTwitterX } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { UserProfile } from "@/components/profile/UserProfile";
import { UserListCard } from "./UserListCard";

const TABLE_HEAD = ["S.N", "Member", "Role", "Status", "Connected"];

export const UserList = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.auth);
  const usersList = users.usersList;

  useEffect(() => {
    dispatch(getAllUserByAdmin());
  }, [dispatch]);

  const removeUser = async (id) => {
    await dispatch(deleteUserByAdmin(id));
    await dispatch(getAllUserByAdmin());
  };
  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this users",
      message: "Are you sure to do delete this user?.",
      buttons: [
        {
          label: "Delete",
          onClick: () => removeUser(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };
  return (
    <>
      <div className="user-list">
        <Table
          head={TABLE_HEAD}
          rowData={usersList}
          btntext="Add member"
          linktocreate="create-user"
          linktoview="view-user"
          rowsPerPageNumber={7}
          comp={<UserListCard rowData={usersList} />}
          delete={confirmDelete}
          type="users"
        />
      </div>
    </>
  );
};
