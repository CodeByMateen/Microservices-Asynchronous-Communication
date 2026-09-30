import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import { publishOrderCreated } from "./producer.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Order Service",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    service: "order-service",
    status: "OK",
  });
});

app.post("/orders", async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    const order = {
      orderId: `ORD-${Date.now()}`,
      productId,
      quantity,
      status: "PENDING",
    };

    console.log(`🛒 Order created: ${order.orderId}`);

    // Synchronous communication
    console.log(`💳 Calling Payment Service...`);

    const paymentResponse = await axios.post(
      "http://localhost:3002/payments",
      {
        orderId: order.orderId,
      }
    );

    console.log(`✅ Payment Service responded`);

    // Asynchronous communication
    await publishOrderCreated(order.orderId);

    console.log(`📨 Notification queued`);

    res.status(201).json({
      message: "Order created successfully",
      order,
      payment: paymentResponse.data,
    });
  } catch (error) {
    console.error("❌ Order processing failed:", error);

    res.status(500).json({
      message: "Order processing failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🛒 Order Service running on port ${PORT}`);
});