import { connectRabbitMQ } from "./rabbitmq.js";

const startWorker = async () => {
  const channel = await connectRabbitMQ();

  console.log("📊 Analytics worker waiting for events...");

  channel.consume("analytics_queue", async (message) => {
    if (!message) return;

    try {
      const data = JSON.parse(message.content.toString());

      console.log("📊 Analytics event received:");
      console.log(data);

      console.log(
        `📈 Recording order ${data.orderId} in analytics`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      console.log(
        `✅ Analytics recorded ${data.orderId}`
      );

      channel.ack(message);
    } catch (error) {
      console.error(
        "❌ Analytics processing failed:",
        error
      );

      channel.nack(message, false, false);
    }
  });
};

startWorker().catch((error) => {
  console.error("❌ Analytics worker failed:", error);
});