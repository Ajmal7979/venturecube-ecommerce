import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/products.css";
import { useCart } from "../context/CartContext";
import { getCategoryImage } from "../utils/categoryImages";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category"); // example: mobiles

  const fetchProducts = async () => {
    try {
      const url = category ? `/products?category=${category}` : "/products";
      const res = await api.get(url);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const filtered = useMemo(() => {
    return products.filter((p) =>
      (p.name + p.category + p.description)
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className="products-page">
      <h2>{category ? category.toUpperCase() : "All Products"}</h2>

      <input
        className="search"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="products-grid">
        {filtered.map((p) => (
          <div key={p._id} className="product-card">
            {/* ✅ Category Image */}
            <img
              src={getCategoryImage(p.category)}
              alt={p.category}
              className="product-cat-img"
            />

            <h3>{p.name}</h3>
            <p className="desc">{p.description}</p>

            {/* ✅ show category badge */}
            <p className="product-category">#{p.category}</p>

            <p className="price">₹{p.price}</p>

            <div className="btn-row">
              <button
                className="btn-outline"
                onClick={() => navigate(`/products/${p._id}`)}
              >
                View Details
              </button>

              <button
                className="btn"
                onClick={() => {
                  addToCart(p._id, 1);
                  alert("✅ Product added to cart!");
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ marginTop: 20, opacity: 0.7 }}>
          No products found in this category.
        </p>
      )}
    </div>
  );
}//
