import { AiOutlineFilePdf } from "react-icons/ai";
import { GoProjectRoadmap } from "react-icons/go";
import { InputTitle } from "@/components/customeUI/Title";
import { NavLink } from "react-router";
import { getRandomGradient } from "@/utils";
import Img from "../../assets/bg/lightgreen.png";

const dummydata = [
  {
    id: "1",
    topic: "Communication Systme",
    link: "https://drive.google.com/drive/u/0/folders/1yNpoII_tQDYptRCLRUis5DqJGhy05ekW",
    page: "120+",
    desc: "Learn core concepts of communication systems from signals to networks with real-world use.",
    logo: "../../image/book/network.png",
    sem: "4th Sem",
  },
  {
    id: "2",
    topic: "Computer Organization",
    link: "https://drive.google.com/drive/u/0/folders/1jRZwDe6yCL4Ihc4RQ2vEMsjQMqsBrU3S",
    page: "50+",
    desc: "Explore how computers work internally, from CPU structure to memory, I/O, and instruction flow.",
    logo: "../../image/book/processor.png",
    sem: "4th Sem",
  },
  {
    id: 3,
    topic: "Database Managment System",
    link: "https://drive.google.com/drive/u/0/folders/1Dn2RhLnZjjQbslzcMlqfiYlmbduDK8-G",
    page: "200+",
    desc: "Understand how databases store, manage, and retrieve data using models, SQL, and transactions.",
    logo: "../../image/book/database.png",
    sem: "4th Sem",
  },
  {
    id: 4,
    topic: "Discrete Mathematics",
    link: "https://drive.google.com/drive/u/0/folders/1lwH8mADXH1mP74x7LP8RuG8FRoI2-__r",
    page: "151",
    desc: "Discover logic, sets, graphs, and combinatorics that form the foundation of computer science.",
    logo: "../../image/book/math.png",
    sem: "4th Sem",
  },
  {
    id: 5,
    topic: "Marketing",
    link: "https://drive.google.com/drive/u/0/folders/1MOdHHNevVrL7UZixWFjK5mBnyqJLFuhJ",
    page: "250+",
    desc: "Learn core marketing concepts, strategies, consumer behavior, branding, and market trends. Ask ChatGPT",
    logo: "../../image/book/marketing.png",
    sem: "4th Sem",
  },
  {
    id: 6,
    topic: "Web Technology",
    link: "https://drive.google.com/drive/u/0/folders/13zKu92qA8X6FUx8SwLq_cG5OTJMoUJbU",
    page: "120+",
    desc: "Explore the foundations of web development, from HTML and CSS to JavaScript and beyond.",
    logo: "../../image/book/web.png",
    sem: "4th Sem",
  },
  {
    id: 7,
    topic: "Question Paper Solution",
    link: "https://drive.google.com/drive/u/0/folders/1ouBZGCRWIa8uh26Y5U-s-NG4fBPEqH9g",
    page: "120+",
    desc: "Get detailed board exam solutions with step-by-step answers to boost your exam readiness.",
    logo: "../../image/book/question.png",
    sem: "4th Sem",
  },
  {
    id: 7,
    topic: "Data Communication",
    link: "https://docs.google.com/document/d/1gTrxGRXYBZK6wHnbaz5wiAO4B4KkZOk8sqw0CX4kRXQ/edit?tab=t.0",
    page: "90+",
    desc: "Learn how data is transmitted across networks using signals, protocols, and transmission media. Ask ChatGPT",
    logo: "../../image/book/monitoring.png",
    sem: "5th Sem",
  },
  {
    id: 8,
    topic: "Operating System",
    link: "https://docs.google.com/document/d/1jasOxBUe9mWAWv55ugzqYjeOp_Dc4P4kqGoNAzj20TE/edit?tab=t.0",
    page: "120+",
    desc: "Understand OS concepts like process management, memory, scheduling, and file systems.",
    logo: "../../image/book/os.png",
    sem: "5th Sem",
  },
  {
    id: 9,
    topic: "PHP",
    link: "https://docs.google.com/document/d/1vXoAVKjnZMLSvmCIr4pQt7Sbx7R-5zo5D4LgtcfB4G0/edit?tab=t.0",
    page: "30+",
    desc: "Learn server-side scripting with PHP to build dynamic websites, forms, and database apps.",
    logo: "../../image/book/php.png",
    sem: "5th Sem",
  },
  {
    id: 10,
    topic: "Society and Ethics in IT",
    link: "https://docs.google.com/document/d/1RKkP9HxpcLL0jZrRAIkwSfIAxs8Rfo1vjNvt963pRQc/edit?tab=t.0",
    page: "44",
    desc: "Explore ethical issues, digital rights, and IT’s impact on society, privacy, and security.",
    logo: "../../image/book/cyber-security.png",
    sem: "5th Sem",
  },
  {
    id: 11,
    topic: "Data Mining",
    link: "https://docs.google.com/document/d/1xZ8sa9xLC6jhS6hULgt5CBcFrnvJrayBWyhSm5DtYJQ/edit?tab=t.0",
    page: "166",
    desc: "Discover patterns and insights from large datasets using algorithms, models, and tools.",
    logo: "../../image/book/data-mining.png",
    sem: "6th Sem",
  },
  {
    id: 12,
    topic: "Embedded System",
    link: "https://drive.google.com/drive/u/0/folders/1SssqxEBg6NLk1jnJMY689QtWdlLGJbz9",
    page: "150+",
    desc: "Learn how embedded systems control devices using microcontrollers, sensors, and software.",
    logo: "../../image/book/fan.png",
    sem: "5th Sem",
  },
  {
    id: 13,
    topic: "JAVA",
    link: "https://drive.google.com/drive/u/0/folders/1xbccMCfrdUcdBJzi7W2-VZpo6_30HiS5",
    page: "500+",
    desc: "Master object-oriented programming with Java, from core syntax to GUI and web development.",
    logo: "../../image/book/java.png",
    sem: "5th Sem",
  },
  {
    id: 14,
    topic: "Computer Network",
    link: "https://docs.google.com/document/d/13uIntyJJlTzOG058dmhciWNsu1jWso6tLHY16EWcHhk/edit?tab=t.0",
    page: "30+",
    desc: "Understand how computers communicate via networks, using protocols, models, and topologies.",
    logo: "../../image/book/network-connection.png",
    sem: "5th Sem",
  },
  {
    id: 15,
    topic: "Research Methodology",
    link: "https://docs.google.com/document/d/1qLyunFvrMuLhySo6HhQA3eZJrqQ5LEP2AhAt9fLHDNU/edit?tab=t.0",
    page: "75",
    desc: "Learn systematic research steps, from problem definition to data analysis and reporting.",
    logo: "../../image/book/research.png",
    sem: "5th Sem",
  },
  {
    id: 16,
    topic: "E-Commerce",
    link: "https://docs.google.com/document/d/1kT795Ghcgh742oiULl1Tr68dKBkNzCqLY4sbtWmHBSE/edit?tab=t.0",
    page: "80+",
    desc: "Discover online business models, payment systems, security, and digital marketing strategies.",
    logo: "../../image/book/ecommerce.png",
    sem: "5th Sem",
  },
  {
    id: 18,
    topic: "E-Government",
    link: "https://docs.google.com/document/d/1hbj_u6qqAqjfuQSVBimuz1cs_IpJAjNHievY1ec4BqQ/edit?tab=t.0",
    page: "70+",
    desc: "Learn how digital technologies improve government services, transparency, and citizen access.",
    logo: "../../image/book/courthouse.png",
    sem: "5th Sem",
  },
  {
    id: 19,
    topic: "Software project management",
    link: "https://docs.google.com/document/d/198scpfj7Kq6OiYqUdaOho-KGHNbVqlIuXzW5EjTIgec/edit?tab=t.0",
    page: "130+",
    desc: "Manage software projects efficiently with planning, scheduling, risk analysis, and teamwork.",
    logo: "../../image/book/project.png",
    sem: "5th Sem",
  },
  {
    id: 20,
    topic: "Wireless Communication",
    desc: "Explore wireless technologies, signal transmission, protocols, and mobile network concepts.",
    page: "100+",
    link: "https://drive.google.com/drive/u/0/folders/1OdwgpUhwZJpLQySAJv99s4iR0zvXTKNe",
    logo: "../../image/book/satellite.png",
    sem: "5th Sem",
  },
];

