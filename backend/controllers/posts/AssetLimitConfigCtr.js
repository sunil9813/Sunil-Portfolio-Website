const asyncHandler = require("express-async-handler");
const AssetLimitConfigModel = require("../../models/posts/AssetLimitConfigModel");

const createOrUpdateAssetLimit = asyncHandler(async (req, res) => {
  const { assetLimit } = req.body;

  try {
    let assetLimitConfig = await AssetLimitConfigModel.findOne();
    if (!assetLimitConfig) {
      assetLimitConfig = new AssetLimitConfigModel({ assetLimit });
    } else {
      assetLimitConfig.assetLimit = assetLimit;
    }

    await assetLimitConfig.save();

    res.status(200).json({ message: "Asset limit configuration updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const getAssetLimit = asyncHandler(async (req, res) => {
  try {
    const assetLimitConfig = await AssetLimitConfigModel.findOne();

    if (!assetLimitConfig) {
      res.status(404).json({ message: "Asset limit configuration not found" });
    } else {
      res.status(200).json({ assetLimit: assetLimitConfig.assetLimit });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { createOrUpdateAssetLimit, getAssetLimit };
