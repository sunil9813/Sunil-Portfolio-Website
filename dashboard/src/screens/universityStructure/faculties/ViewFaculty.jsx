import { Wrapper } from "@/utils/Router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteFaculty, getAllFaculty, updateFaculty } from "@/redux/slices/universityStructure/facultySlice";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

export const ViewFaculty = () => {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  const { facultys } = useSelector((state) => state.faculty);
  const { facultyList } = facultys;

  useEffect(() => {
    dispatch(getAllFaculty());
  }, [dispatch]);

  const handleEditClick = (faculty) => {
    setEditingId(faculty._id);
    setEditedName(faculty.name);
  };

  const handleSave = async (facultyId) => {
    if (!editedName.trim()) {
      toast.error("Faculty name cannot be empty");
      return;
    }

    try {
      await dispatch(updateFaculty({ id: facultyId, data: { name: editedName } })).unwrap();
      setEditingId(null);
      setEditedName("");
      dispatch(getAllFaculty());
    } catch (error) {
      toast.error(error?.message || "Failed to update faculty");
    }
  };

  const removeblog = async (id) => {
    await dispatch(deleteFaculty(id));
    await dispatch(getAllFaculty());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete this Faculty",
      message: "Are you sure to do delete this faculty?.",
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
    <Wrapper className="p-5 my-3 rounded-lg">
      <div className="flex items-center gap-2 flex-wrap">
        {facultyList?.map((faculty) => (
          <div key={faculty?._id} className="highlightbg textSizeSm p-3 px-5 lowercase rounded-lg border border-transparent hover:border-gray-900/10 hover:dark:border-gray-50/10">
            <p className="capitalize text-sm font-semibold textColor">{faculty?.university?.name}</p>

            {editingId === faculty._id ? (
              <div className="flex items-center gap-2 mt-2">
                <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="flex-1 rounded text-sm" autoFocus />
                <button onClick={() => handleSave(faculty._id)} className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600" title="Save changes">
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center mt-2">
                <span className="textColor capitalize">{faculty?.name}</span>
              </div>
            )}

            <div className="flex gap-2 items-center pt-3">
              <button title="View">
                <MdOutlineRemoveRedEye size={15} />
              </button>
              <button title="Delete" onClick={() => confirmDelete(faculty?._id)}>
                <MdOutlineDeleteOutline size={15} color="red" />
              </button>
              <button onClick={() => handleEditClick(faculty)}>
                <HiOutlinePencilSquare size={15} color="green" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
