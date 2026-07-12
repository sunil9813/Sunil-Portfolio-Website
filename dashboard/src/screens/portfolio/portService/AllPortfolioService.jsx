import { deleteService, getAllService } from "@/redux/slices/portfolio/portServiceService";
import { Table, Wrapper } from "@/routes";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";

const TABLE_HEAD = ["S.N", "User", "Title", "Cover", "Created"];

export const AllPortfolioService = () => {
  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.service);
  const { services: servicesList } = services;
  console.log(services);

  useEffect(() => {
    dispatch(getAllService());
  }, [dispatch]);

  const removeblog = async (id) => {
    await dispatch(deleteService(id));
    await dispatch(getAllService());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this service",
      message: "Are you sure to do delete this service?.",
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

  return (
    <>
      <Wrapper className="university-list">
        <Table
          head={TABLE_HEAD}
          rowData={servicesList}
          deleteFun={confirmDelete}
          btntext="Create service"
          linktocreate="create-service"
          linktoview="view-service"
          linktoupdate="update-service"
          rowsPerPageNumber={7}
          //   comp={<ProjectListCard rowData={posts} />}
          type="service"
        />
      </Wrapper>
    </>
  );
};
