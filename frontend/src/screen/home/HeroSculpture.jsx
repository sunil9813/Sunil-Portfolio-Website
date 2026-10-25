import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;
const PALETTE = [[146, 216, 223], [243, 242, 239], [223, 178, 138]];

function ringPoint(layer, a, b) {
  const angle = layer * TAU / 3;
  const radius = 1.08 + 0.23 * Math.cos(b);
  const x = radius * Math.cos(a);
  const y = radius * Math.sin(a);
  const z = 0.23 * Math.sin(b);
  const tiltedY = y * 0.57 - z * 0.82;
  const tiltedZ = y * 0.82 + z * 0.57;
  return { x: x * Math.cos(angle) - tiltedY * Math.sin(angle), y: x * Math.sin(angle) + tiltedY * Math.cos(angle), z: tiltedZ, layer };
}

// Generate surfaces and circuit contours once; reuse projection buffers each frame.
function makeSculpture() {
  const points = [];
  const contours = [];
  for (let layer = 0; layer < 3; layer++) {
    for (let u = 0; u < 96; u++) {
      for (let v = 0; v < 16; v++) {
        points.push({ ...ringPoint(layer, u / 96 * TAU, v / 16 * TAU), size: v % 4 === 0 ? 1.3 : 0.85 });
      }
    }
    for (let v = 0; v < 4; v++) {
      contours.push(Array.from({ length: 97 }, (_, u) => ringPoint(layer, u / 96 * TAU, v / 4 * TAU)));
    }
  }
  return { points, contours };
}

