import { truncateText } from "@/utils";
import { Chip } from "@material-tailwind/react";
import { AiFillLike } from "react-icons/ai";
import { FaComments, FaUser } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

export const BentoCard = ({ blogs }) => {
  // Ensure we have enough blogs, fill with null if needed
  const paddedBlogs = [...(blogs || []), ...Array(19 - (blogs?.length || 0)).fill(null)];

  return (
    <section className="flex flex-col gap-3 mb-6 bento-cards">
      {/* Row 1 */}
      <div className="bento-cards_row-first flex w-full justify-between gap-3">
        <div className="bento-cards_card cardItem w-3/12 flex flex-col-reverse rounded-xl">
          {paddedBlogs[0] && (
            <>
              <div className="image h-56 rounded-xl relative">
                <img src={paddedBlogs[0].cover?.filePath} alt={paddedBlogs[0].publicId} className="w-full h-full rounded-xl object-cover" />
                <div className="absolute bottom-0 left-0 m-3">
                  <Chip value={paddedBlogs[0].category?.title} color="indigo" className="text-xs rounded-sm shadow-sm" />
                </div>
              </div>
              <div className="description p-3 h-auto">
                <p className="text-[16px] textColor font-semibold"> {truncateText(paddedBlogs[0]?.title, 27)}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 py-1">{truncateText(paddedBlogs[0]?.metaDescription, 95)}</p>

                <div className="flex items-center gap-2 py-2">
                  <div className="flex items-center gap-2 capitalize text-gray-400">
                    <FaUser size={12} />
                    <span className="text-xs">{paddedBlogs[0]?.user?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 capitalize text-gray-400">
                    <IoEye />
                    <span className="text-xs">{paddedBlogs[0]?.numOfViews?.length === 0 ? "0" : paddedBlogs[0]?.numOfViews}</span>
                  </div>
                  <div className="flex items-center gap-2 capitalize text-gray-400">
                    <AiFillLike />
                    <span className="text-xs">{paddedBlogs[0]?.likes?.length === 0 ? "0" : paddedBlogs[0]?.likes?.length}</span>
                  </div>
                  <div className="flex items-center gap-2 capitalize text-gray-400">
                    <FaComments />
                    <span className="text-xs">200</span>
                  </div>
                </div>

                <NavLink className="text-xs text-indigo-300 underline" to={`/view-blog/${paddedBlogs[0]?.slug}`}>
                  View Details
                </NavLink>
              </div>
            </>
          )}
        </div>
        <div className="w-1/2 flex gap-3 flex-col">
          <div className="bento-cards_card cardItem w-full rounded-xl max-h-56 flex">
            {paddedBlogs[1] && (
              <>
                <div className="image w-1/2 rounded-xl relative">
                  <img src={paddedBlogs[1].cover?.filePath} alt={paddedBlogs[1].publicId} className="w-full h-full rounded-xl object-cover" />
                  <div className="absolute bottom-0 left-0 m-3">
                    <Chip value={paddedBlogs[0].category?.title} color="indigo" className="text-xs rounded-sm shadow-sm" />
                  </div>
                </div>
                <div className="description p-3 w-1/2">
                  <p className="text-[16px] textColor font-semibold"> {truncateText(paddedBlogs[0]?.title, 27)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 py-1">{truncateText(paddedBlogs[0]?.metaDescription, 95)}</p>

                  <div className="flex items-center gap-2 py-2">
                    <div className="flex items-center gap-2 capitalize text-gray-400">
                      <FaUser size={12} />
                      <span className="text-xs">{paddedBlogs[0]?.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 capitalize text-gray-400">
                      <IoEye />
                      <span className="text-xs">{paddedBlogs[0]?.numOfViews?.length === 0 ? "0" : paddedBlogs[0]?.numOfViews}</span>
                    </div>
                    <div className="flex items-center gap-2 capitalize text-gray-400">
                      <AiFillLike />
                      <span className="text-xs">{paddedBlogs[0]?.likes?.length === 0 ? "0" : paddedBlogs[0]?.likes?.length}</span>
                    </div>
                    <div className="flex items-center gap-2 capitalize text-gray-400">
                      <FaComments />
                      <span className="text-xs">200</span>
                    </div>
                  </div>

                  <NavLink className="text-xs text-indigo-300 underline" to={`/view-blog/${paddedBlogs[0]?.slug}`}>
                    View Details
                  </NavLink>
                </div>
              </>
            )}
          </div>
          <div className="bento-cards_card cardItem w-full rounded-xl max-h-56 flex flex-row-reverse">
            {paddedBlogs[2] && (
              <>
                <div className="image w-1/2 rounded-xl relative">
                  <img src={paddedBlogs[2].cover?.filePath} alt={paddedBlogs[2].publicId} className="w-full h-full rounded-xl object-cover" />
                  <div className="absolute bottom-0 left-0 m-3">
                    <Chip value={paddedBlogs[0].category?.title} color="indigo" className="text-xs rounded-sm shadow-sm" />
                  </div>
                </div>
                <div className="description p-3 w-1/2">
                  <p className="text-[16px] textColor font-semibold"> {truncateText(paddedBlogs[0]?.title, 27)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 py-1">{truncateText(paddedBlogs[0]?.metaDescription, 95)}</p>

                  <div className="flex items-center gap-2 py-2">
                    <div className="flex items-center gap-2 capitalize text-gray-400">
                      <FaUser size={12} />
                      <span className="text-xs">{paddedBlogs[0]?.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 capitalize text-gray-400">
                      <IoEye />
                      <span className="text-xs">{paddedBlogs[0]?.numOfViews?.length === 0 ? "0" : paddedBlogs[0]?.numOfViews}</span>
                    </div>
                    <div className="flex items-center gap-2 capitalize text-gray-400">
                      <AiFillLike />
                      <span className="text-xs">{paddedBlogs[0]?.likes?.length === 0 ? "0" : paddedBlogs[0]?.likes?.length}</span>
                    </div>
                    <div className="flex items-center gap-2 capitalize text-gray-400">
                      <FaComments />
                      <span className="text-xs">200</span>
                    </div>
                  </div>

                  <NavLink className="text-xs text-indigo-300 underline" to={`/view-blog/${paddedBlogs[0]?.slug}`}>
                    View Details
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="bento-cards_card cardItem w-3/12 rounded-xl">
          {paddedBlogs[3] && (
            <>
              <div className="image h-56 rounded-xl relative">
                <img src={paddedBlogs[3].cover?.filePath} alt={paddedBlogs[3].publicId} className="w-full h-full rounded-xl object-cover" />
                <div className="absolute bottom-0 left-0 m-3">
                  <Chip value={paddedBlogs[0].category?.title} color="indigo" className="text-xs rounded-sm shadow-sm" />
                </div>
              </div>
              <div className="description p-3 h-auto">
                <p className="text-[16px] textColor font-semibold"> {truncateText(paddedBlogs[0]?.title, 27)}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 py-1">{truncateText(paddedBlogs[0]?.metaDescription, 95)}</p>

                <div className="flex items-center gap-2 py-2">
                  <div className="flex items-center gap-2 capitalize text-gray-400">
                    <FaUser size={12} />
                    <span className="text-xs">{paddedBlogs[0]?.user?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 capitalize text-gray-400">
                    <IoEye />
                    <span className="text-xs">{paddedBlogs[0]?.numOfViews?.length === 0 ? "0" : paddedBlogs[0]?.numOfViews}</span>
                  </div>
                  <div className="flex items-center gap-2 capitalize text-gray-400">
                    <AiFillLike />
                    <span className="text-xs">{paddedBlogs[0]?.likes?.length === 0 ? "0" : paddedBlogs[0]?.likes?.length}</span>
                  </div>
                  <div className="flex items-center gap-2 capitalize text-gray-400">
                    <FaComments />
                    <span className="text-xs">200</span>
                  </div>
                </div>

                <NavLink className="text-xs text-indigo-300 underline" to={`/view-blog/${paddedBlogs[0]?.slug}`}>
                  View Details
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 2 */}
      <div className="bento-cards_row-second flex gap-3 justify-between max-h-56">
        <div className="bento-cards_card w-1/2 cardItem rounded-xl flex">
          {paddedBlogs[4] && (
            <>
              <div className="description p-3 h-auto w-1/2">
                <p>{paddedBlogs[4].title}</p>
                <p>{paddedBlogs[4].view || "View Details"}</p>
                <p>{paddedBlogs[4].category?.title}</p>
                <p>{paddedBlogs[4].more || "More + ..."}</p>
              </div>
              <div className="image h-56 rounded-xl w-1/2">
                <img src={paddedBlogs[4].cover?.filePath} alt={paddedBlogs[4].publicId} className="w-full h-full rounded-xl object-cover" />
              </div>
            </>
          )}
        </div>
        <div className="bento-cards_card w-1/2 cardItem rounded-xl flex">
          {paddedBlogs[5] && (
            <>
              <div className="description p-3 h-auto w-1/2">
                <p>{paddedBlogs[5].title}</p>
                <p>{paddedBlogs[5].view || "View Details"}</p>
                <p>{paddedBlogs[5].category?.title}</p>
                <p>{paddedBlogs[5].more || "More + ..."}</p>
              </div>
              <div className="image h-56 rounded-xl w-1/2">
                <img src={paddedBlogs[5].cover?.filePath} alt={paddedBlogs[5].publicId} className="w-full h-full rounded-xl object-cover" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 3 */}
      <div className="bento-cards_row-third flex w-full justify-between gap-3">
        <div className="bento-cards_card cardItem w-3/12 rounded-xl max-h-60 relative">
          {paddedBlogs[6] && (
            <>
              <div className="image w-full h-full rounded-xl">
                <img src={paddedBlogs[6].cover?.filePath} alt={paddedBlogs[6].publicId} className="w-full h-full rounded-xl object-cover" />
              </div>
              <div className="description p-3 absolute bottom-0 left-0 z-20">
                <p>{paddedBlogs[6].title}</p>
                <p>{paddedBlogs[6].view || "View Details"}</p>
                <p>{paddedBlogs[6].category?.title}</p>
                <p>{paddedBlogs[6].more || "More + ..."}</p>
              </div>
              <div className="absolute bottom-0 w-full h-full z-10 left-0 bg-gradient-to-t from-light-surface2 dark:from-dark-surface2 from-10% via-light-surface2/70 dark:via-dark-surface2/70 via-40% to-transparent to-90%"></div>
            </>
          )}
        </div>
        <div className="bento-cards_card cardItem w-1/2 rounded-xl max-h-60 flex">
          {paddedBlogs[7] && (
            <>
              <div className="image h-full rounded-xl w-1/2">
                <img src={paddedBlogs[7].cover?.filePath} alt={paddedBlogs[7].publicId} className="w-full h-full rounded-xl object-cover" />
              </div>
              <div className="description p-3 h-auto w-1/2">
                <p>{paddedBlogs[7].title}</p>
                <p>{paddedBlogs[7].view || "View Details"}</p>
                <p>{paddedBlogs[7].category?.title}</p>
                <p>{paddedBlogs[7].more || "More + ..."}</p>
              </div>
            </>
          )}
        </div>
        <div className="bento-cards_card cardItem w-3/12 rounded-xl max-h-60 relative">
          {paddedBlogs[8] && (
            <>
              <div className="image w-full h-full rounded-xl">
                <img src={paddedBlogs[8].cover?.filePath} alt={paddedBlogs[8].publicId} className="w-full h-full rounded-xl object-cover" />
              </div>
              <div className="description p-3 absolute top-0 left-0 z-20">
                <p>{paddedBlogs[8].title}</p>
                <p>{paddedBlogs[8].view || "View Details"}</p>
                <p>{paddedBlogs[8].category?.title}</p>
                <p>{paddedBlogs[8].more || "More + ..."}</p>
              </div>
              <div className="absolute bottom-0 w-full h-full z-10 left-0 bg-gradient-to-b from-light-surface2 dark:from-dark-surface2 from-10% via-light-surface2/70 dark:via-dark-surface2/70 via-40% to-transparent to-90%"></div>
            </>
          )}
        </div>
      </div>

      {/* Row 4 */}
      <div className="bento-cards_row-fourth flex gap-3 justify-between">
        <div className="bento-cards_card cardItem w-3/5 rounded-xl max-h-72 flex">
          {paddedBlogs[9] && (
            <>
              <div className="image h-full rounded-xl w-1/2">
                <img src={paddedBlogs[9].cover?.filePath} alt={paddedBlogs[9].publicId} className="w-full h-full rounded-xl object-cover" />
              </div>
              <div className="description p-3 h-auto w-1/2">
                <p>{paddedBlogs[9].title}</p>
                <p>{paddedBlogs[9].view || "View Details"}</p>
                <p>{paddedBlogs[9].category?.title}</p>
                <p>{paddedBlogs[9].more || "More + ..."}</p>
              </div>
            </>
          )}
        </div>
        <div className="bento-cards_card cardItem w-2/5 rounded-xl max-h-72 relative">
          {paddedBlogs[10] && (
            <>
              <div className="image w-full h-full rounded-xl">
                <img src={paddedBlogs[10].cover?.filePath} alt={paddedBlogs[10].publicId} className="w-full h-full rounded-xl object-cover" />
              </div>
              <div className="description p-3 absolute bottom-0 left-0 z-20">
                <p>{paddedBlogs[10].title}</p>
                <p>{paddedBlogs[10].view || "View Details"}</p>
                <p>{paddedBlogs[10].category?.title}</p>
                <p>{paddedBlogs[10].more || "More + ..."}</p>
              </div>
              <div className="absolute bottom-0 w-full h-full z-10 left-0 bg-gradient-to-t from-light-surface2 dark:from-dark-surface2 from-10% via-light-surface2/70 dark:via-dark-surface2/70 via-40% to-transparent to-90%"></div>
            </>
          )}
        </div>
      </div>

      {/* Row 5 */}
      <div className="bento-cards_row-fifth flex gap-3 justify-between">
        <div className="bento-cards_card cardItem rounded-xl h-60 max-h-60 w-full relative">
          {paddedBlogs[11] && (
            <>
              <div className="absolute rounded-xl bottom-0 w-full h-full z-10 left-0 bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500"></div>
              <div className="description p-3 relative z-20">
                <p>{paddedBlogs[11].title}</p>
                <p>{paddedBlogs[11].view || "View Details"}</p>
                <p>{paddedBlogs[11].category?.title}</p>
                <p>{paddedBlogs[11].more || "More + ..."}</p>
              </div>
            </>
          )}
        </div>
        <div className="bento-cards_card cardItem rounded-xl h-60 max-h-60 w-full relative">
          {paddedBlogs[12] && (
            <>
              <div className="absolute rounded-xl bottom-0 w-full h-full z-10 left-0 bg-gradient-to-t from-green-500 via-indigo-500 to-teal-500"></div>
              <div className="description p-3 relative z-20">
                <p>{paddedBlogs[12].title}</p>
                <p>{paddedBlogs[12].view || "View Details"}</p>
                <p>{paddedBlogs[12].category?.title}</p>
                <p>{paddedBlogs[12].more || "More + ..."}</p>
              </div>
            </>
          )}
        </div>
        <div className="bento-cards_card cardItem rounded-xl h-60 max-h-60 w-full relative">
          {paddedBlogs[13] && (
            <>
              <div className="absolute rounded-xl bottom-0 w-full h-full z-10 left-0 bg-gradient-to-t from-blue-500 via-teal-500 to-red-500"></div>
              <div className="description p-3 relative z-20">
                <p>{paddedBlogs[13].title}</p>
                <p>{paddedBlogs[13].view || "View Details"}</p>
                <p>{paddedBlogs[13].category?.title}</p>
                <p>{paddedBlogs[13].more || "More + ..."}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 6 */}
      <div className="bento-cards_row-sixth flex gap-3 justify-between">
        <div className="bento-cards_card cardItem w-2/5 rounded-xl max-h-72 flex">
          {paddedBlogs[14] && (
            <>
              <div className="image w-1/2 rounded-xl">
                <img src={paddedBlogs[14].cover?.filePath} alt={paddedBlogs[14].publicId} className="w-full h-full rounded-xl object-cover" />
              </div>
              <div className="description p-3 w-1/2">
                <p>{paddedBlogs[14].title}</p>
                <p>{paddedBlogs[14].view || "View Details"}</p>
                <p>{paddedBlogs[14].category?.title}</p>
                <p>{paddedBlogs[14].more || "More + ..."}</p>
              </div>
            </>
          )}
        </div>
        <div className="bento-cards_card cardItem w-3/5 rounded-xl max-h-72 flex flex-row-reverse">
          {paddedBlogs[15] && (
            <>
              <div className="image w-1/2 rounded-xl">
                <img src={paddedBlogs[15].cover?.filePath} alt={paddedBlogs[15].publicId} className="w-full h-full rounded-xl object-cover" />
              </div>
              <div className="description p-3 w-1/2">
                <p>{paddedBlogs[15].title}</p>
                <p>{paddedBlogs[15].view || "View Details"}</p>
                <p>{paddedBlogs[15].category?.title}</p>
                <p>{paddedBlogs[15].more || "More + ..."}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 7 */}
      <div className="bento-cards_row-seventh flex gap-3 justify-between">
        <div className="bento-cards_card cardItem rounded-xl max-h-60 w-full">
          {paddedBlogs[16] && <img src={paddedBlogs[16].cover?.filePath} alt={paddedBlogs[16].publicId} className="w-full h-full rounded-xl object-cover" />}
        </div>
        <div className="bento-cards_card cardItem rounded-xl max-h-60 w-full">
          {paddedBlogs[17] && <img src={paddedBlogs[17].cover?.filePath} alt={paddedBlogs[17].publicId} className="w-full h-full rounded-xl object-cover" />}
        </div>
        <div className="bento-cards_card cardItem rounded-xl max-h-60 w-full">
          {paddedBlogs[18] && <img src={paddedBlogs[18].cover?.filePath} alt={paddedBlogs[18].publicId} className="w-full h-full rounded-xl object-cover" />}
        </div>
      </div>
    </section>
  );
};

export const BentoCards = () => {
  const image = "https://www.ryrob.com/wp-content/uploads/2021/11/iStock-496848472-1024x1024.jpg";
  return (
    <section className="flex flex-col gap-3 bento-cards">
      <div className="bento-cards_row-first flex w-full justify-between gap-3">
        <div className="bento-cards_card cardItem w-3/12 flex flex-col-reverse bg-light-highlight dark:bg-dark-highlight rounded-xl">
          <div className="image h-56 rounded-xl">
            <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
          </div>
          <div className="description p-3 h-auto">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
        </div>
        <div className="w-1/2 flex gap-3 flex-col">
          <div className="bento-cards_card cardItem  w-full bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-56 flex">
            <div className="image w-1/2 rounded-xl">
              <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
            </div>
            <div className="description p-3 w-1/2">
              <p>Title</p>
              <p>View</p>
              <p>Catgeory</p>
              <p>More + ...</p>
            </div>
          </div>
          <div className="bento-cards_card cardItem w-full bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-56 flex flex-row-reverse">
            <div className="image w-1/2 rounded-xl">
              <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
            </div>
            <div className="description p-3 w-1/2">
              <p>Title</p>
              <p>View</p>
              <p>Catgeory</p>
              <p>More + ...</p>
            </div>
          </div>
        </div>
        <div className="bento-cards_card cardItem w-3/12 bg-light-highlight dark:bg-dark-highlight rounded-xl">
          <div className="image h-56 rounded-xl">
            <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
          </div>
          <div className="description p-3">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
        </div>
      </div>

      <div className="bento-cards_row-second flex gap-3 justify-between h-56">
        <div className="bento-cards_card w-1/2 cardItem bg-light-highlight dark:bg-dark-highlight rounded-xl flex">
          <div className="description p-3 h-auto w-1/2">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
          <div className="image rounded-xl w-1/2">
            <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
          </div>
        </div>
        <div className="bento-cards_card w-1/2 cardItem bg-light-highlight dark:bg-dark-highlight rounded-xl flex">
          <div className="description p-3 h-auto w-1/2">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
          <div className="image rounded-xl w-1/2">
            <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
          </div>
        </div>
      </div>

      <div className="bento-cards_row-third flex w-full justify-between gap-3">
        <div className="bento-cards_card cardItem w-3/12 bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-60 relative">
          <div className="image w-full h-full rounded-xl">
            <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
          </div>
          <div className="description p-3 absolute bottom-0 left-0 z-20">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
          <div className="absolute bottom-0 w-full h-full z-10 left-0 bg-gradient-to-t from-light-surface2 dark:from-dark-surface2 from-10% via-light-surface2/70 dark:via-dark-surface2/70 via-40% to-transparent to-90%"></div>
        </div>
        <div className="bento-cards_card  cardItem w-1/2 bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-60 flex">
          <div className="image h-full rounded-xl w-1/2">
            <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
          </div>
          <div className="description p-3 h-auto w-1/2">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
        </div>
        <div className="bento-cards_card  cardItem w-3/12 bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-60 relative">
          <div className="image w-full h-full rounded-xl">
            <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
          </div>
          <div className="description p-3 absolute top-0 left-0 z-20">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
          <div className="absolute bottom-0 w-full h-full z-10 left-0 bg-gradient-to-b from-light-surface2 dark:from-dark-surface2 from-10% via-light-surface2/70 dark:via-dark-surface2/70 via-40% to-transparent to-90%"></div>
        </div>
      </div>

      <div className="bento-cards_row-fourth flex gap-3 justify-between">
        <div className="bento-cards_card  cardItem w-3/5 bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-72 flex">
          <div className="image h-full rounded-xl w-1/2">
            <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
          </div>
          <div className="description p-3 h-auto w-1/2">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
        </div>
        <div className="bento-cards_card  cardItem w-2/5 bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-72 relative">
          <div className="image w-full h-full rounded-xl">
            <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
          </div>
          <div className="description p-3 absolute bottom-0 left-0 z-20">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
          <div className="absolute bottom-0 w-full h-full z-10 left-0 bg-gradient-to-t from-light-surface2 dark:from-dark-surface2 from-10% via-light-surface2/70 dark:via-dark-surface2/70 via-40% to-transparent to-90%"></div>
        </div>
      </div>

      <div className="bento-cards_row-fifth flex gap-3 justify-between">
        <div className="bento-cards_card cardItem card1 rounded-xl  h-60  max-h-60 w-full relative">
          <div className="description p-3 relative z-20">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
        </div>
        <div className="bento-cards_card cardItem card2 rounded-xl h-60 max-h-60 w-full relative">
          <div className="description p-3 relative z-20">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
        </div>
        <div className="bento-cards_card cardItem card3 rounded-xl h-60 max-h-60 w-full relative">
          <div className="description p-3 relative z-20">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
        </div>
      </div>

      <div className="bento-cards_row-sixth flex gap-3 justify-between">
        <div className="bento-cards_card cardItem w-2/5 bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-72 flex">
          <div className="image w-1/2 rounded-xl">
            <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
          </div>
          <div className="description p-3 w-1/2">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
        </div>
        <div className="bento-cards_card cardItem w-3/5 bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-72 flex flex-row-reverse">
          <div className="image w-1/2 rounded-xl">
            <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
          </div>
          <div className="description p-3 w-1/2">
            <p>Title</p>
            <p>View</p>
            <p>Catgeory</p>
            <p>More + ...</p>
          </div>
        </div>
      </div>

      <div className="bento-cards_row-seventh flex gap-3 justify-between">
        <div className="bento-cards_card cardItem bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-60 w-full custome-class">
          <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
        </div>
        <div className="bento-cards_card cardItem bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-60 w-full custome-class">
          <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
        </div>
        <div className="bento-cards_card cardItem bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-60 w-full custome-class">
          <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
        </div>
        <div className="bento-cards_card cardItem bg-light-highlight dark:bg-dark-highlight rounded-xl max-h-60 w-full custome-class">
          <img src={image} alt="" className="w-full h-full rounded-xl object-cover" />
        </div>
      </div>
    </section>
  );
};

BentoCard.propTypes = {
  blogs: PropTypes.any,
};
