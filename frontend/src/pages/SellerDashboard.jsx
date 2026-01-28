import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "../styles/sellerDashboard.css";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalQtySold: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    api.get("/products/seller/my").then((res) => setProducts(res.data));
    api.get("/orders/seller/summary").then((res) => setSummary(res.data));
  }, []);

  const totalProducts = products.length;

  const totalQtyRemaining = useMemo(() => {
    return products.reduce((sum, p) => sum + Number(p.quantity ?? p.qty ?? 0), 0);
  }, [products]);

  return (
    <div className="sellerDashPage">
      <h2 className="sellerDashTitle">Seller Dashboard</h2>

      <div className="sellerStats">
        <div className="statCard">
          <p>Total Products</p>
          <h3>{totalProducts}</h3>
        </div>

        <div className="statCard">
          <p>Total Qty Remaining</p>
          <h3>{totalQtyRemaining}</h3>
        </div>

        <div className="statCard">
          <p>Total Sales</p>
          <h3>₹{Number(summary.totalSales ?? 0)}</h3>
        </div>
      </div>

      <h3 className="sellerSectionTitle">My Products</h3>

      <div className="sellerProductsGrid">
        {products.map((p) => (
          <div key={p._id} className="sellerProductCard">
            <h3>{p.name}</h3>

            <p>Category: {p.category}</p>
            <p>Price: ₹{p.price}</p>

            <p>
              Qty: <b>{p.quantity ?? p.qty ?? 0}</b>
            </p>

            <p>
              Status:{" "}
              <span className={`badge ${p.status}`}>
                {String(p.status).toUpperCase()}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
