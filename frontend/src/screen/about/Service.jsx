import React from "react";

export const Service = () => {
  return (
    <>
      <div className="service container pt-10">
        <div className="heading w-full lg:w-2/3 m-auto text-center mb-10">
          <h1 className="text-xl md:text-3xl lg:text-6xl font-semibold gardient-text service-title">Services I Offer</h1>
          <p className="">From concept to deployment, I provide end-to-end web development solutions tailored to your goals.</p>
        </div>
        <ServiceCard />
      </div>
    </>
  );
};

export const ServiceCard = () => {
  return (
    <>
      <div className="content">
        <div className="lg:flex lg:justify-between gap-3">
          <div className="w-full mb-3 lg:mt-0 lg:w-[70%] md:flex md:justify-between md:gap-2 black-custome-box black-custome-box-bg p-5">
            <div className="w-full md:w-1/2">
              <h2 className="text-xl md:text-3xl textColor mb-4">
                Full-Stack Website Design <br /> MERN Development
              </h2>
              <div className="h-56">
                <img src="../image/service/service1.webp" alt="service1" className="w-full h-full" />
              </div>
            </div>
            <div className="w-full md:w-1/2 p-5">
              <p className="text-m mb-3">
                Full Custom Website Development with the MERN Stack I build modern, scalable, and high-performance web applications using MongoDB, Express.js, React, and Node.js. With a strong focus
                on clean architecture, responsive design, and robust backend logic, I ensure every product is fast, secure, and built for growth.
              </p>
              <p className="text-m mb-3">Let’s craft a seamless, full-stack web experience tailored to your brand’s needs.</p>
            </div>
          </div>
          <div className="w-full lg:w-[30%] black-custome-box p-5">
            <h2 className="text-xl textColor mb-4">Figma to Full-Stack MERN Implementation</h2>

            <p className="text-m mb-3">From design to deployment — I convert your UI into high-performing full-stack MERN web apps. </p>

            <div className="h-56">
              <img src="../image/service/service4.webp" alt="service4" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-3">
          <div className="black-custome-box p-5">
            <h2 className="text-xl textColor mb-4">2-days landing page</h2>
            <p className="text-m mb-3">Do you need a custom one-pager or a landing page? I'm here for you.</p>
            <div className="h-96">
              <img src="../image/service/service2.webp" alt="service4" className="w-full h-full object-contain rounded-xl" />
            </div>
          </div>
          <div className="black-custome-box p-5">
            <h2 className="text-xl textColor mb-4">Ongoing Monthly Development Support</h2>
            <p className="text-m pb-3">Unlimited feature requests, design improvements, or bug fixes — delivered one at a time with care and precision.</p>
            <hr className=" border-gray-400/20 my-3" />
            <div className="py-3">
              <ul className="text-m flex flex-col gap-3">
                <li>✅ Unlimited requests</li>
                <li>⏱️ Average 24–48h delivery</li>
                <li>🔁 Unlimited revisions</li>
                <li>🎨 Custom frontend design updates</li>
                <li>🔄 Backend enhancements & API integration</li>
                <li>🤝 Async communication & collaboration</li>
                <li>💰 Fixed monthly rate — no surprises</li>
              </ul>
            </div>
          </div>
          <div className="black-custome-box p-5">
            <h2 className="text-xl textColor mb-4">Custom project</h2>
            <p className="text-m mb-3">
              I collaborate closely with expert designers and branding specialists to bring full custom solutions to life. If your project requires something unique, let’s connect and build it
              together.
            </p>
            <div className="h-80">
              <img src="../image/service/service3.webp" alt="service4" className="w-full h-full object-contain rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
