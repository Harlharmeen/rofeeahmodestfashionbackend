import express from "express";
import Order from "../models/Order.js";
const router = express.Router();

/**
 * GET single order by orderId
 */
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
