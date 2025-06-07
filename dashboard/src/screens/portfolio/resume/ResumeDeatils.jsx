import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { HeadingThree, InputLabel, InputTitle, Wrapper } from "@/utils/Router";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getResume } from "@/redux/slices/portfolio/resumeSlice";
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineBody } from "@material-tailwind/react";
import { FaAward, FaGraduationCap } from "react-icons/fa";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { DateFormatter } from "@/components/common/DateFormatter";
import { PiBagSimpleFill } from "react-icons/pi";
import { gradientColors } from "@/utils/colorUtils";
import { generateItemColor } from "@/utils";
import { GiDiamondTrophy } from "react-icons/gi";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8 },
  },
};

// Prop Types
const resumePropTypes = {
  education: PropTypes.array,
  experience: PropTypes.array,
  skills: PropTypes.array,
  award: PropTypes.array,
  achievements: PropTypes.array,
  training: PropTypes.array,
  reference: PropTypes.array,
};

// Components
export const ResumeDeatils = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { resume } = useSelector((state) => state.resume);

  useEffect(() => {
    dispatch(getResume(id));
  }, [dispatch, id]);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Wrapper>
        <motion.div className="bg-teal-400 dark:bg-teal-800 p-4 rounded-t-3xl" variants={fadeIn}>
          <HeadingThree className="!text-white text-center">Education and Career Highlights</HeadingThree>
        </motion.div>
        <motion.div className="p-5" variants={itemVariants}>
          <EducationAndExperience resume={resume} />
        </motion.div>
      </Wrapper>

      <Wrapper className="my-5">
        <motion.div className="bg-deep-purple-400 dark:bg-deep-purple-700 p-4 rounded-t-3xl" variants={fadeIn}>
          <HeadingThree className="!text-white text-center">Things Im Good At</HeadingThree>
        </motion.div>
        <motion.div className="p-5" variants={itemVariants}>
          <Skills resume={resume} />
        </motion.div>
      </Wrapper>

      <Wrapper>
        <motion.div className="bg-purple-400 dark:bg-purple-800 p-4 rounded-t-3xl" variants={fadeIn}>
          <HeadingThree className="!text-white text-center">Awards and Accomplishments</HeadingThree>
        </motion.div>
        <motion.div className="p-5" variants={itemVariants}>
          <AchievementAndAward resume={resume} />
        </motion.div>
      </Wrapper>

      <Wrapper className="my-5">
        <motion.div className="bg-indigo-400 dark:bg-indigo-500 p-4 rounded-t-3xl" variants={fadeIn}>
          <HeadingThree className="!text-white text-center">Workshops & Training</HeadingThree>
        </motion.div>
        <motion.div className="p-5" variants={itemVariants}>
          <Training resume={resume} />
        </motion.div>
      </Wrapper>

      <Wrapper>
        <motion.div className="bg-brown-400 dark:bg-brown-700 p-4 rounded-t-3xl" variants={fadeIn}>
          <HeadingThree className="!text-white text-center">Professional References</HeadingThree>
        </motion.div>
        <motion.div className="p-5" variants={itemVariants}>
          <Reference resume={resume} />
        </motion.div>
      </Wrapper>
    </motion.div>
  );
};

