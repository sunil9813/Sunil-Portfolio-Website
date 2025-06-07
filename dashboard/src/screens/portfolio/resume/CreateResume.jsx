import { GhostButton, HeadingTwo, InputLabel, InputTitle, StickyHeader, TertiaryButton, Wrapper, InputForResume } from "@/utils/Router";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FaAward, FaBriefcase, FaChalkboardTeacher, FaCode, FaGraduationCap, FaTrophy, FaUser, FaUserFriends } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCloseOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { restrictToParentElement, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RiDragDropFill } from "react-icons/ri";
import { CommentEditor } from "@/components/comment/CommentEditor";
import { useDispatch } from "react-redux";
import { createResume } from "@/redux/slices/portfolio/resumeSlice";

// Color Manager Hook
export const UseColorManager = () => {
  const [assignedColors, setAssignedColors] = useState({});

  const getColorForId = (section, id) => {
    // Return existing color if already assigned
    if (assignedColors[id]) return assignedColors[id];

    // Get all currently used hues
    const usedHues = Object.values(assignedColors).map((color) => color.h);

    // Generate a new unique color
    let h, s, l;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      h = Math.floor(Math.random() * 360); // Full hue range (0-360)
      s = 70 + Math.floor(Math.random() * 20); // 70-90% saturation
      l = 50 + Math.floor(Math.random() * 10); // 50-60% lightness
      attempts++;

      // If we can't find a unique hue after many attempts, just pick any
      if (attempts > maxAttempts) {
        h = Math.floor(Math.random() * 360);
        break;
      }
    } while (usedHues.includes(h));

    const newColor = {
      bg: `hsl(${h}, ${s}%, ${l}%, 0.1)`,
      border: `hsl(${h}, ${s}%, ${l}%, 0.4)`,
      text: `hsl(${h}, ${s}%, ${l}%)`,
      h,
    };

    setAssignedColors((prev) => ({ ...prev, [id]: newColor }));
    return newColor;
  };

  return { getColorForId };
};

