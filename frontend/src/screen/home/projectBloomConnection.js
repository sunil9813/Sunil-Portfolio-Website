// Stem entry and visible flower extent in the existing 1280 × 720 sequence.
const SOURCE_ROOT_X = 70;
const SOURCE_RIGHT_EDGE = 1060;

export function bloomConnectionGeometry({ width, rootX, rootY, sectionTop, mobile = width <= 760 }) {
  const gutter = mobile ? 20 : Math.max(24, width * .04);
  const available = Math.max(1, width - gutter - rootX);
  const scale = Math.min(1, available / (SOURCE_RIGHT_EDGE - SOURCE_ROOT_X));
  const artWidth = 1280 * scale;
  const artHeight = 720 * scale;
  const top = rootY - sectionTop;

  return {
    left: rootX - SOURCE_ROOT_X * scale,
    top,
    width: artWidth,
    height: artHeight,
    sectionHeight: Math.max(mobile ? 360 : 560, top + artHeight + (mobile ? 200 : 72)),
    contentTop: mobile ? top + artHeight + 24 : Math.max(32, top + artHeight * .64),
  };
}
