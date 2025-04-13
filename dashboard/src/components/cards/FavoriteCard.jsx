import PropTypes from "prop-types";
import { truncateText } from "@/utils";
import { DateFormatter } from "../common/DateFormatter";
import { FaComments, FaUser } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { AiFillLike } from "react-icons/ai";
import { Chip } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { FavoriteButton } from "../FavoriteButton";
import { NavLink } from "react-router-dom";

export const FavoriteCard = ({ postId, url, slug, cover, coverAlt, categoryTitle, title, metaDescription, createdAt, username, likes, numOfViews }) => {
  const { favoriteResource } = useSelector((state) => state.favorite);
  const isFavorited = useMemo(() => favoriteResource?.Blog?.some((fav) => fav._id === postId), [favoriteResource, postId]);

  return (
    <>
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="relative">
          <img src={cover} alt={coverAlt} className="w-full h-48 object-cover" />
          <div className=" absolute top-0 left-0 m-2">
            <FavoriteButton resourceType="Blog" resourceId={postId} initialFavorited={isFavorited} />
          </div>
          <div className=" absolute bottom-0 right-0 m-2">
            <Chip value={categoryTitle} color="indigo" className=" rounded-sm shadow-sm" />
          </div>
        </div>
        <div className="p-4">
          <NavLink to={`${url}/${slug}`}>
            <h3 className="text-lg font-semibold text-white capitalize">{truncateText(title, 32)}</h3>
          </NavLink>
          <p className="text-gray-400 text-sm mt-2">{truncateText(metaDescription, 80)}</p>
          <div className="flex items-center gap-4 mt-4 text-gray-400 text-sm">
            <span>
              <DateFormatter date={createdAt} />
            </span>
            <div className="flex items-center gap-1">
              <FaUser size={12} />
              {username}
            </div>
            <div className="flex items-center gap-1">
              <IoEye />
              {numOfViews}
            </div>
            <div className="flex items-center gap-1">
              <AiFillLike />
              {likes}
            </div>
            <div className="flex items-center gap-1">
              <FaComments />
              200
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
FavoriteCard.propTypes = {
  postId: PropTypes.string,
  url: PropTypes.string,
  slug: PropTypes.string,
  cover: PropTypes.string.isRequired,
  coverAlt: PropTypes.string.isRequired,
  categoryTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  metaDescription: PropTypes.string.isRequired,
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  username: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  numOfViews: PropTypes.number.isRequired,
};
