const mongoose = require("mongoose");

const deliveryZoneSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "default",
      unique: true,
      trim: true,
    },
    insideDhakaCharge: {
      type: Number,
      default: 60,
      min: 0,
    },
    outsideDhakaCharge: {
      type: Number,
      default: 120,
      min: 0,
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 500,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "delivery_zones",
  }
);

module.exports = mongoose.model("DeliveryZone", deliveryZoneSchema);
