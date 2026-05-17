import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";
import { BACKEND_URL } from "../config";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const stock = watchlist.find((s) => s.name === uid);
  const initialPrice = stock ? stock.price : 0.0;

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(initialPrice);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { closeSellWindow } = useContext(GeneralContext);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeSellWindow();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSellWindow]);

  const handleSellClick = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/newOrder`,
        {
          name: uid,
          qty: parseInt(stockQuantity),
          price: parseFloat(stockPrice),
          mode: "SELL",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccessMsg(response.data.message);
      
      // Close window after a short delay on success
      setTimeout(() => {
        closeSellWindow();
        window.location.reload(); // Reload dashboard stats
      }, 1200);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Failed to place sell order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true" style={{ borderTop: "5px solid #f56834" }}>
      <div className="regular-order">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h4 style={{ margin: 0, color: "#f56834" }}>Sell {uid}</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: "#888" }}>CNC Regular</span>
            <button 
              onClick={handleCancelClick}
              style={{ border: "none", background: "none", cursor: "pointer", fontSize: "18px", color: "#888", fontWeight: "bold" }}
              title="Close (Esc)"
            >
              ×
            </button>
          </div>
        </div>

        {errorMsg && <div style={{ color: "#d9534f", fontSize: "12px", marginBottom: "10px" }}>{errorMsg}</div>}
        {successMsg && <div style={{ color: "#5cb85c", fontSize: "12px", marginBottom: "10px" }}>{successMsg}</div>}

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
              disabled={loading}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
              disabled={loading}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin credit: ₹{(stockQuantity * stockPrice).toFixed(2)}</span>
        <div>
          <button 
            className="btn btn-orange" 
            onClick={handleSellClick} 
            disabled={loading}
            style={{ border: "none", cursor: "pointer" }}
          >
            {loading ? "Selling..." : "Sell"}
          </button>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
