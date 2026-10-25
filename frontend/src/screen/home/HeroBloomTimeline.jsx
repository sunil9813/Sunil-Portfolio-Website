import { motion as Motion, useTransform } from "framer-motion";

const steps = [
  { title: "The idea", text: "Understanding your goals and shaping a clear direction.", at: .44, position: "min-[900px]:left-[6%] min-[900px]:top-[38%]", path: "M 26 47 H 32 Q 36 47 39 49 L 43 52" },
  { title: "The build", text: "Connecting thoughtful interfaces, APIs, and data.", at: .62, position: "min-[900px]:right-[5%] min-[900px]:top-[38%]", path: "M 76 47 H 71 Q 68 47 65 50 L 61 54" },
  { title: "The bloom", text: "Bringing the product to life, ready to grow.", at: .8, position: "min-[900px]:right-[8%] min-[900px]:bottom-[7%]", path: "M 74 83 H 68 Q 65 83 63 80 L 61 77" },
];

function RoadmapStep({ step, index, progress, reduced }) {
  const opacity = useTransform(progress, [step.at - .1, step.at], [.8, 1]);
  const y = useTransform(progress, [step.at - .1, step.at], [12, 0]);
  const markerBackground = useTransform(progress, [step.at - .06, step.at + .06], ["#222222", "#eeeeee"]);
  const markerInk = useTransform(progress, [step.at - .06, step.at + .06], ["#cccccc", "#111111"]);
  return <Motion.li className={"relative border-t border-white/15 py-3 min-[900px]:absolute min-[900px]:w-[clamp(180px,17vw,240px)] min-[900px]:border-0 min-[900px]:p-0 " + (reduced ? "" : step.position)}
    style={reduced ? undefined : { opacity, y }}>
    <div className="flex items-center gap-3">
      <Motion.span className="grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-medium tabular-nums" style={{ backgroundColor: reduced ? "#eeeeee" : markerBackground, color: reduced ? "#111111" : markerInk }}>0{index + 1}</Motion.span>
      <h3 className="m-0 text-[18px] font-medium tracking-[-.02em] text-white min-[900px]:text-[22px]">{step.title}</h3>
    </div>
    <p className="mb-0 mt-3 max-w-[30ch] pl-9 text-[13px] leading-[1.75] text-[#bdbdbd]">{step.text}</p>
  </Motion.li>;
}

function Connection({ step, progress }) {
  const pathLength = useTransform(progress, [step.at - .06, step.at + .12], [0, 1]);
  const opacity = useTransform(progress, [step.at - .1, step.at], [0, .45]);
  return <Motion.g style={{ opacity }}>
    <Motion.path d={step.path} fill="none" stroke="#ffffff" strokeWidth=".1" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength }} />
  </Motion.g>;
}

export function HeroBloomTimeline({ progress, reduced }) {
  const opacity = useTransform(progress, [.44, .52], [0, 1]);
  const visibility = useTransform(progress, value => value < .44 ? "hidden" : "visible");
  return <Motion.div className={reduced ? "relative z-20 mx-auto mt-8 max-w-[960px] pb-8" : "pointer-events-none absolute inset-0 z-20"}
    style={reduced ? undefined : { opacity, visibility }}>
    <div className={reduced ? "mb-8 text-center" : "absolute inset-x-6 top-[3%] text-center min-[900px]:top-[7%]"}>
      <h2 className="m-0 text-[32px] font-medium leading-[1.1] tracking-[-.03em] text-white min-[900px]:text-[clamp(40px,4vw,58px)]">
        Ideas <span className="text-[#a8a8a8]">take shape.</span>
      </h2>
      <p className="mx-auto mb-0 mt-3 max-w-[38ch] text-[12px] leading-[1.7] text-[#bdbdbd] min-[900px]:text-[14px]">From the first conversation to a product ready to grow.</p>
    </div>
    {!reduced && <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 hidden size-full min-[900px]:block">
      {steps.map(step => <Connection key={step.title} step={step} progress={progress} />)}
    </svg>}
    <ol aria-label="From idea to a working product" className={reduced ? "m-0 grid list-none gap-6 p-0 min-[900px]:grid-cols-3 [&>li]:!static [&>li]:!w-auto" : "absolute inset-x-6 bottom-[4%] m-0 list-none p-0 min-[900px]:inset-0"}>
      {steps.map((step, index) => <RoadmapStep key={step.title} step={step} index={index} progress={progress} reduced={reduced} />)}
    </ol>
  </Motion.div>;
}
