import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import "../styles/payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [method, setMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  // ✅ Always compute total from cart to avoid NaN
  const computedTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const p = item.product || item;
      const price = Number(p?.price || 0);
      const qty = Number(item.qty ?? item.quantity ?? 1);
      return sum + price * qty;
    }, 0);
  }, [cart]);

  const placeOrder = async () => {
    try {
      if (!cart.length) return alert("Cart is empty");

      const shipping = JSON.parse(localStorage.getItem("vc_shipping") || "{}");

      // ✅ Validate shipping
      if (
        !shipping.fullName ||
        !shipping.phone ||
        !shipping.address ||
        !shipping.city ||
        !shipping.state ||
        !shipping.pincode
      ) {
        return alert("Shipping Address missing. Please fill checkout form again.");
      }

      // ✅ Must be number
      if (!computedTotal || isNaN(computedTotal)) {
        return alert("Total invalid. Please refresh and try again.");
      }

      setLoading(true);

      const items = cart.map((item) => {
        const p = item.product || item;

        return {
          product: p._id,
          name: p.name,
          price: Number(p.price),
          quantity: Number(item.qty ?? item.quantity ?? 1),
          seller: p.seller,
        };
      });

      const res = await api.post("/orders", {
        items,
        shippingAddress: shipping,
        paymentMethod: method,
        totalAmount: computedTotal, // ✅ fixed
      });

      clearCart();
      localStorage.removeItem("vc_shipping");

      navigate(`/order-success/${res.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paymentPage">
      <div className="paymentCard">
        <h2>Payment</h2>

        <div className="methods">
          <label>
            <input
              type="radio"
              value="COD"
              checked={method === "COD"}
              onChange={() => setMethod("COD")}
            />
            Cash on Delivery
          </label>

          <label>
            <input
              type="radio"
              value="UPI"
              checked={method === "UPI"}
              onChange={() => setMethod("UPI")}
            />
            UPI
          </label>

          <label>
            <input
              type="radio"
              value="CARD"
              checked={method === "CARD"}
              onChange={() => setMethod("CARD")}
            />
            Card
          </label>
        </div>

        <h3>Total: ₹{computedTotal}</h3>

        <button
          className="primary"
          disabled={loading || cart.length === 0 || computedTotal <= 0}
          onClick={placeOrder}
        >
          {loading ? "Placing Order..." : "Pay & Place Order"}
        </button>
      </div>
    </div>
  );
}
