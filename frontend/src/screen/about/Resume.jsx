import React from "react";
import { Timeline } from "@/components/ui/Timeline";
import { InputLabel } from "@/components/customeUI/Title";
import { FaGraduationCap } from "react-icons/fa";
import { BsFillHandbagFill } from "react-icons/bs";

export const Resume = () => {
  return (
    <>
      <div className="py-16 relative z-50">
        <div className="container">
          <div className="heading w-full md:mb-16 lg:w-3/5 m-auto text-center mb-10">
            <h1 className="text-xl md:text-3xl lg:text-6xl font-semibold gardient-text resume-title">Work & Experience</h1>
            <p>
              Over the years, I’ve worked on a variety of projects — from building responsive user interfaces to designing robust backend systems. Each role sharpened my ability to solve problems,
              adapt quickly, and deliver reliable results.
            </p>
          </div>

          <div className="flex gap-10 flex-col md:flex-col lg:flex-row lg:justify-between md:gap-2">
            <Timeline data={ExperienceData} />
            <div className="">
              <h1 className=" visible lg:hidden mb-10 text-2xl md:text-6xl font-semibold textColor">Education</h1>
            </div>
            <Timeline data={EducationData} />
          </div>
        </div>
      </div>
    </>
  );
};
export const ExperienceData = [
  {
    icon: <BsFillHandbagFill size={15} />,
    title: "Jan 2021 – Present",
    subtitle: "GorkCoder (YouTube Channel)",
    role: "Content Creator – MERN Stack",
    content: (
      <div className="space-y-2">
        <InputLabel>• Create and publish educational content on MERN stack using real-world examples</InputLabel>
        <InputLabel>• Covered topics like CRUD, authentication, REST APIs, and deployment</InputLabel>
        <InputLabel>• Produced full project series tutorials using MongoDB, Express, React, and Node</InputLabel>
        <InputLabel>• Interacted with the developer community and answered viewer queries</InputLabel>
        <InputLabel>• Maintained a consistent upload schedule and audience engagement</InputLabel>
        <InputLabel>• Reached thousands of learners through hands-on project-based videos</InputLabel>
      </div>
    ),
  },
  {
    icon: <BsFillHandbagFill size={15} />,
    title: "Feb 2025 – July 2025",
    subtitle: "APP Technologies Pvt. Ltd.",
    role: "Full Stack Developer (MERN)",
    content: (
      <div className="space-y-2">
        <InputLabel>• Building scalable web applications, focusing on API development and responsive UI</InputLabel>
        <InputLabel>• Managing MongoDB databases and collaborating via Git/GitHub for version control</InputLabel>
        <InputLabel>• Participating in team-based debugging and feature development sprints</InputLabel>
        <InputLabel>• Implementing authentication, authorization, and secure API handling</InputLabel>
        <InputLabel>• Integrating third-party APIs and handling real-time features using WebSocket</InputLabel>
        <InputLabel>• Writing clean, reusable code with proper documentation and code reviews</InputLabel>
      </div>
    ),
  },
  {
    icon: <BsFillHandbagFill size={15} />,
    title: "May 2022 – Dec 2024",
    subtitle: "Dokomoko Tech Pvt. Ltd.",
    role: "Full Stack Developer (MERN)",
    content: (
      <div className="space-y-2">
        <InputLabel>• Delivered full-featured MERN stack apps using Next.js, React, Node.js, and Express</InputLabel>
        <InputLabel>• Led UI/UX implementation with Redux for robust state management</InputLabel>
        <InputLabel>• Handled cloud deployment via Hostinger and optimized performance</InputLabel>
        <InputLabel>• Worked closely with designers to implement pixel-perfect responsive layouts</InputLabel>
        <InputLabel>• Optimized code for performance and scalability using lazy loading and SSR</InputLabel>
        <InputLabel>• Maintained CI/CD pipelines and resolved deployment issues</InputLabel>
      </div>
    ),
  },
  {
    icon: <BsFillHandbagFill size={15} />,
    title: "May 2021 – July 2021",
    subtitle: "Internship – MERN Stack Developer",
    role: "APP Technologies Pvt. Ltd.",
    content: (
      <div className="space-y-2">
        <InputLabel>• Assisted in building core features for MERN stack applications</InputLabel>
        <InputLabel>• Gained hands-on experience in full stack development and Git workflows</InputLabel>
        <InputLabel>• Wrote small reusable components and practiced version control with GitHub</InputLabel>
        <InputLabel>• Attended team stand-ups, sprint reviews, and contributed to daily tasks</InputLabel>
        <InputLabel>• Learned how to debug and test backend endpoints using Postman</InputLabel>
        <InputLabel>• Observed agile workflow and sprint planning in action</InputLabel>
      </div>
    ),
  },
];

