import { deleteUserByAdmin, getAllUserByAdmin } from "@/redux/slices/authSlice";
import { BreadcrumbsComponent, GlitterCards, Table } from "@/utils/Router";
import { Avatar } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { BsInstagram, BsTiktok, BsTwitterX } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const TABLE_HEAD = ["S.N", "Member", "Role", "Status", "Connected"];

const TABLE_ROWS = [
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    name: "John Michael",
    email: "john@creative-tim.com",
    job: "Manager",
    statu: "blocked",
    date: "23/04/18",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
    name: "Alexa Liras",
    email: "alexa@creative-tim.com",
    job: "Programator",
    statu: "suspended",
    date: "23/04/18",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
    name: "Laurent Perrier",
    email: "laurent@creative-tim.com",
    job: "Executive",
    statu: "none",
    date: "19/09/17",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
    name: "Michael Levi",
    email: "michael@creative-tim.com",
    job: "Programator",
    statu: "none",
    date: "24/12/08",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
    name: "Richard Gran",
    email: "richard@creative-tim.com",
    job: "Manager",
    statu: "none",
    date: "04/10/21",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    name: "John Michael",
    email: "john@creative-tim.com",
    job: "Manager",
    statu: "blocked",
    date: "23/04/18",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
    name: "Alexa Liras",
    email: "alexa@creative-tim.com",
    job: "Programator",
    statu: "suspended",
    date: "23/04/18",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
    name: "Laurent Perrier",
    email: "laurent@creative-tim.com",
    job: "Executive",
    statu: "none",
    date: "19/09/17",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
    name: "Michael Levi",
    email: "michael@creative-tim.com",
    job: "Programator",
    statu: "none",
    date: "24/12/08",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
    name: "Richard Gran",
    email: "richard@creative-tim.com",
    job: "Manager",
    statu: "none",
    date: "04/10/21",
  },
];

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
      <section className="user-list">
        <BreadcrumbsComponent text="All User" />
        <Table
          head={TABLE_HEAD}
          rowData={usersList}
          btntext="Add member"
          linktocreate="create-user"
          linktoview="view-user"
          rowsPerPageNumber={7}
          comp={<UserListCard rowData={TABLE_ROWS} />}
          delete={confirmDelete}
          type="users"
        />
      </section>
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
