import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import { BACKEND_URL, LANDING_URL } from "../config";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    const loginUrl = `${LANDING_URL}/login`;
    const token = localStorage.getItem("token");

    axios.get(`${BACKEND_URL}/allHoldings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      setAllHoldings(res.data);
    })
    .catch((err) => {
      console.error("Error fetching holdings:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem("token");
        window.location.href = loginUrl;
      }
    });
  }, []);

  const labels = allHoldings.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  if (allHoldings.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You don't have any holdings at the moment. Purchase stocks in the Watchlist to start building your portfolio!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            {(() => {
              let totalInvestment = 0;
              allHoldings.forEach((stock) => {
                totalInvestment += stock.avg * stock.qty;
              });
              const formatted = totalInvestment.toFixed(2);
              const parts = formatted.split(".");
              return (
                <>
                  {parts[0]}.<span>{parts[1]}</span>
                </>
              );
            })()}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            {(() => {
              let currentValue = 0;
              allHoldings.forEach((stock) => {
                currentValue += stock.price * stock.qty;
              });
              const formatted = currentValue.toFixed(2);
              const parts = formatted.split(".");
              return (
                <>
                  {parts[0]}.<span>{parts[1]}</span>
                </>
              );
            })()}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          {(() => {
            let totalInvestment = 0;
            let currentValue = 0;
            allHoldings.forEach((stock) => {
              totalInvestment += stock.avg * stock.qty;
              currentValue += stock.price * stock.qty;
            });
            const pnl = currentValue - totalInvestment;
            const pnlPercent = totalInvestment > 0 ? (pnl / totalInvestment) * 100 : 0;
            const pnlClass = pnl >= 0 ? "profit" : "loss";
            const pnlSign = pnl >= 0 ? "+" : "";
            return (
              <h5 className={pnlClass}>
                {pnl.toFixed(2)} ({pnlSign}{pnlPercent.toFixed(2)}%)
              </h5>
            );
          })()}
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;