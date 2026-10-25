const entities = { amp: "&", quot: '"', apos: "'", nbsp: " ", lt: "<", gt: ">" };

export const reviewText = (value) => {
  if (typeof value !== "string") return "";
  return value
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|nbsp|lt|gt);/gi, (match, entity) => {
      if (!entity.startsWith("#")) return entities[entity.toLowerCase()] ?? match;
      const point = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff) ? String.fromCodePoint(point) : "";
    })
    .replace(/\s+/g, " ").trim();
};

const avatarUrl = (asset) => {
  const url = typeof asset === "string" ? asset : asset?.filePath || asset?.url;
  if (typeof url !== "string") return "";
  if (/^\/(?!\/)/.test(url)) return url;
  try { const parsed = new URL(url); return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : ""; } catch { return ""; }
};

const fallbackId = (value) => {
  let hash = 2166136261;
  for (const character of value) hash = Math.imul(hash ^ character.codePointAt(0), 16777619);
  return `review-${hash >>> 0}`;
};

export const normalizeCustomerReviews = (payload) => {
  const list = Array.isArray(payload) ? payload : payload?.testimonialList;
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list.flatMap((item) => {
    if (!item || typeof item !== "object" || (item.type && item.type !== "feedback")) return [];
    const quote = reviewText(item.content);
    if (!quote) return [];
    const name = reviewText(item.fullname) || reviewText(item.user?.name) || "Customer";
    const title = [reviewText(item.position), reviewText(item.company)].filter(Boolean).join(" at ");
    const id = typeof item._id === "string" && item._id ? item._id : fallbackId(`${name}\n${title}\n${quote}`);
    if (seen.has(id)) return [];
    seen.add(id);
    const rating = Number(item.rating);
    const timestamp = typeof item.createdAt === "string" && /^\d{4}-\d{2}-\d{2}T/.test(item.createdAt) ? new Date(item.createdAt) : null;
    return [{
      id, quote, name, title, isDemo: item.isDemo === true,
      date: timestamp && Number.isFinite(timestamp.getTime()) ? timestamp.toISOString() : null,
      avatar: avatarUrl(item.avatar) || avatarUrl(item.user?.avatar),
      initials: name.split(/\s+/).slice(0, 2).map((word) => Array.from(word)[0]).join("").toUpperCase(),
      rating: ["string", "number"].includes(typeof item.rating) && item.rating !== "" && Number.isFinite(rating) && rating >= 1 && rating <= 5 ? rating : null,
    }];
  });
};

export const summarizeCustomerReviews = (reviews) => {
  const real = reviews.filter((review) => !review.isDemo);
  const rated = real.filter((review) => Number.isFinite(review.rating) && review.rating >= 1 && review.rating <= 5);
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: rated.filter((review) => Math.round(review.rating) === stars).length }));
  return { total: real.length, demo: reviews.length - real.length, rated: rated.length, average: rated.length ? rated.reduce((sum, review) => sum + review.rating, 0) / rated.length : null, distribution };
};
