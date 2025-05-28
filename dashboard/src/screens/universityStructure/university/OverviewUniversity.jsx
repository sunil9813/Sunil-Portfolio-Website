import { deleteUniversity, getAllUniversity } from "@/redux/slices/universityStructure/universitySlice";
import { BreadcrumbsComponent, Table, Wrapper } from "@/utils/Router";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";

const TABLE_HEAD = ["S.N", "User", "Name", "Logo", "Founded", "Address", "Type", "Website", "Created"];

export const OverviewUniversity = () => {
  const dispatch = useDispatch();
  const { universitys } = useSelector((state) => state.university);
  const { universityList } = universitys;

  useEffect(() => {
    dispatch(getAllUniversity());
  }, [dispatch]);

  const removeblog = async (id) => {
    await dispatch(deleteUniversity(id));
    await dispatch(getAllUniversity());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this University",
      message: "Are you sure to do delete this university?.",
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
        <div className="px-5 pt-5">
          <BreadcrumbsComponent currentPage="All University" space={true} />
        </div>
        <Table
          head={TABLE_HEAD}
          rowData={universityList}
          deleteFun={confirmDelete}
          btntext="Add university"
          linktocreate="create-university"
          linktoview="view-university"
          linktoupdate="update-university"
          rowsPerPageNumber={7}
          //   comp={<ProjectListCard rowData={posts} />}
          type="university"
        />
      </Wrapper>
    </>
  );
};
