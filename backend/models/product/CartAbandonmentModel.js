const mongoose = require("mongoose");

const cartAbandonmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
        },
        productType: {
          type: String,
          default: "",
        },
        title: {
          type: String,
          default: "",
        },
        price: {
          type: Number,
          default: 0,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["open", "converted", "dismissed"],
      default: "open",
      index: true,
    },
    reminderSentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

cartAbandonmentSchema.index({ user: 1, status: 1 });

module.exports = mongoose.models.CartAbandonment || mongoose.model("CartAbandonment", cartAbandonmentSchema);