export const EducationAndExperience = ({ resume }) => {
  return (
    <motion.div className="flex justify-between resume-education" variants={containerVariants}>
      <div className="w-1/2">
        <HeadingThree className="mb-3">Educational Qualifications</HeadingThree>
        <Timeline>
          {resume?.education?.map((item, index, array) => (
            <motion.div key={item?._id} variants={itemVariants}>
              <TimelineItem>
                <TimelineConnector />
                <TimelineHeader className="timeline-head">
                  <TimelineIcon
                    className="h-12 w-12 res_icon relative"
                    style={{
                      background: gradientColors[index % gradientColors.length],
                      backdropFilter: "blur(5px)",
                      filter: "blur(5px)",
                    }}
                  />
                  <FaGraduationCap className="icon size-6 text-white absolute top-3 left-3 m-auto z-10" />
                  <InputTitle className="!text-lg">{item?.degree}</InputTitle>
                </TimelineHeader>
                <TimelineBody className={index !== array.length - 1 ? "pb-8" : ""}>
                  <div>
                    <InputTitle>{item?.school}</InputTitle>
                    <InputLabel className="mt-2">
                      Year of Completion : <DateFormatter date={item?.startDate} /> - <DateFormatter date={item?.endDate} />
                    </InputLabel>
                    <InputLabel>Address : {item?.city}</InputLabel>
                    <p className="mt-5 textColor textSizeSm opacity-50">{item?.description}</p>
                  </div>
                </TimelineBody>
              </TimelineItem>
            </motion.div>
          ))}
        </Timeline>
      </div>

      <div className="w-1/2">
        <HeadingThree className="mb-3">Career Journey</HeadingThree>
        <Timeline>
          {resume?.experience?.map((item, index, array) => (
            <motion.div key={item?._id} variants={itemVariants}>
              <TimelineItem>
                <TimelineConnector />
                <TimelineHeader className="timeline-head">
                  <TimelineIcon
                    className="h-12 w-12 res_icon relative"
                    style={{
                      background: gradientColors[index % gradientColors.length],
                      backdropFilter: "blur(5px)",
                      filter: "blur(5px)",
                    }}
                  />
                  <PiBagSimpleFill className="icon size-6 text-white absolute top-3 left-3 m-auto z-10" />
                  <InputTitle className="!text-lg">{item?.position}</InputTitle>
                </TimelineHeader>
                <TimelineBody className={index !== array.length - 1 ? "pb-8" : ""}>
                  <div>
                    <InputTitle>{item?.company}</InputTitle>
                    <InputLabel className="mt-2">
                      Year of Completion : <DateFormatter date={item?.startDate} /> - <DateFormatter date={item?.endDate} />
                    </InputLabel>
                    <InputLabel>Address : {item?.city}</InputLabel>
                    <p className="mt-5 textColor textSizeSm opacity-50">{item?.description}</p>
                  </div>
                </TimelineBody>
              </TimelineItem>
            </motion.div>
          ))}
        </Timeline>
      </div>
    </motion.div>
  );
};

EducationAndExperience.propTypes = {
  resume: PropTypes.shape(resumePropTypes),
};

