import { useParams, Link } from "react-router-dom";
import "../styles/page.css";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="page">
      <h2>✅ Order Placed Successfully</h2>
      <p>Your order ID: <b>{id}</b></p>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <Link to="/orders">
          <button>View Orders</button>
        </Link>

        <Link to="/products">
          <button>Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
}
