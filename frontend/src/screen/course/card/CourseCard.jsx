import { AiOutlineFilePdf } from "react-icons/ai";
import { GoProjectRoadmap } from "react-icons/go";
import { InputTitle } from "@/components/customeUI/Title";
import { NavLink } from "react-router";
import { getRandomGradient, truncateText } from "@/utils";

export const HandbookCard = ({ total, title, logo, desc, to = "/courses", accessType = "unpaid", gradientIndex = 0 }) => {
  const logoUrl = logo?.filePath || logo?.url;
  const fallbackInitial = title?.charAt(0)?.toUpperCase() || "C";
  const isPaidCourse = accessType === "paid" || accessType === "pro";

  return (
    <NavLink className="handbook-card__link" to={to}>
      <div className="handbook-card__wrapper">
        <div className="handbook-card__main">
          <div className="handbook-card__image-wrapper absolute right-0 top-0 m-4 size-9 overflow-hidden rounded-full border border-white/15 bg-white/[0.08] shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
            {logoUrl ? (
              <img src={logoUrl} alt={logo?.fileName || title || "course logo"} className="handbook-card__logo h-full w-full rounded-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-black text-white/90">{fallbackInitial}</div>
            )}
          </div>
          <div className="handbook-card__content relative flex flex-col gap-3">
            <InputTitle className="handbook-card__title gardient-text text-xl">{truncateText(title, 44)}</InputTitle>
            <p className="handbook-card__description text-[11px] leading-5">{truncateText(desc, 70)} </p>
            <div className="handbook-card__info flex items-center gap-2">
              <div className="handbook-card__icon-wrapper flexC size-8 rounded-full">
                <GoProjectRoadmap className="handbook-card__icon" />
              </div>
              <p className="handbook-card__info-text">
                {total} {accessType === "paid" ? "premium" : "free"} tutorials
              </p>
            </div>
            <div className="handbook-card__info handbook-card__info--access flex items-center gap-2">
              <div className="handbook-card__icon-wrapper flexC size-8 rounded-full">
                <AiOutlineFilePdf className="handbook-card__icon" />
              </div>
              <p className="handbook-card__info-text handbook-card__info-text--access">{isPaidCourse ? "Premium access" : "Videos, PDF, files"}</p>
              {isPaidCourse && <span className="handbook-card__pro-badge handbook-card__pro-badge--circle">PRO</span>}
            </div>
          </div>
        </div>
        <div className="handbook-card__background" style={{ background: getRandomGradient(gradientIndex) }}></div>
      </div>
    </NavLink>
  );
};
