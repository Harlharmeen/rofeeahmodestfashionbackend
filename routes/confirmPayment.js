import express from "express";
import Order from "../models/Order.js";
import nodemailer from "nodemailer";

const router = express.Router();

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

/**
 * ADMIN CONFIRM PAYMENT
 * Triggered from email button
 * GET /api/confirm-payment/:orderId
 */
router.get("/confirm-payment/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) return res.status(404).send("Order not found");

    if (order.status === "paid") return res.send("Payment already confirmed");

    order.status = "paid";
    await order.save();

    /* =========================
       CUSTOMER PAYMENT CONFIRMATION EMAIL
    ========================== */
    const whatsappLink = `https://wa.me/2349033957023?text=${encodeURIComponent(
      `Hello, I am following up on my order. Order ID: ${orderId}`
    )}`;

    await transporter.sendMail({
      from: `"Rofeeah Store" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject: `Payment Confirmed — Order ${orderId}`,
      html: `
        <h3>✅ Payment Confirmed</h3>
        <p>Dear ${order.name},</p>
        <p>Your payment for Order <strong>${orderId}</strong> has been verified.</p>
        <p>We will contact you shortly regarding delivery.</p>
        <br/>
        <a href="${whatsappLink}"
           style="display:inline-block;padding:12px 18px;
           background:#25D366;color:#fff;border-radius:6px;
           text-decoration:none;">
           💬 Contact us on WhatsApp
        </a>
      `,
    });

    res.send(`
      <div style="font-family:Arial;padding:40px;text-align:center">
        <h2>✅ Payment Confirmed</h2>
        <p>Order <strong>${orderId}</strong> has been marked as PAID.</p>
        <p>You may now proceed with delivery.</p>
      </div>
    `);
  } catch (error) {
    console.error("CONFIRM PAYMENT ERROR:", error);
    res.status(500).send("Server error");
  }
});

export default router;
