import assert from "node:assert/strict";
import test from "node:test";
import { reviewAccent, reviewExcerpt, reviewIndex, reviewPages, reviewSlots } from "./testimonialSpotlightData.js";

test("carousel wraps both ways and supports zero, one and two reviews", () => {
  assert.equal(reviewIndex(-1, 13), 12);
  assert.equal(reviewIndex(13, 13), 0);
  assert.deepEqual(reviewSlots(0, 0), []);
  assert.deepEqual(reviewSlots(10, 1).map(slot => slot.index), [0]);
  assert.deepEqual(reviewSlots(0, 2).map(slot => slot.index), [1, 0, 1]);
  assert.deepEqual(reviewSlots(0, 13).map(slot => slot.index), [12, 0, 1]);
  assert.equal(new Set(reviewSlots(-2, 2).map(slot => slot.position)).size, 3);
});

test("pagination stays bounded and includes the current review", () => {
  for (let current = 0; current < 13; current++) {
    const pages = reviewPages(current, 13);
    assert.equal(pages.length, 5);
    assert.ok(pages.includes(current));
    assert.ok(pages.every(index => index >= 0 && index < 13));
  }
  assert.deepEqual(reviewPages(0, 1), [0]);
  assert.deepEqual(reviewPages(0, 0), []);
});

test("every feedback item receives a distinct accent, not a repeated palette", () => {
  const accents = Array.from({ length: 100 }, (_, index) => reviewAccent(index).accent);
  assert.equal(new Set(accents).size, 100);
});

test("excerpts preserve short feedback and safely shorten long Unicode text", () => {
  assert.equal(reviewExcerpt({ quote: "Good work", isDemo: false }), "Good work");
  assert.equal(reviewExcerpt({ quote: "Demo review — Helpful", isDemo: true }), "Helpful");
  const result = reviewExcerpt({ quote: "👋".repeat(400) }, 10);
  assert.equal(Array.from(result).length, 11);
  assert.ok(result.endsWith("…"));
});
