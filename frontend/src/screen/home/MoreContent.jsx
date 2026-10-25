import { FaRegHandPointRight, FaRegLightbulb } from "react-icons/fa";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { IoSpeedometerOutline } from "react-icons/io5";
import { MdOutlineCreditScore } from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";
import { GrUser } from "react-icons/gr";
import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence, useReducedMotion } from "framer-motion";

export const MoreContent = () => {
  const [activeCard, setActiveCard] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();

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
    <section className="home-more" aria-labelledby="home-more-title">
      <div className="container">
        <div className="home-more__heading">
          <h2 id="home-more-title">A few more things<br /><span>behind the work.</span></h2>
          <p>Seven principles that shape how I think, collaborate, and turn ambitious ideas into dependable digital products.</p>
        </div>

        <div className="content">
          {cardData.map((card, index) => (
            <Motion.div
              key={card.id}
              className={`hnZxpu${activeCard === card.id ? " is-active" : ""}`}
              role="button"
              aria-roledescription="expandable principle"
              aria-controls={`home-more-panel-${card.id}`}
              tabIndex={0}
              aria-label={card.title}
              aria-expanded={activeCard === card.id}
              onFocus={() => setActiveCard(card.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveCard(card.id);
                }
              }}
              onHoverStart={() => !isMobile && setActiveCard(card.id)}
              onClick={() => handleCardInteraction(card.id)}
              initial={false}
              animate={{
                flexGrow: activeCard === card.id ? 4 : 1,
                transition: {
                  duration: reducedMotion ? 0 : 0.55,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              whileTap={isMobile ? { scale: 0.98 } : {}}
            >
              <Motion.div
                className="isiSZ"
                animate={{
                  scale: activeCard === card.id ? 1.015 : 1.12,
                  transition: { duration: reducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] },
                }}
              >
                <img src={card.image} alt="" width="948" height="948" loading="lazy" decoding="async" />
              </Motion.div>

              <span className="home-more__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div className="iLpqQ"><span className="home-more__collapsed-icon" aria-hidden="true">{card.icon}</span><h3>{card.title}</h3></div>

              <AnimatePresence>
                {activeCard === card.id && (
                  <Motion.div
                    id={`home-more-panel-${card.id}`}
                    className="home-more__card-content"
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: reducedMotion ? 0 : 0.34, ease: "easeOut" }}
                  >
                    <span className="home-more__active-icon" aria-hidden="true">{card.icon}</span>
                    <h3 className="home-more__active-title">{card.title}</h3>
                    <p>{card.content}</p>
                    <span className="home-more__label">{card.label}</span>
                  </Motion.div>
                )}
              </AnimatePresence>
            </Motion.div>
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
    title: "Think smart",
    content:
      "I approach challenges with efficiency in mind — choosing the right tools, simplifying logic, and writing code that balances performance, clarity, and future scalability across every project.",
    icon: <FaRegLightbulb size={20} />,
    label: "Clear thinking. Smarter decisions.",
  },
  {
    id: 4,
    image: "../image/home/m4.jpg",
    title: "Grow together",
    content:
      "Collaboration fuels innovation. I value open communication, shared knowledge, and teamwork to build stronger projects that grow with input from all stakeholders and deliver lasting impact.",
    icon: <TbUsersGroup size={20} />,
    label: "Teamwork that drives lasting success.",
  },
  {
    id: 5,
    image: "../image/home/m5.jpg",
    title: "Act fast",
    content:
      "Speed matters in development. I deliver timely solutions without sacrificing quality, ensuring quick iterations, fast feedback, and the ability to adapt rapidly to changing project needs.",
    icon: <IoSpeedometerOutline size={20} />,
    label: "Rapid delivery with consistent quality.",
  },
  {
    id: 6,
    image: "../image/home/m6.jpg",
    title: "Customer first",
    content:
      "Understanding client needs drives every decision I make. I focus on delivering tailored solutions that exceed expectations, ensuring satisfaction, clear communication, and long-term success for every project.",
    icon: <GrUser size={20} />,
    label: "Client satisfaction guides all my work.",
  },
  {
    id: 7,
    image: "../image/home/m7.jpg",
    title: "Be you",
    content:
      "Authenticity matters. I bring my unique perspective and creativity to every project, encouraging innovation and honest collaboration to create solutions that truly reflect your vision and goals.",
    icon: <FaRegHandPointRight size={20} />,
    label: "Originality that drives real innovation.",
  },
];
