import { AiOutlineFilePdf } from "react-icons/ai";
import { GoProjectRoadmap } from "react-icons/go";
import { InputTitle } from "@/components/customeUI/Title";
import { NavLink } from "react-router";
import { getRandomGradient, truncateText } from "@/utils";

export const HandbookCard = ({ total, title, logo, desc }) => {
  return (
    <NavLink className="handbook-card__link" to="/swiftui-fundamentals-handbook">
      <div className="handbook-card__wrapper">
        <div className="handbook-card__main">
          <div className="handbook-card__image-wrapper size-8 absolute top-0 right-0 m-4 rounded-full">
            <img src={logo?.filePath} alt={logo?.fileName} className="handbook-card__logo rounded-full w-full h-full object-cover" />
          </div>
          <div className="handbook-card__content">
            <InputTitle className="handbook-card__title gardient-text text-xl pr-1">{truncateText(title, 50)}</InputTitle>
            <p className="handbook-card__description">{truncateText(desc, 70)} </p>
            <div className="handbook-card__info flex items-center gap-2">
              <div className="handbook-card__icon-wrapper flexC size-8 rounded-full">
                <GoProjectRoadmap className="handbook-card__icon" />
              </div>
              <p className="handbook-card__info-text">{total} free tutorials</p>
            </div>
            <div className="handbook-card__info flex items-center gap-2">
              <div className="handbook-card__icon-wrapper flexC size-8 rounded-full">
                <AiOutlineFilePdf className="handbook-card__icon" />
              </div>
              <p className="handbook-card__info-text">Videos, PDF, files</p>
            </div>
          </div>
        </div>
        <div className="handbook-card__background" style={{ background: getRandomGradient() }}></div>
      </div>
    </NavLink>
  );
};
