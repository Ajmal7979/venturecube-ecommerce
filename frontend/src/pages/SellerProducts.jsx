import { useState } from "react";
import api from "../api/axios";

export default function SellerProducts() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/products", form);
    alert("Product added");
  };

  return (
    <form className="auth" onSubmit={submit}>
      <h2>Add Product</h2>

      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} />
      <input type="number" placeholder="Price" onChange={e => setForm({...form, price: e.target.value})} />

      <button>Add</button>
    </form>
  );
}
