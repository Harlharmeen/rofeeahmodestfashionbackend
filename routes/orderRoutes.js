import express from "express";
import crypto from "crypto";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * CREATE ORDER
 * POST /api/orders
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, items, total } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const orderId =
      "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    const order = await Order.create({
      orderId,
      name,
      email,
      phone,
      items,
      total,
      status: "awaiting_payment",
    });

    res.json({
      success: true,
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ success: false });
  }
});

/**
 * GET SINGLE ORDER
 * GET /api/orders/:orderId
 */
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
    });

    if (!order) {
      return res.status(404).json({ success: false });
    }

    res.json(order);
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    res.status(500).json({ success: false });
  }
});

export default router;
