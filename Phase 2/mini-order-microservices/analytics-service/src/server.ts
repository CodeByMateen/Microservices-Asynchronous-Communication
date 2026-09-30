import express, { type Request, type Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Analytics Service",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    service: "analytics-service",
    status: "OK",
  });
});

app.listen(PORT, () => {
  console.log(`📊 Analytics Service running on port ${PORT}`);
});