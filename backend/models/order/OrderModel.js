const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    phoneNo: {
      type: String,
      require: true,
    },
    postalCode: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  paidAt: {
    type: Date,
  },
  /*  taxPrice: {
    type: Number,
    require: true,
    default: 0.0,
  }, */
  amount: {
    type: Number,
    require: true,
    default: 0.0,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "unpaid",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
