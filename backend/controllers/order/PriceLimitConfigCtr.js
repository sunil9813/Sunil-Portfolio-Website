const asyncHandler = require("express-async-handler");
const PriceLimitConfigModel = require("../../models/order/PriceLimitConfigModel");

const createOrUpdatePriceLimit = asyncHandler(async (req, res) => {
  const { priceLimit } = req.body;

  try {
    let priceLimitConfig = await PriceLimitConfigModel.findOne();
    if (!priceLimitConfig) {
      priceLimitConfig = new PriceLimitConfigModel({ priceLimit });
    } else {
      priceLimitConfig.priceLimit = priceLimit;
    }

    await priceLimitConfig.save();

    res.status(200).json({ message: "Price limit configuration updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const getPriceLimit = asyncHandler(async (req, res) => {
  try {
    const priceLimitConfig = await PriceLimitConfigModel.findOne();

    if (!priceLimitConfig) {
      res.status(404).json({ message: "price limit configuration not found" });
    } else {
      res.status(200).json({ priceLimit: priceLimitConfig.priceLimit });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { createOrUpdatePriceLimit, getPriceLimit };
