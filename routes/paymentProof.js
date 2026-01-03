import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Order from "../models/Order.js";
import nodemailer from "nodemailer";

const router = express.Router();

/* =========================
   CLOUDINARY STORAGE
========================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "payment_proofs",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});
const upload = multer({ storage });

/* =========================
   EMAIL TRANSPORTER
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   UPLOAD PAYMENT PROOF
========================= */
router.post("/:orderId", upload.single("proof"), async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order status
    order.status = "pending_verification";
    order.paymentProofUrl = req.file.path;
    await order.save();

    /* =========================
       CUSTOMER ACKNOWLEDGEMENT EMAIL
    ========================== */
    const whatsappLink = `https://wa.me/2349033957023?text=${encodeURIComponent(
      `Hello, I am following up on my order. Order ID: ${orderId}`
    )}`;

    await transporter.sendMail({
      from: `"Rofeeah Store" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject: `Payment Proof Received — Order ${orderId}`,
      html: `
        <h3>✅ Payment Proof Received</h3>
        <p>Dear ${order.name},</p>
        <p>We have received your payment proof for Order <strong>${orderId}</strong>.</p>
        <p>Our team will verify it shortly. Thank you for your patience.</p>
        <br/>
        <a href="${whatsappLink}"
           style="display:inline-block;padding:12px 18px;
           background:#25D366;color:#fff;border-radius:6px;
           text-decoration:none;">
           💬 Contact us on WhatsApp
        </a>
      `,
    });

    /* =========================
       ADMIN EMAIL
    ========================== */
    const confirmUrl = `${process.env.BACKEND_URL}/api/confirm-payment/${orderId}`;

    await transporter.sendMail({
      from: `"Rofeeah Store" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Payment Proof Submitted — Order ${orderId}`,
      html: `
        <h3>New Payment Proof Submitted</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${order.name} (${order.email})</p>
        <img src="${req.file.path}" width="240" style="margin:12px 0;border-radius:6px;" />
        <br/>
        <a href="${confirmUrl}"
           style="display:inline-block;padding:12px 18px;
           background:#6B4226;color:#fff;border-radius:6px;
           text-decoration:none;">
           ✅ Confirm Payment
        </a>
      `,
    });

    return res.json({
      success: true,
      message: "Payment proof submitted successfully",
      order,
    });
  } catch (error) {
    console.error("PAYMENT PROOF ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
});

export default router;
