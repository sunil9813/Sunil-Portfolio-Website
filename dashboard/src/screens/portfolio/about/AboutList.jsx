import { deleteIntro, getAllIntroByAdmin } from "@/redux/slices/portfolio/introSlice";
import { Table, Wrapper } from "@/routes";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";

const TABLE_HEAD = ["S.N", "User", "Full Name", "Function", "Contact No", "Email", "Address", "CV", "Download", "Created"];

export const AboutList = () => {
  const dispatch = useDispatch();
  const { intros } = useSelector((state) => state.intro);
  const { introList } = intros;
  console.log(introList);

  useEffect(() => {
    dispatch(getAllIntroByAdmin());
  }, [dispatch]);

  const removeblog = async (id) => {
    await dispatch(deleteIntro(id));
    await dispatch(getAllIntroByAdmin());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this about",
      message: "Are you sure to do delete this about?.",
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
          rowData={introList}
          deleteFun={confirmDelete}
          btntext="Create Intro"
          linktocreate="create-intro"
          linktoview="view-intro"
          linktoupdate="update-intro"
          rowsPerPageNumber={7}
          //   comp={<ProjectListCard rowData={posts} />}
          type="intros"
        />
      </Wrapper>
    </>
  );
};
