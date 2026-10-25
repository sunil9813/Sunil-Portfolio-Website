import test from "node:test";
import assert from "node:assert/strict";
import { heroTileMotion, heroTileKeyframes } from "./heroTileMotion.js";

const tile = { x: 84, y: 22, angle: -17, tilt: -21, photo: 10, size: 1.05 };

test("image field continuously moves and turns without scrolling", () => {
  const initial = heroTileMotion(tile, 0);
  const later = heroTileMotion(tile, 10);
  assert.notEqual(initial.transform, later.transform);
  assert.ok(later.left < initial.left);
  assert.match(later.transform, /rotateX.*rotateY.*rotateZ/);
});

test("browser keyframes recycle beyond both edges and close the loop", () => {
  const { frames, duration } = heroTileKeyframes(tile);
  assert.equal(frames[0].offset, 0);
  assert.equal(frames.at(-1).offset, 1);
  assert.equal(heroTileMotion(tile, 0).left, heroTileMotion(tile, duration / 1000).left);
  assert.ok(frames.every((frame, index) => index === 0 || frame.offset >= frames[index - 1].offset));
  const crossing = (tile.x + 35) / 150;
  assert.ok(heroTileMotion(tile, (crossing - .000001) * duration / 1000).left < -34);
  assert.ok(heroTileMotion(tile, (crossing + .000001) * duration / 1000).left > 114);
});

test("long-running motion stays bounded and deterministic", () => {
  for (const time of [0, 10, 120, 1000, 100000]) {
    const frame = heroTileMotion(tile, time, .5);
    assert.ok(frame.left >= -35 && frame.left < 115);
    assert.ok(!frame.transform.includes("NaN"));
    assert.deepEqual(frame, heroTileMotion(tile, time, .5));
  }
});

test("staggered companions keep every row populated throughout a full cycle", () => {
  for (let seconds = 0; seconds <= 560; seconds += 2) {
    const positions = [tile, { ...tile, x: tile.x + 75 }].map(item => heroTileMotion(item, seconds).left);
    assert.ok(positions.some(left => left >= -10 && left <= 100));
  }
});

test("middle-edge anchors stay outside the center mask while turning", () => {
  for (const left of [5, 85]) {
    const anchor = { ...tile, x: left, edge: true };
    for (let seconds = 0; seconds <= 560; seconds += 2) {
      assert.equal(heroTileMotion(anchor, seconds).left, left);
    }
    assert.notEqual(heroTileMotion(anchor, 0).transform, heroTileMotion(anchor, 10).transform);
  }
});
