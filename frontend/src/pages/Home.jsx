import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import { getCategoryImage } from "../utils/categoryImages";

export default function Home() {
  const navigate = useNavigate();

  const categories = [
    { name: "Electronics", desc: "Explore best Electronics items" },
    { name: "Fashion", desc: "Explore best Fashion items" },
    { name: "Mobiles", desc: "Explore best Mobiles items" },
    { name: "Shoes", desc: "Explore best Shoes items" },
    { name: "Home Applications", desc: "Explore best Home items" },
    { name: "Books", desc: "Explore best Books items" },
    { name: "Sports", desc: "Explore best Sports items" },
    { name: "Toys", desc: "Explore best Toys items" },
    { name: "Groceries", desc: "Explore best Groceries items" },
    { name: "Health", desc: "Explore best Health items" },
    { name: "Beauty", desc: "Explore best Beauty items" },
    { name: "Automotive", desc: "Explore best Automotive items" },
  ];

  return (
    <div className="home">
      {/* HERO */}
      <div className="hero">
        <h1>Welcome to VentureCube</h1>
        <p>Approved products only • Secure checkout • Fast delivery</p>

        <button className="btnPrimary" onClick={() => navigate("/products")}>
          Browse Products
        </button>
      </div>

      {/* CATEGORY SECTION */}
      <h2 className="sectionTitle">Shop by Category</h2>

      <div className="categoryGrid">
        {categories.map((c) => (
          <div
            key={c.name}
            className="categoryCard"
            onClick={() => navigate(`/products?category=${c.name}`)}
          >
            {/* ✅ Category Image */}
            <img
              src={getCategoryImage(c.name)}
              alt={c.name}
              className="categoryImg"
            />

            <h3>{c.name}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
