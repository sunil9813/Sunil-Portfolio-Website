import { Tabs } from "@/components/ui/Tabs";
import React from "react";

export const Expertise = () => {
  return (
    <>
      <section className="expertise py-10 relative">
        <div className="about-bg-second absolute !top-96 w-full"></div>
        <div className="container">
          <div className="heading w-full lg:w-1/2 m-auto text-center mb-5">
            <h1 className="text-3xl lg:text-6xl font-semibold blog-detail-title">My Expertise</h1>
            <p className="">Specialized in crafting full-stack web applications with seamless performance, clean architecture, and user-centric design.</p>
          </div>
          <div className="h-[31rem] lg:h-[20rem] relative w-full">
            <Tabs tabs={tabs} />
          </div>
        </div>
      </section>
    </>
  );
};

const tabs = [
  {
    title: "All",
    value: "all",
    content: (
      <div className="w-full overflow-scroll md:overflow-hidden relative h-full rounded-2xl p-5 black-custome-box">
        <h3 className="text-xl md:text-3xl lg:text-4xl text-white mb-5">Tools and Language</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor">HTML</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor">CSS3</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">sass</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">tailwind css</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">bootstrap</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/materialui/materialui-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">material ui</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">javascript</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">react</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">next js</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/reactrouter/reactrouter-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">react router</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">redux toolkit</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/axios/axios-plain.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">axios</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">node js</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">express js</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">mongodb</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">mysql</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">firebase</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">amazon web services</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/netlify/netlify-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">netlify</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">vercel</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.brandfetch.io/idJjJ1f0bI/w/1000/h/1000/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">hostinger</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAAAAADFHGIkAAAAfklEQVR4AWP4jwOgSfzY1D31JhaJU6oMQBDwEl3iiQADGKj+QJMIYICCOlSJlwwwYIoqsYkBDlAl0uHiAigSTzjhEpHIEj+s4eKcF5EknpgibNgE9keddcvq/ZvyOcFKre3t7dNv/odIIFSm/4DoRpcQA/KxSlgPaQlUQFgCABOfchUR/bqdAAAAAElFTkSuQmCC"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="textColor uppercase">render</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">npm</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pnpm/pnpm-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">pnpm</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">vscode</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/atom/atom-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">atom</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">linux</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows11/windows11-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">windows 11</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">git</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">github</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Frontend",
    value: "frontend",
    content: (
      <div className="w-full overflow-scroll md:overflow-hidden relative h-full rounded-2xl p-5 black-custome-box">
        <h3 className="text-xl md:text-3xl lg:text-4xl text-white mb-5">Frontend Development</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor">HTML</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor">CSS3</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">sass</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">tailwind css</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">bootstrap</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/materialui/materialui-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">material ui</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">javascript</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">react</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">next js</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/reactrouter/reactrouter-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">react router</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">redux toolkit</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/axios/axios-plain.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">axios</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Backend",
    value: "backend",
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-5 black-custome-box">
        <h3 className="text-xl md:text-3xl lg:text-4xl text-white mb-5">Backend Development</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">node js</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">express js</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Database",
    value: "database",
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-5 black-custome-box">
        <h3 className="text-xl md:text-3xl lg:text-4xl text-white mb-5">Database</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">mongodb</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">mysql</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">firebase</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Hosting",
    value: "hosting",
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-5 black-custome-box">
        <h3 className="text-xl md:text-3xl lg:text-4xl text-white mb-5">Hosting</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">amazon web services</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/netlify/netlify-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">netlify</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">vercel</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img src="https://cdn.brandfetch.io/idJjJ1f0bI/w/1000/h/1000/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B" className="w-full h-full object-contain" />
            </div>
            <span className="textColor uppercase">hostinger</span>
          </div>
          <div className="bg-gray-50/10 backdrop-blur-xl h-10 flex items-center gap-2 px-4 pr-6 py-2 rounded-full">
            <div className="h-full size-10">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAAAAADFHGIkAAAAfklEQVR4AWP4jwOgSfzY1D31JhaJU6oMQBDwEl3iiQADGKj+QJMIYICCOlSJlwwwYIoqsYkBDlAl0uHiAigSTzjhEpHIEj+s4eKcF5EknpgibNgE9keddcvq/ZvyOcFKre3t7dNv/odIIFSm/4DoRpcQA/KxSlgPaQlUQFgCABOfchUR/bqdAAAAAElFTkSuQmCC"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="textColor uppercase">render</span>
          </div>
        </div>
      </div>
    ),
  },
];
