import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/submission", submissionRoutes); // ✅ Submission routes
app.use("/api/contact", contactRoutes);
// Health check
app.get("/", (req, res) => res.send("API is running..."));

// Connect to DB
connectDB();

// Global Error Handler (always return JSON)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