export const EducationData = [
  {
    icon: <FaGraduationCap size={17} />,
    title: "July 2025 – Present",
    subtitle: "Central Queensland University (CQU), Sydney, Australia",
    role: "Master of Information Technology (MIT)",
    content: (
      <div className="space-y-2">
        <InputLabel>• Enrolled in advanced IT program focused on systems and software development</InputLabel>
        <InputLabel>• Specialized in cybersecurity, cloud infrastructure, and enterprise computing</InputLabel>
        <InputLabel>• Participating in group-based industry projects and lab research</InputLabel>
        <InputLabel>• Learning project management, systems analysis, and agile methodology</InputLabel>
        <InputLabel>• Expanding skills in software architecture and IT strategy</InputLabel>
        <InputLabel>• Location: Sydney Campus, CQU, Australia</InputLabel>
      </div>
    ),
  },
  {
    icon: <FaGraduationCap size={17} />,
    title: "2018 – 2022",
    subtitle: "Purbanchal University – KIST College",
    role: "Bachelor in Information Technology (BIT)",
    content: (
      <div className="space-y-2">
        <InputLabel>• Completed 4-year degree focused on software, networking, and databases</InputLabel>
        <InputLabel>• Built academic projects using MERN stack and core Java</InputLabel>
        <InputLabel>• Studied DBMS, OOP, operating systems, and data structures</InputLabel>
        <InputLabel>• Participated in workshops, hackathons, and tech events</InputLabel>
        <InputLabel>• Conducted final year project on a full-stack system</InputLabel>
        <InputLabel>• CGPA: 3.14</InputLabel>
      </div>
    ),
  },
  {
    icon: <FaGraduationCap size={17} />,
    title: "2016 – 2018",
    subtitle: "Southwestern State Secondary School",
    role: "+2 Management (Computer Science)",
    content: (
      <div className="space-y-2">
        <InputLabel>• Studied management stream with computer science specialization</InputLabel>
        <InputLabel>• Learned fundamentals of C programming and office tools</InputLabel>
        <InputLabel>• Participated in inter-college IT events and seminars</InputLabel>
        <InputLabel>• Developed interest in tech through early exposure to web design</InputLabel>
        <InputLabel>• Completed academic project using MS Access and Visual Basic</InputLabel>
        <InputLabel>• CGPA: 2.63</InputLabel>
      </div>
    ),
  },
  {
    icon: <FaGraduationCap size={17} />,
    title: "2006 – 2016",
    subtitle: "Manasalu Public Secondary School",
    role: "School Leaving Certificate (SLC)",
    content: (
      <div className="space-y-2">
        <InputLabel>• Completed 10 years of primary and secondary school education</InputLabel>
        <InputLabel>• Studied core subjects: Math, Science, English, and Social Studies</InputLabel>
        <InputLabel>• Actively participated in school science fairs and IT day events</InputLabel>
        <InputLabel>• Recognized for academic performance and discipline</InputLabel>
        <InputLabel>• Built early foundations in logical thinking and computing</InputLabel>
        <InputLabel>• GPA: 3.05</InputLabel>
      </div>
    ),
  },
];
