import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <div className="logo">
        <Link to="/">VentureCube</Link>
      </div>

      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {user?.role === "buyer" && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
          </>
        )}

        {user?.role === "seller" && (
          <>
            <Link to="/seller/dashboard">Dashboard</Link>
            <Link to="/seller/add-product">Add Product</Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
          <Link to="/admin/approval">Approvals</Link>
          <Link to="/admin/dashboard">Dashboard</Link>
          </>
        )
        }
        

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        ) : (
          <b><>
            <b>   <span className="userTag">{user.username}</span>   </b>
            <button className="logoutBtn" onClick={logout}>
              Logout
            </button>
          </></b>
        )}
      </div>
    </nav>
  );
}
