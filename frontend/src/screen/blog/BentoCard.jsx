import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { truncateText } from "@/utils";
import { useEffect } from "react";
import { HeadingOne, InputLabel } from "@/components/customeUI/Title";
import { DateFormatter } from "@/components/DateFormatter";
import { MainButton } from "@/components/customeUI/Button";

function generateItemColor() {
  // Generate two random hex colors
  const randomColor = () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0.5");

  const color1 = randomColor();
  const color2 = randomColor();

  // Create a random angle for the gradient
  const angle = Math.floor(Math.random() * 360);

  // Return the CSS linear-gradient string
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

export const BentoCard = ({ blogs }) => {
  const paddedBlogs = [...(blogs || []), ...Array(19 - (blogs?.length || 0)).fill(null)];

  useEffect(() => {
    // Mouse move effect for cards
    const handleCardMouseMove = (e) => {
      for (const card of document.getElementsByClassName("card")) {
        const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    const cardsContainer = document.getElementById("cards");
    if (cardsContainer) {
      cardsContainer.addEventListener("mousemove", handleCardMouseMove);
    }

    return () => {
      // Cleanup event listeners
      if (cardsContainer) {
        cardsContainer.removeEventListener("mousemove", handleCardMouseMove);
      }
    };
  }, []);

  return (
    <section className="blog-card-list">
      <div id="cards" className="cards">
        {/* first row */}
        <div className="card h-80">
          <div className="card__background">
            <div className="card__background-glow"></div>
          </div>
          <div className="card__glow"></div>
          <div className="card__content flex h-full gap-4">
            {/* enter card value here  */}
            {paddedBlogs[0] && (
              <>
                <div className="relative w-1/3 rounded-[20px] flexC">
                  <img src={paddedBlogs[0].cover?.filePath} alt={paddedBlogs[0].publicId} className="w-full h-full rounded-xl object-cover" />
                </div>
                <div className="description p-5 w-2/3 relative z-10">
                  <div className="img absolute top-0 right-0">
                    <img src="https://framerusercontent.com/images/J9XdFK7nV6w8YBxC4CINwqPNGE.svg" alt="" />
                  </div>
                  <button className="relative h-10 rounded-full overflow-hidden mb-4 block">
                    <div className="bg absolute top-0 left-0 w-12 h-5 blur-lg " style={{ background: generateItemColor(paddedBlogs[0].category?.title) }}></div>
                    <span className="px-8 py-4 rounded-full relative bg-slate-700/30 mix-blend-overlay backdrop-blur-3xl z-20 uppercase textColor">{paddedBlogs[0].category?.title}</span>
                  </button>

                  <HeadingOne> {truncateText(paddedBlogs[0]?.title, 90)} </HeadingOne>
                  <InputLabel className="text-m !text-gray-400 py-2"> {paddedBlogs[0]?.metaDescription}</InputLabel>

                  <InputLabel className="!text-gray-500 py-1">
                    <span>Published In </span>
                    <DateFormatter date={paddedBlogs[0]?.createdAt} />
                  </InputLabel>
                  <NavLink to={`/view-blog/${paddedBlogs[0]?.slug}`} className="mt-2 block w-40">
                    <MainButton>Read More</MainButton>
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </div>
        {/* second row */}
        <div className="grid grid-cols-3 gap-4 my-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="card">
              <div className="card__background">
                <div className="card__background-glow"></div>
              </div>
              <div className="card__glow"></div>
              <div className="card__content">
                {paddedBlogs[index] && (
                  <div className="bento-card-first flex flex-col h-full">
                    <div className="relative w-full h-56 rounded-[20px] overflow-hidden mb-4">
                      <img src={paddedBlogs[index].cover?.filePath} alt={paddedBlogs[index].publicId} className="w-full h-full object-cover" />
                    </div>
                    <div className="description p-4 flex-1 flex flex-col">
                      <button className="relative h-8 rounded-full overflow-hidden mb-3 w-fit">
                        <div className="bg absolute top-0 left-0 w-12 h-5 blur-lg" style={{ background: generateItemColor(paddedBlogs[index].category?.title) }}></div>
                        <span className="px-6 py-2 rounded-full relative bg-slate-700/30 mix-blend-overlay backdrop-blur-3xl z-20 uppercase text-sm textColor">
                          {paddedBlogs[index].category?.title}
                        </span>
                      </button>
                      <HeadingOne className="text-xl">{truncateText(paddedBlogs[index]?.title, 60)}</HeadingOne>
                      <InputLabel className="text-sm !text-gray-400 py-2 flex-1">{truncateText(paddedBlogs[index]?.metaDescription, 100)}</InputLabel>
                      <NavLink to={`/view-blog/${paddedBlogs[index]?.slug}`} className="mt-2 w-fit">
                        <MainButton size="sm">Read More</MainButton>
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* thrid row */}
        <div className="flex justify-between gap-4 ">
          <div className="card w-1/2">
            <div className="card__background">
              <div className="card__background-glow"></div>
            </div>
            <div className="card__glow"></div>
            <div className="card__content">
              <div className="bento-card-first flex gap-4">
                <div className="img absolute top-0 right-0">
                  <img src="https://framerusercontent.com/images/J9XdFK7nV6w8YBxC4CINwqPNGE.svg" alt="" />
                </div>
                {/* enter card value here  */}
                {paddedBlogs[4] && (
                  <>
                    <div className="relative w-[40%] rounded-[20px] flexC">
                      <img src={paddedBlogs[4].cover?.filePath} alt={paddedBlogs[4].publicId} className="w-full h-full rounded-xl object-cover" />
                    </div>
                    <div className="description p-5 w-[60%] relative z-10">
                      <button className="relative h-10 rounded-full overflow-hidden mb-4">
                        <div className="bg absolute top-0 left-0 w-12 h-5 blur-lg " style={{ background: generateItemColor(paddedBlogs[4].category?.title) }}></div>
                        <span className="px-8 py-4 rounded-full relative bg-slate-700/30 mix-blend-overlay backdrop-blur-3xl z-20 uppercase textColor">{paddedBlogs[4].category?.title}</span>
                      </button>

                      <HeadingOne className="text-xl"> {truncateText(paddedBlogs[4]?.title, 50)} </HeadingOne>
                      <InputLabel className="text-m !text-gray-400 py-2"> {truncateText(paddedBlogs[4]?.metaDescription, 50)}</InputLabel>

                      <InputLabel className="!text-gray-500 py-1">
                        <span>Published In </span>
                        <DateFormatter date={paddedBlogs[4]?.createdAt} />
                      </InputLabel>
                      <NavLink to={`/view-blog/${paddedBlogs[4]?.slug}`} className="mt-2 block w-40">
                        <MainButton>Read More</MainButton>
                      </NavLink>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="card w-1/2">
            <div className="card__background">
              <div className="card__background-glow"></div>
            </div>
            <div className="card__glow"></div>
            <div className="card__content">
              <div className="bento-card-first flex gap-4">
                <div className="img absolute top-0 right-0">
                  <img src="https://framerusercontent.com/images/J9XdFK7nV6w8YBxC4CINwqPNGE.svg" alt="" />
                </div>
                {/* enter card value here  */}
                {paddedBlogs[5] && (
                  <>
                    <div className="relative w-[40%] rounded-[20px] flexC">
                      <img src={paddedBlogs[5].cover?.filePath} alt={paddedBlogs[5].publicId} className="w-full h-full rounded-xl object-cover" />
                    </div>
                    <div className="description p-5 w-[60%] relative z-10">
                      <button className="relative h-10 rounded-full overflow-hidden mb-4">
                        <div className="bg absolute top-0 left-0 w-12 h-5 blur-lg " style={{ background: generateItemColor(paddedBlogs[5].category?.title) }}></div>
                        <span className="px-8 py-4 rounded-full relative bg-slate-700/30 mix-blend-overlay backdrop-blur-3xl z-20 uppercase textColor">{paddedBlogs[5].category?.title}</span>
                      </button>

                      <HeadingOne className="text-xl"> {truncateText(paddedBlogs[5]?.title, 50)} </HeadingOne>
                      <InputLabel className="text-m !text-gray-400 py-2"> {truncateText(paddedBlogs[5]?.metaDescription, 50)}</InputLabel>

                      <InputLabel className="!text-gray-500 py-1">
                        <span>Published In </span>
                        <DateFormatter date={paddedBlogs[5]?.createdAt} />
                      </InputLabel>
                      <NavLink to={`/view-blog/${paddedBlogs[5]?.slug}`} className="mt-2 block w-40">
                        <MainButton>Read More</MainButton>
                      </NavLink>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* fourth row */}
        <div className="grid grid-cols-3 gap-4 my-4">
          {[6, 7, 8].map((index) => (
            <div key={index} className="card">
              <div className="card__background">
                <div className="card__background-glow"></div>
              </div>
              <div className="card__glow"></div>
              <div className="card__content">
                {paddedBlogs[index] && (
                  <div className={`bento-card-first flex flex-col h-full ${index % 7 !== 0 ? "flex-col-reverse" : ""}`}>
                    {/* Image container - will appear at bottom for reversed cards */}
                    <div className={`relative w-full h-56 rounded-[20px] overflow-hidden ${index % 7 !== 0 ? "mb-0 mt-4" : "mb-4"}`}>
                      <img src={paddedBlogs[index].cover?.filePath} alt={paddedBlogs[index].publicId} className="w-full h-full object-cover" />
                    </div>
                    <div className="description p-4 flex-1 flex flex-col">
                      <button className="relative h-8 rounded-full overflow-hidden mb-3 w-fit">
                        <div className="bg absolute top-0 left-0 w-12 h-5 blur-lg" style={{ background: generateItemColor(paddedBlogs[index].category?.title) }}></div>
                        <span className="px-6 py-2 rounded-full relative bg-slate-700/30 mix-blend-overlay backdrop-blur-3xl z-20 uppercase text-sm textColor">
                          {paddedBlogs[index].category?.title}
                        </span>
                      </button>
                      <HeadingOne className="text-xl">{truncateText(paddedBlogs[index]?.title, 60)}</HeadingOne>
                      <InputLabel className="text-sm !text-gray-400 py-2 flex-1">{truncateText(paddedBlogs[index]?.metaDescription, 100)}</InputLabel>
                      <NavLink to={`/view-blog/${paddedBlogs[index]?.slug}`} className="mt-2 w-fit">
                        <MainButton size="sm">Read More</MainButton>
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* fifth row */}
        <div className="card h-80 mb-20">
          <div className="card__background">
            <div className="card__background-glow"></div>
          </div>
          <div className="card__glow"></div>
          {paddedBlogs[9] && (
            <div className="card__content h-full">
              <div className="flex h-full gap-4 flex-row-reverse">
                {/* Image container with fixed aspect ratio */}
                <div className="w-1/3 h-full overflow-hidden rounded-[20px] relative">
                  <img src={paddedBlogs[9].cover?.filePath} alt={paddedBlogs[9].publicId} className="absolute inset-0 w-full h-full object-cover rounded-[20px]" loading="lazy" />
                </div>

                {/* Content container */}
                <div className="description p-5 w-2/3 relative z-10 flex flex-col">
                  <div className="img absolute top-0 right-0">
                    <img src="https://framerusercontent.com/images/J9XdFK7nV6w8YBxC4CINwqPNGE.svg" alt="" className="h-16 w-auto" />
                  </div>

                  <button className="relative h-10 rounded-full overflow-hidden mb-4 block w-fit">
                    <div className="bg absolute top-0 left-0 w-12 h-5 blur-lg" style={{ background: generateItemColor(paddedBlogs[9].category?.title) }}></div>
                    <span className="px-8 py-4 rounded-full relative bg-slate-700/30 mix-blend-overlay backdrop-blur-3xl z-20 uppercase textColor">{paddedBlogs[9].category?.title}</span>
                  </button>

                  <HeadingOne className="flex-1">{truncateText(paddedBlogs[9]?.title, 90)}</HeadingOne>

                  <InputLabel className="text-m !text-gray-400 py-2">{paddedBlogs[9]?.metaDescription}</InputLabel>

                  <InputLabel className="!text-gray-500 py-1">
                    <span>Published In </span>
                    <DateFormatter date={paddedBlogs[9]?.createdAt} />
                  </InputLabel>

                  <NavLink to={`/view-blog/${paddedBlogs[9]?.slug}`} className="mt-2 block w-40">
                    <MainButton>Read More</MainButton>
                  </NavLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

BentoCard.propTypes = {
  blogs: PropTypes.any,
};
