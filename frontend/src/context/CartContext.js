import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data || []);
    } catch {
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, qty = 1) => {
    try {
      const res = await api.post("/cart/add", { productId, qty });
      setCart(res.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Add to cart failed");
    }
  };

  const updateQty = async (productId, qty) => {
    try {
      const res = await api.put("/cart/update", { productId, qty });
      setCart(res.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      setCart(res.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Remove failed");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
    } catch {}
    setCart([]);
  };

  // ✅ This works if item = {price, qty} OR item={product:{price}, qty}
  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price ?? item.product?.price ?? 0);
      const qty = Number(item.qty ?? item.quantity ?? 1);
      return sum + price * qty;
    }, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        fetchCart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
