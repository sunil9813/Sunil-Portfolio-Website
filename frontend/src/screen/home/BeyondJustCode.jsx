import { HeadingTwo, InputLabel } from "@/components/customeUI/Title";
import React from "react";

export const BeyondJustCode = () => {
  return (
    <div>
      <section className="beyondjustcode mt-16">
        <div className="container">
          <div className="heading w-full lg:w-2/3 m-auto text-center mb-10">
            <h1 className="text-3xl lg:text-6xl font-semibold blog-detail-title">Beyond Just Code</h1>
            <p className="">A curated showcase of creativity, problem-solving, and purpose-driven digital work.</p>
          </div>

          <div className="content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="box border-b border-indigo-500/5 rounded-b-xl">
              <div className="img">
                <img src="../image/home/b1.webp" alt="Network" className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <HeadingTwo>Network</HeadingTwo>
                <InputLabel>Discover people with similar and diverse talents, follow them to see their latest projects, start a chat to make new friends.</InputLabel>
              </div>
            </div>
            <div className="box border-b border-indigo-500/5 rounded-b-xl">
              <div className="img">
                <img src="../image/home/b2.webp" alt="Communities" className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <HeadingTwo>Communities</HeadingTwo>
                <InputLabel>Connect with tech talents of common interest, share learnings, and help each other grow.</InputLabel>
              </div>
            </div>
            <div className="box border-b border-indigo-500/5 rounded-b-xl">
              <div className="img">
                <img src="../image/home/b3.webp" alt="Collabs" className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <HeadingTwo>Collabs</HeadingTwo>
                <InputLabel>Invite other creatives to work with you on your projects, or discover and join projects.</InputLabel>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
