"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = response.status;
    throw error;
  }

  return data;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/cart/get-cart`, {
        credentials: "include",
      });
      const data = await readResponse(response);
      setCart(data.cart);
      return data.cart;
    } catch (error) {
      if (error.status === 401) {
        setCart(null);
        return null;
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = useCallback(async ({ productId, variantId, quantity }) => {
    const response = await fetch(`${apiBaseUrl}/cart/add-to-cart`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        variantId: variantId || null,
        quantity,
      }),
    });
    const data = await readResponse(response);
    setCart(data.cart);
    return data.cart;
  }, []);

  const updateCartItem = useCallback(async ({ itemId, quantity }) => {
    const response = await fetch(`${apiBaseUrl}/cart/update-cart-item/${itemId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });
    const data = await readResponse(response);
    setCart(data.cart);
    return data.cart;
  }, []);

  const removeCartItem = useCallback(async (itemId) => {
    const response = await fetch(`${apiBaseUrl}/cart/remove-cart-item/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await readResponse(response);
    setCart(data.cart);
    return data.cart;
  }, []);

  const clearCart = useCallback(async () => {
    const response = await fetch(`${apiBaseUrl}/cart/clear-cart`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await readResponse(response);
    setCart(data.cart);
    return data.cart;
  }, []);

  const calculateCart = useCallback(async ({ promoCode = "", deliveryZone = "inside-dhaka" }) => {
    const response = await fetch(`${apiBaseUrl}/cart/calculate-cart`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        promoCode,
        deliveryZone,
      }),
    });
    const data = await readResponse(response);
    setCart(data.cart);
    return data.summary;
  }, []);

  useEffect(() => {
    fetchCart().catch(() => undefined);
  }, [fetchCart]);

  const value = useMemo(
    () => ({
      cart,
      cartItems: cart?.items || [],
      cartCount: cart?.itemCount || 0,
      cartSubtotal: cart?.subtotal || 0,
      isLoading,
      fetchCart,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
      calculateCart,
    }),
    [
      addToCart,
      calculateCart,
      cart,
      clearCart,
      fetchCart,
      isLoading,
      removeCartItem,
      updateCartItem,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
