import { BreadcrumbsComponent, Table, Wrapper } from "@/utils/Router";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import { deleteResume, getAllResume } from "@/redux/slices/portfolio/resumeSlice";

const TABLE_HEAD = ["S.N", "User", "Education", "Experience", "Skills", "Achievements", "Training", "Awards", "References", "Created"];

export const ViewAllResume = () => {
  const dispatch = useDispatch();
  const { resumes } = useSelector((state) => state.resume);

  useEffect(() => {
    dispatch(getAllResume());
  }, [dispatch]);

  const removeResume = async (id) => {
    await dispatch(deleteResume(id));
    await dispatch(getAllResume());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this resume",
      message: "Are you sure you want to delete this resume?",
      buttons: [
        {
          label: "Delete",
          onClick: () => removeResume(id),
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
          rowData={resumes}
          deleteFun={confirmDelete}
          btntext="Create resume"
          linktocreate="create-resume"
          linktoview="view-resume"
          linktoupdate="update-resume"
          rowsPerPageNumber={7}
          comp={null}
          type="resume"
        />
      </Wrapper>
    </>
  );
};
