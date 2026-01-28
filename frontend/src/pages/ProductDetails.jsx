import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import "../styles/productDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p className="page">Loading...</p>;

  return (
    <div className="detailsPage">
      <div className="detailsCard">
        <h2>{product.name}</h2>
        <p className="desc">{product.description}</p>

        <div className="row">
          <span className="tag">{product.category}</span>
          <span className="price">₹{product.price}</span>
        </div>

        <div className="qtyRow">
          <label>Qty</label>
          <input
            type="number"
            min={1}
            max={product.qty}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />
        </div>

        <button
          className="primary"
          onClick={() => {
            addToCart(product, qty);
            navigate("/cart");
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
