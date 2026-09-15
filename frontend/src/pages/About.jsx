import { Vortex } from "@/components/ui/Vortex";
import { ProfileInfo } from "@/screen/about/ProfileInfo";
import { Resume } from "@/screen/about/Resume";
import { Service } from "@/screen/about/Service";
import { Skill } from "@/screen/about/Skill";
import { WorkingProcess } from "@/screen/about/WorkingProcess";
import React from "react";

export const About = () => {
  return (
    <main className="about-page">
      {/* <div className="absolute inset-0 overflow-hidden">
        <span className="absolute -left-[10%] top-[20%] block aspect-[1.5489] w-[87.5%] -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] rounded-[100%] bg-[#2B2B44] opacity-30 blur-3xl"></span>
        <span className="absolute -top-[20%] -left-[30%] block aspect-[1.3555] w-[69%] -rotate-45 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,#268D8C_0%,rgba(38,141,140,0)_100%)] opacity-40 blur-3xl"></span>
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <span className="absolute -left-[10%] top-[20%] block aspect-[1.5489] w-[87.5%] -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] rounded-[100%] bg-[#2B2B44] opacity-30 blur-3xl"></span>
        <span className="absolute -top-[20%] -right-[30%] block aspect-[1.3555] w-[69%] -rotate-45 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,#268D8C_0%,rgba(38,141,140,0)_100%)] opacity-40 blur-3xl"></span>
      </div> */}

      <ProfileInfo />
      <Resume />
      <Service />
      <Skill />
      <WorkingProcess />
    </main>
  );
};
