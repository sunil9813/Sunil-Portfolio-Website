const ScrollStickySections = ({ data }) => {
  return (
    <div className="relative">
      {data.map((item, index) => {
        return (
          <div key={item.id} className="sticky top-24 py-2 w-full flex items-center justify-center overflow-hidden">
            <div className="flex justify-between gap-4 relative black-custome-box h-96 z-50 w-full">
              <div className="detail flex-1 p-10 w-full">
                <h1 className="text-[60px] md:text-[100px] font-semibold opacity-10 absolute top-0 right-5">0{index + 1}</h1>
                <div className="relative">
                  <h2 className="text-xl md:text-2xl lg:text-5xl font-semibold textColor gardient-text note-title mb-6">{item.title}</h2>
                  <div className="text-lg">{item?.content}</div>
                </div>
              </div>

              <div className="flexC" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <img src={item?.cover} alt={item?.id} className="absolute top-0 left-1/3 lg:absolute lg:w-full lg:h-full lg:object-contain lg:flexC" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const WorkingProcess = () => {
  return (
    <>
      <section className="working-process mb-14">
        <div className="container">
          <div className="heading text-center mb-5">
            <h1 className="text-xl md:text-3xl lg:text-6xl font-semibold gardient-text note-title text-center">Working Process</h1>
            <p className="">A clear, step-by-step approach to turning ideas into efficient digital solutions.</p>
          </div>

          <ScrollStickySections data={data} />
        </div>
      </section>
    </>
  );
};

const data = [
  {
    id: 1,
    title: "Planning Phase",
    cover: "../image/about/plan/p1.svg",
    content: (
      <ul className=" list-disc ml-2 md:ml-10 text-sm md:text-lg flex flex-col gap-3 pt-5 w-full">
        <li>Requirement Analysis: Understand project requirements from stakeholders</li>
        <li>Database Design: Plan MongoDB schema and relationships </li>
        <li>API Design: Define RESTful/GrapqhQL endpoints </li>
        <li>UI/UX Planning: Wireframe React components and user flows </li>
        <li>Project Setup: Decide on folder structure and tools </li>
      </ul>
    ),
  },
  {
    id: 2,
    title: "Development Setup",
    cover: "../image/about/plan/p2.svg",
    content: (
      <ul className=" list-disc ml-2 md:ml-10 text-sm md:text-lg flex flex-col gap-3 pt-5 w-full">
        <li>Initialize Project</li>
        <li>Set up backend (Node/Express)</li>
        <li>Set up frontend (React/Next JS)</li>
      </ul>
    ),
  },
  {
    id: 3,
    title: "Backend Development",
    cover: "../image/about/plan/p3.svg",
    content: (
      <ul className=" list-disc ml-2 md:ml-10 text-sm md:text-lg flex flex-col gap-3 pt-5 w-full">
        <li>Create server structure</li>
        <li>Implement features</li>
      </ul>
    ),
  },
  {
    id: 4,
    title: "Frontend Development",
    cover: "../image/about/plan/p4.svg",
    content: (
      <ul className=" list-disc ml-2 md:ml-10 text-sm md:text-lg flex flex-col gap-3 pt-5 w-full">
        <li>Create React / Next js app structure</li>
        <li>Implement features</li>
      </ul>
    ),
  },
  {
    id: 5,
    title: "Testing",
    cover: "../image/about/plan/p5.svg",
    content: (
      <ul className=" list-disc ml-2 md:ml-10 text-sm md:text-lg flex flex-col gap-3 pt-5 w-full">
        <li>Backend testing</li>
        <li>Frontend testing</li>
        <li>Integration testing</li>
        <li>End-to-end testing</li>
      </ul>
    ),
  },
  {
    id: 6,
    title: "Deployment",
    cover: "../image/about/plan/p6.svg",
    content: (
      <ul className=" list-disc ml-2 md:ml-10 text-sm md:text-lg flex flex-col gap-3 pt-5 w-full">
        <li>Backend deployment</li>
        <li>Frontend deployment</li>
      </ul>
    ),
  },
  {
    id: 7,
    title: "Maintenance & Updates",
    cover: "../image/about/plan/p7.svg",
    content: (
      <ul className=" list-disc ml-2 md:ml-10 text-sm md:text-lg flex flex-col gap-3 pt-5 w-full">
        <li>Monitor application performance</li>
        <li>Fix bugs and implement feature requests</li>
        <li>Optimize for better performance</li>
        <li>Keep dependencies updated</li>
      </ul>
    ),
  },
];
