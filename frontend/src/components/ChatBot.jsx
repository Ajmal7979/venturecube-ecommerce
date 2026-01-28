import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/chatbot.css";
import { useCart } from "../context/CartContext"; // ✅ ADD

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const { addToCart } = useCart(); // ✅ ADD

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi 👋 I'm VentureBot. Ask me like:\n• mobiles under 5000\n• trending shoes\n• best electronics",
      products: [],
    },
  ]);

  useEffect(() => {
    if (open) {
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { from: "user", text: userText }]);

    try {
      setLoading(true);

      const res = await api.post("/chat", { message: userText });

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: res.data.reply,
          products: res.data.products || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Oops 😕 Server error. Try again.", products: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Product open
  const openProduct = (id) => {
    setOpen(false);
    navigate(`/products/${id}`);
  };

  // ✅ Add to cart + message
  const addCartWithMessage = async (productId) => {
    try {
      await addToCart(productId, 1);
      alert("✅ Product added to cart");
    } catch (err) {
      alert("❌ Failed to add product to cart");
    }
  };

  return (
    <>
      {/* Floating Icon */}
      <button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        title="Chat with VentureBot"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <div>
              <b>VentureBot</b>
              <p>AI Product Assistant</p>
            </div>

            <button className="chat-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chat-body">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-msg ${m.from}`}>
                <div className="bubble">
                  {m.text}

                  {/* ✅ Product suggestions */}
                  {m.products && m.products.length > 0 && (
                    <div className="suggestions">
                      {m.products.map((p) => (
                        <div key={p._id} className="chatProductRow">
                          {/* ✅ CLICK PRODUCT */}
                          <button
                            className="pill"
                            onClick={() => openProduct(p._id)}
                          >
                            {p.name} • ₹{p.price}
                          </button>

                          {/* ✅ ADD TO CART */}
                          <button
                            className="pillAddCart"
                            onClick={() => addCartWithMessage(p._id)}
                          >
                            + Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg bot">
                <div className="bubble">Typing...</div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
