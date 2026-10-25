import assert from "node:assert/strict";
import test from "node:test";
import { bloomConnectionGeometry } from "./projectBloomConnection.js";

test("the source stem meets its anchor at mobile, laptop and wide sizes", () => {
  for (const [width, rootX] of [[320, 94], [390, 110], [760, 220], [1280, 720], [1470, 830], [1920, 1100]]) {
    const plane = bloomConnectionGeometry({ width, rootX, rootY: 400, sectionTop: 510 });
    const scale = plane.width / 1280;
    assert.ok(Math.abs(plane.left + 70 * scale - rootX) < .001);
    assert.equal(plane.top + 510, 400);
    assert.ok(Math.abs(plane.width / plane.height - 1280 / 720) < .001);
    assert.ok(plane.left + 1060 * scale <= width - 19.999);
    assert.ok(plane.sectionHeight >= (width <= 760 ? 320 : 480));
  }
});

test("media-query mode can differ from the scrollbar-reduced content width", () => {
  const plane = bloomConnectionGeometry({ width: 746, rootX: 210, rootY: 400, sectionTop: 510, mobile: false });
  assert.ok(plane.sectionHeight >= 480);
});
