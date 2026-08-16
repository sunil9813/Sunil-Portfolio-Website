const requestBuckets = new Map();

const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
};

const getClientKey = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : String(forwardedFor || req.ip || req.socket?.remoteAddress || "");
  return ip.split(",")[0].trim() || "unknown";
};

const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 150, message = "Too many requests. Please try again later." } = {}) => {
  return (req, res, next) => {
    const now = Date.now();
    const bucketKey = `${req.baseUrl || req.path}:${getClientKey(req)}`;
    const bucket = requestBuckets.get(bucketKey);

    if (!bucket || bucket.expiresAt <= now) {
      requestBuckets.set(bucketKey, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    bucket.count += 1;

    if (bucket.count > max) {
      const retryAfterSeconds = Math.ceil((bucket.expiresAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({ success: false, error: message });
    }

    return next();
  };
};

setInterval(() => {
  const now = Date.now();

  for (const [key, bucket] of requestBuckets.entries()) {
    if (bucket.expiresAt <= now) {
      requestBuckets.delete(key);
    }
  }
}, 10 * 60 * 1000).unref();

module.exports = {
  createRateLimiter,
  securityHeaders,
};
