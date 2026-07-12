import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { MdOutlineBusiness } from "react-icons/md";
import { VscVerifiedFilled } from "react-icons/vsc";

import { createFaculty, getAllFaculty } from "@/redux/slices/universityStructure/facultySlice";
import { getAllUniversity } from "@/redux/slices/universityStructure/universitySlice";
import { Input, TertiaryButton, Wrapper } from "@/routes";
import { UniversityDropDown } from "../StructureAcademicDropDown";

export const CreateFaculty = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getAllFaculty());
    dispatch(getAllUniversity());
  }, [dispatch]);

  const handleUniversityChange = (selectedOption) => {
    setSelectedUniversity(selectedOption || null);
  };

  const handleCreate = async () => {
    if (!selectedUniversity?._id) {
      toast.error("Please select a university.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a faculty name.");
      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      await dispatch(
        createFaculty({
          name: name.trim(),
          university: selectedUniversity._id,
        }),
      ).unwrap();

      await dispatch(getAllFaculty()).unwrap();

      setName("");
      setSelectedUniversity(null);

      toast.success("Faculty created successfully.");
    } catch (error) {
      toast.error(error?.message || error || "Failed to create faculty.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCreate();
    }
  };

  return (
    <Wrapper className="relative z-30 my-3 !overflow-visible rounded-[28px] p-5 sm:p-6">
      {/* Decorative effects are clipped separately so the dropdown is not clipped */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
        <div className="absolute -right-24 -top-24 size-64 rounded-full bg-emerald-500/[0.018] blur-[90px]" />

        <div className="absolute -bottom-24 -left-24 size-64 rounded-full bg-indigo-500/[0.014] blur-[90px]" />

        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.014),transparent_38%,transparent_76%,rgba(255,255,255,0.004))]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 border-b border-gray-200/70 pb-5 dark:border-white/[0.055] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.09] text-indigo-700 shadow-[0_10px_28px_rgba(79,70,229,0.10)] dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.045] dark:text-indigo-200/75">
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.14] to-transparent" />

              <HiOutlineAcademicCap size={21} className="relative z-10" />
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Create Faculty</h2>

              <p className="mt-1 text-[9px] leading-4 text-gray-400 dark:text-white/30">Add a faculty and connect it to a university.</p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/[0.055] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/60">
            <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.55)] dark:bg-emerald-300/75" />
            Academic structure
          </div>
        </div>

        {/* Form */}
        <div onKeyDown={handleKeyDown} className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(260px,0.95fr)_minmax(320px,1.25fr)_170px] lg:items-end">
          {/* University dropdown */}
          <div className="relative z-50 min-w-0">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-[10px] font-semibold text-gray-700 dark:text-white/60">University</label>

              <span className="rounded-full border border-emerald-300/20 bg-emerald-500/[0.05] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.03] dark:text-emerald-200/60">
                Required
              </span>
            </div>

            <UniversityDropDown
              value={selectedUniversity}
              onChange={handleUniversityChange}
              placeholder="Select University"
              disabled={isSubmitting}
              className="dark:!border-white/[0.07] dark:!bg-white/[0.022]"
            />
          </div>

          {/* Faculty name */}
          <div className="relative z-10 min-w-0">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="faculty-name" className="text-[10px] font-semibold text-gray-700 dark:text-white/60">
                Faculty name
              </label>

              <span className={`text-[8px] font-medium tabular-nums ${name.length > 90 ? "text-rose-600 dark:text-rose-200/70" : "text-gray-400 dark:text-white/20"}`}>{name.length} characters</span>
            </div>

            <div className="relative">
              <Input
                id="faculty-name"
                type="text"
                name="name"
                className="pl-12"
                value={name}
                handleChange={(event) => setName(event.target.value)}
                placeholder="Faculty of Information Technology"
                disabled={isSubmitting}
              />

              <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-500/[0.09] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.045] dark:text-cyan-200/70 3xl:size-10">
                <MdOutlineBusiness size={16} />
              </span>
            </div>
          </div>

          {/* Publish */}
          <div className="relative z-10 w-full">
            <TertiaryButton type="button" onClick={handleCreate} disabled={isSubmitting} className="flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 3xl:h-12">
              {isSubmitting ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-current/25 border-t-current" />
                  Publishing...
                </>
              ) : (
                <>
                  <VscVerifiedFilled size={14} />
                  Publish now
                </>
              )}
            </TertiaryButton>
          </div>
        </div>

        {/* Selected university confirmation */}
        {selectedUniversity && (
          <div className="relative z-10 mt-4 flex items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-500/[0.045] px-3.5 py-3 dark:border-emerald-300/[0.075] dark:bg-emerald-300/[0.025]">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.04] dark:text-emerald-200/70">
              <VscVerifiedFilled size={14} />
            </div>

            <div className="min-w-0">
              <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-emerald-700/65 dark:text-emerald-200/40">Selected university</p>

              <p className="mt-0.5 truncate text-[10px] font-semibold capitalize text-emerald-800 dark:text-emerald-100/75">{selectedUniversity.name}</p>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};