export function HeroSculpture({ paused, reducedMotion, activeLayer }) {
  const canvasRef = useRef(null);
  const settings = useRef({ paused, reducedMotion, activeLayer });
  useEffect(() => { settings.current = { paused, reducedMotion, activeLayer }; }, [paused, reducedMotion, activeLayer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    const host = canvas.parentElement;
    host.dataset.rendered = "true";
    const geometry = makeSculpture();
    const projected = geometry.points.map(() => ({ x: 0, y: 0, z: 0, layer: 0, size: 0 }));
    const scratch = { x: 0, y: 0, z: 0 };
    const core = Array.from({ length: 8 }, (_, i) => ({ x: (i & 1 ? 1 : -1) * 0.28, y: (i & 2 ? 1 : -1) * 0.28, z: (i & 4 ? 1 : -1) * 0.28 }));
    const coreScreen = core.map(() => ({ x: 0, y: 0, z: 0 }));
    const pointer = { x: 0, y: 0 };
    const rotation = { x: -0.28, y: 0.25 };
    let width = 0, height = 0, frame = 0, previous = 0, elapsed = 0;
    let inView = false, disposed = false;
    let layerFocus = [1, 1, 1];

    function draw() {
      context.clearRect(0, 0, width, height);
      const entrance = settings.current.reducedMotion ? 1 : Math.min(elapsed / 1300, 1);
      const assemble = 1 - Math.pow(1 - entrance, 4);
      const scale = Math.min(width, height) * 0.31;
      const turn = elapsed * 0.000085 + rotation.y;
      const cosY = Math.cos(turn), sinY = Math.sin(turn);
      const cosX = Math.cos(rotation.x), sinX = Math.sin(rotation.x);
      function project(point, target) {
        const separation = point.layer === undefined ? 0 : (1 - assemble) * (point.layer - 1) * .45;
        const px = point.x * (.88 + assemble * .12);
        const py = point.y + separation;
        const x = px * cosY + point.z * sinY;
        const depth = -px * sinY + point.z * cosY;
        const y = py * cosX - depth * sinX;
        const z = py * sinX + depth * cosX;
        const perspective = 4.8 / (4.8 - z);
        target.x = width / 2 + x * scale * perspective;
        target.y = height / 2 + y * scale * perspective;
        target.z = z;
        target.layer = point.layer;
        target.size = (point.size || 1) * perspective;
      }
      for (const contour of geometry.contours) {
        const layer = contour[0].layer;
        const [r, g, b] = PALETTE[layer];
        context.strokeStyle = `rgba(${r},${g},${b},${0.14 * layerFocus[layer]})`;
        context.lineWidth = 0.65;
        context.beginPath();
        contour.forEach((point, i) => {
          project(point, scratch);
          if (i === 0) context.moveTo(scratch.x, scratch.y);
          else context.lineTo(scratch.x, scratch.y);
        });
        context.stroke();
      }
      geometry.points.forEach((point, i) => project(point, projected[i]));
      projected.sort((a, b) => a.z - b.z);
      for (const point of projected) {
        const color = PALETTE[point.layer];
        const depthLight = (point.z + 1.35) / 2.7;
        const alpha = (0.25 + depthLight * 0.75) * layerFocus[point.layer];
        context.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
        context.beginPath();
        context.arc(point.x, point.y, point.size * (0.8 + depthLight * 0.3), 0, TAU);
        context.fill();
      }

      // A central application core and three traveling signals explain the connection.
      core.forEach((point, i) => project(point, coreScreen[i]));
      context.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        for (let bit = 1; bit <= 4; bit *= 2) {
          const j = i ^ bit;
          if (j < i) continue;
          context.strokeStyle = `rgba(146,216,223,${coreScreen[i].z > 0 ? 0.75 : 0.28})`;
          context.beginPath();
          context.moveTo(coreScreen[i].x, coreScreen[i].y);
          context.lineTo(coreScreen[j].x, coreScreen[j].y);
          context.stroke();
        }
        context.fillStyle = "#b9e7eb";
        context.beginPath(); context.arc(coreScreen[i].x, coreScreen[i].y, 2, 0, TAU); context.fill();
      }
      for (let layer = 0; layer < 3; layer++) {
        const [r, g, b] = PALETTE[layer];
        for (let trail = 6; trail >= 0; trail--) {
          const point = ringPoint(layer, elapsed * 0.0003 + layer * TAU / 3 - trail * 0.025, 0);
          project(point, scratch);
          context.fillStyle = `rgba(${r},${g},${b},${(1 - trail / 7) * layerFocus[layer]})`;
          context.beginPath(); context.arc(scratch.x, scratch.y, trail === 0 ? 3.2 : 1.5, 0, TAU); context.fill();
        }
      }
    }
    function tick(now) {
      frame = 0;
      if (disposed || !inView || document.hidden) return;
      const delta = Math.min(now - previous, 50);
      const frameInterval = width < 600 ? 1000 / 30 : 1000 / 60;
      if (now - previous >= frameInterval - 1) {
        previous = now;
        const current = settings.current;
        const moving = !current.paused && !current.reducedMotion;
        if (moving) {
          elapsed += delta;
          rotation.x += (-0.28 + pointer.y * 0.3 - rotation.x) * 0.055;
          rotation.y += (0.25 + pointer.x * 0.42 - rotation.y) * 0.055;
        }
        let changing = false;
        layerFocus = layerFocus.map((value, index) => {
          const target = current.activeLayer === null || current.activeLayer === index ? 1 : 0.24;
          const next = current.reducedMotion ? target : value + (target - value) * 0.1;
          if (Math.abs(target - next) > 0.005) changing = true;
          return next;
        });
        draw();
        // Static scenes stop scheduling frames until an interaction wakes them.
        if (!moving && !changing) return;
      }
      frame = requestAnimationFrame(tick);
    }
    function start() {
      if (!frame && inView && !document.hidden && !disposed) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }
    function resize() {
      const rect = host.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, width < 600 ? 1.5 : 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(); start();
    }
    function move(event) {
      if (event.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
    }
    function leave() { pointer.x = 0; pointer.y = 0; }
    function visibility() {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else start();
    }
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else { cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: 0.05 });
    host.addEventListener("sculpture-update", start);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    resizeObserver.observe(host); intersectionObserver.observe(host); resize();
    return () => {
      disposed = true; cancelAnimationFrame(frame);
      resizeObserver.disconnect(); intersectionObserver.disconnect();
      host.removeEventListener("sculpture-update", start);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      delete host.dataset.rendered;
    };
  }, []);

  useEffect(() => { canvasRef.current?.parentElement.dispatchEvent(new Event("sculpture-update")); }, [paused, reducedMotion, activeLayer]);

  return <div className="hero-sculpture" aria-hidden="true"><div className="hero-sculpture__fallback"><i /><i /><i /></div><canvas ref={canvasRef} /></div>;
}
