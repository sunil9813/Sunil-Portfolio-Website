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
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "orderItems.productModel",
      },
      productModel: {
        type: String,
        required: true,
        enum: ["Subject", "Project"],
      },
      title: {
        type: String,
        required: true,
      },
      slug: {
        type: String,
      },
      image: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        default: 0,
      },
      originalPrice: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
    method: {
      type: String,
    },
    transactionUuid: {
      type: String,
      index: true,
    },
    productCode: {
      type: String,
    },
    totalAmount: {
      type: Number,
    },
    initiatedAt: {
      type: Date,
    },
    verifiedAt: {
      type: Date,
    },
    failedAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
    invoiceOpenedAt: {
      type: Date,
    },
    invoiceDownloadedAt: {
      type: Date,
    },
    invoiceDownloadCount: {
      type: Number,
      default: 0,
    },
    invoiceEmailSentAt: {
      type: Date,
    },
    invoiceEmailSentCount: {
      type: Number,
      default: 0,
    },
    failureReason: {
      type: String,
    },
    responseData: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  paidAt: {
    type: Date,
  },
  subtotal: {
    type: Number,
    default: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  coupon: {
    code: {
      type: String,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed", null],
      default: null,
    },
    discountValue: {
      type: Number,
      default: 0,
    },
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
    enum: ["unpaid", "pending", "paid", "failed", "cancelled", "refunded"],
    default: "unpaid",
  },
  refund: {
    status: {
      type: String,
      enum: ["none", "requested", "approved", "rejected", "refunded"],
      default: "none",
    },
    requestedAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    reason: {
      type: String,
      default: "",
    },
    adminNote: {
      type: String,
      default: "",
    },
    refundMethod: {
      type: String,
      enum: ["original_payment", "bank_transfer", "esewa", "other"],
      default: "original_payment",
    },
    refundContact: {
      type: String,
      default: "",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
