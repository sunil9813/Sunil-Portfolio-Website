const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token.toString()).digest("hex");
};

const generateChecksum = (data, secretKey) => {
  // Convert the payment data to a JSON string
  const jsonData = JSON.stringify(data);

  // Create a HMAC-SHA256 hash with the secret key
  const hash = crypto.createHmac("sha256", secretKey).update(jsonData).digest("hex");

  return hash;
};

const generateEsewaSignature = (message, secretKey) => {
  return crypto.createHmac("sha256", secretKey).update(message).digest("base64");
};

const safeCompare = (firstValue = "", secondValue = "") => {
  const firstBuffer = Buffer.from(firstValue);
  const secondBuffer = Buffer.from(secondValue);

  if (firstBuffer.length !== secondBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(firstBuffer, secondBuffer);
};

const formatUser = (userInfo) => {
  return {
    id: userInfo._id,
    name: userInfo.name,
    email: userInfo.email,
    phone: userInfo.phone,
    bio: userInfo.bio,
    avatar: userInfo.avatar,
    cover: userInfo.cover,
    role: userInfo.role,
    address: userInfo.address,
    isVerified: userInfo.isVerified,
  };
};
module.exports = {
  generateToken,
  hashToken,
  formatUser,
  generateChecksum,
  generateEsewaSignature,
  safeCompare,
};
