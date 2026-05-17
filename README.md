# 📈 Kite by Zerodha Clone — Full Stack Trading Platform

Welcome to the **Zerodha Clone** project! This is an interview-ready, premium full-stack clone of Zerodha's trading terminal (**Kite**) and marketing landing pages. It has been built using a decoupled architecture with React, Express, Node.js, and MongoDB, complete with real-time portfolio allocations, JWT-based Single Sign-On (SSO) session sharing, dynamic order executions, and simulated funds ledger management.

---

## 🌟 Key Architecture & SSO Authentication Handshake

This project implements a highly professional **Single Sign-On (SSO) Cross-App token redirection handshake** to securely route authenticated sessions between two isolated domains:

```
[ frontend:3000 ]               [ backend:3002 ]               [ dashboard:3001 ]
       |                                |                               |
       |----- POST /login ------------->|                               |
       |<---- JWT Token Response -------|                               |
       |                                |                               |
       |===== Redirect to Dashboard with Query Token (token=JWT) ======>|
       |                                                                |----- Extract query token,
       |                                                                |      save to localStorage
       |                                                                |----- Replace address bar
       |                                                                |      (clearing URL query)
```

1. **Unifed Login Page**: Located inside the `frontend` marketing app (port 3000).
2. **SSO Redirect**: Upon successful login, the frontend receives a signed JWT token and redirects the browser to the trading terminal (`dashboard` on port 3001) with the token securely embedded inside query strings: `http://localhost:3001?token=JWT_TOKEN`.
3. **Session Harvesting & Sanitizing**: The dashboard's home listener harvests the token, stores it securely inside the dashboard's localized `localStorage`, and cleanly wipes the parameter from the browser history (`window.history.replaceState`) to maintain high security, preventing token leaks!
4. **Guest Guardian**: All dashboard pages are strictly guarded by `ProtectedRoute.js`. Unauthenticated guests are instantly redirected back to the marketing login portal.

---

## 🛠️ Technology Stack

* **Frontend Marketing Website**: React.js, React Router, Bootstrap 5, Custom CSS
* **Trading Terminal Dashboard**: React.js, React Router, Chart.js, React-ChartJS-2, Custom CSS, Axios, Material UI Icon sets
* **Backend REST API**: Node.js, Express.js, JWT, bcryptjs, Mongoose
* **Database**: MongoDB Atlas

---

## 📈 Key Real-time Features

### 1. Dynamic Stock Watchlist Search
* Fully interactive client-side search filtering stock list datasets dynamically.
* Context-bound action triggers for instant **BUY** and **SELL** orders.
* allocation percentages represented dynamically on a beautifully polished **Doughnut Allocation Chart**.

### 2. Verified Buy/Sell Executions
* **SellActionWindow (NEW)**: Orange-themed Kite action window to execute sales.
* **Price Population**: Modals automatically lookup live stock tick values on activation.
* **Backend validations**:
  * Blocks buy orders exceeding the simulator balance.
  * Blocks sell orders for shares the user doesn't own (verifying aggregate transaction history).
  * Automatically updates position collections inside MongoDB, adding new nodes, averaging prices, or removing nodes upon total sale.

### 3. Aggregate Portfolio calculations
* Portfolio investment values, current market valuations, active P&L aggregates, and dynamic returns are computed in real-time using Mongoose data pipelines:
  $$\text{Total Investment} = \sum (\text{Qty} \times \text{Average Buy Price})$$
  $$\text{Current Value} = \sum (\text{Qty} \times \text{Last Traded Price (LTP)})$$
  $$\text{P\&L} = \text{Current Value} - \text{Total Investment}$$
* Funds ledger calculates used margin aggregates dynamically from open positions:
  $$\text{Available Margin} = \text{User Funds}$$
  $$\text{Used Margin} = \sum (\text{Positions Qty} \times \text{Positions Avg Price})$$

### 4. Visual Polish & Empty states
* Responsive placeholder views show up when orders or open positions are vacant.
* Escape key keyboard bindings and visual close buttons in modal popups.
* Full tablet, laptop, and mobile responsiveness.

---

## 🚀 Local Setup Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (or local MongoDB server)

### Step 1: Clone and install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install dashboard dependencies
cd ../dashboard
npm install

# Install marketing website dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in each directory based on the corresponding `.env.example` templates:

* **Backend `.env`**:
  ```env
  PORT=3002
  MONGO_URL=your_mongodb_atlas_connection_string
  JWT_SECRET=your_custom_jwt_secret_key
  NODE_ENV=development
  ```
* **Frontend `.env`**:
  ```env
  REACT_APP_BACKEND_URL=http://localhost:3002
  REACT_APP_DASHBOARD_URL=http://localhost:3001
  REACT_APP_LANDING_URL=http://localhost:3000
  ```
* **Dashboard `.env`**:
  ```env
  REACT_APP_BACKEND_URL=http://localhost:3002
  REACT_APP_LANDING_URL=http://localhost:3000
  ```

### Step 3: Run the project locally
Launch all three applications in separate terminal windows:
```bash
# In backend/
npm start

# In dashboard/
npm start

# In frontend/
npm start
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser to browse the platform!

---

## 🌍 Production Deployment Steps

### Backend (Render / Railway)
1. Link your GitHub repository.
2. Select Node.js environment.
3. Configure Environment Variables: `MONGO_URL`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL` (Vercel landing domain), `DASHBOARD_URL` (Vercel dashboard domain).
4. Run Command: `npm start`.

### Frontend & Dashboard (Vercel)
1. Deploy as two isolated Vercel projects.
2. Link environment configurations matching production targets:
   * **Frontend**: `REACT_APP_BACKEND_URL` (Render URL), `REACT_APP_DASHBOARD_URL` (Dashboard Vercel URL), `REACT_APP_LANDING_URL` (Frontend Vercel URL).
   * **Dashboard**: `REACT_APP_BACKEND_URL` (Render URL), `REACT_APP_LANDING_URL` (Frontend Vercel URL).
3. Build command: `npm run build`.
