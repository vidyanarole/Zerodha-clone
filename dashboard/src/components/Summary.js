import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

const Summary = () => {
  const [userInfo, setUserInfo] = useState({ name: "User", funds: 100000 });
  const [holdingsData, setHoldingsData] = useState({
    count: 0,
    totalInvestment: 0,
    currentValue: 0,
    pnl: 0,
    pnlPercent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboardData = async () => {
      try {
        const fundsRes = await axios.get(`${BACKEND_URL}/userFunds`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(fundsRes.data);

        const holdingsRes = await axios.get(`${BACKEND_URL}/allHoldings`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const holdings = holdingsRes.data;
        let totalInvestment = 0;
        let currentValue = 0;

        holdings.forEach((stock) => {
          const qty = stock.qty || 0;
          const avg = stock.avg || 0;
          const price = stock.price || 0;

          totalInvestment += qty * avg;
          currentValue += qty * price;
        });

        const pnl = currentValue - totalInvestment;
        const pnlPercent = totalInvestment > 0 ? (pnl / totalInvestment) * 100 : 0;

        setHoldingsData({
          count: holdings.length,
          totalInvestment,
          currentValue,
          pnl,
          pnlPercent,
        });
      } catch (err) {
        console.error("Error fetching summary data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatK = (val) => {
    if (Math.abs(val) >= 1000) {
      return (val / 1000).toFixed(2) + "k";
    }
    return val.toFixed(2);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <p>Loading portfolio statistics...</p>
      </div>
    );
  }

  const pnlClass = holdingsData.pnl >= 0 ? "profit" : "loss";
  const pnlSign = holdingsData.pnl >= 0 ? "+" : "";

  return (
    <>
      <div className="username">
        <h6>Hi, {userInfo.name}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{formatK(userInfo.funds)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>{" "}
            </p>
            <p>
              Opening balance <span>{formatK(userInfo.funds)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdingsData.count})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnlClass}>
              {formatK(holdingsData.pnl)}{" "}
              <small>
                {pnlSign}
                {holdingsData.pnlPercent.toFixed(2)}%
              </small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>{formatK(holdingsData.currentValue)}</span>{" "}
            </p>
            <p>
              Investment <span>{formatK(holdingsData.totalInvestment)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;