import express, { type Request, type Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.post("/payments", async (req: Request, res: Response) => {
  const { orderId } = req.body;

  console.log(`💳 Processing payment for ${orderId}...`);

  // Simulate payment processing
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const payment = {
    success: true,
    orderId,
    transactionId: `TXN-${Date.now()}`,
    status: "PAID",
  };

  console.log(`✅ Payment successful for ${orderId}`);

  res.json(payment);
});

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Payment Service",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    service: "payment-service",
    status: "OK",
  });
});

app.listen(PORT, () => {
  console.log(`💳 Payment Service running on port ${PORT}`);
});