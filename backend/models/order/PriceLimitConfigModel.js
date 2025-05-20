const mongoose = require("mongoose");

const priceLimitConfigSchema = new mongoose.Schema({
  priceLimit: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
});

module.exports = mongoose.model("PriceLimitConfig", priceLimitConfigSchema);
