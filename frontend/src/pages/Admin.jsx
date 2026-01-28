import { useEffect, useState } from "react";
import api from "../api/axios";

import "../styles/admin.css";

export default function Admin() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/products/${id}/status`, { status });
    setProducts(p => p.map(pr => pr._id === id ? { ...pr, status } : pr));
  };

  return (
    <div className="page">
      <h2>Admin – Product Approval</h2>

      {products.map(p => (
        <div key={p._id} className="card">
          <h3>{p.name}</h3>
          <p>Status: {p.status}</p>

          <button onClick={() => updateStatus(p._id, "approved")}>Approve</button>
          <button onClick={() => updateStatus(p._id, "rejected")}>Reject</button>
        </div>
      ))}
    </div>
  );
}