export const Skills = ({ resume }) => {
  return (
    <motion.div className="skills-resume" variants={containerVariants} initial="hidden" animate="visible">
      <div className="grid grid-cols-6 gap-5">
        {resume?.skills?.map((skill) => (
          <motion.div key={skill?._id} variants={itemVariants}>
            <CircleProgressBar value={skill?.progress} name={skill?.name} pathColor={generateItemColor(skill?.name)} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

Skills.propTypes = {
  resume: PropTypes.shape(resumePropTypes),
};

export const CircleProgressBar = ({ value, name, pathColor }) => {
  return (
    <motion.div className="card_1 p-5 relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} variants={itemVariants}>
      <CircularProgressbarWithChildren
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          textColor: "textColor",
          pathColor: pathColor,
          trailColor: "rgba(255,255,255,0.1)",
          textSize: "12px",
        })}
      />
      <div className="text-md text-center textColor font-medium capitalize mt-3">{name}</div>
    </motion.div>
  );
};

CircleProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  pathColor: PropTypes.string.isRequired,
};

export const AchievementAndAward = ({ resume }) => {
  return (
    <motion.div className="flex justify-between resume-award" variants={containerVariants}>
      <div className="w-1/2">
        <HeadingThree className="mb-3">Personal Milestones</HeadingThree>
        <Timeline>
          {resume?.award?.map((item, index, array) => (
            <motion.div key={item?._id} variants={itemVariants}>
              <TimelineItem>
                <TimelineConnector />
                <TimelineHeader className="timeline-head">
                  <TimelineIcon
                    className="h-12 w-12 res_icon relative"
                    style={{
                      background: gradientColors[index % gradientColors.length],
                      backdropFilter: "blur(5px)",
                      filter: "blur(5px)",
                    }}
                  />
                  <FaAward className="icon size-6 text-white absolute top-3 left-3 m-auto z-10" />
                  <InputTitle className="!text-lg">{item?.title}</InputTitle>
                </TimelineHeader>
                <TimelineBody className={index !== array.length - 1 ? "pb-8" : ""}>
                  <div>
                    <InputTitle>{item?.company}</InputTitle>
                    <InputLabel className="mt-2">
                      Received Year : <DateFormatter date={item?.receivedYear} />
                    </InputLabel>
                    <InputLabel>Address : {item?.city}</InputLabel>
                    <p className="mt-5 textColor textSizeSm opacity-50">{item?.description}</p>
                  </div>
                </TimelineBody>
              </TimelineItem>
            </motion.div>
          ))}
        </Timeline>
      </div>

      <div className="w-1/2">
        <HeadingThree className="mb-3">Honors & Recognitions</HeadingThree>
        <Timeline>
          {resume?.achievements?.map((item, index, array) => (
            <motion.div key={item?._id} variants={itemVariants}>
              <TimelineItem>
                <TimelineConnector />
                <TimelineHeader className="timeline-head">
                  <TimelineIcon
                    className="h-12 w-12 res_icon relative"
                    style={{
                      background: gradientColors[index % gradientColors.length],
                      backdropFilter: "blur(5px)",
                      filter: "blur(5px)",
                    }}
                  />
                  <GiDiamondTrophy className="icon size-6 text-white absolute top-3 left-3 m-auto z-10" />
                  <InputTitle className="!text-lg">{item?.title}</InputTitle>
                </TimelineHeader>
                <TimelineBody className={index !== array.length - 1 ? "pb-8" : ""}>
                  <p className="textColor textSizeSm opacity-50">{item?.description}</p>
                </TimelineBody>
              </TimelineItem>
            </motion.div>
          ))}
        </Timeline>
      </div>
    </motion.div>
  );
};

AchievementAndAward.propTypes = {
  resume: PropTypes.shape(resumePropTypes),
};

export const Training = ({ resume }) => {
  return (
    <motion.div className="grid grid-cols-3 gap-5" variants={containerVariants} initial="hidden" animate="visible">
      {resume?.training?.map((item, index) => (
        <motion.div key={index} className="p-5 bg-gray-50/10 rounded-lg mb-4" variants={itemVariants} whileHover={{ y: -5 }}>
          <HeadingThree>{item?.title}</HeadingThree>
          <InputTitle className="mt-2 mb-1">{item?.company}</InputTitle>
          <InputLabel>
            <DateFormatter date={item?.startDate} /> - <DateFormatter date={item?.endDate} />
          </InputLabel>
          <p className="textSizeSm">{item?.city}</p>
          <p className="textSizeSm mt-2">{item?.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

Training.propTypes = {
  resume: PropTypes.shape(resumePropTypes),
};

export const Reference = ({ resume }) => {
  return (
    <motion.div className="grid grid-cols-3 gap-5" variants={containerVariants} initial="hidden" animate="visible">
      {resume?.reference?.map((item, index) => (
        <motion.div key={index} className="p-5 bg-gray-50/10 rounded-lg mb-4" variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <InputTitle>{item?.fullname}</InputTitle>
          <p className="textSizeSm">{item?.designation}</p>
          <p className="textSizeSm">{item?.company}</p>
          <p className="textSizeSm">{item?.email}</p>
          <p className="textSizeSm">{item?.phone}</p>
          <p className="textSizeSm">{item?.city}</p>
          <p className="textSizeSm">{item?.description}</p>
          <p className="textSizeSm">{item?.website}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

Reference.propTypes = {
  resume: PropTypes.shape(resumePropTypes),
};
