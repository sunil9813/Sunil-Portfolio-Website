import { deleteProgram, getAllProgram } from "@/redux/slices/universityStructure/programSlice";
import { BreadcrumbsComponent, Table, Wrapper } from "@/routes";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";

const TABLE_HEAD = ["S.N", "User", "Name", "Thumbnail", "University", "Faculty", "Created"];

export const OverviewProgram = () => {
  const dispatch = useDispatch();
  const { programs } = useSelector((state) => state.program);
  const { programList } = programs;

  useEffect(() => {
    dispatch(getAllProgram());
  }, [dispatch]);

  const removeblog = async (id) => {
    await dispatch(deleteProgram(id));
    await dispatch(getAllProgram());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this Department",
      message: "Are you sure to do delete this department?.",
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
      <Wrapper className="department-list">
        <div className="px-5 pt-5">
          <BreadcrumbsComponent currentPage="All Department" space={true} />
        </div>
        <Table
          head={TABLE_HEAD}
          rowData={programList}
          deleteFun={confirmDelete}
          btntext="Add department"
          linktocreate="create-program"
          linktoview="view-program"
          linktoupdate="update-program"
          rowsPerPageNumber={7}
          //   comp={<ProjectListCard rowData={posts} />}
          type="department"
        />
      </Wrapper>
    </>
  );
};
