"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { apiRequest } from "@/lib/api";

const WishlistContext = createContext(null);

function normalizeWishlistItems(items = []) {
  return items.map((item) => ({
    _id: item._id,
    name: item.name,
    slug: item.slug,
    image: item.image || item.images?.[0] || null,
    price: item.price,
    discountPrice: item.discountPrice,
    brand: item.brand || item.brand?.name || null,
  }));
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const refreshWishlist = useCallback(async () => {
    try {
      const data = await apiRequest("/wishlist/get-wishlist");
      const nextItems = normalizeWishlistItems(data.wishlist?.items || []);
      setItems(nextItems);
      return nextItems;
    } catch (error) {
      if (error.status === 401) {
        setItems([]);
        return [];
      }
      throw error;
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    refreshWishlist().catch(() => undefined);
  }, [refreshWishlist]);

  const isWishlisted = useCallback(
    (productId) => items.some((item) => item._id === productId),
    [items]
  );

  const addToWishlist = useCallback(async (product) => {
    const data = await apiRequest("/wishlist/add-to-wishlist", {
      method: "POST",
      body: JSON.stringify({ productId: product._id }),
    });

    const nextItems = normalizeWishlistItems(data.wishlist?.items || []);
    setItems(nextItems);
    return nextItems;
  }, []);

  const removeFromWishlist = useCallback(async (productId) => {
    const data = await apiRequest(`/wishlist/remove-wishlist-item/${productId}`, {
      method: "DELETE",
    });

    const nextItems = normalizeWishlistItems(data.wishlist?.items || []);
    setItems(nextItems);
    return nextItems;
  }, []);

  const toggleWishlist = useCallback(
    async (product) => {
      if (isWishlisted(product._id)) {
        await removeFromWishlist(product._id);
        return false;
      }

      await addToWishlist(product);
      return true;
    },
    [addToWishlist, isWishlisted, removeFromWishlist]
  );

  const clearWishlist = useCallback(async () => {
    const data = await apiRequest("/wishlist/clear-wishlist", {
      method: "DELETE",
    });
    const nextItems = normalizeWishlistItems(data.wishlist?.items || []);
    setItems(nextItems);
    return nextItems;
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
      refreshWishlist,
    }),
    [
      addToWishlist,
      clearWishlist,
      isReady,
      isWishlisted,
      items,
      refreshWishlist,
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
