import { useEffect, useState } from "react";
import api from "../api/axios";

import "../styles/admin.css";

export default function AdminApproval() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/admin/products").then((res) => setProducts(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/products/${id}/status`, { status });
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status } : p))
    );
  };

  return (
    <div className="page">
      <h2>Admin Approval Panel</h2>

      <div className="grid">
        {products.map((p) => (
          <div key={p._id} className="card">
            <h3>{p.name}</h3>
            <p>Category: {p.category}</p>
            <p>Status: <b>{p.status}</b></p>

            {p.status === "pending" && (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => updateStatus(p._id, "approved")}>
                  Approve
                </button>
                <button onClick={() => updateStatus(p._id, "rejected")}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
