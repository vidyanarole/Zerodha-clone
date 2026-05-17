import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`${BACKEND_URL}/allOrders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setOrders(res.data);
    })
    .catch((err) => {
      console.error("Error fetching orders:", err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders ({orders.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const orderTime = new Date(order.createdAt).toLocaleString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
              });
              const modeClass = order.mode === "BUY" ? "profit" : "loss";

              return (
                <tr key={order._id || index}>
                  <td style={{ color: "#999" }}>{orderTime}</td>
                  <td className={modeClass}>
                    <strong>{order.mode}</strong>
                  </td>
                  <td>{order.name}</td>
                  <td>{order.qty}</td>
                  <td>₹{order.price.toFixed(2)}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: "#dff0ea", color: "#2b845a", padding: "4px 8px", borderRadius: "3px", fontSize: "11px" }}>
                      COMPLETE
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;