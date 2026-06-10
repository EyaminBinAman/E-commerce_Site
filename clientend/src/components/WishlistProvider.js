"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);
const storageKey = "pawtail-wishlist";

const normalizeProduct = (product) => ({
  _id: product._id,
  name: product.name,
  slug: product.slug,
  image: product.images?.[0] || product.image || null,
  price: product.price,
  discountPrice: product.discountPrice,
  brand: product.brand?.name || product.brand || null,
});

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedItems = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setItems(Array.isArray(storedItems) ? storedItems : []);
    } catch (_error) {
      setItems([]);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (isReady) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [isReady, items]);

  const isWishlisted = useCallback(
    (productId) => items.some((item) => item._id === productId),
    [items]
  );

  const addToWishlist = useCallback((product) => {
    const normalizedProduct = normalizeProduct(product);

    setItems((currentItems) => {
      if (currentItems.some((item) => item._id === normalizedProduct._id)) {
        return currentItems;
      }

      return [normalizedProduct, ...currentItems];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item._id !== productId)
    );
  }, []);

  const toggleWishlist = useCallback(
    (product) => {
      if (isWishlisted(product._id)) {
        removeFromWishlist(product._id);
        return false;
      }

      addToWishlist(product);
      return true;
    },
    [addToWishlist, isWishlisted, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      wishlistItems: items,
      wishlistCount: items.length,
      isReady,
      isWishlisted,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    }),
    [
      addToWishlist,
      clearWishlist,
      isReady,
      isWishlisted,
      items,
      removeFromWishlist,
      toggleWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}
