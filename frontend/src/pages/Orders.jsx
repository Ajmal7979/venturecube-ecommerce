import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="ordersPage">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="ordersGrid">
          {orders.map((o) => (
            <div key={o._id} className="orderCard">
              <h3>Order #{o._id.slice(-6)}</h3>
              <p><b>Total:</b> ₹{o.totalAmount}</p>
              <p><b>Payment:</b> {o.paymentStatus}</p>
              <p><b>Status:</b> {o.orderStatus}</p>

              <div className="items">
                {o.items.map((i, idx) => (
                  <div key={idx} className="itemRow">
                    <span>{i.name}</span>
                    <span>     <b>₹</b> <b>{i.price},</b></span>
                    <span>x <b>{i.quantity}</b></span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
