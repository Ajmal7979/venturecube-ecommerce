import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/page.css";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/seller/orders").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="page">
      <h2>Orders Received</h2>

      {orders.length === 0 && <p>No orders received yet.</p>}

      <div className="grid">
        {orders.map((o) => (
          <div key={o._id} className="card">
            <h3>Order ID: {o._id.slice(-6)}</h3>
            <p>
              Buyer: <b>{o.buyer?.username}</b> ({o.buyer?.email})
            </p>
            <p>
              Payment:{" "}
              <b style={{ color: o.paymentStatus === "paid" ? "lime" : "orange" }}>
                {o.paymentStatus}
              </b>
            </p>
            <p>
              Total: <b>₹{o.total}</b>
            </p>

            <div style={{ marginTop: 12 }}>
              <b>Products:</b>
              {o.items.map((it, idx) => (
                <div key={idx} className="miniRow">
                  <span>{it.product?.name}</span>
                  <span>Qty: {it.qty}</span>
                  <span>₹{it.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
