import { Wrapper } from "@/utils/Router";
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react";
import { FaImages, FaProjectDiagram } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";
import { FavoriteBlogList } from "./FavoriteBlogList";

export const Favorite = () => {
  const data = [
    {
      label: "Blog",
      value: "blog",
      icon: <FaImages size={20} />,
      component: <FavoriteBlogList />,
    },
    {
      label: "Notes",
      value: "notes",
      icon: <MdMenuBook size={20} />,
      component: `Because it's about motivating the doers. Because I'm here
          to follow my dreams and inspire other people to follow their dreams, too.`,
    },
    {
      label: "Project",
      value: "project",
      icon: <FaProjectDiagram size={20} />,
      component: `We're not always in the position that we want to be at.
          We're constantly growing. We're constantly making mistakes. We're
          constantly trying to express ourselves and actualize our dreams.`,
    },
  ];
  return (
    <>
      <Tabs value="blog">
        <TabsHeader
          className="bg-teal-700"
          indicatorProps={{
            className: "bg-teal-500",
          }}
        >
          {data.map(({ label, value, icon }) => (
            <Tab key={value} value={value}>
              <div className="flex items-center gap-2 text-white">
                {icon}
                {label}
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <Wrapper>
          <TabsBody>
            {data.map(({ value, component }) => (
              <TabPanel key={value} value={value} className="p-0">
                {component}
              </TabPanel>
            ))}
          </TabsBody>
        </Wrapper>
      </Tabs>
    </>
  );
};
