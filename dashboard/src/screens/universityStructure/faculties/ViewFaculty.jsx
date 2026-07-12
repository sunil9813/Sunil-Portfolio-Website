import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdClose, MdOutlineDeleteOutline, MdOutlineRemoveRedEye, MdSchool } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { IoBusinessOutline } from "react-icons/io5";

import { deleteFaculty, getAllFaculty, updateFaculty } from "@/redux/slices/universityStructure/facultySlice";
import { Wrapper } from "@/routes";

export const ViewFaculty = () => {
  const dispatch = useDispatch();

  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { facultys } = useSelector((state) => state.faculty);

  const facultyList = facultys?.facultyList || [];

  useEffect(() => {
    dispatch(getAllFaculty());
  }, [dispatch]);

  const handleEditClick = (faculty) => {
    setEditingId(faculty?._id);
    setEditedName(faculty?.name || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedName("");
  };

  const handleSave = async (facultyId) => {
    const trimmedName = editedName.trim();

    if (!trimmedName) {
      toast.error("Faculty name cannot be empty.");
      return;
    }

    if (savingId) {
      return;
    }

    try {
      setSavingId(facultyId);

      await dispatch(
        updateFaculty({
          id: facultyId,
          data: {
            name: trimmedName,
          },
        }),
      ).unwrap();

      await dispatch(getAllFaculty()).unwrap();

      setEditingId(null);
      setEditedName("");

      toast.success("Faculty updated successfully.");
    } catch (error) {
      toast.error(error?.message || error || "Failed to update faculty.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (facultyId) => {
    if (deletingId) {
      return;
    }

    try {
      setDeletingId(facultyId);

      await dispatch(deleteFaculty(facultyId)).unwrap();
      await dispatch(getAllFaculty()).unwrap();

      if (editingId === facultyId) {
        handleCancelEdit();
      }

      toast.success("Faculty deleted successfully.");
    } catch (error) {
      toast.error(error?.message || error || "Failed to delete faculty.");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (faculty) => {
    confirmAlert({
      title: "Delete Faculty",
      message: `Are you sure you want to delete ${faculty?.name || "this faculty"}?`,
      buttons: [
        {
          label: "Delete",
          onClick: () => handleDelete(faculty?._id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  const handleEditKeyDown = (event, facultyId) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSave(facultyId);
    }

    if (event.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <Wrapper className="group relative my-3 overflow-hidden p-5 sm:p-6">
      {/* Wrapper background remains unchanged */}

      <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-violet-500/[0.014] blur-[100px] transition-all duration-700 group-hover:bg-violet-500/[0.024]" />

      <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-cyan-500/[0.012] blur-[100px] transition-all duration-700 group-hover:bg-cyan-500/[0.022]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.012),transparent_40%,transparent_76%,rgba(255,255,255,0.003))]" />

      <div className="relative z-10">
        {/* Section header */}
        <div className="mb-5 flex flex-col gap-3 border-b border-gray-200/70 pb-4 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-300/20 bg-violet-500/[0.08] text-violet-700 shadow-[0_8px_22px_rgba(124,58,237,0.08)] dark:border-violet-300/[0.09] dark:bg-violet-300/[0.045] dark:text-violet-200/70">
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] to-transparent" />

              <MdSchool size={20} className="relative z-10" />
            </div>

            <div>
              <h2 className="text-[13px] font-semibold text-gray-900 dark:text-white/90">Faculty Management</h2>

              <p className="mt-1 text-[9px] leading-4 text-gray-400 dark:text-white/25">View, rename and remove university faculties.</p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200/70 bg-gray-50/60 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
            <span className="size-1.5 rounded-full bg-violet-500 dark:bg-violet-300/70" />
            {facultyList.length} {facultyList.length === 1 ? "Faculty" : "Faculties"}
          </div>
        </div>

        {facultyList.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {facultyList.map((faculty, index) => {
              const isEditing = editingId === faculty?._id;
              const isSaving = savingId === faculty?._id;
              const isDeleting = deletingId === faculty?._id;

              return (
                <article
                  key={faculty?._id}
                  className="group/card relative min-w-0 overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-50/55 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/25 hover:shadow-[0_16px_38px_rgba(15,23,42,0.08)] dark:border-white/[0.05] dark:bg-white/[0.018] dark:shadow-[0_12px_30px_rgba(0,0,0,0.16)] dark:hover:border-violet-300/[0.11] dark:hover:bg-white/[0.025] dark:hover:shadow-[0_18px_42px_rgba(0,0,0,0.24)]"
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-violet-500/[0.025] blur-[45px] transition-all duration-500 group-hover/card:bg-violet-500/[0.045]" />

                  <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/25 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 dark:via-violet-300/[0.14]" />

                  <div className="relative z-10">
                    {/* University */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/20 bg-cyan-500/[0.075] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.04] dark:text-cyan-200/65">
                          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] to-transparent" />

                          <IoBusinessOutline size={16} className="relative z-10" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[7px] font-semibold uppercase tracking-[0.11em] text-gray-400 dark:text-white/20">University</p>

                          <h3 className="mt-0.5 truncate text-[10px] font-semibold capitalize text-gray-700 dark:text-white/55">{faculty?.university?.name || "University not assigned"}</h3>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full border border-gray-200/70 bg-white/55 px-2 py-1 text-[7px] font-semibold tabular-nums text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/20">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/[0.055]" />

                    {/* Faculty name or editor */}
                    {isEditing ? (
                      <div>
                        <label htmlFor={`faculty-${faculty?._id}`} className="mb-2 block text-[8px] font-semibold uppercase tracking-[0.1em] text-violet-600 dark:text-violet-200/55">
                          Edit faculty name
                        </label>

                        <div className="flex items-center gap-2">
                          <input
                            id={`faculty-${faculty?._id}`}
                            type="text"
                            value={editedName}
                            onChange={(event) => setEditedName(event.target.value)}
                            onKeyDown={(event) => handleEditKeyDown(event, faculty?._id)}
                            disabled={isSaving}
                            autoFocus
                            className="h-10 min-w-0 flex-1 rounded-xl border border-violet-300/30 bg-white/75 px-3 text-[10px] font-medium capitalize text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/[0.05] disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-300/[0.12] dark:bg-white/[0.028] dark:text-white/75 dark:placeholder:text-white/20 dark:focus:border-violet-300/[0.20]"
                          />

                          <button
                            type="button"
                            onClick={() => handleSave(faculty?._id)}
                            disabled={isSaving}
                            title="Save changes"
                            aria-label={`Save ${faculty?.name}`}
                            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-500/[0.09] text-emerald-700 transition-all hover:bg-emerald-500/[0.15] disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-300/[0.10] dark:bg-emerald-300/[0.045] dark:text-emerald-200/70 dark:hover:bg-emerald-300/[0.08]"
                          >
                            {isSaving ? (
                              <span className="size-3.5 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-600 dark:border-emerald-200/20 dark:border-t-emerald-200/75" />
                            ) : (
                              <FaCheck size={13} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            title="Cancel editing"
                            aria-label="Cancel faculty editing"
                            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-200/80 bg-gray-100/70 text-gray-500 transition-all hover:bg-gray-200/70 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/35 dark:hover:bg-white/[0.05]"
                          >
                            <MdClose size={15} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[8px] font-semibold uppercase tracking-[0.11em] text-gray-400 dark:text-white/20">Faculty</p>

                        <h4 className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold capitalize leading-5 text-gray-900 dark:text-white/90">{faculty?.name || "Unnamed faculty"}</h4>
                      </div>
                    )}

                    {/* Actions */}
                    {!isEditing && (
                      <div className="mt-5 flex items-center justify-between border-t border-gray-200/70 pt-3 dark:border-white/[0.05]">
                        <p className="text-[8px] font-medium text-gray-400 dark:text-white/20">Faculty actions</p>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            title="View faculty"
                            aria-label={`View ${faculty?.name}`}
                            className="flex size-8 items-center justify-center rounded-lg border border-sky-300/20 bg-sky-500/[0.065] text-sky-700 transition-all hover:-translate-y-0.5 hover:bg-sky-500/[0.12] dark:border-sky-300/[0.08] dark:bg-sky-300/[0.035] dark:text-sky-200/65 dark:hover:bg-sky-300/[0.07]"
                          >
                            <MdOutlineRemoveRedEye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditClick(faculty)}
                            disabled={isSaving || isDeleting}
                            title="Edit faculty"
                            aria-label={`Edit ${faculty?.name}`}
                            className="flex size-8 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-500/[0.065] text-emerald-700 transition-all hover:-translate-y-0.5 hover:bg-emerald-500/[0.12] disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/65 dark:hover:bg-emerald-300/[0.07]"
                          >
                            <HiOutlinePencilSquare size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => confirmDelete(faculty)}
                            disabled={isSaving || isDeleting}
                            title="Delete faculty"
                            aria-label={`Delete ${faculty?.name}`}
                            className="flex size-8 items-center justify-center rounded-lg border border-rose-300/20 bg-rose-500/[0.065] text-rose-700 transition-all hover:-translate-y-0.5 hover:bg-rose-500/[0.12] disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-300/[0.08] dark:bg-rose-300/[0.035] dark:text-rose-200/65 dark:hover:bg-rose-300/[0.07]"
                          >
                            {isDeleting ? (
                              <span className="size-3.5 animate-spin rounded-full border-2 border-rose-500/30 border-t-rose-600 dark:border-rose-200/20 dark:border-t-rose-200/75" />
                            ) : (
                              <MdOutlineDeleteOutline size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300/80 bg-gray-50/45 px-5 text-center dark:border-white/[0.07] dark:bg-white/[0.014]">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/[0.07] text-violet-600 dark:border-violet-300/[0.09] dark:bg-violet-300/[0.04] dark:text-violet-200/65">
              <MdSchool size={22} />
            </div>

            <p className="mt-4 text-[11px] font-semibold text-gray-700 dark:text-white/60">No faculties available</p>

            <p className="mt-1.5 text-[9px] text-gray-400 dark:text-white/25">Created faculties will appear here.</p>
          </div>
        )}
      </div>
    </Wrapper>
  );
};
