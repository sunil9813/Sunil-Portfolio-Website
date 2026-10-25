export const reviewIndex = (position, total) => total > 0 ? ((position % total) + total) % total : 0;

export const reviewSlots = (cursor, total) => {
  if (!total) return [];
  return (total === 1 ? [0] : [-1, 0, 1]).map(offset => ({ offset, position: cursor + offset, index: reviewIndex(cursor + offset, total) }));
};

export const reviewPages = (current, total, limit = 5) => {
  const count = Math.min(total, limit);
  const start = Math.max(0, Math.min(total - count, current - Math.floor(count / 2)));
  return Array.from({ length: count }, (_, index) => start + index);
};

export const reviewAccent = index => {
  const hue = ((270 + index * 137.50776405) % 360).toFixed(3);
  return { accent: `hsl(${hue} 68% 77%)`, wash: `hsl(${hue} 66% 35% / .65)` };
};

export const reviewExcerpt = (review, limit = 240) => {
  const quote = review.isDemo ? review.quote.replace(/^Demo review — /, "") : review.quote;
  const characters = Array.from(quote);
  if (characters.length <= limit) return quote;
  const cut = characters.slice(0, limit).join("");
  const boundary = cut.lastIndexOf(" ");
  return cut.slice(0, boundary > limit * .7 ? boundary : cut.length).trimEnd() + "…";
};

export const reviewerName = review => review.isDemo ? review.name.replace(/ \(Demo\)$/, "") : review.name;
export const reviewerRole = review => review.isDemo ? review.title.replace(/ at Fictional preview project$/, "") : review.title;
