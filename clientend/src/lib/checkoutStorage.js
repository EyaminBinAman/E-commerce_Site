const CHECKOUT_PREFS_KEY = "pawtail-checkout-prefs";

export const saveCheckoutPrefs = ({ promoCode = "", deliveryZone = "inside-dhaka" } = {}) => {
  sessionStorage.setItem(
    CHECKOUT_PREFS_KEY,
    JSON.stringify({ promoCode, deliveryZone })
  );
};

export const readCheckoutPrefs = () => {
  try {
    const stored = JSON.parse(sessionStorage.getItem(CHECKOUT_PREFS_KEY) || "{}");
    return {
      promoCode: stored.promoCode || "",
      deliveryZone: stored.deliveryZone || "inside-dhaka",
    };
  } catch {
    return { promoCode: "", deliveryZone: "inside-dhaka" };
  }
};

export const clearCheckoutPrefs = () => {
  sessionStorage.removeItem(CHECKOUT_PREFS_KEY);
};
