const wrap = value => ((value + 35) % 150 + 150) % 150 - 35;

// A slow, seamless image field: cards travel across the frame and turn in depth.
// Wrapping happens outside the clipped viewport, never through the reading area.
export function heroTileMotion(item, seconds, scroll = 0) {
  const phase = item.photo * .83 + item.y * .07;
  const duration = 220 + (item.photo % 3) * 30;
  const cycle = seconds / duration * Math.PI * 2;
  const left = item.edge ? item.x : wrap(item.x - seconds / duration * 150);
  const turn = item.edge ? 8 : 18;
  const clear = Math.min(1, Math.max(0, scroll / .6));
  return {
    left,
    transform: `perspective(800px) translate3d(calc(${left - item.x}vw + ${clear * (item.x < 50 ? -150 : 150)}px), calc(${Math.sin(cycle * 6 + phase) * 1.5}svh + ${clear * (item.y < 50 ? -100 : 130)}px), 0) rotateX(${item.tilt + Math.sin(cycle * 7 + phase) * 12}deg) rotateY(${(item.x < 50 ? turn : -turn) + Math.sin(cycle * 5 + phase) * turn}deg) rotateZ(${item.angle + Math.sin(cycle * 4 + phase) * 9 + clear * item.angle * .6}deg) scale(${item.size * (1 + Math.sin(cycle * 6 + phase) * .045)})`,
  };
}

export function heroTileKeyframes(item) {
  const duration = 220 + (item.photo % 3) * 30;
  const crossing = (wrap(item.x) + 35) / 150;
  const offsets = Array.from({ length: 121 }, (_, index) => index / 120);
  // The recycling jump is instantaneous and entirely outside the clipped view.
  offsets.push(crossing - .000001, crossing + .000001);
  return {
    duration: duration * 1000,
    frames: offsets.sort((a, b) => a - b).map(offset => ({ offset, transform: heroTileMotion(item, offset * duration).transform })),
  };
}
