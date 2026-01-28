import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";

import ChatBot from "./components/ChatBot";


import SellerDashboard from "./pages/SellerDashboard";
import SellerAddProduct from "./pages/SellerAddProduct";
import AdminApproval from "./pages/AdminApproval";

import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import SellerOrders from "./pages/SellerOrders";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import "./styles/theme.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />

          <ChatBot />

          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />

            {/* AUTH */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* BUYER */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute role="buyer">
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute role="buyer">
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment"
              element={
                <ProtectedRoute role="buyer">
                  <Payment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-success/:id"
              element={
                <ProtectedRoute role="buyer">
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute role="buyer">
                  <Orders />
                </ProtectedRoute>
              }
            />

            {/* SELLER */}
            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute role="seller">
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller/add-product"
              element={
                <ProtectedRoute role="seller">
                  <SellerAddProduct />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller/orders"
              element={
                <ProtectedRoute role="seller">
                  <SellerOrders />
                </ProtectedRoute>
              }
            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/approval"
              element={
                <ProtectedRoute role="admin">
                  <AdminApproval />
                </ProtectedRoute>
              }

            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            

            {/* FALLBACK */}
            <Route path="*" element={<Home />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
