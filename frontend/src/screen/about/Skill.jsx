import { mernSkillsData } from "@/assets/dummyData";
import { InfiniteMovingCards } from "@/components/ui/InfiniteMovingCards";
import React from "react";

export const Skill = () => {
  // Function to shuffle array randomly
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Create three different shuffled datasets
  const leftSkills1 = shuffleArray(mernSkillsData);
  const rightSkills = shuffleArray(mernSkillsData);
  const leftSkills2 = shuffleArray(mernSkillsData);

  return (
    <>
      <section className="py-16">
        <div className="container">
          <div className="heading w-full lg:w-2/3 m-auto text-center mb-10">
            <h1 className="text-xl md:text-3xl lg:text-6xl font-semibold gardient-text resume-title">Skills & Technologies</h1>
            <p className="">Experienced in crafting end-to-end web solutions—from intuitive interfaces to robust backend systems.</p>
          </div>
        </div>
        <InfiniteMovingCards items={leftSkills1} direction="left" speed="fast" className="mb-4" />
        <InfiniteMovingCards items={rightSkills} direction="right" speed="normal" className="mb-4" />
        <InfiniteMovingCards items={leftSkills2} direction="left" speed="slow" />
      </section>
    </>
  );
};
