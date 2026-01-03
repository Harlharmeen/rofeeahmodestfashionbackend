// 1️⃣ Load environment variables first
import dotenv from "dotenv";
dotenv.config(); // MUST be first

// 2️⃣ Imports
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

import newsletterRoutes from "./routes/newsletterRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentProofRoute from "./routes/paymentProof.js";
import confirmPaymentRoute from "./routes/confirmPayment.js";

// 3️⃣ Connect to MongoDB
connectDB();

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   ROUTES
======================= */
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/submission", submissionRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment-proof", paymentProofRoute);
app.use("/api", confirmPaymentRoute);

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => res.send("API is running..."));

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);


});
