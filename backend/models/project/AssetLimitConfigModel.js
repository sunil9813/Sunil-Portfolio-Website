const mongoose = require("mongoose");

const assetLimitConfigSchema = new mongoose.Schema({
  assetLimit: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
});

module.exports = mongoose.model("AssetLimitConfig", assetLimitConfigSchema);
