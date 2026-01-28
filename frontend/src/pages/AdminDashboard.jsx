import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/adminDashboard.css";

export default function AdminDashboard() {
  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDash = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setDash(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDash();
  }, []);

  if (loading) return <p style={{ padding: 30, color: "#fff" }}>Loading...</p>;
  if (!dash) return <p style={{ padding: 30, color: "#fff" }}>No dashboard data</p>;

  const c = dash.counts || {};

  return (
    <div className="adminDashPage">
      <h2 className="adminDashTitle">Admin Dashboard</h2>

      {/* STATS */}
      <div className="adminStatsGrid">
        <div className="adminStatCard">
          <p>Total Users</p>
          <h3>{c.totalUsers || 0}</h3>
        </div>

        <div className="adminStatCard">
          <p>Total Buyers</p>
          <h3>{c.totalBuyers || 0}</h3>
        </div>

        <div className="adminStatCard">
          <p>Total Sellers</p>
          <h3>{c.totalSellers || 0}</h3>
        </div>

        <div className="adminStatCard">
          <p>Total Products</p>
          <h3>{c.totalProducts || 0}</h3>
        </div>

        <div className="adminStatCard approved">
          <p>Approved</p>
          <h3>{c.approvedProducts || 0}</h3>
        </div>

        <div className="adminStatCard pending">
          <p>Pending</p>
          <h3>{c.pendingProducts || 0}</h3>
        </div>

        <div className="adminStatCard rejected">
          <p>Rejected</p>
          <h3>{c.rejectedProducts || 0}</h3>
        </div>

        <div className="adminStatCard">
          <p>Total Orders</p>
          <h3>{c.totalOrders || 0}</h3>
        </div>

        <div className="adminStatCard revenue">
          <p>Total Revenue</p>
          <h3>₹{dash.totalRevenue || 0}</h3>
        </div>
      </div>

      {/* TOP SELLERS */}
      <div className="adminSection">
        <h3>Top Sellers</h3>
        <div className="adminList">
          {(dash.topSellers || []).map((s, idx) => (
            <div key={idx} className="adminListRow">
              <span>{s?.seller?.username || "Unknown Seller"}</span>
              <b>₹{Math.round(s.totalSales || 0)}</b>
            </div>
          ))}
          {(!dash.topSellers || dash.topSellers.length === 0) && (
            <p className="muted">No seller sales yet</p>
          )}
        </div>
      </div>

      {/* LATEST ORDERS */}
      <div className="adminSection">
        <h3>Latest Orders</h3>
        <div className="adminList">
          {(dash.latestOrders || []).map((o) => (
            <div key={o._id} className="adminOrderCard">
              <p><b>Order:</b> {o._id}</p>
              <p>
                <b>Buyer:</b>{" "}
                {o?.buyer?.username ||
                  o?.user?.username ||
                  "Unknown Buyer"}
              </p>
              <p><b>Total:</b> ₹{o.totalAmount || 0}</p>
              <p className="muted">{new Date(o.createdAt).toLocaleString()}</p>
            </div>
          ))}
          {(!dash.latestOrders || dash.latestOrders.length === 0) && (
            <p className="muted">No orders yet</p>
          )}
        </div>
      </div>

      {/* RECENT BUYERS */}
      <div className="adminSection">
        <h3>Latest Buyers</h3>
        <div className="adminList">
          {(dash.latestBuyers || []).map((u) => (
            <div key={u._id} className="adminListRow">
              <span>{u.username}</span>
              <span className="muted">{u.email}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT SELLERS */}
      <div className="adminSection">
        <h3>Latest Sellers</h3>
        <div className="adminList">
          {(dash.latestSellers || []).map((u) => (
            <div key={u._id} className="adminListRow">
              <span>{u.username}</span>
              <span className="muted">{u.email}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
