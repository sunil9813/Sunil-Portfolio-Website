import { motion as Motion, useTransform } from 'framer-motion';

const artwork = '/image/home/process-white-blossom-branches.png';

function FlowerStage({ index, progress }) {
  // Smoothstep gives each photographed growth state a soft arrival/departure.
  // Adjacent weights add to one; the shared branch stays stable while buds open.
  const opacity = useTransform(progress, value => {
    const distance = Math.min(1, Math.abs(value - index));
    return 1 - distance * distance * (3 - 2 * distance);
  });
  return <Motion.div className="process-flower__frame" style={{
    backgroundImage: `url(${artwork})`,
    backgroundPosition: `${(index % 3) * 50}% ${index < 3 ? 0 : 100}%`,
    opacity,
  }} />;
}

export function ProcessFlower({ progress, reduced }) {
  const rotate = useTransform(progress, [0, 2, 3, 5], [-1.5, -.6, 0, .6]);
  const y = useTransform(progress, [0, 5], [6, 0]);
  return <div className="process-flower" aria-hidden="true">
    <Motion.div className="process-flower__plant" style={{ rotate: reduced ? 0 : rotate, y: reduced ? 0 : y }}>
      {Array.from({ length: 6 }, (_, index) => <FlowerStage key={index} index={index} progress={progress} />)}
    </Motion.div>
  </div>;
}
