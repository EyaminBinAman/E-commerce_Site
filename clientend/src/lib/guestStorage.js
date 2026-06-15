const GUEST_CART_KEY = "pawtail-guest-cart";
const GUEST_WISHLIST_KEY = "pawtail-wishlist";

export const getGuestCartLineKey = (productId, variantId) =>
  `${productId}:${variantId || "default"}`;

export const readGuestCartItems = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export const writeGuestCartItems = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

export const clearGuestCartItems = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};

export const readGuestWishlistItems = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export const writeGuestWishlistItems = (items) => {
  localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
};

export const clearGuestWishlistItems = () => {
  localStorage.removeItem(GUEST_WISHLIST_KEY);
};

export const buildGuestCartItem = (product, variant, quantity) => {
  const basePrice =
    typeof product.discountPrice === "number"
      ? product.discountPrice
      : product.price;
  const finalUnitPrice =
    Number(basePrice || 0) + Number(variant?.priceAdjustment || 0);
  const stockQuantity = variant?.stockQuantity ?? product.stockQuantity ?? 0;

  return {
    _id: getGuestCartLineKey(product._id, variant?._id),
    product: {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] || product.image || null,
      price: product.price,
      discountPrice: product.discountPrice,
    },
    variant: variant
      ? {
          _id: variant._id,
          name: variant.name,
          value: variant.value,
          sku: variant.sku,
          priceAdjustment: variant.priceAdjustment,
        }
      : null,
    quantity,
    stockQuantity,
    isAvailable: !product.isOutOfStock && stockQuantity > 0,
    finalUnitPrice,
    itemSubtotal: finalUnitPrice * quantity,
  };
};

export const formatGuestCart = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.itemSubtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    _id: "guest",
    items,
    itemCount,
    subtotal,
  };
};

export const normalizeWishlistProduct = (product) => ({
  _id: product._id,
  name: product.name,
  slug: product.slug,
  image: product.images?.[0] || product.image || null,
  price: product.price,
  discountPrice: product.discountPrice,
  brand: product.brand?.name || product.brand || null,
});

export const calculateGuestCartSummary = ({
  subtotal,
  deliveryZone = "inside-dhaka",
  promoCode = "",
}) => {
  const deliveryCharge =
    subtotal >= 500 ? 0 : deliveryZone === "outside-dhaka" ? 120 : 60;
  const vat = subtotal * 0.05;

  return {
    itemsSubtotal: subtotal,
    voucherDiscount: 0,
    discountedSubtotal: subtotal,
    deliveryZone,
    deliveryCharge,
    freeDeliveryThreshold: 500,
    vatRate: 0.05,
    vat,
    extraCharges: [],
    extraChargeTotal: 0,
    grandTotal: subtotal + deliveryCharge + vat,
    voucherMessage: promoCode ? "Sign in to apply voucher codes" : "",
  };
};
