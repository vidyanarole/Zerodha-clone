import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../config";

const Funds = () => {
  const [userInfo, setUserInfo] = useState({ funds: 100000 });
  const [usedMargin, setUsedMargin] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchFundsData = async () => {
      try {
        const fundsRes = await axios.get(`${BACKEND_URL}/userFunds`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(fundsRes.data);

        const positionsRes = await axios.get(`${BACKEND_URL}/allPositions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let marginSum = 0;
        positionsRes.data.forEach((pos) => {
          marginSum += pos.qty * pos.avg;
        });
        setUsedMargin(marginSum);
      } catch (err) {
        console.error("Error fetching funds data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFundsData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <p>Loading funds data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI </p>
        <Link className="btn btn-green" to="#">Add funds</Link>
        <Link className="btn btn-blue" to="#">Withdraw</Link>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">{formatCurrency(userInfo.funds)}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">{formatCurrency(usedMargin)}</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">{formatCurrency(userInfo.funds)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>{formatCurrency(userInfo.funds + usedMargin)}</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>0.00</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>
            <Link className="btn btn-blue" to="#">Open Account</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;