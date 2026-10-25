import { motion as Motion, useTransform } from 'framer-motion';

const poppy = '/image/home/process-pink-poppy.png';

export function ProcessGrowth({ progress, reduced }) {
  // One continuous plant: roots reveal downwards, stem rises, then petals unfold.
  const roots = useTransform(progress, [0, .9, 1.8], [0, .65, 1]);
  const stem = useTransform(progress, [.65, 2, 3.25], [0, .55, 1]);
  const rootClip = useTransform(roots, value => `inset(77% 0 ${23 * (1 - value)}% 0)`);
  const stemClip = useTransform(stem, value => `inset(${77 - value * 39}% 0 23% 0)`);
  const petalX = useTransform(progress, [2.8, 3.5, 4.6, 5], [.12, .36, .95, 1]);
  const petalY = useTransform(progress, [2.8, 3.5, 4.6, 5], [.12, .65, 1, 1]);
  const bloomOpacity = useTransform(progress, [2.8, 3.1], [0, 1]);
  const cameraY = useTransform(progress, [0, 1.4, 3.6, 5], ['-40%', '-24%', '0%', '0%']);
  const sway = useTransform(progress, [0, 2, 4, 5], [0, -2, 1, 0]);
  const seedY = useTransform(progress, [0, .65], [-35, 12]);
  const seedOpacity = useTransform(progress, [0, .5, 1], [1, 1, 0]);

  return <div className="process-poppy" aria-hidden="true">
    <Motion.div className="process-poppy__plant" style={{ y: reduced ? 0 : cameraY, rotate: reduced ? 0 : sway }}>
      <Motion.img src={poppy} alt="" width="1024" height="1536" decoding="async"
        className="process-poppy__layer" style={{ clipPath: rootClip }} />
      <Motion.img src={poppy} alt="" width="1024" height="1536" decoding="async"
        className="process-poppy__layer" style={{ clipPath: stemClip }} />
      <Motion.div className="process-poppy__crown"
        style={{ opacity: bloomOpacity, scaleX: reduced ? 1 : petalX, scaleY: reduced ? 1 : petalY }}>
        <img src={poppy} alt="" width="1024" height="1536" decoding="async" className="process-poppy__layer" />
      </Motion.div>
      <Motion.span className="process-poppy__seed" style={{ opacity: seedOpacity, y: reduced ? 0 : seedY }} />
    </Motion.div>
  </div>;
}
