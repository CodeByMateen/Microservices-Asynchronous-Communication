import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: {
      "^/": "/orders/",
    },
  })
);

app.use(
  "/api/payments",
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
    pathRewrite: {
      "^/": "/payments/",
    },
  })
);

app.get("/health", (req, res) => {
  res.json({
    service: "api-gateway",
    status: "OK",
  });
});

app.listen(PORT, () => {
  console.log(`🚪 API Gateway running on port ${PORT}`);
});