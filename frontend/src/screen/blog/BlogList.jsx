import { GlowingButton } from "@/components/customeUI/Button";
import { DotBackground } from "@/components/customeUI/DotBackground";
import { getallBlog } from "@/redux/slices/blogSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BlogListCard } from "./BlogListCard";

export const BlogList = () => {
  const dispatch = useDispatch();

  const { blogs } = useSelector((state) => state.blog);
  const { BlogList } = blogs;

  useEffect(() => {
    dispatch(getallBlog());
  }, [dispatch]);
  return (
    <>
      <div className="">
        <CenteredLightRays />
      </div>
      <div className="w-full h-[50vh] absolute top-0 left-[0%] overflow-hidden z-20">
        <img src="https://framerusercontent.com/images/aoiBsSjmul53SaXnpTcQ1QzxGc.svg" alt="bg" className="w-full h-full object-contain" />
      </div>
      <section className="blogs relative z-30">
        <DotBackground />

        <div className="container">
          <div className="heading w-2/3 m-auto text-center mt-32 mb-10">
            <h1 className="text-6xl font-semibold gardient-text blog-title"> Community Driven & Casual</h1>
            <h2 className="text-2xl textColor font-medium mt-4 heading-gardient">Browse 10,990 Curated Blogs Spanning Technology, Creativity, and Everyday Curiosity.</h2>
            <p className="label-shine mt-3">Join 925,459 Readers Learning, Sharing, and Growing Together.</p>
          </div>

          <BlogListCard rowData={BlogList} />
        </div>
      </section>
    </>
  );
};

const CenteredLightRays = () => {
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
