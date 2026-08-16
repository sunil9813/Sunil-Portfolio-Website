import { HeadingThree } from "@/components/customeUI/Title";
import { Pagination } from "@/components/Pagination";
import { getAllTestimonial } from "@/redux/slices/portfolio/testimonialSlice";
import { useEffect, useState } from "react";
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io";
import MasonryLayout from "react-layout-masonry";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";

const getAssetUrl = (asset) => {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  return asset.filePath || asset.url || "";
};

const getInitials = (name = "") =>
  String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("") || "U";

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const RatingStars = ({ rating = 0 }) => {
  const normalizedRating = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div className="flex items-center mt-2 text-xl gap-1 text-yellow-500 mb-6">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;

        if (normalizedRating >= starValue) {
          return <IoMdStar key={starValue} />;
        }

        if (normalizedRating >= starValue - 0.5) {
          return <IoMdStarHalf key={starValue} />;
        }

        return <IoMdStarOutline key={starValue} />;
      })}
    </div>
  );
};

export const Testimonials = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { testimonials, isLoading } = useSelector((state) => state.testimonial);
  const { testimonialList = [] } = testimonials || {};

  useEffect(() => {
    dispatch(getAllTestimonial());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [testimonialList.length]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = testimonialList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(testimonialList.length / itemsPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="">
        <div className="container">
          <div className="relative z-10">
            {isLoading ? (
              <MasonryLayout columns={{ 640: 1, 768: 2, 1024: 3, 1280: 3 }} gap={10}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="relative rounded-2xl black-custome-box p-3">
                    <div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />
                  </div>
                ))}
              </MasonryLayout>
            ) : currentItems.length > 0 ? (
              <MasonryLayout columns={{ 640: 1, 768: 2, 1024: 3, 1280: 3 }} gap={10}>
                {currentItems.map((item) => {
                  const avatarUrl = getAssetUrl(item?.avatar) || getAssetUrl(item?.user?.avatar);
                  const name = item?.fullname || item?.user?.name || "User";
                  const position = [item?.position, item?.company].filter(Boolean).join(" at ") || item?.location || "";

                  return (
                    <div key={item._id} className="relative rounded-2xl black-custome-box p-3">
                      <div className=" absolute top-0 left-0 -z-10">
                        <img src="../image/tesbg.avif" alt="tesbg" className=" invert opacity-10" />
                      </div>
                      <blockquote>
                        <div aria-hidden="true" className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"></div>
                        <div className="flex flex-col gap-6">
                          <div className="avatar size-14 rounded-full">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center rounded-full bg-white/[0.06] text-sm font-semibold text-white/70">{getInitials(name)}</span>
                            )}
                          </div>
                          <div className="">
                            <HeadingThree>{name}</HeadingThree>
                            {position && <span className="text-sm leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">{position}</span>}
                          </div>
                        </div>
                        <p className="relative z-20 text-sm leading-[1.6] font-normal text-neutral-800 dark:text-gray-100 mt-5">"{stripHtml(item.content)}"</p>
                        <RatingStars rating={item.rating} />
                        {item?.link && (
                          <NavLink className="flex items-center gap-2 mt-2" to={item.link} target="_blank">
                            <span className="text-sm leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">Website</span>
                          </NavLink>
                        )}
                      </blockquote>
                    </div>
                  );
                })}
              </MasonryLayout>
            ) : (
              <div className="relative rounded-2xl black-custome-box p-8 text-center">
                <HeadingThree>No testimonials found</HeadingThree>
                <p className="mt-3 text-sm leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">Customer feedback from backend will show here.</p>
              </div>
            )}
          </div>
          <div className="flexC mt-10">{testimonialList.length > itemsPerPage && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}</div>
        </div>
      </section>
    </>
  );
};
