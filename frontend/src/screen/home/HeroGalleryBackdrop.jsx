import { useEffect, useRef } from "react";
import { motion as Motion } from "framer-motion";

// Public UI8 product previews requested for this local design preview.
// Third-party work, not portfolio projects. Source/rights notes: .impeccable/hero-ui8-thumbnails.md.
const photos = [
  "697ec61ebb6c8a00338c0993/604_420_1.webp", // Fruitopia — Pixel Library
  "6acded8b8d94c700338a340d/604_420_1.webp", // Rebound — SomeHow.Studio
  "6acb30424d93eb003383fde1/604_420_1.webp", // Tempo — SomeHow.Studio
  "6acdf3f9fb125c0033ad8483/604_420_2.webp", // Instrument — UI8
  "6a96163a75bf2600332c7067/604_420_1.webp", // Cushion — Moyin
  "6ac98ada5267f500438ff412/604_420_1.webp", // Vaulta — HeyGar
  "6aca6268584cfa0039370558/604_420_1.webp", // FlyStudio — Natalia Ryasnyanskaya
  "690ccc6634a235003345e8d7/604_420_1.webp", // PlanIQ — Pixel Library
  "6ac129295c5ed1003909ee6c/604_420_1.webp", // Keepsy — ibraadesign
  "6ac34d13c25f37003597fe24/604_420_1.webp", // Relay — JMJ Studio
  "6ac33ec825d0560039295b41/604_420_1.webp", // Oláq — Podro Supply
];

// Measured reference geometry: clockwise concentric rings with upright imagery.
// Implemented with DOM transforms so the existing images need no WebGL textures.
const rings = [
  { radius: .20, cap: 280, seconds: 50, count: 9, phase: 0 },
  { radius: .385, cap: 580, seconds: 85, count: 13, phase: 24 },
  { radius: .57, cap: 880, seconds: 120, count: 17, phase: 42 },
  { radius: .755, cap: 1180, seconds: 155, count: 21, phase: 60 },
];
const cards = rings.flatMap((ring, ringIndex) =>
  Array.from({ length: ring.count }, (_, index) => ({
    ring: ringIndex,
    angle: (ring.phase + index * 360 / ring.count) * Math.PI / 180,
    photo: (ringIndex * 9 + index) % photos.length,
    radius: 20 + (ringIndex * 53 + index * 17) % 14,
  }))
);

export const HeroGalleryBackdrop = ({ progress, opacity, reduced }) => {
  const fieldRef = useRef(null);
  const tilesRef = useRef([]);
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    let frame = 0;
    let previousTime = 0;
    let previousScroll = window.scrollY;
    let visible = false;
    let width = 0;
    let height = 0;
    const angles = rings.map(() => 0);
    const boosts = rings.map(() => 0);
    const draw = () => {
      const vmax = Math.max(width, window.innerHeight);
      cards.forEach((card, index) => {
        const tile = tilesRef.current[index];
        if (!tile) return;
        const ring = rings[card.ring];
        const angle = card.angle + angles[card.ring];
        const spread = 1 + boosts[card.ring] / 14 * (.08 + .06 * card.ring);
        const radius = Math.min(vmax * ring.radius, ring.cap) * spread;
        const x = radius * Math.sin(angle);
        const y = -radius * Math.cos(angle);
        const rotation = angle * 180 / Math.PI + 90;
        tile.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${rotation}deg)`;
        // Counter-rotate the photograph; only its rounded viewing window turns.
        tile.firstElementChild.style.transform = `translate(-50%,-50%) rotate(${-rotation}deg)`;
      });
    };
    const tick = time => {
      frame = 0;
      const dt = previousTime ? Math.min((time - previousTime) / 1000, .064) : 0;
      previousTime = time;
      const scroll = window.scrollY;
      const velocity = dt ? Math.abs(scroll - previousScroll) / dt : 0;
      previousScroll = scroll;
      const target = Math.min(velocity / 300, 14);
      rings.forEach((ring, index) => {
        boosts[index] += (target - boosts[index]) * (1 - Math.exp(-dt / (.1 + .14 * index)));
        angles[index] += dt * Math.PI * 2 / ring.seconds * (1 + boosts[index] * (1 + .6 * index));
      });
      draw();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      const playing = visible && !document.hidden && !reduced && progress.get() < .6;
      if (playing && !frame) {
        previousTime = 0;
        previousScroll = window.scrollY;
        frame = requestAnimationFrame(tick);
      } else if (!playing && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      field.style.setProperty("--tile-width", `${Math.min(144, width * .14)}px`);
      field.style.setProperty("--image-size", `${Math.min(236, width * .225)}px`);
      field.style.maskImage = `radial-gradient(ellipse ${1.2 * Math.min(width, 1800)}px ${height * 1.05}px at 50% 50%, transparent 24%, #0008 42%, #000e 62%, black 78%)`;
      draw();
    });
    resize.observe(field);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(field);
    const unsubscribe = progress.on("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      unsubscribe();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [progress, reduced]);

  return <Motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent)]" style={{ opacity: reduced ? .32 : opacity }}>
    <div ref={fieldRef} className="absolute inset-x-0 -top-16 bottom-0">
      {cards.map((card, index) => <div key={index} ref={node => { tilesRef.current[index] = node; }} data-hero-tile
        className="absolute left-1/2 top-1/2 aspect-[4/3] w-[var(--tile-width,144px)] overflow-hidden border border-white/10"
        style={{ borderRadius: card.radius }}>
        <img src={`https://images.ui8.net/product/${photos[card.photo]}`} alt="" width="604" height="420" decoding="async" referrerPolicy="no-referrer" draggable="false"
          onError={event => { if (event.currentTarget.src.startsWith("https://images.ui8.net/")) event.currentTarget.src = "/image/home/story-editorial/responsive.jpg"; }}
          className="absolute left-1/2 top-1/2 aspect-square w-[var(--image-size,236px)] max-w-none object-cover brightness-[.38] saturate-[.8]" />
      </div>)}
    </div>
  </Motion.div>;
};
