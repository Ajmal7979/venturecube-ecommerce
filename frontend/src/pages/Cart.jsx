import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/cart.css";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item?.product?.price || 0);
      const qty = Number(item?.qty || 0);
      return sum + price * qty;
    }, 0);
  }, [cart]);

  return (
    <div className="cart-page">
      <h2>My Cart</h2>

      {cart.length === 0 ? (
        <p className="empty">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-card" key={item.product?._id}>
                <div>
                  <h3>{item.product?.name}</h3>
                  <p className="muted">{item.product?.description}</p>
                  <p className="price">₹{item.product?.price}</p>
                </div>

                <div className="cart-actions">
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) =>
                      updateQty(item.product._id, Number(e.target.value))
                    }
                  />
                  <button
                    className="danger"
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ₹{total}</h3>
            <button className="btn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
