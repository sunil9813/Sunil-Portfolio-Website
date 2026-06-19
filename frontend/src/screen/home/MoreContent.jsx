import { HeadingThree, InputLabel } from "@/components/customeUI/Title";
import React from "react";
import { FaRegHandPointRight, FaRegLightbulb } from "react-icons/fa";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { IoSpeedometerOutline } from "react-icons/io5";
import { MdOutlineCreditScore } from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";
import { GrUser } from "react-icons/gr";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const MoreContent = () => {
  const [activeCard, setActiveCard] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile/tablet
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Adjust breakpoint as needed
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const handleCardInteraction = (cardId) => {
    setActiveCard(cardId);
  };

  return (
    <section className="py-10">
      <div className="container text-center">
        <div className="flexC">
          <span className="text-xl md:text-3xl lg:text-6xl font-semibold line-through opacity-50">One</span>
          <h1 className="text-xl md:text-3xl lg:text-6xl font-semibold blog-detail-title">&nbsp;a few more things.</h1>
        </div>
        <p>Explore a set of advanced utilities and features designed to streamline development, optimize performance, and elevate your workflow.</p>

        <div className="content flex flex-wrap mt-10 gap-4 justify-center">
          {cardData.map((card) => (
            <motion.div
              key={card.id}
              className="hnZxpu relative h-[474px] overflow-hidden cursor-pointer"
              onHoverStart={() => !isMobile && setActiveCard(card.id)}
              onClick={() => isMobile && handleCardInteraction(card.id)}
              initial={{ width: card.id === 1 ? 384 : 100 }}
              animate={{
                width: activeCard === card.id ? 384 : 100,
                transition: {
                  duration: 0.6,
                  ease: [0.34, 1.4, 0.64, 1],
                },
              }}
              whileTap={isMobile ? { scale: 0.98 } : {}}
            >
              <motion.div
                className="isiSZ absolute top-0 h-[474px]"
                animate={{
                  scale: activeCard === card.id ? 1 : 1.2,
                  transition: { duration: 0.6 },
                }}
              >
                <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                className="iLpqQ absolute"
                initial={{ left: 62, top: 42 }}
                animate={{
                  left: activeCard === card.id ? 62 : 62,
                  opacity: activeCard === card.id ? 1 : 0.7,
                  transition: { duration: 0.3 },
                }}
              >
                <HeadingThree>{card.title}</HeadingThree>
              </motion.div>

              <AnimatePresence>
                {activeCard === card.id && (
                  <motion.div
                    className="w-full h-full flex flex-col text-left justify-end relative z-20 p-8 pb-12"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{card.content}</p>
                    <div className="flex items-center gap-2 mt-3">
                      {card.icon}
                      <InputLabel>{card.label}</InputLabel>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const cardData = [
  {
    id: 1,
    // image: "../image/home/m1.jpg",
    image: "../image/home/m1.jpg",
    title: "Do the right thing",
    content:
      "I believe in building with integrity — designing secure, accessible, and performance-focused solutions that make a difference, whether for one person or an entire product used at scale.",
    icon: <MdOutlineCreditScore size={20} />,
    label: "Every feature built with purpose.",
  },
  {
    id: 2,
    image: "../image/home/m2.jpg",
    title: "Be curious",
    content:
      "Curiosity leads every decision I make — from choosing frameworks to testing new design patterns. I stay committed to learning, improving, and delivering better solutions with every project.",
    icon: <FaRegCircleQuestion size={20} />,
    label: "Questions that lead to better answers.",
  },
  {
    id: 3,
    image: "../image/home/m3.jpg",
    title: "Think Smart",
    content:
      "I approach challenges with efficiency in mind — choosing the right tools, simplifying logic, and writing code that balances performance, clarity, and future scalability across every project.",
    icon: <FaRegLightbulb size={20} />,
    label: "Logic. thinking. Smart.",
  },
  {
    id: 4,
    image: "../image/home/m4.jpg",
    title: "Grow Together",
    content:
      "Collaboration fuels innovation. I value open communication, shared knowledge, and teamwork to build stronger projects that grow with input from all stakeholders and deliver lasting impact.",
    icon: <TbUsersGroup size={20} />,
    label: "Teamwork that drives lasting success.",
  },
  {
    id: 5,
    image: "../image/home/m5.jpg",
    title: "Act Fast",
    content:
      "Speed matters in development. I deliver timely solutions without sacrificing quality, ensuring quick iterations, fast feedback, and the ability to adapt rapidly to changing project needs.",
    icon: <IoSpeedometerOutline size={20} />,
    label: "Rapid delivery with consistent quality.",
  },
  {
    id: 6,
    image: "../image/home/m6.jpg",
    title: "Customer First",
    content:
      "Understanding client needs drives every decision I make. I focus on delivering tailored solutions that exceed expectations, ensuring satisfaction, clear communication, and long-term success for every project.",
    icon: <GrUser size={20} />,
    label: "Client satisfaction guides all my work.",
  },
  {
    id: 7,
    image: "../image/home/m7.jpg",
    title: "Be You",
    content:
      "Authenticity matters. I bring my unique perspective and creativity to every project, encouraging innovation and honest collaboration to create solutions that truly reflect your vision and goals.",
    icon: <FaRegHandPointRight size={20} />,
    label: "Originality that drives real innovation.",
  },
];
