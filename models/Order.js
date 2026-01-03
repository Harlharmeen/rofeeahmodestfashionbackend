import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    items: [
      {
        name: String,
        price: Number,
        qty: Number,
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "awaiting_payment",
        "pending_verification",
        "paid",
      ],
      default: "awaiting_payment",
    },

    paymentProofUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
