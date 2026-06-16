const DeliveryZone = require("../models/DeliveryZone");

const DEFAULT_SETTINGS = {
  insideDhakaCharge: 60,
  outsideDhakaCharge: 120,
  freeDeliveryThreshold: 500,
};

const roundMoney = (value) => {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
};

const normalizeDeliveryZone = (deliveryZone) => {
  return deliveryZone === "outside-dhaka" ? "outside-dhaka" : "inside-dhaka";
};

const getDeliveryZoneSettings = async () => {
  let settings = await DeliveryZone.findOne({ key: "default" });

  if (!settings) {
    settings = await DeliveryZone.create({
      key: "default",
      ...DEFAULT_SETTINGS,
    });
  }

  return {
    insideDhakaCharge: settings.insideDhakaCharge,
    outsideDhakaCharge: settings.outsideDhakaCharge,
    freeDeliveryThreshold: settings.freeDeliveryThreshold,
  };
};

const getDeliveryCharge = (deliveryZone, discountedSubtotal, settings) => {
  const normalizedZone = normalizeDeliveryZone(deliveryZone);
  const threshold = Number(settings?.freeDeliveryThreshold ?? DEFAULT_SETTINGS.freeDeliveryThreshold);
  const insideCharge = Number(settings?.insideDhakaCharge ?? DEFAULT_SETTINGS.insideDhakaCharge);
  const outsideCharge = Number(
    settings?.outsideDhakaCharge ?? DEFAULT_SETTINGS.outsideDhakaCharge
  );
  const subtotal = roundMoney(discountedSubtotal);
  const baseCharge = normalizedZone === "outside-dhaka" ? outsideCharge : insideCharge;
  const deliveryCharge =
    threshold > 0 && subtotal >= threshold ? 0 : roundMoney(baseCharge);

  return {
    deliveryZone: normalizedZone,
    deliveryCharge,
    freeDeliveryThreshold: threshold,
  };
};

module.exports = {
  DEFAULT_SETTINGS,
  getDeliveryZoneSettings,
  getDeliveryCharge,
  normalizeDeliveryZone,
  roundMoney,
};
