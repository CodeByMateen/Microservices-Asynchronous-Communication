import express, {type Request, type Response} from 'express';
import dotenv from 'dotenv';
import { createOrder } from './services/order.service.js';
import { processPayment } from './services/payment.service.js';
import { sendOrderConfirmation } from './services/notification.service.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import { publishOrderNotification } from './messaging/producer.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON bodies
app.use(express.json());

// A simple strongly-typed route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, TypeScript with Express!' });
});

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post("/orders", async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    const order = await createOrder(productId, quantity);

    const payment = await processPayment(order.orderId);

    // const notification = await sendOrderConfirmation(order.orderId);
    await publishOrderNotification(order.orderId);

    res.status(201).json({
      message: "Order placed successfully",
      order,
      payment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to place order",
    });
  }
});

const startServer = async () => {
  try {
    await connectRabbitMQ();

    app.listen(PORT, () => {
      console.log(
        `⚡️[server]: Server is running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
