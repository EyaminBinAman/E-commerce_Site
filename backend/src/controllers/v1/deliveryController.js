const DeliveryZone = require("../../models/DeliveryZone");
const {
  getDeliveryZoneSettings,
} = require("../../services/deliveryZoneService");

const sendSuccess = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const parseNonNegativeNumber = (value, fieldName) => {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return { error: `${fieldName} must be a non-negative number` };
  }

  return { value: number };
};

const getDeliveryZones = async (_req, res, next) => {
  try {
    const zones = await getDeliveryZoneSettings();

    return sendSuccess(res, 200, "Delivery zones fetched successfully", { zones });
  } catch (error) {
    return next(error);
  }
};

const updateDeliveryZones = async (req, res, next) => {
  try {
    const { insideDhakaCharge, outsideDhakaCharge, freeDeliveryThreshold } = req.body;

    const cleanInside = parseNonNegativeNumber(insideDhakaCharge, "Inside Dhaka charge");
    if (cleanInside.error) {
      return sendError(res, 400, cleanInside.error);
    }

    const cleanOutside = parseNonNegativeNumber(outsideDhakaCharge, "Outside Dhaka charge");
    if (cleanOutside.error) {
      return sendError(res, 400, cleanOutside.error);
    }

    const cleanThreshold = parseNonNegativeNumber(
      freeDeliveryThreshold,
      "Free delivery threshold"
    );
    if (cleanThreshold.error) {
      return sendError(res, 400, cleanThreshold.error);
    }

    const zones = await DeliveryZone.findOneAndUpdate(
      { key: "default" },
      {
        key: "default",
        insideDhakaCharge: cleanInside.value,
        outsideDhakaCharge: cleanOutside.value,
        freeDeliveryThreshold: cleanThreshold.value,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return sendSuccess(res, 200, "Delivery zones updated successfully", {
      zones: {
        insideDhakaCharge: zones.insideDhakaCharge,
        outsideDhakaCharge: zones.outsideDhakaCharge,
        freeDeliveryThreshold: zones.freeDeliveryThreshold,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDeliveryZones,
  updateDeliveryZones,
};
