import { HeadingThree } from "@/components/customeUI/Title";
import { Pagination } from "@/components/Pagination";
import { getAllTestimonial } from "@/redux/slices/portfolio/testimonialSlice";
import React, { useEffect, useState } from "react";
import { IoMdStar, IoMdStarHalf } from "react-icons/io";
import MasonryLayout from "react-layout-masonry";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";

export const Testimonials = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  const { testimonials } = useSelector((state) => state.testimonial);
  const { testimonialList } = testimonials;

  useEffect(() => {
    dispatch(getAllTestimonial());
  }, [dispatch]);

  // Array of possible words/phrases for random text generation
  const randomWords = [
    "Excellent",
    "Great",
    "Amazing",
    "Wonderful",
    "Fantastic",
    "Impressive",
    "Outstanding",
    "Superb",
    "Terrific",
    "Phenomenal",
    "service",
    "product",
    "experience",
    "support",
    "team",
    "highly recommend",
    "would use again",
    "exceeded expectations",
    "top quality",
    "professional",
    "friendly",
    "responsive",
    "satisfied",
    "happy",
    "pleased",
    "delighted",
    "content",
    "solution",
    "work",
    "delivery",
    "communication",
    "results",
  ];

  // Generate random text
  const generateRandomText = () => {
    const sentenceCount = Math.floor(Math.random() * 3) + 2; // 2-4 sentences
    let text = "";

    for (let i = 0; i < sentenceCount; i++) {
      const wordCount = Math.floor(Math.random() * 10) + 5; // 5-15 words per sentence
      let sentence = "";

      for (let j = 0; j < wordCount; j++) {
        const randomIndex = Math.floor(Math.random() * randomWords.length);
        sentence += randomWords[randomIndex] + " ";
      }

      text += sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + ". ";
    }

    return text.trim();
  };

  const dummyData = [];

  for (let id = 1; id <= 20; id++) {
    const name = `User ${Math.floor(Math.random() * 1000)}`; // Random user ID
    const description = generateRandomText();
    const positions = ["Manager", "Director", "CEO", "Founder", "Developer", "Designer"];
    const position = positions[Math.floor(Math.random() * positions.length)];

    dummyData.push({
      id,
      name,
      description,
      position,
    });
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = testimonialList?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil(testimonialList?.length / itemsPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="">
        <div className="container">
          <div className="relative z-10">
            <MasonryLayout columns={{ 640: 1, 768: 2, 1024: 3, 1280: 3 }} gap={10}>
              {currentItems.map((item) => {
                return (
                  <div key={item._id} className="relative rounded-2xl black-custome-box p-3">
                    <div className=" absolute top-0 left-0 -z-10">
                      <img src="../image/tesbg.avif" alt="tesbg" className=" invert opacity-10" />
                    </div>
                    <blockquote>
                      <div aria-hidden="true" className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"></div>
                      <div className="flex flex-col gap-6">
                        <div className="avatar size-14 rounded-full">
                          <img src={item?.avatar?.filePath} alt={item?.avatar?.publicId} className="w-full h-full rounded-full" />
                        </div>
                        <div className="">
                          <HeadingThree>{item.fullname}</HeadingThree>
                          <span className="text-sm leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">{item.position}</span>
                        </div>
                      </div>
                      <p className="relative z-20 text-sm leading-[1.6] font-normal text-neutral-800 dark:text-gray-100 mt-5">"{item.content}"</p>
                      <div className="flex items-center mt-2 text-xl gap-1 text-yellow-500 mb-6">
                        <IoMdStar />
                        <IoMdStar />
                        <IoMdStar />
                        <IoMdStarHalf />
                        <IoMdStarHalf />
                      </div>
                      <NavLink className="flex items-center gap-2 mt-2" to={item?.link} target="_blank">
                        <div className="avatar size-8 rounded-full">
                          <img src="https://images.ui8.net/uploads/softselect_wrappixel_logo_560x560_1722510701565.jpg" alt="" className="w-full h-full rounded-full" />
                        </div>
                        <span className="text-sm leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">Website</span>
                      </NavLink>
                    </blockquote>
                  </div>
                );
              })}
            </MasonryLayout>
          </div>
          <div className="flexC mt-10">{testimonialList?.length > itemsPerPage && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}</div>
        </div>
      </section>
    </>
  );
};
