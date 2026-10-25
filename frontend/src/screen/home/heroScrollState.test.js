import test from "node:test";
import assert from "node:assert/strict";
import { heroScrollState } from "./heroScrollState.js";

test("gallery leads, then the flower is revealed and finishes fully open", () => {
  assert.equal(heroScrollState(0).galleryOpacity, 1);
  assert.equal(heroScrollState(0).flowerOpacity, .65);
  assert.equal(heroScrollState(0).flowerProgress, 0);
  assert.equal(heroScrollState(1).galleryOpacity, 0);
  assert.equal(heroScrollState(1).flowerOpacity, 1);
  assert.equal(heroScrollState(1).flowerProgress, 1);
  assert.equal(heroScrollState(1).copyY, -340);
  assert.equal(heroScrollState(1).copyOpacity, 0);
  assert.equal(heroScrollState(1).flowerScale, 1);
  assert.equal(heroScrollState(1).flowerY, 0);
});

test("scroll values stay bounded and reverse without retained state", () => {
  for (const progress of [-1, 0, .25, .5, .75, 1, 2]) {
    const state = heroScrollState(progress);
    for (const key of ["galleryOpacity", "flowerOpacity", "flowerProgress"]) assert.ok(state[key] >= 0 && state[key] <= 1);
    assert.ok(state.copyY >= -340 && state.copyY <= 0);
    assert.ok(state.flowerScale >= .55 && state.flowerScale <= 1);
  }
  const opening = [.2, .4, .6].map(heroScrollState);
  const closing = [.6, .4, .2].map(heroScrollState).reverse();
  assert.deepEqual(opening, closing);
});
