import assert from "node:assert/strict";
import test from "node:test";
import { normalizeCustomerReviews, reviewText, summarizeCustomerReviews } from "./testimonialData.js";

test("missing/malformed data and empty content are safe", () => {
  for (const value of [null, undefined, {}, { testimonialList: "bad" }, [null, {}, { content: " " }]]) {
    assert.deepEqual(normalizeCustomerReviews(value), []);
  }
});

test("demo reviews are labeled and never inflate customer ratings", () => {
  const reviews = normalizeCustomerReviews([{ content: "Real", rating: 4 }, { content: "Demo", rating: 5, isDemo: true }]);
  assert.equal(reviews[1].isDemo, true);
  const summary = summarizeCustomerReviews(reviews);
  assert.equal(summary.average, 4);
  assert.equal(summary.total, 1);
  assert.equal(summary.demo, 1);
  assert.equal(summary.rated, 1);
});

test("dates come only from valid timestamps", () => {
  const records = normalizeCustomerReviews([{ content: "First", createdAt: "2025-06-28T13:38:04.523Z" }, { content: "Second", createdAt: "invalid" }, { content: "Third" }]);
  assert.equal(records[0].date, "2025-06-28T13:38:04.523Z");
  assert.equal(records[1].date, null);
  assert.equal(records[2].date, null);
});

test("summary counts only valid supplied ratings and rounds distribution explicitly", () => {
  const result = summarizeCustomerReviews([{ rating: 5 }, { rating: 4.5 }, { rating: 2 }, { rating: null }, { rating: 8 }]);
  assert.equal(result.total, 5);
  assert.equal(result.rated, 3);
  assert.equal(result.average, 11.5 / 3);
  assert.deepEqual(result.distribution.map(row => row.count), [2, 0, 0, 1, 0]);
  assert.equal(summarizeCustomerReviews([]).average, null);
});

test("rich text becomes escaped plain-text display data", () => {
  assert.equal(reviewText('<p>Hello&nbsp;<b>world</b> &amp; &#x1F44B;</p><script>bad()</script>'), "Hello world & 👋");
  assert.equal(reviewText({}), "");
  assert.equal(reviewText("&#99999999;"), "");
});

test("only feedback is displayed and private fields are excluded", () => {
  const data = normalizeCustomerReviews({ testimonialList: [
    { _id: "a", type: "feedback", fullname: " Asha  Rai ", content: "Helpful work", position: "Founder", company: "Studio", rating: 4.5, email: "private", phone: "private" },
    { _id: "b", type: "inquiry", content: "Private inquiry" },
    { _id: "c", type: "contact", content: "Private message" },
    { _id: "a", content: "Duplicate" },
  ] });
  assert.equal(data.length, 1);
  assert.equal(data[0].name, "Asha Rai");
  assert.equal(data[0].title, "Founder at Studio");
  assert.equal(data[0].rating, 4.5);
  assert.ok(!("email" in data[0]) && !("phone" in data[0]));
});

test("fallback IDs, names, photos and optional ratings are safe", () => {
  const record = { content: "Good work", avatar: "javascript:alert(1)", rating: 8 };
  const [first] = normalizeCustomerReviews([record]);
  assert.equal(first.id, normalizeCustomerReviews([record])[0].id);
  assert.equal(first.name, "Customer");
  assert.equal(first.avatar, "");
  assert.equal(first.rating, null);
  assert.equal(normalizeCustomerReviews([{ content: "No score", rating: true }])[0].rating, null);
  const [user] = normalizeCustomerReviews([{ content: "Useful work", user: { name: "निरज कुमार", avatar: { url: "/image/avatar.png" } } }]);
  assert.equal(user.name, "निरज कुमार");
  assert.equal(user.avatar, "/image/avatar.png");
});