export const NoteList = () => {
  return (
    <>
      <section className="notes pb-20">
        <div className="absolute top-0 left-0 blur-3xl">
          <img src={Img} alt="Img" />
        </div>
        <div className="absolute -top-20 md:right-0 lg:-right-40 blur-3xl overflow-hidden">
          <img src={Img} alt="Img" className=" rotate-[70deg]" />
        </div>
        <div className=" hidden md:visible absolute top-20 left-0 md:left-[20%] lg:left-[35%]">
          <img src={Img} alt="Img" className="rotate-[47deg] blur-lg" />
        </div>
        <div className="circle-group">
          <div className="circle1"></div>
          <div className="circle2"></div>
        </div>
        <div className=" absolute left-[27%] top-0 w-1/2 h-[60vh] overflow-hidden">
          <img src="https://framerusercontent.com/images/eVPQSYBoVqwchmpN78sjyYtovY.svg" alt="images" className="w-full h-full object-cover" />
        </div>
        <div className="container">
          <div className="heading m-auto text-center pt-12 lg:pt-28 mb-10 w-full lg:w-2/3 relative z-20">
            <h1 className="text-xl md:text-3xl lg:text-6xl font-semibold gardient-text note-title">Curated Reads for Modern Learners</h1>
            <h2 className="text-lg md:text-xl lg:text-2xl textColor font-medium heading-gardient">Timeless and trailblazing reads supporting your academic growth and intellectual journey.</h2>
            <p className="text-xs md:text-sm mt-3">Read by learners, leaders, and forward-thinkers in over 100 countries.</p>
          </div>
          <div className="md:grid flexC flex-col md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-16 relative z-20">
            {dummydata?.map((item, index) => (
              <BookCard key={index} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export const BookCard = ({ item }) => {
  return (
    <NavLink className="handbook-card__link" target="_blank" to={item?.link}>
      <div className="handbook-card__wrapper">
        <div className="handbook-card__main">
          <div className="handbook-card__image-wrapper size-8 absolute top-0 right-0 m-4">
            <img src={item?.logo} alt="handbook logo" className="handbook-card__logo rounded-full" />
          </div>
          <div className="handbook-card__content">
            <InputTitle className="handbook-card__title gardient-text text-xll">{item?.topic}</InputTitle>
            <p className="handbook-card__description">{item?.desc}</p>
            <div className="handbook-card__info flex items-center gap-2">
              <div className="handbook-card__icon-wrapper flexC size-8 rounded-full">
                <GoProjectRoadmap className="handbook-card__icon" />
              </div>
              <p className="handbook-card__info-text">{item?.page} free tutorials</p>
            </div>
            <div className="handbook-card__info flex items-center gap-2">
              <div className="handbook-card__icon-wrapper flexC size-8 rounded-full">
                <AiOutlineFilePdf className="handbook-card__icon" />
              </div>
              <p className="handbook-card__info-text">Videos, PDF, files</p>
            </div>
            {/*  <div className="flex gap-2">
              <div className="size-10">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Purbanchal_University_Logo.png/285px-Purbanchal_University_Logo.png" alt="" />
              </div>
            </div> */}
          </div>
        </div>
        <div className="handbook-card__background" style={{ background: getRandomGradient() }}></div>
      </div>
    </NavLink>
  );
};
