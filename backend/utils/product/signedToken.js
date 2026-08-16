const crypto = require("crypto");

const base64UrlEncode = (value) => Buffer.from(value).toString("base64url");
const base64UrlDecode = (value) => Buffer.from(value, "base64url").toString("utf8");

const getSecret = () => process.env.DOWNLOAD_TOKEN_SECRET || process.env.JWT_SECRET || "download-token-dev-secret";

const signPayload = (encodedPayload) => crypto.createHmac("sha256", getSecret()).update(encodedPayload).digest("base64url");

const createSignedToken = (payload, ttlSeconds = 900) => {
  const fullPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    nonce: crypto.randomBytes(10).toString("hex"),
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
};

const verifySignedToken = (token) => {
  const [encodedPayload, signature] = String(token || "").split(".");

  if (!encodedPayload || !signature) {
    throw new Error("Invalid download token.");
  }

  const expectedSignature = signPayload(encodedPayload);

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error("Invalid download signature.");
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Download token expired.");
  }

  return payload;
};

module.exports = { createSignedToken, verifySignedToken };
