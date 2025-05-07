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
      <Wrapper className="user-list">
        <div className="px-5 pt-5">
          <BreadcrumbsComponent currentPage="Users Overview" space={true} />
        </div>
        <Table
          head={TABLE_HEAD}
          rowData={usersList}
          btntext="Add member"
          linktocreate="create-user"
          linktoview="view-user"
          rowsPerPageNumber={7}
          // comp={<UserListCard rowData={TABLE_ROWS} />}
          comp={<UserProfile rowData={usersList} />}
          delete={confirmDelete}
          type="users"
        />
      </Wrapper>
    </>
  );
};

export const UserListCard = ({ rowData }) => {
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

UserListCard.propTypes = {
  rowData: PropTypes.array,
};
