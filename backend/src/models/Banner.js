const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bannerType: {
      type: String,
      enum: ["hero-banner", "promo-banner", "slider-banner"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    slideNumber: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

bannerSchema.index({ bannerType: 1, isActive: 1, slideNumber: 1 });

module.exports = mongoose.model("Banner", bannerSchema);
