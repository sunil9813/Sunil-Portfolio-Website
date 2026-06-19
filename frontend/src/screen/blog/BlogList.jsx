import { getallBlog } from "@/redux/slices/blogSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BlogListCard } from "./BlogListCard";
import { Pagination } from "@/components/Pagination";

export const BlogList = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  const { blogs } = useSelector((state) => state.blog);
  const { BlogList, total } = blogs;

  useEffect(() => {
    dispatch(getallBlog());
  }, [dispatch]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = BlogList?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil(BlogList?.length / itemsPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <div className="background">
        {/* top line */}
        <div className="bg absolute top-0 left-0 z-10">
          <img src="../image/bg/hero-background-top.png" alt="bg" className="h-32 object-cover md:object-cover md:h-44 lg:object-cover lg:h-auto" />
        </div>
        {/* top background light */}
        <div className="bg absolute -top-24 md:-top-44 lg:-top-72 left-0 blur-xl">
          <img src="../image/hero-background-lights.png" alt="lights" />
        </div>
      </div>
      {/* <img src="https://wope.com/images/hero/hero-background-bottom.png,"alt=","/> */}
      {/* <img src="https://wope.com/images/hero/hero-background-bottom.png,"alt=","/> */}
      {/*  <div className="">
        <CenteredLightRays />
      </div> */}
      {/*   <div className="w-full absolute -top-[25%] left-[0%]">
        <img src="https://www.swippr.io/assets/glowing-cone-background-6b813097.png" alt="" className="w-full h-full" />
      </div> */}

      {/* horizantle line */}
      <div className="top-20 md:w-full md:h-[50vh] absolute md:top-0 lg:top-40 left-[0%] overflow-hidden z-20">
        <img src="../image/bg/horzantal-line.svg" alt="bg" className="w-full h-full object-contain" />
      </div>
      <section className="blogs relative z-30">
        {/* <DotBackground /> */}

        <div className="container">
          {/* first box background */}
          <div className="bg absolute top-44 md:top-32 lg:top-20 left-0 -z-10 px-28 blur-lg">
            <img src="../image/hero-background-lights.png" alt="lights" />
          </div>
          <div className="heading w-full lg:w-2/3 m-auto text-center mt-10 lg:mt-32 mb-10">
            <h1 className="text-xl md:text-2xl lg:text-6xl font-semibold gardient-text blog-title"> Community Driven & Casual</h1>
            <h2 className="text-lg md:text-xl lg:text-2xl textColor font-medium mt-4 heading-gardient">Browse {total} Curated Blogs Spanning Technology, Creativity, and Everyday Curiosity.</h2>
            <p className="label-shine mt-3">Join 925,459 Readers Learning, Sharing, and Growing Together.</p>
          </div>

          <BlogListCard rowData={currentItems} />

          <div className="flexC pb-20">{BlogList?.length > itemsPerPage && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}</div>
        </div>
      </section>
    </>
  );
};

export const CenteredLightRays = () => {
  // Ray configuration with centered origin
  const rays = [
    { id: 1, opacity: 0.15, scale: 0.7, rotate: 0, width: "60%" },
    { id: 2, opacity: 0.25, scale: 0.9, rotate: 25, width: "90%" },
    { id: 3, opacity: 0.36, scale: 0.74, rotate: 11, width: "85%" },
    { id: 4, opacity: 1, scale: 1, rotate: -12, width: "100%" },
    { id: 5, opacity: 1, scale: 1, rotate: -24, width: "100%" },
    { id: 6, opacity: 0.16, scale: 0.67, rotate: -18, width: "75%" },
    { id: 7, opacity: 0.16, scale: 0.68, rotate: -18, width: "76%" },
    { id: 8, opacity: 0.16, scale: 0.68, rotate: -18, width: "76%" },
    { id: 9, opacity: 0.19, scale: 0.74, rotate: -5, width: "82%" },
    { id: 10, opacity: 0.19, scale: 0.75, rotate: -5, width: "83%" },
    { id: 11, opacity: 0.66, scale: 0.76, rotate: -5, width: "84%" },
    { id: 12, opacity: 1, scale: 1, rotate: -3, width: "100%" },
    { id: 13, opacity: 1, scale: 1, rotate: 18, width: "100%" },
    { id: 14, opacity: 1, scale: 1, rotate: 6, width: "100%" },
  ];

  return (
    <div className="light-rays-container">
      <div className="rays-blur">
        {rays.map((ray) => (
          <div
            key={ray.id}
            className="ray"
            style={{
              opacity: ray.opacity,
              transform: `scale(${ray.scale}) rotate(${ray.rotate}deg)`,
              width: ray.width,
              left: "-30%",
              top: "-90%",
            }}
          />
        ))}
        <div className="light-source" />
      </div>
    </div>
  );
};
