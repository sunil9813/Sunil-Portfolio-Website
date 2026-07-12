import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "@material-tailwind/react";

const tooltipClass =
  "rounded-xl border border-white/[0.08] bg-[#080c12]/95 px-3 py-2 text-[10px] font-semibold tracking-wide text-white/90 shadow-[0_16px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl";

const EditorDropdown = ({ options, head, width = "min-w-[160px]", iconMode = false, customClasses = "", tooltip }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const trigger = (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onMouseDown={(event) => {
        event.preventDefault();
        setOpen((value) => !value);
      }}
      className={`group/editor-dd flex h-8 items-center justify-center rounded-xl border px-2.5 text-[12px] font-semibold leading-none transition-all duration-300 hover:-translate-y-0.5 3xl:h-9 ${
        open
          ? "border-emerald-300/[0.14] bg-emerald-300/[0.035] text-emerald-100/80 shadow-[0_8px_24px_rgba(16,185,129,0.08)]"
          : "border-white/[0.055] bg-dark-highlight text-white/55 shadow-[0_8px_24px_rgba(0,0,0,0.16)] hover:border-white/[0.1] hover:bg-white/[0.026] hover:text-white/75"
      }`}
    >
      <span className="flex items-center justify-center gap-1.5 text-inherit [&_*]:!text-inherit [&_svg]:!size-3.5 [&_svg]:shrink-0">{head}</span>
    </button>
  );

  return (
    <div ref={dropdownRef} className="relative inline-flex">
      {tooltip ? (
        <Tooltip
          content={tooltip}
          placement="top"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.96, y: 6 },
          }}
          className={tooltipClass}
        >
          {trigger}
        </Tooltip>
      ) : (
        trigger
      )}

      {open && (
        <div role="menu" className={`absolute left-0 top-full z-[999999] mt-2 rounded-xl border border-white/[0.05] bg-dark-surface2 p-1 shadow-dropDownDark ${width} ${customClasses}`}>
          <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-emerald-400/[0.045] blur-2xl" />

          <div className={iconMode ? "relative flex items-center gap-1.5" : "relative space-y-1"}>
            {options.map(({ label, onClick, icon, active, tooltip }, index) => {
              const itemButton = (
                <button
                  key={index}
                  type="button"
                  role="menuitem"
                  title={tooltip}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onClick();
                    setOpen(false);
                  }}
                  className={
                    iconMode
                      ? `flex size-8 items-center justify-center rounded-lg border text-sm transition-all duration-300 ${
                          active
                            ? "border-emerald-300/[0.1] bg-emerald-300/[0.035] text-emerald-100/70"
                            : "border-white/[0.05] bg-white/[0.014] text-white/35 hover:border-white/[0.08] hover:bg-white/[0.028] hover:text-white/70"
                        }`
                      : "group/editor-dd-item flex h-9 w-full items-center gap-3 rounded-lg border border-transparent px-3 text-left text-[10px] font-semibold text-white/40 transition-all duration-300 hover:border-white/[0.05] hover:bg-white/[0.018] hover:text-white/70"
                  }
                >
                  {iconMode ? (
                    <span className="text-base">{icon || label}</span>
                  ) : (
                    <>
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.014] text-white/30 transition-all duration-300 group-hover/editor-dd-item:border-emerald-300/[0.08] group-hover/editor-dd-item:bg-emerald-300/[0.025] group-hover/editor-dd-item:text-emerald-100/55">
                        {typeof label === "string" ? label.slice(0, 1) : "•"}
                      </span>

                      <span>{label}</span>
                    </>
                  )}
                </button>
              );

              return iconMode && tooltip ? (
                <Tooltip key={index} content={tooltip} placement="top" className={tooltipClass}>
                  {itemButton}
                </Tooltip>
              ) : (
                itemButton
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

EditorDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.any,
      icon: PropTypes.node,
      active: PropTypes.bool,
      tooltip: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    }),
  ).isRequired,
  head: PropTypes.node.isRequired,
  width: PropTypes.string,
  iconMode: PropTypes.bool,
  customClasses: PropTypes.string,
  tooltip: PropTypes.string,
};

export const NoSpaceDropDownOptions = ({ options, head, width }) => {
  return <EditorDropdown options={options} head={head} width={width} />;
};

export const DropDownOptions = ({ options, head }) => {
  return <EditorDropdown options={options} head={head} width="min-w-[155px]" />;
};

export const DropDownForFont = ({ options, head }) => {
  return <EditorDropdown options={options} head={head} width="w-[210px] max-h-80 overflow-y-auto scroll-bar-none" />;
};

export const DropDownOptionsWithIcon = ({ options, head, customClasses = "" }) => {
  return <EditorDropdown options={options} head={head} width="min-w-max" iconMode customClasses={customClasses} tooltip="Text Alignment" />;
};

NoSpaceDropDownOptions.propTypes = {
  options: EditorDropdown.propTypes.options,
  head: PropTypes.node.isRequired,
  width: PropTypes.string,
};

DropDownOptions.propTypes = {
  options: EditorDropdown.propTypes.options,
  head: PropTypes.node.isRequired,
};

DropDownForFont.propTypes = {
  options: EditorDropdown.propTypes.options,
  head: PropTypes.node.isRequired,
};

DropDownOptionsWithIcon.propTypes = {
  options: EditorDropdown.propTypes.options,
  head: PropTypes.node.isRequired,
  customClasses: PropTypes.string,
};
