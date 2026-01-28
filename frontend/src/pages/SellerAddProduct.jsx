import { useState } from "react";
import api from "../api/axios";
import "../styles/sellerAddProduct.css";

export default function SellerAddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "", // ✅ changed
    description: "",
  });

  const categories = ["Electronics", "Fashion", "Mobiles", "Shoes", "Home Applications", "Books", "Sports", "Toys", "Groceries", "Health", "Beauty", "Automotive"];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    try {
      await api.post("/products", {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity), // ✅ send correct field
        description: form.description,
      });

      alert("✅ Product submitted for admin approval!");

      setForm({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="sellerAddPage">
      <div className="sellerAddCard">
        <h2 className="sellerAddTitle">Add Product (Seller)</h2>
        <p className="sellerAddSub">
          Fill product details and submit for admin approval.
        </p>

        <form onSubmit={submitProduct} className="sellerAddForm">
          <label>Product Name</label>
          <input
            name="name"
            placeholder="Eg: Vivo V11"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="sellerAddRow">
            <div>
              <label>Price (₹)</label>
              <input
                name="price"
                type="number"
                placeholder="Eg: 15000"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Quantity</label>
              <input
                name="quantity" // ✅ changed
                type="number"
                placeholder="Eg: 5"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Write key details about the product..."
            value={form.description}
            onChange={handleChange}
            required
          />

          <button type="submit" className="sellerAddBtn">
            Submit for Approval
          </button>
        </form>
      </div>
    </div>
  );
}
