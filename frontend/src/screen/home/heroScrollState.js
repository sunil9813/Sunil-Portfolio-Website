const unit = value => Math.min(1, Math.max(0, value));

export function heroScrollState(progress) {
  const reveal = unit(progress / .8);
  const lift = unit(progress / .65);
  return {
    galleryOpacity: 1 - unit((progress - .08) / .52),
    flowerOpacity: .65 + .35 * reveal,
    flowerProgress: unit((progress - .04) / .82),
    flowerY: 60 * (1 - reveal),
    flowerScale: .55 + .45 * reveal,
    copyY: -340 * lift,
    copyOpacity: 1 - unit((progress - .12) / .32),
  };
}
