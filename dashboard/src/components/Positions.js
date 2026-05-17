import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL, LANDING_URL } from "../config";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);

  useEffect(() => {
    const loginUrl = `${LANDING_URL}/login`;
    const token = localStorage.getItem("token");

    axios.get(`${BACKEND_URL}/allPositions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      setAllPositions(res.data);
    })
    .catch((err) => {
      console.error("Error fetching positions:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem("token");
        window.location.href = loginUrl;
      }
    });
  }, []);

  if (allPositions.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You don't have any open positions at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;