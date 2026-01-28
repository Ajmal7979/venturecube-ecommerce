import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/checkout.css";

export default function Checkout() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitAddress = async (e) => {
    e.preventDefault();

    const values = Object.values(form).map((v) => String(v).trim());
    if (values.some((v) => !v)) {
      return alert("All fields required");
    }

    try {
      // ✅ Save to DB
      await api.post("/addresses", form);

      // ✅ Save to localStorage for payment page
      localStorage.setItem("vc_shipping", JSON.stringify(form));

      navigate("/payment");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save address");
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <h2 className="checkout-title">Shipping Address</h2>
        <p className="checkout-subtitle">
          Enter your delivery address to continue payment.
        </p>

        <form onSubmit={submitAddress} className="checkout-form">
          <div className="grid-2">
            <div className="field">
              <label>Full Name</label>
              <input
                name="fullName"
                placeholder="Enter full name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Phone Number</label>
              <input
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Full Address</label>
            <textarea
              name="address"
              placeholder="House no, Street, Area"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid-3">
            <div className="field">
              <label>City</label>
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>State</label>
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Pincode</label>
              <input
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="checkout-btn" type="submit">
            Continue to Payment →
          </button>
        </form>
      </div>
    </div>
  );
}
