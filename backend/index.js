require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");

const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UsersModel } = require("./model/UsersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_zerodha_key_123";

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

// Secure Production-Ready CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  process.env.DASHBOARD_URL || "http://localhost:3001"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy violation: Access from this origin is restricted."), false);
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// app.get("/addHoldings", async (req, res) => {
//   let tempHoldings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.day,
//       day: item.day,
//     });

//     newHolding.save();
//   });
//   res.send("Done!");
// });

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });
//   res.send("Done!");
// });

app.get("/allHoldings", verifyToken, async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", verifyToken, async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post("/newOrder", verifyToken, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    // Simple validations
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "Invalid stock name." });
    }
    const orderQty = parseInt(qty);
    if (isNaN(orderQty) || orderQty <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive integer." });
    }
    const orderPrice = parseFloat(price);
    if (isNaN(orderPrice) || orderPrice <= 0) {
      return res.status(400).json({ message: "Price must be a positive number." });
    }
    if (mode !== "BUY" && mode !== "SELL") {
      return res.status(400).json({ message: "Invalid trade mode." });
    }

    // Get active user
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const orderCost = orderQty * orderPrice;

    if (mode === "BUY") {
      if (user.funds < orderCost) {
        return res.status(400).json({
          message: `Insufficient funds. Required: ₹${orderCost.toFixed(2)}, Available: ₹${user.funds.toFixed(2)}`
        });
      }
      // Deduct funds
      user.funds -= orderCost;
    } else {
      // mode === "SELL"
      // Validate holding availability
      const userOrders = await OrdersModel.find({ userId: req.user.userId, name: name });
      let ownedQty = 0;
      userOrders.forEach((o) => {
        if (o.mode === "BUY") {
          ownedQty += o.qty;
        } else {
          ownedQty -= o.qty;
        }
      });

      const globalHolding = await HoldingsModel.findOne({ name });
      const globalPosition = await PositionsModel.findOne({ name });
      const isSeededStock = globalHolding || globalPosition;

      if (!isSeededStock && ownedQty < orderQty) {
        return res.status(400).json({
          message: `You do not own this stock. Current balance: ${ownedQty} shares.`
        });
      }

      // Add to user funds
      user.funds += orderCost;
    }

    // Save user's updated funds balance
    await user.save();

    // Create the order
    const newOrder = new OrdersModel({
      userId: req.user.userId,
      name,
      qty: orderQty,
      price: orderPrice,
      mode,
    });

    await newOrder.save();

    // Dynamically update positions table in the DB
    if (mode === "BUY") {
      let position = await PositionsModel.findOne({ name });
      if (!position) {
        position = new PositionsModel({
          product: "CNC",
          name,
          qty: orderQty,
          avg: orderPrice,
          price: orderPrice,
          net: "+0.00%",
          day: "+0.00%",
          isLoss: false,
        });
        await position.save();
      } else {
        const oldQty = position.qty;
        const oldAvg = position.avg;
        position.qty += orderQty;
        position.avg = ((oldQty * oldAvg) + (orderQty * orderPrice)) / (oldQty + orderQty);
        await position.save();
      }
    } else {
      let position = await PositionsModel.findOne({ name });
      if (position) {
        if (position.qty <= orderQty) {
          await PositionsModel.deleteOne({ name });
        } else {
          position.qty -= orderQty;
          await position.save();
        }
      }
    }

    res.status(201).json({
      message: `Order placed successfully! Mode: ${mode}, Stock: ${name}, Qty: ${orderQty}`,
      funds: user.funds,
    });
  } catch (err) {
    console.error("Error creating new order:", err);
    res.status(500).json({ message: "Server error while placing order." });
  }
});

// Fetch simulated user funds
app.get("/userFunds", verifyToken, async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({
      funds: user.funds,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Error fetching user funds:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Fetch only currently logged-in user's orders
app.get("/allOrders", verifyToken, async (req, res) => {
  try {
    const orders = await OrdersModel.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Server error." });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new UsersModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful! You can now log in." });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error during signup. Please try again." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare password hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log("App started!");
  mongoose.connect(uri);
  console.log("DB started!");
});