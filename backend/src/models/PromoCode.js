const mongoose = require("mongoose");

const scopeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["all", "items", "categories", "products", "users", "new-users"],
      default: "all",
    },
    itemIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    userIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { _id: false }
);

const usageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const promoCodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameNormalized: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "amount"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxAmount: {
      type: Number,
      default: null,
      min: 0,
    },
    scope: {
      type: scopeSchema,
      default: () => ({ type: "all" }),
    },
    totalUsageLimit: {
      type: Number,
      default: null,
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usageLimitPerUser: {
      type: Number,
      default: 1,
      min: 1,
    },
    usageRecords: [usageSchema],
    startDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

promoCodeSchema.pre("validate", function setNormalizedName(next) {
  if (this.name) {
    this.nameNormalized = this.name.trim().toLowerCase();
  }

  next();
});

promoCodeSchema.pre("validate", function validatePromoCode(next) {
  if (this.discountType === "percentage" && this.discountValue > 100) {
    return next(new Error("Percentage discount cannot be more than 100"));
  }

  if (this.expiryDate <= this.startDate) {
    return next(new Error("Expiry date must be after start date"));
  }

  return next();
});

module.exports = mongoose.model("PromoCode", promoCodeSchema);
