import { connectRabbitMQ } from "./rabbitmq.js";

const startWorker = async () => {
  const channel = await connectRabbitMQ();

  console.log("👂 Waiting for notification jobs...");

  channel.consume("notification_queue", async (message) => {
    if (!message) return;

    const data = JSON.parse(message.content.toString());

    console.log("📩 Notification job received:");
    console.log(data);

    console.log(`📧 Sending notification for ${data.orderId}...`);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`✅ Notification sent for ${data.orderId}`);

    channel.ack(message);
  });
};

startWorker().catch((error) => {
  console.error("❌ Worker failed:", error);
});