// Sortable Item Component
export const SortableItem = ({ id, children, section }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const { getColorForId } = UseColorManager();
  const colors = getColorForId(section, id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: colors.bg,
    borderColor: colors.border,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative border p-4 rounded-xl ${isDragging ? "shadow-lg" : ""}`} {...attributes}>
      {children({ dragHandleProps: listeners })}
    </div>
  );
};

// User ID Step Component
export const UserIdStep = ({ userId, setFormData }) => (
  <>
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-700 dark:to-teal-800 rounded-t-lg">
      <InputTitle className="text-white font-semibold text-lg">Enter User ID</InputTitle>
    </div>
    <div className="rounded-md p-4">
      <InputForResume type="text" placeholder="Enter User ID" value={userId} handleChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value }))} className="!rounded-md" />
    </div>
  </>
);

// Education Step Component
export const EducationStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  const [activeId, setActiveId] = useState(null);
  const { getColorForId } = UseColorManager();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      handleInputChange("education", arrayMove(fields, oldIndex, newIndex));
    }
  };

  const activeItem = fields.find((item) => item.id === activeId);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-700 dark:to-teal-800 rounded-t-lg">
        <InputTitle className="text-white font-semibold text-lg">Qualification History</InputTitle>
      </div>
      <div className="p-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd} modifiers={[restrictToParentElement, restrictToFirstScrollableAncestor]}>
          <SortableContext items={fields.map((item) => item.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 3xl:grid-cols-3 gap-4">
              {fields.map((item, index) => (
                <SortableItem key={item.id} id={item.id} index={index} section="education">
                  {({ dragHandleProps }) => (
                    <>
                      <InputLabel className="py-2">School</InputLabel>
                      <InputForResume
                        type="text"
                        placeholder="Name of school or college"
                        value={item.school || ""}
                        handleChange={(e) => handleInputChange("education", index, "school", e.target.value)}
                        className="!rounded-md"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="input">
                          <InputLabel className="py-2">Degree</InputLabel>
                          <InputForResume
                            type="text"
                            placeholder="BIT, BCA, BBA etc"
                            value={item.degree || ""}
                            handleChange={(e) => handleInputChange("education", index, "degree", e.target.value)}
                            className="!rounded-md"
                            required
                          />
                        </div>
                        <div className="input">
                          <InputLabel className="py-2">University</InputLabel>
                          <InputForResume
                            type="text"
                            value={item.university || ""}
                            handleChange={(e) => handleInputChange("education", index, "university", e.target.value)}
                            className="!rounded-md"
                            placeholder="PU, KU, TU"
                            required
                          />
                        </div>
                      </div>
                      <InputLabel className="py-2">City</InputLabel>
                      <InputForResume
                        type="text"
                        value={item.city || ""}
                        placeholder="Kathmandu, Nepal"
                        handleChange={(e) => handleInputChange("education", index, "city", e.target.value)}
                        className="!rounded-md"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="input">
                          <InputLabel className="py-2">Start Date</InputLabel>
                          <DatePicker
                            className="w-full rounded-md h-10 3xl:h-12 px-2 textColor textSizeSm bg-gray-900/5 dark:bg-gray-50/5"
                            selected={item.startDate ? new Date(item.startDate) : null}
                            onChange={(date) => handleInputChange("education", index, "startDate", date ? date.toISOString() : "")}
                            dateFormat="yyyy-MM-dd"
                            required
                            placeholderText="Start Date"
                          />
                        </div>
                        <div className="input">
                          <InputLabel className="py-2">End Date</InputLabel>
                          <DatePicker
                            className="w-full rounded-md h-10 3xl:h-12 px-2 textColor textSizeSm bg-gray-900/5 dark:bg-gray-50/5"
                            selected={item.endDate ? new Date(item.endDate) : null}
                            onChange={(date) => handleInputChange("education", index, "endDate", date ? date.toISOString() : "")}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="End Date"
                            required
                          />
                        </div>
                      </div>
                      <CommentEditor type="default" handleChange={(e) => handleInputChange("education", index, "description", e.target.value)} />

                      <div className="absolute top-0 right-0 flex items-center m-1 gap-2">
                        <button {...dragHandleProps} className="textColor rounded-full">
                          <RiDragDropFill size={20} />
                        </button>
                        <button type="button" onClick={() => removeEntry("education", index)} className="textColor rounded-full">
                          <IoCloseOutline size={30} />
                        </button>
                      </div>
                    </>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId && activeItem ? (
              <div
                style={{
                  backgroundColor: getColorForId("education", activeId).bg,
                  borderColor: getColorForId("education", activeId).border,
                }}
                className="border-2 p-4 rounded-md shadow-xl w-full md:w-1/2"
              >
                <div className="font-medium">{activeItem.school || "New School"}</div>
                <div className="text-sm text-gray-500">{activeItem.degree}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Add new item button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => addEntry("education")}
            className="button flex items-center justify-center w-full !p-3 3xl:!p-4 border border-dashed border-gray-100/20 transition-colors"
          >
            <GoPlus size={20} className="mr-2" />
            Add Education
          </button>
        </div>
      </div>
    </div>
  );
};

// Experience Step Component
export const ExperienceStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  const [activeId, setActiveId] = useState(null);
  const { getColorForId } = UseColorManager();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      handleInputChange("experience", arrayMove(fields, oldIndex, newIndex));
    }
  };

  const activeItem = fields.find((item) => item.id === activeId);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-700 dark:to-teal-800 rounded-t-lg">
        <InputTitle className="text-white font-semibold text-lg">Work Experience</InputTitle>
      </div>
      <div className="p-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd} modifiers={[restrictToParentElement, restrictToFirstScrollableAncestor]}>
          <SortableContext items={fields.map((item) => item.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 3xl:grid-cols-3 gap-4">
              {fields.map((item, index) => (
                <SortableItem key={item.id} id={item.id} index={index} section="experience">
                  {({ dragHandleProps }) => (
                    <>
                      <InputLabel className="py-2">Company Name</InputLabel>
                      <InputForResume
                        type="text"
                        placeholder="Organization or Company name"
                        value={item.company || ""}
                        handleChange={(e) => handleInputChange("experience", index, "company", e.target.value)}
                        className="!rounded-md"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="input">
                          <InputLabel className="py-2">Designation</InputLabel>
                          <InputForResume
                            type="text"
                            placeholder="Job Title"
                            value={item.position || ""}
                            handleChange={(e) => handleInputChange("experience", index, "position", e.target.value)}
                            className="!rounded-md"
                            required
                          />
                        </div>
                        <div className="input">
                          <InputLabel className="py-2">City</InputLabel>
                          <InputForResume
                            type="text"
                            placeholder="Kathmandu, Nepal"
                            value={item.city || ""}
                            handleChange={(e) => handleInputChange("experience", index, "city", e.target.value)}
                            className="!rounded-md"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="input">
                          <InputLabel className="py-2">Start Date</InputLabel>
                          <DatePicker
                            className="w-full rounded-md h-10 3xl:h-12 px-2 textColor textSizeSm bg-gray-900/5 dark:bg-gray-50/5"
                            selected={item.startDate ? new Date(item.startDate) : null}
                            onChange={(date) => handleInputChange("experience", index, "startDate", date ? date.toISOString() : "")}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Start Date"
                            required
                          />
                        </div>
                        <div className="input">
                          <InputLabel className="py-2">End Date</InputLabel>
                          <DatePicker
                            className="w-full rounded-md h-10 3xl:h-12 px-2 textColor textSizeSm bg-gray-900/5 dark:bg-gray-50/5"
                            selected={item.endDate ? new Date(item.endDate) : null}
                            onChange={(date) => handleInputChange("experience", index, "endDate", date ? date.toISOString() : "")}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="End Date"
                            required
                          />
                        </div>
                      </div>
                      <InputLabel className="py-2">Description</InputLabel>
                      <CommentEditor type="default" value={item.description || ""} handleChange={(e) => handleInputChange("experience", index, "description", e.target.value)} />
                      <div className="absolute top-0 right-0 flex items-center m-1 gap-2">
                        <button {...dragHandleProps} className="textColor rounded-full">
                          <RiDragDropFill size={20} />
                        </button>
                        <button type="button" onClick={() => removeEntry("experience", index)} className="textColor rounded-full">
                          <IoCloseOutline size={30} />
                        </button>
                      </div>
                    </>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId && activeItem ? (
              <div
                style={{
                  backgroundColor: getColorForId("experience", activeId).bg,
                  borderColor: getColorForId("experience", activeId).border,
                }}
                className="border-2 p-4 rounded-md shadow-xl w-full md:w-1/2"
              >
                <div className="font-medium">{activeItem.company || "New Company"}</div>
                <div className="text-sm text-gray-500">{activeItem.position}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Add new item button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => addEntry("experience")}
            className="button flex items-center justify-center w-full !p-3 3xl:!p-4 border border-dashed border-gray-100/20 transition-colors"
          >
            <GoPlus size={20} className="mr-2" />
            Add Experience
          </button>
        </div>
      </div>
    </div>
  );
};

// Skills Step Component
export const SkillsStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  const [activeId, setActiveId] = useState(null);
  const { getColorForId } = UseColorManager();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      handleInputChange("skills", arrayMove(fields, oldIndex, newIndex));
    }
  };

  const activeItem = fields.find((item) => item.id === activeId);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-700 dark:to-teal-800 rounded-t-lg">
        <InputTitle className="text-white font-semibold text-lg">Skills & Proficiencies</InputTitle>
      </div>
      <div className="p-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd} modifiers={[restrictToParentElement, restrictToFirstScrollableAncestor]}>
          <SortableContext items={fields.map((item) => item.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-4 gap-4">
              {fields.map((item, index) => (
                <SortableItem key={item.id} id={item.id} index={index} section="skills">
                  {({ dragHandleProps }) => (
                    <>
                      <div className="input">
                        <InputLabel className="py-2">Skill Name</InputLabel>
                        <InputForResume type="text" value={item.name || ""} handleChange={(e) => handleInputChange("skills", index, "name", e.target.value)} className="!rounded-md" required />
                      </div>
                      <div className="input">
                        <InputLabel className="py-2">Progress (0-100)</InputLabel>
                        <InputForResume
                          type="number"
                          min="0"
                          max="100"
                          value={item.progress || ""}
                          handleChange={(e) => handleInputChange("skills", index, "progress", e.target.value)}
                          className="!rounded-md"
                          required
                        />
                      </div>
                      <div className="absolute top-0 right-0 flex items-center m-1 gap-2">
                        <button {...dragHandleProps} className="textColor rounded-full">
                          <RiDragDropFill size={20} />
                        </button>
                        <button type="button" onClick={() => removeEntry("skills", index)} className="textColor rounded-full">
                          <IoCloseOutline size={30} />
                        </button>
                      </div>
                    </>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId && activeItem ? (
              <div
                style={{
                  backgroundColor: getColorForId("skills", activeId).bg,
                  borderColor: getColorForId("skills", activeId).border,
                }}
                className="border-2 p-4 rounded-md shadow-xl w-full md:w-1/2"
              >
                <div className="font-medium">{activeItem.name || "New Skill"}</div>
                <div className="text-sm text-gray-500">Progress: {activeItem.progress}%</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Add new item button */}
        <div className="mt-4">
          <button type="button" onClick={() => addEntry("skills")} className="button flex items-center justify-center w-full !p-3 3xl:!p-4 border border-dashed border-gray-100/20 transition-colors">
            <GoPlus size={20} className="mr-2" />
            Add Skill
          </button>
        </div>
      </div>
    </div>
  );
};

// Achievements Step Component
export const AchievementsStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  const [activeId, setActiveId] = useState(null);
  const { getColorForId } = UseColorManager();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      handleInputChange("achievements", arrayMove(fields, oldIndex, newIndex));
    }
  };

  const activeItem = fields.find((item) => item.id === activeId);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#8A2BE2] to-[#6A5ACD] dark:from-[#6A5ACD] dark:to-[#483D8B] rounded-t-lg">
        <InputTitle className="text-white font-semibold text-lg">Achievements</InputTitle>
      </div>
      <div className="p-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd} modifiers={[restrictToParentElement, restrictToFirstScrollableAncestor]}>
          <SortableContext items={fields.map((item) => item.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-4">
              {fields.map((item, index) => (
                <SortableItem key={item.id} id={item.id} index={index} section="achievements">
                  {({ dragHandleProps }) => (
                    <>
                      <InputLabel className="py-2">Title</InputLabel>
                      <InputForResume
                        type="text"
                        value={item.title || ""}
                        handleChange={(e) => handleInputChange("achievements", index, "title", e.target.value)}
                        className="!rounded-md"
                        placeholder="e.g., Employee of the Month"
                        required
                      />
                      <InputLabel className="py-2">Description</InputLabel>
                      <CommentEditor type="default" value={item.description || ""} handleChange={(e) => handleInputChange("achievements", index, "description", e.target.value)} />

                      <div className="absolute top-0 right-0 flex items-center m-1 gap-2">
                        <button {...dragHandleProps} className="textColor rounded-full">
                          <RiDragDropFill size={20} />
                        </button>
                        <button type="button" onClick={() => removeEntry("achievements", index)} className="textColor rounded-full">
                          <IoCloseOutline size={30} />
                        </button>
                      </div>
                    </>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId && activeItem ? (
              <div
                style={{
                  backgroundColor: getColorForId("achievements", activeId).bg,
                  borderColor: getColorForId("achievements", activeId).border,
                }}
                className="border-2 p-4 rounded-md shadow-xl w-full md:w-1/2"
              >
                <div className="font-medium">{activeItem.title || "New Achievement"}</div>
                <div className="text-sm text-gray-500 truncate">{activeItem.description || "No description"}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Add new item button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => addEntry("achievements")}
            className="button flex items-center justify-center w-full !p-3 3xl:!p-4 border border-dashed border-gray-100/20 transition-colors hover:bg-[#8A2BE2]/10"
          >
            <GoPlus size={20} className="mr-2 text-[#8A2BE2]" />
            <span className="text-[#8A2BE2]">Add Achievement</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Training Step Component
export const TrainingStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  const [activeId, setActiveId] = useState(null);
  const { getColorForId } = UseColorManager();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      handleInputChange("training", arrayMove(fields, oldIndex, newIndex));
    }
  };

  const activeItem = fields.find((item) => item.id === activeId);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#20B2AA] to-[#008080] dark:from-[#008080] dark:to-[#2E8B57] rounded-t-lg">
        <InputTitle className="text-white font-semibold text-lg">Training History</InputTitle>
      </div>
      <div className="p-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd} modifiers={[restrictToParentElement, restrictToFirstScrollableAncestor]}>
          <SortableContext items={fields.map((item) => item.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((item, index) => (
                <SortableItem key={item.id} id={item.id} index={index} section="training">
                  {({ dragHandleProps }) => (
                    <>
                      <InputLabel className="py-2">Title</InputLabel>
                      <InputForResume
                        type="text"
                        value={item.title || ""}
                        handleChange={(e) => handleInputChange("training", index, "title", e.target.value)}
                        className="!rounded-md"
                        placeholder="e.g., Advanced React Workshop"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="input">
                          <InputLabel className="py-2">Company</InputLabel>
                          <InputForResume
                            type="text"
                            value={item.company || ""}
                            handleChange={(e) => handleInputChange("training", index, "company", e.target.value)}
                            className="!rounded-md"
                            placeholder="Training provider name"
                            required
                          />
                        </div>
                        <div className="input">
                          <InputLabel className="py-2">City</InputLabel>
                          <InputForResume
                            type="text"
                            value={item.city || ""}
                            handleChange={(e) => handleInputChange("training", index, "city", e.target.value)}
                            className="!rounded-md"
                            placeholder="Location of training"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="input">
                          <InputLabel className="py-2">Start Date</InputLabel>
                          <DatePicker
                            className="w-full rounded-md h-10 3xl:h-12 px-2 textColor textSizeSm bg-gray-900/5 dark:bg-gray-50/5"
                            selected={item.startDate ? new Date(item.startDate) : null}
                            onChange={(date) => handleInputChange("training", index, "startDate", date ? date.toISOString() : "")}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select start date"
                            required
                          />
                        </div>
                        <div className="input">
                          <InputLabel className="py-2">End Date</InputLabel>
                          <DatePicker
                            className="w-full rounded-md h-10 3xl:h-12 px-2 textColor textSizeSm bg-gray-900/5 dark:bg-gray-50/5"
                            selected={item.endDate ? new Date(item.endDate) : null}
                            onChange={(date) => handleInputChange("training", index, "endDate", date ? date.toISOString() : "")}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select end date"
                            required
                          />
                        </div>
                      </div>
                      <InputLabel className="py-2">Description</InputLabel>
                      <CommentEditor
                        type="default"
                        value={item.description || ""}
                        handleChange={(value) => handleInputChange("training", index, "description", value)}
                        placeholder="Describe what you learned and skills gained..."
                      />
                      <div className="absolute top-0 right-0 flex items-center m-1 gap-2">
                        <button {...dragHandleProps} className="textColor rounded-full">
                          <RiDragDropFill size={20} />
                        </button>
                        <button type="button" onClick={() => removeEntry("training", index)} className="textColor rounded-full">
                          <IoCloseOutline size={30} />
                        </button>
                      </div>
                    </>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId && activeItem ? (
              <div
                style={{
                  backgroundColor: getColorForId("training", activeId).bg,
                  borderColor: getColorForId("training", activeId).border,
                }}
                className="border-2 p-4 rounded-md shadow-xl w-full md:w-1/2"
              >
                <div className="font-medium">{activeItem.title || "New Training"}</div>
                <div className="text-sm text-gray-500">{activeItem.company}</div>
                <div className="text-xs text-gray-400 mt-1 truncate">
                  {activeItem.startDate ? new Date(activeItem.startDate).toLocaleDateString() : ""} - {activeItem.endDate ? new Date(activeItem.endDate).toLocaleDateString() : ""}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Add new item button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => addEntry("training")}
            className="button flex items-center justify-center w-full !p-3 3xl:!p-4 border border-dashed border-gray-100/20 transition-colors hover:bg-[#20B2AA]/10"
          >
            <GoPlus size={20} className="mr-2 text-[#20B2AA]" />
            <span className="text-[#20B2AA]">Add Training</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Award Step Component
export const AwardStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  const [activeId, setActiveId] = useState(null);
  const { getColorForId } = UseColorManager();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      handleInputChange("award", arrayMove(fields, oldIndex, newIndex));
    }
  };

  const activeItem = fields.find((item) => item.id === activeId);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#FF8C00] to-[#FF6347] dark:from-[#FF6347] dark:to-[#CD5C5C] rounded-t-lg">
        <InputTitle className="text-white font-semibold text-lg">Awards & Honors</InputTitle>
      </div>
      <div className="p-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd} modifiers={[restrictToParentElement, restrictToFirstScrollableAncestor]}>
          <SortableContext items={fields.map((item) => item.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((item, index) => (
                <SortableItem key={item.id} id={item.id} index={index} section="award">
                  {({ dragHandleProps }) => (
                    <>
                      <InputLabel className="py-2">Title</InputLabel>
                      <InputForResume
                        type="text"
                        value={item.title || ""}
                        handleChange={(e) => handleInputChange("award", index, "title", e.target.value)}
                        className="!rounded-md"
                        placeholder="e.g., Employee of the Year"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="input">
                          <InputLabel className="py-2">Organization</InputLabel>
                          <InputForResume
                            type="text"
                            value={item.company || ""}
                            handleChange={(e) => handleInputChange("award", index, "company", e.target.value)}
                            className="!rounded-md"
                            placeholder="Awarding organization"
                            required
                          />
                        </div>
                        <div className="input">
                          <InputLabel className="py-2">City</InputLabel>
                          <InputForResume
                            type="text"
                            value={item.city || ""}
                            handleChange={(e) => handleInputChange("award", index, "city", e.target.value)}
                            className="!rounded-md"
                            placeholder="Location received"
                            required
                          />
                        </div>
                      </div>
                      <InputLabel className="py-2">Received Date</InputLabel>
                      <DatePicker
                        className="w-full rounded-md h-10 3xl:h-12 px-2 textColor textSizeSm bg-gray-900/5 dark:bg-gray-50/5"
                        selected={item.receivedYear ? new Date(item.receivedYear) : null}
                        onChange={(date) => handleInputChange("award", index, "receivedYear", date ? date.toISOString() : "")}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select received date"
                        required
                      />
                      <InputLabel className="py-2">Description</InputLabel>
                      <CommentEditor
                        type="default"
                        value={item.description || ""}
                        handleChange={(value) => handleInputChange("award", index, "description", value)}
                        placeholder="Describe the award and its significance..."
                      />
                      <div className="absolute top-0 right-0 flex items-center m-1 gap-2">
                        <button {...dragHandleProps} className="textColor rounded-full">
                          <RiDragDropFill size={20} />
                        </button>
                        <button type="button" onClick={() => removeEntry("award", index)} className="textColor rounded-full">
                          <IoCloseOutline size={30} />
                        </button>
                      </div>
                    </>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId && activeItem ? (
              <div
                style={{
                  backgroundColor: getColorForId("award", activeId).bg,
                  borderColor: getColorForId("award", activeId).border,
                }}
                className="border-2 p-4 rounded-md shadow-xl w-full md:w-1/2"
              >
                <div className="font-medium">{activeItem.title || "New Award"}</div>
                <div className="text-sm text-gray-500">{activeItem.company}</div>
                <div className="text-xs text-gray-400 mt-1">{activeItem.receivedYear ? new Date(activeItem.receivedYear).toLocaleDateString() : ""}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Add new item button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => addEntry("award")}
            className="button flex items-center justify-center w-full !p-3 3xl:!p-4 border border-dashed border-gray-100/20 transition-colors hover:bg-[#FF8C00]/10"
          >
            <GoPlus size={20} className="mr-2 text-[#FF8C00]" />
            <span className="text-[#FF8C00]">Add Award</span>
          </button>
        </div>
      </div>
    </div>
  );
};
// Reference Step Component
export const ReferenceStep = ({ fields, handleInputChange, addEntry, removeEntry }) => {
  const [activeId, setActiveId] = useState(null);
  const { getColorForId } = UseColorManager();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      handleInputChange("reference", arrayMove(fields, oldIndex, newIndex));
    }
  };

  const activeItem = fields.find((item) => item.id === activeId);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 rounded-t-lg">
        <InputTitle className="text-white font-semibold text-lg">References</InputTitle>
      </div>
      <div className="p-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd} modifiers={[restrictToParentElement, restrictToFirstScrollableAncestor]}>
          <SortableContext items={fields.map((item) => item.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((item, index) => (
                <SortableItem key={item.id} id={item.id} index={index} section="reference">
                  {({ dragHandleProps }) => (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="input">
                          <InputLabel className="py-2">Full Name</InputLabel>
                          <InputForResume
                            type="text"
                            value={item.fullname || ""}
                            handleChange={(e) => handleInputChange("reference", index, "fullname", e.target.value)}
                            className="!rounded-md"
                            placeholder="Reference's full name"
                            required
                          />
                        </div>
                        <div className="input">
                          <InputLabel className="py-2">Company</InputLabel>
                          <InputForResume
                            type="text"
                            value={item.company || ""}
                            handleChange={(e) => handleInputChange("reference", index, "company", e.target.value)}
                            className="!rounded-md"
                            placeholder="Current company"
                            required
                          />
                        </div>
                      </div>
                      <InputLabel className="py-2">Designation</InputLabel>
                      <InputForResume
                        type="text"
                        value={item.designation || ""}
                        handleChange={(e) => handleInputChange("reference", index, "designation", e.target.value)}
                        className="!rounded-md"
                        placeholder="Job title/position"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="input">
                          <InputLabel className="py-2">Phone</InputLabel>
                          <InputForResume
                            type="tel"
                            value={item.phone || ""}
                            handleChange={(e) => handleInputChange("reference", index, "phone", e.target.value)}
                            className="!rounded-md"
                            placeholder="Phone number"
                            required
                          />
                        </div>
                        <div className="input">
                          <InputLabel className="py-2">Email</InputLabel>
                          <InputForResume
                            type="email"
                            value={item.email || ""}
                            handleChange={(e) => handleInputChange("reference", index, "email", e.target.value)}
                            className="!rounded-md"
                            placeholder="Email address"
                            required
                          />
                        </div>
                      </div>
                      <InputLabel className="py-2">Website</InputLabel>
                      <InputForResume
                        type="url"
                        value={item.website || ""}
                        handleChange={(e) => handleInputChange("reference", index, "website", e.target.value)}
                        className="!rounded-md"
                        placeholder="Personal or company website"
                      />
                      <div className="absolute top-0 right-0 flex items-center m-1 gap-2">
                        <button {...dragHandleProps} className="textColor rounded-full">
                          <RiDragDropFill size={20} />
                        </button>
                        <button type="button" onClick={() => removeEntry("reference", index)} className="textColor rounded-full">
                          <IoCloseOutline size={30} />
                        </button>
                      </div>
                    </>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId && activeItem ? (
              <div
                style={{
                  backgroundColor: getColorForId("reference", activeId).bg,
                  borderColor: getColorForId("reference", activeId).border,
                }}
                className="border-2 p-4 rounded-md shadow-xl w-full md:w-1/2"
              >
                <div className="font-medium">{activeItem.fullname || "New Reference"}</div>
                <div className="text-sm text-gray-500">{activeItem.designation}</div>
                <div className="text-xs text-gray-400 mt-1">{activeItem.company}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Add new item button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => addEntry("reference")}
            className="button flex items-center justify-center w-full !p-3 3xl:!p-4 border border-dashed border-gray-100/20 transition-colors hover:bg-teal-500/10"
          >
            <GoPlus size={20} className="mr-2 text-teal-500" />
            <span className="text-teal-500">Add Reference</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main CreateResume Component
export const CreateResume = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  // Stepper state
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { name: "User ID", icon: <FaUser />, show: isAdmin, component: UserIdStep },
    { name: "Education", icon: <FaGraduationCap />, show: true, component: EducationStep },
    { name: "Experience", icon: <FaBriefcase />, show: true, component: ExperienceStep },
    { name: "Skills", icon: <FaCode />, show: true, component: SkillsStep },
    { name: "Achievements", icon: <FaTrophy />, show: true, component: AchievementsStep },
    { name: "Training", icon: <FaChalkboardTeacher />, show: true, component: TrainingStep },
    { name: "Award", icon: <FaAward />, show: true, component: AwardStep },
    { name: "Reference", icon: <FaUserFriends />, show: true, component: ReferenceStep },
  ].filter((step) => step.show);

  // Form state
  const [formData, setFormData] = useState({
    userId: "",
    education: [],
    experience: [],
    skills: [],
    achievements: [],
    training: [],
    award: [],
    reference: [],
  });

  // Initialize one entry for each field on mount
  useEffect(() => {
    const defaults = {
      education: {
        id: uuidv4(),
        school: "",
        degree: "",
        university: "",
        city: "",
        startDate: "",
        endDate: "",
        description: "",
      },
      experience: {
        id: uuidv4(),
        company: "",
        position: "",
        city: "",
        description: "",
        startDate: "",
        endDate: "",
      },
      skills: { id: uuidv4(), name: "", progress: "" },
      achievements: { id: uuidv4(), title: "", description: "" },
      training: {
        id: uuidv4(),
        title: "",
        company: "",
        city: "",
        description: "",
        startDate: "",
        endDate: "",
      },
      award: {
        id: uuidv4(),
        title: "",
        company: "",
        city: "",
        description: "",
        receivedYear: "",
      },
      reference: {
        id: uuidv4(),
        fullname: "",
        company: "",
        designation: "",
        phone: "",
        email: "",
        website: "",
      },
    };

    setFormData((prev) => ({
      ...prev,
      education: prev.education.length === 0 ? [defaults.education] : prev.education,
      experience: prev.experience.length === 0 ? [defaults.experience] : prev.experience,
      skills: prev.skills.length === 0 ? [defaults.skills] : prev.skills,
      achievements: prev.achievements.length === 0 ? [defaults.achievements] : prev.achievements,
      training: prev.training.length === 0 ? [defaults.training] : prev.training,
      award: prev.award.length === 0 ? [defaults.award] : prev.award,
      reference: prev.reference.length === 0 ? [defaults.reference] : prev.reference,
    }));
  }, []);

  // Handle input changes for array fields
  const handleInputChange = (fieldName, indexOrItems, field, value) => {
    if (Array.isArray(indexOrItems)) {
      // For drag-and-drop updates
      setFormData((prev) => ({
        ...prev,
        [fieldName]: indexOrItems,
      }));
    } else {
      // For input changes
      const updatedArray = [...formData[fieldName]];
      updatedArray[indexOrItems] = {
        ...updatedArray[indexOrItems],
        [field]: value,
      };
      setFormData({
        ...formData,
        [fieldName]: updatedArray,
      });
    }
  };

  // Add new entry to a field
  const addEntry = (fieldName) => {
    const defaults = {
      education: {
        id: uuidv4(),
        school: "",
        degree: "",
        university: "",
        city: "",
        startDate: "",
        endDate: "",
        description: "",
      },
      experience: {
        id: uuidv4(),
        company: "",
        position: "",
        city: "",
        description: "",
        startDate: "",
        endDate: "",
      },
      skills: { id: uuidv4(), name: "", progress: "" },
      achievements: { id: uuidv4(), title: "", description: "" },
      training: {
        id: uuidv4(),
        title: "",
        company: "",
        city: "",
        description: "",
        startDate: "",
        endDate: "",
      },
      award: {
        id: uuidv4(),
        title: "",
        company: "",
        city: "",
        description: "",
        receivedYear: "",
      },
      reference: {
        id: uuidv4(),
        fullname: "",
        company: "",
        designation: "",
        phone: "",
        email: "",
        website: "",
      },
    };

    setFormData({
      ...formData,
      [fieldName]: [...formData[fieldName], defaults[fieldName]],
    });
  };

  // Remove entry
  const removeEntry = (fieldName, index) => {
    const updatedArray = formData[fieldName].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [fieldName]: updatedArray,
    });
  };

  // Form submission
  const onSubmit = async () => {
    try {
      const payload = { ...formData };
      if (!isAdmin) {
        delete payload.userId;
      }

      // Remove 'id' fields from array entries
      Object.keys(payload).forEach((key) => {
        if (Array.isArray(payload[key])) {
          payload[key] = payload[key].filter((item) => Object.values(item).some((val) => val && val.toString().trim())).map(({ ...rest }) => rest); // Remove 'id' from each item
        }
      });

      await dispatch(createResume(payload)).unwrap();
      navigate("/resume");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to create resume";
      toast.error(errorMessage);
    }
  };

  // Navigation between steps
  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Render form fields for each step
  const renderStep = () => {
    const StepComponent = steps[currentStep].component;
    const fieldName = steps[currentStep].name.toLowerCase().replace(/\s+/g, "");
    if (fieldName === "userid") {
      return <StepComponent userId={formData.userId} setFormData={setFormData} />;
    }
    return <StepComponent fields={formData[fieldName]} handleInputChange={handleInputChange} addEntry={addEntry} removeEntry={removeEntry} />;
  };

  return (
    <>
      <StickyHeader>
        <HeadingTwo>Create Resume</HeadingTwo>
        <div className="flexC gap-2">
          <GhostButton onClick={() => navigate("/resume")}>Cancel</GhostButton>

          {currentStep === steps.length - 1 ? (
            <TertiaryButton onClick={onSubmit}>Submit Resume</TertiaryButton>
          ) : (
            <TertiaryButton>
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="bg-teal-500 rounded-full px-2 text-white ml-2 textSizeSm">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </TertiaryButton>
          )}
        </div>
      </StickyHeader>
      <Wrapper className="w-full rounded-none !rounded-t-md py-2 mb-3">
        <div className="stepper">
          {steps.map((step, index) => (
            <div
              key={step.name}
              className={`stepper__step ${index <= currentStep ? "stepper__step--completed" : ""} ${index === currentStep ? "stepper__step--current" : ""}`}
              style={{ width: `${100 / steps.length}%` }}
            >
              <div className="stepper__step-content">
                <div className="stepper__step-icon">
                  <span className="stepper__step-icon-inner">
                    {index < currentStep ? (
                      <svg viewBox="0 0 24 24" className="stepper__checkmark">
                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </span>
                </div>
                {/* <span className="stepper__step-label textSizeSm pt-1">{step.name}</span> */}
              </div>
              {index < steps.length - 1 && (
                <div className="stepper__connector">
                  <div className="stepper__connector-progress" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Wrapper>
      <Wrapper className="rounded-md mb-5">
        {renderStep()}
        <div className=" absolute top-0 right-0 m-2.5 flex items-center gap-3">
          <button type="button" onClick={prevStep} disabled={currentStep === 0} className="button">
            Previous
          </button>
          <button type="button" onClick={nextStep} className="button" disabled={currentStep === steps.length - 1}>
            Next
          </button>
        </div>
      </Wrapper>
    </>
  );
};

UserIdStep.propTypes = {
  userId: PropTypes.string.isRequired,
  setFormData: PropTypes.func.isRequired,
};
SortableItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  gridCols: PropTypes.number,
};
EducationStep.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      school: PropTypes.string,
      degree: PropTypes.string,
      university: PropTypes.string,
      city: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addEntry: PropTypes.func.isRequired,
  removeEntry: PropTypes.func.isRequired,
};

ExperienceStep.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      company: PropTypes.string,
      position: PropTypes.string,
      city: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addEntry: PropTypes.func.isRequired,
  removeEntry: PropTypes.func.isRequired,
};

SkillsStep.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      progress: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addEntry: PropTypes.func.isRequired,
  removeEntry: PropTypes.func.isRequired,
};

AchievementsStep.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addEntry: PropTypes.func.isRequired,
  removeEntry: PropTypes.func.isRequired,
};

TrainingStep.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      company: PropTypes.string,
      city: PropTypes.string,
      description: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    })
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addEntry: PropTypes.func.isRequired,
  removeEntry: PropTypes.func.isRequired,
};

AwardStep.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      company: PropTypes.string,
      city: PropTypes.string,
      description: PropTypes.string,
      receivedYear: PropTypes.string,
    })
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addEntry: PropTypes.func.isRequired,
  removeEntry: PropTypes.func.isRequired,
};

ReferenceStep.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      fullname: PropTypes.string,
      company: PropTypes.string,
      designation: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
      website: PropTypes.string,
    })
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addEntry: PropTypes.func.isRequired,
  removeEntry: PropTypes.func.isRequired,
};
